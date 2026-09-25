import React, { useState } from 'react';
import { 
  Cloud, 
  Tag, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Filter, 
  FileText, 
  Layers, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { TopicItem, WordCloudItem } from '../types';

interface TopicsWordCloudTabProps {
  topics: TopicItem[];
  wordCloud: WordCloudItem[];
  onOpenViewer: (docId: string) => void;
}

export const TopicsWordCloudTab: React.FC<TopicsWordCloudTabProps> = ({
  topics,
  wordCloud,
  onOpenViewer
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedWord, setSelectedWord] = useState<WordCloudItem | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(topics[0] || null);

  const filteredWords = wordCloud.filter(w => {
    if (selectedCategory === 'ALL') return true;
    return w.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cloud className="w-5 h-5 text-amber-400" />
            Automated Word Cloud & Topic Identification Module
          </h2>
          <p className="text-xs text-slate-400">
            Mandatory SIH functional module: Unsupervised semantic clustering, mining stopword elimination, and trend detection.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          {['ALL', 'production', 'geology', 'safety', 'equipment', 'subsidiary'].map((cat) => (
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

      {/* Interactive Word Cloud Board */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Interactive Mining Vocabulary Cloud</h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Click any keyword to inspect frequency & indexed documents
          </span>
        </div>

        {/* Word Cloud Canvas */}
        <div className="bg-slate-950 rounded-lg p-6 border border-slate-800 min-h-[220px] flex flex-wrap items-center justify-center gap-3 sm:gap-4 select-none">
          {filteredWords.map((item, idx) => {
            // Scale font size based on frequency value
            const minSize = 11;
            const maxSize = 24;
            const size = Math.round(minSize + ((item.value - 30) / 65) * (maxSize - minSize));

            const isSelected = selectedWord?.text === item.text;

            let color = 'text-amber-400';
            if (item.category === 'safety') color = 'text-rose-400';
            else if (item.category === 'geology') color = 'text-blue-400';
            else if (item.category === 'equipment') color = 'text-purple-400';
            else if (item.category === 'subsidiary') color = 'text-emerald-400';

            return (
              <button
                key={idx}
                onClick={() => setSelectedWord(item)}
                style={{ fontSize: `${size}px` }}
                className={`font-bold tracking-tight transition-all duration-200 hover:scale-115 px-2 py-1 rounded cursor-pointer ${color} ${
                  isSelected ? 'bg-amber-500/20 ring-1 ring-amber-400 text-amber-300' : 'hover:bg-slate-900'
                }`}
              >
                {item.text}
              </button>
            );
          })}
        </div>

        {/* Selected Word Details Callout */}
        {selectedWord && (
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-3">
              <span className="font-bold text-amber-400 text-sm">{selectedWord.text}</span>
              <span className="text-slate-400">Category: <strong className="text-slate-200 capitalize">{selectedWord.category}</strong></span>
              <span className="text-slate-400">Frequency Weight: <strong className="text-white">{selectedWord.value}</strong></span>
              <span className="text-slate-400">Document Occurrence: <strong className="text-emerald-400">{selectedWord.docCount} Reports</strong></span>
            </div>
            <button
              onClick={() => setSelectedWord(null)}
              className="text-xs text-slate-500 hover:text-slate-300 font-semibold"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Topic Identification & Modeling Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-400" />
              Identified Document Topics & Growth Trends
            </h3>
            <p className="text-xs text-slate-400">
              Categorized via document clustering with growth trajectory and linked archival reports.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((top) => {
            const isSelected = selectedTopic?.id === top.id;

            return (
              <div
                key={top.id}
                onClick={() => setSelectedTopic(top)}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition flex flex-col justify-between ${
                  isSelected ? 'bg-amber-500/10 border-amber-500 shadow-md' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-100 text-sm line-clamp-1">{top.topic}</span>
                    <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      top.trend === 'INCREASING' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      top.trend === 'DECREASING' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {top.trend === 'INCREASING' ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      <span>+{top.growthPercentage}%</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    {top.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {top.keywords.slice(0, 4).map((kw, ki) => (
                      <span key={ki} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-850 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Frequency: {top.frequency}</span>
                  <span className="text-amber-400 font-semibold">{top.documentCount} Supporting Reports</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Topic Supporting Documents */}
        {selectedTopic && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Supporting Archival Documents for "{selectedTopic.topic}":
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedTopic.relatedDocIds.map((docId) => (
                <button
                  key={docId}
                  onClick={() => onOpenViewer(docId)}
                  className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left text-xs flex items-center justify-between transition group"
                >
                  <span className="font-semibold text-slate-300 group-hover:text-amber-400 truncate pr-2">
                    {docId.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
