/**
 * Synthetic Evaluation Benchmark Fixtures (CMPDI / Coal India Limited Domain)
 * SMART INDIA HACKATHON 2026 - Problem Statement SIH26023
 * 
 * NOTE: This dataset is synthetic benchmark data designed for automated testing,
 * algorithmic validation, and hackathon evaluation. It is NOT official classified CIL data.
 */

export const BENCHMARK_FIXTURES = {
  isSyntheticBenchmark: true,
  benchmarkVersion: '2026.1-EVAL',
  documents: [
    {
      id: 'doc_bench_01',
      title: 'CMPDI Regional Exploration Assessment - Talcher Basin (Benchmark)',
      filename: 'CMPDI_Talcher_Exploration_Benchmark_2024.pdf',
      fileHash: 'sha256_bench_9a8b7c6d5e4f3a2b',
      fileType: 'pdf',
      fileSize: 3200000,
      subsidiary: 'CMPDI',
      mineName: 'Talcher Regional Basin',
      coalfield: 'Talcher Coalfield',
      reportingYear: 2024,
      docType: 'GEOLOGICAL_ASSESSMENT',
      summary: 'Synthetic exploration appraisal of Barakar formations in Talcher coalfield. Total proved reserves estimated at 18,450 MT with 18.6m average seam thickness.',
      rawText: `CENTRAL MINE PLANNING & DESIGN INSTITUTE (RI-VII BHUBANESWAR)\nGEOLOGICAL APPRAISAL DOSSIER 2023-24\nExploration Target: Barakar Formation Deep Coal Strata\nProved geological reserves categorized at 18,450 MT.\nAverage Barakar Seam-II thickness logged at 18.6m with low stripping ratio index.`
    },
    {
      id: 'doc_bench_02',
      title: 'SECL Gevra Mega Opencast Annual Operating Review (Benchmark)',
      filename: 'SECL_Gevra_Annual_Operating_Review_2023.pdf',
      fileHash: 'sha256_bench_1f2e3d4c5b6a7988',
      fileType: 'pdf',
      fileSize: 4500000,
      subsidiary: 'SECL',
      mineName: 'Gevra Mega OC',
      coalfield: 'Korba Coalfield',
      reportingYear: 2023,
      docType: 'ANNUAL_REPORT',
      summary: 'Operational review for Gevra Mega Opencast. Achieved production of 50.80 MT against target of 52.00 MT. Composite overburden removal of 58.20 MCM with 1.14 m3/t stripping ratio.',
      rawText: `SOUTH EASTERN COALFIELDS LIMITED\nGEVRA MEGA OPENCAST PROJECT PERFORMANCE DOSSIER 2022-23\nAnnual Coal Production achieved: 50.80 MT against Target of 52.00 MT (97.7%).\nComposite Overburden Removal: 58.20 MCM. Stripping Ratio: 1.14 m3/t.\nSafety & Geotechnical Audit: Continuous slope stability radar maintained zero slope failures.`
    },
    {
      id: 'doc_bench_03',
      title: 'NCL Singrauli Industrial Basin Production Review (Benchmark)',
      filename: 'NCL_Singrauli_Basin_Review_2024.xlsx',
      fileHash: 'sha256_bench_4a5b6c7d8e9f0123',
      fileType: 'xlsx',
      fileSize: 1800000,
      subsidiary: 'NCL',
      mineName: 'Jayant OCP',
      coalfield: 'Singrauli Coalfield',
      reportingYear: 2024,
      docType: 'PRODUCTION_SPREADSHEET',
      summary: 'Northern Coalfields Jayant and Dudhichua multi-pit operational figures. Jayant achieved 26.50 MT raw coal with 82.40 MCM overburden.',
      rawText: `NORTHERN COALFIELDS LIMITED\nSINGRAULI BASIN PERFORMANCE SUMMARY (FY 2023-24)\nMine: Jayant OCP | Raw Coal Production: 26.50 MT | Overburden Handled: 82.40 MCM | Stripping Ratio: 3.11 m3/t.`
    }
  ],
  productionRecords: [
    {
      subsidiary: 'SECL',
      mineName: 'Gevra Mega OC',
      coalfield: 'Korba Coalfield',
      year: 2023,
      targetProductionMt: 52.00,
      achievedProductionMt: 50.80,
      achievementPercentage: 97.7,
      dispatchMt: 49.50,
      overburdenRemovalMcm: 58.20,
      strippingRatio: 1.14,
      productivityOms: 12.8,
      validationStatus: 'CONFLICT'
    },
    {
      subsidiary: 'NCL',
      mineName: 'Jayant OCP',
      coalfield: 'Singrauli Coalfield',
      year: 2024,
      targetProductionMt: 25.00,
      achievedProductionMt: 26.50,
      achievementPercentage: 106.0,
      dispatchMt: 25.80,
      overburdenRemovalMcm: 82.40,
      strippingRatio: 3.11,
      productivityOms: 18.2,
      validationStatus: 'VERIFIED'
    },
    {
      subsidiary: 'MCL',
      mineName: 'Belpahar OC',
      coalfield: 'Ib Valley Coalfield',
      year: 2024,
      targetProductionMt: 18.00,
      achievedProductionMt: 18.40,
      achievementPercentage: 102.2,
      dispatchMt: 17.90,
      overburdenRemovalMcm: 32.50,
      strippingRatio: 1.76,
      productivityOms: 22.4,
      validationStatus: 'VERIFIED'
    }
  ],
  inquiries: [
    {
      id: 'inq_bench_01',
      referenceNumber: 'LS-PQ/Starred/4921/2024',
      house: 'Lok Sabha',
      questionType: 'Starred',
      subject: 'Domestic Coking Coal Availability, Washery Yield, and Import Substitution Targets',
      ministryDivision: 'Parliamentary Cell / Operations Directorate',
      urgency: 'Critical',
      dueDate: '2024-11-28',
      assignedTo: 'Ananya Sen (Analyst)',
      status: 'Drafted',
      queryDetails: 'Will the Minister of Coal be pleased to state: (a) Total raw coking coal production across BCCL and CCL during FY 2023-24; (b) Current capacity utilization of existing washeries; (c) Steps initiated under Mission Coking Coal.',
      draftReply: `GOVERNMENT OF INDIA\nMINISTRY OF COAL\nLOK SABHA STARRED QUESTION NO. 4921\n\n(a) to (c): Raw coking coal production across BCCL and CCL reached 127.15 MT in FY 2023-24. Four new heavy medium cyclone washeries with aggregate capacity of 14 MTPA are in active construction to increase domestic clean coal supply to the steel sector.`
    }
  ]
};
