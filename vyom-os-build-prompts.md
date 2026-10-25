# Vyom OS — milestone build prompts (v2)

**Audience:** the Vyom engineering team (and the coding agents they drive).
**Purpose:** take `vyom-os` + `vyom-web` from today's working v2 foundation to a
production pharmacovigilance platform, one paying customer at a time.

Each phase below is a **self-contained prompt**. Copy one phase into a ticket or
an agent session; it carries its own context, acceptance criteria and
out-of-scope list. Phases are grouped into four **milestones**. Each milestone
ends at a **gate**: an engineering result plus a business result. Do not start
the next milestone until its gate is passed.

---

## What changed from v1

- **Re-ordered around the first paid pilot.** The eight phases are regrouped into
  four milestones: A (literature pilot), B (production literature + Audit),
  C (Cases), D (on demand).
- **Pulled forward:** the benchmark runner (was Phase 8), the recall gate in CI
  (was Phase 5), cost telemetry (was Phase 7), product-page accuracy (was Phase 8).
- **Added:** literature completeness (A2), Audit mode (B2), an auto-close policy,
  a synthetic-data rule, AI context-of-use records, ISO 27001 and DPDP evidence.
- **Deferred:** enterprise SSO, OCR and email intake, gateway submission to
  regulators, Temporal, signal detection, self-serve onboarding.
- **Resized:** the load test now targets 10x real pilot volume, not 50,000/day.

---

## Read this before Milestone A

### What the benchmark actually is

The brief was "exactly like graphsafety.ai". Here is what that company actually
ships today, taken from their own site on 2026-10-26:

| Module | Their stated status | What it does |
| --- | --- | --- |
| `/intake` | **Available** | Ingest, classify and route safety cases from multiple sources |
| `/nucleus` | **Available** | Structure, validate and connect case evidence into submission-ready cases |
| `/report` | Planned — Aug '26 | E2B(R3) generation, multi-region alignment, gateway submission with ACK |
| `/signal` | Planned — Nov '26 | Cross-case aggregation, pattern detection |
| `/assure` | Planned — Jan '27 | Continuous validation during processing |
| `/comply` | Planned — Jan '27 | Audit trails, regulatory clock, global compliance logic |

They describe themselves as "the first AI-native operating system for patient
safety", built on a unified knowledge graph with expert-in-the-loop review, on
Google Vertex AI and Kubernetes. They raised a $3M seed and a $13.3M Series A
led by Insight Partners with Bessemer participating. Target customers: global
biopharma, mid-size pharma, CROs and patient-support-programme providers.

**Three things follow from that table, and they should change how you plan.**

1. **Four of six modules are unreleased.** "Exactly like graphsafety.ai" *today*
   means intake plus case structuring. The other four are their roadmap. Build
   to a roadmap and you are building to marketing, with none of the customer
   feedback that shaped it. Treat report, signal, assure and comply as
   *capability targets we have independently decided we need*, not as a feature
   list to clone.

2. **Their headline results are unattributed vendor claims.** "90% reduction in
   effort", "92% faster processing", "66% cost savings" appear on their homepage
   with no named customer and no methodology. Do not put them in a Vyom spec, a
   Vyom deck, or a Vyom acceptance criterion. Our own rule — every number is a
   sourced fact, a labelled target, or sample data — applies to competitor
   figures too. If we want numbers like those, we measure our own and publish
   the method.

3. **We do not win on breadth.** They have roughly $16M to build every module at
   once. We win a narrow wedge first: literature screening for Indian generics
   exporters, proven on each customer's own history, then vendor-neutral Audit.
   Breadth comes after revenue.

**Naming rule.** `CLAUDE.md` rule 4 — never name a competitor — governs **site
copy**. This is an internal engineering document, so naming them here is fine.
Nothing from this file goes into `src/content/`, a deck, or anything a customer
sees.

### Where we actually are

`vyom-os` v2 already has, working and tested:

- System One routing with domain-based client selection (hosted for
  `pv_literature`, local for `pv_icsr` and `hospital_rcm`)
- An append-only decision ledger (`002_system_one_decision_ledger.sql`)
- Public-literature sweep over PubMed + Europe PMC with dedup
- Selective System Two drafting on Yellow/Red only
- Reviewer queue and action APIs
- Gold-set evaluation and a training export path
- 8 endpoints: `/healthz`, `/v1/rcm/preflight`, `/v1/icsr/intake`,
  `/v1/literature/sweep`, `/v1/review/queue`,
  `/v1/review/states/{id}/actions`, `/v1/reports/gold/{version}`,
  `/v1/reports/screening-log`

`vyom-os/README.md` is explicit about what is **not** built: OCR/PDF extraction,
a browser workbench, FHIR NHCX and E2B(R3) serializers, automated scheduling,
enterprise identity, production authorization.

`vyom-web` has the marketing site, a login route, `/{tenant_slug}` app shell and
`/ops`, with middleware as the edge gateway.

### Decisions needed before Milestone A

1. **`hospital_rcm`.** Hospital claims (NHCX, TPAs) is a different business: a
   different buyer, different regulation and much more patient data.
   Recommendation: move it to a separate service and repo, or drop it. Until
   decided, it is **frozen**: no new work, and it keeps local-only routing.
2. **Reviewer throughput unit.** The BRD assumes one reviewer clears 500+
   pre-scored items a day. That may hold for literature abstracts. For case
   reports, industry productivity runs at roughly 300–2,000 cases per person per
   *year* at scale (Deloitte, 2019). Re-check the unit economics per item type;
   A3 and C2 measure the real number.
3. **Hosted processing of patient data.** Default is local-only. A tenant may
   allow hosted processing only by contract (see ground rule 1). Decide what we
   offer before the first Cases conversation.

### Capability map

| Target capability | Vyom equivalent | Status today | Milestone |
| --- | --- | --- | --- |
| Literature screening | Sweep + System One/Two + review APIs | Working for PubMed and Europe PMC | A2, A3 complete it |
| Benchmark on a prospect's data | Gold-set evaluation | Batch evaluation on our labels only | A4 |
| Multi-tenancy | `x-tenant-id` in middleware | Header only, no isolation | A1 |
| Reviewer console | `/v1/review/*` API only | API only, no UI | A3 (literature), C2 (cases) |
| Compliance evidence | Decision ledger | Ledger exists; no inspection pack | B1 |
| Vendor-neutral audit | — | Not built | B2 |
| Multi-source intake | `/v1/icsr/intake` + sweep | Partial: no OCR, email or E2B-in | B2 (E2B-in), C1 |
| Regulatory output | — | Not built | C3 (export), D1 (gateway) |
| Regulatory clock | — | Not built | C4 |
| Signal detection | — | Not built | D2 |

---

## Ground rules — these apply to every phase

Paste this block with any phase prompt you hand to an agent.

```
NON-NEGOTIABLE CONSTRAINTS

1. PATIENT DATA ISOLATION. Public literature (pv_literature) may use the hosted
   System One client. pv_icsr routes to the local endpoint by default. Hosted
   processing of identifiable patient data is allowed only where the tenant's
   contract explicitly permits it (zero-retention terms, a data-processing
   agreement, a pinned region), recorded as a versioned tenant policy. If a code
   path could send patient data to a hosted endpoint without that policy, it is
   a bug even if no patient data has flowed through it yet. hospital_rcm is
   frozen and stays local-only.

2. APPEND-ONLY LEDGER. Never UPDATE or DELETE a decision or a human label.
   Corrections insert a new row. Any migration that mutates historical
   decisions is rejected.

3. MODEL PINNING. Every decision row records model_id, sampler_version,
   state_sha256, question_schema_version and threshold_policy_version. A
   decision you cannot reproduce is not evidence.

4. MedDRA LICENCE BOUNDARY. Store event_verbatim with character offsets into
   the source. Without a tenant MedDRA licence, Choice routes only to public
   top-level SOCs. Licensed dictionary access activates per tenant, never
   globally.

5. SYSTEM ONE PROPOSES, CODE ROUTES, SYSTEM TWO DRAFTS, EXPERTS DECIDE.
   No model writes to the database or submits to a regulator directly.
   Deterministic Python/SQL owns every threshold and every routing decision.

6. AUTO-CLOSE IS OFF BY DEFAULT. No item is closed by System One alone unless
   the tenant has enabled auto-close for that item type. Enabling it requires
   measured recall at or above the tenant's agreed threshold on adjudicated
   samples, signed off by the tenant's QPPV and recorded as a decision. Even
   then, a random sample of auto-closed items (default 10%) goes to a human.
   Any error routes to a human, never to auto-close.

7. NUMBERS. Every figure in any artefact is a sourced fact (with source), a
   labelled target, or sample data (with a SAMPLE DATA marker). Fictional
   identifiers only in samples: VY-201, VY-305, VY-412, VY-CASE-xxxx,
   Vendor A (FICTIONAL), demo-hospital, demo-tpa.

8. SYNTHETIC DATA ONLY in tests, fixtures, demos, screenshots and logs. No real
   patient data and no customer data ever enters the repo. Logs never contain
   patient data or full article text.

9. CONTEXT OF USE. Every System One question has a versioned context-of-use
   record (purpose, risk if wrong, how it is evaluated, owner), stored beside
   its question_schema_version. A question without one does not ship.

10. COST TELEMETRY. Every model call and OCR page records tenant, item, model
    id, tokens or pages, and an estimated cost. We price per item; we must
    measure per item.

11. TESTS. Every phase ships tests. vyom-os: pytest. vyom-web: npm run check
    must pass with zero errors. No phase is done with a failing or skipped test.

12. ASK BEFORE ADDING A DEPENDENCY.
```

---

# Milestone A — Literature pilot (public data)

**Goal:** run a paid literature-screening pilot for an Indian generics exporter,
and win it with a benchmark on the prospect's own history.

**Order:** A0 → A1, then A2 and A3 in parallel, then A4. A5 runs alongside A3/A4.

**Rough size (estimate):** 6–10 weeks for two engineers on top of v2; longer
part-time.

**Gate A:** all A-phase acceptance criteria pass, **and** two paid pilots are
signed, **and** benchmark recall is at or above the agreed target on at least two
prospects' data, adjudicated by a qualified safety physician.

---

## A0 — Harden what exists

**Why first:** everything below compounds on the v2 foundation. This phase adds
no features.

```
CONTEXT
vyom-os v2 has System One routing, an append-only decision ledger, a public
literature sweep, selective System Two drafting, reviewer APIs and gold-set
evaluation. It has never run continuously against real volume.

BUILD
1. Load test the sweep at 10x pilot volume. Pilot assumption: about 1,000
   records/day per tenant (a 200-molecule exporter reads roughly 300-900 a
   day; estimate). Test at 10,000/day and record p50/p95/p99 latency for the
   System One call, the dedup query and the ledger insert. Run 50,000/day once
   as a stretch measurement; do not gate on it. Publish the numbers in
   vyom-os/docs/baseline-performance.md as measurements, with the hardware and
   date they were taken on.
2. Structured logging (JSON, one event per decision) with correlation ids that
   survive the whole pipeline: ingest -> sys1 -> route -> sys2 -> queue. No
   patient data or full article text in logs.
3. /healthz depth: database reachable, both System One endpoints reachable,
   last successful sweep timestamp, queue depth. Return 503 when any is unmet.
4. Fail-closed on System One errors. A timeout or 5xx must route the state to
   the human queue, never auto-close it. Add a test that proves a sys1 failure
   cannot produce a GREEN auto-close.
5. Idempotency: re-running a sweep for the same day must not create duplicate
   clinical_states or duplicate decisions. Add a test.
6. Cost telemetry per ground rule 10. Expose cost per screened record, per
   tenant, per week.
7. Recall gate in CI: run the frozen gold set on every prompt, model or
   threshold change. Recall below the last released value fails the build;
   precision changes are reported. Never tune against the gold set.
8. Fix any test that is currently skipped or flaky. Document why any remaining
   skip exists.

ACCEPTANCE
- 10,000-record day completes without manual intervention; numbers published.
- A forced System One outage routes everything to the queue; test proves it.
- Re-running a day is a no-op; test proves it.
- Cost per screened record is computed for a test run; test.
- A deliberate recall regression fails CI; test.
- pytest green, no skips without a written reason.

OUT OF SCOPE
New endpoints, UI, OCR, serializers.
```

---

## A1 — Tenancy and roles

**Why now:** every later phase writes tenant-scoped data. Isolation is cheap now
and very expensive to retrofit. Enterprise SSO is deferred to B4.

```
CONTEXT
vyom-web middleware already requires auth and an x-tenant-id header on tenant
routes. vyom-os has no tenant model: data is global. Pharma customers will ask,
in the first security review, how their data is separated from another
customer's.

BUILD
1. Postgres: add tenant_id (uuid, not null) to every data table. Backfill
   existing rows to a single bootstrap tenant. Add row-level security policies
   so a connection scoped to a tenant physically cannot read another's rows.
   Service-role connections that bypass RLS are allowed only in migration and
   batch jobs, never in the request path.
2. Tenants table: slug, display name, data residency region, MedDRA licence
   status, System One routing policy (which domains may use the hosted client),
   auto-close policy per item type, feature flags.
3. FastAPI: resolve tenant from a validated JWT claim, not from a
   client-supplied header. x-tenant-id may be used for routing but must be
   cross-checked against the token; a mismatch is a 403.
4. Replace API_BEARER_TOKEN and REVIEWER_TOKENS_JSON with local accounts:
   hashed passwords, MFA, one account per person, no shared logins. Roles:
   reviewer, safety_physician, qppv, admin, ops.
5. Authorization as a policy table, not if-statements scattered through
   handlers. A safety_physician may approve; a reviewer may correct and
   escalate but not approve a serious case; only a qppv may enable auto-close.
6. vyom-web: wire the real session into (platform)/[tenant_slug] and
   (internal)/ops. /ops is internal-only and must 404 — not 403 — for tenant
   users.

ACCEPTANCE
- A test proves tenant A's connection returns zero rows from tenant B's data,
  at the database level, with RLS on.
- A forged x-tenant-id with a valid token for another tenant returns 403; test.
- Role matrix test: every (role, action) pair asserted, allow and deny.
- No shared credentials anywhere; every action attributable to one person.
- npm run check passes; pytest green.

OUT OF SCOPE
OIDC/SSO (B4), SCIM, billing.
```

---

## A2 — Literature completeness

**Why:** a paying literature customer needs their own search strategies, a
weekly schedule they can show an inspector, sources beyond PubMed, and evidence
of what was screened, when, and by which version.

```
CONTEXT
vyom-os sweeps PubMed and Europe PMC with dedup, scores records with System
One, drafts Yellow/Red with System Two and exposes a screening-log endpoint.
Strategies, scheduling, other sources and awareness dates do not exist yet.

BUILD
1. Search strategies as versioned data, per tenant and molecule: substance
   name, synonyms, salts, brand names, and the query per source. Every
   retrieved record stores the strategy version that found it. Strategy changes
   are append-only and attributable.
2. Scheduler: weekly runs per tenant on a configurable day, with catch-up for
   missed runs and idempotent re-runs (A0 rule). A missed run raises an alert.
   Use a Postgres-backed job queue (SELECT ... FOR UPDATE SKIP LOCKED); no new
   orchestration dependency.
3. Sources:
   - PubMed and Europe PMC (existing).
   - Embase through the tenant's own licence and credentials, behind a tenant
     flag. Never shared across tenants; never used without a licence.
   - Local journals that PubMed does not index: per-tenant upload of digital
     PDFs or issue files, parsed into records with page and character offsets.
     Scanned issues wait for OCR in C1; until then they are logged as
     "manual review".
4. Full text: open-access full text from Europe PMC; anything else only when
   the tenant supplies it under its own licence. Never fetch from publisher
   sites.
5. Cross-source dedup: PMID, then DOI, then title + first author + journal +
   year (fuzzy). Log which key matched.
6. Special situations as System One questions: pregnancy and breastfeeding,
   paediatric or elderly use, overdose, abuse, misuse, off-label use,
   medication error, occupational exposure, lack of efficacy.
7. EMA literature monitoring: keep EMA's published substance and journal lists
   as versioned reference data. Flag records that fall under them so the
   customer's process can avoid duplicate EU submissions. Flag only; never
   auto-decide.
8. Awareness date: record when a record meeting the four minimum criteria
   (identifiable patient, reporter, suspect drug, event) was first seen by a
   screener. The rule used is configurable per region and tenant, and the rule
   version is stored with the date.
9. Weekly deliverables: a screening log per run (retrieved, unique, screened,
   flagged, confirmed, by strategy and model version) and a case-ready draft
   per confirmed case, with every field linked to its source span.

ACCEPTANCE
- Two tenants with different strategies for the same molecule produce
  separately versioned results; test.
- A missed weekly run alerts and catches up without duplicates; test.
- Embase cannot run for a tenant without a licence flag; test.
- An uploaded digital PDF issue produces records whose fields resolve to page
  offsets; test.
- The screening log for any run reconstructs exactly which records were seen,
  by which strategy and model versions; test.

OUT OF SCOPE
OCR of scanned issues (C1), MedDRA coding (C3), the regulatory clock engine
(C4).
```

---

## A3 — Literature reviewer console

**Target capability:** expert-in-the-loop, made real for literature. The unit
economics rest on how fast a reviewer clears pre-scored items; this UI decides
that number.

```
CONTEXT
vyom-os exposes /v1/review/queue and /v1/review/states/{id}/actions. There is
no UI. vyom-web has (platform)/[tenant_slug]/console as a shell. DESIGN.md
governs the look; read it before writing any component.

BUILD
1. Split-screen console at /{tenant_slug}/console: the abstract or full text on
   the left with evidence spans highlighted (character offsets; page and region
   for PDFs); System One output on the right as typed flags with calibrated
   probabilities, including special situations.
2. Keyboard-first. J/K to move, A to approve, C to correct, E to escalate,
   ? for help. No action requires the mouse. Focus states visible throughout.
3. Correction UI: inline field edit that writes a new labels row with a
   field-level diff. Never mutates the original decision.
4. Show model_id, sampler_version and question_schema_version on screen for the
   decision being reviewed.
5. Queue ordering in SQL, not the client: escalations, then likely valid cases,
   then special situations, then oldest.
6. Reviewer locking: two reviewers must not be handed the same state. Use
   SELECT ... FOR UPDATE SKIP LOCKED with a lease timeout.
7. Sample-check queue: when a tenant has auto-close enabled, the random sample
   of auto-closed items (ground rule 6) appears here, marked as a sample check.
8. Instrument time-to-decision per item and publish it on /ops by item type.

ACCEPTANCE
- A reviewer clears 50 sample items using only the keyboard.
- Median time-to-decision measured and displayed. Report the real number
  whatever it is; do not target one.
- Two browser sessions never receive the same state; test.
- Every action produces exactly one append-only labels row; test.
- Matches DESIGN.md at 1440px; no horizontal scroll at 375/768px.
- npm run check passes.

OUT OF SCOPE
Case-report PDFs with bounding boxes and serious-case approval (C2), bulk
actions, saved views.
```

---

## A4 — Benchmark runner

**Why now:** the free retrospective benchmark is the wedge that wins the first
pilots. It runs as an operator tool first; self-serve comes in D3.

```
CONTEXT
Today the gold-set evaluation runs over our own labels. A prospect needs to see
recall and precision on their own past decisions: re-screen one period of their
literature and show what their process caught and missed.

BUILD
1. Input: the prospect's historical screening log for a period (record
   identifiers such as PMID or DOI, screening date, their decision, whether a
   case was raised) and their search strategy for that period. Loaded into a
   dedicated benchmark tenant.
2. Re-run the same window with their strategy, screen with pinned versions, and
   compare decision by decision.
3. Disagreements go to adjudication by a qualified safety physician.
   Adjudication is a labelled, attributable decision in the ledger.
4. Possible missed case: when adjudication confirms that a record Vyom flagged
   was a valid case the prospect's process did not raise, report it to the
   prospect's designated contact promptly, with evidence, because it may carry
   a reporting obligation. Record the notification.
5. Report: recall and precision against adjudicated truth, every disagreement
   with its evidence, reviewer time per record, and a method section (period,
   strategy, model versions, adjudicator role).
6. Retention: benchmark data is deleted on the agreed date by one command; the
   deletion is logged.
7. CLI first, for example `vyom benchmark run --tenant <slug> --period <range>`.
   No UI in this milestone.

ACCEPTANCE
- A benchmark on a public-data sample with planted misses reports recall and
  precision correctly; show the arithmetic in the test.
- Benchmark tenant data is invisible to every other tenant (extend the A1 RLS
  test).
- A confirmed possible missed case creates a notification record; test.
- Deletion removes the tenant's data and leaves a deletion record; test.

OUT OF SCOPE
Self-serve upload (D3), pricing, contracts.
```

---

## A5 — Pilot-grade operations

**Why:** a pilot runs on real schedules for a real customer. It needs backups,
secrets and alerts, not the full production stack (that is B3).

```
CONTEXT
vyom-os has a Dockerfile and docker-compose. There is no deployed environment,
no backup and no alerting.

BUILD
1. Deploy vyom-os workers and a managed Postgres in an Indian region. Daily
   backups, plus point-in-time recovery where the provider offers it.
2. Rehearse one restore into a clean environment; time it; document it.
3. Secrets in a managed store. Nothing in .env in deployed environments,
   nothing in the repo; rotate anything ever pasted into a chat or a ticket.
   Secret scanner in CI.
4. Alerts that reach a named person: failed or missed sweep, queue depth over
   threshold, a System One endpoint down.
5. vyom-web: product pages match what is live. Literature shows its real
   status; everything else says roadmap or design partners. Audit every claim
   on the site against shipped capability.

ACCEPTANCE
- A restore from backup into a clean environment, timed and documented.
- A forced sweep failure raises an alert; test or rehearsal recorded.
- No secret in the repo; scanner in CI.
- Every product-page claim maps to a shipped capability or is labelled
  roadmap; audit recorded.

OUT OF SCOPE
SLO dashboards, DR beyond a rehearsed restore, multi-region (B3).
```

---

# Milestone B — Production literature + Audit

**Goal:** turn pilots into a production contract, and ship the second product.

**Rough size (estimate):** 2–3 months.

**Gate B:** all B-phase acceptance criteria pass, **and** the first production
contract is signed, **and** the customer's QA accepts the validation pack, **and**
an ISO 27001 certification audit is booked.

---

## B1 — Compliance evidence

**Target capability:** the comply equivalent for what we already run. This is
what a QPPV and an inspector ask about.

```
CONTEXT
We have an append-only ledger, a recall gate in CI (A0) and literature runs
with versioned strategies (A2). We have no inspection pack, no release
validation pack and no Part 11 alignment record.

BUILD
1. Inspection evidence pack: given a case id, a run or a date range, produce a
   bundle with every decision, every model and prompt version, every human
   action with actor and timestamp, the strategy versions and the source
   documents. One command, reproducible.
2. 21 CFR Part 11 alignment: unique attributable identities (A1), signature
   meaning recorded on approvals, time source documented, record retention
   policy enforced in code.
3. Release validation pack: model and prompt changes ship on a fixed schedule
   (for example quarterly) with locked versions. Each release produces test
   results on the frozen gold set, a change log and a risk assessment, so a
   customer's QA can approve it in days.
4. Validation documentation (IQ/OQ/PQ) generated from the test suite rather
   than written by hand, so it cannot drift from the system.
5. Auto-close enablement workflow: a qppv reviews measured recall on
   adjudicated samples and enables auto-close for an item type; the approval is
   a ledger decision with signature meaning.
6. A CI check that every System One question has a context-of-use record
   (ground rule 9).

ACCEPTANCE
- The inspection pack for any case reconstructs the full decision history,
  including model and strategy versions; test.
- A release produces its validation pack automatically; test.
- Auto-close cannot be enabled without a recorded qppv approval; test.
- A System One question without a context-of-use record fails CI; test.

OUT OF SCOPE
Formal computer-system-validation sign-off (a QA activity), SOP writing.
```

---

## B2 — Audit mode

**Target capability:** Vyom Audit — checks on 100% of a customer's processed
cases, whoever processed them. It needs no submission capability: customers
export cases from their existing safety database as E2B(R3) files, and we check
them.

```
CONTEXT
Nothing reads a customer's existing case data today. Audit reuses the ledger,
tenancy, evidence pack and console primitives already built.

BUILD
1. E2B(R3) inbound parser into clinical_states, validated against the official
   schema. A file that fails validation is quarantined with a readable error,
   not silently dropped.
2. Rules engine, with rules as versioned data per tenant: coding vs narrative
   consistency, seriousness vs outcome, missing mandatory fields, duplicates,
   date logic, late submission against the receipt date in the file. Each
   finding records rule id and version, evidence and severity.
3. System One questions only where rules cannot decide (for example, a
   narrative mentions an event that is not coded). Proposals are reviewed like
   any other.
4. Vendor scorecard per period: findings by type and rate, trend, top findings.
   Corrective-action export as CSV.
5. An evidence pack per audit run (B1 machinery).
6. MedDRA: Vyom holds its own subscription before Audit ships, and licence
   terms are checked for processing customers' coded data. Without the right
   licence, checks that need dictionary look-ups are skipped and marked.

ACCEPTANCE
- A malformed E2B file quarantines with a readable error; test.
- On a synthetic set of 500 cases with seeded defects, each rule's detection is
  reported (found and missed); results published as measurements.
- A scorecard is reproducible from the ledger for any past run; test.
- Licence boundary test: a tenant without MedDRA cannot get dictionary-based
  checks.

OUT OF SCOPE
Fixing cases in the customer's system, submission to regulators.
```

---

## B3 — Production operations

```
CONTEXT
A5 gave us a deployed environment, backups, secrets and alerts. A production
contract needs service levels, recovery, residency and security evidence.

BUILD
1. Data residency enforced per tenant, including which region the local System
   One worker runs in. This is a contractual commitment for Indian pharma, not
   a preference.
2. SLOs with alerting: intake availability, sweep completion, queue depth,
   time-to-decision. Page on breach.
3. Disaster recovery: documented recovery time and point objectives; a full
   restore rehearsed and timed each quarter.
4. Per-tenant, per-item cost visible in /ops (from A0 telemetry).
5. ISO 27001 control evidence collected from the system where possible (access
   reviews, change logs, backup tests, vulnerability scans).
6. DPDP processor duties: retention limits, tenant data deletion on request,
   a breach-notification procedure, and a record of processing per tenant.

ACCEPTANCE
- SLO dashboard live; a deliberate breach pages someone.
- A quarterly restore rehearsal is recorded and timed.
- Tenant data deletion completes and is logged; test.
- Per-tenant per-item cost visible in /ops.

OUT OF SCOPE
Multi-region active-active.
```

---

## B4 — Enterprise identity (when a customer requires it)

```
CONTEXT
A1 uses local accounts with MFA. Larger customers will require sign-in through
their own identity provider.

BUILD
1. OIDC against the tenant's identity provider where configured; local accounts
   remain for tenants without one.
2. Map identity-provider groups to Vyom roles; the policy table from A1 is
   unchanged.
3. Session and token lifetimes configurable per tenant.

ACCEPTANCE
- Sign-in through a test identity provider works end to end; test.
- The A1 role-matrix test passes unchanged for OIDC users.

OUT OF SCOPE
SCIM provisioning, SSO admin UI.
```

---

# Milestone C — Cases

**Goal:** process adverse-event cases for a paying Cases customer.

**Rough size (estimate):** 4–6 months.

**Gate C:** all C-phase acceptance criteria pass, **and** the first Cases
customer is live, **and** hosted-vs-local processing of patient data is written
into that customer's contract.

---

## C1 — Multi-source intake

**Target capability:** the intake equivalent. This decides whether we can take a
customer's real case traffic.

```
CONTEXT
Today vyom-os ingests literature, a structured /v1/icsr/intake endpoint and
(from B2) E2B(R3) files. Real case intake also arrives as PDFs (scanned and
digital), email with attachments, call-centre transcripts, CIOMS forms and web
forms.

BUILD
1. Synthetic test corpus first: 200 realistic, fictional documents (scanned
   PDF, digital PDF, email, E2B XML, call-centre notes) with known answers. No
   real patient data (ground rule 8).
2. OCR/PDF extraction service. Digital-text PDFs parse directly; scanned ones go
   through OCR. Preserve character offsets back to page and bounding box. Store
   the original immutably; never overwrite it with the extracted text. OCR runs
   in the patient-data path for pv_icsr per ground rule 1.
3. Email intake: a per-tenant mailbox, attachment extraction, thread dedup.
   Record the sender and received-at time; they feed the regulatory clock (C4).
4. Router as a System One Choice: adverse event vs product complaint vs medical
   enquiry vs none-of-these. Route accordingly.
5. Cross-source dedup: the same case arriving by email and in an E2B file
   collapses to one clinical_state, with both source_records retained. Key
   order: case identifier -> (patient + drug + event + date) fuzzy -> content
   hash. Log which matched.
6. Intake API: POST /v1/intake with a declared source type, returning a receipt
   id immediately and processing asynchronously. Customers will integrate
   against this; design it once.

ACCEPTANCE
- The 200-document synthetic corpus ingests end to end with zero manual steps.
- Every extracted field carries offsets that resolve to a page and region in
  the stored original; test with a scanned PDF.
- Cross-source dedup test: same case via email and E2B -> one clinical_state,
  two source_records.
- With a local-only tenant policy, no request reaches a hosted endpoint during
  intake; test with a network guard.

OUT OF SCOPE
MedDRA coding and output (C3), the clock engine (C4).
```

---

## C2 — Case console

```
CONTEXT
A3 built the literature console. Cases add scanned source documents, serious
cases that only a physician may approve, and narratives.

BUILD
1. Extend the console to case documents: the source PDF on the left with the
   evidence span highlighted at its bounding box.
2. Serious-case approval restricted to safety_physician (A1 policy table).
3. Narrative drafts where every sentence links to its source span. A sentence
   with no source cannot be approved.
4. Queue ordering in SQL: escalations, then serious, then regulatory clock
   soonest, then oldest.
5. Time-to-decision measured for cases separately from literature items.

ACCEPTANCE
- A reviewer cannot approve a serious case; test.
- A narrative sentence without a source link blocks approval; test.
- Case time-to-decision measured and shown on /ops; report the real number.
- Keyboard-only flow works for 50 sample cases.

OUT OF SCOPE
Bulk actions, reviewer analytics beyond time-to-decision.
```

---

## C3 — Regulatory output (export)

**Target capability:** the report equivalent, as export. Vyom produces
submission-ready files; the customer's safety database submits them. Vyom does
not transmit to regulators in this milestone (that is D1).

```
CONTEXT
Nothing in vyom-os produces a regulator-ready artefact today.

BUILD
1. E2B(R3) serializer: clinical_state + approved decisions -> valid R3 XML.
   Validate against the official schema in CI, not only at runtime.
2. Regional profiles: EMA, FDA and CDSCO differ in required fields and
   vocabularies. Profiles are data (a versioned table), not branches in code.
3. MedDRA coding behind the licence boundary: with a tenant licence, map
   event_verbatim -> LLT/PT and record the dictionary version used. Without
   one, emit the verbatim term and SOC only, and mark the file as requiring
   coding before submission.
4. Export for import into the customer's safety database, with an export
   ledger: every export appended with payload hash, profile version,
   timestamp, operator and outcome.
5. Aggregate data exports: line listings and summary tabulations for periodic
   reports, as data first; formatted documents later.

ACCEPTANCE
- Generated R3 XML validates against the official schema in CI.
- A regional-profile change is a data change only; test.
- Licence boundary test: a tenant without MedDRA cannot emit coded terms.
- The export ledger is append-only and reconstructs the full export history of
  a case.

OUT OF SCOPE
Gateway transmission and acknowledgements (D1), formatted PSUR documents.
```

---

## C4 — Regulatory clock and inline validation

**Target capability:** the assure equivalent, inside our own pipeline.

```
CONTEXT
A2 records awareness dates for literature; B2 runs validation rules on
imported cases. Cases now need a live clock and checks while they are being
processed.

BUILD
1. Regulatory clock: day-zero determination per case, per region, per
   seriousness. 15-day and 90-day tracks. Alert before breach; record every
   breach with its cause. Day zero is a decision with provenance like any
   other.
2. Inline validation: run the B2 rules continuously during processing, not only
   at the end, and surface findings in the console as they appear.

ACCEPTANCE
- The clock computes correctly across regions and seriousness; test the edges
  (day zero on a weekend, follow-up resetting, retrospective information).
- Inline findings appear in the console before approval; test.
- A deliberate near-breach raises an alert; test.

OUT OF SCOPE
Gateway submission (D1).
```

---

# Milestone D — On demand

Start a D phase only when a customer needs it or pays for it.

---

## D1 — Gateway submission

```
CONTEXT
C3 produces validated E2B(R3) files that customers import into their own
safety database. Some customers may contract Vyom as their system of record for
submission. This multiplies validation work and liability; build it only under
such a contract.

BUILD
1. Gateway submission with acknowledgement handling: transmit, store ACK1/ACK2,
   reconcile, surface failures in the console. A submission with no recorded
   ACK is not complete and must not display as submitted.
2. Submission ledger: every transmission attempt appended with payload hash,
   endpoint, timestamp, operator and outcome.

ACCEPTANCE
- A full round trip against a regulator test gateway, ACKs stored and
  reconciled.
- The submission ledger is append-only and reconstructs the full history of a
  case.

OUT OF SCOPE
Regulator onboarding paperwork (a customer and QA activity).
```

---

## D2 — Signal detection

**Last, deliberately:** it is worth little until the case data underneath it is
complete and trustworthy, and it is the capability a customer is least likely to
buy first.

```
CONTEXT
Vyom Signal is on the public site as a roadmap item. Nothing is built.

BUILD
1. Case aggregation across products, sources and time, tenant-scoped.
2. Disproportionality: PRR and ROR with confidence intervals, on tenant data and
   on public FAERS separately — never silently pooled.
3. Thresholds as versioned policy, per tenant, with the same append-only
   discipline as every other decision.
4. Evaluation workflow: a crossing becomes a tracked item with an owner, not an
   inbox entry. It closes with a decision record stating what was found, what
   was decided and why.
5. Literature alerting into the same evaluation workflow.
6. Signal console view reusing the A3/C2 primitives.

ACCEPTANCE
- Statistics verified against a worked reference example; show the arithmetic
  in the test.
- Tenant data and FAERS results are never combined in one statistic; test.
- Every evaluation closes with a decision record; no silent closures.
- Thresholds are versioned and auditable.

OUT OF SCOPE
Automated causality assessment, regulatory signal submissions.
```

---

## D3 — Self-serve commercial surface

```
CONTEXT
A4 runs benchmarks as an operator tool. Scaling sales needs prospects and
customers to do more without an engineer.

BUILD
1. Self-serve benchmark: a prospect uploads a historical sample and receives a
   recall and precision report on their own data, with the A4 safeguards
   (adjudication, possible-missed-case notification, deletion) intact.
2. Tenant onboarding: provision, configure strategies, set thresholds, import
   historical data.
3. In-product reporting: weekly screening log, recall report, vendor scorecard.
4. Usage and billing data export per the per-item pricing model.

ACCEPTANCE
- A prospect completes a benchmark with no engineer involved.
- Every product-page claim maps to a shipped capability; audit it.
- Content rules hold: npm run check passes; every number sourced, targeted or
  sample-marked.

OUT OF SCOPE
Payment processing, contract management.
```

---

## Sequencing

```
Milestone A  Literature pilot
  A0 Harden -> A1 Tenancy + roles -> A2 Literature   -> A4 Benchmark
                                  -> A3 Console
                                     A5 Pilot ops (alongside A3/A4)
  GATE A: 2 paid pilots signed; adjudicated benchmark recall at target

Milestone B  Production literature + Audit
  B1 Compliance evidence | B2 Audit mode | B3 Production ops | B4 SSO (on request)
  GATE B: production contract; customer QA accepts validation pack;
          ISO 27001 audit booked

Milestone C  Cases
  C1 Intake -> C2 Case console -> C3 E2B export -> C4 Clock + inline validation
  GATE C: first Cases customer live; patient-data processing terms in contract

Milestone D  On demand
  D1 Gateway submission | D2 Signal | D3 Self-serve commercial
```

**A1 is the one not to defer.** Retrofitting tenant isolation after months of
accumulated data is the most expensive reordering available in this plan, and it
is the first thing a pharma security review will test.

**A4 is the one not to delay.** The benchmark is what turns a conversation into
a paid pilot. Everything in Milestone A exists to make it credible.

**D2 is the one to defer.** Signal detection on incomplete case data produces
confident nonsense.

| Milestone | Rough size (estimate, not a commitment) |
| --- | --- |
| A | 6–10 weeks for two engineers on top of v2; longer part-time |
| B | 2–3 months |
| C | 4–6 months |
| D | Per customer demand |

---

## Appendix — cross-cutting requirements

Hold these in every phase; they are not a phase of their own.

| Area | Requirement |
| --- | --- |
| Evidence | Every model assertion quotes its source span with offsets resolving to the stored original |
| Reproducibility | Any decision replayable from `state_sha256` + pinned versions |
| Failure mode | Uncertainty routes to a human. Never auto-close on error |
| Auto-close | Off by default per tenant; enabled only with qppv sign-off; sampled checks continue |
| Latency | System One stays synchronous. Only System Two may be async |
| Data | Originals immutable. Extractions derived and re-derivable |
| Testing | Gold set frozen, separate from the correction pool. Never tune against gold |
| Test data | Synthetic only. No real patient or customer data in repo, fixtures, logs or screenshots |
| Governance | Every System One question has a versioned context-of-use record |
| Cost | Every model call and OCR page carries tenant, item and estimated cost |
| Accessibility | WCAG AA in the console; reviewers use it for eight hours a day |
| Indian English | "hospitalised", "programme", "licence" — in UI copy and in docs |

## Appendix — what we are deliberately not copying

- **Their published performance numbers.** We measure our own and state the
  method. Our own content rules forbid anything else.
- **Their module naming.** `/intake`, `/nucleus` and so on are their vocabulary.
  Vyom Cases, Literature, Audit, Reports, Signal and OS are already defined in
  `vyom-web/src/content/products.ts` and already on the site.
- **Their breadth and build order.** They build every module at once with
  venture funding. We build what the next paying customer needs, behind a gate.
- **A knowledge graph for its own sake.** They lead with one; our architecture
  leads with calibrated System One primitives and an append-only ledger. If a
  graph earns its place for cross-case linking in D2, adopt it there on merit —
  not because a competitor's homepage mentions it.
