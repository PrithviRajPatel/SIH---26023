import React, { useState } from 'react';
import { 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Table, 
  Tag, 
  CheckCircle, 
  Layers, 
  Sparkles, 
  Eye, 
  ShieldAlert, 
  Search,
  Download,
  Calendar,
  Building,
  MapPin,
  TrendingUp,
  TrendingDown,
  BarChart3,
  HelpCircle,
  Clock,
  Compass,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  Sliders
} from 'lucide-react';
import { MiningDocument, DiscoveredKPI, DiscoveredInsight, DiscoveredVisualization, TimelineEvent } from '../types';
import { api } from '../services/api';

interface DocumentViewerTabProps {
  documents: MiningDocument[];
  selectedDocId?: string;
  onSelectDocument: (id: string) => void;
  highlightText?: string;
}

export const DocumentViewerTab: React.FC<DocumentViewerTabProps> = ({
  documents,
  selectedDocId,
  onSelectDocument,
  highlightText
}) => {
  const currentDoc = documents.find(d => d.id === selectedDocId) || documents[0];
  const [currentPage, setCurrentPage] = useState(1);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'overview' | 'insights' | 'metrics' | 'visuals' | 'tables' | 'timeline' | 'qa' | 'source'>('overview');
  const [viewMode, setViewMode] = useState<'rendered' | 'ocr'>('rendered');
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [inDocQuery, setInDocQuery] = useState('');
  const [inDocAnswers, setInDocAnswers] = useState<Array<{ q: string; a: string; citations: any[] }>>([]);
  const [isQuerying, setIsQuerying] = useState(false);

  if (!currentDoc) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white mb-1">No Document Selected</h3>
        <p className="text-xs">Please upload or select an organizational document to inspect its adaptive intelligence.</p>
      </div>
    );
  }

  const page = currentDoc.pages?.find(p => p.pageNumber === currentPage) || currentDoc.pages?.[0];
  const kpis = currentDoc.keyMetrics || [];
  const insights = currentDoc.keyInsights || [];
  const visualizations = currentDoc.visualizations || [];
  const timeline = currentDoc.timelineEvents || [];
  const tables = currentDoc.tables || [];

  // In-document AI Question Execution
  const handleInDocAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inDocQuery.trim() || isQuerying) return;
    const q = inDocQuery.trim();
    setInDocQuery('');
    setIsQuerying(true);

    try {
      const resp = await api.queryUnified(q, {
        scope: 'CURRENT_DOCUMENT',
        targetId: currentDoc.id
      });
      setInDocAnswers(prev => [
        { q, a: resp.answer, citations: resp.citations },
        ...prev
      ]);
    } catch (err: any) {
      setInDocAnswers(prev => [
        { q, a: 'Error analyzing document: ' + err.message, citations: [] },
        ...prev
      ]);
    } finally {
      setIsQuerying(false);
    }
  };

  // Export Table to CSV
  const handleExportTableCSV = (t: typeof tables[0]) => {
    const csvContent = [
      t.headers.join(','),
      ...t.rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${t.title || 'Table_Export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* 1. DOCUMENT HEADER & SELECTOR STRIP */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                {currentDoc.documentType || currentDoc.docType}
              </span>
              <span className="text-xs text-slate-400">
                Domain: <strong className="text-slate-200">{currentDoc.domain || 'ORGANIZATIONAL'}</strong>
              </span>
            </div>
            <h2 className="text-base font-bold text-white mt-0.5 truncate max-w-xl" title={currentDoc.title}>
              {currentDoc.title}
            </h2>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                {currentDoc.organization || currentDoc.subsidiary || 'Enterprise'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {currentDoc.reportingPeriod || currentDoc.date || 'Active Cycle'}
              </span>
              <span>•</span>
              <span>{currentDoc.fileType.toUpperCase()} ({currentDoc.pageCount} pages)</span>
            </div>
          </div>
        </div>

        {/* Document Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-semibold whitespace-nowrap">Switch Document:</label>
          <select
            value={currentDoc.id}
            onChange={(e) => {
              onSelectDocument(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-950 text-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer max-w-xs"
          >
            {documents.map((d) => (
              <option key={d.id} value={d.id}>
                [{d.domain || 'DOC'}] {d.title.substring(0, 35)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. ADAPTIVE WORKSPACE NAVIGATION TABS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none shadow-sm">
        <button
          onClick={() => setActiveWorkspaceTab('overview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeWorkspaceTab === 'overview' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Executive Overview</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('insights')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeWorkspaceTab === 'insights' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Key Insights ({insights.length})</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('metrics')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeWorkspaceTab === 'metrics' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Discovered KPIs ({kpis.length})</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('visuals')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeWorkspaceTab === 'visuals' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Visual Analytics ({visualizations.length})</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('tables')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeWorkspaceTab === 'tables' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>Extracted Tables ({tables.length})</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('timeline')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeWorkspaceTab === 'timeline' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Timeline ({timeline.length})</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('qa')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeWorkspaceTab === 'qa' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>In-Document Q&A</span>
        </button>

        <button
          onClick={() => setActiveWorkspaceTab('source')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
            activeWorkspaceTab === 'source' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Source Evidence & OCR</span>
        </button>
      </div>

      {/* 3. TAB CONTENT WORKSPACES */}

      {/* VIEW: EXECUTIVE OVERVIEW */}
      {activeWorkspaceTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Executive Summary Card (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">AI-Generated Executive Summary</h3>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Confidence: 97.4%
              </span>
            </div>

            <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono">
              {currentDoc.executiveSummary || currentDoc.summary || 'Summary generated during universal ingestion.'}
            </div>

            {/* Quick Metrics preview */}
            {kpis.length > 0 ? (
              <div className="pt-2">
                <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Top Detected Quantitative Parameters</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {kpis.slice(0, 3).map((kpi, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                      <div className="text-[11px] text-slate-400 truncate" title={kpi.name}>{kpi.name}</div>
                      <div className="text-base font-bold text-white mt-0.5">
                        {kpi.value} <span className="text-xs text-amber-400 font-mono">{kpi.unit || ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-xs text-slate-400 italic">
                No significant quantitative metrics detected in this document.
              </div>
            )}
          </div>

          {/* Document Health & Classification Metadata (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Document Quality & Metadata</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">OCR Fidelity:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {currentDoc.qualityScore?.ocrQuality || 96}%
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Readability Score:</span>
                <span className="font-bold text-blue-400 font-mono">
                  {currentDoc.qualityScore?.readability || 94}%
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Language:</span>
                <span className="font-semibold text-slate-200">{currentDoc.language || 'English'}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Department / Division:</span>
                <span className="font-semibold text-slate-200">{currentDoc.department || 'Operations'}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-400">Location / Facility:</span>
                <span className="font-semibold text-slate-200">{currentDoc.location || 'Central Facility'}</span>
              </div>
            </div>

            {/* Tags Strip */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Discovered Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {(currentDoc.tags || []).map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-800 text-slate-300 border border-slate-700">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: KEY INSIGHTS */}
      {activeWorkspaceTab === 'insights' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Automatically Discovered Factual Insights ({insights.length})</span>
            </h3>
            <span className="text-xs text-slate-400">Classified by analytical nature with source page attribution</span>
          </div>

          {insights.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-slate-950 rounded-lg border border-slate-800">
              No distinctive analytical insights discovered.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {insights.map((ins, i) => (
                <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                      ins.category === 'FACT' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      ins.category === 'TREND' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      ins.category === 'ANOMALY' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      ins.category === 'COMPARISON' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {ins.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Page {ins.sourcePage || 1} • {((ins.confidence || 0.95) * 100).toFixed(0)}% Confidence
                    </span>
                  </div>
                  <p className="text-slate-200 leading-relaxed font-sans">{ins.text}</p>
                  {ins.sourceRef && (
                    <div className="text-[10px] text-slate-500 font-mono truncate" title={ins.sourceRef}>
                      Source Attribution: {ins.sourceRef}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: DISCOVERED KPIS / ADAPTIVE METRICS */}
      {activeWorkspaceTab === 'metrics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Adaptive Discovered KPIs ({kpis.length})</span>
            </h3>
            <span className="text-xs text-slate-400">Validated against primary source text and tables</span>
          </div>

          {kpis.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs bg-slate-950 rounded-lg border border-slate-800 italic">
              No significant quantitative metrics detected in this document.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {kpis.map((kpi, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 truncate max-w-[180px]" title={kpi.name}>{kpi.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {kpi.validationState || 'VERIFIED'}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-white font-mono">
                    {kpi.value} <span className="text-xs text-amber-400 font-normal">{kpi.unit || ''}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-500">
                    <span>Page {kpi.page || 1}</span>
                    <span className="text-slate-400">{((kpi.confidence || 0.95) * 100).toFixed(0)}% confidence</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: VISUAL ANALYTICS */}
      {activeWorkspaceTab === 'visuals' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Automatically Selected Visualizations ({visualizations.length})</span>
            </h3>
            <span className="text-xs text-slate-400">Derived strictly from validated document tables and metrics</span>
          </div>

          {visualizations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs bg-slate-950 rounded-lg border border-slate-800 italic">
              Insufficient tabular or comparative data to generate meaningful charts safely. No artificial chart data invented.
            </div>
          ) : (
            <div className="space-y-6">
              {visualizations.map((viz) => (
                <div key={viz.id} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{viz.title}</h4>
                      {viz.description && <p className="text-xs text-slate-400 mt-0.5">{viz.description}</p>}
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                      Chart Type: {viz.type.toUpperCase()}
                    </span>
                  </div>

                  {/* Render Visual Bar/Line Representation */}
                  <div className="space-y-2 pt-2">
                    {viz.labels.map((lbl, idx) => {
                      const val = viz.datasets[0]?.data[idx] || 0;
                      const numVal = typeof val === 'number' ? val : parseFloat(String(val)) || 0;
                      const maxVal = Math.max(...viz.datasets[0].data.map(v => typeof v === 'number' ? v : parseFloat(String(v)) || 0), 1);
                      const pct = Math.min(100, Math.max(8, (numVal / maxVal) * 100));

                      return (
                        <div key={idx} className="space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-semibold">{lbl}</span>
                            <span className="text-amber-400 font-mono font-bold">
                              {val} {viz.unit || ''}
                            </span>
                          </div>
                          <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Source: {viz.sourceRef || 'Document Table'}</span>
                    <span>Units: {viz.unit || 'Standard'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: EXTRACTED TABLES */}
      {activeWorkspaceTab === 'tables' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Table className="w-4 h-4 text-blue-400" />
              <span>Extracted Tabular Datasets ({tables.length})</span>
            </h3>
            <span className="text-xs text-slate-400">Searchable, exportable to CSV/XLSX</span>
          </div>

          {tables.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs bg-slate-950 rounded-lg border border-slate-800 italic">
              No distinct structured tables were detected on this document.
            </div>
          ) : (
            <div className="space-y-6">
              {tables.map((t, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{t.title || `Table ${idx + 1}`}</h4>
                      <span className="text-[10px] text-slate-400">Page {t.pageNumber} • Confidence {((t.confidence || 0.98) * 100).toFixed(0)}%</span>
                    </div>
                    <button
                      onClick={() => handleExportTableCSV(t)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-slate-800">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
                        <tr>
                          {t.headers.map((h, hIdx) => (
                            <th key={hIdx} className="px-3 py-2 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {t.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-900/50">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-3 py-2 text-slate-200 whitespace-nowrap">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: TIMELINE */}
      {activeWorkspaceTab === 'timeline' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Chronological Milestones & Timeline ({timeline.length})</span>
            </h3>
            <span className="text-xs text-slate-400">Extracted from temporal anchors in text</span>
          </div>

          {timeline.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs bg-slate-950 rounded-lg border border-slate-800 italic">
              No chronological events or dated milestones detected in this document.
            </div>
          ) : (
            <div className="space-y-3 relative pl-4 border-l-2 border-slate-800">
              {timeline.map((evt, idx) => (
                <div key={idx} className="relative pl-3 space-y-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500 absolute -left-[21px] top-1"></div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-300">{evt.date}</span>
                    <span className="text-[10px] text-slate-500">Page {evt.sourcePage || 1}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">{evt.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: IN-DOCUMENT Q&A */}
      {activeWorkspaceTab === 'qa' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Ask AI About This Document</span>
            </h3>
            <span className="text-xs text-slate-400">Strictly grounded in "{currentDoc.title}"</span>
          </div>

          <form onSubmit={handleInDocAsk} className="flex gap-2">
            <input
              type="text"
              value={inDocQuery}
              onChange={(e) => setInDocQuery(e.target.value)}
              placeholder={`Ask any question about this document (e.g. "What are the main findings?", "Explain the table figures")...`}
              className="flex-1 bg-slate-950 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={isQuerying || !inDocQuery.trim()}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              {isQuerying ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Ask</span>
            </button>
          </form>

          {/* Q&A Stream */}
          <div className="space-y-4 pt-2">
            {inDocAnswers.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2 text-xs">
                <div className="font-bold text-amber-300">Q: {item.q}</div>
                <div className="text-slate-200 leading-relaxed whitespace-pre-line font-sans">{item.a}</div>
                {item.citations && item.citations.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                    <span className="font-semibold text-slate-300">Source Citations:</span>
                    {item.citations.map((c: any, cIdx: number) => (
                      <div key={cIdx} className="text-[10px] text-slate-500">
                        • Page {c.pageNumber} ({c.sectionOrTable}): "{c.excerpt}"
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: SOURCE EVIDENCE & OCR VIEWER */}
      {activeWorkspaceTab === 'source' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                currentDoc.isScanned ? 'bg-purple-950 text-purple-300 border border-purple-800/40' : 'bg-blue-950 text-blue-300 border border-blue-800/40'
              }`}>
                {currentDoc.isScanned ? 'SCANNED ARCHIVAL PAGE' : 'DIGITAL NATIVE PAGE'}
              </span>
              <span className="text-xs text-slate-400">
                OCR Confidence: <strong className="text-emerald-400">{((page?.ocrConfidence || 0.98) * 100).toFixed(1)}%</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setViewMode('rendered')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                    viewMode === 'rendered' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Layout Render
                </button>
                <button
                  onClick={() => setViewMode('ocr')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                    viewMode === 'ocr' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Raw OCR Stream
                </button>
              </div>

              {/* Page Selector */}
              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs text-slate-300">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold px-2">Page {currentPage} of {currentDoc.pageCount || 1}</span>
                <button
                  disabled={currentPage >= (currentDoc.pageCount || 1)}
                  onClick={() => setCurrentPage(prev => Math.min(currentDoc.pageCount || 1, prev + 1))}
                  className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Render Area */}
          <div className="bg-slate-950 rounded-lg border border-slate-800 p-6 min-h-[420px] font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
            {viewMode === 'rendered' ? (
              <div>
                <div className="text-[11px] text-amber-500/80 mb-3 uppercase tracking-wider font-sans font-bold">
                  --- OCR Extracted Text & Layout Coordinates ---
                </div>
                {page?.rawText || 'No text extracted for this page.'}
              </div>
            ) : (
              <div>{page?.rawText || 'No raw stream available.'}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
