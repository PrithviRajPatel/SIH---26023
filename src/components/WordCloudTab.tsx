import React, { useState } from 'react';
import { 
  Cloud, 
  Tag, 
  Sparkles, 
  Filter, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  Search
} from 'lucide-react';
import { WordCloudItem, MiningDocument } from '../types';

interface WordCloudTabProps {
  wordCloud: WordCloudItem[];
  documents: MiningDocument[];
  onOpenViewer: (docId: string) => void;
}

export const WordCloudTab: React.FC<WordCloudTabProps> = ({
  wordCloud,
  documents,
  onOpenViewer
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedWord, setSelectedWord] = useState<WordCloudItem | null>(null);

  const filteredWords = wordCloud.filter(w => {
    if (selectedCategory === 'ALL') return true;
    return w.category === selectedCategory;
  });

  if (wordCloud.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
        <Cloud className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white mb-1">Vocabulary Cloud Empty</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          The vocabulary word cloud dynamically computes term frequencies from ingested files after stripping English and administrative stopwords. Ingest documents to populate the cloud.
        </p>
      </div>
    );
  }

  // Find documents containing selected word
  const matchingDocs = selectedWord 
    ? documents.filter(d => {
        const text = (d.title + ' ' + (d.summary || '') + ' ' + (d.tags || []).join(' ')).toLowerCase();
        return text.includes(selectedWord.text.toLowerCase());
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cloud className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Automated Mining Vocabulary Cloud Engine</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Real-time keyword frequency extraction with domain-specific stopword elimination (English + administrative boilerplate) categorized into production, geology, safety, subsidiary, and equipment dimensions.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-xs">
          {['ALL', 'production', 'geology', 'safety', 'equipment', 'subsidiary', 'general'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded capitalize font-semibold transition ${
                selectedCategory === cat ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Word Cloud Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Dynamic Interactive Vocabulary Cloud ({filteredWords.length} terms)</h3>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Font size scales proportionally with term occurrence frequency across repository
          </span>
        </div>

        {/* Canvas */}
        <div className="bg-slate-950 rounded-xl p-8 border border-slate-800/80 min-h-[260px] flex flex-wrap items-center justify-center gap-3 sm:gap-5 select-none">
          {filteredWords.map((item, idx) => {
            const minSize = 12;
            const maxSize = 28;
            const maxVal = Math.max(...wordCloud.map(w => w.value), 20);
            const size = Math.round(minSize + (item.value / maxVal) * (maxSize - minSize));
            const isSelected = selectedWord?.text === item.text;

            let color = 'text-amber-400';
            if (item.category === 'safety') color = 'text-rose-400';
            else if (item.category === 'geology') color = 'text-blue-400';
            else if (item.category === 'equipment') color = 'text-purple-400';
            else if (item.category === 'subsidiary') color = 'text-emerald-400';
            else if (item.category === 'general') color = 'text-slate-300';

            return (
              <button
                key={idx}
                onClick={() => setSelectedWord(item)}
                style={{ fontSize: `${size}px` }}
                className={`font-bold tracking-tight transition-all duration-200 hover:scale-115 px-2.5 py-1 rounded cursor-pointer ${color} ${
                  isSelected ? 'bg-amber-500/20 ring-1 ring-amber-400 text-amber-300' : 'hover:bg-slate-900'
                }`}
                title={`Term: ${item.text} | Frequency: ${item.value} | Category: ${item.category} | Appears in ${item.docCount} docs`}
              >
                {item.text}
              </button>
            );
          })}
        </div>

        {/* Category Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Production Metrics</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> Geology & Seam</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Safety & DGMS</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span> Heavy Machinery / Equipment</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> CIL Subsidiaries</span>
        </div>
      </div>

      {/* Selected Term Details & Matching Documents */}
      {selectedWord && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold font-mono text-amber-400">{selectedWord.text}</span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300 capitalize">
                Category: {selectedWord.category}
              </span>
            </div>

            <div className="text-xs text-slate-400">
              Total Occurrences: <strong className="text-white font-mono">{selectedWord.value}</strong> • Ingested Docs: <strong className="text-white font-mono">{selectedWord.docCount}</strong>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Correlated Ingested Documents Containing "{selectedWord.text}"</span>
            </h4>

            {matchingDocs.length === 0 ? (
              <div className="text-xs text-slate-400 p-3 bg-slate-950 rounded-lg border border-slate-800">
                Found throughout repository chunks and tables.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchingDocs.slice(0, 4).map(doc => (
                  <div key={doc.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-200 mb-0.5">{doc.title}</div>
                      <div className="text-[11px] text-slate-400">{doc.subsidiary} • {doc.reportingYear} • {doc.pageCount} pages</div>
                    </div>
                    <button
                      onClick={() => onOpenViewer(doc.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] flex items-center gap-1 shrink-0"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
