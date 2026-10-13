create table search_strategies (
  id              bigserial primary key,
  molecule        text not null,
  source          text not null check (source in ('pubmed', 'europepmc')),
  query           text not null,
  version         int not null,
  active          boolean not null default true,
  created_at      timestamptz not null default now(),
  unique (molecule, source, version)
);

create table articles (
  id              bigserial primary key,
  dedup_key       text not null unique,
  doi             text,
  pmid            text,
  title           text not null,
  abstract        text,
  pub_date        date,
  first_seen_at   timestamptz not null default now()
);

create table source_records (
  id              bigserial primary key,
  source          text not null check (source in ('pubmed', 'europepmc')),
  source_uid      text not null,
  strategy_id     bigint references search_strategies(id),
  doi             text,
  title           text,
  abstract        text,
  journal         text,
  pub_date        date,
  authors         jsonb,
  raw             jsonb not null,
  fetched_at      timestamptz not null default now(),
  article_id      bigint references articles(id),
  unique (source, source_uid)
);

create table screenings (
  id              bigserial primary key,
  article_id      bigint not null references articles(id),
  pass            text not null check (pass in ('triage', 'second_look')),
  model_id        text not null,
  prompt_version  text not null,
  rule_version    text not null,
  batch_id        text,
  verdict         text not null check (verdict in ('case', 'not_case', 'unsure')),
  confidence      numeric(3,2) not null check (confidence between 0 and 1),
  payload         jsonb not null,
  created_at      timestamptz not null default now()
);
create index screenings_article_created_idx on screenings (article_id, created_at desc);
create unique index screenings_article_pass_prompt_idx
  on screenings (article_id, pass, prompt_version);

create table labels (
  id              bigserial primary key,
  article_id      bigint not null references articles(id),
  screening_id    bigint references screenings(id),
  action          text not null check (action in ('accept', 'correct', 'escalate')),
  is_valid_case   boolean,
  corrections     jsonb,
  reviewer        text not null,
  note            text,
  split           text not null default 'pool' check (split in ('gold', 'pool')),
  created_at      timestamptz not null default now()
);

create table batch_jobs (
  id              bigserial primary key,
  provider_id     text not null unique,
  pass            text not null,
  model_id        text not null,
  prompt_version  text not null,
  request_count   int not null check (request_count >= 0),
  custom_ids      text[] not null,
  attempt         int not null default 1 check (attempt >= 1),
  status          text not null check (status in ('submitted', 'ended', 'ingested', 'failed')),
  submitted_at    timestamptz not null default now(),
  ingested_at     timestamptz
);

create function reject_decision_mutation() returns trigger language plpgsql as $$
begin
  raise exception '% rows are append-only', tg_table_name;
end;
$$;

create trigger screenings_append_only
  before update or delete on screenings
  for each row execute function reject_decision_mutation();

create trigger labels_append_only
  before update or delete on labels
  for each row execute function reject_decision_mutation();