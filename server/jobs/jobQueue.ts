import { dbConnection } from '../db/database';
import { storageProvider } from '../storage/storageProvider';
import { documentParser } from '../parsers/documentParser';
import { universalAnalyzer } from '../analyzers/universalAnalyzer';
import { aiProvider } from '../ai/aiProvider';
import { qdrantVectorStore, QdrantPoint } from '../storage/qdrantClient';
import { db } from '../db';
import { MiningDocument, DocumentType, DocumentPage, ExtractedTable, ExtractedEntity } from '../../src/types';

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
      subsidiary?: string;
      mineName?: string;
      coalfield?: string;
      reportingYear?: number;
      docType?: string;
      tags?: string[];
      userName?: string;
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

  private async updateJob(
    jobId: string, 
    progress: number, 
    stage: string, 
    status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' = 'PROCESSING', 
    error?: string
  ) {
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
      // Stage 1: Storage & Checksum Validation (15%)
      await this.updateJob(jobId, 15, 'Validating SHA-256 Checksum & File Storage');
      const stored = await storageProvider.saveFile(fileBuffer, meta.filename, meta.mimeType);

      // Stage 2: OCR & Layout Analysis (35%)
      await this.updateJob(jobId, 35, 'Document Layout Parsing & OCR Text Extraction');
      const parseResult = await documentParser.parseFile(fileBuffer, meta.filename, meta.mimeType);

      // Stage 3: Universal Document Understanding & Entity Discovery (55%)
      await this.updateJob(jobId, 55, 'Universal Classification & Semantic Entity Extraction');
      const analysis = universalAnalyzer.analyzeDocument(
        meta.title || meta.filename,
        meta.filename,
        meta.mimeType,
        parseResult.rawText,
        parseResult.pages,
        parseResult.tables,
        fileBuffer.length
      );

      // Stage 4: Content Chunking & Vector Embeddings (75%)
      await this.updateJob(jobId, 75, 'Generating Dense Vector Embeddings & Indexing into Qdrant');
      const chunks = this.createChunks(docId, parseResult.pages);
      const qdrantPoints: QdrantPoint[] = [];

      for (const c of chunks) {
        const vector = await aiProvider.generateEmbedding(c.content);
        
        // Save chunk in PostgreSQL
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

        qdrantPoints.push({
          id: c.id,
          vector,
          payload: {
            documentId: docId,
            pageNumber: c.pageNumber,
            sectionTitle: c.sectionTitle,
            content: c.content,
            documentType: analysis.documentType,
            date: analysis.date || new Date().toISOString(),
            organization: analysis.organization || meta.subsidiary || 'Enterprise',
            permissions: ['PUBLIC', 'AUTHORIZED'],
            confidence: c.confidence
          }
        });
      }

      // Index vectors in Qdrant Vector Store
      await qdrantVectorStore.upsertPoints(qdrantPoints);

      // Stage 5: Relational Persistence in PostgreSQL (90%)
      await this.updateJob(jobId, 90, 'Writing Relational Records to PostgreSQL Database');

      const docPages: DocumentPage[] = parseResult.pages.map(p => ({
        pageNumber: p.pageNumber,
        ocrConfidence: p.confidence,
        isScanned: p.isScanned,
        rawText: p.text,
        boundingBoxes: p.boundingBoxes || []
      }));

      const docTables: ExtractedTable[] = parseResult.tables.map(t => ({
        id: t.id,
        title: t.title,
        pageNumber: t.pageNumber,
        headers: t.headers,
        rows: t.rows,
        confidence: t.confidence
      }));

      // Construct Unified Document Model
      const documentModel: MiningDocument = {
        id: docId,
        title: meta.title || meta.filename,
        filename: meta.filename,
        fileHash: stored.fileHash,
        fileType: meta.filename.split('.').pop()?.toLowerCase() || 'pdf',
        fileSize: stored.fileSize,
        documentType: analysis.documentType,
        docType: (analysis.documentType as DocumentType) || 'ANNUAL_REPORT',
        category: analysis.category,
        domain: analysis.domain as any,
        language: analysis.language || 'English',
        date: analysis.date,
        reportingPeriod: analysis.reportingPeriod,
        organization: analysis.organization || meta.subsidiary,
        department: analysis.department,
        location: analysis.location || meta.mineName,
        subsidiary: analysis.organization || meta.subsidiary || 'Enterprise',
        mineName: analysis.location || meta.mineName,
        coalfield: meta.coalfield || 'Basin / Region',
        reportingYear: Number(analysis.reportingPeriod?.match(/\d{4}/)?.[0]) || meta.reportingYear || 2024,
        status: 'VALIDATED',
        isScanned: parseResult.isScanned,
        pageCount: parseResult.pageCount,
        uploadedAt: new Date().toISOString(),
        processedAt: new Date().toISOString(),
        pages: docPages,
        chunks,
        tables: docTables,
        entities: analysis.entities,
        summary: analysis.executiveSummary,
        executiveSummary: analysis.executiveSummary,
        keyInsights: analysis.keyInsights,
        keyMetrics: analysis.keyMetrics,
        visualizations: analysis.visualizations,
        timelineEvents: analysis.timelineEvents,
        qualityScore: analysis.qualityScore,
        tags: meta.tags || [analysis.category, analysis.domain]
      };

      // 5a. Insert Document in PostgreSQL
      await dbConnection.query(`
        INSERT INTO documents (
          id, title, original_filename, storage_key, mime_type, file_size, file_hash,
          document_type, doc_type, category, domain, language, doc_date, reporting_period,
          organization, department, location, subsidiary, mine_name, coalfield, reporting_year,
          status, is_scanned, page_count, summary, executive_summary, tags,
          quality_score_json, key_metrics_json, insights_json, visualizations_json, timeline_events_json,
          created_by
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12, $13, $14,
          $15, $16, $17, $18, $19, $20, $21,
          $22, $23, $24, $25, $26, $27,
          $28, $29, $30, $31, $32,
          $33
        )
      `, [
        docId,
        documentModel.title,
        documentModel.filename,
        stored.storageKey,
        stored.mimeType,
        stored.fileSize,
        stored.fileHash,
        documentModel.documentType,
        documentModel.docType,
        documentModel.category,
        documentModel.domain,
        documentModel.language,
        documentModel.date || null,
        documentModel.reportingPeriod || null,
        documentModel.organization || null,
        documentModel.department || null,
        documentModel.location || null,
        documentModel.subsidiary || null,
        documentModel.mineName || null,
        documentModel.coalfield || null,
        documentModel.reportingYear || null,
        documentModel.status,
        documentModel.isScanned,
        documentModel.pageCount,
        documentModel.summary || null,
        documentModel.executiveSummary || null,
        JSON.stringify(documentModel.tags),
        JSON.stringify(documentModel.qualityScore || null),
        JSON.stringify(documentModel.keyMetrics || []),
        JSON.stringify(documentModel.keyInsights || []),
        JSON.stringify(documentModel.visualizations || []),
        JSON.stringify(documentModel.timelineEvents || []),
        meta.userName || 'Analyst'
      ]);

      // 5b. Insert Pages in PostgreSQL
      for (const p of docPages) {
        await dbConnection.query(`
          INSERT INTO document_pages (id, document_id, page_number, raw_text, ocr_confidence, is_scanned, bounding_boxes_json)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          `page_${docId}_${p.pageNumber}`,
          docId,
          p.pageNumber,
          p.rawText,
          p.ocrConfidence,
          p.isScanned,
          JSON.stringify(p.boundingBoxes || [])
        ]);
      }

      // 5c. Insert Tables in PostgreSQL
      for (const tbl of docTables) {
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

      // 5d. Insert Extracted Entities in PostgreSQL
      for (const ent of analysis.entities) {
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

      // 5e. Insert Production Record if extracted
      if (analysis.productionRecord) {
        const pr = analysis.productionRecord;
        await dbConnection.query(`
          INSERT INTO production_records (
            id, document_id, subsidiary, mine_name, coalfield, year,
            target_production_mt, achieved_production_mt, achievement_percentage,
            dispatch_mt, overburden_removal_mcm, stripping_ratio, productivity_oms
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [
          `pr_${Date.now()}`,
          docId,
          documentModel.subsidiary,
          documentModel.mineName || documentModel.title,
          documentModel.coalfield || 'Designated Region',
          documentModel.reportingYear,
          pr.targetProductionMt || 0,
          pr.achievedProductionMt || 0,
          pr.targetProductionMt > 0 ? Number(((pr.achievedProductionMt / pr.targetProductionMt) * 100).toFixed(1)) : 100,
          pr.dispatchMt || 0,
          pr.overburdenRemovalMcm || 0,
          pr.strippingRatio || 0,
          pr.productivityOms || 0
        ]);
        db.productionRecords.push(pr);
      }

      // 5f. Insert Geological Record if extracted
      if (analysis.geologicalRecord) {
        const gr = analysis.geologicalRecord;
        await dbConnection.query(`
          INSERT INTO geological_records (
            id, document_id, subsidiary, coalfield, block_name,
            proven_reserves_mt, indicated_reserves_mt, inferred_reserves_mt, total_reserves_mt,
            coal_grade, avg_seam_thickness_m, gas_drainage_potential
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          `gr_${Date.now()}`,
          docId,
          documentModel.subsidiary,
          documentModel.coalfield,
          gr.blockName,
          gr.provenReservesMt || 0,
          gr.indicatedReservesMt || 0,
          gr.inferredReservesMt || 0,
          gr.totalReservesMt || 0,
          gr.coalGrade || 'G11',
          gr.avgSeamThicknessM || 0,
          gr.gasDrainagePotential || 'LOW'
        ]);
        db.geologicalRecords.push(gr);
      }

      // 5g. Update in-memory/cache store and recalculate metrics
      db.documents.unshift(documentModel);
      db.recomputeWordCloudAndTopics();
      db.recomputeMetrics();
      db.saveToDisk();

      // 5h. Audit Log in PostgreSQL
      await dbConnection.query(`
        INSERT INTO audit_logs (id, timestamp, user_id, user_name, user_role, action, resource_type, resource_id, details, ip_address, status)
        VALUES ($1, CURRENT_TIMESTAMP, $2, $3, 'ANALYST', 'DOCUMENT_UPLOAD', 'DOCUMENT', $4, $5, '127.0.0.1', 'SUCCESS')
      `, [
        `aud_${Date.now()}`,
        'usr_analyst_01',
        meta.userName || 'Analyst',
        docId,
        `Ingested document: "${documentModel.title}" (${documentModel.documentType}, ${documentModel.pageCount} pages, ${chunks.length} Qdrant vectors).`
      ]);

      // Stage 6: Completed (100%)
      await this.updateJob(jobId, 100, 'Ingestion & Vector Indexing Complete', 'COMPLETED');
      console.log(`[Job Worker] Document ${docId} processed, persisted in PostgreSQL, and indexed in Qdrant successfully.`);
    } catch (err: any) {
      console.error(`[Job Worker Error for ${docId}]`, err);
      await this.updateJob(jobId, 0, 'Failed during processing', 'FAILED', err.message);
    }
  }

  private createChunks(documentId: string, pages: any[]): Array<{ id: string; pageNumber: number; sectionTitle: string; content: string; confidence: number }> {
    const chunks: any[] = [];
    pages.forEach((p, idx) => {
      const text = p.text || '';
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
