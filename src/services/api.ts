import { 
  MiningDocument, 
  QueryResponse, 
  TopicItem, 
  WordCloudItem, 
  AuditLogEntry, 
  PerformanceMetrics, 
  GeneratedReport, 
  ExtractedEntity, 
  User 
} from '../types';

export const api = {
  // Auth
  async login(role: string, email?: string): Promise<{ success: boolean; user: User }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, email })
    });
    return res.json();
  },

  async getUsers(): Promise<{ users: User[] }> {
    const res = await fetch('/api/users');
    return res.json();
  },

  // Documents
  async getDocuments(filters?: { subsidiary?: string; year?: string; docType?: string; search?: string }): Promise<{ documents: MiningDocument[] }> {
    const params = new URLSearchParams();
    if (filters?.subsidiary) params.append('subsidiary', filters.subsidiary);
    if (filters?.year) params.append('year', filters.year);
    if (filters?.docType) params.append('docType', filters.docType);
    if (filters?.search) params.append('search', filters.search);

    const res = await fetch(`/api/documents?${params.toString()}`);
    return res.json();
  },

  async getDocument(id: string): Promise<{ document: MiningDocument }> {
    const res = await fetch(`/api/documents/${id}`);
    return res.json();
  },

  async uploadDocument(data: {
    title: string;
    filename: string;
    fileType: string;
    subsidiary: string;
    mineName?: string;
    reportingYear: number;
    docType: string;
    textContent?: string;
  }): Promise<{ success: boolean; document: MiningDocument }> {
    const res = await fetch('/api/documents/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async reprocessDocument(id: string): Promise<{ success: boolean; document: MiningDocument }> {
    const res = await fetch(`/api/documents/${id}/process`, {
      method: 'POST'
    });
    return res.json();
  },

  // AI Query
  async queryUnified(query: string): Promise<QueryResponse> {
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    return res.json();
  },

  async querySql(sql: string): Promise<{ sql: string; rows: any[]; rowCount: number; executionTimeMs: number }> {
    const res = await fetch('/api/query/sql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql })
    });
    return res.json();
  },

  // Validation
  async getValidationEntities(): Promise<{
    allCount: number;
    pendingCount: number;
    validatedCount: number;
    pendingEntities: ExtractedEntity[];
    allEntities: ExtractedEntity[];
  }> {
    const res = await fetch('/api/validation');
    return res.json();
  },

  async actionValidationEntity(
    id: string, 
    action: 'APPROVED' | 'REJECTED' | 'EDITED', 
    updatedValue?: any, 
    comment?: string
  ): Promise<{ success: boolean; entity: ExtractedEntity }> {
    const res = await fetch(`/api/validation/${id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, updatedValue, comment })
    });
    return res.json();
  },

  // Reports
  async getReports(): Promise<{ reports: GeneratedReport[] }> {
    const res = await fetch('/api/reports');
    return res.json();
  },

  async getReport(id: string): Promise<{ report: GeneratedReport }> {
    const res = await fetch(`/api/reports/${id}`);
    return res.json();
  },

  async generateReport(payload: {
    reportType: string;
    subsidiary: string;
    mineName?: string;
    startYear?: number;
    endYear?: number;
    generatedBy?: string;
  }): Promise<{ success: boolean; report: GeneratedReport }> {
    const res = await fetch('/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Topics & Word Cloud
  async getTopics(): Promise<{ topics: TopicItem[] }> {
    const res = await fetch('/api/topics');
    return res.json();
  },

  async getWordCloud(category?: string): Promise<{ items: WordCloudItem[] }> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    const res = await fetch(`/api/wordcloud?${params.toString()}`);
    return res.json();
  },

  // Analytics
  async getProductionAnalytics(): Promise<{
    yearlyTrends: { year: number; target: number; achieved: number; growthRate: number }[];
    subsidiaryBreakdown2024: { subsidiary: string; achieved: number; target: number; color: string }[];
    productionRecords: any[];
  }> {
    const res = await fetch('/api/analytics/production');
    return res.json();
  },

  // Audit Logs & Metrics
  async getAuditLogs(filters?: { action?: string; role?: string }): Promise<{ logs: AuditLogEntry[] }> {
    const params = new URLSearchParams();
    if (filters?.action) params.append('action', filters.action);
    if (filters?.role) params.append('role', filters.role);
    const res = await fetch(`/api/audit-logs?${params.toString()}`);
    return res.json();
  },

  async getMetrics(): Promise<{ metrics: PerformanceMetrics; definitions: Record<string, string> }> {
    const res = await fetch('/api/metrics');
    return res.json();
  },

  // Re-seed demo
  async resetSeed(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/seed/reset', { method: 'POST' });
    return res.json();
  }
};
