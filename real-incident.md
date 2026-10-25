## SECTION 5: COMPLIANCE, SECURITY, AND THE SOVEREIGN AI MANDATE

### 5.1 Local deployment and data sovereignty

Vyom should support a deployment model in which the application, inference services, terminology services, document store, audit records, and operational telemetry run within a hospital-controlled private cloud or on-premises environment.

A self-hosted deployment can reduce external data transfers, but it does not eliminate data-leakage risk. Security depends on the full system boundary, including administrator access, backups, remote support, update channels, telemetry, network egress, and third-party components.

#### Proposed deployment profile

| Layer | Required control |
|---|---|
| Network | Segmented application, database, inference, and administration zones |
| Identity | Role-based access control, strong authentication, privileged-access management |
| Data storage | Encryption at rest, controlled key management, encrypted backups |
| Data in transit | TLS for supported interfaces and internal service communication |
| Model inference | Locally hosted models where required; explicit control over external inference calls |
| Audit | Append-only or tamper-evident event records, access logging, monitored administrative actions |
| Operations | Controlled patching, vulnerability management, backup testing, recovery procedures |
| Integration | Allowlisted endpoints, authenticated connectors, restricted outbound traffic |
| Support | Approved maintenance access, time-bounded privileges, documented access review |
| Resilience | Defined recovery-time and recovery-point objectives, tested restoration procedures |

#### Sovereignty verification

A customer claiming that no sensitive data leaves its network should validate the claim through:

- Egress-policy inspection and network-flow monitoring.
- Packet-level or equivalent network testing.
- Review of telemetry, crash reporting, and model-serving configuration.
- Verification of backup and disaster-recovery locations.
- Software bill of materials and third-party dependency assessment.
- Review of remote-administration and update mechanisms.
- Contractual data-processing and support-access controls.

The commercial statement should be: “Designed for deployment within customer-controlled infrastructure, with configurable network-egress restrictions.” A blanket guarantee that external leakage is impossible is not defensible.

### 5.2 India Digital Personal Data Protection Act, 2023

The Digital Personal Data Protection Act, 2023, and the Digital Personal Data Protection Rules, 2025, form part of India's personal-data protection framework. The Rules were notified in November 2025 with a phased commencement structure. The implementation schedule and the provisions in force on the relevant deployment date must be confirmed from official notifications. [7]

The product should be designed to support applicable obligations rather than claim blanket compliance solely through technical features.

#### Core engineering controls

**Data minimization**
- Collect only fields required for the defined safety workflow.
- Separate operational identifiers from analytical identifiers.
- Restrict use of patient data for model training unless a separate lawful basis and appropriate governance support that use.

**Purpose and access control**
- Define the institution's purpose for each data flow.
- Restrict case-level access by role and operational need.
- Maintain appropriate processor and service-provider agreements.
- Document responsibilities between the hospital, sponsor, CRO, and Vyom.

**De-identification and masking**
- Mask direct identifiers in analytics and non-production environments.
- Apply consistent pseudonymous identifiers where longitudinal linkage is necessary.
- Protect the re-identification key separately.
- Recognize that pseudonymized or masked data may still be personal data when re-identification remains possible.

**Retention and deletion**
- Configure retention according to applicable legal, regulatory, contractual, and clinical-record obligations.
- Ensure that deletion policies cover replicas, exports, caches, backups, and derived datasets where applicable.
- Preserve records that must lawfully be retained, with documented access restrictions.

**Data-principal rights and incident handling**
- Support authorized workflows for applicable requests.
- Maintain procedures for security incident triage and legally required notifications.
- Preserve evidence for investigation and regulatory response.

**Auditability**
- Record access, export, change, approval, and administrative actions.
- Synchronize system clocks and protect timestamps.
- Use tamper-evident logging and tested retention controls.

The DPDP framework is not the only potentially applicable legal regime. Clinical-trial obligations, drug-safety regulations, medical-record rules, contractual commitments, and sector-specific requirements must also be assessed for the particular customer and deployment.

### 5.3 Clinical-trial compliance and safety reporting

Clinical-trial safety workflows must distinguish investigator reporting, sponsor assessment, ethics-committee review, regulatory reporting, and compensation-related processes where applicable.

CDSCO identifies its Serious Adverse Event division as responsible for regulatory oversight of SAEs during clinical trials and bioavailability/bioequivalence studies under the New Drugs and Clinical Trials Rules, 2019. [8]

The platform should therefore support:

- Study, protocol, site, subject, and treatment identifiers.
- Seriousness criteria and event chronology.
- Investigator assessment and sponsor assessment as distinct records.
- Causality assessment with attribution and rationale.
- Ethics-committee and regulatory reporting workflow states.
- Applicable deadlines and evidence of dispatch or acknowledgement.
- Follow-up reports and reconciliation with the original case.
- Compensation or medical-management documentation where applicable.

The exact deadline must be derived from the applicable rule, case type, role, and triggering event. It must not be hard-coded as a universal timer for all safety reports.

### 5.4 Validation and change control

Vyom's role in a regulated workflow makes software validation and controlled change management central product requirements.

The validation package should include:

- Intended-use statement and system boundary.
- User requirements and traceability to tests.
- Risk assessment for patient-safety and data-integrity hazards.
- Installation and operational qualification evidence where appropriate.
- Functional, performance, security, and integration test results.
- Model-version and terminology-version change records.
- Regression testing for coding and E2B(R3) transformations.
- Access-control and audit-trail verification.
- Incident, deviation, corrective-action, and release-management procedures.

Any AI model update that can change extracted fields, coding recommendations, prioritization, or generated regulatory content should be subject to change assessment and regression testing before production release.

### 5.5 Governance of AI-generated safety outputs

The operating model must assign accountability explicitly.

| Activity | Automation role | Required human governance |
|---|---|---|
| Document classification | Automate with measurable confidence | Review exceptions and systematic errors |
| Clinical-field extraction | Propose structured values with provenance | Confirm material or low-confidence fields |
| MedDRA/WHODrug coding | Suggest versioned candidates | Approve according to validated workflow |
| Signal screening | Prioritize potential patterns | Conduct medical and epidemiological assessment |
| ICSR compilation | Generate and validate technical structure | Approve case content and authorized release |
| Product-quality alert | Detect and route evidence | Authorized personnel decide quarantine and escalation |
| Regulatory submission | Prepare payload and capture status | Authorized submitter and accountable organization retain control |

---

## SECTION 6: IMPLEMENTATION BLUEPRINT FOR HEALTHCARE PARTNERS

### 6.1 Phase 1 — Non-commercial academic research pilot

**Objective:** establish whether Vyom can improve extraction accuracy, completeness, traceability, and processing time against a documented manual baseline.

#### Governance framework

Execute a Memorandum of Understanding (MoU) between the participating institution and the project team. The MoU should define:

- Research purpose, scope, duration, and deliverables.
- Data controller/fiduciary and processor responsibilities, as applicable.
- Ethics review and institutional approvals where required.
- Lawful access to historical records and permitted processing purposes.
- De-identification methodology and re-identification controls.
- Approved deployment environment and access permissions.
- Prohibition on unauthorized external transmission or model training.
- Data retention, deletion, and breach-response arrangements.
- Publication rights, intellectual property, and disclosure of limitations.
- No effect on current clinical care or regulatory reporting decisions.

A retrospective study may still require ethics, institutional, privacy, and legal review. De-identification alone should not be treated as a universal exemption from these requirements.

#### Pilot design

1. Select a bounded sample of historical safety cases with representative document types.
2. Establish a reference dataset adjudicated by qualified PV reviewers.
3. Record the existing workflow, staffing assumptions, and handling times.
4. Process the same records through Vyom in an isolated environment.
5. Compare outputs at field level and case level.
6. Review every critical discrepancy and classify its severity.
7. Re-run the assessment after corrections to measure improvement.
8. Produce a signed validation report and a decision on whether to proceed.

#### Minimum evaluation metrics

| Metric | Measurement |
|---|---|
| Critical-field extraction accuracy | Precision and recall for defined fields |
| Case validity | Agreement with qualified adjudicators |
| MedDRA coding agreement | Agreement at LLT and PT levels |
| Product identification accuracy | Correct mapping and unresolved-match rate |
| Duplicate detection | Precision, recall, and false-match review |
| E2B(R3) schema validation | Percentage of generated messages passing applicable schemas |
| Completeness | Required-field and consistency-rule results |
| Processing time | Baseline versus Vyom, using equivalent start/end definitions |
| Human correction burden | Number and severity of corrections per case |
| Auditability | Percentage of outputs with complete source provenance and change history |

Acceptance thresholds should be agreed before testing. A high average accuracy score must not conceal a critical error involving a suspect medicine, serious event, patient identity, or reporting deadline.

#### Phase 1 deliverables

- Pilot protocol and data-flow diagram.
- Data-protection and access-control assessment.
- Annotated reference dataset.
- Baseline-versus-Vyom results.
- Error taxonomy and corrective-action plan.
- Security and deployment assessment.
- Recommendations for a controlled operational pilot.

### 6.2 Phase 2 — Public institutional procurement and tender specifications

**Objective:** enable a public hospital or medical institution to procure a verifiable safety-workflow platform through objective, interoperable technical requirements.

Potential stakeholders include SMS Medical College and Hospital, Jaipur, Government Medical College-associated hospitals in Kota, and other institutions with relevant safety-monitoring or research operations. No institutional commitment or procurement intent is assumed.

#### Procurement approach

Tender requirements should specify measurable outcomes and interoperability rather than mandate a vendor-specific architecture or create unjustified technical lock-in. The procurement must follow the institution's applicable public-procurement rules.

Suggested requirements include:

- Support for approved, documented data-import interfaces.
- Traceable source evidence for extracted safety fields.
- Version-controlled MedDRA and appropriately licensed product terminology.
- E2B(R3) XML generation and validation against defined specifications.
- Audit records with controlled access and exportability.
- On-premises or customer-controlled private-cloud deployment options.
- Configurable network-egress restrictions.
- Role-based access control and administrative logging.
- Defined service levels for agreed workloads.
- Tested backup, restoration, and incident-response procedures.
- Security testing, vulnerability disclosure, and patch-management obligations.
- Data export and migration provisions to avoid vendor lock-in.
- Acceptance tests using institution-approved reference cases.
- Documentation, training, support, and exit-assistance obligations.

#### Example acceptance criteria

| Requirement | Proposed acceptance test |
|---|---|
| XML generation | Agreed reference cases compile and pass the specified schema and business-rule tests |
| Source traceability | A reviewer can navigate from selected output fields to supporting source evidence |
| Coding quality | Results meet the agreed validation thresholds against adjudicated reference cases |
| Latency | Defined workload meets agreed p50/p95/p99 targets on specified infrastructure |
| Audit history | Test users can reconstruct record creation, changes, approvals, and exports |
| Data egress | Network testing confirms that unapproved outbound data paths are blocked |
| Recovery | Backup restoration meets the contracted recovery objectives |
| Interoperability | Approved test imports and exports pass without undocumented proprietary dependencies |

The sub-100-millisecond compilation target may be included only for the defined normalized-record validation and serialization stage. OCR, AI inference, complete case processing, and human review should have separate service levels.

### 6.3 Phase 3 — Private-sector commercialization

**Objective:** deploy Vyom as an additional safety-operations capability in private hospital networks, pharmaceutical companies, CROs, or PV service providers.

Potential prospects may include large hospital networks and research institutions in Rajasthan and other Indian markets. Any named organization should be treated as a prospective account, not an existing partner or confirmed customer.

#### Initial commercial use cases

Prioritize one of the following, based on the prospect's measured pain:

1. **PV case intake and quality control:** reduce manual transcription and rework.
2. **Clinical-trial safety workflow support:** improve chronology, completeness, review tracking, and deadline visibility.
3. **Literature triage:** prioritize relevant records for qualified safety review.
4. **Product-quality intelligence:** link complaints, batch identifiers, and related safety cases.
5. **Audit preparation:** produce traceable evidence and exception reports.

#### Commercial model

A fixed subscription or per-case software fee is preferable for early deployments because the service can be measured independently of clinical outcomes.

| Model | Commercial basis | Principal considerations |
|---|---|---|
| Fixed pilot fee | Agreed scope, duration, and acceptance criteria | Predictable procurement and evaluation |
| Annual software licence | Institution, site, module, or capacity tier | Requires defined usage and support limits |
| Per-case fee | Number of cases processed under agreed definitions | Requires clear treatment of duplicates, follow-ups, and failed inputs |
| Managed service | Software plus defined operational support | Requires explicit responsibilities and service boundaries |
| Outcome-linked component | Verified savings or agreed operational improvements | Requires an auditable baseline, attribution rules, and caps |

An unconditional “zero-risk, pay-per-outcome” promise is not recommended. It can create disputes over attribution, encourage unsafe shortcuts, and make commercial obligations dependent on clinical outcomes outside the vendor's control.

A more defensible arrangement is a fixed-price pilot with a limited, measurable performance component tied to operational metrics such as processing time, extraction accuracy, or rework reduction. Clinical risk reduction should not be priced as though the software can guarantee it.

#### Illustrative commercial validation plan

The following figures are negotiation hypotheses, not market-verified rates:

- A bounded pilot with a fixed fee and explicit acceptance tests.
- A production licence based on site count, annual case volume, required modules, and support tier.
- Separate pricing for dedicated infrastructure, premium integrations, and specialist validation work.
- A capped performance-linked fee only after the baseline and measurement method have been independently agreed.

Pricing should reflect the customer's actual case volume, deployment environment, integration burden, validation requirements, and the cost of licensed data and terminology.

### 6.4 Proposed 12-month market-entry sequence

| Period | Priority | Exit criterion |
|---|---|---|
| Months 1–2 | Product definition, regulatory mapping, source-data permissions, and validation protocol | Agreed intended use and measurable acceptance criteria |
| Months 3–4 | Retrospective pilot and benchmark dataset | Independent comparison against manual reference results |
| Months 5–6 | Security review, deployment hardening, and integration testing | Approved deployment and remediation of critical findings |
| Months 7–9 | Controlled operational pilot with defined human review | Evidence of reliability, workflow adoption, and measurable operational benefit |
| Months 10–12 | Commercial packaging, support model, and reference deployment | Customer-approved case study or independently reviewable results, subject to consent |

This is a proposed sequence, not a commitment that procurement, institutional approvals, validation, or commercialization will complete within those periods.

### 6.5 Market-entry decision gates

Proceed to a production deployment only when:

- The institution has approved the intended use and data-processing arrangement.
- Applicable ethics, privacy, and legal requirements have been addressed.
- Reference-data licensing is resolved.
- Critical extraction and coding errors meet agreed thresholds.
- E2B(R3) outputs pass the defined validation suite.
- Auditability and role-based access are verified.
- Operational fallback and human-review procedures are documented.
- The customer has accepted the deployment, support, and incident-response model.

