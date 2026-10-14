create table if not exists strategies (
  id              bigserial primary key,
  domain          text not null check (domain in ('pv_literature', 'pv_icsr', 'hospital_rcm')),
  target_key      text not null,
  source          text not null check (source in (
    'pubmed', 'europepmc', 'hospital_his', 'partner_e2b',
    'safety_email', 'call_transcript', 'hospital_adr_form'
  )),
  query_or_rules  jsonb not null,
  version         int not null check (version > 0),
  active          boolean not null default true,
  created_at      timestamptz not null default now(),
  unique (domain, target_key, source, version)
);

create table if not exists clinical_states (
  id                bigserial primary key,
  domain            text not null check (domain in ('pv_literature', 'pv_icsr', 'hospital_rcm')),
  dedup_key         text not null,
  title_or_header   text not null,
  normalized_state  jsonb not null,
  state_sha256      char(64) not null check (state_sha256 ~ '^[0-9a-f]{64}$'),
  first_seen_at     timestamptz not null default now(),
  unique (domain, dedup_key)
);

create table if not exists source_records (
  id            bigserial primary key,
  source        text not null check (source in (
    'pubmed', 'europepmc', 'hospital_his', 'partner_e2b',
    'safety_email', 'call_transcript', 'hospital_adr_form'
  )),
  source_uid    text not null,
  strategy_id   bigint references strategies(id),
  state_id      bigint references clinical_states(id),
  raw_payload   jsonb not null,
  fetched_at    timestamptz not null default now(),
  unique (source, source_uid)
);
create index if not exists source_records_state_idx on source_records (state_id);

create table if not exists sys1_decisions (
  id                       bigserial primary key,
  state_id                 bigint not null references clinical_states(id),
  model_id                 text not null,
  sampler_version          text not null,
  question_schema_version  int not null check (question_schema_version > 0),
  threshold_policy_version int not null check (threshold_policy_version > 0),
  state_sha256             char(64) not null check (state_sha256 ~ '^[0-9a-f]{64}$'),
  latency_ms               int not null check (latency_ms >= 0),
  answers                  jsonb not null,
  p_valid_case             numeric(5,4) check (p_valid_case between 0 and 1),
  p_serious_or_denial      numeric(5,4) check (p_serious_or_denial between 0 and 1),
  verbatim_extraction      text,
  confidence_band          text not null check (
    confidence_band in ('GREEN_CLOSE', 'GREEN_PASS', 'YELLOW_REVIEW', 'RED_ESCALATE')
  ),
  created_at               timestamptz not null default now()
);
create index if not exists sys1_decisions_queue_idx
  on sys1_decisions (confidence_band, created_at)
  where confidence_band in ('YELLOW_REVIEW', 'RED_ESCALATE');
create index if not exists sys1_decisions_state_created_idx
  on sys1_decisions (state_id, created_at desc);
create unique index if not exists sys1_decisions_versioned_state_idx
  on sys1_decisions (
    state_id, model_id, sampler_version, question_schema_version, threshold_policy_version
  );

create table if not exists sys2_syntheses (
  id               bigserial primary key,
  sys1_decision_id bigint not null references sys1_decisions(id),
  model_id         text not null,
  draft_narrative  text not null,
  cited_passages   jsonb not null,
  created_at       timestamptz not null default now()
);
create unique index if not exists sys2_syntheses_one_per_decision_idx
  on sys2_syntheses (sys1_decision_id);

create table if not exists human_labels (
  id               bigserial primary key,
  state_id         bigint not null references clinical_states(id),
  sys1_decision_id bigint not null references sys1_decisions(id),
  reviewer_id      uuid not null,
  reviewer_role    text not null check (
    reviewer_role in ('safety_physician', 'pv_associate', 'cpc_coder', 'tpa_auditor')
  ),
  action           text not null check (action in ('ACCEPT', 'CORRECT', 'ESCALATE')),
  override_patch   jsonb,
  event_verbatim   text,
  rationale_note   text,
  split            text not null default 'pool' check (split in ('gold', 'pool')),
  created_at       timestamptz not null default now()
);
create index if not exists human_labels_state_created_idx
  on human_labels (state_id, created_at desc);
create index if not exists human_labels_gold_idx
  on human_labels (state_id, sys1_decision_id)
  where split = 'gold';

create or replace function reject_ledger_mutation() returns trigger language plpgsql as $$
begin
  raise exception '% is append-only; insert a new version instead', tg_table_name;
end;
$$;

drop trigger if exists source_records_append_only on source_records;
create trigger source_records_append_only
  before update or delete on source_records
  for each row execute function reject_ledger_mutation();

drop trigger if exists sys1_decisions_append_only on sys1_decisions;
create trigger sys1_decisions_append_only
  before update or delete on sys1_decisions
  for each row execute function reject_ledger_mutation();

drop trigger if exists sys2_syntheses_append_only on sys2_syntheses;
create trigger sys2_syntheses_append_only
  before update or delete on sys2_syntheses
  for each row execute function reject_ledger_mutation();

drop trigger if exists human_labels_append_only on human_labels;
create trigger human_labels_append_only
  before update or delete on human_labels
  for each row execute function reject_ledger_mutation();