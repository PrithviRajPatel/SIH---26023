import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Files, 
  FileSearch, 
  ShieldCheck, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Cloud, 
  Search, 
  History, 
  Award,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

import { 
  User, 
  UserRole, 
  MiningDocument, 
  AuditLogEntry, 
  PerformanceMetrics, 
  GeneratedReport, 
  ExtractedEntity 
} from './types';
import { api } from './services/api';
import { Header } from './components/Header';
import { DemoGuideModal } from './components/DemoGuideModal';
import { DashboardTab } from './components/DashboardTab';
import { DocumentsTab } from './components/DocumentsTab';
import { DocumentViewerTab } from './components/DocumentViewerTab';
import { ValidationWorkbenchTab } from './components/ValidationWorkbenchTab';
import { AiAssistantTab } from './components/AiAssistantTab';
import { ReportGeneratorTab } from './components/ReportGeneratorTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { TopicsWordCloudTab } from './components/TopicsWordCloudTab';
import { SearchTab } from './components/SearchTab';
import { AuditLogsTab } from './components/AuditLogsTab';
import { MetricsTab } from './components/MetricsTab';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr_analyst_01',
    name: 'Ananya Sen',
    email: 'ananya.sen@coalindia.in',
    role: 'ANALYST',
    designation: 'Senior Mining Analyst (Production Planning)',
    department: 'Operations Directorate',
    subsidiary: 'Coal India Ltd Kolkata'
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);
  const [selectedViewerDocId, setSelectedViewerDocId] = useState<string>('');
  const [selectedSampleQuestion, setSelectedSampleQuestion] = useState<string>('');

  // Loaded State
  const [documents, setDocuments] = useState<MiningDocument[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [wordCloud, setWordCloud] = useState<any[]>([]);
  const [pendingEntities, setPendingEntities] = useState<ExtractedEntity[]>([]);
  const [allEntities, setAllEntities] = useState<ExtractedEntity[]>([]);
  const [productionRecords, setProductionRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadAllData = async () => {
    try {
      const [docsRes, logsRes, metricsRes, reportsRes, topicsRes, wcRes, valRes, analyticsRes] = await Promise.all([
        api.getDocuments(),
        api.getAuditLogs(),
        api.getMetrics(),
        api.getReports(),
        api.getTopics(),
        api.getWordCloud(),
        api.getValidationEntities(),
        api.getProductionAnalytics()
      ]);

      if (docsRes.documents) setDocuments(docsRes.documents);
      if (logsRes.logs) setAuditLogs(logsRes.logs);
      if (metricsRes.metrics) setMetrics(metricsRes.metrics);
      if (reportsRes.reports) setReports(reportsRes.reports);
      if (topicsRes.topics) setTopics(topicsRes.topics);
      if (wcRes.items) setWordCloud(wcRes.items);
      if (valRes) {
        setPendingEntities(valRes.pendingEntities || []);
        setAllEntities(valRes.allEntities || []);
      }
      if (analyticsRes.productionRecords) setProductionRecords(analyticsRes.productionRecords);
      if (docsRes.documents && docsRes.documents.length > 0 && !selectedViewerDocId) {
        setSelectedViewerDocId(docsRes.documents[0].id);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSwitchUser = async (role: UserRole) => {
    try {
      const res = await api.login(role);
      if (res.user) {
        setCurrentUser(res.user);
        showToast(`Switched active profile to ${res.user.role}: ${res.user.name}`);
        const logsRes = await api.getAuditLogs();
        if (logsRes.logs) setAuditLogs(logsRes.logs);
      }
    } catch (err) {
      console.error('Failed to switch user:', err);
    }
  };

  const handleResetSeed = async () => {
    try {
      setIsLoading(true);
      await api.resetSeed();
      await loadAllData();
      showToast('Database reset to fresh CMPDI / CIL demonstration state.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenViewer = (docId: string) => {
    setSelectedViewerDocId(docId);
    setActiveTab('viewer');
  };

  const handleUploadDocument = async (data: any) => {
    const res = await api.uploadDocument(data);
    if (res.document) {
      await loadAllData();
      showToast(`Document "${res.document.title}" ingested & OCR-parsed successfully.`);
      setSelectedViewerDocId(res.document.id);
      setActiveTab('viewer');
    }
  };

  const handleReprocessDocument = async (docId: string) => {
    await api.reprocessDocument(docId);
    await loadAllData();
    showToast('Document re-processed with updated parser & table extraction.');
  };

  const handleActionEntity = async (
    id: string, 
    action: 'APPROVED' | 'REJECTED' | 'EDITED', 
    updatedValue?: any, 
    comment?: string
  ) => {
    const res = await api.actionValidationEntity(id, action, updatedValue, comment);
    if (res.entity) {
      await loadAllData();
      showToast(`Entity "${res.entity.entityKey}" marked as ${action}. Audit log recorded.`);
    }
  };

  const handleGenerateReport = async (payload: any) => {
    const res = await api.generateReport({
      ...payload,
      generatedBy: `${currentUser.name} (${currentUser.role})`
    });
    if (res.report) {
      await loadAllData();
      showToast(`Generated "${res.report.title}" with 13 statutory sections.`);
      return res.report;
    }
    throw new Error('Failed to generate report');
  };

  const handleExecuteQuery = async (query: string) => {
    const resp = await api.queryUnified(query);
    const logsRes = await api.getAuditLogs();
    if (logsRes.logs) setAuditLogs(logsRes.logs);
    return resp;
  };

  const pendingCount = pendingEntities.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Global Top Header */}
      <Header
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
        onResetSeed={handleResetSeed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Tab Navigation Strip */}
      <div className="bg-slate-900/90 border-b border-slate-800 sticky top-[73px] z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto scrollbar-none py-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'dashboard' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'documents' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Files className="w-3.5 h-3.5" />
            <span>Documents ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('viewer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'viewer' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Document Viewer</span>
          </button>

          <button
            onClick={() => setActiveTab('validation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition relative ${
              activeTab === 'validation' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Validation Workbench</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'assistant' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Assistant (SQL+RAG)</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'reports' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Report Generator</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'analytics' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Historical Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('topics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'topics' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Topics & Word Cloud</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'search' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Global Search</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'audit' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>

          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'metrics' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>ROI Metrics</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-lg font-bold text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {isLoading && !metrics ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-bold text-slate-300">Loading CMPDI / CIL Intelligence Corpus...</p>
            <p className="text-xs text-slate-500 mt-1">Initializing Relational Database & Vector Indices</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && metrics && (
              <DashboardTab
                metrics={metrics}
                documents={documents}
                auditLogs={auditLogs}
                setActiveTab={setActiveTab}
                onOpenViewer={handleOpenViewer}
              />
            )}

            {activeTab === 'documents' && (
              <DocumentsTab
                documents={documents}
                onOpenViewer={handleOpenViewer}
                onUploadDocument={handleUploadDocument}
                onReprocessDocument={handleReprocessDocument}
              />
            )}

            {activeTab === 'viewer' && (
              <DocumentViewerTab
                documents={documents}
                selectedDocId={selectedViewerDocId}
                onSelectDocument={(id) => setSelectedViewerDocId(id)}
              />
            )}

            {activeTab === 'validation' && (
              <ValidationWorkbenchTab
                pendingEntities={pendingEntities}
                allEntities={allEntities}
                onActionEntity={handleActionEntity}
                onOpenViewer={handleOpenViewer}
              />
            )}

            {activeTab === 'assistant' && (
              <AiAssistantTab
                onExecuteQuery={handleExecuteQuery}
                onOpenViewer={handleOpenViewer}
                initialQuestion={selectedSampleQuestion}
              />
            )}

            {activeTab === 'reports' && (
              <ReportGeneratorTab
                reports={reports}
                onGenerateReport={handleGenerateReport}
                onOpenViewer={handleOpenViewer}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsTab
                productionRecords={productionRecords}
              />
            )}

            {activeTab === 'topics' && (
              <TopicsWordCloudTab
                topics={topics}
                wordCloud={wordCloud}
                onOpenViewer={handleOpenViewer}
              />
            )}

            {activeTab === 'search' && (
              <SearchTab
                documents={documents}
                onOpenViewer={handleOpenViewer}
              />
            )}

            {activeTab === 'audit' && (
              <AuditLogsTab
                logs={auditLogs}
                currentUserRole={currentUser.role}
              />
            )}

            {activeTab === 'metrics' && metrics && (
              <MetricsTab
                metrics={metrics}
              />
            )}
          </>
        )}
      </main>

      {/* SIH Hackathon Evaluation Walkthrough Modal */}
      <DemoGuideModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        setActiveTab={setActiveTab}
        onSelectSampleQuestion={(q) => setSelectedSampleQuestion(q)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 text-xs py-4 px-4 text-center mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            GeoMine Intel • Smart India Hackathon 2026 (SIH26023) • CMPDI / Coal India Limited
          </div>
          <div className="text-[11px] text-amber-500/80">
            DEMONSTRATION DATA — NOT OFFICIAL CMPDI/CIL DATA • Strict Factual Accuracy Enforced
          </div>
        </div>
      </footer>
    </div>
  );
}
