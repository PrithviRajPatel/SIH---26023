-- ========================================================
-- GeoMine Intel: PostgreSQL Enterprise Schema (SIH26023)
-- Central Mine Planning & Design Institute / Coal India Ltd
-- ========================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users & Authentication
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('ADMIN', 'ANALYST', 'VIEWER')),
    designation VARCHAR(255),
    department VARCHAR(255),
    subsidiary VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Organizations & Subsidiaries
CREATE TABLE IF NOT EXISTS organizations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(32) UNIQUE NOT NULL,
    type VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subsidiaries (
    id VARCHAR(64) PRIMARY KEY,
    organization_id VARCHAR(64) REFERENCES organizations(id) ON DELETE SET NULL,
    code VARCHAR(32) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(128),
    headquarters VARCHAR(128)
);

-- 3. Documents & Versions
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(512) NOT NULL,
    original_filename VARCHAR(512) NOT NULL,
    storage_key VARCHAR(1024) NOT NULL,
    mime_type VARCHAR(128) NOT NULL,
    file_size BIGINT NOT NULL,
    file_hash VARCHAR(128) NOT NULL,
    subsidiary VARCHAR(128) NOT NULL,
    mine_name VARCHAR(255),
    coalfield VARCHAR(255),
    reporting_year INTEGER NOT NULL,
    doc_type VARCHAR(64) NOT NULL,
    status VARCHAR(64) NOT NULL DEFAULT 'UPLOADED',
    is_scanned BOOLEAN DEFAULT FALSE,
    page_count INTEGER DEFAULT 1,
    summary TEXT,
    tags TEXT, -- Comma-separated or JSON
    created_by VARCHAR(64),
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast filtering
CREATE INDEX IF NOT EXISTS idx_documents_sub ON documents(subsidiary);
CREATE INDEX IF NOT EXISTS idx_documents_year ON documents(reporting_year);
CREATE INDEX IF NOT EXISTS idx_documents_hash ON documents(file_hash);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);

-- 4. Document Pages
CREATE TABLE IF NOT EXISTS document_pages (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    raw_text TEXT NOT NULL,
    ocr_confidence REAL DEFAULT 0.98,
    is_scanned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_doc_pages_doc ON document_pages(document_id);

-- 5. Document Chunks & Embeddings (Vector RAG)
CREATE TABLE IF NOT EXISTS document_chunks (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    section_title VARCHAR(255),
    content TEXT NOT NULL,
    embedding_json TEXT, -- JSON vector float array
    confidence REAL DEFAULT 0.95,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_doc_chunks_doc ON document_chunks(document_id);

-- 6. Extracted Tables
CREATE TABLE IF NOT EXISTS document_tables (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    title VARCHAR(512),
    page_number INTEGER NOT NULL,
    headers_json TEXT NOT NULL,
    rows_json TEXT NOT NULL,
    confidence REAL DEFAULT 0.95,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_doc_tables_doc ON document_tables(document_id);

-- 7. Extracted Entities & Named Parameters
CREATE TABLE IF NOT EXISTS extracted_entities (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_key VARCHAR(255) NOT NULL,
    entity_value TEXT NOT NULL,
    unit VARCHAR(64),
    normalized_value DOUBLE PRECISION,
    normalized_unit VARCHAR(64),
    source_text TEXT,
    source_table VARCHAR(255),
    extraction_method VARCHAR(64) NOT NULL,
    confidence REAL NOT NULL,
    validation_status VARCHAR(64) NOT NULL DEFAULT 'PENDING',
    analyst_comment TEXT,
    updated_by VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_entities_doc ON extracted_entities(document_id);
CREATE INDEX IF NOT EXISTS idx_entities_status ON extracted_entities(validation_status);

-- 8. Structured Production Records (Relational SQL Source of Truth)
CREATE TABLE IF NOT EXISTS production_records (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) REFERENCES documents(id) ON DELETE CASCADE,
    page_number INTEGER DEFAULT 1,
    subsidiary VARCHAR(128) NOT NULL,
    mine_name VARCHAR(255) NOT NULL,
    coalfield VARCHAR(255),
    year INTEGER NOT NULL,
    month VARCHAR(32),
    target_production_mt DOUBLE PRECISION DEFAULT 0,
    achieved_production_mt DOUBLE PRECISION DEFAULT 0,
    achievement_percentage DOUBLE PRECISION DEFAULT 0,
    dispatch_mt DOUBLE PRECISION DEFAULT 0,
    overburden_removal_mcm DOUBLE PRECISION DEFAULT 0,
    stripping_ratio DOUBLE PRECISION DEFAULT 0,
    productivity_oms DOUBLE PRECISION DEFAULT 0,
    confidence REAL DEFAULT 0.98,
    validation_status VARCHAR(64) DEFAULT 'UNVERIFIED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_prod_sub ON production_records(subsidiary);
CREATE INDEX IF NOT EXISTS idx_prod_year ON production_records(year);
CREATE INDEX IF NOT EXISTS idx_prod_mine ON production_records(mine_name);

-- 9. Geological & Exploration Records
CREATE TABLE IF NOT EXISTS geological_records (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64) REFERENCES documents(id) ON DELETE CASCADE,
    page_number INTEGER DEFAULT 1,
    subsidiary VARCHAR(128) NOT NULL,
    coalfield VARCHAR(255) NOT NULL,
    block_name VARCHAR(255) NOT NULL,
    proven_reserves_mt DOUBLE PRECISION DEFAULT 0,
    indicated_reserves_mt DOUBLE PRECISION DEFAULT 0,
    inferred_reserves_mt DOUBLE PRECISION DEFAULT 0,
    total_reserves_mt DOUBLE PRECISION DEFAULT 0,
    coal_grade VARCHAR(64),
    avg_seam_thickness_m DOUBLE PRECISION DEFAULT 0,
    gas_drainage_potential VARCHAR(32) DEFAULT 'LOW',
    confidence REAL DEFAULT 0.95,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Parliamentary & Administrative Inquiries
CREATE TABLE IF NOT EXISTS inquiries (
    id VARCHAR(64) PRIMARY KEY,
    reference_number VARCHAR(128) UNIQUE NOT NULL,
    house VARCHAR(64) NOT NULL,
    question_type VARCHAR(64) NOT NULL,
    subject VARCHAR(512) NOT NULL,
    ministry_division VARCHAR(255),
    urgency VARCHAR(32) NOT NULL DEFAULT 'High',
    due_date DATE NOT NULL,
    assigned_to VARCHAR(255),
    status VARCHAR(64) NOT NULL DEFAULT 'Pending',
    query_details TEXT NOT NULL,
    linked_docs_json TEXT, -- JSON array of linked citation objects
    draft_reply TEXT,
    verified_by VARCHAR(255),
    dispatched_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Generated Reports
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(512) NOT NULL,
    report_type VARCHAR(128) NOT NULL,
    reporting_period VARCHAR(128) NOT NULL,
    subsidiary VARCHAR(128) NOT NULL,
    mine_name VARCHAR(255),
    sections_json TEXT NOT NULL,
    summary_stats_json TEXT NOT NULL,
    source_documents_json TEXT NOT NULL,
    generated_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Immutable Audit Trail
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(64),
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(32) NOT NULL,
    action VARCHAR(64) NOT NULL,
    resource_type VARCHAR(64) NOT NULL,
    resource_id VARCHAR(64),
    details TEXT NOT NULL,
    ip_address VARCHAR(64) DEFAULT '127.0.0.1',
    status VARCHAR(32) NOT NULL DEFAULT 'SUCCESS'
);
CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);

-- 13. Asynchronous Processing Jobs
CREATE TABLE IF NOT EXISTS processing_jobs (
    id VARCHAR(64) PRIMARY KEY,
    document_id VARCHAR(64),
    job_type VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'QUEUED',
    progress INTEGER NOT NULL DEFAULT 0,
    stage VARCHAR(128) NOT NULL DEFAULT 'Queued',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON processing_jobs(status);

-- 14. System Configuration & Settings
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(128) PRIMARY KEY,
    value_json TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
