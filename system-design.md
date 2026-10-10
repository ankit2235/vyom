# Literature screening prototype — system design

**Status:** design, not built.
**Relationship to this repo:** none at runtime. The Vyom marketing site in this
repository is a static export on Vercel. This document describes a *separate*
system — a working prototype of the literature screening product — that should
live in its own private repository. The file sits here only so the two are
versioned alongside each other; move it when the prototype repo exists.

**What it is for:** proving, on real public literature, that AI screening plus a
human reviewer can hit a recall bar, and producing the weekly screening log and
recall report that a drug-safety lead will actually look at.

**What it is not:** it is not the product, it does not touch customer data, and
nothing it produces is submitted anywhere.

---

## 1. The three rules

These constrain every decision below. They are not negotiable for the prototype.

1. **Public data only, on free tiers.** No patient data, no customer data, no
   partner data. The moment real customer literature enters the picture, it
   moves to paid hosting under a contract and a DPA. Free tiers have no
   confidentiality commitment worth relying on.
2. **No MedDRA coding.** MedDRA requires a licence. Store the event **exactly as
   the article words it** (`event_verbatim`). A later licensed step can map
   verbatim → Preferred Term; doing it now would both breach the licence and bake
   an unvalidated mapping into the evidence trail.
3. **Pin the model, record it with every decision.** Model ID, prompt version and
   rule version are written on every row the system produces. Without that, none
   of the output is usable as validation evidence later, and no result is
   reproducible.

A fourth, implied by the first three: **the system never deletes a decision.**
Corrections are new rows, not edits.

---

## 2. Flow

```
                 ┌──────────────── daily, 06:00 IST ────────────────┐
                 │                                                   │
   GitHub        │  1  fetch      PubMed E-utilities                 │
   Actions       │                Europe PMC                         │
   (cron)        │       ↓                                           │
                 │  2  normalise  → source_records                   │
                 │       ↓                                           │
                 │  3  dedupe     → articles (canonical)             │
                 │       ↓                                           │
                 │  4  submit     Batch: Haiku 5.5, one request      │
                 │                per unscreened article             │
                 └───────────────────────┬───────────────────────────┘
                                         │  (batch runs async,
                                         │   minutes to hours)
                 ┌───────────────────────┴───────────────────────────┐
                 │  5  collect    poll batch → screenings            │
                 │       ↓                                           │
                 │  6  triage     confident-no  → closed             │
                 │                everything else → second look      │
                 │       ↓                                           │
                 │  7  submit     Batch: Sonnet 5.5, flagged only    │
                 │       ↓                                           │
                 │  8  rules      product match, date sanity,        │
                 │                confidence floor → deterministic   │
                 │       ↓                                           │
                 │  9  queue      → review_queue                     │
                 └───────────────────────┬───────────────────────────┘
                                         │
          Streamlit  ──────────────────► 10  human: Accept / Correct / Escalate
                                         │        ↓
                                         │   every action → labels (append-only)
                                         │
          Weekly job ─────────────────► 11  screening log + recall report
```

Steps 1–4 and 5–9 are **separate Actions runs**. A batch can take hours; a job
that blocks waiting for it burns Actions minutes for nothing. See §6.

---

## 3. Components and their limits

| Piece | Choice | Free-tier limit that actually bites |
| --- | --- | --- |
| Code + scheduler | Private GitHub repo + Actions cron | 2,000 min/month on Free for private repos. A daily run at ~5–10 min ≈ 150–300 min/month. Comfortable, but a runaway poll loop will eat it. |
| Literature | PubMed E-utilities (free NCBI key) + Europe PMC (no key) | 10 req/sec with a key, 3 without. Register `tool` and `email` with NCBI or you will get blocked. Europe PMC adds open-access full text, which PubMed does not. |
| Database | Supabase free tier (Postgres) | 500 MB, and **the project pauses after ~7 days idle**. The daily job keeps it awake; if you pause development for a fortnight, expect to un-pause by hand. |
| Screening | Claude Haiku 5.5 → Claude Sonnet 5.5, both via Batch API | Pay per use. §7. |
| Reviewer UI | Streamlit Community Cloud | 1 private app, ~1 GB memory, sleeps after 12 h idle (cold start ≈ 30 s). Fine for one reviewer; not a product. |
| Eval data | ADE Corpus V2 (23,516 labelled sentences) + 300–500 abstracts you label yourself | **ADE licence is unclear — internal testing only, never in a customer-facing claim.** Your own labelled set is the one you can actually cite. |

**Alternative single-box setup.** One Oracle Cloud Always Free machine can run
the scheduler, Postgres and the UI together. Fewer moving parts and no idle
pause; against that, you own patching and backups, and a single box is a single
point of failure. Worth it if the multi-service juggling starts costing more
time than it saves. *(Re-check the current Always Free shape before committing —
these allowances change.)*

**Avoid Hugging Face Spaces** for the reviewer UI — running apps now need a paid
plan. *(Also worth re-checking; their pricing moves.)*

---

## 4. Data model

Six tables. The split between `source_records` and `articles` is the important
part: the same paper arrives from two sources and must collapse to one unit of
work without losing where each copy came from.

```sql
-- What we asked for. Frozen per molecule; changing one starts a new version.
create table search_strategies (
  id              bigserial primary key,
  molecule        text not null,
  source          text not null check (source in ('pubmed','europepmc')),
  query           text not null,
  version         int  not null,
  active          boolean not null default true,
  created_at      timestamptz not null default now(),
  unique (molecule, source, version)
);

-- Raw hit, exactly as the source returned it. Never edited.
create table source_records (
  id              bigserial primary key,
  source          text not null,
  source_uid      text not null,          -- PMID, PMCID or Europe PMC id
  strategy_id     bigint references search_strategies(id),
  doi             text,
  title           text,
  abstract        text,
  journal         text,
  pub_date        date,
  authors         jsonb,
  raw             jsonb not null,         -- full payload, for replay
  fetched_at      timestamptz not null default now(),
  article_id      bigint references articles(id),
  unique (source, source_uid)             -- idempotent re-fetch
);

-- One row per real-world paper.
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

-- One row per (article, model pass). Append-only.
create table screenings (
  id              bigserial primary key,
  article_id      bigint not null references articles(id),
  pass            text not null check (pass in ('triage','second_look')),
  model_id        text not null,          -- e.g. 'claude-haiku-5-5'
  prompt_version  text not null,          -- e.g. 'screen/v7'
  rule_version    text not null,          -- e.g. 'rules/2026.10'
  batch_id        text,
  verdict         text not null check (verdict in ('case','not_case','unsure')),
  confidence      numeric(3,2) not null,
  payload         jsonb not null,         -- the full structured result, §5
  created_at      timestamptz not null default now()
);
create index on screenings (article_id, created_at desc);

-- What a human decided. Append-only; a correction is a new row.
create table labels (
  id              bigserial primary key,
  article_id      bigint not null references articles(id),
  screening_id    bigint references screenings(id),  -- what they were shown
  action          text not null check (action in ('accept','correct','escalate')),
  is_valid_case   boolean,                -- the ground truth after review
  corrections     jsonb,                  -- field-level diffs
  reviewer        text not null,
  note            text,
  split           text not null default 'pool'
                    check (split in ('gold','pool')),  -- §8
  created_at      timestamptz not null default now()
);

-- Batch lifecycle, so a crashed run can be resumed.
create table batch_jobs (
  id              bigserial primary key,
  provider_id     text not null unique,   -- the Anthropic batch id
  pass            text not null,
  model_id        text not null,
  prompt_version  text not null,
  request_count   int not null,
  status          text not null,          -- submitted | ended | ingested | failed
  submitted_at    timestamptz not null default now(),
  ingested_at     timestamptz
);
```

### Deduplication

Resolve in this order, first match wins:

1. **Normalised DOI** — lowercase, strip `https://doi.org/`. Most reliable.
2. **PMID** — Europe PMC returns the PMID for anything also in PubMed.
3. **Fuzzy fallback** — `slug(title) + first_author_surname + year`. Catches
   preprint/version duplicates that share no identifier.

`dedup_key` stores whichever matched, prefixed (`doi:…`, `pmid:…`, `fuzzy:…`) so
you can tell later how confident the merge was. Fuzzy merges are the ones that
will occasionally be wrong — log them and spot-check.

---

## 5. The screening contract

One schema, both passes. The second pass sees the same abstract plus the first
pass's output and is asked to disagree if warranted.

**Every positive assertion must quote the sentence it came from.** A criterion
with no quotable sentence is `present: false`. This is what makes the output
checkable by a human in seconds rather than minutes, and it is the single
highest-leverage thing in the design.

```jsonc
{
  "relevant": true,                 // about a medicinal product and a human subject
  "case_criteria": {                // the four ICH ICSR criteria
    "identifiable_patient":  { "present": true,  "evidence": "A 54-year-old woman presented with…" },
    "identifiable_reporter": { "present": true,  "evidence": "We report a case of…" },
    "suspect_drug":          { "present": true,  "evidence": "…two weeks after starting <drug>." },
    "adverse_event":         { "present": true,  "evidence": "…developed elevated liver enzymes." }
  },
  "event_verbatim": "elevated liver enzymes",   // article's wording, NOT coded — rule 2
  "drug_verbatim":  "<drug as written>",
  "special_situations": ["pregnancy", "overdose", "misuse", "off_label",
                         "lack_of_efficacy", "medication_error"],  // subset, may be empty
  "seriousness": {
    "serious": true,
    "criteria": ["hospitalisation"],   // death | life_threatening | hospitalisation |
                                       // disability | congenital_anomaly | medically_important
    "evidence": "…was hospitalised for five days."
  },
  "verdict": "case",                // case | not_case | unsure
  "confidence": 0.94,
  "uncertainty_reason": null        // required when verdict is "unsure"
}
```

### Two API details that will bite you

**1. Do not force the tool call.** The familiar "force a tool call to guarantee
JSON" trick is now a hard error: `tool_choice: {"type": "any"}` and
`{"type": "tool", ...}` return **400 on Claude Sonnet 5.5** (and on Opus 5.5 /
Fable 5.1). Use **structured outputs** instead — `output_config.format` with the
schema above — or `strict: true` on a tool plus `tool_choice: {"type": "auto"}`.
For a pure classification job, structured outputs is the simpler of the two.
(Note `output_format` at the top level is deprecated; it is
`output_config: {"format": {...}}`.)

**2. Batch results come back in any order.** Key them by `custom_id`, never by
position. Use `custom_id = f"{pass}:{prompt_version}:{article_id}"` so an
out-of-order or partial result set is still unambiguous.

```python
from anthropic import Anthropic
from anthropic.types.messages.batch_create_params import Request
from anthropic.types import MessageCreateParamsNonStreaming

client = Anthropic()

batch = client.messages.batches.create(
    requests=[
        Request(
            custom_id=f"triage:{PROMPT_VERSION}:{a.id}",
            params=MessageCreateParamsNonStreaming(
                model="claude-haiku-5-5",
                max_tokens=1024,
                system=SYSTEM_PROMPT,          # frozen per prompt_version
                output_config={"format": SCREENING_SCHEMA},
                messages=[{"role": "user", "content": render(a)}],
            ),
        )
        for a in unscreened
    ]
)
# Persist batch.id to batch_jobs immediately — before anything else can fail.
```

Collection, in the *next* scheduled run:

```python
job = client.messages.batches.retrieve(provider_id)
if job.processing_status != "ended":
    return                                    # try again next run

for result in client.messages.batches.results(provider_id):
    article_id = int(result.custom_id.rsplit(":", 1)[1])
    if result.result.type != "succeeded":
        record_failure(article_id, result.result.type)
        continue
    save_screening(article_id, result.result.message)
```

Other constraints worth knowing before you build against them: the Batch API
rejects the server-side `fallbacks` parameter, and Claude Sonnet 5.5 is not
available on Priority Tier. Neither matters for a nightly prototype.

### Triage rule between the passes

| Haiku result | Action |
| --- | --- |
| `not_case`, confidence ≥ 0.95, no special situation | Close. Logged, not queued. |
| `case` (any confidence) | Second look → queue |
| `unsure` | Second look → queue |
| Any special situation flagged | Second look → queue, regardless of verdict |
| confidence < 0.95 | Second look → queue |

The asymmetry is deliberate. Closing on a confident *no* is the only place the
system acts alone, and §8 measures exactly how often that is wrong.

---

## 6. Running it on GitHub Actions

**Two workflows, not one.**

```yaml
# .github/workflows/daily.yml   — fetch, dedupe, submit
on:
  schedule: [{ cron: "30 0 * * *" }]   # 06:00 IST
  workflow_dispatch:

# .github/workflows/collect.yml — poll, ingest, second pass, rules, queue
on:
  schedule: [{ cron: "0 */3 * * *" }]  # every 3h; exits in seconds if nothing ready
  workflow_dispatch:
```

A collect run that finds no ended batch exits immediately — a few seconds of
billed time. Do **not** poll inside the submit job: a batch that takes four hours
would burn 240 of your 2,000 monthly minutes in one night.

**Make every step idempotent.** Re-running yesterday's job must be a no-op, not a
duplicate. `source_records` has `unique (source, source_uid)`; `screenings` is
keyed by `(article_id, pass, prompt_version)` in application logic before insert.

**Secrets** go in Actions secrets: `ANTHROPIC_API_KEY`, `SUPABASE_URL`,
`SUPABASE_SERVICE_KEY`, `NCBI_API_KEY`, `NCBI_TOOL`, `NCBI_EMAIL`. Nothing in the
repo. The Supabase service key bypasses row-level security — it belongs only in
Actions, never in the Streamlit app if that app is ever shared.

**Backfill** is the same code with a date range argument, run via
`workflow_dispatch`. Build it on day one; you will want to re-screen history
every time the prompt changes.

---

## 7. Cost

Worked from current list prices, Batch API at 50%. **These are estimates built on
stated assumptions, not measurements** — re-run them against real token counts
after the first week.

Assumptions: ~4,300 abstracts/month at 50 molecules; ~1,200 input tokens per
triage request (system prompt + title + abstract); ~400 output tokens (the schema
above, with quoted evidence); 10% escalated to the second pass at ~1,500 in /
~600 out.

| Pass | Model | $/MTok in | $/MTok out | Volume | Standard | Batch (−50%) |
| --- | --- | --- | --- | --- | --- | --- |
| Triage | `claude-haiku-5-5` | $0.10 | $0.50 | 4,300 | $1.38 | **$0.69** |
| Second look | `claude-sonnet-5-5` | $2.00 | $10.00 | 430 | $3.87 | **$1.94** |
| | | | | **Total** | **$5.25** | **≈ $2.63** |

So roughly **$2.50–3/month at 50 molecules** (₹220–270), and **~$10–11/month at
200 molecules** — the second pass dominates, so the triage threshold is also the
main cost lever. Tightening it to 0.90 roughly halves the Sonnet volume; §8 tells
you whether you can afford to.

Two things that move this materially:

- **Output tokens are the driver, not input.** Quoted evidence makes responses
  long. If cost becomes a problem, shorten the evidence spans before you touch
  the model choice.
- **Haiku 5.5 list price above applies to prompts up to 100K tokens.** Abstracts
  are nowhere near that; full-text screening would be, so re-cost before adding it.

---

## 8. Evaluation — the part that makes this worth building

Everything above is plumbing. This is the deliverable.

### Recall first, and say so

In pharmacovigilance the two errors are not symmetric. A false positive costs a
reviewer thirty seconds. A **false negative is a missed ICSR** — a reportable
case that never got reported. Tune for recall, report precision honestly as the
cost of it, and never present a single "accuracy" number.

### Keep two sets apart

- **Gold set** — 300–500 abstracts you label by hand, frozen. `split = 'gold'`.
  Never looked at while tuning a prompt. Scored only on a release candidate.
- **Pool** — every reviewer correction from daily use. `split = 'pool'`. This is
  what you iterate against.

Mixing them is the easiest way to produce a recall number that is quietly
meaningless. The gold set is the one you would show a customer; it only stays
honest if you genuinely do not optimise against it.

ADE Corpus V2 is useful for smoke-testing the extraction shape, **not** for any
reported figure — the licence is unclear and the unit (sentences) does not match
ours (abstracts).

### What the report says

Per run, per prompt version, per model:

- **Recall** with a 95% confidence interval. At n=400 and 90% recall the interval
  is roughly ±3 points — quote it, because the point estimate alone invites
  over-reading a change that is noise.
- **Precision**, and the reviewer-minutes implied by the false positives.
- **Every single miss, listed.** Article, what the model said, what the reviewer
  said. A recall number with no miss list is not evidence.
- **Abstain rate** — how often it said `unsure`. A model that hits recall by
  flagging everything is not working.

### Re-run on every change

Any change to prompt, model ID, schema or rules bumps a version and re-runs the
gold set before it ships. This is both an engineering gate and the thing that
becomes validation evidence later. It is why rule 3 exists.

---

## 9. The reviewer screen

Streamlit, one page, keyboard-first. The reviewer's time is the scarce resource.

- **Queue** ordered by: escalations, then serious, then oldest.
- **Evidence highlighted in the abstract** — the quoted span for each criterion,
  so the reviewer confirms by looking rather than reading.
- **Three actions**: Accept · Correct · Escalate.
  - *Accept* → one `labels` row, `is_valid_case` = the model's verdict.
  - *Correct* → inline field edit; `corrections` holds the diff.
  - *Escalate* → flagged for discussion, no ground truth asserted.
- **Every action writes a label.** That is the entire training and evaluation
  flywheel: use it, and the eval set grows.
- **Show the model and prompt version** on screen. When something looks wrong,
  the first question is always "which version produced this".

Target: under 30 seconds per abstract. If it is slower, the evidence
highlighting is not doing its job.

---

## 10. Build order

Eight weekends. Each milestone has an acceptance test — if it does not pass,
do not move on.

| # | Milestone | Done when |
| --- | --- | --- |
| 1 | **Fetcher + schema** — 30–50 generic molecules, daily pull, dedupe | Two consecutive runs produce zero duplicate `articles`; re-running a day is a no-op |
| 2 | **Triage pass** — Haiku, structured output, batch submit/collect | 500 abstracts screened end-to-end with no manual step; every row carries model + prompt version |
| 3 | **Second look + rules** — Sonnet on flagged, deterministic checks | Triage→second-look→queue runs unattended for a week |
| 4 | **Reviewer screen** — queue, highlights, three actions | You personally review 200 abstracts and it takes under 30 s each |
| 5 | **Gold set** — 300–500 hand-labelled, frozen | Labelled, split marked, stored, and *not* used for tuning |
| 6 | **Evaluation harness** — recall/precision + miss list, re-runnable | One command prints the table and every miss for a given version |
| 7 | **Weekly outputs** — screening log + one-page recall report | A week's log and report generate with no hand editing |
| 8 | **Hardening** — backfill, failure alerts, cost tracking | A deliberately failed batch recovers on the next run without data loss |

Milestones 5 and 6 are the ones to protect. It is tempting to skip straight from
a working pipeline to a demo; without the gold set and the miss list you have a
demo that cannot answer the only question a drug-safety lead will ask.

---

## 11. Failure modes

| What breaks | Symptom | Response |
| --- | --- | --- |
| NCBI rate limit / block | 429s, then silence | Honour 10 req/s, set `tool` + `email`, exponential backoff. Blocks are per-tool-name. |
| Supabase paused | Connection refused after a quiet week | Daily job normally prevents it; un-pause in console, re-run |
| Batch never ends | `collect` polls forever | Age out at 24 h → mark `failed`, re-submit as a fresh batch |
| Partial batch results | Some `custom_id`s missing | Expected. Reconcile against `request_count`; re-submit only the missing ids |
| Schema drift | Structured output rejected or parse fails | Bump `prompt_version`, re-run gold set before shipping. Never hot-fix a prompt in place |
| Actions minutes exhausted | Jobs queue and never run | Alert at 70%. Usual cause is a poll loop inside the submit job |
| Reviewer disagrees with themselves | Same article labelled both ways | Expected and useful. Measure it — it is the ceiling on achievable recall |

That last one is worth dwelling on. Inter-rater disagreement on borderline
abstracts is real and well documented in screening work generally. Measure your
own self-consistency on a re-shown sample early; if you disagree with yourself
8% of the time, a model at 92% recall is at the noise floor, and chasing 97% is
chasing an artefact.

---

## 12. What this deliberately leaves out

So nobody expects it: no MedDRA or WHODrug coding, no E2B(R3) output, no
customer data, no multi-user auth, no full-text screening beyond Europe PMC open
access, no signal detection, no SLA. Each of those is a product decision that
needs a licence, a contract or paid hosting — not a weekend.

---

## Appendix — open questions

- **ADE Corpus V2 licence.** Flagged as unclear. Resolve before it appears in
  anything external; until then, internal smoke tests only.
- **Oracle Always Free shape** and **Hugging Face Spaces pricing** both change;
  re-check before relying on either.
- **Batch API rate limits** are not fixed in this document on purpose — check the
  current limits in the Anthropic console and handle 429 with backoff rather than
  hardcoding a number that will go stale.
- **Which 50 molecules.** Should be generics with real Indian manufacturing
  exposure, so the output is recognisable to the first people you show it to.
