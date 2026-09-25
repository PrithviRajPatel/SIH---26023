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
  ExternalLink,
  GitCompare,
  Landmark,
  Cloud,
  HelpCircle
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
      title: 'MODULE 1: Enterprise Document Ingestion',
      tab: 'upload',
      icon: <FileUp className="w-5 h-5 text-amber-400" />,
      description: 'Upload heterogeneous files including digital PDFs, scanned pithead logs, geological assessments, and XLSX spreadsheets with drag-and-drop batch queuing.',
      actionText: 'Go to Upload Documents',
      execute: () => {
        setActiveTab('upload');
        onClose();
      }
    },
    {
      step: 2,
      title: 'MODULE 2: Split-Screen Document & Evidence Viewer',
      tab: 'viewer',
      icon: <Table className="w-5 h-5 text-purple-400" />,
      description: 'Inspect original documents side-by-side with OCR bounding boxes, extracted tables, and named entities with full primary source traceability.',
      actionText: 'Open Split-Screen Viewer',
      execute: () => {
        setActiveTab('viewer');
        onClose();
      }
    },
    {
      step: 3,
      title: 'MODULE 3: Analyst Validation Workbench & Conflict Resolution',
      tab: 'validation',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      description: 'Human-in-the-loop review workbench. Flags numerical discrepancies (e.g. operational estimates vs audited accounts) and unit mismatches for resolution.',
      actionText: 'Open Validation Workbench',
      execute: () => {
        setActiveTab('validation');
        onClose();
      }
    },
    {
      step: 4,
      title: 'MODULE 4: AI Query Router (Relational SQL + Semantic RAG)',
      tab: 'assistant',
      icon: <MessageSquare className="w-5 h-5 text-amber-400" />,
      description: 'Natural language query system with strict numerical hallucination guard. Routes structured queries to SQL and technical questions to semantic vector retrieval.',
      actionText: 'Open AI Assistant',
      execute: () => {
        setActiveTab('assistant');
        if (onSelectSampleQuestion) {
          onSelectSampleQuestion('Compare SECL Gevra and NCL Jayant production and stripping ratio from 2020 to 2024.');
        }
        onClose();
      }
    },
    {
      step: 5,
      title: 'MODULE 5: Automated Statutory Report Generator',
      tab: 'reports',
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      description: 'Generates comprehensive 13-section technical dossiers with executive summaries, production tables, geological reserve analyses, and PDF/Excel/Word export.',
      actionText: 'Open Report Generator',
      execute: () => {
        setActiveTab('reports');
        onClose();
      }
    },
    {
      step: 6,
      title: 'MODULE 6: Side-by-Side Document Comparison',
      tab: 'comparison',
      icon: <GitCompare className="w-5 h-5 text-cyan-400" />,
      description: 'Compare any two mining reports or geological assessments side-by-side to compute production deltas, stripping ratio variances, and entity differentials.',
      actionText: 'Open Document Comparison',
      execute: () => {
        setActiveTab('comparison');
        onClose();
      }
    },
    {
      step: 7,
      title: 'MODULE 7: Parliamentary & Administrative Inquiries',
      tab: 'inquiries',
      icon: <Landmark className="w-5 h-5 text-rose-400" />,
      description: 'Manage parliamentary questions from Lok Sabha, Rajya Sabha, and Ministry of Coal with evidence-backed automated draft responses and official export.',
      actionText: 'Open Inquiries Module',
      execute: () => {
        setActiveTab('inquiries');
        onClose();
      }
    },
    {
      step: 8,
      title: 'MODULE 8: Dynamic Vocabulary Cloud & Topic Modeling',
      tab: 'wordcloud',
      icon: <Cloud className="w-5 h-5 text-emerald-400" />,
      description: 'Dynamic word cloud and semantic topic clustering automatically extracted from repository documents with stopword elimination and category filtering.',
      actionText: 'View Vocabulary Cloud',
      execute: () => {
        setActiveTab('wordcloud');
        onClose();
      }
    }
  ];

  const active = steps[currentStep - 1];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">System Architecture & Operations Guide</h3>
              <p className="text-xs text-slate-400">Platform functional modules and intelligence capabilities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-between gap-1">
          {steps.map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                s.step === currentStep 
                  ? 'bg-amber-500 ring-2 ring-amber-500/30' 
                  : s.step < currentStep 
                  ? 'bg-emerald-500' 
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Module ${s.step}: ${s.title}`}
            />
          ))}
        </div>

        {/* Active Step Content */}
        <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-400 uppercase tracking-wider">
              System Capability {currentStep} of {steps.length}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Target Module: {active.tab.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
              {active.icon}
            </div>
            <h4 className="text-base font-bold text-white">
              {active.title}
            </h4>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-1">
            {active.description}
          </p>
        </div>

        {/* Modal Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold disabled:opacity-40 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={active.execute}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow"
          >
            <span>{active.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
            disabled={currentStep === steps.length}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold disabled:opacity-40 transition"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
