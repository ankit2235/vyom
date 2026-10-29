/**
 * The public-source record model behind /intelligence.
 *
 * Every statement points at the sources it came from and says how strong that
 * support is. Nothing here is sample data: each source was read by hand on the
 * date in `retrievedOn`, and a record may only say what its sources say.
 */

/** ISO date, `YYYY-MM-DD`. */
export type IsoDate = string;

export type SourceKind = 'official' | 'media';

export type Source = {
  readonly id: string;
  /** Who published it: "The Times of India", "World Health Organization". */
  readonly outlet: string;
  readonly title: string;
  readonly url: string;
  readonly kind: SourceKind;
  readonly publishedOn: IsoDate;
  readonly byline?: string;
  /** Set for documents that are not web pages. */
  readonly format?: 'pdf';
  /** The day a person actually opened and read the source. Never a guess. */
  readonly retrievedOn: IsoDate;
};

/**
 * How a record entered Vyom. Only `historical-case` exists today; the others
 * are named so the UI can say plainly that they are not connected.
 */
export type RecordOrigin =
  | 'live-monitoring'
  | 'recently-published'
  | 'historical-case'
  | 'hospital-integrated'
  | 'manual-entry';

export type Category =
  | 'drug-quality'
  | 'substandard-or-falsified'
  | 'adverse-event'
  | 'regulatory-action'
  | 'literature-or-signal'
  | 'official-alert';

/** Record-level labels. Each must be true of the record's sources. */
export type EvidenceStatus =
  | 'official-alert'
  | 'reported-by-media'
  | 'historical-case'
  | 'under-investigation'
  | 'distribution-verified'
  | 'potential-link-unverified'
  | 'causality-not-established';

/**
 * How well a single statement is supported:
 * - `official`        — stated in an official document we read directly.
 * - `corroborated`    — reported by two or more independent outlets.
 * - `reported`        — reported by one outlet only.
 * - `not-established` — the sources say this is unknown or was not shown.
 */
export type Basis = 'official' | 'corroborated' | 'reported' | 'not-established';

export type Statement = {
  readonly text: string;
  readonly basis: Basis;
  readonly sourceIds: readonly string[];
  /** A short verbatim excerpt, when the exact words matter. */
  readonly quote?: string;
};

export type PartyRole =
  | 'manufacturer'
  | 'distributor'
  | 'laboratory'
  | 'hospital'
  | 'regulator'
  | 'investigator';

export type Party = {
  readonly role: PartyRole;
  readonly name: string;
  readonly place?: string;
  readonly basis: Basis;
  readonly sourceIds: readonly string[];
  /** What the sources say this party did or had done to it. */
  readonly note?: string;
};

export type Batch = {
  readonly batch: string;
  readonly manufactured?: string;
  readonly expires?: string;
  readonly finding?: string;
  readonly basis: Basis;
  readonly sourceIds: readonly string[];
};

export type Product = {
  readonly name: string;
  readonly form: string;
  readonly activeIngredients: readonly string[];
  /** Exactly as the source lists them. Empty when no batch was published. */
  readonly batches: readonly Batch[];
  /** Shown when `batches` is empty, so the gap is stated rather than hidden. */
  readonly batchNote?: string;
};

export type TimelineKind = 'clinical' | 'testing' | 'regulatory' | 'investigation';

export type TimelineEvent = {
  /** When it happened. `null` when no source states the date. */
  readonly date: IsoDate | null;
  /** The sources' own precision: "25 May 2026", "May 2026", "Date not stated". */
  readonly dateLabel: string;
  readonly kind: TimelineKind;
  readonly title: string;
  readonly detail?: string;
  readonly basis: Basis;
  readonly sourceIds: readonly string[];
};

/** One product presentation and what is known about its batch. */
export type BatchLane = {
  readonly label: string;
  /** `null` until a source publishes it. Never inferred from a brand name. */
  readonly batchNumber: string | null;
  readonly facts: readonly Statement[];
  readonly unknowns: readonly string[];
};

export type LinkStatus = 'documented' | 'reported' | 'not-established';

/** One step in the movement of product, and what supports it. */
export type DistributionLink = {
  readonly from: string;
  readonly to: string;
  readonly item: string;
  readonly quantity?: string;
  readonly status: LinkStatus;
  readonly sourceIds: readonly string[];
  readonly note?: string;
};

/** Two documented quantities that should agree. The difference is computed, not typed. */
export type QuantityCheck = {
  readonly label: string;
  readonly inLabel: string;
  readonly inQty: number;
  readonly outLabel: string;
  readonly outQty: number;
  readonly explanation: string;
  readonly sourceIds: readonly string[];
};

/**
 * Map marker states. The first six describe possible exposure to the product;
 * the last two mark places that matter for other reasons and must never be
 * read as exposure.
 */
export type MarkerState =
  | 'verified-batch'
  | 'reported-distribution'
  | 'potential-exposure'
  | 'investigation-pending'
  | 'not-established'
  | 'ruled-out'
  | 'investigation-site'
  | 'supply-origin';

export type MapPlace = {
  readonly id: string;
  readonly name: string;
  readonly region: string;
  /** Approximate city-centre coordinates, used only to position the marker. */
  readonly lat: number;
  readonly lon: number;
  readonly state: MarkerState;
  readonly role: string;
  readonly when: string;
  readonly batchEvidence: string;
  readonly evidence: readonly Statement[];
};

/** How a relationship in the supply-chain graph is supported. */
export type EdgeStatus = 'verified' | 'reported' | 'inferred' | 'unverified';

export type GraphStage =
  | 'manufacturer'
  | 'batch'
  | 'distributor'
  | 'wholesaler'
  | 'hospital'
  | 'administration'
  | 'report';

export type GraphNode = {
  readonly id: string;
  readonly stage: GraphStage;
  /** 0 = top lane, 1 = bottom lane, 0.5 = shared by both. */
  readonly lane: 0 | 0.5 | 1;
  readonly label: string;
  readonly sub: string;
  /** False for placeholders the sources do not name or document at all. */
  readonly known: boolean;
  readonly facts: readonly Statement[];
  readonly quantities?: readonly { readonly label: string; readonly value: string; readonly sourceIds: readonly string[] }[];
  /** Documents an investigator would need that no source provides. */
  readonly missing: readonly string[];
  readonly conflicts?: readonly string[];
};

export type GraphEdge = {
  readonly from: string;
  readonly to: string;
  readonly status: EdgeStatus;
  readonly note: string;
  readonly sourceIds: readonly string[];
};

export type ComparisonCell = {
  readonly text: string;
  /** `missing` cells are shown as gaps, never as blanks. */
  readonly state: 'reported' | 'missing';
  readonly sourceIds: readonly string[];
};

export type Comparison = {
  readonly columns: readonly { readonly label: string; readonly sub: string }[];
  readonly rows: readonly { readonly label: string; readonly cells: readonly ComparisonCell[] }[];
  readonly similar: readonly string[];
  readonly different: readonly string[];
  readonly missing: readonly string[];
};

export type Workspace = {
  readonly batchLanes: readonly BatchLane[];
  readonly batchConflict?: string;
  readonly distribution: readonly DistributionLink[];
  readonly quantityCheck?: QuantityCheck;
  readonly clinical: {
    /** What records exist, stated plainly before any detail. */
    readonly availability: string;
    readonly items: readonly Statement[];
  };
  /** Suggestions for a qualified reviewer. Never decisions. */
  readonly reviewSteps: readonly string[];
  /** Retrospective illustration: how Vyom could organise each record type. */
  readonly support: readonly { readonly area: string; readonly how: string; readonly here: string }[];
  readonly map: {
    readonly places: readonly MapPlace[];
    /** Things the sources mention that cannot honestly be placed on a map. */
    readonly unplaced: readonly Statement[];
  };
  readonly graph: { readonly nodes: readonly GraphNode[]; readonly edges: readonly GraphEdge[] };
  readonly comparison: Comparison;
};

export type HistoryKind = 'source-read' | 'created' | 'classified' | 'correction';

export type IntelRecord = {
  readonly slug: string;
  readonly title: string;
  readonly origin: RecordOrigin;
  readonly categories: readonly Category[];
  readonly statuses: readonly EvidenceStatus[];
  readonly products: readonly Product[];
  readonly location: {
    readonly city?: string;
    readonly state?: string;
    readonly country: string;
    readonly note?: string;
  };
  /** When the events happened, in the sources' own precision. */
  readonly eventDate: { readonly label: string; readonly sourceIds: readonly string[] };
  readonly summary: string;
  readonly whyItMatters: string;
  readonly parties: readonly Party[];
  readonly statements: readonly Statement[];
  readonly gaps: readonly string[];
  readonly sourceIds: readonly string[];
  /** Record history. Corrections are appended, never overwritten. */
  readonly history: readonly { readonly on: IsoDate; readonly kind: HistoryKind; readonly change: string }[];
  /** Reports and actions in order. Any record may have one. */
  readonly timeline?: readonly TimelineEvent[];
  /** Shown above the products: what the sources do and do not say is affected. */
  readonly scopeNote?: string;
  readonly healthConcerns?: readonly Statement[];
  readonly actions?: readonly Statement[];
  /** The full investigation workspace, for records that have one. */
  readonly workspace?: Workspace;
};

/** One row of an official alert, transcribed from the original document. */
export type AlertRow = {
  /** The row number in the original document, so an excerpt can be checked. */
  readonly sNo: number;
  readonly product: string;
  readonly batch: string;
  readonly manufactured: string;
  readonly expiry: string;
  /** As listed. Addresses are shortened to the town. */
  readonly manufacturer: string;
  readonly reason: string;
  /** Who drew the sample, or which laboratory reported it. */
  readonly reportedBy: string;
};

export type AlertKind = 'spurious' | 'nsq';

export type OfficialAlert = {
  readonly id: string;
  /** Exactly as the issuing authority titles it. */
  readonly title: string;
  readonly authority: string;
  readonly kind: AlertKind;
  /** The release date shown on the authority's listing page. */
  readonly publishedOn: IsoDate;
  readonly documentUrl: string;
  readonly listingUrl: string;
  readonly retrievedOn: IsoDate;
  /** How many rows the original document lists. */
  readonly totalRows: number;
  readonly rows: readonly AlertRow[];
  /** Present when only some rows are shown: which ones, and why. */
  readonly excerpt?: string;
  /** What the document itself says is done with the listed batches. */
  readonly action: string;
  /** Text the document repeats for every row, shown once. */
  readonly rowNote?: string;
};
