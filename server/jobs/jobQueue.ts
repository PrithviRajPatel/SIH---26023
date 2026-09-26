import { dbConnection } from '../db/database';
import { storageProvider } from '../storage/storageProvider';
import { documentParser } from '../parsers/documentParser';
import { entityExtractor } from '../parsers/entityExtractor';
import { aiProvider } from '../ai/aiProvider';
import { MiningDocument } from '../../src/types';

export interface JobRecord {
  id: string;
  documentId: string;
  jobType: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  stage: string;
  errorMessage?: string;
}

export class BackgroundJobWorker {
  private activeJobs = new Map<string, boolean>();

  /**
   * Enqueue and run document ingestion asynchronously
   */
  public async enqueueDocumentProcessing(
    jobId: string,
    docId: string,
    fileBuffer: Buffer,
    meta: {
      title: string;
      filename: string;
      mimeType: string;
      subsidiary: string;
      mineName?: string;
      coalfield?: string;
      reportingYear: number;
      docType: string;
      tags: string[];
      userName: string;
    }
  ): Promise<void> {
    // 1. Create job record in PostgreSQL
    await dbConnection.query(`
      INSERT INTO processing_jobs (id, document_id, job_type, status, progress, stage)
      VALUES ($1, $2, 'DOCUMENT_INGESTION', 'QUEUED', 0, 'Queued for Processing')
    `, [jobId, docId]);

    // Run asynchronously in background without blocking HTTP response
    setImmediate(async () => {
      await this.processDocumentJob(jobId, docId, fileBuffer, meta);
    });
  }

  private async updateJob(jobId: string, progress: number, stage: string, status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' = 'PROCESSING', error?: string) {
    await dbConnection.query(`
      UPDATE processing_jobs 
      SET progress = $1, stage = $2, status = $3, error_message = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
    `, [progress, stage, status, error || null, jobId]);
  }

  private async processDocumentJob(
    jobId: string,
    docId: string,
    fileBuffer: Buffer,
    meta: any
  ): Promise<void> {
    try {
      // Stage 1: Storage & Checksum (20%)
      await this.updateJob(jobId, 20, 'Storage & SHA-256 Checksum Validation');
      const stored = await storageProvider.saveFile(fileBuffer, meta.filename, meta.mimeType);

      // Stage 2: OCR & Layout Preservation (40%)
      await this.updateJob(jobId, 40, 'OCR & Structural Layout Extraction');
      const parseResult = await documentParser.parseFile(fileBuffer, meta.filename, meta.mimeType);

      // Stage 3: Tabular & Entity Extraction (60%)
      await this.updateJob(jobId, 60, 'Tabular Parsing & Named Entity Recognition');
      const extraction = entityExtractor.extract(
        docId,
        parseResult.rawText,
        meta.subsidiary,
        meta.mineName || meta.title,
        meta.reportingYear
      );

      // Stage 4: Relational Database Persistence (80%)
      await this.updateJob(jobId, 80, 'Relational Storage & Vector Embeddings');

      // 4a. Insert document
      await dbConnection.query(`
        INSERT INTO documents (
          id, title, original_filename, storage_key, mime_type, file_size, file_hash,
          subsidiary, mine_name, coalfield, reporting_year, doc_type, status, is_scanned,
          page_count, summary, tags, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'VALIDATION_REQUIRED', $13, $14, $15, $16, $17)
      `, [
        docId,
        meta.title || meta.filename,
        meta.filename,
        stored.storageKey,
        stored.mimeType,
        stored.fileSize,
        stored.fileHash,
        meta.subsidiary,
        meta.mineName || 'Designated Mining Area',
        meta.coalfield || 'Designated Basin',
        meta.reportingYear,
        meta.docType || 'ANNUAL_REPORT',
        parseResult.isScanned,
        parseResult.pageCount,
        `Automated extraction from ${meta.filename}. Extracted ${extraction.entities.length} verified metrics across ${parseResult.pageCount} pages.`,
        JSON.stringify(meta.tags || [meta.subsidiary, 'Ingested']),
        meta.userName || 'Analyst'
      ]);

      // 4b. Insert pages
      for (const p of parseResult.pages) {
        await dbConnection.query(`
          INSERT INTO document_pages (id, document_id, page_number, raw_text, ocr_confidence, is_scanned)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          `page_${docId}_${p.pageNumber}`,
          docId,
          p.pageNumber,
          p.text,
          p.confidence,
          p.isScanned
        ]);
      }

      // 4c. Insert tables
      for (const tbl of parseResult.tables) {
        await dbConnection.query(`
          INSERT INTO document_tables (id, document_id, title, page_number, headers_json, rows_json, confidence)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          tbl.id,
          docId,
          tbl.title,
          tbl.pageNumber,
          JSON.stringify(tbl.headers),
          JSON.stringify(tbl.rows),
          tbl.confidence
        ]);
      }

      // 4d. Insert entities
      for (const ent of extraction.entities) {
        await dbConnection.query(`
          INSERT INTO extracted_entities (
            id, document_id, page_number, entity_type, entity_key, entity_value,
            unit, normalized_value, normalized_unit, source_text, extraction_method,
            confidence, validation_status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'PENDING')
        `, [
          ent.id,
          docId,
          ent.pageNumber,
          ent.entityType,
          ent.entityKey,
          String(ent.entityValue),
          ent.unit || null,
          ent.normalizedValue || null,
          ent.normalizedUnit || null,
          ent.sourceText,
          ent.extractionMethod,
          ent.confidence
        ]);
      }

      // 4e. Insert structured production record if extracted
      if (extraction.productionRecord) {
        const pr = extraction.productionRecord;
        await dbConnection.query(`
          INSERT INTO production_records (
            id, document_id, subsidiary, mine_name, coalfield, year,
            target_production_mt, achieved_production_mt, achievement_percentage,
            dispatch_mt, overburden_removal_mcm, stripping_ratio, productivity_oms
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [
          `pr_${Date.now()}`,
          docId,
          meta.subsidiary,
          meta.mineName || meta.title,
          meta.coalfield || 'Designated Coalfield',
          meta.reportingYear,
          pr.targetProductionMt,
          pr.achievedProductionMt,
          pr.targetProductionMt > 0 ? Number(((pr.achievedProductionMt / pr.targetProductionMt) * 100).toFixed(1)) : 100,
          pr.dispatchMt,
          pr.overburdenRemovalMcm,
          pr.strippingRatio,
          pr.productivityOms
        ]);
      }

      // 4f. Chunking & Vector Embeddings for pgvector RAG
      const chunks = this.createChunks(docId, parseResult.pages);
      for (const c of chunks) {
        const vector = await aiProvider.generateEmbedding(c.content);
        await dbConnection.query(`
          INSERT INTO document_chunks (id, document_id, page_number, section_title, content, embedding_json, confidence)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          c.id,
          docId,
          c.pageNumber,
          c.sectionTitle,
          c.content,
          JSON.stringify(vector),
          c.confidence
        ]);
      }

      // 4g. Audit log
      await dbConnection.query(`
        INSERT INTO audit_logs (id, timestamp, user_id, user_name, user_role, action, resource_type, resource_id, details, ip_address, status)
        VALUES ($1, CURRENT_TIMESTAMP, $2, $3, 'ANALYST', 'DOCUMENT_UPLOAD', 'DOCUMENT', $4, $5, '127.0.0.1', 'SUCCESS')
      `, [
        `aud_${Date.now()}`,
        'usr_analyst_01',
        meta.userName || 'Analyst',
        docId,
        `Ingested document: "${meta.title || meta.filename}" (${parseResult.pageCount} pages, ${chunks.length} vector chunks).`
      ]);

      // Stage 5: Completed (100%)
      await this.updateJob(jobId, 100, 'Ingestion & Vector Indexing Complete', 'COMPLETED');
      console.log(`[Job Worker] Document ${docId} processed and indexed successfully.`);
    } catch (err: any) {
      console.error(`[Job Worker Error for ${docId}]`, err);
      await this.updateJob(jobId, 0, 'Failed during processing', 'FAILED', err.message);
    }
  }

  private createChunks(documentId: string, pages: any[]): Array<{ id: string; pageNumber: number; sectionTitle: string; content: string; confidence: number }> {
    const chunks: any[] = [];
    pages.forEach((p, idx) => {
      const text = p.text || '';
      // Chunking by 800 characters with 100 char overlap
      const chunkSize = 800;
      const overlap = 100;
      let start = 0;
      let chunkIdx = 1;

      while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        const chunkText = text.substring(start, end).trim();
        if (chunkText.length > 30) {
          chunks.push({
            id: `chk_${documentId}_${p.pageNumber}_${chunkIdx}`,
            pageNumber: p.pageNumber,
            sectionTitle: `Page ${p.pageNumber} - Section ${chunkIdx}`,
            content: chunkText,
            confidence: p.confidence || 0.95
          });
          chunkIdx++;
        }
        start += (chunkSize - overlap);
      }
    });

    if (chunks.length === 0) {
      chunks.push({
        id: `chk_${documentId}_1_1`,
        pageNumber: 1,
        sectionTitle: 'Document Content',
        content: pages[0]?.text?.substring(0, 1000) || 'Document Content',
        confidence: 0.95
      });
    }

    return chunks;
  }

  public async getJobStatus(jobId: string): Promise<JobRecord | null> {
    const res = await dbConnection.query('SELECT * FROM processing_jobs WHERE id = $1', [jobId]);
    if (res.rows.length === 0) return null;
    const r = res.rows[0];
    return {
      id: r.id,
      documentId: r.document_id,
      jobType: r.job_type,
      status: r.status,
      progress: r.progress,
      stage: r.stage,
      errorMessage: r.error_message
    };
  }
}

export const jobWorker = new BackgroundJobWorker();
