import { 
  MiningDocument, 
  ProductionRecord, 
  GeologicalRecord, 
  ExtractedEntity, 
  TopicItem, 
  WordCloudItem, 
  AuditLogEntry, 
  PerformanceMetrics,
  GeneratedReport,
  User
} from '../src/types';
import { 
  INITIAL_DOCUMENTS, 
  STRUCTURED_PRODUCTION_RECORDS, 
  STRUCTURED_GEOLOGICAL_RECORDS, 
  TOPIC_ITEMS, 
  WORD_CLOUD_ITEMS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_METRICS,
  DEMO_USERS
} from '../src/data/seedData';

class DatabaseStore {
  public documents: MiningDocument[] = [];
  public productionRecords: ProductionRecord[] = [];
  public geologicalRecords: GeologicalRecord[] = [];
  public topics: TopicItem[] = [];
  public wordCloud: WordCloudItem[] = [];
  public auditLogs: AuditLogEntry[] = [];
  public reports: GeneratedReport[] = [];
  public metrics: PerformanceMetrics = { ...INITIAL_METRICS };
  public users: User[] = [...DEMO_USERS];

  constructor() {
    this.resetToSeed();
  }

  public resetToSeed() {
    this.documents = JSON.parse(JSON.stringify(INITIAL_DOCUMENTS));
    this.productionRecords = JSON.parse(JSON.stringify(STRUCTURED_PRODUCTION_RECORDS));
    this.geologicalRecords = JSON.parse(JSON.stringify(STRUCTURED_GEOLOGICAL_RECORDS));
    this.topics = JSON.parse(JSON.stringify(TOPIC_ITEMS));
    this.wordCloud = JSON.parse(JSON.stringify(WORD_CLOUD_ITEMS));
    this.auditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
    this.metrics = { ...INITIAL_METRICS };
    this.reports = [
      {
        id: 'rep_demo_01',
        title: 'CIL Pan-India Production & Geological Reserve Briefing (FY 2020-2024)',
        reportType: 'Consolidated Performance Dossier',
        reportingPeriod: 'FY 2020 - FY 2024',
        subsidiary: 'All Subsidiaries',
        createdAt: '2024-05-02T15:20:00Z',
        generatedBy: 'Ananya Sen (Analyst)',
        summaryStats: {
          totalProductionMt: 773.60,
          targetAchievementPct: 99.18,
          reservesAssessedMt: 18450.0,
          dataConfidenceScore: 98.4
        },
        sourceDocuments: [
          'CIL Consolidated Annual Production & Dispatch Review 2023-24',
          'SECL Gevra Mega Opencast Project - Annual Performance Dossier 2022-23',
          'CMPDI Regional Institute VII - Geological Assessment Report on Talcher Coalfield'
        ],
        sections: [
          {
            id: 'sec_1',
            title: '1. Executive Summary',
            content: 'Coal India Limited demonstrated steady recovery and acceleration, peaking at 773.60 MT in FY24 (10.0% growth YoY). Opencast mines accounted for 95.8% of total volume with composite overburden removal reaching 1,960.5 MCM. Mission Underground 100 MT is actively scaling mass production longwall faces in BCCL and ECL.'
          },
          {
            id: 'sec_4',
            title: '4. Production Overview',
            content: 'SECL and MCL remain the dominant volume drivers, contributing 187.00 MT and 206.10 MT respectively. NCL recorded 101.8% achievement with 141.52 MT feeding pithead power generation via conveyor MGRs.',
            table: {
              headers: ['Subsidiary', 'Target (MT)', 'Achieved (MT)', 'Achievement (%)', 'OB (MCM)'],
              rows: [
                ['MCL', 204.0, 206.1, '101.0%', 298.0],
                ['SECL', 197.0, 187.0, '94.9%', 328.0],
                ['NCL', 139.0, 141.52, '101.8%', 476.2],
                ['CCL', 84.0, 86.05, '102.4%', 224.8],
                ['WCL', 67.0, 67.85, '101.3%', 312.5],
                ['BCCL', 41.0, 41.1, '100.2%', 168.4],
                ['ECL', 39.5, 38.12, '96.5%', 142.6]
              ]
            }
          },
          {
            id: 'sec_6',
            title: '6. Geological & Reserve Information',
            content: 'CMPDI exploration in Talcher Coalfield categorized 18,450 MT under Proved category. Barakar Seam II offers 18.6m average thickness with favorable stripping ratios.'
          },
          {
            id: 'sec_10',
            title: '10. Anomalies & Conflict Detection',
            content: 'SECL Gevra 2022-23 records flagged a variance: Field operational estimates logged 52.5 MT while statutory audited statements finalized at 50.80 MT due to pithead calibration.'
          }
        ]
      }
    ];
  }

  // Audit Logging
  public logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const log: AuditLogEntry = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
    return log;
  }

  // All extracted entities across all documents
  public getAllEntities(): ExtractedEntity[] {
    const list: ExtractedEntity[] = [];
    for (const doc of this.documents) {
      if (doc.entities && doc.entities.length > 0) {
        list.push(...doc.entities);
      }
    }
    return list;
  }

  public updateEntityStatus(
    entityId: string, 
    status: 'APPROVED' | 'REJECTED' | 'EDITED', 
    updatedValue?: string | number,
    analystComment?: string
  ): ExtractedEntity | null {
    for (const doc of this.documents) {
      const ent = doc.entities?.find(e => e.id === entityId);
      if (ent) {
        ent.validationStatus = status;
        if (updatedValue !== undefined) {
          ent.entityValue = updatedValue;
          if (typeof updatedValue === 'number') {
            ent.normalizedValue = updatedValue;
          }
        }
        if (analystComment) {
          ent.analystComment = analystComment;
        }

        // If it was a conflict or unverified production record, update corresponding production record
        if (ent.entityKey.toLowerCase().includes('gevra') && typeof updatedValue === 'number') {
          const pr = this.productionRecords.find(p => p.mineName.toLowerCase().includes('gevra') && p.year === 2023);
          if (pr) {
            pr.achievedProductionMt = updatedValue;
            pr.validationStatus = status === 'APPROVED' ? 'VERIFIED' : 'CONFLICT';
          }
        }

        this.metrics.conflictsResolvedCount += 1;
        return ent;
      }
    }
    return null;
  }

  // Add new document
  public addDocument(doc: MiningDocument) {
    this.documents.unshift(doc);
    this.metrics.documentsProcessed += 1;
    this.metrics.pagesProcessed += doc.pageCount;
    this.metrics.tablesExtracted += doc.tables?.length || 0;
    return doc;
  }
}

export const db = new DatabaseStore();
