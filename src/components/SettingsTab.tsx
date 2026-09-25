import React, { useState } from 'react';
import { 
  Settings, 
  Cpu, 
  Database, 
  Trash2, 
  Download, 
  Upload, 
  RefreshCcw, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Building2, 
  Sliders, 
  Key,
  Users
} from 'lucide-react';
import { SystemSettings, UserRole, User } from '../types';
import { api } from '../services/api';

interface SettingsTabProps {
  currentUser: User;
  onSwitchUser: (role: UserRole) => void;
  onClearWorkspace: () => Promise<void>;
  onLoadBenchmark: () => Promise<void>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  currentUser,
  onSwitchUser,
  onClearWorkspace,
  onLoadBenchmark
}) => {
  const [model, setModel] = useState('gemini-2.5-flash');
  const [ocrMode, setOcrMode] = useState<'HYBRID_VISION_TESSERACT' | 'TESSERACT_STRICT' | 'CLOUD_VISION'>('HYBRID_VISION_TESSERACT');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.95);
  const [enforceTraceability, setEnforceTraceability] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isLoadingBenchmark, setIsLoadingBenchmark] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await api.updateSettings({
        geminiModel: model,
        ocrEngineMode: ocrMode,
        autoApproveConfidenceThreshold: confidenceThreshold,
        enforceSourceTraceability: enforceTraceability
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear all repository data? This will reset documents, production figures, and inquiries to an empty state.')) {
      setIsClearing(true);
      try {
        await onClearWorkspace();
      } finally {
        setIsClearing(false);
      }
    }
  };

  const handleLoadBench = async () => {
    setIsLoadingBenchmark(true);
    try {
      await onLoadBenchmark();
    } finally {
      setIsLoadingBenchmark(false);
    }
  };

  const handleExportBackup = async () => {
    const data = await api.exportBackup();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GeoMine_Enterprise_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Enterprise Platform Configuration</h2>
          </div>
          <p className="text-xs text-slate-400">
            Manage AI document extraction pipelines, optical character recognition engines, role-based access control, and workspace data states.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            <CheckCircle className="w-4 h-4" />
            <span>Settings Updated</span>
          </div>
        )}
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: AI & OCR Pipeline Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-bold text-white">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>AI Reasoning & OCR Configuration</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-semibold">Generative Model Selection</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Low-Latency Document QA & NER)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Geotechnical Synthesis & Reasoning)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-semibold">OCR & Layout Engine</label>
              <select
                value={ocrMode}
                onChange={(e: any) => setOcrMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
              >
                <option value="HYBRID_VISION_TESSERACT">Hybrid Vision OCR + Table Structure Parser</option>
                <option value="CLOUD_VISION">High-Resolution Cloud Vision Pipeline</option>
                <option value="TESSERACT_STRICT">Strict On-Premise DGMS-Compliant OCR</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">Auto-Approval Confidence Threshold</label>
                <span className="font-mono text-amber-400 font-bold">{Math.round(confidenceThreshold * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.70"
                max="0.99"
                step="0.01"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Extracted entities with confidence below this threshold are routed to Analyst Validation Workbench for human-in-the-loop review.
              </p>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enforceTraceability}
                  onChange={(e) => setEnforceTraceability(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-0"
                />
                <span className="text-slate-300 font-medium">Enforce Strict Primary Source Traceability (Hallucination Guard)</span>
              </label>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="mt-2 w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition text-xs shadow-sm"
            >
              {isSaving ? 'Saving Configurations...' : 'Save AI & Pipeline Settings'}
            </button>
          </div>
        </div>

        {/* Section 2: Enterprise Data Management (Clean Slate & Benchmark) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-bold text-white">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Workspace Data Management</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Control the data state of the repository. You can start with a clean production slate or load the verified CMPDI/CIL reference dataset.
          </p>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-white">Start Empty (Clear Workspace)</div>
                <div className="text-[11px] text-slate-400">Purges all documents, entities, and figures to 0 for real file uploads.</div>
              </div>
              <button
                onClick={handleClear}
                disabled={isClearing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30 transition shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isClearing ? 'Clearing...' : 'Clear All Data'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-white">Load Enterprise Reference Dataset</div>
                <div className="text-[11px] text-slate-400">Loads verified CMPDI/CIL benchmark reports (10 dossiers, 7 subsidiaries).</div>
              </div>
              <button
                onClick={handleLoadBench}
                disabled={isLoadingBenchmark}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shrink-0"
              >
                <RefreshCcw className={`w-3.5 h-3.5 ${isLoadingBenchmark ? 'animate-spin' : ''}`} />
                <span>{isLoadingBenchmark ? 'Loading...' : 'Load Dataset'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-white">Full System JSON Backup</div>
                <div className="text-[11px] text-slate-400">Export database documents, entities, inquiries, and audit logs.</div>
              </div>
              <button
                onClick={handleExportBackup}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export Backup</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: User Profiles & Role-Based Access Control */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-bold text-white">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Role-Based Access Control (RBAC) & Active User Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div 
              onClick={() => onSwitchUser('ADMIN')}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                currentUser.role === 'ADMIN'
                  ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/30'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-white">Dr. Rajeshwar Sharma</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">ADMIN</span>
              </div>
              <div className="text-[11px] text-slate-400 mb-2">General Manager (Geomatics & IT), CMPDI HQ Ranchi</div>
              <p className="text-[10px] text-slate-500">
                Full authority: Document ingestion, schema definitions, audit log inspection, workspace data purging, and system configuration.
              </p>
            </div>

            <div 
              onClick={() => onSwitchUser('ANALYST')}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                currentUser.role === 'ANALYST'
                  ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/30'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-white">Ananya Sen</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white">ANALYST</span>
              </div>
              <div className="text-[11px] text-slate-400 mb-2">Senior Mining Analyst, Operations Directorate, CIL Kolkata</div>
              <p className="text-[10px] text-slate-500">
                Operations authority: Validation Workbench, conflict resolution, statutory report generation, and natural language querying.
              </p>
            </div>

            <div 
              onClick={() => onSwitchUser('VIEWER')}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                currentUser.role === 'VIEWER'
                  ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/30'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-white">Vikramaditya Roy</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-200">VIEWER</span>
              </div>
              <div className="text-[11px] text-slate-400 mb-2">Under Secretary (Parliamentary & Statistics), Ministry of Coal</div>
              <p className="text-[10px] text-slate-500">
                Read & inquiry authority: Parliamentary question tracking, official reply drafting, dashboard metrics review, and citation auditing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
