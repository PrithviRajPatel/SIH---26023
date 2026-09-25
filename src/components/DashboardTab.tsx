import React from 'react';
import { 
  FileText, 
  Layers, 
  Table, 
  CheckCircle2, 
  Zap, 
  Clock, 
  ArrowUpRight, 
  ShieldAlert, 
  TrendingUp, 
  FileUp, 
  Search, 
  BarChart3, 
  FileSignature
} from 'lucide-react';
import { PerformanceMetrics, MiningDocument, AuditLogEntry } from '../types';

interface DashboardTabProps {
  metrics: PerformanceMetrics;
  documents: MiningDocument[];
  auditLogs: AuditLogEntry[];
  setActiveTab: (tab: string) => void;
  onOpenViewer: (docId: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  metrics,
  documents,
  auditLogs,
  setActiveTab,
  onOpenViewer
}) => {
  const subsidiaries2024 = [
    { name: 'MCL', achieved: 206.10, target: 204.00, color: 'bg-emerald-500' },
    { name: 'SECL', achieved: 187.00, target: 197.00, color: 'bg-amber-500' },
    { name: 'NCL', achieved: 141.52, target: 139.00, color: 'bg-blue-500' },
    { name: 'CCL', achieved: 86.05, target: 84.00, color: 'bg-purple-500' },
    { name: 'WCL', achieved: 67.85, target: 67.00, color: 'bg-pink-500' },
    { name: 'BCCL', achieved: 41.10, target: 41.00, color: 'bg-teal-500' },
    { name: 'ECL', achieved: 38.12, target: 39.50, color: 'bg-orange-500' }
  ];

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
              CMPDI & CIL Central Knowledge & Intelligence Node
            </h2>
            <p className="text-xs text-slate-400">
              Automated document digitization, OCR table parsing, relational verification, and RAG query router.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('assistant')}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition shadow"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Ask Natural Query</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition"
          >
            <FileSignature className="w-3.5 h-3.5 text-amber-400" />
            <span>Generate Report</span>
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
          <div className="text-[10px] text-slate-500 mt-2">PDF, DOCX, XLSX, Scanned OCR</div>
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
            <span>+12.4% vs manual data entry</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2">{metrics.tablesExtracted} Tables Extracted</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Automation Level</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{metrics.automationPercentage}%</div>
          <div className="flex items-center gap-1 text-[11px] text-cyan-400 mt-1">
            <span>Repetitive workflows automated</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2">Zero hallucinations on numbers</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Report Time Saved</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{metrics.timeReductionPercentage}%</div>
          <div className="flex items-center gap-1 text-[11px] text-amber-300 mt-1">
            <span>14.5 hrs ➔ {metrics.automatedReportTimeSeconds}s</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-2">Avg query response: {(metrics.averageQueryResponseTimeMs / 1000).toFixed(1)}s</div>
        </div>
      </div>

      {/* Main Visuals Grid: Production Comparison & Target vs Achieved */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subsidiary Production Breakdown */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                CIL Subsidiary Coal Production (FY 2023-24)
              </h3>
              <p className="text-xs text-slate-400">
                Verified figures extracted from consolidated annual reviews & pithead spreadsheets (Million Tonnes)
              </p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Total: 773.60 MT
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {subsidiaries2024.map((sub) => {
              const maxVal = 210;
              const achWidth = (sub.achieved / maxVal) * 100;
              const tgtWidth = (sub.target / maxVal) * 100;
              const isOver = sub.achieved >= sub.target;

              return (
                <div key={sub.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{sub.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">Target: {sub.target} MT</span>
                      <span className={`font-bold ${isOver ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {sub.achieved} MT ({((sub.achieved / sub.target) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-3 bg-slate-950 rounded-full overflow-hidden relative border border-slate-800">
                    <div
                      className={`h-full rounded-full ${sub.color} transition-all duration-500`}
                      style={{ width: `${achWidth}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white/70"
                      style={{ left: `${tgtWidth}%` }}
                      title={`Target: ${sub.target} MT`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                <span>Achieved Production</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-0.5 h-3 bg-white/70 inline-block"></span>
                <span>Target Line</span>
              </span>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
            >
              Multi-Year Trends <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Validation & Conflict Status Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Data Validation Status
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                1 Flagged
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Automated rules detect variances, unit differences (e.g. MT vs tonnes), and discrepancies between draft and audited statements.
            </p>

            <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
                <span>CONFLICT_REQUIRES_REVIEW</span>
                <span className="text-[10px] text-slate-400">SECL Gevra 2023</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Field log states <strong className="text-amber-300">52.50 MT</strong>, but official audited financial statement lists <strong className="text-emerald-400">50.80 MT</strong>.
              </p>
              <button
                onClick={() => setActiveTab('validation')}
                className="w-full mt-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded transition"
              >
                Resolve in Validation Workbench
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Verified Clean Fields:</span>
                <span className="text-slate-200 font-medium">98.4%</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>OCR Quality Rating:</span>
                <span className="text-slate-200 font-medium">96.8% Avg</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Resolved Conflicts:</span>
                <span className="text-slate-200 font-medium">{metrics.conflictsResolvedCount} Items</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            Audit logging enforced on every approval and correction.
          </div>
        </div>
      </div>

      {/* Recent Ingested Documents & Audit Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Ingestion Stream */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Indexed Document Repository
            </h3>
            <button
              onClick={() => setActiveTab('documents')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              View All ({documents.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {documents.slice(0, 5).map((doc) => (
              <div
                key={doc.id}
                onClick={() => onOpenViewer(doc.id)}
                className="p-3 bg-slate-950 hover:bg-slate-850 rounded-lg border border-slate-800 cursor-pointer transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg text-xs font-bold ${
                    doc.isScanned ? 'bg-purple-950 text-purple-300 border border-purple-800/40' : 'bg-blue-950 text-blue-300 border border-blue-800/40'
                  }`}>
                    {doc.fileType.toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 transition line-clamp-1">
                      {doc.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{doc.subsidiary}</span>
                      <span>•</span>
                      <span>{doc.reportingYear}</span>
                      <span>•</span>
                      <span>{doc.pageCount} Pages</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    doc.status === 'VALIDATED' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Audit Log Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Traceability & Audit Activity
            </h3>
            <button
              onClick={() => setActiveTab('audit')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              Full Log
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {log.userName} ({log.userRole})
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {log.details}
                </p>
                <div className="text-[9px] text-amber-400/80 font-mono">
                  [{log.action}] • IP: {log.ipAddress}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
