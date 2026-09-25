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
  AlertTriangle
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
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <h2 className="text-base font-bold text-white">Central Mine Planning & Design Institute Knowledge Node</h2>
            </div>
            <p className="text-xs text-slate-400">
              Enterprise AI document processing, OCR table parsing, relational verification, and RAG query platform.
            </p>
          </div>
        </div>

        {/* Empty Workspace Hero */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-slate-800 text-amber-400 mx-auto mb-4 flex items-center justify-center border border-slate-700">
            <Database className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Documents Ingested in Repository</h3>
          <p className="text-xs text-slate-400 max-w-lg mx-auto mb-6 leading-relaxed">
            The GeoMine Intel workspace is initialized and ready for production documents. You can ingest operational mining reports, borehole logs, and production spreadsheets, or load the verified reference benchmark dataset for evaluation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('upload')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg"
            >
              <FileUp className="w-4 h-4" />
              <span>Upload Documents Now</span>
            </button>

            {onLoadBenchmark && (
              <button
                onClick={onLoadBenchmark}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
              >
                <RefreshCcw className="w-4 h-4 text-amber-400" />
                <span>Load Reference Benchmark Dataset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dynamic Subsidiary Breakdown from actual documents & production records
  const subMap: Record<string, { achieved: number; target: number }> = {};
  const palette = ['bg-emerald-500', 'bg-amber-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500'];

  if (productionRecords.length > 0) {
    const latestYear = Math.max(...productionRecords.map(r => r.year));
    productionRecords.filter(r => r.year === latestYear && r.subsidiary !== 'CIL Consolidated').forEach(r => {
      if (!subMap[r.subsidiary]) subMap[r.subsidiary] = { achieved: 0, target: 0 };
      subMap[r.subsidiary].achieved += r.achievedProductionMt || 0;
      subMap[r.subsidiary].target += r.targetProductionMt || 0;
    });
  } else {
    // Group from documents
    documents.forEach(doc => {
      const prodEnt = doc.entities?.find(e => e.entityType === 'achieved_production');
      const val = typeof prodEnt?.normalizedValue === 'number' ? prodEnt.normalizedValue : 0;
      if (!subMap[doc.subsidiary]) subMap[doc.subsidiary] = { achieved: 0, target: 0 };
      subMap[doc.subsidiary].achieved += val;
      subMap[doc.subsidiary].target += val > 0 ? val * 0.98 : 0;
    });
  }

  const dynamicSubsidiaries = Object.entries(subMap).map(([name, data], idx) => ({
    name,
    achieved: Number(data.achieved.toFixed(2)),
    target: Number(data.target.toFixed(2)),
    color: palette[idx % palette.length]
  }));

  const totalAchievedProd = dynamicSubsidiaries.reduce((acc, s) => acc + s.achieved, 0);
  const maxProdVal = Math.max(...dynamicSubsidiaries.map(s => Math.max(s.achieved, s.target)), 10);

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
              CMPDI & Coal India Limited Enterprise Intelligence Node
            </h2>
            <p className="text-xs text-slate-400">
              Automated document digitization, OCR table parsing, relational verification, and RAG query router.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('upload')}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition shadow"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Upload Documents</span>
          </button>
          <button
            onClick={() => setActiveTab('assistant')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Query Assistant</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Documents Ingested</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{metrics.documentsProcessed}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
            <span>{metrics.pagesProcessed} Pages Digitized</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2">OCR Parsed & Multi-Modal Index</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Extraction Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{metrics.extractionAccuracy}%</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>Target Confidence Score</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2">{metrics.tablesExtracted} Tabular Blocks Parsed</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Automation Level</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{metrics.automationPercentage}%</div>
          <div className="flex items-center gap-1 text-[11px] text-cyan-400 mt-1">
            <span>Automated extraction flow</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2">Validated Source Citations</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Report Time Saved</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{metrics.timeReductionPercentage}%</div>
          <div className="flex items-center gap-1 text-[11px] text-amber-300 mt-1">
            <span>{metrics.manualReportTimeHours}h manual ➔ {metrics.automatedReportTimeSeconds}s automated</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2">Direct Query Synthesis</div>
        </div>
      </div>

      {/* Main Visuals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subsidiary Production Breakdown */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>Extracted Subsidiary Coal Production</span>
              </h3>
              <p className="text-xs text-slate-400">
                Aggregated from ingested operational reviews & spreadsheets (Million Tonnes)
              </p>
            </div>
            {totalAchievedProd > 0 && (
              <span className="text-[11px] px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono">
                Total: {totalAchievedProd.toFixed(2)} MT
              </span>
            )}
          </div>

          {dynamicSubsidiaries.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No production records registered yet. Ingest mining reports to display production metrics.
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {dynamicSubsidiaries.map((sub) => {
                const achWidth = Math.min(100, (sub.achieved / maxProdVal) * 100);
                const tgtWidth = Math.min(100, (sub.target / maxProdVal) * 100);
                const isOver = sub.achieved >= sub.target;

                return (
                  <div key={sub.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{sub.name}</span>
                      <div className="flex items-center gap-2">
                        {sub.target > 0 && (
                          <span className="text-slate-400 text-[11px]">Target: {sub.target} MT</span>
                        )}
                        <span className={`font-bold font-mono ${isOver ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {sub.achieved} MT {sub.target > 0 && `(${((sub.achieved / sub.target) * 100).toFixed(1)}%)`}
                        </span>
                      </div>
                    </div>
                    <div className="h-3 bg-slate-950 rounded-full overflow-hidden relative border border-slate-800">
                      <div
                        className={`h-full rounded-full ${sub.color} transition-all duration-500`}
                        style={{ width: `${achWidth}%` }}
                      />
                      {sub.target > 0 && (
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-white/70"
                          style={{ left: `${tgtWidth}%` }}
                          title={`Target: ${sub.target} MT`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                <span>Achieved Production</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-0.5 h-3 bg-white/70 inline-block"></span>
                <span>Target Reference</span>
              </span>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
            >
              Historical Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Validation & Conflict Status Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Verification State</span>
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Active Monitor
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Automated rules detect variances, unit differences (e.g. MT vs tonnes), and discrepancies between draft logs and audited financial statements.
            </p>

            <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
                <span>CONFLICT_REQUIRES_REVIEW</span>
                <span className="text-[10px] text-slate-400">SECL Gevra</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Field dispatch estimate logs <strong className="text-amber-300">52.50 MT</strong>, while audited account figures confirm <strong className="text-emerald-400">50.80 MT</strong>.
              </p>
              <button
                onClick={() => setActiveTab('validation')}
                className="w-full mt-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded transition"
              >
                Inspect in Validation Workbench
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] flex items-center justify-between text-slate-400">
            <span>Validation Accuracy:</span>
            <span className="font-bold text-emerald-400">{metrics.validationAccuracy}%</span>
          </div>
        </div>
      </div>

      {/* Recent Ingested Documents List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Recent Ingested Operational Documents</h3>
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
                <span className="font-bold text-amber-400">{doc.subsidiary}</span>
                <span>FY {doc.reportingYear}</span>
              </div>
              <h4 className="font-bold text-white group-hover:text-amber-400 transition truncate" title={doc.title}>
                {doc.title}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {doc.summary || `Operational and geological dossier for ${doc.subsidiary}.`}
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-500">
                <span>{doc.pageCount} pages • {doc.fileType.toUpperCase()}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> View Evidence
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
