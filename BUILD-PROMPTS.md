# Vyom OS — phase-wise build prompts

**Audience:** the Vyom engineering team (and the coding agents they drive).
**Purpose:** take `vyom-os` + `vyom-web` from today's working v2 foundation to a
production pharmacovigilance platform with the capability surface of a
category-leading AI-native PV product.

Each phase below is a **self-contained prompt**. Copy one phase into a ticket or
an agent session; it carries its own context, acceptance criteria and
out-of-scope list. Phases are ordered by dependency, not by preference — do not
start Phase N+1 until Phase N's acceptance criteria pass.

---

## Read this before Phase 0

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
Google Vertex AI and Kubernetes. They raised a $13.3M Series A led by Insight
Partners with Bessemer participating. Target customers: global biopharma,
mid-size pharma, CROs and patient-support-programme providers.

**Two things follow from that table, and they should change how you plan.**

1. **Four of six modules are unreleased.** "Exactly like graphsafety.ai" *today*
   means intake plus case structuring. The other four are their roadmap. Build
   to a roadmap and you are building to marketing, with none of the customer
   feedback that shaped it. Treat `/report`, `/signal`, `/assure` and `/comply`
   as *capability targets we have independently decided we need* — which,
   conveniently, the BRD already says — not as a feature list to clone.

2. **Their headline results are unattributed vendor claims.** "90% reduction in
   effort", "92% faster processing", "66% cost savings" appear on their homepage
   with no named customer and no methodology. Do not put them in a Vyom spec, a
   Vyom deck, or a Vyom acceptance criterion. Our own rule — every number is a
   sourced fact, a labelled target, or sample data — applies to competitor
   figures too. If we want numbers like those, we measure our own and publish
   the method.

**Naming rule.** `CLAUDE.md` rule 4 — never name a competitor — governs **site
copy**. This is an internal engineering document, so naming them here is fine.
Nothing from this file goes into `src/content/`, a deck, or anything a customer
sees.

### Scope: pharmacovigilance only

**Decided 2026-10-26.** These phases cover pharmacovigilance alone. Hospital RCM
— Module A in BRD-v2 — is **out of scope for this plan**, not cancelled.

What that means in practice:

- **Do not delete RCM.** `POST /v1/rcm/preflight`, the `hospital_rcm` domain in
  the ledger, the `cpc_coder` and `tpa_auditor` roles, the RCM branches in
  `review.py` and `system_two.py`, and their tests all stay exactly as they are.
  They keep passing CI. Nobody builds on them.
- **Keep the three-domain enum.** `pv_literature`, `pv_icsr`, `hospital_rcm`
  stays. Collapsing it to two is a migration that has to be undone later, and
  the PHI routing rule is domain-keyed.
- **Every phase below applies to `pv_literature` and `pv_icsr` only.** Where a
  phase says "every data table" or "every domain", read it as the PV domains.
  An RCM row may exist; no phase is accountable for it.
- **The dual-engine thesis is not disproven, just deferred.** BRD-v2 argues RCM
  and PV are the same computational problem on one core, and the architecture
  already reflects that. Nothing here forecloses picking RCM back up; Phase 1's
  tenancy work in particular should not assume a single vertical.

**One open item this creates.** `vyom-web/src/content/home.ts` currently leads
with *"The AI-native decision engine for **Hospital RCM** & Drug Safety."* — RCM
is the accented, underlined phrase in the homepage hero, and `/book-demo` is
addressed to "hospital TPA desks and pharmacovigilance teams". If the build is
PV-only, the most prominent copy on the site is selling a capability no phase
below delivers. Under content rule 1 that needs resolving: either narrow the
hero to drug safety, or keep the dual-engine positioning as a deliberate
forward-looking claim and accept it is ahead of the build. **This is a
positioning decision, not an engineering one — it is flagged here, not
actioned.**

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
enterprise identity, production authorization. Those are Phases 1–6 below.

`vyom-web` has the marketing site, a login route, `/{tenant_slug}` app shell and
`/ops`, with middleware as the edge gateway.

### Capability map

| Target capability | Vyom equivalent | Status today | Phase |
| --- | --- | --- | --- |
| Multi-source intake | `/v1/icsr/intake` + sweep | Partial — no OCR, no email, no E2B-in | 2 |
| Case structuring | System One + System Two | **Working** | — |
| Reviewer console | `/v1/review/*` API only | API only, no UI | 3 |
| Regulatory output | — | Not built | 4 |
| Signal detection | — | Not built | 6 |
| Continuous validation | Gold-set eval | Batch only, not inline | 5 |
| Compliance / audit | Decision ledger | Ledger exists; no clock, no Part 11 pack | 5 |
| Multi-tenancy | `x-tenant-id` in middleware | Header only, no isolation | 1 |
| Hospital RCM | `/v1/rcm/preflight` + `hospital_rcm` domain | Working, **out of scope** — see above | — |

---

## Ground rules — these apply to every phase

Paste this block with any phase prompt you hand to an agent.

```
NON-NEGOTIABLE CONSTRAINTS

1. PHI ISOLATION. Public literature (pv_literature) may use the hosted System
   One client. pv_icsr and hospital_rcm route to the local endpoint only.
   Never send identifiable patient data to a hosted model endpoint. If a code
   path could do so, it is a bug even if no PHI has flowed through it yet.

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

6. NUMBERS. Every figure in any artefact is a sourced fact (with source), a
   labelled target, or sample data (with a SAMPLE DATA marker). Fictional
   identifiers only in samples: VY-201, VY-305, VY-412, VY-CASE-xxxx,
   Vendor A (FICTIONAL), demo-hospital, demo-tpa.

7. TESTS. Every phase ships tests. vyom-os: pytest. vyom-web: npm run check
   must pass with zero errors. No phase is done with a failing or skipped test.

8. ASK BEFORE ADDING A DEPENDENCY.
```

---

# Phase 0 — Harden what exists

**Why first:** everything below compounds on the v2 foundation. Bugs here
multiply. This phase adds no features.

```
CONTEXT
vyom-os v2 has System One routing, an append-only decision ledger, a public
literature sweep, selective System Two drafting, reviewer APIs and gold-set
evaluation. It has never run continuously against real volume.

BUILD
1. Load test the sweep path at 50,000 articles/day. Record p50/p95/p99 latency
   for the System One call, the dedup query and the ledger insert. Publish the
   numbers in vyom-os/docs/baseline-performance.md as measurements, with the
   hardware and date they were taken on.
2. Add structured logging (JSON, one event per decision) with correlation ids
   that survive the whole pipeline: ingest -> sys1 -> route -> sys2 -> queue.
3. Add /healthz depth: database reachable, both System One endpoints reachable,
   last successful sweep timestamp, queue depth. Return 503 when any is unmet.
4. Fail-closed on System One errors. A timeout or 5xx must route the state to
   the human queue, never auto-close it. Add a test that proves a sys1 failure
   cannot produce a GREEN auto-close.
5. Idempotency: re-running a sweep for the same day must not create duplicate
   clinical_states or duplicate decisions. Add a test.
6. Fix any test that is currently skipped or flaky. Document why any remaining
   skip exists.

ACCEPTANCE
- 50k-article sweep completes without manual intervention; numbers published.
- A forced System One outage routes everything to the queue; test proves it.
- Re-running a day is a no-op; test proves it.
- pytest green, no skips without a written reason.

OUT OF SCOPE
New endpoints, UI, OCR, serializers.
```

---

# Phase 1 — Multi-tenancy and identity

**Why now:** every later phase writes tenant-scoped data. Retrofitting isolation
after six phases of data is the single most expensive mistake available here.

```
CONTEXT
vyom-web middleware already requires auth and an x-tenant-id header on tenant
routes. vyom-os has no tenant model: data is global. We sell to pharma companies
and CROs who will ask, in the first security review, how their data is separated
from another customer's.

BUILD
1. Postgres: add tenant_id (uuid, not null) to every data table. Backfill
   existing rows to a single bootstrap tenant. Add row-level security policies
   so a connection scoped to a tenant physically cannot read another's rows.
   Service-role connections that bypass RLS are allowed only in migration and
   batch jobs, never in the request path.
2. Tenants table: slug, display name, data residency region, MedDRA licence
   status, System One routing policy (which domains may use the hosted client),
   feature flags.
3. FastAPI: resolve tenant from a validated JWT claim, not from a client-supplied
   header. x-tenant-id may be used for routing but must be cross-checked against
   the token; a mismatch is a 403.
4. Replace API_BEARER_TOKEN and REVIEWER_TOKENS_JSON with real identity: OIDC
   against the tenant's IdP where configured, local accounts otherwise. Roles:
   reviewer, safety_physician, qppv, admin, ops.
5. Authorization: a safety_physician may approve; a reviewer may correct and
   escalate but not approve a serious case. Encode this as a policy table, not
   as if-statements scattered through handlers.
6. vyom-web: wire the real session into (platform)/[tenant_slug] and (internal)/ops.
   /ops is internal-only and must 404 — not 403 — for tenant users.

ACCEPTANCE
- A test proves tenant A's connection returns zero rows from tenant B's data,
  at the database level, with RLS on.
- A forged x-tenant-id with a valid token for another tenant returns 403; test.
- Role matrix test: every (role, action) pair asserted, allow and deny.
- npm run check passes; pytest green.

OUT OF SCOPE
SSO provisioning UI, SCIM, billing.
```

---

# Phase 2 — Intake: every source a customer actually has

**Target capability:** the `/intake` equivalent. This is the module that decides
whether we can take a customer's real traffic at all.

```
CONTEXT
Today vyom-os ingests PubMed and Europe PMC, plus a structured /v1/icsr/intake
endpoint. Real PV intake arrives as: PDFs (scanned and digital), email with
attachments, partner E2B(R3) XML files, call-centre transcripts, CIOMS forms,
spontaneous web forms, and literature. We handle one of those well.

BUILD
1. OCR/PDF extraction service. Digital-text PDFs parse directly; scanned ones
   go through OCR. Preserve character offsets back to page and bounding box —
   the evidence-span contract depends on it. Store the original immutably; never
   overwrite it with the extracted text.
2. Email intake: a per-tenant mailbox, attachment extraction, thread dedup.
   Record the sender and received-at as part of the state; they feed the
   regulatory clock in Phase 5.
3. Partner E2B(R3) inbound: parse R3 XML into clinical_states. Validate against
   the schema; a file that fails validation is quarantined with a readable
   error, not silently dropped.
4. Source classification as a System One Choice: adverse event vs product
   complaint vs medical enquiry vs none-of-these. Route accordingly.
5. Extend dedup across sources: the same case arriving by email and in a partner
   E2B file must collapse to one clinical_state, with both source_records
   retained. Dedup key order: case identifier -> (patient + drug + event + date)
   fuzzy -> content hash. Log which matched.
6. Intake API: POST /v1/intake with a declared source type, returning a receipt
   id immediately and processing asynchronously. Customers will integrate
   against this; design it once.

ACCEPTANCE
- 200 mixed real-shaped documents (PDF scanned, PDF digital, email, E2B XML)
  ingest end to end with zero manual steps.
- Every extracted field carries offsets that resolve back to a page and region
  in the stored original; test with a scanned PDF.
- A malformed E2B file quarantines with a readable error; test.
- Cross-source dedup test: same case via email and E2B -> one clinical_state,
  two source_records.
- OCR runs in the PHI-safe path for pv_icsr and hospital_rcm.

OUT OF SCOPE
Narrative drafting (exists), MedDRA coding (Phase 4), submission (Phase 4).
```

---

# Phase 3 — The reviewer workbench

**Target capability:** expert-in-the-loop, made real. The BRD's whole economic
argument is that one reviewer clears 500+ pre-scored cases a day. That number is
a property of this UI.

```
CONTEXT
vyom-os exposes /v1/review/queue and /v1/review/states/{id}/actions. There is no
UI. vyom-web has (platform)/[tenant_slug]/console as a shell. DESIGN.md governs
the look; read it before writing any component.

BUILD
1. Split-screen console at /{tenant_slug}/console: source document on the left
   (PDF with the evidence span highlighted at its bounding box), System One
   output on the right as typed flags with calibrated probabilities.
2. Keyboard-first. J/K to move, A to approve, C to correct, E to escalate,
   ? for help. No action requires the mouse. Focus states visible throughout.
3. Correction UI: inline field edit that writes a new labels row with a
   field-level diff. Never mutates the original decision.
4. Show model_id, sampler_version and question_schema_version on screen for the
   decision being reviewed. When a reviewer disputes an output, the first
   question is always which version produced it.
5. Queue ordering: escalations, then serious, then regulatory clock soonest,
   then oldest. Ordering lives in SQL, not the client.
6. Reviewer locking: two reviewers must not be handed the same state. Use
   SELECT ... FOR UPDATE SKIP LOCKED with a lease timeout.
7. Instrument time-to-decision per case and publish it on /ops. This is the
   number the BRD's unit economics rest on; measure it from day one.

ACCEPTANCE
- A reviewer clears 50 sample cases using only the keyboard.
- Median time-to-decision measured and displayed. Report the real number
  whatever it is — do not target 30s in the acceptance criteria, measure it.
- Two browser sessions never receive the same state; test.
- Every action produces exactly one append-only labels row; test.
- Matches DESIGN.md at 1440px; no horizontal scroll at 375/768px.
- npm run check passes.

OUT OF SCOPE
Bulk actions, saved views, reviewer analytics beyond time-to-decision.
```

---

# Phase 4 — Regulatory output

**Target capability:** the `/report` equivalent. This is where the product stops
being an analysis tool and starts being a system of record.

```
CONTEXT
Nothing in vyom-os produces a regulator-ready artefact today. E2B(R3) is named
in system-design.md and README as not built.

BUILD
1. E2B(R3) serializer: clinical_state + approved decisions -> valid R3 XML.
   Validate against the official schema in CI, not at runtime only.
2. Regional profiles: EMA, FDA and CDSCO differ in required fields and
   vocabularies. Profiles are data (a versioned table), not branches in code.
3. MedDRA integration behind the licence boundary from the ground rules. With a
   tenant licence, map event_verbatim -> LLT/PT and record the dictionary
   version used. Without one, emit the verbatim term and SOC only, and mark the
   submission as requiring coding before transmission.
4. Gateway submission with acknowledgement handling: transmit, store ACK1/ACK2,
   reconcile, surface failures in the console. A submission with no recorded ACK
   is not complete and must not display as submitted.
5. Submission ledger: every transmission attempt appended with payload hash,
   endpoint, timestamp, operator and outcome.
6. Aggregate reports (PSUR/PBRER line listings and summary tabulations) as data
   exports first; document generation can come later.

ACCEPTANCE
- Generated R3 XML validates against the official schema in CI.
- A full round trip against a regulator test gateway, ACKs stored and reconciled.
- Licence boundary test: a tenant without MedDRA cannot emit coded terms.
- Submission ledger is append-only and reconstructs the full history of a case.

OUT OF SCOPE
Formatted PSUR documents, literature summaries inside reports.
```

---

# Phase 5 — Compliance, clock and continuous validation

**Target capability:** `/comply` and `/assure`. This is what a QPPV and an
inspector ask about, and it is what turns the decision ledger from a log into
evidence.

```
CONTEXT
We have an append-only ledger and batch gold-set evaluation. We have no
regulatory clock, no inspection pack, and no inline validation.

BUILD
1. Regulatory clock: day-zero determination per case, per region, per
   seriousness. 15-day and 90-day tracks. Alert before breach, record every
   breach with cause. Day zero is a decision with provenance like any other.
2. Inline validation ("assure"): run completeness and consistency checks
   continuously during processing, not only at the end. Coding vs narrative,
   seriousness vs outcome, missing mandatory fields, duplicates, date logic.
   Surface findings in the console as they appear.
3. Inspection evidence pack: given a case id or a date range, produce a bundle
   with every decision, every model and prompt version, every human action with
   actor and timestamp, and the source documents. One command, reproducible.
4. 21 CFR Part 11 alignment: unique attributable identities, no shared logins,
   signature meaning recorded on approvals, time source documented, record
   retention policy enforced in code.
5. Continuous recall monitoring: run the frozen gold set on every prompt, model
   or threshold change. A change that moves recall down does not ship. Wire it
   into CI as a gate, not a report nobody reads.
6. Validation documentation (IQ/OQ/PQ) generated from the test suite rather than
   written by hand, so it cannot drift from the system.

ACCEPTANCE
- Clock computes correctly across regions and seriousness; test the edges
  (day zero on a weekend, follow-up resetting, retrospective information).
- Inspection pack for any case reconstructs the full decision history including
  model versions; test.
- A deliberate recall regression fails CI; test.
- No shared credentials anywhere; every action attributable to one human.

OUT OF SCOPE
Formal CSV sign-off (that is a QA activity, not an engineering one), SOP writing.
```

---

# Phase 6 — Signal detection

**Target capability:** `/signal`. Last, deliberately: it is worth little until
the case data underneath it is complete and trustworthy, which is Phases 2–5.

```
CONTEXT
Vyom Signal is on the public roadmap as a roadmap item. Nothing is built.
The product brief describes cross-case aggregation, disproportionality on own
data plus public FAERS, literature alerts, an evaluation workflow and decision
records.

BUILD
1. Case aggregation across products, sources and time, tenant-scoped.
2. Disproportionality: PRR and ROR with confidence intervals, on tenant data and
   on public FAERS separately — never silently pooled.
3. Thresholds as versioned policy, per tenant, with the same append-only
   discipline as every other decision.
4. Evaluation workflow: a crossing becomes a tracked item with an owner, not an
   inbox entry. Closes with a decision record stating what was found, what was
   decided and why.
5. Literature alerting into the same evaluation workflow.
6. Signal console view reusing the Phase 3 primitives.

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

# Phase 7 — Production operations

```
CONTEXT
vyom-os has a Dockerfile and docker-compose. There is no production deployment,
no DR, no SLO.

BUILD
1. Deployment: containerised workers, managed Postgres with PITR, durable
   orchestration for scheduled sweeps (Temporal or Celery per system-design.md).
2. Data residency enforced per tenant, including which region the local System
   One worker runs in. This is a contractual commitment for Indian pharma, not
   a preference.
3. SLOs with alerting: intake availability, sweep completion, queue depth,
   time-to-decision, clock-breach count. Page on breach.
4. Backup and restore, with a restore actually rehearsed and timed. An untested
   backup is not a backup.
5. Secrets in a managed store. Nothing in .env in production, nothing in the
   repo, and rotate anything that has ever been pasted into a chat or a ticket.
6. Cost telemetry per tenant per case: System One calls, System Two calls, OCR
   pages, storage. The BRD prices per case; you cannot price what you cannot
   measure.

ACCEPTANCE
- A restore from backup into a clean environment, timed and documented.
- SLO dashboard live; a deliberate breach pages someone.
- Per-tenant per-case cost visible in /ops.
- No secret in the repo; scanner in CI.

OUT OF SCOPE
Multi-region active-active.
```

---

# Phase 8 — Commercial surface

```
CONTEXT
vyom-web has marketing, pricing and book-demo routes. The platform shell exists
but the product story and the product do not yet match.

BUILD
1. Update product pages to describe what is actually shipped, with status chips
   that are accurate. A roadmap item says roadmap.
2. Self-serve benchmark flow: a prospect uploads a historical sample, we run it,
   they get a recall and precision report on their own data. This is the BRD's
   wedge; make it a product, not a manual service.
3. Tenant onboarding: provision, configure strategies, set thresholds, import
   historical data.
4. In-product reporting: weekly screening log, recall report, vendor scorecard.
5. Usage and billing data export per the per-case pricing model.

ACCEPTANCE
- Every claim on a product page maps to a shipped capability; audit it.
- A prospect completes a benchmark with no engineer involved.
- Content rules hold: npm run check passes; every number sourced, targeted or
  sample-marked.

OUT OF SCOPE
Payment processing, contract management.
```

---

## Sequencing

```
Phase 0  Harden              ──┐
Phase 1  Tenancy + identity  ──┤ blocking; nothing tenant-scoped ships before these
Phase 2  Intake              ──┤
Phase 3  Workbench           ──┘
Phase 4  Regulatory output   ── needs 2, 3
Phase 5  Compliance + clock  ── needs 4
Phase 6  Signal              ── needs 2, 4, 5
Phase 7  Production ops      ── runs alongside 4-6, must land before first customer
Phase 8  Commercial          ── last; describes what exists
```

**Phase 1 is the one not to defer.** Retrofitting tenant isolation after six
phases of accumulated data is the most expensive reordering available in this
plan, and it is the first thing a pharma security review will test.

**Phase 6 is the one to defer.** Signal detection on incomplete case data
produces confident nonsense, and it is the capability a customer is least likely
to buy first.

---

## Appendix — cross-cutting requirements

Hold these in every phase; they are not a phase of their own.

| Area | Requirement |
| --- | --- |
| Evidence | Every model assertion quotes its source span with offsets resolving to the stored original |
| Reproducibility | Any decision replayable from `state_sha256` + pinned versions |
| Failure mode | Uncertainty routes to a human. Never auto-close on error |
| Latency | System One stays synchronous. Only System Two may be async |
| Data | Originals immutable. Extractions derived and re-derivable |
| Testing | Gold set frozen, separate from the correction pool. Never tune against gold |
| Accessibility | WCAG AA in the console; reviewers use it for eight hours a day |
| Indian English | "hospitalised", "signal", "programme" — in UI copy and in docs |

## Appendix — what we are deliberately not copying

- **Their published performance numbers.** We measure our own and state the
  method. Our own content rules forbid anything else.
- **Their module naming.** `/intake`, `/nucleus` and so on are their vocabulary.
  Vyom Cases, Literature, Audit, Reports, Signal and OS are already defined in
  `vyom-web/src/content/products.ts` and already on the site.
- **A knowledge graph for its own sake.** They lead with one; our architecture
  leads with calibrated System One primitives and an append-only ledger. If a
  graph earns its place for cross-case linking in Phase 6, adopt it there on
  merit — not because a competitor's homepage mentions it.
