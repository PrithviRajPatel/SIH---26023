import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Layers, 
  Download, 
  Eye, 
  Sparkles,
  Equal
} from 'lucide-react';
import { MiningDocument, DocumentComparisonResult } from '../types';
import { api } from '../services/api';

interface DocumentComparisonTabProps {
  documents: MiningDocument[];
  onOpenViewer: (docId: string) => void;
}

export const DocumentComparisonTab: React.FC<DocumentComparisonTabProps> = ({
  documents,
  onOpenViewer
}) => {
  const [docAId, setDocAId] = useState<string>(documents[0]?.id || '');
  const [docBId, setDocBId] = useState<string>(documents[1]?.id || documents[0]?.id || '');
  const [comparison, setComparison] = useState<DocumentComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchComparison = async () => {
    if (!docAId || !docBId) return;
    setIsLoading(true);
    try {
      const res = await api.compareDocuments(docAId, docBId);
      if (res.success && res.comparison) {
        setComparison(res.comparison);
      }
    } catch (err) {
      console.error('Failed to run document comparison:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (documents.length >= 2 && (!docAId || !docBId)) {
      setDocAId(documents[0].id);
      setDocBId(documents[1].id);
    }
  }, [documents]);

  useEffect(() => {
    if (docAId && docBId) {
      fetchComparison();
    }
  }, [docAId, docBId]);

  const exportSummary = () => {
    if (!comparison) return;
    const text = `====================================================\n` +
      `GEO-MINE INTEL: DOCUMENT COMPARATIVE ANALYSIS DOSSIER\n` +
      `====================================================\n\n` +
      `DOCUMENT A: ${comparison.docATitle} (ID: ${comparison.docAId})\n` +
      `DOCUMENT B: ${comparison.docBTitle} (ID: ${comparison.docBId})\n` +
      `GENERATED AT: ${new Date().toISOString()}\n\n` +
      `1. METADATA COMPARISON:\n` +
      comparison.metadataDiff.map(m => `- ${m.field}: [A: ${m.valA}] vs [B: ${m.valB}] (${m.status})`).join('\n') +
      `\n\n2. PRODUCTION & GEOTECHNICAL VARIANCE:\n` +
      comparison.productionDeltas.map(p => `- ${p.metric}: Doc A = ${p.valA} ${p.unit} | Doc B = ${p.valB} ${p.unit} | Variance = ${p.delta >= 0 ? '+' : ''}${p.delta} ${p.unit} (${p.percentChange >= 0 ? '+' : ''}${p.percentChange}%)`).join('\n') +
      `\n\n3. CONFLICT & ANOMALY OBSERVATIONS:\n` +
      comparison.conflictObservations.map(c => `• ${c}`).join('\n') +
      `\n\n====================================================\n`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DocComparison_${comparison.docAId}_vs_${comparison.docBId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (documents.length < 2) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
        <GitCompare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white mb-1">Insufficient Documents for Comparative Analysis</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
          At least two documents must be ingested into the repository to perform side-by-side variance analysis, geotechnical delta evaluation, and entity difference tracking.
        </p>
      </div>
    );
  }

  const docA = documents.find(d => d.id === docAId);
  const docB = documents.find(d => d.id === docBId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitCompare className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Side-by-Side Document Comparative Analysis</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Compare two mining reports, geological assessments, or annual review dossiers to automatically highlight variances in production, stripping ratios, entity values, and statutory conflicts.
          </p>
        </div>

        <button
          onClick={exportSummary}
          disabled={!comparison}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition self-start md:self-auto disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Export Comparison Dossier</span>
        </button>
      </div>

      {/* Selectors Strip */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Primary Reference (Document A)</span>
          </label>
          <select
            value={docAId}
            onChange={(e) => setDocAId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
          >
            {documents.map(d => (
              <option key={d.id} value={d.id}>
                {d.title} ({d.subsidiary} • {d.reportingYear})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-blue-400 mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>Secondary Target (Document B)</span>
          </label>
          <select
            value={docBId}
            onChange={(e) => setDocBId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          >
            {documents.map(d => (
              <option key={d.id} value={d.id}>
                {d.title} ({d.subsidiary} • {d.reportingYear})
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-slate-400 text-xs">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Evaluating side-by-side matrices and computing geotechnical variances...
        </div>
      ) : comparison ? (
        <div className="space-y-6">
          {/* Metadata Comparison Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Document Metadata Differential Matrix</span>
              </h3>
              <div className="flex items-center gap-3 text-xs">
                {docA && (
                  <button onClick={() => onOpenViewer(docA.id)} className="text-amber-400 hover:underline flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Inspect Doc A
                  </button>
                )}
                {docB && (
                  <button onClick={() => onOpenViewer(docB.id)} className="text-blue-400 hover:underline flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Inspect Doc B
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4 w-1/4">Metadata Field</th>
                    <th className="py-2.5 px-4 w-1/3 text-amber-300">Document A</th>
                    <th className="py-2.5 px-4 w-1/3 text-blue-300">Document B</th>
                    <th className="py-2.5 px-4 text-right">Match State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {comparison.metadataDiff.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-4 font-semibold text-slate-300">{row.field}</td>
                      <td className="py-2.5 px-4 text-slate-200">{row.valA}</td>
                      <td className="py-2.5 px-4 text-slate-200">{row.valB}</td>
                      <td className="py-2.5 px-4 text-right">
                        {row.status === 'identical' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Identical</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Variance</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Quantitative & Discovered Metric Deltas */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Quantitative & Discovered Metric Variance Deltas</span>
              </h3>
            </div>

            {comparison.productionDeltas.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No overlapping quantitative metrics or numerical deltas detected between these two documents.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4">Metric Parameter</th>
                      <th className="py-2.5 px-4 text-amber-300">Doc A Value</th>
                      <th className="py-2.5 px-4 text-blue-300">Doc B Value</th>
                      <th className="py-2.5 px-4">Absolute Delta</th>
                      <th className="py-2.5 px-4 text-right">Percentage Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {comparison.productionDeltas.map((delta, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-semibold text-white">{delta.metric}</td>
                        <td className="py-3 px-4 font-mono text-slate-200">{delta.valA} {delta.unit}</td>
                        <td className="py-3 px-4 font-mono text-slate-200">{delta.valB} {delta.unit}</td>
                        <td className="py-3 px-4 font-mono">
                          <span className={delta.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {delta.delta >= 0 ? `+${delta.delta}` : delta.delta} {delta.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
                            delta.percentChange >= 0 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {delta.percentChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            <span>{delta.percentChange >= 0 ? `+${delta.percentChange}%` : `${delta.percentChange}%`}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Anomaly & Conflict Observations */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Automated Cross-Document Discrepancy & Anomaly Scan</span>
            </h3>

            <div className="space-y-2">
              {comparison.conflictObservations.map((obs, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                  <span className="text-slate-300 leading-relaxed">{obs}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Entity Diff Table */}
          {comparison.entityDiff.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="p-4 border-b border-slate-800">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Entity-Level Granular Extraction Diff ({comparison.entityDiff.length} parameters)</span>
                </h3>
              </div>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] sticky top-0">
                    <tr>
                      <th className="py-2.5 px-4">Entity Identifier</th>
                      <th className="py-2.5 px-4">Category</th>
                      <th className="py-2.5 px-4 text-amber-300">Doc A Value</th>
                      <th className="py-2.5 px-4 text-blue-300">Doc B Value</th>
                      <th className="py-2.5 px-4 text-right">Alignment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {comparison.entityDiff.map((ent, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-4 font-semibold text-slate-200">{ent.key}</td>
                        <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">{ent.entityType}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-200">{ent.valA ?? '—'}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-200">{ent.valB ?? '—'}</td>
                        <td className="py-2.5 px-4 text-right">
                          {ent.status === 'common' && <span className="text-emerald-400 text-[11px] font-semibold">Matched</span>}
                          {ent.status === 'value_diff' && <span className="text-amber-400 text-[11px] font-semibold">Value Delta</span>}
                          {ent.status === 'only_a' && <span className="text-slate-500 text-[11px]">Only in A</span>}
                          {ent.status === 'only_b' && <span className="text-blue-400 text-[11px]">Only in B</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
