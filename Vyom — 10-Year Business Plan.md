# Vyom — 10-Year Business Plan

Oct 15, 2026 · @Prarabdha Soni

## Executive summary

Vyom does pharma's legally required drug-safety work with AI first and medical experts last. It starts with Indian generic exporters and grows, over ten years, into trial safety and trial recruitment for global sponsors.

- **Majburi demand.** Every company that sells a medicine must collect, assess and report adverse events, whatever its budget. The pharmacovigilance market is about $10.45B in 2026, heading to about $18.3B by 2031, and over half of it is outsourced ([Mordor via GII](https://www.giiresearch.com/report/moi2122184-pharmacovigilance-market-share-analysis-industry.html)).
- **Futuristic delivery.** Fast decision models answer the routine yes/no and pick-one questions, code handles numbers and dates, LLMs draft narratives, and experts sign off. Regulators now publish frameworks for AI in drug safety (see Why now).
- **The ladder.** Literature and intake triage, then full case processing, then safety reporting inside trials, then trial pre-screening at Indian hospitals. Every step sells to pharma companies and the CROs that run their trials.
- **Where Vyom aims to win.** Mid-sized Indian exporters (the first hypothesis to test), Indian delivery costs, and hospital access for the trials step.
- **The honest verdict.** Credible, not easy. Graph AI already serves customers in North America ([BioSpectrum](https://www.biospectrumindia.com/article/pdf/28461)), Paradigm has raised $253M for trial matching ([Digital Health News](https://www.digitalhealthnews.com/paradigm-health-partners-with-roche-to-advance-ai-driven-clinical-trial-enrollment)), and India holds only 2–3% of global trials ([Indian Pharma Post](https://www.indianpharmapost.com/news/global-clinical-trials-are-shifting-east-is-india-ready-to-lead-20760)). Vyom needs a drug-safety co-founder before it needs money.
- **The ask, now.** No outside money yet. In 90 days: sign a drug-safety co-founder, interview 15 heads of drug safety, and benchmark on public data. Go full-time only after two paid pilots.

**In numbers.** The base case reaches about $33M revenue in 2036 and turns EBITDA-positive in 2032 after about $2.9M of funding. Unicorn scale needs the ambitious case: about $108M revenue, worth about $1B only at a 10x multiple.

## The problem

Drug safety is a legal duty that still runs on trained people reading documents against fixed clocks. In the US, the 15-day clock for serious, unexpected events starts when anyone acting for the company first receives a report ([Rx Almanac](https://rxalmanac.com/articles/outsourced-pharmacovigilance-services/)).

- **Every case is manual work.** A case becomes valid once it has an identifiable patient, reporter, suspect product and event. Then someone codes it in MedDRA, writes a narrative and chases follow-up ([Rx Almanac](https://rxalmanac.com/articles/outsourced-pharmacovigilance-services/)).
- **The work keeps growing.** The market grows about 11.8% a year, and a shortage of trained safety staff plus high turnover are named restraints ([Mordor via GII](https://www.giiresearch.com/report/moi2122184-pharmacovigilance-market-share-analysis-industry.html)).
- **Pricing is opaque.** There is no reliable public per-case benchmark; every quoted rate is a bid ([Rx Almanac](https://rxalmanac.com/articles/outsourced-pharmacovigilance-services/)). A vendor that can show its real cost per case has an edge.
- **Quality is hard to prove.** Vendors publish accuracy percentages without denominators, and in safety work a false negative is a missed reportable event ([Rx Almanac](https://rxalmanac.com/articles/outsourced-pharmacovigilance-services/)).
- **Indian exporters carry a double duty.** India exported $31.1B of medicines in FY26 (Apr 2025–Mar 2026), about 30% of it to the US ([SAHI](https://www.sahi.com/blogs/india-pharma-exports-2030-target-cut)). Most exporters answer to FDA or EMA rules as well as CDSCO's.

## Why now

Three dated rule changes make 2026–2027 a switching moment, and AI is now cheap and accepted enough to rebuild the work around it.

- **FDA format change.** From 1 October 2026, postmarketing case reports sent through FDA's gateway must use E2B(R3); R2 is not accepted after 30 September 2026. R3 assesses seriousness per event and embeds attachments ([RAPS](https://www.raps.org/resource/fda-sets-october-deadline-for-new-safety-reporting-format.html)). Buyers now ask vendors for proof of live R3 submissions ([Rx Almanac](https://rxalmanac.com/articles/outsourced-pharmacovigilance-services/)).
- **CDSCO tightening.** A 3 June 2026 directive told manufacturers, marketers and importers to maintain formal pharmacovigilance systems, with inspections of officers, records and SOPs ([Pharmuni, citing The Economic Times](https://pharmuni.com/news/cdscos-2026-order-strengthens-adr-monitoring-are-indias-pv-teams-ready-now/)). Smaller Indian companies face new staffing and technology costs.
- **A regulator-backed playbook for AI.** CIOMS published its Working Group XIV report on AI in pharmacovigilance on 4 December 2025 ([CIOMS](https://cioms.ch/working_groups/working-group-xiv-artificial-intelligence-in-pharmacovigilance/)). It backs AI that frees experts from repetitive work and warns against automation aimed only at cost.
- **Decisions now cost almost nothing.** Typed decision models such as TypeSafe's Jev charge $0.042 per million input tokens, with free output ([VKTR](https://www.vktr.com/ai-platforms/chatgpt-cocreator-launches-typesafe-ai-with-jev/)). The limit is validation and trust, not compute.
- **Cost pressure on exporters.** A US plan announced on 22 July 2026 would tax imported generics at 100% from August 2028 and 200% from 2029 ([SAHI](https://www.sahi.com/blogs/india-pharma-exports-2030-target-cut)). Exporters will cut costs everywhere; safety reporting cannot be cut, only made cheaper.

## What we build

Vyom is one safety engine sold as five products, launched in order. Each step reuses the previous step's engine and sells to the same pharma and CRO buyers.

1. **Vyom Screen (year 1).** Literature screening and intake triage: is the article relevant, is the case valid, is it serious, is it a duplicate.
2. **Vyom Cases (years 1–2).** End-to-end case processing: MedDRA coding, LLM-drafted narratives, follow-up and E2B(R3) output. Medical review stays human.
3. **Vyom Reports (years 2–3).** Drafting support for periodic safety reports (PADER, PBRER, DSUR). Sign-off stays with the client.
4. **Vyom Trial Safety (years 3–4).** The same engine for serious adverse events in clinical trials, sold to CROs and sponsors.
5. **Vyom Recruit (year 5 onward).** Trial pre-screening at Indian hospital sites for global sponsors, one yes/no question per eligibility criterion, numbers checked in code.

Two services sit beside the ladder and open doors: **Vyom Audit**, an independent quality check of another vendor's cases, and **R3 Readiness**, migration and validation help for the FDA format change.

One rule runs through every product: AI proposes, rules check, experts decide.

## Technology

The edge is the validated workflow around the model, not the model. Any model can be swapped in; the checks, audit trail and validation evidence stay.

&#91;embedded content: Vyom case flow · 7 steps across AI, rules and experts\]

Code, not the model, handles numbers, counts and dates, which Jev's own notes list as weak spots ([jev-1.13](https://docs.typesafe.ai/model-jaggedness/jev-1.13.md)). Jev's API sees only literature and de-identified text; identifiable patient data goes to a self-hosted model. Model versions are locked and change only after the benchmark is rerun.

## Market

The money is in global drug safety and trial work; India is where Vyom starts and delivers from, not the whole market.

| Market | Size | Source |
| --- | --- | --- |
| Pharmacovigilance, global | $10.45B in 2026, $18.26B by 2031 (11.8% a year) | [Mordor via GII](https://www.giiresearch.com/report/moi2122184-pharmacovigilance-market-share-analysis-industry.html) |
| Share of PV work outsourced | 54.9% of 2025 revenue, outsourcing growing 13.5% a year | [Mordor via GII](https://www.giiresearch.com/report/moi2122184-pharmacovigilance-market-share-analysis-industry.html) |
| Trial patient recruitment services, global | $12.8B in 2026, $26.2B by 2035 (one estimate) | [Roots Analysis](https://www.rootsanalysis.com/reports/clinical-trial-patient-recruitment-services-market/245.html) |
| India's CRO industry | About $1.4B; India holds 2–3% of global trials | [Indian Pharma Post](https://www.indianpharmapost.com/clinical-trials/indias-clinical-research-ambitions-need-more-than-regulatory-reforms-experts-20760) |
| India pharma exports | $31.1B in FY26 (Apr 2025–Mar 2026), about 30% to the US | [SAHI](https://www.sahi.com/blogs/india-pharma-exports-2030-target-cut) |

North America is 43.6% of pharmacovigilance spend, and large pharma is already moving routine work to hubs in India ([Mordor via GII](https://www.giiresearch.com/report/moi2122184-pharmacovigilance-market-share-analysis-industry.html)). Vyom's base case needs well under 1% of these markets; the constraint is trust and delivery, not market size.

## Customers and wedge

Vyom sells first to mid-sized Indian exporters, then to small global biotechs, then to the CROs and sponsors that run trials in India.

| Segment | Buyer | Why they switch | First offer |
| --- | --- | --- | --- |
| Mid-sized Indian exporters with US or EU products | Head of pharmacovigilance or QPPV | R3 deadline, CDSCO inspections, cost pressure | Vyom Screen pilot or R3 Readiness |
| Small and mid-sized global biotechs, virtual pharma | Head of drug safety | No in-house team; need a validated, cheaper operation | Vyom Cases |
| CROs running trials in India | Safety and clinical operations leads | Serious-event workload and tight reporting clocks | Vyom Trial Safety |
| Global sponsors with Indian sites | Clinical operations | Enrolment delays; untapped non-metro patients | Vyom Recruit |

The trials wedge is real: about 80% of trials are delayed by slow recruitment ([Roots Analysis](https://www.rootsanalysis.com/reports/clinical-trial-patient-recruitment-services-market/245.html)), and about 80% of Indian trial sites sit in two or three metros while the government plans 1,000 accredited sites ([Indian Pharma Post](https://www.indianpharmapost.com/clinical-trials/indias-clinical-research-ambitions-need-more-than-regulatory-reforms-experts-20760)).

First hypothesis to test: mid-sized exporters are underserved by large vendors and will pay for an independent, AI-first operator.

## Competition

Vyom competes with services firms on price and speed and with AI-native platforms on focus. It has to win on proven quality, because every vendor now claims AI.

| Player | What they sell | What it means for Vyom |
| --- | --- | --- |
| [Graph AI](https://www.biospectrumindia.com/article/pdf/28461) | AI-native safety platform (intake, case processing, signals next); $13.3M Series A; customers in North America | Closest rival and already ahead in the US. Vyom starts where Graph AI is less focused: mid-sized Indian exporters. |
| [IQVIA, Indegene](https://rxalmanac.com/articles/outsourced-pharmacovigilance-services/) | High-volume offshore case processing with automation | Set the price and scale benchmark; possible partners or acquirers. |
| [Syneos, ProPharma, UBC, EVERSANA](https://rxalmanac.com/articles/outsourced-pharmacovigilance-services/) | Safety divisions and regulatory platforms, often with a QPPV | Win where a buyer wants safety plus regulatory work from one vendor. |
| [Accenture, Cognizant, Wipro, ArisGlobal, Oracle](https://www.giiresearch.com/report/moi2122184-pharmacovigilance-market-share-analysis-industry.html) | Services and safety databases | The database is a separate purchase: integrate with it, don't replace it. |
| [Paradigm Health](https://www.digitalhealthnews.com/paradigm-health-partners-with-roche-to-advance-ai-driven-clinical-trial-enrollment) | AI trial enrolment; $253M raised; Roche partnership | Partner, don't fight. Vyom's edge is Indian non-metro sites. |

Vyom's defensible advantages, if it executes: an audit history clients can check, a validated engine priced per outcome, and a delivery cost base in India.

## Business model and pricing

Vyom charges per unit of work, the way buyers already purchase safety services, and earns software-like margins by automating the routine steps.

| Product | Pricing unit | How the price is set |
| --- | --- | --- |
| Vyom Screen | Per product per month, or per abstract | Below the client's current cost, measured in the pilot |
| Vyom Cases | Per case, banded: non-serious, serious, follow-up | Below the incumbent's bid for the same case mix |
| Vyom Reports | Per report, per product | Fixed fee per report |
| Vyom Trial Safety | Per serious adverse event | Per-event fee agreed with the CRO |
| Vyom Recruit | Per qualified, consented referral | Per-referral fee agreed with the sponsor |
| Vyom Audit, R3 Readiness | Fixed-fee project | Scoped per client |

These units follow how the market prices safety work today ([Rx Almanac](https://rxalmanac.com/articles/outsourced-pharmacovigilance-services/)). No public per-case benchmark exists, so each price is discovered in pilots, not copied from a rate card.

- **Pricing rule (assumption to test).** Price 30–50% below the client's current cost per case. Graph AI reports cutting operating costs by up to 66% in live deployments ([BioSpectrum](https://www.biospectrumindia.com/article/pdf/28461)), which suggests the room exists.
- **Delivery cost.** A Drug Safety Associate in India averages ₹3.97 lakh a year in base pay ([Payscale](https://www.payscale.com/research/IN/Job=Drug_Safety_Associate/Salary)). Vyom's reviewers handle exceptions, so cost per case falls as automation rises.
- **The number that sets the valuation.** The share of steps completed without human edits, at a validated error rate. Gross margin rises with it (see Financial plan).

## Go-to-market

Vyom wins its first customers founder to buyer with a measured pilot, and earns bigger contracts by passing each client's vendor audit.

1. **Years 0–1: founder-led.** Interview 15 heads of drug safety. Convert two into paid pilots on Vyom Screen or Vyom Audit, scored against their own historical cases.
2. **Pass the audit before scaling.** Be ready for the questions buyers put in every RFP: who validated the system, whether R3 submissions are live, the MedDRA coding convention, QC sampling rate, medical review coverage, inspection history and the false-negative path for AI steps ([Rx Almanac](https://rxalmanac.com/articles/outsourced-pharmacovigilance-services/)).
3. **Years 1–3: Indian exporters.** Grow through referrals and industry events. Offer mid-tier Indian safety service firms the engine under their brand.
4. **Years 3–5: global.** Sell to small US and EU biotechs and virtual pharma that outsource everything. Add a US entity and an EU QPPV partner.
5. **Years 4–7: trials.** Sell trial safety to the CROs clients already use, then pre-screening at Indian sites, starting with non-metro hospitals.

## Quality, regulation and trust

In drug safety the product is trust: every automated decision must be explainable, reproducible and open to inspection like any other regulated process.

- **Rules Vyom builds to.** US postmarketing reporting (21 CFR 314.80), electronic records (21 CFR Part 11), ICH E2B(R3), EU good pharmacovigilance practice, CDSCO's guidance for marketing authorisation holders, and the CIOMS XIV principles for AI.
- **Locked models, not weekly retraining.** Each model version is validated against a regression suite and released under change control. Learning from reviewer edits happens between releases.
- **Humans own the judgments.** Causality, final seriousness and medical review stay with qualified people; automation handles intake, coding suggestions and drafting.
- **Proven recall before auto-closure.** Nothing is closed automatically until recall is proven on the client's own history, then checked with ongoing QC samples. A missed valid case is a reporting failure.
- **An audit trail on every decision.** Input, model version, probability, threshold, reviewer and outcome are logged for inspectors.
- **Data protection.** DPDP in India, GDPR in the EU and HIPAA where US patient data appears. Client data is never pooled across clients without written permission.
- **Certifications (targets).** ISO 27001 by year 2 and SOC 2 by year 3.

## Team and hiring

Vyom needs a drug-safety co-founder before it needs money: a technical founder alone cannot pass a pharma vendor audit.

| Role | When | Why |
| --- | --- | --- |
| Technical founder: AI, backend, security | Now | Builds the engine, the audit trail and data protection |
| Drug-safety co-founder (MD or PharmD, 10+ years, QPPV-level) | Before any pilot | Owns medical judgment, SOPs and client trust |
| Two engineers (ML, backend) | Year 1 | Engine, E2B(R3) output, validation tooling |
| Senior case processor and medical reviewer | Year 1 | Reviews exceptions, writes the decision rubrics |
| Quality and validation lead | Year 2 | System validation, client audits, corrective actions |
| Business development lead with pharma relationships | Year 2 | Pipeline beyond the founders' network |
| Head of clinical operations | Year 4 | Trial safety and Vyom Recruit |

- **Advisors to recruit early:** a former regulator or inspector, a practising QPPV, a hospital research head and a pharma executive.
- **Founder transition:** keep a salaried job until the co-founder signs and two paid pilots start.

## 10-year roadmap

Vyom climbs one rung at a time: India first, global next, trials last, each step unlocked by proof.

&#91;embedded content: Vyom roadmap · 5 phases and 4 gates, 2026–2036\]

A failed gate extends its phase; money is raised only after a gate is passed (see Funding plan).

## Financial plan

The base case builds a profitable company of about $33M revenue by 2036; only the ambitious case nears unicorn scale.

&#91;embedded content: Vyom financial model · three scenarios, 2027–2036, US$\]

Every case starts slowly: revenue stays under $6M a year through 2030, because pharma buys slowly and audits come first.

| Scenario | Break-even year (EBITDA) | Peak funding need | Gross margin, 2036 | EBITDA margin, 2036 | Value at 5–10x 2036 revenue |
| --- | --- | --- | --- | --- | --- |
| Conservative | 2034 | $2.3M | 62% | 24% | $35–71M |
| Base | 2032 | $2.9M | 70% | 39% | $167–335M |
| Ambitious | 2032 | $4.7M | 75% | 38% | $0.54–1.08B |

What each case assumes for 2036 (clients × annual contract value):

| Line of business | Conservative | Base | Ambitious |
| --- | --- | --- | --- |
| Indian exporters | 27 × $125K | 50 × $180K | 84 × $235K |
| Global biotechs | 7 × $320K | 32 × $460K | 88 × $580K |
| CRO trial safety | 6 × $250K | 18 × $380K | 54 × $500K |
| Recruit programmes | 4 × $130K | 32 × $200K | 86 × $270K |
| Operating costs | $2.7M | $10.5M | $40M |

- **Method.** Revenue = average clients in the year × contract value. Gross margin rises with automation; operating costs assume an India-based team. Year 1 is 2027 and assumes founders draw little or no salary; tax, currency moves and dilution are left out.
- **What decides the outcome.** The automation rate sets the margin. Global biotech clients carry the upside: about 40% of 2036 revenue in the base and ambitious cases.
- **Valuation.** The 5–10x multiples are assumptions. If Vyom stays services-heavy, expect the low end or below.

## Funding plan

Raise in steps, each unlocked by proof. The base case needs about $2.9M of cumulative funding before it turns cash-positive in 2032; the ambitious case about $4.7M (see Financial plan).

| Stage | When | Amount (indicative) | Unlocked by |
| --- | --- | --- | --- |
| Founders and angels | Now to 2027 | ₹1–1.5 crore, about the base case's first-year cost | Co-founder signed; first pilot scoped |
| Seed | 2028 | $2–3M | Two paying clients, a validated automation rate, one passed client audit |
| Series A | 2029–2030 | $8–12M | About $2M revenue, gross margin above 50%, first global clients |
| Series B (only for trials) | 2031–2032 | $20M+ | Trial safety live with 3+ CROs; Recruit pilots at Indian sites |

- **Why raise more than the minimum.** The model assumes Indian delivery costs and on-time sales. A US sales team or slow audits raise the cash need, so a Series A buys speed and a buffer.
- **Who funds this space.** Insight Partners and Bessemer backed Graph AI ([BioSpectrum](https://www.biospectrumindia.com/article/pdf/28461)); ARCH and General Catalyst backed Paradigm ([Digital Health News](https://www.digitalhealthnews.com/paradigm-health-partners-with-roche-to-advance-ai-driven-clinical-trial-enrollment)).
- **Currency.** Rupee amounts assume about ₹95 per dollar, the mid-October 2026 rate ([LongForecast](https://longforecast.com/usd-to-inr-forecast-2017-2018-2019-2020-2021-indian-rupee)); the model is in US dollars.

## Risks

The biggest risks are people, trust and focus, not technology. Each one below has a mitigation that starts in year one.

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| No drug-safety co-founder | High | Fatal | First kill test: no committed co-founder by day 90 means pause. Offer real equity, not an advisor title. |
| AI misses a serious case | Medium | Severe | No auto-closure until recall is proven on each client's data. Humans own seriousness, causality and medical review. Locked model versions; professional indemnity cover. |
| Graph AI or incumbents bundle the same AI | High | High | Start where they don't focus: mid-sized Indian exporters and small biotechs. Price on outcomes; win on audit readiness and speed. |
| Slow sales and vendor audits | High | Medium | Lead with low-risk offers (literature screening, R3 readiness, audits). Plan for 6–12 month sales cycles; keep costs low until revenue arrives. |
| US tariff plan on Indian generics (100% from August 2028, 200% from 2029) | Medium | High | Sell savings to exporters under margin pressure. Win global biotech clients by year 3 so no single market dominates. |
| Services trap: becoming a cheaper BPO | High | High | Track automation rate and gross margin monthly. Price per case or outcome, never per head. Refuse custom work that doesn't improve the product. |
| Dependence on Jev or any single model | Medium | Medium | Keep the decision layer model-agnostic and rerun the benchmark before any model change. Jev is early-access and weak on numbers, dates and adversarial text. |
| Data breach (India's DPDP Act, GDPR, HIPAA) | Medium | Severe | ISO 27001 by year 2, SOC 2 by year 3, de-identify before any external API, keep client data in-region. The founder's security background is a real advantage here. |
| Trials market in India is small (2–3% of global trials) | High | Medium | Sell trial safety to global CROs from India. Treat Recruit as an option, not the base plan. |
| Founder time alongside a job | High | High | A fixed 90-day plan with kill tests. Go full-time only after two paid pilots. |
| Regulators tighten rules on AI in safety work | Low | Medium | Build to CIOMS XIV principles and 21 CFR Part 11 from day one; keep validation packs current. |

## Kill tests and first 90 days

The first 90 days decide whether Vyom should exist. Spend little money and collect evidence; failing a test early is cheaper than failing slowly.

| Test (by day 90) | Pass mark | If it fails |
| --- | --- | --- |
| Co-founder | A senior drug-safety professional commits to join for equity | Pause. Do not build without one. |
| Demand | At least 3 of 15 heads of safety say they would pay at the target price | Stop, or test one other wedge (R3 readiness or audits) for 60 more days |
| Accuracy | At least 95% recall on finding adverse-event reports in the public benchmark, with expert-checked labels | Rethink the technical approach before selling anything |
| Pilots | Two paid pilots or signed letters of intent | Extend once by 60 days, then stop |

### Days 1–30: people and proof of pain

- [ ] List 40 senior drug-safety professionals (heads of safety, former QPPVs, safety physicians) and meet at least 10 as co-founder candidates.
- [ ] Interview 15 heads of safety at Indian exporters and small biotechs: case volumes, cost per case, current vendors, audit findings, R3 plans.
- [ ] Download the benchmark data: ADE Corpus (literature sentences labelled for adverse drug events) and VAERS (public reports with free text, seriousness flags and MedDRA codes).

### Days 31–60: build and measure

- [ ] Build a Vyom Screen prototype for literature screening: does this article contain a valid case, and is it serious?
- [ ] Have a drug-safety expert label 500 items; measure recall and precision with Jev and one other model.
- [ ] Draft the validation pack a client auditor would ask for: intended use, test data, acceptance criteria.
- [ ] Show a priced offer to the heads of safety you interviewed.

### Days 61–90: sell

- [ ] Run two paid pilots or sign two letters of intent.
- [ ] Agree co-founder equity and vesting.
- [ ] Hold the go, pause or pivot review against the kill tests above.

## Sources

Pages opened for this plan. Financial figures come from Vyom's own model; every input there is an assumption to test.

- Regulation: [FDA sets October deadline for new safety reporting format (RAPS)](https://www.raps.org/resource/fda-sets-october-deadline-for-new-safety-reporting-format.html) · [CDSCO's 2026 order strengthens ADR monitoring (Pharmuni, citing The Economic Times)](https://pharmuni.com/news/cdscos-2026-order-strengthens-adr-monitoring-are-indias-pv-teams-ready-now/) · [CIOMS Working Group XIV: AI in pharmacovigilance](https://cioms.ch/working_groups/working-group-xiv-artificial-intelligence-in-pharmacovigilance/)
- Market: [Pharmacovigilance market, Mordor Intelligence (via GII)](https://www.giiresearch.com/report/moi2122184-pharmacovigilance-market-share-analysis-industry.html) · [Outsourced pharmacovigilance services (Rx Almanac)](https://rxalmanac.com/articles/outsourced-pharmacovigilance-services/) · [Clinical trial patient recruitment services market (Roots Analysis)](https://www.rootsanalysis.com/reports/clinical-trial-patient-recruitment-services-market/245.html)
- Competition and funding: [Graph AI raises $13.3M (BioSpectrum)](https://www.biospectrumindia.com/news/20/28461/graph-ai-raises-13-3-m-to-accelerate-expansion-across-us-and-europe.html) · [Paradigm partners with Roche on AI trial enrolment (Digital Health News)](https://www.digitalhealthnews.com/paradigm-health-partners-with-roche-to-advance-ai-driven-clinical-trial-enrollment)
- India: [India's clinical research ambitions need more than regulatory reforms (Indian Pharma Post)](https://www.indianpharmapost.com/clinical-trials/indias-clinical-research-ambitions-need-more-than-regulatory-reforms-experts-20760) · [India pharma exports and the US tariff plan (SAHI)](https://www.sahi.com/blogs/india-pharma-exports-2030-target-cut) · [Drug safety associate salary in India (Payscale)](https://www.payscale.com/research/IN/Job=Drug_Safety_Associate/Salary) · [USD to INR rate (LongForecast)](https://longforecast.com/usd-to-inr-forecast-2017-2018-2019-2020-2021-indian-rupee)
- Technology: [TypeSafe AI launches Jev (VKTR)](https://www.vktr.com/ai-platforms/chatgpt-cocreator-launches-typesafe-ai-with-jev/) · [TypeSafe docs: introduction](https://docs.typesafe.ai/introduction.md) · [TypeSafe docs: jev-1.13 known weaknesses](https://docs.typesafe.ai/model-jaggedness/jev-1.13.md)
