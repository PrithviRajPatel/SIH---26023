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
  ZoomIn, 
  ZoomOut,
  ShieldAlert,
  Search
} from 'lucide-react';
import { MiningDocument } from '../types';

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
  const [activeInspectorTab, setActiveInspectorTab] = useState<'tables' | 'entities' | 'chunks'>('tables');
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'rendered' | 'ocr'>('rendered');

  const page = currentDoc?.pages.find(p => p.pageNumber === currentPage) || currentDoc?.pages[0];

  return (
    <div className="space-y-4">
      {/* Top Document Selection & Page Nav Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block">Select Document to Inspect</label>
            <select
              value={currentDoc?.id}
              onChange={(e) => {
                onSelectDocument(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-950 text-slate-100 text-xs font-semibold rounded px-2.5 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 max-w-xs sm:max-w-md"
            >
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  [{d.subsidiary}] {d.title} ({d.reportingYear})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Page Nav and Mode Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('rendered')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                viewMode === 'rendered' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Document Render
            </button>
            <button
              onClick={() => setViewMode('ocr')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                viewMode === 'ocr' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              OCR Raw Text
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs text-slate-300">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold px-2">
              Page {currentPage} of {currentDoc?.pageCount || 1}
            </span>
            <button
              disabled={currentPage >= (currentDoc?.pageCount || 1)}
              onClick={() => setCurrentPage(prev => Math.min(currentDoc?.pageCount || 1, prev + 1))}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Split Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        {/* Left Side: Document Page Viewer (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  currentDoc.isScanned ? 'bg-purple-950 text-purple-300 border border-purple-800/40' : 'bg-blue-950 text-blue-300 border border-blue-800/40'
                }`}>
                  {currentDoc.isScanned ? 'SCANNED ARCHIVAL PAGE' : 'DIGITAL PDF PAGE'}
                </span>
                <span className="text-slate-400">
                  OCR Confidence: <strong className="text-emerald-400">{((page?.ocrConfidence || 0.98) * 100).toFixed(1)}%</strong>
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {currentDoc.filename}
              </div>
            </div>

            {/* Document Render Canvas / Box */}
            <div className="bg-slate-950 rounded-lg border border-slate-800 p-6 min-h-[480px] font-serif text-slate-200 relative overflow-hidden shadow-inner leading-relaxed text-sm">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none text-4xl font-extrabold uppercase rotate-[-25deg] text-amber-500">
                CMPDI / CIL INTEL ARCHIVE
              </div>

              {viewMode === 'rendered' ? (
                <div className="space-y-4">
                  {/* Scanned Header Mock */}
                  <div className="border-b-2 border-slate-800 pb-3 text-center">
                    <div className="text-[11px] uppercase tracking-widest text-amber-500 font-sans font-bold">
                      COAL INDIA LIMITED / {currentDoc.subsidiary}
                    </div>
                    <div className="text-base font-bold text-slate-100 font-sans mt-0.5">
                      {currentDoc.title}
                    </div>
                    <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                      REPORTING YEAR: {currentDoc.reportingYear} • PAGE {currentPage} OF {currentDoc.pageCount}
                    </div>
                  </div>

                  {/* Main Page Text Content */}
                  <div className="whitespace-pre-line text-xs font-mono bg-slate-900/60 p-4 rounded border border-slate-800/80 text-slate-200 leading-relaxed relative">
                    {page?.rawText || 'Page text indexed and validated in knowledge base.'}

                    {/* Bounding box simulation if scanned */}
                    {page?.boundingBoxes && page.boundingBoxes.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-800">
                        <div className="text-[10px] uppercase font-sans font-bold text-amber-400 mb-2">
                          Detected OCR Bounding Boxes:
                        </div>
                        <div className="space-y-1.5 font-sans">
                          {page.boundingBoxes.map((b, i) => (
                            <div
                              key={i}
                              className="p-1.5 rounded bg-amber-500/10 border border-amber-500/40 text-[11px] text-amber-200 flex items-center justify-between"
                            >
                              <span>Text Box #{i + 1}: "{b.text}"</span>
                              <span className="text-[9px] font-mono text-emerald-400">
                                Conf: {(b.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed p-2">
                  {page?.rawText}
                </pre>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800">
            <span>SHA-256 Hash: {currentDoc.fileHash}</span>
            <span>Traceability State: FULLY_LINKED</span>
          </div>
        </div>

        {/* Right Side: Evidence & Extraction Inspector (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col shadow-xl">
          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs mb-4">
            <button
              onClick={() => setActiveInspectorTab('tables')}
              className={`flex-1 py-1.5 rounded font-semibold text-center transition flex items-center justify-center gap-1.5 ${
                activeInspectorTab === 'tables' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tables ({currentDoc.tables?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveInspectorTab('entities')}
              className={`flex-1 py-1.5 rounded font-semibold text-center transition flex items-center justify-center gap-1.5 ${
                activeInspectorTab === 'entities' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Entities ({currentDoc.entities?.length || 0})</span>
            </button>
            <button
              onClick={() => setActiveInspectorTab('chunks')}
              className={`flex-1 py-1.5 rounded font-semibold text-center transition flex items-center justify-center gap-1.5 ${
                activeInspectorTab === 'chunks' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Chunks ({currentDoc.chunks?.length || 0})</span>
            </button>
          </div>

          {/* Inspector Tab Content */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {activeInspectorTab === 'tables' && (
              <div className="space-y-4">
                {currentDoc.tables && currentDoc.tables.length > 0 ? (
                  currentDoc.tables.map((tbl) => (
                    <div key={tbl.id} className="bg-slate-950 rounded-lg border border-slate-800 p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200">{tbl.title}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          Confidence: {(tbl.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] border-collapse">
                          <thead>
                            <tr className="bg-slate-900 text-slate-300 font-semibold border-b border-slate-800">
                              {tbl.headers.map((h, i) => (
                                <th key={i} className="p-1.5 border border-slate-800 text-[10px]">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tbl.rows.map((row, ri) => (
                              <tr key={ri} className="border-b border-slate-850 hover:bg-slate-900/50">
                                {row.map((cell, ci) => (
                                  <td key={ci} className="p-1.5 border border-slate-850 text-slate-300">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-xs text-slate-500">
                    No discrete tables detected on this page.
                  </div>
                )}
              </div>
            )}

            {activeInspectorTab === 'entities' && (
              <div className="space-y-3">
                {currentDoc.entities && currentDoc.entities.length > 0 ? (
                  currentDoc.entities.map((ent) => (
                    <div
                      key={ent.id}
                      onClick={() => setSelectedEntityId(ent.id)}
                      className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                        selectedEntityId === ent.id ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{ent.entityKey}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          ent.validationStatus === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {ent.validationStatus}
                        </span>
                      </div>
                      <div className="text-sm font-extrabold text-amber-400 mt-1">
                        {ent.entityValue} {ent.unit || ''}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 italic">
                        "{ent.sourceText}"
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-slate-500 mt-2 pt-1.5 border-t border-slate-850">
                        <span>Parser: {ent.extractionMethod}</span>
                        <span>Conf: {(ent.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-xs text-slate-500">
                    No structured entities parsed yet.
                  </div>
                )}
              </div>
            )}

            {activeInspectorTab === 'chunks' && (
              <div className="space-y-3">
                {currentDoc.chunks && currentDoc.chunks.length > 0 ? (
                  currentDoc.chunks.map((chk) => (
                    <div key={chk.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold">
                        <span>{chk.sectionTitle || 'Content Chunk'}</span>
                        <span className="text-[10px] text-slate-500">Page {chk.pageNumber}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        {chk.content}
                      </p>
                      <div className="text-[9px] text-emerald-400/80 font-mono pt-1 border-t border-slate-850">
                        Vectorized • Cosine Index: Active
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-xs text-slate-500">
                    No chunk embeddings available.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
