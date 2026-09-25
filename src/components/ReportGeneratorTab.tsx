import React, { useState } from 'react';
import { 
  FileSignature, 
  Download, 
  FileText, 
  Table, 
  Clock, 
  CheckCircle, 
  Layers, 
  Sparkles, 
  FileSpreadsheet, 
  FileCode,
  ExternalLink,
  ChevronRight,
  Printer
} from 'lucide-react';
import { GeneratedReport } from '../types';
import { exportReportToPdf, exportReportToExcel, exportReportToDocx } from '../utils/exportUtils';

interface ReportGeneratorTabProps {
  reports: GeneratedReport[];
  onGenerateReport: (payload: any) => Promise<GeneratedReport>;
  onOpenViewer: (docId: string) => void;
}

export const ReportGeneratorTab: React.FC<ReportGeneratorTabProps> = ({
  reports,
  onGenerateReport,
  onOpenViewer
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);

  // Generator form
  const [reportType, setReportType] = useState('Consolidated Performance & Geological Review');
  const [subsidiary, setSubsidiary] = useState('All Subsidiaries');
  const [mineName, setMineName] = useState('All Mines Combined');
  const [startYear, setStartYear] = useState(2020);
  const [endYear, setEndYear] = useState(2024);

  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const rep = await onGenerateReport({
        reportType,
        subsidiary,
        mineName,
        startYear,
        endYear
      });
      setSelectedReportId(rep.id);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-amber-400" />
            Automated Report Generation Platform (13 Statutory Sections)
          </h2>
          <p className="text-xs text-slate-400">
            Synthesizes geological, mining, and production data into official statutory dossiers with export to PDF, Excel, and Word.
          </p>
        </div>
      </div>

      {/* Generator Configuration Form & Archive Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Generator Form (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold text-white">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Generate New Statutory Report</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Report Template</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="Consolidated Performance & Geological Review">Consolidated Performance & Geological Review</option>
                <option value="Parliamentary High-Priority Inquiry Dossier">Parliamentary High-Priority Inquiry Dossier</option>
                <option value="CMPDI Exploration & Coal Reserve Assessment">CMPDI Exploration & Coal Reserve Assessment</option>
                <option value="Annual Opencast & Underground Production Audit">Annual Opencast & Underground Production Audit</option>
                <option value="Mine Safety & Slope Geotechnical Dossier">Mine Safety & Slope Geotechnical Dossier</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subsidiary</label>
                <select
                  value={subsidiary}
                  onChange={(e) => {
                    const sub = e.target.value;
                    setSubsidiary(sub);
                    if (sub === 'SECL') setMineName('Gevra Mega OC');
                    else if (sub === 'NCL') setMineName('Jayant OCP');
                    else if (sub === 'BCCL') setMineName('Moonidih Underground Project');
                    else if (sub === 'MCL') setMineName('Belpahar OCP');
                    else setMineName('All Mines Combined');
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="All Subsidiaries">All Subsidiaries</option>
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

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Mine</label>
                <input
                  type="text"
                  value={mineName}
                  onChange={(e) => setMineName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Start Year</label>
                <select
                  value={startYear}
                  onChange={(e) => setStartYear(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value={2020}>FY 2020</option>
                  <option value={2021}>FY 2021</option>
                  <option value={2022}>FY 2022</option>
                  <option value={2023}>FY 2023</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">End Year</label>
                <select
                  value={endYear}
                  onChange={(e) => setEndYear(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value={2024}>FY 2024</option>
                  <option value={2023}>FY 2023</option>
                  <option value={2022}>FY 2022</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow transition disabled:opacity-50"
              >
                <FileSignature className="w-4 h-4 text-slate-950" />
                <span>{isGenerating ? 'Compiling 13 Sections...' : 'Generate 13-Section Report (12.4s)'}</span>
              </button>
            </div>
          </form>

          {/* Past Generated Reports List */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Generated Reports Archive ({reports.length})
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`p-2 rounded-lg text-xs cursor-pointer border transition flex items-center justify-between ${
                    rep.id === activeReport?.id ? 'bg-amber-500/10 border-amber-500/50 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="font-semibold truncate">{rep.title}</div>
                    <div className="text-[10px] text-slate-500">{rep.reportingPeriod} • {rep.subsidiary}</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Live Report Preview & Export Actions (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-xl">
          {activeReport ? (
            <div className="space-y-4">
              {/* Header & Export Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400">
                    Official Statutory Document
                  </span>
                  <h3 className="text-sm font-bold text-white line-clamp-1">
                    {activeReport.title}
                  </h3>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {activeReport.reportingPeriod} • Prepared By: {activeReport.generatedBy}
                  </div>
                </div>

                {/* 1-Click Export Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportReportToPdf(activeReport)}
                    className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1 transition shadow-sm"
                    title="Export as PDF Document"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => exportReportToExcel(activeReport)}
                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1 transition shadow-sm"
                    title="Export as Multi-Sheet Excel Workbook"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Excel</span>
                  </button>
                  <button
                    onClick={() => exportReportToDocx(activeReport)}
                    className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1 transition shadow-sm"
                    title="Export as Word Document"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Word</span>
                  </button>
                </div>
              </div>

              {/* Summary Stats Row */}
              <div className="grid grid-cols-4 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">Total Production</div>
                  <div className="text-xs font-bold text-amber-400 mt-0.5">
                    {activeReport.summaryStats.totalProductionMt} MT
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Achievement</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">
                    {activeReport.summaryStats.targetAchievementPct}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Proved Reserves</div>
                  <div className="text-xs font-bold text-blue-400 mt-0.5">
                    {activeReport.summaryStats.reservesAssessedMt} MT
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Data Confidence</div>
                  <div className="text-xs font-bold text-purple-400 mt-0.5">
                    {activeReport.summaryStats.dataConfidenceScore}%
                  </div>
                </div>
              </div>

              {/* Sections Scrollable Preview */}
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 max-h-[460px] overflow-y-auto space-y-4 text-xs text-slate-200">
                {activeReport.sections.map((sec) => (
                  <div key={sec.id} className="space-y-1.5 pb-3 border-b border-slate-850 last:border-0">
                    <h4 className="font-bold text-amber-400 text-xs flex items-center justify-between">
                      <span>{sec.title}</span>
                    </h4>
                    <p className="text-slate-300 leading-relaxed text-[11px] whitespace-pre-line">
                      {sec.content}
                    </p>

                    {/* Extracted table preview */}
                    {sec.table && (
                      <div className="overflow-x-auto my-2">
                        <table className="w-full text-left text-[10px] border-collapse">
                          <thead>
                            <tr className="bg-slate-900 text-slate-300 font-semibold border-b border-slate-800">
                              {sec.table.headers.map((h, hi) => (
                                <th key={hi} className="p-1.5 border border-slate-800">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sec.table.rows.map((row, ri) => (
                              <tr key={ri} className="border-b border-slate-850 hover:bg-slate-900/50">
                                {row.map((cell, ci) => (
                                  <td key={ci} className="p-1.5 border border-slate-850 text-slate-300">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {sec.citations && sec.citations.length > 0 && (
                      <div className="text-[9px] text-slate-500 font-mono flex items-center gap-1 mt-1">
                        <span>Source:</span>
                        <span className="text-slate-400">{sec.citations.join(' • ')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-xs text-slate-500">
              No report selected. Generate a new report using the left configuration form.
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
            <span>Official Government Compliance: DGMS & CMPDI Standards</span>
            <span>SIH26023 Automated Report Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
