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
  PieChart
} from 'lucide-react';
import { ProductionRecord } from '../types';

interface AnalyticsTabProps {
  productionRecords: ProductionRecord[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  productionRecords
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'production' | 'overburden' | 'stripping'>('production');

  const multiYearCil = [
    { year: 2020, production: 602.14, target: 660.00, ob: 1154.0, strippingRatio: 1.92 },
    { year: 2021, production: 596.22, target: 660.00, ob: 1344.0, strippingRatio: 2.25 },
    { year: 2022, production: 622.63, target: 670.00, ob: 1362.4, strippingRatio: 2.19 },
    { year: 2023, production: 703.21, target: 700.00, ob: 1654.8, strippingRatio: 2.35 },
    { year: 2024, production: 773.60, target: 780.00, ob: 1960.5, strippingRatio: 2.53 }
  ];

  const subsidiaryComparison2024 = [
    { name: 'MCL', target: 204.0, achieved: 206.10, growth: '+12.4%', ob: 298.0, stripping: 1.45, oms: 22.4, status: 'LEADER_VOLUME' },
    { name: 'SECL', target: 197.0, achieved: 187.00, growth: '+8.1%', ob: 328.0, stripping: 1.75, oms: 16.5, status: 'HIGH_VOLUME' },
    { name: 'NCL', target: 139.0, achieved: 141.52, growth: '+10.2%', ob: 476.2, stripping: 3.37, oms: 18.2, status: 'TARGET_EXCEEDED' },
    { name: 'CCL', target: 84.0, achieved: 86.05, growth: '+14.1%', ob: 224.8, stripping: 2.61, oms: 11.2, status: 'TARGET_EXCEEDED' },
    { name: 'WCL', target: 67.0, achieved: 67.85, growth: '+5.4%', ob: 312.5, stripping: 4.61, oms: 7.8, status: 'TARGET_EXCEEDED' },
    { name: 'BCCL', target: 41.0, achieved: 41.10, growth: '+18.2%', ob: 168.4, stripping: 4.10, oms: 5.4, status: 'COKING_SPECIALIST' },
    { name: 'ECL', target: 39.5, achieved: 38.12, growth: '+7.6%', ob: 142.6, stripping: 3.74, oms: 4.9, status: 'UNDERGROUND_CORE' }
  ];

  const maxProd = 800;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            Historical Analytics & Comparative Benchmarking (2020 - 2024)
          </h2>
          <p className="text-xs text-slate-400">
            Multi-year trajectory analysis, stripping ratio evolution, and subsidiary benchmarking.
          </p>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedMetric('production')}
            className={`px-3 py-1.5 rounded font-semibold transition ${
              selectedMetric === 'production' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Coal Production (MT)
          </button>
          <button
            onClick={() => setSelectedMetric('overburden')}
            className={`px-3 py-1.5 rounded font-semibold transition ${
              selectedMetric === 'overburden' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overburden (MCM)
          </button>
          <button
            onClick={() => setSelectedMetric('stripping')}
            className={`px-3 py-1.5 rounded font-semibold transition ${
              selectedMetric === 'stripping' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Stripping Ratio (m³/t)
          </button>
        </div>
      </div>

      {/* 5-Year Trajectory Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              CIL Multi-Year Production Trajectory (FY 2020 - FY 2024)
            </h3>
            <p className="text-xs text-slate-400">
              Total coal output rose from 602.14 MT to 773.60 MT (+28.5% total expansion).
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            +10.0% Growth in FY24
          </span>
        </div>

        <div className="grid grid-cols-5 gap-3 pt-4 items-end min-h-[220px]">
          {multiYearCil.map((item) => {
            const val = selectedMetric === 'production' ? item.production : selectedMetric === 'overburden' ? item.ob : item.strippingRatio;
            const maxVal = selectedMetric === 'production' ? 800 : selectedMetric === 'overburden' ? 2000 : 3.0;
            const heightPct = (val / maxVal) * 100;

            return (
              <div key={item.year} className="flex flex-col items-center gap-2 group">
                <div className="text-xs font-bold text-amber-400 group-hover:scale-110 transition">
                  {val} {selectedMetric === 'production' ? 'MT' : selectedMetric === 'overburden' ? 'MCM' : 'm³/t'}
                </div>
                <div className="w-full max-w-[80px] bg-slate-950 rounded-t-lg overflow-hidden border border-slate-800 h-44 flex items-end p-1">
                  <div
                    className="w-full bg-gradient-to-t from-amber-600 via-amber-500 to-amber-400 rounded transition-all duration-700 group-hover:brightness-125"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <div className="text-xs font-bold text-slate-300">
                  FY {item.year}
                </div>
                <div className="text-[10px] text-slate-500">
                  {item.year === 2020 ? 'Baseline' : item.year === 2024 ? '+10.0% YoY' : '+12.9% YoY'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subsidiary Comparative Benchmarking Table & Insights */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              Subsidiary Operational Matrix & Productivity (FY 2023-24)
            </h3>
            <p className="text-xs text-slate-400">
              Cross-subsidiary comparison of volume, target achievement, stripping ratio, and Output per Manshift (OMS).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Subsidiary</th>
                <th className="py-3 px-3">Target (MT)</th>
                <th className="py-3 px-3">Achieved (MT)</th>
                <th className="py-3 px-3">Target %</th>
                <th className="py-3 px-3">OB Removal (MCM)</th>
                <th className="py-3 px-3">Stripping Ratio</th>
                <th className="py-3 px-3">OMS (Tonnes)</th>
                <th className="py-3 px-3">Strategic Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {subsidiaryComparison2024.map((sub) => {
                const isOver = sub.achieved >= sub.target;

                return (
                  <tr key={sub.name} className="hover:bg-slate-850/60 transition">
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-1.5">
                      <span>{sub.name}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{sub.target.toFixed(2)}</td>
                    <td className="py-3 px-3 font-extrabold text-amber-400">{sub.achieved.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${isOver ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {((sub.achieved / sub.target) * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-mono">{sub.ob.toFixed(1)}</td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-slate-200">{sub.stripping} m³/t</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-blue-400">{sub.oms}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-950 border border-slate-800 text-slate-400">
                        {sub.status.replace(/_/g, ' ')}
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
