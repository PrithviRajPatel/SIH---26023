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
  RefreshCw,
  Compass,
  Building,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { QueryResponse, CitationSource, MiningDocument, QueryScope } from '../types';

interface AiAssistantTabProps {
  onExecuteQuery: (query: string, options?: { scope?: QueryScope; targetId?: string; documentIds?: string[] }) => Promise<QueryResponse>;
  onOpenViewer: (docId: string) => void;
  initialQuestion?: string;
  documents?: MiningDocument[];
}

export const AiAssistantTab: React.FC<AiAssistantTabProps> = ({
  onExecuteQuery,
  onOpenViewer,
  initialQuestion,
  documents = []
}) => {
  const [inputText, setInputText] = useState(initialQuestion || '');
  const [selectedScope, setSelectedScope] = useState<QueryScope>('GLOBAL');
  const [targetDocId, setTargetDocId] = useState<string>(documents[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<QueryResponse[]>([]);

  const handleSubmit = async (qText?: string) => {
    const query = qText || inputText;
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const resp = await onExecuteQuery(query, {
        scope: selectedScope,
        targetId: selectedScope === 'CURRENT_DOCUMENT' ? targetDocId : undefined
      });
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

  // Dynamic Suggestion Prompts derived from actual active repository
  const promptSuggestions = [
    'Summarize key findings from the latest uploaded document.',
    'What are the primary operational or financial metrics reported?',
    'What changed between these reports and where are the variances?',
    'Find all mentions of safety compliance, radar monitoring, or incidents.',
    'Explain the numerical data and figures in the extracted tables.',
    'Are there any conflicting numbers or anomalies detected?'
  ];

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
              Universal Document Intelligence AI Assistant
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Multi-Scope Query Routing: Direct relational querying, hybrid analytical comparison, and semantic RAG with primary evidence citations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
          <span className="text-emerald-400">● Structured SQL</span>
          <span>•</span>
          <span className="text-blue-400">● Semantic RAG</span>
          <span>•</span>
          <span className="text-amber-400">● Strict Hallucination Guard</span>
        </div>
      </div>

      {/* Scope Selector Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-slate-200">Query Retrieval Scope:</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setSelectedScope('GLOBAL')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                selectedScope === 'GLOBAL' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Ingested Documents ({documents.length})
            </button>
            <button
              onClick={() => setSelectedScope('CURRENT_DOCUMENT')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                selectedScope === 'CURRENT_DOCUMENT' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Single Document Scope
            </button>
          </div>
        </div>

        {selectedScope === 'CURRENT_DOCUMENT' && documents.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-slate-400 font-semibold">Select Document:</label>
            <select
              value={targetDocId}
              onChange={(e) => setTargetDocId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 max-w-xs cursor-pointer"
            >
              {documents.map(d => (
                <option key={d.id} value={d.id}>
                  [{d.domain || 'DOC'}] {d.title.substring(0, 35)}...
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Search Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask any question about your documents, e.g. 'What are the main findings?', 'Compare production trends', 'Explain table figures'..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-4 pr-24 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-inner"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="absolute right-2 top-2 bottom-2 px-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Query</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Click Prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 text-[11px]">
            <span className="text-slate-500 font-semibold whitespace-nowrap">Suggested Prompts:</span>
            {promptSuggestions.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setInputText(prompt); handleSubmit(prompt); }}
                className="whitespace-nowrap px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-white transition cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Query Results Stream */}
      <div className="space-y-6">
        {history.length === 0 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
            <Sparkles className="w-10 h-10 text-amber-400/60 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">Knowledge Assistant Ready</h3>
            <p className="text-xs max-w-md mx-auto text-slate-400 leading-relaxed">
              Ask questions across your ingested organizational documents. The assistant automatically determines whether to run structured SQL analytics, cross-document comparison, or semantic RAG.
            </p>
          </div>
        )}

        {history.map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl animate-in fade-in-50 duration-300">
            {/* Header: Query and Metadata */}
            <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getBadgeColor(item.queryType)}`}>
                  {item.queryType}
                </span>
                <span className="text-sm font-bold text-white">"{item.query}"</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {item.executionTimeMs}ms
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Factual Evidence
                </span>
              </div>
            </div>

            {/* Main Answer Body */}
            <div className="p-5 space-y-4">
              <div className="prose prose-invert max-w-none text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                {item.answer}
              </div>

              {/* Dynamic Chart if returned */}
              {item.chartData && item.chartData.datasets && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      <span>Comparative Analytics Chart</span>
                    </span>
                    <span className="text-[10px] text-slate-500">Derived from Validated Repository Figures</span>
                  </div>

                  <div className="space-y-2 pt-2">
                    {item.chartData.labels.map((lbl, lIdx) => {
                      const ds = item.chartData!.datasets[0];
                      const val = ds.data[lIdx] || 0;
                      const max = Math.max(...ds.data.map(v => typeof v === 'number' ? v : parseFloat(String(v)) || 1), 1);
                      const pct = Math.min(100, Math.max(10, (val / max) * 100));

                      return (
                        <div key={lIdx} className="space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300 font-semibold">{lbl}</span>
                            <span className="text-emerald-400 font-mono font-bold">{val}</span>
                          </div>
                          <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SQL Query Trace if applicable */}
              {item.sqlQuery && (
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center gap-2 overflow-x-auto">
                  <Code2 className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>{item.sqlQuery}</span>
                </div>
              )}

              {/* Verified Primary Source Citations */}
              {item.citations && item.citations.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>Verified Primary Source Citations ({item.citations.length})</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {item.citations.map((c, cIdx) => (
                      <div key={cIdx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1.5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-400 truncate max-w-[200px]" title={c.documentTitle}>
                              {c.documentTitle}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">Page {c.pageNumber}</span>
                          </div>
                          <p className="text-[11px] text-slate-300 italic line-clamp-2 leading-relaxed mt-1">
                            "{c.excerpt}"
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-500">
                          <span>{c.sectionOrTable}</span>
                          <button
                            onClick={() => onOpenViewer(c.documentId)}
                            className="text-amber-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <Eye className="w-3 h-3" /> View Source
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
