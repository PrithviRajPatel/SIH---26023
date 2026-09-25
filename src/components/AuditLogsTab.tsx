import React, { useState } from 'react';
import { Shield, Clock, Filter, Search, CheckCircle, AlertTriangle, XCircle, FileText } from 'lucide-react';
import { AuditLogEntry, UserRole } from '../types';

interface AuditLogsTabProps {
  logs: AuditLogEntry[];
  currentUserRole: UserRole;
}

export const AuditLogsTab: React.FC<AuditLogsTabProps> = ({ logs, currentUserRole }) => {
  const [filterAction, setFilterAction] = useState('ALL');
  const [filterRole, setFilterRole] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchAction = filterAction === 'ALL' || log.action === filterAction;
    const matchRole = filterRole === 'ALL' || log.userRole === filterRole;
    const matchSearch = search === '' || 
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());

    return matchAction && matchRole && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Statutory Traceability & Compliance Audit Trail
          </h2>
          <p className="text-xs text-slate-400">
            Immutable log of all user actions, document ingestions, validation approvals, queries, and statutory exports.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
            Current Viewer Role: <strong className="text-amber-400">{currentUserRole}</strong>
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, action, or log details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full md:w-56 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="DOCUMENT_UPLOAD">DOCUMENT_UPLOAD</option>
            <option value="DOCUMENT_PROCESS">DOCUMENT_PROCESS</option>
            <option value="ENTITY_VALIDATION_APPROVE">ENTITY_VALIDATION_APPROVE</option>
            <option value="ENTITY_VALIDATION_REJECT">ENTITY_VALIDATION_REJECT</option>
            <option value="ENTITY_VALIDATION_EDIT">ENTITY_VALIDATION_EDIT</option>
            <option value="NATURAL_QUERY">NATURAL_QUERY</option>
            <option value="SQL_QUERY">SQL_QUERY</option>
            <option value="REPORT_GENERATION">REPORT_GENERATION</option>
            <option value="REPORT_EXPORT">REPORT_EXPORT</option>
          </select>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full md:w-36 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="ANALYST">ANALYST</option>
            <option value="VIEWER">VIEWER</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp & ID</th>
                <th className="py-3 px-3">User & Role</th>
                <th className="py-3 px-3">Action Type</th>
                <th className="py-3 px-4">Audit Description / Activity</th>
                <th className="py-3 px-3">IP Address</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredLogs.map((log) => {
                const isWarn = log.status === 'WARNING';
                const isSuccess = log.status === 'SUCCESS';

                return (
                  <tr key={log.id} className="hover:bg-slate-850/60 transition">
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <div className="text-slate-200">{new Date(log.timestamp).toLocaleString()}</div>
                      <div className="text-[9px] text-slate-500">{log.id}</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{log.userName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">[{log.userRole}]</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-950 text-amber-400 border border-slate-800">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 max-w-sm text-slate-300 leading-snug">
                      {log.details}
                    </td>

                    <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                      {log.ipAddress}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isSuccess ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        isWarn ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {isSuccess ? <CheckCircle className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                        <span>{log.status}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
