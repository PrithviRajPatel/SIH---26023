import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Files, 
  FileUp,
  FileSearch, 
  ShieldCheck, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Layers,
  Cloud, 
  Search, 
  GitCompare,
  Landmark,
  History, 
  Settings,
  AlertCircle
} from 'lucide-react';

import { 
  User, 
  UserRole, 
  MiningDocument, 
  AuditLogEntry, 
  PerformanceMetrics, 
  GeneratedReport, 
  ExtractedEntity,
  ParliamentaryInquiry
} from './types';
import { api } from './services/api';
import { Header } from './components/Header';
import { DemoGuideModal } from './components/DemoGuideModal';
import { DashboardTab } from './components/DashboardTab';
import { DocumentsTab } from './components/DocumentsTab';
import { UploadDocumentsTab } from './components/UploadDocumentsTab';
import { DocumentViewerTab } from './components/DocumentViewerTab';
import { ValidationWorkbenchTab } from './components/ValidationWorkbenchTab';
import { AiAssistantTab } from './components/AiAssistantTab';
import { InquiriesTab } from './components/InquiriesTab';
import { ReportGeneratorTab } from './components/ReportGeneratorTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { TopicsTab } from './components/TopicsTab';
import { WordCloudTab } from './components/WordCloudTab';
import { SearchTab } from './components/SearchTab';
import { DocumentComparisonTab } from './components/DocumentComparisonTab';
import { AuditLogsTab } from './components/AuditLogsTab';
import { SettingsTab } from './components/SettingsTab';

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
  const [inquiries, setInquiries] = useState<ParliamentaryInquiry[]>([]);
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
      const [docsRes, inqRes, logsRes, metricsRes, reportsRes, topicsRes, wcRes, valRes, analyticsRes] = await Promise.all([
        api.getDocuments(),
        api.getInquiries(),
        api.getAuditLogs(),
        api.getMetrics(),
        api.getReports(),
        api.getTopics(),
        api.getWordCloud(),
        api.getValidationEntities(),
        api.getProductionAnalytics()
      ]);

      if (docsRes.documents) setDocuments(docsRes.documents);
      if (inqRes.inquiries) setInquiries(inqRes.inquiries);
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
        showToast(`Active profile switched to ${res.user.role}: ${res.user.name}`);
        const logsRes = await api.getAuditLogs();
        if (logsRes.logs) setAuditLogs(logsRes.logs);
      }
    } catch (err) {
      console.error('Failed to switch user:', err);
    }
  };

  const handleClearWorkspace = async () => {
    await api.clearWorkspace();
    await loadAllData();
    showToast('Repository workspace cleared to empty state (0 documents).');
    setActiveTab('dashboard');
  };

  const handleLoadBenchmark = async () => {
    await api.loadBenchmarkWorkspace();
    await loadAllData();
    showToast('CMPDI & Coal India Limited reference benchmark dataset loaded.');
    setActiveTab('dashboard');
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
      return res.document;
    }
    return null;
  };

  const handleDeleteDocument = async (docId: string) => {
    await api.deleteDocument(docId, currentUser.name);
    await loadAllData();
    showToast('Document removed from repository.');
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
      showToast(`Entity "${res.entity.entityKey}" marked as ${action}. Audit trail recorded.`);
    }
  };

  const handleGenerateReport = async (payload: any) => {
    const res = await api.generateReport({
      ...payload,
      generatedBy: `${currentUser.name} (${currentUser.role})`
    });
    if (res.report) {
      await loadAllData();
      showToast(`Generated "${res.report.title}" with 13 statutory technical sections.`);
      return res.report;
    }
    throw new Error('Failed to generate report');
  };

  const handleCreateInquiry = async (data: Partial<ParliamentaryInquiry>) => {
    const res = await api.createInquiry(data);
    if (res.inquiry) {
      await loadAllData();
      showToast(`Parliamentary Inquiry Ref ${res.inquiry.referenceNumber} registered.`);
    }
  };

  const handleUpdateInquiry = async (id: string, updates: Partial<ParliamentaryInquiry>) => {
    const res = await api.updateInquiry(id, updates);
    if (res.inquiry) {
      await loadAllData();
      showToast(`Inquiry ${res.inquiry.referenceNumber} status updated to ${res.inquiry.status}.`);
    }
  };

  const handleGenerateInquiryDraft = async (id: string) => {
    const res = await api.generateInquiryDraft(id);
    if (res.inquiry) {
      await loadAllData();
      showToast('AI draft statement synthesized from verified primary source evidence.');
      return res.inquiry;
    }
    throw new Error('Draft synthesis failed');
  };

  const handleExecuteQuery = async (query: string, options?: any) => {
    const resp = await api.queryUnified(query, options);
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
        onResetSeed={handleLoadBenchmark}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Tab Navigation Strip */}
      <div className="bg-slate-900/95 border-b border-slate-800 sticky top-[73px] z-40 backdrop-blur-md">
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
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'upload' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Upload Documents</span>
          </button>

          {documents.length > 0 && (
            <button
              onClick={() => setActiveTab('viewer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeTab === 'viewer' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>Document Viewer</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('validation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition relative ${
              activeTab === 'validation' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Validation</span>
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
            <span>AI Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'inquiries' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Inquiries ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'reports' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'analytics' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('topics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'topics' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Topics</span>
          </button>

          <button
            onClick={() => setActiveTab('wordcloud')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'wordcloud' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Word Cloud</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'search' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'comparison' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Document Comparison</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'audit' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === 'settings' ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
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
            <p className="text-sm font-bold text-slate-300">Initializing Knowledge Repository...</p>
            <p className="text-xs text-slate-500 mt-1">Connecting Vector Indices & Relational Structured Store</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && metrics && (
              <DashboardTab
                metrics={metrics}
                documents={documents}
                auditLogs={auditLogs}
                productionRecords={productionRecords}
                setActiveTab={setActiveTab}
                onOpenViewer={handleOpenViewer}
                onLoadBenchmark={handleLoadBenchmark}
              />
            )}

            {activeTab === 'documents' && (
              <DocumentsTab
                documents={documents}
                onOpenViewer={handleOpenViewer}
                onUploadDocument={handleUploadDocument}
                onReprocessDocument={handleReprocessDocument}
                onDeleteDocument={handleDeleteDocument}
                onGoToUpload={() => setActiveTab('upload')}
              />
            )}

            {activeTab === 'upload' && (
              <UploadDocumentsTab
                onUploadDocument={handleUploadDocument}
                onOpenViewer={handleOpenViewer}
                onNavigateToDocuments={() => setActiveTab('documents')}
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
                documents={documents}
              />
            )}

            {activeTab === 'inquiries' && (
              <InquiriesTab
                inquiries={inquiries}
                documents={documents}
                onOpenViewer={handleOpenViewer}
                onCreateInquiry={handleCreateInquiry}
                onUpdateInquiry={handleUpdateInquiry}
                onGenerateDraft={handleGenerateInquiryDraft}
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
              <TopicsTab
                topics={topics}
                onOpenViewer={handleOpenViewer}
              />
            )}

            {activeTab === 'wordcloud' && (
              <WordCloudTab
                wordCloud={wordCloud}
                documents={documents}
                onOpenViewer={handleOpenViewer}
              />
            )}

            {activeTab === 'search' && (
              <SearchTab
                documents={documents}
                onOpenViewer={handleOpenViewer}
              />
            )}

            {activeTab === 'comparison' && (
              <DocumentComparisonTab
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

            {activeTab === 'settings' && (
              <SettingsTab
                currentUser={currentUser}
                onSwitchUser={handleSwitchUser}
                onClearWorkspace={handleClearWorkspace}
                onLoadBenchmark={handleLoadBenchmark}
              />
            )}
          </>
        )}
      </main>

      {/* Architecture & Operations Walkthrough Modal */}
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
            GeoMine Intel Enterprise • Central Mine Planning & Design Institute (CMPDI) • Coal India Limited
          </div>
          <div className="text-[11px] text-amber-500/80">
            Ministry of Coal Digital Transformation Initiative • High-Fidelity Factual Extraction & Verification
          </div>
        </div>
      </footer>
    </div>
  );
}
