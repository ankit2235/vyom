create table if not exists gold_set_labels (
  id                bigserial primary key,
  state_id          bigint not null references clinical_states(id),
  gold_set_version  text not null,
  is_valid_case     boolean not null,
  adjudicator_id    uuid not null,
  rationale_note    text not null,
  created_at        timestamptz not null default now(),
  unique (state_id, gold_set_version)
);
create index if not exists gold_set_labels_version_idx
  on gold_set_labels (gold_set_version, state_id);

drop trigger if exists gold_set_labels_append_only on gold_set_labels;
create trigger gold_set_labels_append_only
  before update or delete on gold_set_labels
  for each row execute function reject_ledger_mutation();