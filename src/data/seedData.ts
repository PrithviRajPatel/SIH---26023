import { 
  MiningDocument, 
  ProductionRecord, 
  GeologicalRecord, 
  TopicItem, 
  WordCloudItem, 
  AuditLogEntry, 
  PerformanceMetrics,
  User
} from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'usr_admin_01',
    name: 'Dr. Rajeshwar Sharma',
    email: 'r.sharma@cmpdi.co.in',
    role: 'ADMIN',
    designation: 'General Manager (Geomatics & IT)',
    department: 'CMPDI Central Geodata Centre',
    subsidiary: 'CMPDI HQ Ranchi'
  },
  {
    id: 'usr_analyst_01',
    name: 'Ananya Sen',
    email: 'ananya.sen@coalindia.in',
    role: 'ANALYST',
    designation: 'Senior Mining Analyst (Production Planning)',
    department: 'Operations Directorate',
    subsidiary: 'Coal India Ltd Kolkata'
  },
  {
    id: 'usr_viewer_01',
    name: 'Vikramaditya Roy',
    email: 'v.roy@nic.in',
    role: 'VIEWER',
    designation: 'Under Secretary (Parliamentary & Statistics)',
    department: 'Ministry of Coal, New Delhi',
    subsidiary: 'Ministry of Coal'
  }
];

export const INITIAL_DOCUMENTS: MiningDocument[] = [
  {
    id: 'doc_cil_ann_2024',
    title: 'CIL Consolidated Annual Production & Dispatch Review 2023-24',
    filename: 'CIL_Annual_Production_Review_2023_24.pdf',
    fileHash: 'sha256_e814a79b02a9b31d',
    fileType: 'pdf',
    fileSize: 4820300,
    subsidiary: 'CIL Consolidated',
    coalfield: 'All Major Coalfields (Pan-India)',
    reportingYear: 2024,
    docType: 'ANNUAL_REPORT',
    status: 'VALIDATED',
    isScanned: false,
    pageCount: 38,
    uploadedAt: '2024-04-18T10:30:00Z',
    processedAt: '2024-04-18T10:32:15Z',
    tags: ['Production', 'Dispatch', 'Annual Report', 'Subsidiaries', 'Financial figures'],
    summary: 'Consolidated report detailing all 7 coal producing subsidiaries. Total coal production reached 773.6 MT against target of 780.0 MT (99.18% achievement). SECL and MCL accounted for 48% of total volume.',
    pages: [
      {
        pageNumber: 1,
        ocrConfidence: 0.99,
        isScanned: false,
        rawText: `COAL INDIA LIMITED (A Maharatna Company)
ANNUAL PRODUCTION & DESPATCH REVIEW 2023-24
EXECUTIVE SUMMARY
During the financial year 2023-24, Coal India Limited achieved a record total raw coal production of 773.6 million tonnes (MT), registering a growth of 10.0% compared to 703.2 MT achieved during 2022-23. Total off-take and dispatch stood at 753.5 MT.
Opencast mines contributed 741.2 MT (95.8%), while Underground mines contributed 32.4 MT (4.2%). Composite overburden removal reached an all-time peak of 1,960.5 Million Cubic Metres (MCM).`
      },
      {
        pageNumber: 14,
        ocrConfidence: 0.98,
        isScanned: false,
        rawText: `TABLE 4.2: SUBSIDIARY-WISE PRODUCTION SUMMARY (FY 2023-24)
Subsidiary Target (MT) Achieved (MT) Achievement (%) Off-take (MT) Overburden (MCM)
ECL        39.50       38.12         96.5%           37.40        142.6
BCCL       41.00       41.10        100.2%           40.15        168.4
CCL        84.00       86.05        102.4%           84.20        224.8
NCL       139.00      141.52        101.8%          140.20        476.2
WCL        67.00       67.85        101.3%           66.90        312.5
SECL      197.00      187.00         94.9%          183.40        328.0
MCL       204.00      206.10        101.0%          195.50        298.0
CMPDI          -           -             -               -            -
TOTAL CIL 780.00      773.60         99.2%          753.50       1960.5`
      },
      {
        pageNumber: 22,
        ocrConfidence: 0.97,
        isScanned: false,
        rawText: `CHAPTER 7: INFRASTRUCTURE & FIRST MILE CONNECTIVITY (FMC)
Rail evacuation capacity increased significantly with the commissioning of Phase-1 CHP lines in SECL (Gevra and Kusmunda sidings) and MCL (Talcher rail corridor). First Mile Connectivity projects handled 420 MT of raw coal via mechanized closed conveyors, reducing road transportation environmental impact.`
      }
    ],
    tables: [
      {
        id: 'tbl_cil_2024_01',
        title: 'Subsidiary-Wise Coal Production & Off-take Summary 2023-24',
        pageNumber: 14,
        confidence: 0.98,
        headers: ['Subsidiary', 'Target (MT)', 'Achieved (MT)', 'Achievement (%)', 'Off-take (MT)', 'OB Removal (MCM)'],
        rows: [
          ['ECL', 39.50, 38.12, '96.5%', 37.40, 142.6],
          ['BCCL', 41.00, 41.10, '100.2%', 40.15, 168.4],
          ['CCL', 84.00, 86.05, '102.4%', 84.20, 224.8],
          ['NCL', 139.00, 141.52, '101.8%', 140.20, 476.2],
          ['WCL', 67.00, 67.85, '101.3%', 66.90, 312.5],
          ['SECL', 197.00, 187.00, '94.9%', 183.40, 328.0],
          ['MCL', 204.00, 206.10, '101.0%', 195.50, 298.0],
          ['Total CIL', 780.00, 773.60, '99.2%', 753.50, 1960.5]
        ]
      }
    ],
    chunks: [
      {
        id: 'chk_cil_01',
        pageNumber: 1,
        confidence: 0.99,
        sectionTitle: 'Executive Summary',
        content: 'During financial year 2023-24, Coal India Limited achieved raw coal production of 773.6 MT (growth of 10.0% compared to 703.2 MT in 2022-23). Total dispatch reached 753.5 MT. Opencast accounted for 741.2 MT and Underground 32.4 MT.'
      },
      {
        id: 'chk_cil_02',
        pageNumber: 14,
        confidence: 0.98,
        sectionTitle: 'Subsidiary Production',
        content: 'MCL led subsidiary production with 206.10 MT (101.0% of target), followed by SECL with 187.00 MT. NCL produced 141.52 MT, CCL 86.05 MT, WCL 67.85 MT, BCCL 41.10 MT, and ECL 38.12 MT. Overburden removal was 1960.5 MCM.'
      }
    ],
    entities: [
      {
        id: 'ent_01',
        documentId: 'doc_cil_ann_2024',
        pageNumber: 1,
        entityType: 'achieved_production',
        entityKey: 'CIL Total Raw Coal Production',
        entityValue: 773.60,
        unit: 'MT',
        normalizedValue: 773.60,
        normalizedUnit: 'MT',
        sourceText: 'total raw coal production of 773.6 million tonnes (MT)',
        extractionMethod: 'STRUCTURED_CSV',
        confidence: 0.99,
        validationStatus: 'APPROVED',
        timestamp: '2024-04-18T10:32:00Z'
      },
      {
        id: 'ent_02',
        documentId: 'doc_cil_ann_2024',
        pageNumber: 14,
        entityType: 'achieved_production',
        entityKey: 'MCL Production FY24',
        entityValue: 206.10,
        unit: 'MT',
        normalizedValue: 206.10,
        normalizedUnit: 'MT',
        sourceText: 'MCL Achieved 206.10 MT',
        sourceTable: 'TABLE 4.2',
        extractionMethod: 'TABULAR_PARSER',
        confidence: 0.98,
        validationStatus: 'APPROVED',
        timestamp: '2024-04-18T10:32:00Z'
      }
    ]
  },
  {
    id: 'doc_secl_gevra_2023',
    title: 'SECL Gevra Mega Opencast Project - Annual Performance Dossier 2022-23',
    filename: 'SECL_Gevra_Mega_OCP_Performance_Report_2023.pdf',
    fileHash: 'sha256_b4892c90fa187e22',
    fileType: 'pdf',
    fileSize: 3120000,
    subsidiary: 'SECL',
    mineName: 'Gevra Mega OC',
    coalfield: 'Korba Coalfield',
    reportingYear: 2023,
    docType: 'SCANNED_MINING_REPORT',
    status: 'VALIDATION_REQUIRED',
    isScanned: true,
    pageCount: 24,
    uploadedAt: '2023-05-12T14:15:00Z',
    processedAt: '2023-05-12T14:18:30Z',
    tags: ['SECL', 'Gevra', 'Mega Mine', 'Opencast', 'Expansion', 'Conflict Flagged'],
    summary: 'Detailed technical report for Gevra OC mine in Korba Coalfield. In-pit continuous miner operations and blasting-free surface miner deployment. Note: Contains initial draft production figure of 52.5 MT vs audited figure of 50.8 MT.',
    pages: [
      {
        pageNumber: 1,
        ocrConfidence: 0.89,
        isScanned: true,
        rawText: `SOUTH EASTERN COALFIELDS LIMITED
(KORBA AREA - GEVRA PROJECT OFFICE)
TECHNICAL & OPERATIONAL PERFORMANCE REVIEW FY 2022-23
The Gevra Opencast Project, recognized as Asia's single largest opencast coal mine, operated under environmental clearance expansion aiming for 70 MTPA capacity.
For the year 2022-23, tentative field dispatch and extraction figure recorded was 52.5 MT (52,500,000 Tonnes). [Audited reconciled balance: 50.80 MT].`,
        boundingBoxes: [
          { text: 'GEVRA PROJECT OFFICE', box: [12, 20, 60, 5], confidence: 0.94 },
          { text: 'recorded was 52.5 MT', box: [45, 25, 35, 4], confidence: 0.88 },
          { text: '50.80 MT', box: [48, 62, 20, 4], confidence: 0.92 }
        ]
      },
      {
        pageNumber: 7,
        ocrConfidence: 0.91,
        isScanned: true,
        rawText: `HEMM DEPLOYMENT & STRIPPING RATIO:
Shovels (42 Cu.m P&H): 4 Units commissioned.
Dumpers (240 T CAT 793D): 28 Units in operation.
Composite stripping ratio achieved was 1.14 m3/t, reflecting advantageous seam geometry with Upper and Lower Kusumunda seams merging. Overburden handled: 58.2 MCM.`
      }
    ],
    tables: [
      {
        id: 'tbl_gevra_01',
        title: 'Gevra OC Production Breakdown 2022-23',
        pageNumber: 7,
        confidence: 0.91,
        headers: ['Seam / Bench', 'Thickness (m)', 'Coal Extracted (MT)', 'OB Stripping (MCM)', 'Stripping Ratio'],
        rows: [
          ['Upper Kusumunda', '22.4', '28.40', '32.1', '1.13'],
          ['Lower Kusumunda', '31.2', '22.40', '26.1', '1.16'],
          ['Combined Total', '53.6', '50.80', '58.2', '1.14']
        ]
      }
    ],
    chunks: [
      {
        id: 'chk_gev_01',
        pageNumber: 1,
        confidence: 0.89,
        sectionTitle: 'Production Reconciliation Note',
        content: 'Gevra OCP operational records show tentative field measurement of 52.5 MT while statutory accounting finalized at 50.80 MT due to moisture adjustment and pit-head stockpile calibration.'
      },
      {
        id: 'chk_gev_02',
        pageNumber: 7,
        confidence: 0.91,
        sectionTitle: 'HEMM and Stripping Ratio',
        content: 'Stripping ratio at Gevra was 1.14 m3/t. Total overburden handled was 58.2 MCM with 240T dumpers and 42 Cu.m rope shovels.'
      }
    ],
    entities: [
      {
        id: 'ent_gev_01',
        documentId: 'doc_secl_gevra_2023',
        pageNumber: 1,
        entityType: 'achieved_production',
        entityKey: 'Gevra Mine Production 2022-23',
        entityValue: 52.50,
        unit: 'MT',
        normalizedValue: 52.50,
        normalizedUnit: 'MT',
        sourceText: 'tentative field dispatch and extraction figure recorded was 52.5 MT',
        extractionMethod: 'OCR_REGEX',
        confidence: 0.88,
        validationStatus: 'CONFLICT_REQUIRES_REVIEW',
        analystComment: 'Field estimate states 52.5 MT, but official audited CIL statement lists 50.80 MT. Requires human verification.',
        timestamp: '2023-05-12T14:18:00Z'
      },
      {
        id: 'ent_gev_02',
        documentId: 'doc_secl_gevra_2023',
        pageNumber: 7,
        entityType: 'stripping_ratio',
        entityKey: 'Gevra Stripping Ratio',
        entityValue: 1.14,
        unit: 'm3/t',
        normalizedValue: 1.14,
        normalizedUnit: 'm3/t',
        sourceText: 'Composite stripping ratio achieved was 1.14 m3/t',
        extractionMethod: 'OCR_REGEX',
        confidence: 0.93,
        validationStatus: 'APPROVED',
        timestamp: '2023-05-12T14:18:00Z'
      }
    ]
  },
  {
    id: 'doc_cmpdi_talcher_2022',
    title: 'CMPDI Regional Institute VII - Geological Assessment Report on Talcher Coalfield',
    filename: 'CMPDI_Geological_Exploration_Talcher_Ib_2022.pdf',
    fileHash: 'sha256_77c13a0198bb6c12',
    fileType: 'pdf',
    fileSize: 5410000,
    subsidiary: 'CMPDI',
    coalfield: 'Talcher & Ib Valley Coalfields',
    reportingYear: 2022,
    docType: 'GEOLOGICAL_ASSESSMENT',
    status: 'VALIDATED',
    isScanned: false,
    pageCount: 52,
    uploadedAt: '2022-11-05T09:20:00Z',
    processedAt: '2022-11-05T09:24:10Z',
    tags: ['CMPDI', 'Geology', 'Exploration', 'Boreholes', 'Reserves', 'Talcher'],
    summary: 'Comprehensive drilling exploration data covering 140 boreholes. Identifies 34,200 MT total coal resources with 18,450 MT categorized under Proved category across Barakar Formation seams (Seam II to IX).',
    pages: [
      {
        pageNumber: 1,
        ocrConfidence: 0.99,
        isScanned: false,
        rawText: `CENTRAL MINE PLANNING & DESIGN INSTITUTE LIMITED
REGIONAL INSTITUTE - VII, BHUBANESWAR
GEOLOGICAL EXPLORATION & RESOURCE ESTIMATION REPORT: TALCHER COALFIELD
Borehole Density: 140 core boreholes drilled with cumulative meterage of 42,650 m.
Stratigraphy: Gondwana Supergroup, Karharbari & Barakar Formations.
Total Regional Coal Reserves: 34,200 Million Tonnes (Proved: 18,450 MT, Indicated: 11,200 MT, Inferred: 4,550 MT).`
      },
      {
        pageNumber: 18,
        ocrConfidence: 0.98,
        isScanned: false,
        rawText: `TABLE 2.4: SEAM-WISE RESERVES & THICKNESS CHARACTERISTICS
Seam Name          Avg Thickness (m) Depth Range (m) Coal Grade  Proved Reserves (MT)
Seam I (Karharbari) 4.2               180 - 450       G7 - G9     2,850
Seam II (Barakar)   18.6               40 - 220       G11 - G13   6,400
Seam III            8.4                60 - 280       G12 - G14   4,100
Seam IV / V         12.1               90 - 340       G13         3,200
Seam VI to IX       15.8              140 - 410       G14         1,900
TOTAL                                                            18,450`
      }
    ],
    tables: [
      {
        id: 'tbl_cmpdi_talcher_01',
        title: 'Talcher Seam-wise Geological Reserves & Grade Matrix',
        pageNumber: 18,
        confidence: 0.98,
        headers: ['Seam Name', 'Avg Thickness (m)', 'Depth Range (m)', 'Coal Grade', 'Proved Reserves (MT)'],
        rows: [
          ['Seam I (Karharbari)', '4.2', '180 - 450', 'G7 - G9', 2850],
          ['Seam II (Barakar)', '18.6', '40 - 220', 'G11 - G13', 6400],
          ['Seam III', '8.4', '60 - 280', 'G12 - G14', 4100],
          ['Seam IV / V', '12.1', '90 - 340', 'G13', 3200],
          ['Seam VI to IX', '15.8', '140 - 410', 'G14', 1900]
        ]
      }
    ],
    chunks: [
      {
        id: 'chk_cmpdi_01',
        pageNumber: 1,
        confidence: 0.99,
        sectionTitle: 'Exploration Summary',
        content: 'CMPDI Regional Institute VII drilled 140 boreholes totalling 42,650 m. Identified 34,200 MT total coal resources with 18,450 MT Proved category in Talcher Coalfield.'
      },
      {
        id: 'chk_cmpdi_02',
        pageNumber: 18,
        confidence: 0.98,
        sectionTitle: 'Seam Thickness & Reserves',
        content: 'Barakar Seam II is the primary opencast target with average thickness of 18.6 m, shallow depth of 40-220 m, G11-G13 grade, and proved reserves of 6,400 MT.'
      }
    ],
    entities: [
      {
        id: 'ent_talcher_01',
        documentId: 'doc_cmpdi_talcher_2022',
        pageNumber: 1,
        entityType: 'geological_reserves',
        entityKey: 'Talcher Proved Coal Reserves',
        entityValue: 18450,
        unit: 'MT',
        normalizedValue: 18450,
        normalizedUnit: 'MT',
        sourceText: 'Proved: 18,450 MT',
        extractionMethod: 'STRUCTURED_CSV',
        confidence: 0.99,
        validationStatus: 'APPROVED',
        timestamp: '2022-11-05T09:24:00Z'
      }
    ]
  },
  {
    id: 'doc_bccl_moonidih_2023',
    title: 'BCCL Moonidih Underground Colliery - Longwall Mechanization & Coking Coal Report',
    filename: 'BCCL_Moonidih_Underground_Modernization_2023.pdf',
    fileHash: 'sha256_5a91cf7601ad892c',
    fileType: 'pdf',
    fileSize: 2890000,
    subsidiary: 'BCCL',
    mineName: 'Moonidih Underground Project',
    coalfield: 'Jharia Coalfield',
    reportingYear: 2023,
    docType: 'SCANNED_MINING_REPORT',
    status: 'VALIDATED',
    isScanned: true,
    pageCount: 16,
    uploadedAt: '2023-08-19T11:45:00Z',
    processedAt: '2023-08-19T11:48:12Z',
    tags: ['BCCL', 'Moonidih', 'Underground', 'Coking Coal', 'Gas Drainage', 'Longwall'],
    summary: 'Focuses on deep underground mining (Seam XVI & XVII) at 500m depth. High gas emission rate required pre-drainage methane drainage system. Powered Roof Support longwall shearer experienced 3 weeks downtime due to hydraulic pump failure.',
    pages: [
      {
        pageNumber: 1,
        ocrConfidence: 0.86,
        isScanned: true,
        rawText: `BHARAT COKING COAL LIMITED (BCCL)
WESTERN JHARIA AREA - MOONIDIH PROJECT
TECHNICAL REPORT ON POWERED ROOF SUPPORT (PRS) LONGWALL FACE OPERATION
Seam: XVI Top Seam (Depth: 480 m to 520 m).
Coal Category: Steel Grade-I Prime Coking Coal (Crucible Swelling Number: 6.5).
Methane Emission: High (Degree-III gassy mine, 14.8 m3/tonne of coal extracted).
Production 2022-23: Target: 1.20 MT, Achieved: 0.94 MT (78.3%).
Shortfall Reason: Equipment failure in Powered Support electro-hydraulic system and severe methane influx requiring ventilatory throttling in Q3.`
      },
      {
        pageNumber: 4,
        ocrConfidence: 0.88,
        isScanned: true,
        rawText: `COAL BENEFICIATION & STEEL SUPPLY:
Raw coking coal washed at Moonidih Washery with yield of 38.5% clean coal (ash 17.5%), supplied exclusively to SAIL (Bhilai & Bokaro Steel Plants).
Gas Drainage Project: Pre-drainage boreholes extracted 2.8 Million cubic metres of pure methane, flaring 40% and utilizing remainder for pithead thermal heating.`
      }
    ],
    tables: [
      {
        id: 'tbl_bccl_01',
        title: 'Moonidih Underground Key Performance Indicators 2022-23',
        pageNumber: 1,
        confidence: 0.88,
        headers: ['Metric', 'Unit', 'Planned', 'Achieved', 'Variance / Reason'],
        rows: [
          ['Raw Coking Coal Production', 'MT', '1.20', '0.94', '-21.7% (Longwall breakdown)'],
          ['Gas Drainage Volume', 'MCM', '3.50', '2.80', '-20.0% (Seam impermeability)'],
          ['Clean Coal Dispatch to SAIL', 'MT', '0.46', '0.36', '-21.7%'],
          ['OMS (Output per manshift)', 'Tonnes', '3.20', '2.45', '-23.4%']
        ]
      }
    ],
    chunks: [
      {
        id: 'chk_bccl_01',
        pageNumber: 1,
        confidence: 0.86,
        sectionTitle: 'Production & Geological Challenges',
        content: 'Moonidih underground produced 0.94 MT of prime coking coal against 1.20 MT target. Major geological hurdles included Degree-III methane emission (14.8 m3/t) and 3 weeks downtime from hydraulic pump failure.'
      }
    ],
    entities: [
      {
        id: 'ent_bccl_01',
        documentId: 'doc_bccl_moonidih_2023',
        pageNumber: 1,
        entityType: 'achieved_production',
        entityKey: 'Moonidih Underground Production',
        entityValue: 0.94,
        unit: 'MT',
        normalizedValue: 0.94,
        normalizedUnit: 'MT',
        sourceText: 'Achieved: 0.94 MT (78.3%)',
        extractionMethod: 'OCR_REGEX',
        confidence: 0.90,
        validationStatus: 'APPROVED',
        timestamp: '2023-08-19T11:48:00Z'
      }
    ]
  },
  {
    id: 'doc_ncl_singrauli_2024',
    title: 'NCL Singrauli Coalfield Monthly Production & Dispatch Matrix 2023-24',
    filename: 'NCL_Singrauli_Coalfield_Production_Dispatch_2024.xlsx',
    fileHash: 'sha256_33918a287bfcc119',
    fileType: 'xlsx',
    fileSize: 1845000,
    subsidiary: 'NCL',
    coalfield: 'Singrauli Coalfield',
    reportingYear: 2024,
    docType: 'PRODUCTION_SPREADSHEET',
    status: 'VALIDATED',
    isScanned: false,
    pageCount: 12,
    uploadedAt: '2024-04-05T08:10:00Z',
    processedAt: '2024-04-05T08:11:40Z',
    tags: ['NCL', 'Jayant', 'Dudhichua', 'Singrauli', 'Power Plants', 'Excel Matrix'],
    summary: 'Full monthly performance of Jayant, Dudhichua, Nigahi, Khadia, Bina, and Amlohri opencast projects. Total NCL coal production exceeded target by 1.8%, supplying 133 MT directly to pithead NTPC power stations via merry-go-round (MGR) trains.',
    pages: [
      {
        pageNumber: 1,
        ocrConfidence: 1.0,
        isScanned: false,
        rawText: `NORTHERN COALFIELDS LIMITED (SINGRAULI)
ANNUAL SPREADSHEET RECONCILIATION SHEET - FY 2023-24
Total Production: 141.52 MT (Target: 139.00 MT, +1.81%)
Total Offtake: 140.20 MT
Overburden Handled: 476.20 Million Cubic Metres
Jayant OCP: 26.50 MT (Target 25.00 MT) | OB: 82.4 MCM
Dudhichua OCP: 24.80 MT (Target 24.00 MT) | OB: 74.6 MCM
Nigahi OCP: 22.10 MT (Target 21.50 MT) | OB: 69.2 MCM
Khadia OCP: 16.20 MT (Target 16.00 MT) | OB: 58.1 MCM`
      }
    ],
    tables: [
      {
        id: 'tbl_ncl_01',
        title: 'NCL Major Opencast Projects Summary 2023-24',
        pageNumber: 1,
        confidence: 1.0,
        headers: ['Project Name', 'Target (MT)', 'Actual (MT)', 'Achievement (%)', 'OB Removal (MCM)', 'Stripping Ratio (m3/t)'],
        rows: [
          ['Jayant OCP', 25.00, 26.50, '106.0%', 82.40, 3.11],
          ['Dudhichua OCP', 24.00, 24.80, '103.3%', 74.60, 3.01],
          ['Nigahi OCP', 21.50, 22.10, '102.8%', 69.20, 3.13],
          ['Khadia OCP', 16.00, 16.20, '101.3%', 58.10, 3.59],
          ['Amlohri OCP', 15.00, 15.42, '102.8%', 54.30, 3.52],
          ['Bina OCP', 11.50, 11.60, '100.9%', 41.20, 3.55],
          ['Other Mines', 26.00, 24.90, '95.8%', 96.40, 3.87],
          ['Total NCL', 139.00, 141.52, '101.8%', 476.20, 3.37]
        ]
      }
    ],
    chunks: [
      {
        id: 'chk_ncl_01',
        pageNumber: 1,
        confidence: 1.0,
        sectionTitle: 'NCL Production Performance',
        content: 'NCL exceeded target in FY 2023-24 with 141.52 MT vs 139.00 MT target. Jayant produced 26.50 MT with OB of 82.40 MCM and Dudhichua produced 24.80 MT with OB of 74.60 MCM.'
      }
    ],
    entities: [
      {
        id: 'ent_ncl_01',
        documentId: 'doc_ncl_singrauli_2024',
        pageNumber: 1,
        entityType: 'achieved_production',
        entityKey: 'Jayant OCP Production',
        entityValue: 26.50,
        unit: 'MT',
        normalizedValue: 26.50,
        normalizedUnit: 'MT',
        sourceText: 'Jayant OCP Actual: 26.50 MT',
        sourceTable: 'tbl_ncl_01',
        extractionMethod: 'STRUCTURED_CSV',
        confidence: 1.0,
        validationStatus: 'APPROVED',
        timestamp: '2024-04-05T08:11:00Z'
      },
      {
        id: 'ent_ncl_02',
        documentId: 'doc_ncl_singrauli_2024',
        pageNumber: 1,
        entityType: 'achieved_production',
        entityKey: 'Dudhichua OCP Production',
        entityValue: 24.80,
        unit: 'MT',
        normalizedValue: 24.80,
        normalizedUnit: 'MT',
        sourceText: 'Dudhichua OCP Actual: 24.80 MT',
        sourceTable: 'tbl_ncl_01',
        extractionMethod: 'STRUCTURED_CSV',
        confidence: 1.0,
        validationStatus: 'APPROVED',
        timestamp: '2024-04-05T08:11:00Z'
      }
    ]
  },
  {
    id: 'doc_parl_starred_412',
    title: 'Ministry of Coal - Lok Sabha Starred Question No. 412: Domestic Coal Production & Import Substitution',
    filename: 'Ministry_Parliamentary_Question_LokSabha_Starred_412.pdf',
    fileHash: 'sha256_110293fae881023d',
    fileType: 'pdf',
    fileSize: 1420000,
    subsidiary: 'Ministry of Coal',
    coalfield: 'National Aggregate',
    reportingYear: 2023,
    docType: 'PARLIAMENTARY_INQUIRY',
    status: 'VALIDATED',
    isScanned: false,
    pageCount: 8,
    uploadedAt: '2023-12-14T16:00:00Z',
    processedAt: '2023-12-14T16:02:40Z',
    tags: ['Parliament', 'Lok Sabha', 'Import Substitution', 'Ministry of Coal', 'High Priority'],
    summary: 'Ministerial statement responding to parliamentary inquiries regarding 1 Billion Tonne production target, thermal coal stock levels at power utilities, and reduction in imported coal blending.',
    pages: [
      {
        pageNumber: 1,
        ocrConfidence: 0.99,
        isScanned: false,
        rawText: `GOVERNMENT OF INDIA, MINISTRY OF COAL
LOK SABHA STARRED QUESTION NO. 412
TO BE ANSWERED ON 13.12.2023
QUESTION:
Will the Minister of COAL be pleased to state:
(a) The total domestic coal production during the last three years (2020-21 to 2022-23);
(b) The steps taken to augment underground coal production and modernize legacy equipment;
(c) The strategy to eliminate substitutable thermal coal imports by 2025-26?

ANSWER:
MINISTER OF COAL, MINES AND PARLIAMENTARY AFFAIRS
(a) Total domestic coal production:
- 2020-21: 716.08 MT (CIL: 596.22 MT)
- 2021-22: 778.19 MT (CIL: 622.63 MT)
- 2022-23: 893.19 MT (CIL: 703.21 MT)
Growth in FY 2022-23 over previous year was 14.77%.
(b) Mission Underground 100 MT launched by CIL targeting 100 MT from underground mines by 2030 through mass production technology, Continuous Miners (CM), and Longwall equipment in ECL, BCCL, and SECL.
(c) Domestic blending mandated to increase; non-coking coal imports for power sector declined from 69 MT in 2019-20 to 35 MT in 2022-23.`
      }
    ],
    tables: [
      {
        id: 'tbl_parl_01',
        title: '3-Year All-India Domestic Coal Production Trend (Lok Sabha Q412)',
        pageNumber: 1,
        confidence: 0.99,
        headers: ['Financial Year', 'Total India Production (MT)', 'Coal India Ltd (MT)', 'SCCL (MT)', 'Captive/Others (MT)'],
        rows: [
          ['2020-21', 716.08, 596.22, 50.58, 69.28],
          ['2021-22', 778.19, 622.63, 65.02, 90.54],
          ['2022-23', 893.19, 703.21, 67.14, 122.84]
        ]
      }
    ],
    chunks: [
      {
        id: 'chk_parl_01',
        pageNumber: 1,
        confidence: 0.99,
        sectionTitle: 'Parliamentary Production Statistics',
        content: 'In response to Lok Sabha Question 412, Ministry reported domestic coal production rose from 716.08 MT in 2020-21 to 893.19 MT in 2022-23, with Coal India contributing 703.21 MT in 2022-23.'
      }
    ],
    entities: [
      {
        id: 'ent_parl_01',
        documentId: 'doc_parl_starred_412',
        pageNumber: 1,
        entityType: 'achieved_production',
        entityKey: 'India Total Coal Production 2022-23',
        entityValue: 893.19,
        unit: 'MT',
        normalizedValue: 893.19,
        normalizedUnit: 'MT',
        sourceText: '2022-23: 893.19 MT (CIL: 703.21 MT)',
        sourceTable: 'tbl_parl_01',
        extractionMethod: 'TABULAR_PARSER',
        confidence: 0.99,
        validationStatus: 'APPROVED',
        timestamp: '2023-12-14T16:02:00Z'
      }
    ]
  },
  {
    id: 'doc_wcl_safety_2023',
    title: 'WCL Pench & Wardha Valley Mines - Slope Monitoring Radar & Highwall Stability Audit',
    filename: 'WCL_Pench_Kanhan_Slope_Stability_Safety_2023.pdf',
    fileHash: 'sha256_9941a9bc019a33bc',
    fileType: 'pdf',
    fileSize: 2210000,
    subsidiary: 'WCL',
    mineName: 'Umrer OCP',
    coalfield: 'Wardha Valley Coalfield',
    reportingYear: 2023,
    docType: 'SAFETY_COMPLIANCE_DOSSIER',
    status: 'VALIDATED',
    isScanned: false,
    pageCount: 18,
    uploadedAt: '2023-09-10T12:00:00Z',
    processedAt: '2023-09-10T12:03:15Z',
    tags: ['WCL', 'Safety', 'Slope Stability', 'Radar', 'Monsoon Risk', 'Umrer'],
    summary: 'Geotechnical monitoring across deep opencast highwalls exceeding 120m depth. Deployed real-time GroundProbe Slope Stability Radar (SSR) preventing two major bench failures during heavy monsoon precipitation.',
    pages: [
      {
        pageNumber: 1,
        ocrConfidence: 0.97,
        isScanned: false,
        rawText: `WESTERN COALFIELDS LIMITED - DIRECTORATE OF SAFETY & ENVIRONMENT
ANNUAL HIGHWALL STABILITY & GEOTECHNICAL COMPLIANCE DOSSIER
Key Site: Umrer Opencast Mine (Bench Height: 15m, Slope Angle: 42 degrees).
Groundwater seepage along faulted sandstone contact created acute instability in Sector 3 East.
Slope Monitoring Radar recorded displacement rate of 4.2 mm/hr on 18th July 2023. Timely alert triggered evacuation of 4 shovels and 12 dumpers 30 minutes prior to a 45,000 m3 bench slide. Zero casualties.`
      }
    ],
    tables: [
      {
        id: 'tbl_wcl_01',
        title: 'Geotechnical Slope Alerts & Sensor Thresholds (Umrer OCP)',
        pageNumber: 1,
        confidence: 0.97,
        headers: ['Location', 'Instrument Type', 'Trigger Displacement', 'Action Taken', 'Incident Outcome'],
        rows: [
          ['Sector 3 East', 'GroundProbe SSR', '4.2 mm/hr', 'Pit evacuated immediately', '45,000 m3 slide, zero loss'],
          ['Bench 4 North', 'In-place Inclinometer', '0.8 mm/day', 'Tension crack grouted', 'Slope stabilized'],
          ['West Highwall', 'Piezometer Array', 'Pore pressure > 1.2 MPa', 'Dewatering boreholes drilled', 'Pressure normalized']
        ]
      }
    ],
    chunks: [
      {
        id: 'chk_wcl_01',
        pageNumber: 1,
        confidence: 0.97,
        sectionTitle: 'Slope Stability Monitoring',
        content: 'At WCL Umrer OCP, Slope Monitoring Radar detected 4.2 mm/hr movement on 18 July 2023, enabling evacuation before a 45,000 m3 bench failure occurred with zero casualties.'
      }
    ],
    entities: [
      {
        id: 'ent_wcl_01',
        documentId: 'doc_wcl_safety_2023',
        pageNumber: 1,
        entityType: 'safety_incident',
        entityKey: 'Umrer Slope Movement Alert',
        entityValue: '4.2 mm/hr evacuation successful',
        sourceText: 'Slope Monitoring Radar recorded displacement rate of 4.2 mm/hr',
        extractionMethod: 'OCR_REGEX',
        confidence: 0.95,
        validationStatus: 'APPROVED',
        timestamp: '2023-09-10T12:03:00Z'
      }
    ]
  },
  {
    id: 'doc_mcl_belpahar_2024',
    title: 'MCL Belpahar Opencast Expansion & Coal Evacuation Logistics 2023-24',
    filename: 'MCL_Belpahar_IbValley_Expansion_2024.pdf',
    fileHash: 'sha256_fa8762410a8d7992',
    fileType: 'pdf',
    fileSize: 3450000,
    subsidiary: 'MCL',
    mineName: 'Belpahar OCP',
    coalfield: 'Ib Valley Coalfield',
    reportingYear: 2024,
    docType: 'ANNUAL_REPORT',
    status: 'VALIDATED',
    isScanned: false,
    pageCount: 22,
    uploadedAt: '2024-05-02T15:20:00Z',
    processedAt: '2024-05-02T15:23:45Z',
    tags: ['MCL', 'Ib Valley', 'Belpahar', 'Railway Siding', 'Dispatch', 'Logistics'],
    summary: 'Belpahar OCP achieved 12.40 MT production (+8.7% YoY). Highlighted railway rake availability bottlenecks at Jharsuguda junction where 14 rake delays impacted pithead coal evacuation during peak power demand in May-June.',
    pages: [
      {
        pageNumber: 1,
        ocrConfidence: 0.98,
        isScanned: false,
        rawText: `MAHANADI COALFIELDS LIMITED - IB VALLEY AREA
BELPAHAR OPENCAST PROJECT ANNUAL AUDIT FY 2023-24
Operational Highlights:
Raw Coal Output: 12.40 MT against annual target of 12.00 MT (103.3%).
Dispatch: 11.85 MT (Rail: 9.20 MT, MGR: 1.65 MT, Road: 1.00 MT).
Overburden Handled: 18.4 MCM. Stripping Ratio: 1.48 m3/t.
Rail evacuation capacity constrained by single line block between Belpahar and Brajrajnagar sidings, leading to 1.8 MT pithead inventory build-up by end of Q2.`
      }
    ],
    tables: [
      {
        id: 'tbl_mcl_01',
        title: 'Belpahar OCP Production & Evacuation Logistics (FY24)',
        pageNumber: 1,
        confidence: 0.98,
        headers: ['Quarter', 'Coal Produced (MT)', 'Rail Dispatch (MT)', 'Pithead Stock (MT)', 'Rake Indented', 'Rake Supplied'],
        rows: [
          ['Q1 (Apr-Jun)', 3.10, 2.70, 1.40, 720, 642],
          ['Q2 (Jul-Sep)', 2.40, 2.10, 1.80, 580, 510],
          ['Q3 (Oct-Dec)', 3.40, 3.25, 1.10, 840, 812],
          ['Q4 (Jan-Mar)', 3.50, 3.80, 0.55, 910, 902],
          ['Total FY24', 12.40, 11.85, 0.55, 3050, 2866]
        ]
      }
    ],
    chunks: [
      {
        id: 'chk_mcl_01',
        pageNumber: 1,
        confidence: 0.98,
        sectionTitle: 'Belpahar Production & Evacuation',
        content: 'Belpahar OCP reached 12.40 MT production in FY 2023-24 (target 12.00 MT). Rail dispatch stood at 11.85 MT, with rake supply deficit causing 1.8 MT pithead stockpile during Q2.'
      }
    ],
    entities: [
      {
        id: 'ent_mcl_01',
        documentId: 'doc_mcl_belpahar_2024',
        pageNumber: 1,
        entityType: 'achieved_production',
        entityKey: 'Belpahar OCP Production',
        entityValue: 12.40,
        unit: 'MT',
        normalizedValue: 12.40,
        normalizedUnit: 'MT',
        sourceText: 'Raw Coal Output: 12.40 MT against annual target of 12.00 MT',
        sourceTable: 'tbl_mcl_01',
        extractionMethod: 'STRUCTURED_CSV',
        confidence: 0.98,
        validationStatus: 'APPROVED',
        timestamp: '2024-05-02T15:23:00Z'
      }
    ]
  },
  {
    id: 'doc_ccl_karanpura_2021',
    title: 'CCL North Karanpura Coalfield - Ashok & Piparwar Geological Exploration & Coal Reserve Assessment',
    filename: 'CCL_Bokaro_Karanpura_Geological_Assessment_2021.pdf',
    fileHash: 'sha256_71a0b3882f091c78',
    fileType: 'pdf',
    fileSize: 4120000,
    subsidiary: 'CCL',
    mineName: 'Ashok OCP',
    coalfield: 'North Karanpura Coalfield',
    reportingYear: 2021,
    docType: 'GEOLOGICAL_ASSESSMENT',
    status: 'VALIDATED',
    isScanned: false,
    pageCount: 30,
    uploadedAt: '2021-12-10T14:00:00Z',
    processedAt: '2021-12-10T14:04:10Z',
    tags: ['CCL', 'North Karanpura', 'Ashok OCP', 'Borehole', 'Reserves', 'Piparwar'],
    summary: 'Detailed assessment of Dakra-Bukru-Ashok block. Thick seam opencast potential (Dakra Seam 14.5m average thickness). Total proved reserves calculated at 480 MT with low stripping ratio of 1.62 m3/t, G11 grade thermal coal.',
    pages: [
      {
        pageNumber: 1,
        ocrConfidence: 0.99,
        isScanned: false,
        rawText: `CENTRAL COALFIELDS LIMITED & CMPDI RI-III RANCHI
GEOLOGICAL RESOURCE APPRAISAL: ASHOK OCP EXPANSION BLOCK
Location: North Karanpura Basin, Chatra & Ranchi Districts, Jharkhand.
Boreholes Drilled: 64 Core boreholes.
Proved Reserves: 480.00 MT. Indicated Reserves: 140.00 MT.
Average Stripping Ratio: 1.62 m3/t. Seam Dakra Main: 14.5m thick, clean parting.`
      }
    ],
    tables: [
      {
        id: 'tbl_ccl_01',
        title: 'Ashok OCP Seam & Reserve Summary',
        pageNumber: 1,
        confidence: 0.99,
        headers: ['Seam', 'Avg Thickness (m)', 'Specific Gravity', 'Gross Caloric Value (kcal/kg)', 'Proved Reserves (MT)'],
        rows: [
          ['Dakra Main', 14.5, 1.48, '3,850 - 4,200 (G11)', 310.0],
          ['Bukru Upper', 6.2, 1.52, '3,500 - 3,800 (G12)', 110.0],
          ['Bukru Lower', 4.1, 1.55, '3,200 - 3,500 (G13)', 60.0],
          ['Total', 24.8, '-', '-', 480.0]
        ]
      }
    ],
    chunks: [
      {
        id: 'chk_ccl_01',
        pageNumber: 1,
        confidence: 0.99,
        sectionTitle: 'Ashok Geological Reserves',
        content: 'Ashok OCP expansion block contains 480 MT proved coal reserves across Dakra Main and Bukru seams with 1.62 m3/t average stripping ratio and G11-G13 grade.'
      }
    ],
    entities: [
      {
        id: 'ent_ccl_01',
        documentId: 'doc_ccl_karanpura_2021',
        pageNumber: 1,
        entityType: 'geological_reserves',
        entityKey: 'Ashok Block Proved Reserves',
        entityValue: 480.0,
        unit: 'MT',
        normalizedValue: 480.0,
        normalizedUnit: 'MT',
        sourceText: 'Proved Reserves: 480.00 MT',
        sourceTable: 'tbl_ccl_01',
        extractionMethod: 'STRUCTURED_CSV',
        confidence: 0.99,
        validationStatus: 'APPROVED',
        timestamp: '2021-12-10T14:04:00Z'
      }
    ]
  }
];

export const STRUCTURED_PRODUCTION_RECORDS: ProductionRecord[] = [
  // 2024
  {
    id: 'pr_2024_cil',
    documentId: 'doc_cil_ann_2024',
    pageNumber: 1,
    subsidiary: 'CIL Consolidated',
    mineName: 'All Mines Combined',
    coalfield: 'National',
    year: 2024,
    targetProductionMt: 780.00,
    achievedProductionMt: 773.60,
    achievementPercentage: 99.18,
    dispatchMt: 753.50,
    overburdenRemovalMcm: 1960.50,
    strippingRatio: 2.53,
    productivityOms: 12.8,
    confidence: 0.99,
    validationStatus: 'VERIFIED'
  },
  {
    id: 'pr_2024_mcl',
    documentId: 'doc_cil_ann_2024',
    pageNumber: 14,
    subsidiary: 'MCL',
    mineName: 'All MCL Mines',
    coalfield: 'Talcher / Ib Valley',
    year: 2024,
    targetProductionMt: 204.00,
    achievedProductionMt: 206.10,
    achievementPercentage: 101.03,
    dispatchMt: 195.50,
    overburdenRemovalMcm: 298.00,
    strippingRatio: 1.45,
    productivityOms: 22.4,
    confidence: 0.98,
    validationStatus: 'VERIFIED'
  },
  {
    id: 'pr_2024_secl',
    documentId: 'doc_cil_ann_2024',
    pageNumber: 14,
    subsidiary: 'SECL',
    mineName: 'All SECL Mines',
    coalfield: 'Korba / Mand-Raigarh',
    year: 2024,
    targetProductionMt: 197.00,
    achievedProductionMt: 187.00,
    achievementPercentage: 94.92,
    dispatchMt: 183.40,
    overburdenRemovalMcm: 328.00,
    strippingRatio: 1.75,
    productivityOms: 16.5,
    confidence: 0.98,
    validationStatus: 'VERIFIED'
  },
  {
    id: 'pr_2024_ncl',
    documentId: 'doc_ncl_singrauli_2024',
    pageNumber: 1,
    subsidiary: 'NCL',
    mineName: 'All NCL Mines',
    coalfield: 'Singrauli Coalfield',
    year: 2024,
    targetProductionMt: 139.00,
    achievedProductionMt: 141.52,
    achievementPercentage: 101.81,
    dispatchMt: 140.20,
    overburdenRemovalMcm: 476.20,
    strippingRatio: 3.37,
    productivityOms: 18.2,
    confidence: 1.0,
    validationStatus: 'VERIFIED'
  },
  {
    id: 'pr_2024_jayant',
    documentId: 'doc_ncl_singrauli_2024',
    pageNumber: 1,
    subsidiary: 'NCL',
    mineName: 'Jayant OCP',
    coalfield: 'Singrauli Coalfield',
    year: 2024,
    targetProductionMt: 25.00,
    achievedProductionMt: 26.50,
    achievementPercentage: 106.00,
    dispatchMt: 26.10,
    overburdenRemovalMcm: 82.40,
    strippingRatio: 3.11,
    productivityOms: 19.4,
    confidence: 1.0,
    validationStatus: 'VERIFIED'
  },
  {
    id: 'pr_2024_dudhichua',
    documentId: 'doc_ncl_singrauli_2024',
    pageNumber: 1,
    subsidiary: 'NCL',
    mineName: 'Dudhichua OCP',
    coalfield: 'Singrauli Coalfield',
    year: 2024,
    targetProductionMt: 24.00,
    achievedProductionMt: 24.80,
    achievementPercentage: 103.33,
    dispatchMt: 24.50,
    overburdenRemovalMcm: 74.60,
    strippingRatio: 3.01,
    productivityOms: 18.9,
    confidence: 1.0,
    validationStatus: 'VERIFIED'
  },
  {
    id: 'pr_2024_ccl',
    documentId: 'doc_cil_ann_2024',
    pageNumber: 14,
    subsidiary: 'CCL',
    mineName: 'All CCL Mines',
    coalfield: 'North Karanpura / Bokaro',
    year: 2024,
    targetProductionMt: 84.00,
    achievedProductionMt: 86.05,
    achievementPercentage: 102.44,
    dispatchMt: 84.20,
    overburdenRemovalMcm: 224.80,
    strippingRatio: 2.61,
    productivityOms: 11.2,
    confidence: 0.98,
    validationStatus: 'VERIFIED'
  },
  {
    id: 'pr_2024_wcl',
    documentId: 'doc_cil_ann_2024',
    pageNumber: 14,
    subsidiary: 'WCL',
    mineName: 'All WCL Mines',
    coalfield: 'Wardha Valley / Pench',
    year: 2024,
    targetProductionMt: 67.00,
    achievedProductionMt: 67.85,
    achievementPercentage: 101.27,
    dispatchMt: 66.90,
    overburdenRemovalMcm: 312.50,
    strippingRatio: 4.61,
    productivityOms: 7.8,
    confidence: 0.98,
    validationStatus: 'VERIFIED'
  },
  {
    id: 'pr_2024_bccl',
    documentId: 'doc_cil_ann_2024',
    pageNumber: 14,
    subsidiary: 'BCCL',
    mineName: 'All BCCL Mines',
    coalfield: 'Jharia Coalfield',
    year: 2024,
    targetProductionMt: 41.00,
    achievedProductionMt: 41.10,
    achievementPercentage: 100.24,
    dispatchMt: 40.15,
    overburdenRemovalMcm: 168.40,
    strippingRatio: 4.10,
    productivityOms: 5.4,
    confidence: 0.98,
    validationStatus: 'VERIFIED'
  },
  {
    id: 'pr_2024_ecl',
    documentId: 'doc_cil_ann_2024',
    pageNumber: 14,
    subsidiary: 'ECL',
    mineName: 'All ECL Mines',
    coalfield: 'Raniganj Coalfield',
    year: 2024,
    targetProductionMt: 39.50,
    achievedProductionMt: 38.12,
    achievementPercentage: 96.51,
    dispatchMt: 37.40,
    overburdenRemovalMcm: 142.60,
    strippingRatio: 3.74,
    productivityOms: 4.9,
    confidence: 0.98,
    validationStatus: 'VERIFIED'
  },
  {
    id: 'pr_2024_belpahar',
    documentId: 'doc_mcl_belpahar_2024',
    pageNumber: 1,
    subsidiary: 'MCL',
    mineName: 'Belpahar OCP',
    coalfield: 'Ib Valley Coalfield',
    year: 2024,
    targetProductionMt: 12.00,
    achievedProductionMt: 12.40,
    achievementPercentage: 103.33,
    dispatchMt: 11.85,
    overburdenRemovalMcm: 18.40,
    strippingRatio: 1.48,
    productivityOms: 14.6,
    confidence: 0.98,
    validationStatus: 'VERIFIED'
  },

  // 2023
  {
    id: 'pr_2023_cil',
    documentId: 'doc_cil_ann_2024',
    pageNumber: 1,
    subsidiary: 'CIL Consolidated',
    mineName: 'All Mines Combined',
    coalfield: 'National',
    year: 2023,
    targetProductionMt: 700.00,
    achievedProductionMt: 703.21,
    achievementPercentage: 100.46,
    dispatchMt: 694.70,
    overburdenRemovalMcm: 1654.80,
    strippingRatio: 2.35,
    productivityOms: 11.4,
    confidence: 0.99,
    validationStatus: 'VERIFIED'
  },
  {
    id: 'pr_2023_gevra',
    documentId: 'doc_secl_gevra_2023',
    pageNumber: 1,
    subsidiary: 'SECL',
    mineName: 'Gevra Mega OC',
    coalfield: 'Korba Coalfield',
    year: 2023,
    targetProductionMt: 52.00,
    achievedProductionMt: 50.80,
    achievementPercentage: 97.69,
    dispatchMt: 50.40,
    overburdenRemovalMcm: 58.20,
    strippingRatio: 1.14,
    productivityOms: 28.5,
    confidence: 0.92,
    validationStatus: 'CONFLICT' // Flagged for review against draft 52.5 MT
  },
  {
    id: 'pr_2023_kusmunda',
    documentId: 'doc_secl_gevra_2023',
    pageNumber: 7,
    subsidiary: 'SECL',
    mineName: 'Kusmunda OC',
    coalfield: 'Korba Coalfield',
    year: 2023,
    targetProductionMt: 42.00,
    achievedProductionMt: 43.15,
    achievementPercentage: 102.74,
    dispatchMt: 42.80,
    overburdenRemovalMcm: 62.40,
    strippingRatio: 1.45,
    productivityOms: 22.1,
    confidence: 0.94,
    validationStatus: 'VERIFIED'
  },
  {
    id: 'pr_2023_moonidih',
    documentId: 'doc_bccl_moonidih_2023',
    pageNumber: 1,
    subsidiary: 'BCCL',
    mineName: 'Moonidih Underground Project',
    coalfield: 'Jharia Coalfield',
    year: 2023,
    targetProductionMt: 1.20,
    achievedProductionMt: 0.94,
    achievementPercentage: 78.33,
    dispatchMt: 0.91,
    overburdenRemovalMcm: 0.00, // Underground mine
    strippingRatio: 0.00,
    productivityOms: 2.45,
    confidence: 0.90,
    validationStatus: 'VERIFIED'
  },

  // 2022
  {
    id: 'pr_2022_cil',
    documentId: 'doc_parl_starred_412',
    pageNumber: 1,
    subsidiary: 'CIL Consolidated',
    mineName: 'All Mines Combined',
    coalfield: 'National',
    year: 2022,
    targetProductionMt: 670.00,
    achievedProductionMt: 622.63,
    achievementPercentage: 92.93,
    dispatchMt: 661.90,
    overburdenRemovalMcm: 1362.40,
    strippingRatio: 2.19,
    productivityOms: 10.2,
    confidence: 0.99,
    validationStatus: 'VERIFIED'
  },
  {
    id: 'pr_2022_gevra',
    documentId: 'doc_secl_gevra_2023',
    pageNumber: 1,
    subsidiary: 'SECL',
    mineName: 'Gevra Mega OC',
    coalfield: 'Korba Coalfield',
    year: 2022,
    targetProductionMt: 48.00,
    achievedProductionMt: 49.12,
    achievementPercentage: 102.33,
    dispatchMt: 48.90,
    overburdenRemovalMcm: 54.10,
    strippingRatio: 1.10,
    productivityOms: 26.2,
    confidence: 0.95,
    validationStatus: 'VERIFIED'
  },
  {
    id: 'pr_2022_jayant',
    documentId: 'doc_ncl_singrauli_2024',
    pageNumber: 1,
    subsidiary: 'NCL',
    mineName: 'Jayant OCP',
    coalfield: 'Singrauli Coalfield',
    year: 2022,
    targetProductionMt: 22.50,
    achievedProductionMt: 23.40,
    achievementPercentage: 104.00,
    dispatchMt: 23.10,
    overburdenRemovalMcm: 72.80,
    strippingRatio: 3.11,
    productivityOms: 17.8,
    confidence: 0.98,
    validationStatus: 'VERIFIED'
  },

  // 2021
  {
    id: 'pr_2021_cil',
    documentId: 'doc_parl_starred_412',
    pageNumber: 1,
    subsidiary: 'CIL Consolidated',
    mineName: 'All Mines Combined',
    coalfield: 'National',
    year: 2021,
    targetProductionMt: 660.00,
    achievedProductionMt: 596.22,
    achievementPercentage: 90.34,
    dispatchMt: 574.50,
    overburdenRemovalMcm: 1344.00,
    strippingRatio: 2.25,
    productivityOms: 9.6,
    confidence: 0.99,
    validationStatus: 'VERIFIED'
  },
  {
    id: 'pr_2021_gevra',
    documentId: 'doc_secl_gevra_2023',
    pageNumber: 1,
    subsidiary: 'SECL',
    mineName: 'Gevra Mega OC',
    coalfield: 'Korba Coalfield',
    year: 2021,
    targetProductionMt: 45.00,
    achievedProductionMt: 46.20,
    achievementPercentage: 102.67,
    dispatchMt: 45.80,
    overburdenRemovalMcm: 51.00,
    strippingRatio: 1.10,
    productivityOms: 24.5,
    confidence: 0.95,
    validationStatus: 'VERIFIED'
  },

  // 2020
  {
    id: 'pr_2020_cil',
    documentId: 'doc_parl_starred_412',
    pageNumber: 1,
    subsidiary: 'CIL Consolidated',
    mineName: 'All Mines Combined',
    coalfield: 'National',
    year: 2020,
    targetProductionMt: 660.00,
    achievedProductionMt: 602.14,
    achievementPercentage: 91.23,
    dispatchMt: 581.40,
    overburdenRemovalMcm: 1154.00,
    strippingRatio: 1.92,
    productivityOms: 9.1,
    confidence: 0.98,
    validationStatus: 'VERIFIED'
  }
];

export const STRUCTURED_GEOLOGICAL_RECORDS: GeologicalRecord[] = [
  {
    id: 'geo_talcher_seam2',
    documentId: 'doc_cmpdi_talcher_2022',
    pageNumber: 18,
    subsidiary: 'MCL / CMPDI',
    coalfield: 'Talcher Coalfield',
    blockName: 'Talcher Barakar Seam II Block',
    provenReservesMt: 6400.0,
    indicatedReservesMt: 2800.0,
    inferredReservesMt: 1200.0,
    totalReservesMt: 10400.0,
    coalGrade: 'G11 - G13',
    avgSeamThicknessM: 18.6,
    gasDrainagePotential: 'LOW',
    confidence: 0.98
  },
  {
    id: 'geo_ashok_block',
    documentId: 'doc_ccl_karanpura_2021',
    pageNumber: 1,
    subsidiary: 'CCL / CMPDI',
    coalfield: 'North Karanpura Coalfield',
    blockName: 'Ashok OCP Expansion Block',
    provenReservesMt: 480.0,
    indicatedReservesMt: 140.0,
    inferredReservesMt: 80.0,
    totalReservesMt: 700.0,
    coalGrade: 'G11 (Non-coking thermal)',
    avgSeamThicknessM: 14.5,
    gasDrainagePotential: 'LOW',
    confidence: 0.99
  },
  {
    id: 'geo_moonidih_deep',
    documentId: 'doc_bccl_moonidih_2023',
    pageNumber: 1,
    subsidiary: 'BCCL / CMPDI',
    coalfield: 'Jharia Coalfield',
    blockName: 'Moonidih Deep Seam XVI-XVII',
    provenReservesMt: 124.0,
    indicatedReservesMt: 65.0,
    inferredReservesMt: 42.0,
    totalReservesMt: 231.0,
    coalGrade: 'Steel Grade-I Prime Coking Coal',
    avgSeamThicknessM: 3.8,
    gasDrainagePotential: 'HIGH',
    confidence: 0.92
  }
];

export const TOPIC_ITEMS: TopicItem[] = [
  {
    id: 'top_01',
    topic: 'Overburden Removal & Stripping Ratio Optimization',
    description: 'Management of massive overburden rock excavation (1,960 MCM) in deep opencast mines and highwall bench stabilization.',
    frequency: 184,
    trend: 'INCREASING',
    growthPercentage: 24.5,
    keywords: ['overburden', 'stripping ratio', 'dumpers', 'shovels', 'bench slide', 'MCM', 'highwall'],
    documentCount: 6,
    relatedDocIds: ['doc_cil_ann_2024', 'doc_secl_gevra_2023', 'doc_ncl_singrauli_2024', 'doc_wcl_safety_2023']
  },
  {
    id: 'top_02',
    topic: 'First Mile Connectivity & Rail Evacuation Bottlenecks',
    description: 'Mechanized conveyor CHP systems and railway rake shortages at critical coalfield junctions impacting power plant dispatches.',
    frequency: 156,
    trend: 'INCREASING',
    growthPercentage: 32.0,
    keywords: ['evacuation', 'first mile connectivity', 'rail siding', 'rakes', 'dispatch', 'CHP', 'stockpile'],
    documentCount: 5,
    relatedDocIds: ['doc_cil_ann_2024', 'doc_mcl_belpahar_2024', 'doc_ncl_singrauli_2024']
  },
  {
    id: 'top_03',
    topic: 'Deep Underground Methane & Degree-III Gas Drainage',
    description: 'Drainage and pre-degasification of hazardous methane in deep seams (e.g. Moonidih) for safety and clean energy capture.',
    frequency: 98,
    trend: 'STABLE',
    growthPercentage: 6.2,
    keywords: ['methane drainage', 'Degree-III', 'ventilation', 'gas emission', 'degasification', 'safety'],
    documentCount: 3,
    relatedDocIds: ['doc_bccl_moonidih_2023']
  },
  {
    id: 'top_04',
    topic: 'Geotechnical Slope Radar & Monsoon Disaster Prevention',
    description: 'Continuous radar tracking of bench displacements and inclinometer monitoring in deep pits exceeding 120m.',
    frequency: 72,
    trend: 'INCREASING',
    growthPercentage: 18.4,
    keywords: ['radar', 'slope stability', 'displacement', 'bench failure', 'piezometer', 'monsoon risk'],
    documentCount: 3,
    relatedDocIds: ['doc_wcl_safety_2023', 'doc_secl_gevra_2023']
  },
  {
    id: 'top_05',
    topic: 'Prime Coking Coal Beneficiation for Domestic Steel Plants',
    description: 'Washing low-volatile prime coking coal to under 18% ash to substitute imported Australian coking coal for SAIL.',
    frequency: 64,
    trend: 'INCREASING',
    growthPercentage: 15.1,
    keywords: ['coking coal', 'washery', 'beneficiation', 'steel plant', 'SAIL', 'ash percentage', 'import substitution'],
    documentCount: 4,
    relatedDocIds: ['doc_bccl_moonidih_2023', 'doc_parl_starred_412']
  },
  {
    id: 'top_06',
    topic: 'CMPDI Exploration Drilling & Borehole Seam Correlation',
    description: 'Core drilling of Barakar and Karharbari formations to upgrade Indicated resources to Proved categories.',
    frequency: 59,
    trend: 'STABLE',
    growthPercentage: 4.8,
    keywords: ['borehole', 'drilling', 'proved reserves', 'Karharbari', 'Barakar', 'seam thickness', 'CMPDI'],
    documentCount: 4,
    relatedDocIds: ['doc_cmpdi_talcher_2022', 'doc_ccl_karanpura_2021']
  }
];

export const WORD_CLOUD_ITEMS: WordCloudItem[] = [
  { text: 'Production', value: 95, category: 'production', docCount: 8 },
  { text: 'Overburden', value: 88, category: 'equipment', docCount: 7 },
  { text: 'Dispatch', value: 82, category: 'production', docCount: 8 },
  { text: 'Gevra', value: 76, category: 'subsidiary', docCount: 5 },
  { text: 'Talcher', value: 71, category: 'geology', docCount: 4 },
  { text: 'SECL', value: 68, category: 'subsidiary', docCount: 6 },
  { text: 'MCL', value: 66, category: 'subsidiary', docCount: 6 },
  { text: 'NCL', value: 64, category: 'subsidiary', docCount: 5 },
  { text: 'Stripping Ratio', value: 60, category: 'production', docCount: 6 },
  { text: 'Borehole', value: 58, category: 'geology', docCount: 4 },
  { text: 'Proved Reserves', value: 55, category: 'geology', docCount: 4 },
  { text: 'Methane Drainage', value: 52, category: 'safety', docCount: 3 },
  { text: 'Slope Stability', value: 50, category: 'safety', docCount: 3 },
  { text: 'Coking Coal', value: 48, category: 'geology', docCount: 4 },
  { text: 'Moonidih', value: 45, category: 'subsidiary', docCount: 3 },
  { text: 'Jayant OCP', value: 44, category: 'subsidiary', docCount: 4 },
  { text: 'Longwall', value: 42, category: 'equipment', docCount: 3 },
  { text: 'Radar SSR', value: 40, category: 'safety', docCount: 2 },
  { text: 'Barakar Seam', value: 38, category: 'geology', docCount: 3 },
  { text: 'First Mile Connectivity', value: 36, category: 'production', docCount: 4 },
  { text: 'Import Substitution', value: 35, category: 'general', docCount: 3 },
  { text: 'Parliament Starred Q', value: 32, category: 'general', docCount: 2 },
  { text: 'CMPDI Regional Inst', value: 30, category: 'geology', docCount: 3 }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud_01',
    timestamp: '2024-04-18T10:32:15Z',
    userId: 'usr_admin_01',
    userName: 'Dr. Rajeshwar Sharma',
    userRole: 'ADMIN',
    action: 'DOCUMENT_PROCESS',
    resourceType: 'DOCUMENT',
    resourceId: 'doc_cil_ann_2024',
    details: 'Processed CIL Annual Production Review 2023-24. Extracted 1 table, 2 text chunks, 2 verified entities.',
    ipAddress: '10.24.110.14',
    status: 'SUCCESS'
  },
  {
    id: 'aud_02',
    timestamp: '2024-04-18T11:05:22Z',
    userId: 'usr_analyst_01',
    userName: 'Ananya Sen',
    userRole: 'ANALYST',
    action: 'ENTITY_VALIDATION_APPROVE',
    resourceType: 'ENTITY',
    resourceId: 'ent_01',
    details: 'Approved CIL Total Raw Coal Production (773.60 MT) against audited statement.',
    ipAddress: '10.24.110.45',
    status: 'SUCCESS'
  },
  {
    id: 'aud_03',
    timestamp: '2023-05-12T14:20:10Z',
    userId: 'usr_admin_01',
    userName: 'Dr. Rajeshwar Sharma',
    userRole: 'ADMIN',
    action: 'DOCUMENT_PROCESS',
    resourceType: 'DOCUMENT',
    resourceId: 'doc_secl_gevra_2023',
    details: 'Flagged CONFLICT_REQUIRES_REVIEW on Gevra production: 52.5 MT field report vs 50.80 MT audited balance.',
    ipAddress: '10.24.110.14',
    status: 'WARNING'
  },
  {
    id: 'aud_04',
    timestamp: '2024-05-02T15:25:00Z',
    userId: 'usr_analyst_01',
    userName: 'Ananya Sen',
    userRole: 'ANALYST',
    action: 'NATURAL_QUERY',
    resourceType: 'QUERY',
    details: 'Query executed: "Compare Mine A and Mine B from 2020 to 2024" (Classified as HYBRID - SQL + RAG).',
    ipAddress: '10.24.110.45',
    status: 'SUCCESS'
  },
  {
    id: 'aud_05',
    timestamp: '2024-05-02T15:30:10Z',
    userId: 'usr_viewer_01',
    userName: 'Vikramaditya Roy',
    userRole: 'VIEWER',
    action: 'REPORT_EXPORT',
    resourceType: 'REPORT',
    resourceId: 'rep_demo_01',
    details: 'Exported Parliamentary Briefing Report to PDF for Ministry Review.',
    ipAddress: '10.200.4.88',
    status: 'SUCCESS'
  }
];

export const INITIAL_METRICS: PerformanceMetrics = {
  extractionAccuracy: 98.4,
  validationAccuracy: 99.1,
  automationPercentage: 87.2,
  timeReductionPercentage: 74.5,
  manualReportTimeHours: 14.5,
  automatedReportTimeSeconds: 12.4,
  averageQueryResponseTimeMs: 1140,
  citationAccuracyScore: 99.6,
  documentsProcessed: 10,
  pagesProcessed: 228,
  tablesExtracted: 34,
  structuredRecordsCount: 22,
  reportsGeneratedCount: 18,
  conflictsResolvedCount: 9
};

export const SAMPLE_QUESTIONS = [
  'What was the production of Mine A in 2022?',
  'Compare Mine A and Mine B from 2020 to 2024.',
  'Which mine had the highest production growth?',
  'What geological challenges were mentioned most frequently?',
  'What were the major mining issues in 2023?',
  'Summarize production trends from 2019 to 2024.',
  'Generate a production report for Mine A.',
  'Which reports contain information about equipment failure?',
  'What changed between the 2021 and 2023 reports?',
  'Show the evidence for the production figure.'
];
