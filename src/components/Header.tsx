import React from 'react';
import { 
  Database, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw, 
  FileText, 
  PlayCircle
} from 'lucide-react';
import { User, UserRole } from '../types';

interface HeaderProps {
  currentUser: User;
  onSwitchUser: (role: UserRole) => void;
  onOpenDemoGuide: () => void;
  onResetSeed: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  onOpenDemoGuide,
  onResetSeed
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 shadow-md">
      {/* Top Government / Ministry of Coal Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 px-4 py-1 text-xs font-medium text-amber-50 flex items-center justify-between border-b border-amber-600/30">
        <div className="flex items-center gap-2">
          <span className="bg-amber-950/80 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border border-amber-400/40">
            SIH 2026 Problem SIH26023
          </span>
          <span className="hidden sm:inline">Ministry of Coal • Coal India Limited (CIL) • CMPDI Enterprise Knowledge Infrastructure</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AI Document Engine: Active
          </span>
          <span className="text-amber-200/80 hidden md:inline">|</span>
          <span className="text-amber-100 hidden md:inline">RAG + SQL Query Router Online</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-slate-900 p-0.5 shadow-lg shadow-amber-500/10">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                GeoMine<span className="text-amber-400">Intel</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                CMPDI / CIL
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Geological, Mining & Production Document Intelligence Platform
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* SIH Demo Walkthrough Button */}
          <button
            onClick={onOpenDemoGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs transition shadow-sm"
          >
            <PlayCircle className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">SIH Judge Walkthrough</span>
            <span className="sm:hidden">Demo</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetSeed}
            title="Reset dataset back to fresh demonstration state"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>

          {/* Role Selector */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium text-slate-200">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400">{currentUser.designation.substring(0, 30)}...</div>
            </div>
            <div className="relative">
              <select
                value={currentUser.role}
                onChange={(e) => onSwitchUser(e.target.value as UserRole)}
                className="bg-slate-800 text-amber-300 text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="ADMIN">ADMIN: Dr. R. Sharma</option>
                <option value="ANALYST">ANALYST: Ananya Sen</option>
                <option value="VIEWER">VIEWER: V. Roy (Ministry)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
