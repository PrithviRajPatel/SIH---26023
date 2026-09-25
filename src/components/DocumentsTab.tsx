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
  Layers
} from 'lucide-react';
import { MiningDocument, DocumentType } from '../types';

interface DocumentsTabProps {
  documents: MiningDocument[];
  onOpenViewer: (docId: string) => void;
  onUploadDocument: (data: any) => Promise<void>;
  onReprocessDocument: (docId: string) => Promise<void>;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  onOpenViewer,
  onUploadDocument,
  onReprocessDocument
}) => {
  const [search, setSearch] = useState('');
  const [selectedSub, setSelectedSub] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFilename, setUploadFilename] = useState('');
  const [uploadSub, setUploadSub] = useState('SECL');
  const [uploadMine, setUploadMine] = useState('Kusmunda OC');
  const [uploadYear, setUploadYear] = useState(2024);
  const [uploadType, setUploadType] = useState<DocumentType>('ANNUAL_REPORT');
  const [uploadFileType, setUploadFileType] = useState('pdf');
  const [uploadText, setUploadText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handlePresetSelect = (preset: 'scanned_pithead' | 'drilling_log' | 'parliament_inquiry') => {
    if (preset === 'scanned_pithead') {
      setUploadTitle('ECL Jhanjra Underground - Longwall Mechanical Monthly Journal');
      setUploadFilename('ECL_Jhanjra_Underground_Monthly_2024.pdf');
      setUploadSub('ECL');
      setUploadMine('Jhanjra Colliery');
      setUploadYear(2024);
      setUploadType('SCANNED_MINING_REPORT');
      setUploadFileType('pdf_scanned');
      setUploadText(`EASTERN COALFIELDS LIMITED - JHANJRA AREA\nOPERATIONAL LOG SHEET - MARCH 2024\nContinuous Miner Face No. 3 achieved raw coal extraction of 0.28 MT.\nGas drainage concentration within permissible DGMS threshold (<0.4% CH4 in return airway).\nTotal manpower deployment: 412 workmen. OMS: 2.18 tonnes/manshift.`);
    } else if (preset === 'drilling_log') {
      setUploadTitle('CMPDI RI-I Asansol - Borehole Exploration Seam Correlation Dossier');
      setUploadFilename('CMPDI_Raniganj_Borehole_Exploration_2023.pdf');
      setUploadSub('CMPDI');
      setUploadMine('Raniganj East Block');
      setUploadYear(2023);
      setUploadType('GEOLOGICAL_ASSESSMENT');
      setUploadFileType('pdf');
      setUploadText(`CENTRAL MINE PLANNING & DESIGN INSTITUTE (RI-I ASANSOL)\nGEOLOGICAL DRILLING REPORT\nBlock: Raniganj Deep Exploration Block\nDrilled 18 deep core boreholes totalling 6,240 m.\nDiscovered thick Kajora Seam at depth of 280m with average thickness of 7.4m.\nProved coking-grade coal reserves evaluated at 145.00 MT.`);
    } else {
      setUploadTitle('Ministry of Coal - Rajya Sabha Unstarred Q#118: Coking Coal Import Substitution');
      setUploadFilename('RajyaSabha_Unstarred_Q118_CokingCoal.pdf');
      setUploadSub('Ministry of Coal');
      setUploadMine('All Coking Mines');
      setUploadYear(2024);
      setUploadType('PARLIAMENTARY_INQUIRY');
      setUploadFileType('pdf');
      setUploadText(`MINISTRY OF COAL - RAJYA SABHA PARLIAMENTARY SECRETARIAT\nUNSTARRED QUESTION NO. 118\nRegarding domestic coking coal blending in steel production.\nBCCL and CCL produced 54.2 MT raw coking coal during FY 2023-24.\nWasheries operated at average capacity utilization of 74.2%, producing 12.8 MT washed clean coal for SAIL and RINL.`);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUploadDocument({
        title: uploadTitle,
        filename: uploadFilename,
        subsidiary: uploadSub,
        mineName: uploadMine,
        reportingYear: uploadYear,
        docType: uploadType,
        fileType: uploadFileType,
        textContent: uploadText
      });
      setIsUploadModalOpen(false);
      // Reset form
      setUploadTitle('');
      setUploadFilename('');
      setUploadText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            Document Ingestion & Knowledge Index
          </h2>
          <p className="text-xs text-slate-400">
            Support for scanned PDFs, spreadsheets, Word docs, and geological assessments with OCR and table extraction.
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md transition self-start sm:self-auto"
        >
          <FileUp className="w-4 h-4 text-slate-950" />
          <span>Ingest New Document</span>
        </button>
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
                        <span title={`File Hash: ${doc.fileHash}`}>
                          {doc.fileHash.substring(0, 14)}...
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
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload & Ingestion Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileUp className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Ingest CMPDI / CIL Mining Document</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets for Hackathon Demonstration */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Load Sample Realistic Mining Document Preset:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetSelect('scanned_pithead')}
                  className="p-2 rounded bg-slate-800 hover:bg-slate-750 text-left border border-slate-700 text-[11px] transition"
                >
                  <div className="font-bold text-amber-400">Scanned Colliery Log</div>
                  <div className="text-slate-400 text-[10px]">ECL Jhanjra Underground</div>
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('drilling_log')}
                  className="p-2 rounded bg-slate-800 hover:bg-slate-750 text-left border border-slate-700 text-[11px] transition"
                >
                  <div className="font-bold text-blue-400">Geological Drilling Log</div>
                  <div className="text-slate-400 text-[10px]">CMPDI Borehole Appraisal</div>
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('parliament_inquiry')}
                  className="p-2 rounded bg-slate-800 hover:bg-slate-750 text-left border border-slate-700 text-[11px] transition"
                >
                  <div className="font-bold text-emerald-400">Parliamentary Q&A</div>
                  <div className="text-slate-400 text-[10px]">Rajya Sabha Coking Coal</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SECL Kusmunda OCP Annual Performance Report 2024"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Filename</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SECL_Kusmunda_2024.pdf"
                    value={uploadFilename}
                    onChange={(e) => setUploadFilename(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Format Type</label>
                  <select
                    value={uploadFileType}
                    onChange={(e) => setUploadFileType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="pdf">Digital PDF</option>
                    <option value="pdf_scanned">Scanned PDF (OCR Required)</option>
                    <option value="xlsx">Excel Spreadsheet (XLSX)</option>
                    <option value="docx">Word Document (DOCX)</option>
                    <option value="csv">CSV Structured Data</option>
                    <option value="jpg">Scanned Image (JPG / PNG)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subsidiary</label>
                  <select
                    value={uploadSub}
                    onChange={(e) => setUploadSub(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="SECL">SECL</option>
                    <option value="MCL">MCL</option>
                    <option value="NCL">NCL</option>
                    <option value="CCL">CCL</option>
                    <option value="BCCL">BCCL</option>
                    <option value="WCL">WCL</option>
                    <option value="ECL">ECL</option>
                    <option value="CMPDI">CMPDI</option>
                    <option value="Ministry of Coal">Ministry of Coal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Mine / Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. Kusmunda OC"
                    value={uploadMine}
                    onChange={(e) => setUploadMine(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Year</label>
                  <input
                    type="number"
                    value={uploadYear}
                    onChange={(e) => setUploadYear(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Document Content (Extracted Text / OCR Buffer)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter or paste operational figures, tables, or geological data..."
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition disabled:opacity-50"
                >
                  <FileUp className="w-4 h-4 text-slate-950" />
                  <span>{isSubmitting ? 'Ingesting & Vectorizing...' : 'Ingest & Process'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
