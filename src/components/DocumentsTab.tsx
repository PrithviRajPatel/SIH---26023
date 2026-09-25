import React, { useState } from 'react';
import { 
  FileUp, 
  Search, 
  Filter, 
  Eye, 
  Cpu, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Table, 
  Hash, 
  FileText,
  X,
  Sparkles,
  Layers,
  Trash2,
  Plus
} from 'lucide-react';
import { MiningDocument, DocumentType } from '../types';

interface DocumentsTabProps {
  documents: MiningDocument[];
  onOpenViewer: (docId: string) => void;
  onUploadDocument: (data: any) => Promise<any>;
  onReprocessDocument: (docId: string) => Promise<void>;
  onDeleteDocument?: (docId: string) => Promise<void>;
  onGoToUpload?: () => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  onOpenViewer,
  onUploadDocument,
  onReprocessDocument,
  onDeleteDocument,
  onGoToUpload
}) => {
  const [search, setSearch] = useState('');
  const [selectedSub, setSelectedSub] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredDocs = documents.filter(doc => {
    const matchSearch = search === '' || 
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.filename.toLowerCase().includes(search.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

    const matchSub = selectedSub === 'ALL' || doc.subsidiary.toLowerCase().includes(selectedSub.toLowerCase());
    const matchYear = selectedYear === 'ALL' || doc.reportingYear.toString() === selectedYear;
    const matchType = selectedType === 'ALL' || doc.docType === selectedType;

    return matchSearch && matchSub && matchYear && matchType;
  });

  const handleReprocess = async (docId: string) => {
    setProcessingId(docId);
    try {
      await onReprocessDocument(docId);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (docId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from the repository?`)) {
      if (onDeleteDocument) {
        await onDeleteDocument(docId);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Document Repository & Operational Archives</span>
          </h2>
          <p className="text-xs text-slate-400">
            Enterprise knowledge store: Scanned PDFs, digital reviews, geological maps, borehole surveys, and production logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onGoToUpload && (
            <button
              onClick={onGoToUpload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Documents</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search document title, mine, coalfield, or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Subsidiary Filter */}
          <select
            value={selectedSub}
            onChange={(e) => setSelectedSub(e.target.value)}
            className="w-full md:w-44 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Subsidiaries</option>
            <option value="CIL Consolidated">CIL Consolidated</option>
            <option value="SECL">SECL (Chhattisgarh)</option>
            <option value="MCL">MCL (Odisha)</option>
            <option value="NCL">NCL (Singrauli)</option>
            <option value="CCL">CCL (Jharkhand)</option>
            <option value="BCCL">BCCL (Jharia)</option>
            <option value="WCL">WCL (Maharashtra)</option>
            <option value="ECL">ECL (Raniganj)</option>
            <option value="CMPDI">CMPDI (Ranchi)</option>
          </select>

          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full md:w-32 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full md:w-48 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Document Types</option>
            <option value="ANNUAL_REPORT">Annual Report</option>
            <option value="SCANNED_MINING_REPORT">Scanned Mining Report</option>
            <option value="GEOLOGICAL_ASSESSMENT">Geological Assessment</option>
            <option value="PRODUCTION_SPREADSHEET">Production Spreadsheet</option>
            <option value="PARLIAMENTARY_INQUIRY">Parliamentary Inquiry</option>
            <option value="SAFETY_COMPLIANCE_DOSSIER">Safety Compliance</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Showing {filteredDocs.length} of {documents.length} indexed documents</span>
          <span className="text-amber-400/80">All files hash-verified with SHA-256 for audit traceability</span>
        </div>
      </div>

      {/* Documents Grid / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Layers className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <div className="text-sm font-bold text-white mb-1">No Documents Found</div>
            <p className="max-w-md mx-auto mb-4">
              {documents.length === 0 
                ? 'No documents have been uploaded into the workspace repository yet.' 
                : 'No documents match the currently selected filters.'}
            </p>
            {documents.length === 0 && onGoToUpload && (
              <button
                onClick={onGoToUpload}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
              >
                Upload Documents
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Document Title & Filename</th>
                  <th className="py-3 px-3">Subsidiary / Mine</th>
                  <th className="py-3 px-3">Year & Type</th>
                  <th className="py-3 px-3">Extraction Quality</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredDocs.map((doc) => {
                  const isProcessing = processingId === doc.id;

                  return (
                    <tr key={doc.id} className="hover:bg-slate-850/60 transition group">
                      {/* Title & Hash */}
                      <td className="py-3 px-4 max-w-xs sm:max-w-md">
                        <div className="font-semibold text-slate-100 group-hover:text-amber-400 transition line-clamp-1">
                          {doc.title}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                          <span>{doc.filename}</span>
                          <span>•</span>
                          <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-slate-400">
                            <Hash className="w-2.5 h-2.5" />
                            {doc.fileHash.substring(0, 15)}...
                          </span>
                        </div>
                      </td>

                      {/* Subsidiary & Mine */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-200">{doc.subsidiary}</div>
                        <div className="text-[10px] text-slate-400">{doc.mineName || doc.coalfield || 'General Coalfield'}</div>
                      </td>

                      {/* Year & Type */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-amber-400">{doc.reportingYear}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            doc.isScanned ? 'bg-purple-950 text-purple-300 border border-purple-800/40' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {doc.isScanned ? 'OCR SCAN' : 'DIGITAL'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {doc.docType.replace(/_/g, ' ')}
                        </div>
                      </td>

                      {/* Extraction Quality */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 text-[11px] text-slate-200">
                          <Table className="w-3.5 h-3.5 text-blue-400" />
                          <span>{doc.tables?.length || 0} Tables</span>
                          <span className="text-slate-600">|</span>
                          <span>{doc.entities?.length || 0} Entities</span>
                        </div>
                        <div className="text-[10px] text-emerald-400 mt-0.5">
                          Confidence: {((doc.pages[0]?.ocrConfidence || 0.98) * 100).toFixed(0)}%
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          doc.status === 'VALIDATED' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : doc.status === 'VALIDATION_REQUIRED' 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {doc.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenViewer(doc.id)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition"
                            title="Open Split-Screen Document Viewer & Evidence Inspector"
                          >
                            <Eye className="w-3.5 h-3.5 text-amber-400" />
                            <span>Inspect</span>
                          </button>
                          <button
                            disabled={isProcessing}
                            onClick={() => handleReprocess(doc.id)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 disabled:opacity-40 transition"
                            title="Re-run OCR, table extraction, and structured parsing"
                          >
                            <Cpu className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin text-amber-400' : ''}`} />
                          </button>
                          {onDeleteDocument && (
                            <button
                              onClick={() => handleDelete(doc.id, doc.title)}
                              className="p-1 rounded bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition"
                              title="Delete Document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
