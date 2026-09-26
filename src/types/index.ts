export type UserRole = 'ADMIN' | 'ANALYST' | 'VIEWER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  department: string;
  subsidiary: string;
}

export type DocumentType = 
  | 'ANNUAL_REPORT'
  | 'SCANNED_MINING_REPORT'
  | 'GEOLOGICAL_ASSESSMENT'
  | 'PRODUCTION_SPREADSHEET'
  | 'PARLIAMENTARY_INQUIRY'
  | 'SAFETY_COMPLIANCE_DOSSIER'
  | 'FINANCIAL_REPORT'
  | 'TECHNICAL_REPORT'
  | 'RESEARCH_REPORT'
  | 'ADMINISTRATIVE_LETTER'
  | 'CIRCULAR'
  | 'MEETING_MINUTES'
  | 'POLICY_DOCUMENT'
  | 'SPREADSHEET_DATASET'
  | 'HISTORICAL_ARCHIVE'
  | 'GENERAL_DOCUMENT'
  | 'OTHER_AUTOMATICALLY_CLASSIFIED'
  | 'UNKNOWN'
  | string;

export type DocumentStatus = 
  | 'UPLOADED'
  | 'PROCESSING'
  | 'PROCESSED'
  | 'VALIDATION_REQUIRED'
  | 'VALIDATED'
  | 'FAILED';

export interface DiscoveredKPI {
  name: string;
  value: number | string;
  unit?: string;
  category?: string;
  page?: number;
  sourceRef?: string;
  confidence?: number;
  validationState?: 'VERIFIED' | 'FLAGGED' | 'CALCULATED';
  trend?: 'UP' | 'DOWN' | 'NEUTRAL';
  changePercentage?: number;
}

export interface DiscoveredInsight {
  id: string;
  text: string;
  category: 'FACT' | 'TREND' | 'ANOMALY' | 'COMPARISON' | 'RELATIONSHIP' | 'POTENTIAL_ISSUE' | 'SUMMARY';
  confidence: number;
  sourcePage?: number;
  sourceRef?: string;
}

export interface DiscoveredVisualization {
  id: string;
  type: 'line' | 'bar' | 'donut' | 'area' | 'histogram' | 'timeline' | 'table';
  title: string;
  description?: string;
  labels: string[];
  datasets: {
    label: string;
    data: (number | string)[];
    color?: string;
  }[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  unit?: string;
  sourceRef?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'MILESTONE' | 'DECISION' | 'INCIDENT' | 'REPORT' | 'OPERATIONAL' | 'FINANCIAL' | 'GENERAL';
  sourcePage?: number;
  sourceRef?: string;
}

export interface DocumentQualityScore {
  ocrQuality: number; // 0 - 100
  readability: number; // 0 - 100
  tableAccuracy: number; // 0 - 100
  overallConfidence: number; // 0 - 100
  missingPagesDetected: boolean;
  unreadablePagesCount: number;
  isDuplicate: boolean;
  duplicateOfId?: string;
  warnings: string[];
}

export interface ExtractedTable {
  id: string;
  title: string;
  pageNumber: number;
  headers: string[];
  rows: (string | number)[][];
  confidence: number;
}

export interface DocumentChunk {
  id: string;
  pageNumber: number;
  content: string;
  sectionTitle?: string;
  embedding?: number[];
  confidence: number;
}

export interface ExtractedEntity {
  id: string;
  documentId: string;
  pageNumber: number;
  entityType: 
    | 'mine'
    | 'subsidiary'
    | 'coalfield'
    | 'year'
    | 'target_production'
    | 'achieved_production'
    | 'dispatch'
    | 'overburden_removal'
    | 'stripping_ratio'
    | 'geological_reserves'
    | 'manpower'
    | 'safety_incident'
    | 'borehole_depth'
    | 'organization'
    | 'person'
    | 'location'
    | 'technical_term'
    | 'metric'
    | 'date_event';
  entityKey: string;
  entityValue: string | number;
  unit?: string;
  normalizedValue?: number;
  normalizedUnit?: string;
  sourceText: string;
  sourceTable?: string;
  extractionMethod: 'OCR_REGEX' | 'TABULAR_PARSER' | 'GEMINI_NER' | 'STRUCTURED_CSV';
  confidence: number;
  validationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONFLICT_REQUIRES_REVIEW' | 'EDITED';
  analystComment?: string;
  timestamp: string;
}

export interface DocumentPage {
  pageNumber: number;
  ocrConfidence: number;
  isScanned: boolean;
  rawText: string;
  boundingBoxes?: {
    text: string;
    box: [number, number, number, number]; // [top, left, width, height] in percentage
    confidence: number;
  }[];
}

export interface MiningDocument {
  id: string;
  title: string;
  filename: string;
  fileHash: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'xls' | 'csv' | 'jpg' | 'jpeg' | 'png' | 'txt' | 'doc' | string;
  fileSize: number;
  documentType?: string;
  docType: DocumentType;
  category?: string;
  domain?: 'MINING' | 'GEOLOGY' | 'PRODUCTION' | 'ADMINISTRATIVE' | 'FINANCIAL' | 'INQUIRY' | 'TECHNICAL' | 'GENERAL' | 'RESEARCH' | 'LEGAL_COMPLIANCE' | 'OTHER' | string;
  language?: string;
  date?: string;
  reportingPeriod?: string;
  organization?: string;
  department?: string;
  location?: string;
  status: DocumentStatus;
  isScanned: boolean;
  pageCount: number;
  uploadedAt: string;
  processedAt?: string;
  pages: DocumentPage[];
  chunks: DocumentChunk[];
  tables: ExtractedTable[];
  entities: ExtractedEntity[];
  summary?: string;
  executiveSummary?: string;
  keyInsights?: DiscoveredInsight[];
  keyMetrics?: DiscoveredKPI[];
  visualizations?: DiscoveredVisualization[];
  timelineEvents?: TimelineEvent[];
  qualityScore?: DocumentQualityScore;
  customMetadata?: Record<string, any>;
  tags: string[];
  // Pluggable domain fields
  subsidiary?: string;
  mineName?: string;
  coalfield?: string;
  reportingYear?: number;
}

export type UniversalDocument = MiningDocument;

export interface ProductionRecord {
  id: string;
  documentId: string;
  pageNumber: number;
  subsidiary: string;
  mineName: string;
  coalfield: string;
  year: number;
  month?: string;
  targetProductionMt: number;
  achievedProductionMt: number;
  achievementPercentage: number;
  dispatchMt: number;
  overburdenRemovalMcm: number;
  strippingRatio: number; // OB / Coal
  productivityOms: number; // Output per manshift
  confidence: number;
  validationStatus: 'VERIFIED' | 'CONFLICT' | 'UNVERIFIED';
}

export interface GeologicalRecord {
  id: string;
  documentId: string;
  pageNumber: number;
  subsidiary: string;
  coalfield: string;
  blockName: string;
  provenReservesMt: number;
  indicatedReservesMt: number;
  inferredReservesMt: number;
  totalReservesMt: number;
  coalGrade: string; // e.g. G11, G13, Steel Grade-I
  avgSeamThicknessM: number;
  gasDrainagePotential: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: number;
}

export type QueryType = 'STRUCTURED' | 'UNSTRUCTURED' | 'HYBRID' | 'ANALYTICS' | 'REPORT_GENERATION';

export interface CitationSource {
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  sectionOrTable: string;
  excerpt: string;
  confidence: number;
  dataType: 'STRUCTURED_RECORD' | 'EXTRACTED_TABLE' | 'TEXT_CHUNK' | 'OCR_SCAN';
}

export interface QueryResponse {
  query: string;
  queryType: QueryType;
  answer: string;
  structuredData?: any;
  chartData?: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      color?: string;
    }[];
  };
  sqlQuery?: string;
  citations: CitationSource[];
  executionTimeMs: number;
  traceSteps: {
    step: string;
    status: 'COMPLETE' | 'RUNNING' | 'SKIPPED';
    details: string;
  }[];
  isSimulated?: boolean;
}

export interface ParliamentaryInquiry {
  id: string;
  referenceNumber: string; // e.g. "LS-PQ/Dy.No.4921/2024"
  house: 'Lok Sabha' | 'Rajya Sabha' | 'Ministry of Coal' | 'PMO Reference';
  questionType: 'Starred' | 'Unstarred' | 'Administrative Priority';
  subject: string;
  ministryDivision: string;
  urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  dueDate: string;
  assignedTo: string;
  status: 'Pending' | 'Drafted' | 'Approved' | 'Dispatched';
  queryDetails: string;
  linkedDocuments: {
    documentId: string;
    documentTitle: string;
    pageNumber: number;
    citationSnippet: string;
  }[];
  draftReply?: string;
  verifiedBy?: string;
  dispatchedAt?: string;
  createdAt?: string;
  updatedAt: string;
}

export interface DocumentComparisonResult {
  docAId: string;
  docBId: string;
  docATitle: string;
  docBTitle: string;
  metadataDiff: {
    field: string;
    valA: string | number;
    valB: string | number;
    status: 'identical' | 'different';
  }[];
  productionDeltas: {
    metric: string;
    unit: string;
    valA: number;
    valB: number;
    delta: number;
    percentChange: number;
  }[];
  entityDiff: {
    key: string;
    entityType: string;
    valA?: string | number;
    valB?: string | number;
    status: 'common' | 'only_a' | 'only_b' | 'value_diff';
  }[];
  conflictObservations: string[];
}

export interface SystemSettings {
  geminiModel: string;
  ocrEngineMode: 'HYBRID_VISION_TESSERACT' | 'TESSERACT_STRICT' | 'CLOUD_VISION';
  autoApproveConfidenceThreshold: number; // e.g. 0.95
  maxVectorChunksPerQuery: number;
  enforceSourceTraceability: boolean;
  activeOrganization: string;
  enableRealTimeAuditing: boolean;
}

export interface TopicItem {
  id: string;
  topic: string;
  description: string;
  frequency: number;
  trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  growthPercentage: number;
  keywords: string[];
  documentCount: number;
  relatedDocIds: string[];
}

export interface WordCloudItem {
  text: string;
  value: number;
  category: 'production' | 'geology' | 'safety' | 'subsidiary' | 'equipment' | 'general';
  docCount: number;
}

export interface GeneratedReport {
  id: string;
  title: string;
  reportType: string;
  reportingPeriod: string;
  subsidiary: string;
  mineName?: string;
  createdAt: string;
  generatedBy: string;
  sections: {
    id: string;
    title: string;
    content: string;
    table?: {
      headers: string[];
      rows: (string | number)[][];
    };
    chart?: any;
    citations?: string[];
  }[];
  summaryStats: {
    totalProductionMt: number;
    targetAchievementPct: number;
    reservesAssessedMt: number;
    dataConfidenceScore: number;
  };
  sourceDocuments: string[];
}

export type QueryScope = 'GLOBAL' | 'CURRENT_DOCUMENT' | 'SELECTED_DOCUMENTS' | 'CATEGORY' | 'ORGANIZATION';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 
    | 'LOGIN'
    | 'DOCUMENT_UPLOAD'
    | 'DOCUMENT_PROCESS'
    | 'DOCUMENT_DELETE'
    | 'DOCUMENT_CLASSIFY'
    | 'INSIGHT_DISCOVERY'
    | 'METRIC_VALIDATE'
    | 'CROSS_DOC_COMPARE'
    | 'SPREADSHEET_ANALYZE'
    | 'ENTITY_VALIDATION_APPROVE'
    | 'ENTITY_VALIDATION_REJECT'
    | 'ENTITY_VALIDATION_EDIT'
    | 'NATURAL_QUERY'
    | 'SQL_QUERY'
    | 'REPORT_GENERATION'
    | 'REPORT_EXPORT'
    | 'INQUIRY_CREATE'
    | 'INQUIRY_DRAFT'
    | 'INQUIRY_APPROVE'
    | 'INQUIRY_DISPATCH'
    | 'WORKSPACE_CLEAR'
    | 'BENCHMARK_LOAD'
    | 'SYSTEM_CONFIG_CHANGE';
  resourceType: 'DOCUMENT' | 'ENTITY' | 'REPORT' | 'QUERY' | 'SYSTEM' | 'INQUIRY';
  resourceId?: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILURE';
}

export interface PerformanceMetrics {
  extractionAccuracy: number;
  validationAccuracy: number;
  automationPercentage: number;
  timeReductionPercentage: number;
  manualReportTimeHours: number;
  automatedReportTimeSeconds: number;
  averageQueryResponseTimeMs: number;
  citationAccuracyScore: number;
  documentsProcessed: number;
  pagesProcessed: number;
  tablesExtracted: number;
  structuredRecordsCount: number;
  reportsGeneratedCount: number;
  conflictsResolvedCount: number;
}
