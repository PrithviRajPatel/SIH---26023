import React, { useState } from 'react';
import { 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  FileText, 
  ExternalLink, 
  Sparkles,
  Search,
  Tag
} from 'lucide-react';
import { TopicItem } from '../types';

interface TopicsTabProps {
  topics: TopicItem[];
  onOpenViewer: (docId: string) => void;
}

export const TopicsTab: React.FC<TopicsTabProps> = ({
  topics,
  onOpenViewer
}) => {
  const [selectedTopic, setSelectedTopic] = useState<TopicItem | null>(topics[0] || null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTopics = topics.filter(t => 
    t.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (topics.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
        <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white mb-1">No Topics Identified Yet</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Topics are dynamically synthesized from ingested operational reports, geological assessments, and parliamentary dossiers. Upload documents to generate topic clusters.
        </p>
      </div>
    );
  }

  const activeTopic = selectedTopic || topics[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Automated Topic Modeling & Semantic Clusters</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Semantic topic extraction with trend acceleration tracking, keyword identification, and automatic cross-referencing across mining subsidiaries and technical domains.
          </p>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics & keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 w-60"
          />
        </div>
      </div>

      {/* Topics Grid & Detailed Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Topic Cards List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredTopics.map((topic) => {
            const isSelected = activeTopic?.id === topic.id;
            return (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition ${
                  isSelected 
                    ? 'bg-slate-850 border-amber-500 shadow-md ring-1 ring-amber-500/30' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <h3 className="text-sm font-bold text-white">{topic.topic}</h3>
                  </div>

                  <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                    topic.trend === 'INCREASING' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    topic.trend === 'DECREASING' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {topic.trend === 'INCREASING' ? <TrendingUp className="w-3 h-3" /> :
                     topic.trend === 'DECREASING' ? <TrendingDown className="w-3 h-3" /> :
                     <Minus className="w-3 h-3" />}
                    <span>{topic.growthPercentage >= 0 ? `+${topic.growthPercentage}%` : `${topic.growthPercentage}%`}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  {topic.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {topic.keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 font-mono text-[10px] border border-slate-800">
                        #{kw}
                      </span>
                    ))}
                  </div>

                  <span className="text-slate-400 font-medium">
                    {topic.documentCount} Document{topic.documentCount !== 1 ? 's' : ''} Indexed
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Topic Inspector */}
        {activeTopic && (
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg self-start">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Topic Deep Dive & Evidence Links</h3>
            </div>

            <div>
              <div className="text-base font-bold text-white mb-1">{activeTopic.topic}</div>
              <p className="text-xs text-slate-300 leading-relaxed">{activeTopic.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Cluster Frequency</span>
                <span className="text-base font-bold text-amber-400 font-mono">{activeTopic.frequency}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Trend Acceleration</span>
                <span className="text-base font-bold text-emerald-400 font-mono">+{activeTopic.growthPercentage}%</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Salient Domain Vocabulary</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeTopic.keywords.map((kw, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded bg-slate-800 text-amber-300 font-mono text-xs border border-slate-700">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Indexed Correlated Documents ({activeTopic.relatedDocIds.length})</span>
              </div>

              {activeTopic.relatedDocIds.length === 0 ? (
                <div className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded border border-slate-800">
                  Correlated across whole repository corpus.
                </div>
              ) : (
                <div className="space-y-2">
                  {activeTopic.relatedDocIds.map((docId, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-300 truncate max-w-xs">{docId}</span>
                      <button
                        onClick={() => onOpenViewer(docId)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] flex items-center gap-1"
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
    </div>
  );
};
