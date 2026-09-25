import React, { useState } from 'react';
import { Search, Filter, FileText, ExternalLink, Calendar, MapPin, Tag } from 'lucide-react';
import { MiningDocument } from '../types';

interface SearchTabProps {
  documents: MiningDocument[];
  onOpenViewer: (docId: string) => void;
}

export const SearchTab: React.FC<SearchTabProps> = ({ documents, onOpenViewer }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSub, setSelectedSub] = useState('ALL');

  const results = documents.filter(doc => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const inTitle = doc.title.toLowerCase().includes(term);
    const inFilename = doc.filename.toLowerCase().includes(term);
    const inSub = doc.subsidiary.toLowerCase().includes(term);
    const inMine = doc.mineName?.toLowerCase().includes(term);
    const inTags = doc.tags.some(t => t.toLowerCase().includes(term));
    const inText = doc.pages.some(p => p.rawText.toLowerCase().includes(term));
    const inTables = doc.tables?.some(t => t.title.toLowerCase().includes(term) || t.headers.some(h => h.toLowerCase().includes(term)));

    const matchSub = selectedSub === 'ALL' || doc.subsidiary.toLowerCase().includes(selectedSub.toLowerCase());

    return (inTitle || inFilename || inSub || inMine || inTags || inText || inTables) && matchSub;
  });

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            Global Enterprise Knowledge Search
          </h2>
          <p className="text-xs text-slate-400">
            Search across scanned OCR documents, digital PDFs, spreadsheets, geological boreholes, and extracted entity tables.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search keyword (e.g. 'Gevra', 'Methane', '50.80 MT', 'Borehole', 'Stripping ratio')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <select
            value={selectedSub}
            onChange={(e) => setSelectedSub(e.target.value)}
            className="w-full sm:w-48 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Coalfields</option>
            <option value="SECL">SECL</option>
            <option value="MCL">MCL</option>
            <option value="NCL">NCL</option>
            <option value="CCL">CCL</option>
            <option value="BCCL">BCCL</option>
            <option value="WCL">WCL</option>
            <option value="ECL">ECL</option>
            <option value="CMPDI">CMPDI</option>
          </select>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>{results.length} Search Matches Found</span>
          <span className="text-amber-400/80">Semantic & Keyword Index Active</span>
        </div>

        {results.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {doc.subsidiary}
                </span>
                <span className="text-[10px] text-slate-400">{doc.reportingYear}</span>
                <span className="text-[10px] text-slate-500">•</span>
                <span className="text-[10px] text-slate-400">{doc.docType.replace(/_/g, ' ')}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition">
                {doc.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {doc.summary || doc.pages[0]?.rawText.substring(0, 160) + '...'}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {doc.tags.map((t, ti) => (
                  <span key={ti} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
              <div className="text-[10px] text-slate-500 font-mono">
                {doc.pageCount} Pages • {doc.tables?.length || 0} Tables
              </div>
              <button
                onClick={() => onOpenViewer(doc.id)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition border border-slate-700"
              >
                <span>Inspect</span>
                <ExternalLink className="w-3 h-3 text-amber-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
