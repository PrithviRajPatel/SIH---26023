import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  X, 
  Edit3, 
  Filter, 
  FileText, 
  Scale, 
  Clock, 
  Info,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { ExtractedEntity } from '../types';

interface ValidationWorkbenchTabProps {
  pendingEntities: ExtractedEntity[];
  allEntities: ExtractedEntity[];
  onActionEntity: (id: string, action: 'APPROVED' | 'REJECTED' | 'EDITED', updatedValue?: any, comment?: string) => Promise<void>;
  onOpenViewer: (docId: string) => void;
}

export const ValidationWorkbenchTab: React.FC<ValidationWorkbenchTabProps> = ({
  pendingEntities,
  allEntities,
  onActionEntity,
  onOpenViewer
}) => {
  const [filterMode, setFilterMode] = useState<'pending' | 'conflicts' | 'all'>('pending');
  const [selectedEntity, setSelectedEntity] = useState<ExtractedEntity | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [analystComment, setAnalystComment] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const displayedEntities = allEntities.filter(e => {
    if (filterMode === 'pending') {
      return e.validationStatus === 'PENDING' || e.validationStatus === 'CONFLICT_REQUIRES_REVIEW';
    }
    if (filterMode === 'conflicts') {
      return e.validationStatus === 'CONFLICT_REQUIRES_REVIEW';
    }
    return true;
  });

  const handleOpenEdit = (ent: ExtractedEntity) => {
    setSelectedEntity(ent);
    setEditValue(String(ent.entityValue));
    setAnalystComment(ent.analystComment || '');
  };

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    try {
      await onActionEntity(id, 'APPROVED', undefined, 'Analyst verified against primary statutory schedule.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    setIsProcessing(true);
    try {
      await onActionEntity(id, 'REJECTED', undefined, 'Rejected due to duplicate entry or unverified draft figure.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedEntity) return;
    setIsProcessing(true);
    try {
      const numVal = parseFloat(editValue);
      const valToSave = isNaN(numVal) ? editValue : numVal;
      await onActionEntity(selectedEntity.id, 'EDITED', valToSave, analystComment);
      setSelectedEntity(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Data Validation & Reconciliation Workbench
          </h2>
          <p className="text-xs text-slate-400">
            Human-in-the-loop analyst review for conflict resolution, unit normalization, and statutory audit integrity.
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-3 py-1.5 rounded font-semibold transition ${
              filterMode === 'pending' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Review Queue ({pendingEntities.length})
          </button>
          <button
            onClick={() => setFilterMode('conflicts')}
            className={`px-3 py-1.5 rounded font-semibold transition ${
              filterMode === 'conflicts' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Conflicts Only
          </button>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded font-semibold transition ${
              filterMode === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Fields ({allEntities.length})
          </button>
        </div>
      </div>

      {/* Explanatory Unit Normalization & Conflict Banner */}
      <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <Scale className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-300">
              Automated Multi-Scale Unit Normalization & Conflict Engine Active
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              System normalizes distinct notation (e.g. <strong>5.2 MT = 5,200,000 Tonnes = 52.0 Lakh Tonnes</strong>). If two official documents declare contradictory values (e.g. Gevra field draft 52.5 MT vs audited statement 50.80 MT), the value is flagged as <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">CONFLICT_REQUIRES_REVIEW</code> rather than silently overwritten.
            </p>
          </div>
        </div>
      </div>

      {/* Entities Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Entity & Key</th>
                <th className="py-3 px-3">Extracted Value</th>
                <th className="py-3 px-3">Unit Normalization</th>
                <th className="py-3 px-4">Source Excerpt & Citation</th>
                <th className="py-3 px-3">Extraction Method</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Analyst Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {displayedEntities.map((ent) => {
                const isConflict = ent.validationStatus === 'CONFLICT_REQUIRES_REVIEW';
                const isPending = ent.validationStatus === 'PENDING';

                return (
                  <tr key={ent.id} className={`hover:bg-slate-850/60 transition ${isConflict ? 'bg-amber-950/20' : ''}`}>
                    {/* Entity Key */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-100 flex items-center gap-1.5">
                        {isConflict && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        <span>{ent.entityKey}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Type: <span className="font-mono text-slate-300">{ent.entityType}</span> • Page {ent.pageNumber}
                      </div>
                    </td>

                    {/* Extracted Value */}
                    <td className="py-3 px-3">
                      <div className="text-sm font-extrabold text-amber-400">
                        {ent.entityValue} <span className="text-xs font-normal text-slate-400">{ent.unit || ''}</span>
                      </div>
                      <div className="text-[10px] text-emerald-400">
                        Confidence: {(ent.confidence * 100).toFixed(0)}%
                      </div>
                    </td>

                    {/* Unit Normalization */}
                    <td className="py-3 px-3 text-[11px] font-mono text-slate-300">
                      {typeof ent.normalizedValue === 'number' ? (
                        <div>
                          <div>{ent.normalizedValue} {ent.normalizedUnit || 'MT'}</div>
                          <div className="text-[10px] text-slate-500">
                            ≈ {(ent.normalizedValue * 1000000).toLocaleString()} Tonnes
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500">Categorical Text</span>
                      )}
                    </td>

                    {/* Source Excerpt */}
                    <td className="py-3 px-4 max-w-xs text-[11px] text-slate-400">
                      <div className="italic line-clamp-2">"{ent.sourceText}"</div>
                      <button
                        onClick={() => onOpenViewer(ent.documentId)}
                        className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 mt-1 font-sans font-semibold"
                      >
                        Inspect Document Page {ent.pageNumber} <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    </td>

                    {/* Method */}
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800">
                        {ent.extractionMethod}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ent.validationStatus === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        ent.validationStatus === 'CONFLICT_REQUIRES_REVIEW' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' :
                        ent.validationStatus === 'EDITED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {ent.validationStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          disabled={isProcessing}
                          onClick={() => handleApprove(ent.id)}
                          className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition disabled:opacity-40"
                          title="Approve Extracted Value"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={isProcessing}
                          onClick={() => handleOpenEdit(ent)}
                          className="p-1.5 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition disabled:opacity-40"
                          title="Edit or Reconcile Variance"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={isProcessing}
                          onClick={() => handleReject(ent.id)}
                          className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition disabled:opacity-40"
                          title="Reject Extracted Value"
                        >
                          <X className="w-3.5 h-3.5" />
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

      {/* Edit / Reconciliation Modal */}
      {selectedEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-lg w-full text-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Reconcile / Correct Extracted Value</h3>
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="text-slate-400">
                Entity: <strong className="text-white">{selectedEntity.entityKey}</strong> ({selectedEntity.entityType})
              </div>
              <div className="text-slate-400">
                Original Text Excerpt: <span className="italic text-slate-200 font-mono">"{selectedEntity.sourceText}"</span>
              </div>
              <div className="text-slate-400">
                Current Extracted Value: <strong className="text-amber-400">{selectedEntity.entityValue} {selectedEntity.unit || ''}</strong>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Corrected Value ({selectedEntity.unit || 'Standard Unit'})
                </label>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-bold text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Analyst Justification / Verification Comment
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Reconciled against audited CIL Schedule 4.2 statement (50.80 MT). Field moisture adjustment removed."
                  value={analystComment}
                  onChange={(e) => setAnalystComment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedEntity(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition disabled:opacity-50"
              >
                {isProcessing ? 'Updating Audit Ledger...' : 'Save & Update Audit Trail'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
