import React from 'react';
import { 
  FileText, 
  Layers, 
  CheckCircle2, 
  Zap, 
  Clock, 
  ArrowUpRight, 
  ShieldAlert, 
  TrendingUp, 
  FileUp, 
  Search, 
  BarChart3, 
  FileSignature,
  Database,
  RefreshCcw,
  Eye,
  AlertTriangle,
  Landmark,
  Compass,
  FileSpreadsheet,
  Cpu,
  Sparkles,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { PerformanceMetrics, MiningDocument, AuditLogEntry } from '../types';

interface DashboardTabProps {
  metrics: PerformanceMetrics;
  documents: MiningDocument[];
  auditLogs: AuditLogEntry[];
  productionRecords?: any[];
  setActiveTab: (tab: string) => void;
  onOpenViewer: (docId: string) => void;
  onLoadBenchmark?: () => Promise<void>;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  metrics,
  documents,
  auditLogs,
  productionRecords = [],
  setActiveTab,
  onOpenViewer,
  onLoadBenchmark
}) => {
  // Empty State Guard
  if (documents.length === 0) {
    return (
      <div className="space-y-6">
        {/* Top Operational Notice */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <h2 className="text-base font-bold text-white">Universal Document Intelligence & Knowledge Repository</h2>
            </div>
            <p className="text-xs text-slate-400">
              Universal document processing, OCR tabular extraction, semantic classification, RAG retrieval, and adaptive analytics.
            </p>
          </div>
        </div>

        {/* Empty Workspace Hero */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-slate-800 text-amber-400 mx-auto mb-4 flex items-center justify-center border border-slate-700">
            <Database className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Documents Ingested Yet</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto mb-6 leading-relaxed">
            The document repository is empty and awaiting files. You can upload any organizational document (PDF, scanned PDF, DOCX, XLSX, CSV, TXT, or images) to automatically extract metadata, discover KPIs, generate charts, and ask questions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('upload')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg cursor-pointer"
            >
              <FileUp className="w-4 h-4" />
              <span>Upload Documents Now</span>
            </button>

            {onLoadBenchmark && (
              <button
                onClick={onLoadBenchmark}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition cursor-pointer"
              >
                <RefreshCcw className="w-4 h-4 text-amber-400" />
                <span>Load Enterprise Benchmark Dataset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Dynamic Domain Detection ---
  const hasProduction = documents.some(d => d.domain === 'PRODUCTION' || d.domain === 'MINING' || (d.keyMetrics && d.keyMetrics.some(k => k.name.toLowerCase().includes('production'))));
  const hasGeology = documents.some(d => d.domain === 'GEOLOGY' || (d.keyMetrics && d.keyMetrics.some(k => k.name.toLowerCase().includes('reserve'))));
  const hasAdmin = documents.some(d => d.domain === 'ADMINISTRATIVE' || d.domain === 'INQUIRY' || d.category?.includes('Administrative'));
  const hasFinancialOrSpreadsheet = documents.some(d => d.domain === 'FINANCIAL' || d.domain === 'SPREADSHEET' || ['xlsx', 'xls', 'csv'].includes(d.fileType));

  // Document Type Distribution
  const typeMap: Record<string, number> = {};
  documents.forEach(doc => {
    const t = doc.documentType || doc.docType || 'General Document';
    typeMap[t] = (typeMap[t] || 0) + 1;
  });

  // Recent Insights Aggregation
  const allDiscoveredInsights = documents.flatMap(d => 
    (d.keyInsights || []).map(ins => ({ ...ins, docTitle: d.title, docId: d.id }))
  ).slice(0, 4);

  // Dynamic Production aggregation if production documents exist
  const prodRecs = productionRecords.length > 0 ? productionRecords : [];
  const totalProduction = prodRecs.reduce((acc, r) => acc + (r.achievedProductionMt || 0), 0);

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              Universal Document Intelligence & Knowledge Operations
            </h2>
            <p className="text-xs text-slate-400">
              Active Knowledge Base: {documents.length} ingested dossiers • Multi-format OCR & parsing • Evidence-grounded RAG query routing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('upload')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm cursor-pointer"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Upload Files</span>
          </button>
          <button
            onClick={() => setActiveTab('assistant')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Global Overview KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Documents Processed</div>
            <div className="text-2xl font-black text-white mt-1">{documents.length}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">100% Vector Indexed</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pages Ingested</div>
            <div className="text-2xl font-black text-white mt-1">{metrics.pagesProcessed}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Multi-Layout OCR</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Extracted Tables & KPIs</div>
            <div className="text-2xl font-black text-white mt-1">{metrics.tablesExtracted + metrics.structuredRecordsCount}</div>
            <div className="text-[10px] text-amber-400 mt-0.5">Structured Records</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Extraction Fidelity</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{metrics.extractionAccuracy}%</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Source-Traceable</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Document Classification Distribution */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Document Classification & Category Distribution</h3>
          </div>
          <span className="text-xs text-slate-400">
            {Object.keys(typeMap).length} Active Categories
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {Object.entries(typeMap).map(([type, count]) => (
            <div key={type} className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg flex items-center justify-between">
              <div className="truncate pr-2">
                <div className="text-xs font-semibold text-slate-200 truncate" title={type}>{type}</div>
                <div className="text-[10px] text-slate-500">Auto-Classified</div>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {count} {count === 1 ? 'doc' : 'docs'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Adaptive Domain Intelligence Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pluggable Mining / Production Intelligence (Only if relevant documents exist) */}
        {hasProduction ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Production Intelligence Module (Active)</h3>
              </div>
              <button
                onClick={() => setActiveTab('analytics')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                Full Analytics <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Activated for documents containing operational coal extraction, overburden handling, and off-take dispatches.
            </p>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Tracked Production:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {totalProduction > 0 ? `${totalProduction.toFixed(2)} MT` : 'Extracted from Ingested Dossiers'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Primary Subsidiary Nodes:</span>
                <span className="font-semibold text-slate-200">SECL, MCL, NCL, BCCL, WCL</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Overburden Stripping Ratio:</span>
                <span className="font-semibold text-amber-300 font-mono">1.14 - 2.80 m³/t</span>
              </div>
            </div>
          </div>
        ) : (
          /* General Organizational Intelligence Card */
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Organizational Document Intelligence</h3>
              </div>
              <button
                onClick={() => setActiveTab('topics')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                Topics <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated entity extraction, semantic keyword indexing, and multi-scope Q&A active across general organizational dossiers.
            </p>
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-2 text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Indexed Entities:</span>
                <span className="font-bold text-amber-400">{metrics.structuredRecordsCount} extracted terms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Multi-Scope RAG Status:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Questions
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Validation & Evidence Tracking Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Source Verification & Audit State</h3>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Audit Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Every numerical claim, entity attribution, and AI answer is bound to exact page numbers, table coordinates, and text excerpts.
            </p>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Validation Accuracy:</span>
                <span className="font-bold text-emerald-400">{metrics.validationAccuracy}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Citation Confidence:</span>
                <span className="font-bold text-blue-400">{metrics.citationAccuracyScore}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('validation')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              Open Validation Workbench <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-slate-500">{metrics.conflictsResolvedCount} verified attributes</span>
          </div>
        </div>
      </div>

      {/* Discovered High-Value Key Insights Strip */}
      {allDiscoveredInsights.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Automatically Discovered High-Value Insights</h3>
            </div>
            <span className="text-[11px] text-slate-400">Extracted from Active Documents</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allDiscoveredInsights.map((ins, idx) => (
              <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                    ins.category === 'FACT' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    ins.category === 'TREND' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    ins.category === 'ANOMALY' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {ins.category}
                  </span>
                  <button
                    onClick={() => onOpenViewer(ins.docId)}
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> Page {ins.sourcePage || 1}
                  </button>
                </div>
                <p className="text-slate-300 leading-relaxed">{ins.text}</p>
                <div className="text-[10px] text-slate-500 truncate" title={ins.docTitle}>
                  Source: {ins.docTitle}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Ingested Documents List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Recent Ingested Documents in Repository</h3>
          </div>
          <button
            onClick={() => setActiveTab('documents')}
            className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All ({documents.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {documents.slice(0, 6).map(doc => (
            <div
              key={doc.id}
              onClick={() => onOpenViewer(doc.id)}
              className="p-3 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-lg cursor-pointer transition text-xs space-y-1.5 group"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-bold text-amber-400 truncate max-w-[180px]">
                  {doc.organization || doc.subsidiary || 'Enterprise'}
                </span>
                <span>{doc.reportingPeriod || (doc.reportingYear ? `FY ${doc.reportingYear}` : '2024')}</span>
              </div>
              <h4 className="font-bold text-white group-hover:text-amber-400 transition truncate" title={doc.title}>
                {doc.title}
              </h4>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {doc.documentType || doc.docType}
                </span>
                <span className="text-slate-500">
                  {doc.fileType.toUpperCase()} • {doc.pageCount}p
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {doc.summary || doc.executiveSummary || `Document parsed with verified source citations.`}
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-500">
                <span>{doc.keyMetrics?.length || 0} discovered KPIs</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Inspect Analysis
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
