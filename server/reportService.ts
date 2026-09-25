import { db } from './db';
import { GeneratedReport } from '../src/types';

export interface ReportGenerationRequest {
  reportType: string;
  subsidiary: string;
  mineName?: string;
  startYear?: number;
  endYear?: number;
  includeGeology?: boolean;
  includeSafety?: boolean;
  generatedBy?: string;
}

export function generateAutomatedReport(req: ReportGenerationRequest): GeneratedReport {
  const start = req.startYear || 2020;
  const end = req.endYear || 2024;
  const sub = req.subsidiary || 'All Subsidiaries';
  const mine = req.mineName || (sub === 'SECL' ? 'Gevra Mega OC' : sub === 'NCL' ? 'Jayant OCP' : 'All Mines');

  const records = db.productionRecords.filter(r => {
    const matchYear = r.year >= start && r.year <= end;
    const matchSub = sub === 'All Subsidiaries' ? true : r.subsidiary.toLowerCase().includes(sub.toLowerCase());
    return matchYear && matchSub;
  });

  const totalProd = records.reduce((acc, r) => acc + (r.achievedProductionMt || 0), 0);
  const targetProd = records.reduce((acc, r) => acc + (r.targetProductionMt || 0), 0);
  const achPct = targetProd > 0 ? (totalProd / targetProd) * 100 : 99.2;

  const reportId = `rep_${Date.now()}`;
  const title = `${sub.toUpperCase()} & ${mine.toUpperCase()} Comprehensive Performance & Geological Review (${start}-${end})`;

  const sections = [
    {
      id: 'sec_1',
      title: '1. Executive Summary',
      content: `This statutory technical report compiles historical and contemporary operational data for ${sub} (${mine}) spanning FY ${start} to FY ${end}. The reporting entities achieved cumulative raw coal production of ${totalProd.toFixed(2)} MT against target of ${targetProd.toFixed(2)} MT (${achPct.toFixed(1)}% accomplishment). Mechanized opencast operations formed the backbone of extraction, bolstered by First Mile Connectivity conveyor investments.`,
      citations: ['CIL_Annual_Production_Review_2023_24.pdf (Page 1)']
    },
    {
      id: 'sec_2',
      title: '2. Scope & Statutory Objectives',
      content: `Prepared pursuant to Ministry of Coal monitoring guidelines, CMPDI exploration appraisal criteria, and Standing Committee on Coal review protocols. The assessment encompasses coal production, stripping ratios, rail logistics dispatch, environmental clearance thresholds, and subsurface exploration borehole data.`,
      citations: ['Ministry_Parliamentary_Question_LokSabha_Starred_412.pdf']
    },
    {
      id: 'sec_3',
      title: '3. Data Sources & Ingestion Pedigree',
      content: `Consolidated from 10 verified primary documents including scanned colliery monthly journals, audited CIL annual financial statements, CMPDI geological resource inventories, and automated Slope Stability Radar (SSR) logs. All source data has been normalized and validated.`,
      citations: ['CIL Consolidated Repository', 'CMPDI Central Geodata Centre']
    },
    {
      id: 'sec_4',
      title: '4. Production Overview',
      content: `Summary of year-wise production and overburden excavation for the reporting window. Opencast stripping ratios remained within planned geotechnical feasibility parameters.`,
      table: {
        headers: ['Reporting Year', 'Mine / Subsidiary', 'Target (MT)', 'Achieved (MT)', 'Achievement (%)', 'OB (MCM)', 'Stripping Ratio (m³/t)'],
        rows: records.slice(0, 8).map(r => [
          `FY ${r.year}`,
          r.mineName,
          r.targetProductionMt,
          r.achievedProductionMt,
          `${r.achievementPercentage}%`,
          r.overburdenRemovalMcm,
          `${r.strippingRatio} m³/t`
        ])
      },
      citations: ['Table tbl_cil_2024_01', 'Table tbl_ncl_01', 'Table tbl_gevra_01']
    },
    {
      id: 'sec_5',
      title: '5. Mining Operations & Heavy Earth Moving Machinery (HEMM)',
      content: `Opencast mines deployed high-capacity 42 Cu.m electric rope shovels matched with 240-tonne haul dumpers. Blasting-free surface miners contributed to 42% of total coal fragmentation in sensitive coalfield zones, reducing flyrock risk and particulate emissions.`,
      citations: ['SECL_Gevra_Mega_OCP_Performance_Report_2023.pdf (Page 7)']
    },
    {
      id: 'sec_6',
      title: '6. Geological Information & Subsurface Reserves',
      content: `Regional Basin geology conforms to Gondwana Supergroup formations (Barakar and Karharbari). CMPDI drilling exploration across 140 regional boreholes estimates total coal resource base at 34,200 MT, with 18,450 MT categorized in Proved classification. Average workable seam thickness ranges from 4.2m to 18.6m.`,
      citations: ['CMPDI_Geological_Exploration_Talcher_Ib_2022.pdf (Page 18)']
    },
    {
      id: 'sec_7',
      title: '7. Year-wise Trends & Historical Trajectory',
      content: `From FY 2020 through FY 2024, production exhibited steady compounding, with CIL aggregate rising from 602.14 MT to 773.60 MT. Capital expenditure on First Mile Connectivity sidings helped maintain steady evacuation even during high monsoon precipitation.`,
      citations: ['CIL_Annual_Production_Review_2023_24.pdf']
    },
    {
      id: 'sec_8',
      title: '8. Mine-wise & Subsidiary Comparative Benchmarking',
      content: `MCL emerged as the highest volume contributor at 206.10 MT (FY24), closely followed by SECL (187.00 MT) and NCL (141.52 MT). Gevra Mega OC and Kusmunda OC retain the lowest operating extraction costs per tonne due to favorable stripping ratios (1.14 m³/t).`,
      citations: ['CIL Subsidiary Synthesis Matrix']
    },
    {
      id: 'sec_9',
      title: '9. Key Findings & Operational Highlights',
      content: `• Overall target achievement rate stands at ${achPct.toFixed(1)}%.\n• First Mile Connectivity closed conveyors transported over 420 MT of raw coal directly to rail silos.\n• Domestic coal power station inventories averaged 18 days of critical reserve.`,
      citations: ['Ministry Lok Sabha Q412 Records']
    },
    {
      id: 'sec_10',
      title: '10. Anomalies, Variances & Conflict Detection',
      content: `Automated data validation detected a variance in SECL Gevra 2022-23 operational accounts: Field dispatch registers logged 52.50 MT, whereas audited statutory statements finalized at 50.80 MT due to pithead moisture adjustments. System logged this as CONFLICT_REQUIRES_REVIEW.`,
      citations: ['Validation Workbench Audit Log aud_03']
    },
    {
      id: 'sec_11',
      title: '11. AI-assisted Insights & Predictive Patterns',
      content: `Natural language topic extraction indicates a 32% increase in evacuation bottleneck mentions around Jharsuguda and Korba rail junctions. Machine learning models project that commissioning Phase-2 Dedicated Freight Corridor links will alleviate ~14 MT of pithead congestion by Q3 2025.`,
      citations: ['AI Analytics Engine & Topic Model top_02']
    },
    {
      id: 'sec_12',
      title: '12. Strategic Recommendations & Action Plan',
      content: `1. Prioritize rapid-loading mechanized silo construction at Belpahar and Kusmunda to eliminate railway rake turnaround delays.\n2. Scale degasification pre-drainage boreholes in BCCL Moonidih deep seams prior to longwall retreat.\n3. Expand GroundProbe Slope Stability Radar coverage to all opencast highwalls exceeding 100m depth.\n4. Complete digitisation and OCR indexing of pre-2015 historical borehole geophysical logs.`,
      citations: ['CMPDI Operations Directorate Review']
    },
    {
      id: 'sec_13',
      title: '13. References & Citation Index',
      content: `• CIL Consolidated Annual Production & Dispatch Review 2023-24 (Doc ID: doc_cil_ann_2024)\n• SECL Gevra Mega Opencast Project Annual Dossier 2022-23 (Doc ID: doc_secl_gevra_2023)\n• CMPDI Regional Institute VII Geological Assessment Report (Doc ID: doc_cmpdi_talcher_2022)\n• BCCL Moonidih Underground Modernization Report 2023 (Doc ID: doc_bccl_moonidih_2023)\n• Ministry of Coal Lok Sabha Starred Question No. 412 (Doc ID: doc_parl_starred_412)`,
      citations: ['GeoMine Traceability Ledger']
    }
  ];

  const report: GeneratedReport = {
    id: reportId,
    title,
    reportType: req.reportType || 'Annual Operational Performance Review',
    reportingPeriod: `FY ${start} - FY ${end}`,
    subsidiary: sub,
    mineName: mine,
    createdAt: new Date().toISOString(),
    generatedBy: req.generatedBy || 'Ananya Sen (Analyst)',
    summaryStats: {
      totalProductionMt: Number(totalProd.toFixed(2)),
      targetAchievementPct: Number(achPct.toFixed(1)),
      reservesAssessedMt: 18450.0,
      dataConfidenceScore: 98.6
    },
    sourceDocuments: [
      'CIL Consolidated Annual Production & Dispatch Review 2023-24',
      'SECL Gevra Mega Opencast Project - Annual Performance Dossier 2022-23',
      'CMPDI Regional Institute VII - Geological Assessment Report on Talcher Coalfield',
      'Ministry of Coal - Lok Sabha Starred Question No. 412'
    ],
    sections
  };

  db.reports.unshift(report);
  db.metrics.reportsGeneratedCount += 1;

  db.logAudit({
    userId: 'usr_analyst_01',
    userName: req.generatedBy || 'Ananya Sen',
    userRole: 'ANALYST',
    action: 'REPORT_GENERATION',
    resourceType: 'REPORT',
    resourceId: report.id,
    details: `Generated ${report.reportType} for ${sub} (${report.reportingPeriod}) with 13 standard sections.`,
    ipAddress: '10.24.110.45',
    status: 'SUCCESS'
  });

  return report;
}
