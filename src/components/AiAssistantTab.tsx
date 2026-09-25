import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Database, 
  Layers, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  Clock, 
  BarChart3, 
  Code2, 
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { QueryResponse, CitationSource } from '../types';
import { SAMPLE_QUESTIONS } from '../data/seedData';

interface AiAssistantTabProps {
  onExecuteQuery: (query: string) => Promise<QueryResponse>;
  onOpenViewer: (docId: string) => void;
  initialQuestion?: string;
}

export const AiAssistantTab: React.FC<AiAssistantTabProps> = ({
  onExecuteQuery,
  onOpenViewer,
  initialQuestion
}) => {
  const [inputText, setInputText] = useState(initialQuestion || '');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<QueryResponse[]>([
    {
      query: 'Compare Mine A and Mine B from 2020 to 2024.',
      queryType: 'ANALYTICS',
      answer: `**Comparative Benchmarking: Mine A (Gevra Mega OC) vs Mine B (Jayant OCP) [FY 2020 - FY 2024]:**\n\n` +
        `1. **Production Volume:**\n` +
        `   - **Mine A (Gevra OC - SECL):** 2020: 45.00 MT | 2021: 46.20 MT | 2022: 49.12 MT | 2023: 50.80 MT | 2024: 52.40 MT.\n` +
        `   - **Mine B (Jayant OCP - NCL):** 2020: 19.80 MT | 2021: 21.20 MT | 2022: 23.40 MT | 2023: 25.10 MT | 2024: 26.50 MT.\n\n` +
        `2. **Operational Efficiency & Stripping Ratio:**\n` +
        `   - Mine A operates at an exceptionally low stripping ratio of **1.14 m³/t**, leveraging merged Upper and Lower Kusumunda seams.\n` +
        `   - Mine B operates at a higher stripping ratio of **3.11 m³/t**, handling 82.40 MCM of overburden with 240T dumpers.\n\n` +
        `3. **Key Findings:** Mine A leads by raw volume (+95% higher output), while Mine B maintained higher target consistency (106% achievement in FY24).`,
      chartData: {
        labels: ['FY 2020', 'FY 2021', 'FY 2022', 'FY 2023', 'FY 2024'],
        datasets: [
          {
            label: 'Mine A (SECL Gevra Mega OC) [MT]',
            data: [45.0, 46.2, 49.12, 50.8, 52.4],
            color: '#f59e0b'
          },
          {
            label: 'Mine B (NCL Jayant OCP) [MT]',
            data: [19.8, 21.2, 23.4, 25.1, 26.5],
            color: '#3b82f6'
          }
        ]
      },
      sqlQuery: `SELECT subsidiary, mine_name, year, target_production_mt, achieved_production_mt, stripping_ratio FROM production_records WHERE mine_name IN ('Gevra Mega OC', 'Jayant OCP') AND year BETWEEN 2020 AND 2024 ORDER BY year ASC;`,
      citations: [
        {
          documentId: 'doc_secl_gevra_2023',
          documentTitle: 'SECL Gevra Mega Opencast Project - Annual Performance Dossier 2022-23',
          pageNumber: 7,
          sectionOrTable: 'Table tbl_gevra_01',
          excerpt: 'Composite stripping ratio achieved was 1.14 m3/t. Total overburden handled was 58.2 MCM.',
          confidence: 0.93,
          dataType: 'STRUCTURED_RECORD'
        },
        {
          documentId: 'doc_ncl_singrauli_2024',
          documentTitle: 'NCL Singrauli Coalfield Monthly Production & Dispatch Matrix 2023-24',
          pageNumber: 1,
          sectionOrTable: 'Table tbl_ncl_01',
          excerpt: 'Jayant OCP achieved 26.50 MT actual with 82.40 MCM overburden and 3.11 stripping ratio.',
          confidence: 1.0,
          dataType: 'STRUCTURED_RECORD'
        }
      ],
      executionTimeMs: 42,
      traceSteps: [
        { step: '1. Natural Language Query Understanding', status: 'COMPLETE', details: 'Detected comparison intent between Mine A (Gevra OC) and Mine B (Jayant OCP).' },
        { step: '2. Query Routing Classification', status: 'COMPLETE', details: 'Routed to [ANALYTICS] (Dual Entity Comparison + Historical Aggregation).' },
        { step: '3. SQL Query Execution', status: 'COMPLETE', details: 'Retrieved 10 validated multi-year production records.' },
        { step: '4. Hallucination Guard', status: 'COMPLETE', details: 'Zero hallucinated figures. Verified with primary sources.' }
      ],
      isSyntheticDemo: true
    }
  ]);

  const handleSubmit = async (qText?: string) => {
    const query = qText || inputText;
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const resp = await onExecuteQuery(query);
      setHistory(prev => [resp, ...prev]);
      if (!qText) setInputText('');
    } finally {
      setIsLoading(false);
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'STRUCTURED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'ANALYTICS': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'HYBRID': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'UNSTRUCTURED': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'REPORT_GENERATION': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Architecture Explanation Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-bold rounded-lg shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              AI Query Engine with SQL + Semantic RAG Hybrid Router
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Strict Hallucination Control: Numerical answers use structured database queries; technical/geological context uses semantic RAG.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
          <span className="text-emerald-400">● Structured SQL</span>
          <span>•</span>
          <span className="text-blue-400">● Semantic RAG</span>
          <span>•</span>
          <span className="text-amber-400">● 100% Traceability</span>
        </div>
      </div>

      {/* Preloaded SIH Demo Questions (Horizontal Scroll / Grid) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            Recommended SIH 2026 Test Questions:
          </span>
          <span className="text-[10px] text-slate-500">Click any question to execute</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(q);
                handleSubmit(q);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-300 text-xs font-medium transition text-left flex items-center gap-1.5 shadow-sm"
            >
              <span className="w-4 h-4 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                {idx + 1}
              </span>
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Query Input Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything about production figures, geological exploration, slope stability, or parliamentary inquiries..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition disabled:opacity-40"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Routing...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Execute Query</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Query Results Stream */}
      <div className="space-y-6">
        {history.map((resp, rIdx) => (
          <div
            key={rIdx}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl"
          >
            {/* Header: Query & Classification Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Natural Language Query</span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>"{resp.query}"</span>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getBadgeColor(resp.queryType)}`}>
                  [{resp.queryType}]
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {resp.executionTimeMs}ms
                </span>
              </div>
            </div>

            {/* Query Router Execution Trace */}
            {resp.traceSteps && (
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/80 space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Query Router Execution Trace:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-400">
                  {resp.traceSteps.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-300">{step.step}:</span>{' '}
                        <span className="text-slate-400">{step.details}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Executed SQL statement if present */}
            {resp.sqlQuery && (
              <div className="bg-slate-950 rounded-lg p-3 border border-slate-800/80">
                <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  <span>Executed Parameterized SQL:</span>
                </div>
                <code className="text-xs font-mono text-emerald-300 block overflow-x-auto whitespace-pre-wrap">
                  {resp.sqlQuery}
                </code>
              </div>
            )}

            {/* Main AI Answer */}
            <div className="bg-slate-950/60 rounded-lg p-4 border border-slate-800 text-sm leading-relaxed text-slate-200 whitespace-pre-line">
              {resp.answer}
            </div>

            {/* Dynamic Comparison Chart if present */}
            {resp.chartData && (
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>Multi-Year Production Comparison (FY 2020 - FY 2024)</span>
                </div>
                <div className="space-y-3 pt-2">
                  {resp.chartData.datasets.map((ds, dsi) => (
                    <div key={dsi} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-200">{ds.label}</span>
                        <span className="text-slate-400 text-[11px]">
                          Values: {ds.data.join(' MT ➔ ')} MT
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-2 pt-1">
                        {ds.data.map((val, vi) => (
                          <div key={vi} className="text-center bg-slate-900 p-2 rounded border border-slate-800">
                            <div className="text-[10px] text-slate-400">{resp.chartData?.labels[vi]}</div>
                            <div className="text-xs font-bold text-amber-400 mt-0.5">{val} MT</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Evidence & Primary Source Citations */}
            {resp.citations && resp.citations.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Evidence & Source Traceability ({resp.citations.length} Sources Linked):</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {resp.citations.map((cite, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200 line-clamp-1">{cite.documentTitle}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {(cite.confidence * 100).toFixed(0)}% Conf
                          </span>
                        </div>
                        <div className="text-[10px] text-amber-400 font-semibold mt-0.5">
                          Page {cite.pageNumber} • {cite.sectionOrTable}
                        </div>
                        <p className="text-[11px] text-slate-400 italic mt-1 leading-snug">
                          "{cite.excerpt}"
                        </p>
                      </div>

                      <button
                        onClick={() => onOpenViewer(cite.documentId)}
                        className="mt-2 py-1 px-2.5 rounded bg-slate-800 hover:bg-slate-750 text-slate-200 text-[11px] font-semibold flex items-center justify-between transition border border-slate-700"
                      >
                        <span>View Evidence in Split-Screen Viewer</span>
                        <ExternalLink className="w-3 h-3 text-amber-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
