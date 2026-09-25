import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Scale, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle,
  CheckCircle2,
  PieChart,
  Database
} from 'lucide-react';
import { ProductionRecord } from '../types';

interface AnalyticsTabProps {
  productionRecords: ProductionRecord[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  productionRecords
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'production' | 'overburden' | 'stripping'>('production');

  if (productionRecords.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center shadow-lg">
        <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-white mb-1">No Historical Production Records Found</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
          Analytics are dynamically computed from verified production records. Ingest operational mining reports or spreadsheets to unlock multi-year growth trajectories and subsidiary performance benchmarking.
        </p>
      </div>
    );
  }

  // Derive dynamic yearly totals
  const years = Array.from(new Set(productionRecords.map(r => r.year))).sort((a, b) => a - b);
  const multiYearCil = years.map(yr => {
    const recs = productionRecords.filter(r => r.year === yr && r.subsidiary !== 'CIL Consolidated');
    const prod = recs.reduce((a, b) => a + (b.achievedProductionMt || 0), 0);
    const target = recs.reduce((a, b) => a + (b.targetProductionMt || 0), 0);
    const ob = recs.reduce((a, b) => a + (b.overburdenRemovalMcm || 0), 0);
    const stripping = prod > 0 ? Number((ob / prod).toFixed(2)) : 0;
    return {
      year: yr,
      production: Number(prod.toFixed(2)),
      target: Number(target.toFixed(2)),
      ob: Number(ob.toFixed(2)),
      strippingRatio: stripping
    };
  });

  // Derive subsidiary breakdown for latest year
  const latestYear = years[years.length - 1];
  const latestRecs = productionRecords.filter(r => r.year === latestYear && r.subsidiary !== 'CIL Consolidated');

  const subMap: Record<string, { target: number; achieved: number; ob: number; stripping: number; count: number }> = {};
  latestRecs.forEach(r => {
    if (!subMap[r.subsidiary]) {
      subMap[r.subsidiary] = { target: 0, achieved: 0, ob: 0, stripping: 0, count: 0 };
    }
    subMap[r.subsidiary].target += r.targetProductionMt || 0;
    subMap[r.subsidiary].achieved += r.achievedProductionMt || 0;
    subMap[r.subsidiary].ob += r.overburdenRemovalMcm || 0;
    subMap[r.subsidiary].stripping += r.strippingRatio || 0;
    subMap[r.subsidiary].count += 1;
  });

  const subsidiaryComparison = Object.entries(subMap).map(([name, data]) => {
    const ach = Number(data.achieved.toFixed(2));
    const tgt = Number(data.target.toFixed(2));
    const obVal = Number(data.ob.toFixed(2));
    const strVal = ach > 0 ? Number((obVal / ach).toFixed(2)) : Number((data.stripping / (data.count || 1)).toFixed(2));
    const growth = tgt > 0 ? `${ach >= tgt ? '+' : ''}${(((ach - tgt) / tgt) * 100).toFixed(1)}%` : '0%';
    const status = ach >= tgt ? 'TARGET_EXCEEDED' : 'IN_PROGRESS';
    return {
      name,
      target: tgt,
      achieved: ach,
      growth,
      ob: obVal,
      stripping: strVal,
      status
    };
  });

  const maxVal = Math.max(...multiYearCil.map(m => selectedMetric === 'production' ? m.production : selectedMetric === 'overburden' ? m.ob : m.strippingRatio * 100), 50);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <span>Historical Analytics & Comparative Benchmarking</span>
          </h2>
          <p className="text-xs text-slate-400">
            Multi-year trajectory analysis, stripping ratio evolution, and subsidiary benchmarking dynamically derived from database records.
          </p>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedMetric('production')}
            className={`px-3 py-1.5 rounded font-semibold transition ${
              selectedMetric === 'production' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Coal Production (MT)
          </button>
          <button
            onClick={() => setSelectedMetric('overburden')}
            className={`px-3 py-1.5 rounded font-semibold transition ${
              selectedMetric === 'overburden' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overburden (MCM)
          </button>
          <button
            onClick={() => setSelectedMetric('stripping')}
            className={`px-3 py-1.5 rounded font-semibold transition ${
              selectedMetric === 'stripping' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Stripping Ratio (m³/t)
          </button>
        </div>
      </div>

      {/* Multi-Year Trajectory Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              Multi-Year Metric Trajectory ({years[0]} - {latestYear})
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated across all ingested operational units and mining subsidiaries
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            Dynamic Relational Aggregation
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {multiYearCil.map((yr) => {
            const val = selectedMetric === 'production' ? yr.production : selectedMetric === 'overburden' ? yr.ob : yr.strippingRatio;
            const unit = selectedMetric === 'production' ? 'MT' : selectedMetric === 'overburden' ? 'MCM' : 'm³/t';
            const barHeight = Math.min(100, Math.max(15, (val / (selectedMetric === 'stripping' ? 5 : maxVal)) * 100));

            return (
              <div key={yr.year} className="bg-slate-950 rounded-lg p-3 border border-slate-800 flex flex-col justify-between h-44">
                <div className="text-center">
                  <span className="text-[11px] font-bold text-slate-400">FY {yr.year}</span>
                  <div className="text-sm font-extrabold text-white mt-0.5 font-mono">
                    {val} <span className="text-[10px] text-amber-400">{unit}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-900 rounded h-24 flex items-end p-1 border border-slate-800/80">
                  <div 
                    className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded transition-all duration-500"
                    style={{ height: `${barHeight}%` }}
                  />
                </div>

                <div className="text-[10px] text-slate-500 text-center">
                  {selectedMetric === 'production' ? `Target: ${yr.target} MT` : `Stripping: ${yr.strippingRatio} m³/t`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subsidiary Performance Comparison Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Subsidiary Performance & Efficiency Matrix (FY {latestYear})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Comparative review of production, overburden handling, and composite stripping compliance
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {subsidiaryComparison.length} Reporting Entities
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Subsidiary</th>
                <th className="py-3 px-3">Target (MT)</th>
                <th className="py-3 px-3">Achieved (MT)</th>
                <th className="py-3 px-3">Variance</th>
                <th className="py-3 px-3">Overburden (MCM)</th>
                <th className="py-3 px-3">Stripping Ratio</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {subsidiaryComparison.map((sub) => (
                <tr key={sub.name} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-white">{sub.name}</td>
                  <td className="py-3 px-3 font-mono">{sub.target.toFixed(2)}</td>
                  <td className="py-3 px-3 font-mono font-bold text-amber-400">{sub.achieved.toFixed(2)}</td>
                  <td className="py-3 px-3 font-mono">
                    <span className={sub.growth.startsWith('+') ? 'text-emerald-400' : 'text-amber-400'}>
                      {sub.growth}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-200">{sub.ob.toFixed(2)}</td>
                  <td className="py-3 px-3 font-mono">{sub.stripping.toFixed(2)} m³/t</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      sub.status === 'TARGET_EXCEEDED' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {sub.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
