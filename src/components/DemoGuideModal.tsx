import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  FileUp, 
  Cpu, 
  Table, 
  ShieldCheck, 
  MessageSquare, 
  Search, 
  BarChart3, 
  FileText, 
  Download,
  ExternalLink
} from 'lucide-react';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
  onSelectSampleQuestion?: (q: string) => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  onSelectSampleQuestion
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'STEP 1: Document Ingestion & Heterogeneous Files',
      tab: 'documents',
      icon: <FileUp className="w-5 h-5 text-amber-400" />,
      description: 'CMPDI & CIL subsidiaries process scanned PDFs, digital annual reviews, geological assessments, and spreadsheets. View the 10 preloaded demonstration documents or upload a new report.',
      actionText: 'Go to Documents & Upload',
      execute: () => {
        setActiveTab('documents');
        onClose();
      }
    },
    {
      step: 2,
      title: 'STEP 2: OCR & Multi-Stage Processing Pipeline',
      tab: 'documents',
      icon: <Cpu className="w-5 h-5 text-blue-400" />,
      description: 'Documents undergo page rendering, OCR confidence scoring, table boundary extraction, chunking, and metadata parsing. Inspect confidence ratings for scanned vs digital documents.',
      actionText: 'View Processing Status',
      execute: () => {
        setActiveTab('documents');
        onClose();
      }
    },
    {
      step: 3,
      title: 'STEP 3: Split-Screen Document & Evidence Viewer',
      tab: 'viewer',
      icon: <Table className="w-5 h-5 text-purple-400" />,
      description: 'Examine original scanned reports with OCR bounding boxes alongside parsed tables, chunks, and extracted entities (e.g. Gevra Mega OC or Moonidih Colliery).',
      actionText: 'Open Split-Screen Viewer',
      execute: () => {
        setActiveTab('viewer');
        onClose();
      }
    },
    {
      step: 4,
      title: 'STEP 4: Data Validation & Conflict Resolution',
      tab: 'validation',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      description: 'Crucial SIH requirement: Detects conflicting values and unit discrepancies. Review the flagged conflict on Gevra 2023 (52.5 MT field estimate vs 50.80 MT audited balance) and approve or edit.',
      actionText: 'Open Validation Workbench',
      execute: () => {
        setActiveTab('validation');
        onClose();
      }
    },
    {
      step: 5,
      title: 'STEP 5: AI Natural Language Query (SQL + RAG)',
      tab: 'assistant',
      icon: <MessageSquare className="w-5 h-5 text-amber-400" />,
      description: 'The AI never hallucinates numbers. Test preloaded questions such as "What was the production of Mine A in 2022?" or "Compare Mine A and Mine B from 2020 to 2024".',
      actionText: 'Test Natural Query',
      execute: () => {
        setActiveTab('assistant');
        if (onSelectSampleQuestion) {
          onSelectSampleQuestion('Compare Mine A and Mine B from 2020 to 2024.');
        }
        onClose();
      }
    },
    {
      step: 6,
      title: 'STEP 6: Answer, Query Trace & Clickable Evidence Citations',
      tab: 'assistant',
      icon: <Search className="w-5 h-5 text-cyan-400" />,
      description: 'Observe query routing (STRUCTURED SQL vs UNSTRUCTURED RAG), execution trace steps, and exact source citations with document name, page number, and confidence.',
      actionText: 'Inspect Evidence Trace',
      execute: () => {
        setActiveTab('assistant');
        onClose();
      }
    },
    {
      step: 7,
      title: 'STEP 7: Historical Analytics, Topics & Word Cloud',
      tab: 'analytics',
      icon: <BarChart3 className="w-5 h-5 text-indigo-400" />,
      description: 'Interactive analytics showing multi-year production curves (2020-2024), stripping ratio comparisons, topic frequency trends, and mining word clouds with stopword filtering.',
      actionText: 'Explore Historical Analytics',
      execute: () => {
        setActiveTab('analytics');
        onClose();
      }
    },
    {
      step: 8,
      title: 'STEP 8: Automated 13-Section Report Generation',
      tab: 'reports',
      icon: <FileText className="w-5 h-5 text-rose-400" />,
      description: 'Generate standardized statutory dossiers with 13 mandatory sections: Executive Summary, Scope, Data Sources, Production, Mining, Geology, Trends, Findings, Anomalies, Recommendations, References.',
      actionText: 'Generate Official Report',
      execute: () => {
        setActiveTab('reports');
        onClose();
      }
    },
    {
      step: 9,
      title: 'STEP 9: Real Export (PDF, Excel XLSX, Word DOCX)',
      tab: 'reports',
      icon: <Download className="w-5 h-5 text-emerald-400" />,
      description: 'Export finalized reports with 1 click to PDF, multi-sheet formatted Excel spreadsheets, or Microsoft Word documents for parliamentary briefings.',
      actionText: 'Open Report Exporter',
      execute: () => {
        setActiveTab('reports');
        onClose();
      }
    }
  ];

  const current = steps[currentStep - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden text-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-950/60 rounded-lg">
              {current.icon}
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-200">
                SIH 2026 Evaluation Tour (Problem SIH26023)
              </div>
              <h3 className="text-base font-bold">{current.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step progress bar */}
        <div className="grid grid-cols-9 gap-1 p-2 bg-slate-950 border-b border-slate-800">
          {steps.map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`h-2 rounded-full transition-all ${
                s.step === currentStep 
                  ? 'bg-amber-400 shadow-sm shadow-amber-400/50' 
                  : s.step < currentStep 
                  ? 'bg-emerald-500' 
                  : 'bg-slate-800'
              }`}
              title={`Step ${s.step}: ${s.title}`}
            />
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
              Stage {currentStep} of 9
            </span>
            <span className="text-xs text-slate-400">
              Target Module: <span className="font-semibold text-slate-200 uppercase">{current.tab}</span>
            </span>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800 text-sm leading-relaxed text-slate-300">
            {current.description}
          </div>

          {/* Demonstration Notice */}
          <div className="text-[11px] text-amber-300/80 bg-amber-950/30 border border-amber-800/40 p-2.5 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              All operational numbers are validated against the synthetic demonstration dataset (DEMONSTRATION DATA — NOT OFFICIAL CMPDI/CIL DATA).
            </span>
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              disabled={currentStep === steps.length}
              onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium flex items-center gap-1 transition"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={current.execute}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition"
            >
              <span>{current.actionText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
