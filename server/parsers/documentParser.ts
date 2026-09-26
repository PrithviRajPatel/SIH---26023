import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import { defaultOCRProvider, OCROutputPage } from './ocrProvider';

export interface ParsedTable {
  id: string;
  title: string;
  pageNumber: number;
  headers: string[];
  rows: (string | number)[][];
  confidence: number;
}

export interface ParsedDocumentResult {
  pageCount: number;
  pages: OCROutputPage[];
  tables: ParsedTable[];
  isScanned: boolean;
  rawText: string;
}

export class DocumentParserService {
  /**
   * Parse any supported file buffer according to its MIME type and extension
   */
  public async parseFile(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<ParsedDocumentResult> {
    const ext = filename.split('.').pop()?.toLowerCase() || '';

    if (ext === 'pdf' || mimeType.includes('pdf')) {
      return await this.parsePdf(fileBuffer);
    } else if (ext === 'docx' || mimeType.includes('word') || mimeType.includes('officedocument.wordprocessingml')) {
      return await this.parseDocx(fileBuffer);
    } else if (['xlsx', 'xls', 'csv'].includes(ext) || mimeType.includes('spreadsheet') || mimeType.includes('csv')) {
      return await this.parseExcelOrCsv(fileBuffer, ext);
    } else if (['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp'].includes(ext) || mimeType.startsWith('image/')) {
      return await this.parseImage(fileBuffer);
    } else {
      // Default plain text parser
      return await this.parseText(fileBuffer);
    }
  }

  // 1. PDF Parser (Digital & Scanned)
  private async parsePdf(buffer: Buffer): Promise<ParsedDocumentResult> {
    try {
      const parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      const fullText = textResult?.text || '';
      const numPages = textResult?.pages?.length || 1;
      await parser.destroy().catch(() => {});

      // Detect if PDF is purely scanned (almost zero text extracted from digital streams)
      const isScanned = fullText.trim().length < 50;

      const pages: OCROutputPage[] = [];
      const tables: ParsedTable[] = [];

      if (!isScanned) {
        // Split text by page delimiters if available, or approximate evenly
        const pageSplits = fullText.split(/\f|\n(?=Page \d+)/i);
        const effectiveCount = Math.max(numPages, pageSplits.length);

        for (let i = 0; i < effectiveCount; i++) {
          const pageText = pageSplits[i] || (i === 0 ? fullText : `[Page ${i + 1}]`);
          pages.push({
            pageNumber: i + 1,
            text: pageText.trim(),
            confidence: 0.99,
            isScanned: false,
            boundingBoxes: [
              { text: pageText.substring(0, 50), box: [5, 5, 90, 4], confidence: 0.99 }
            ]
          });

          // Detect tabular patterns in text (e.g. columns separated by whitespace or tabs)
          const detectedTable = this.detectTableFromText(pageText, i + 1);
          if (detectedTable) {
            tables.push(detectedTable);
          }
        }
      } else {
        // Scanned PDF: Run OCR Provider
        const ocrResult = await defaultOCRProvider.processImage(buffer, 1);
        pages.push(ocrResult);
      }

      return {
        pageCount: Math.max(1, pages.length),
        pages,
        tables,
        isScanned,
        rawText: fullText
      };
    } catch (err: any) {
      console.warn('[PDF Parser Fallback]', err.message);
      // Fallback
      return {
        pageCount: 1,
        pages: [{
          pageNumber: 1,
          text: buffer.toString('utf8').replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, ' ').substring(0, 5000),
          confidence: 0.88,
          isScanned: false
        }],
        tables: [],
        isScanned: false,
        rawText: buffer.toString('utf8').substring(0, 5000)
      };
    }
  }

  // 2. DOCX Parser
  private async parseDocx(buffer: Buffer): Promise<ParsedDocumentResult> {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const text = result.value || '';
      const tables: ParsedTable[] = [];

      // Extract tables if present
      const detected = this.detectTableFromText(text, 1);
      if (detected) tables.push(detected);

      return {
        pageCount: Math.max(1, Math.ceil(text.length / 1500)),
        pages: [{
          pageNumber: 1,
          text,
          confidence: 0.99,
          isScanned: false
        }],
        tables,
        isScanned: false,
        rawText: text
      };
    } catch (err: any) {
      console.warn('[DOCX Parser Error]', err.message);
      return this.parseText(buffer);
    }
  }

  // 3. Excel & CSV Parser
  private async parseExcelOrCsv(buffer: Buffer, ext: string): Promise<ParsedDocumentResult> {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const tables: ParsedTable[] = [];
      let fullText = '';

      workbook.SheetNames.forEach((sheetName, index) => {
        const worksheet = workbook.Sheets[sheetName];
        const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (rows.length > 0) {
          const headers = (rows[0] || []).map(h => String(h || '').trim());
          const dataRows = rows.slice(1, 25).map(r => r.map(c => c !== undefined && c !== null ? c : ''));

          tables.push({
            id: `tbl_sheet_${index + 1}_${Date.now()}`,
            title: `Worksheet: ${sheetName}`,
            pageNumber: index + 1,
            headers,
            rows: dataRows,
            confidence: 1.0
          });

          fullText += `\n[WORKSHEET: ${sheetName}]\nHeaders: ${headers.join(' | ')}\n` +
            dataRows.map(r => r.join(' | ')).join('\n');
        }
      });

      return {
        pageCount: Math.max(1, workbook.SheetNames.length),
        pages: workbook.SheetNames.map((sName, idx) => ({
          pageNumber: idx + 1,
          text: `Sheet: ${sName}\n` + (tables[idx]?.rows.map(r => r.join(' , ')).join('\n') || ''),
          confidence: 1.0,
          isScanned: false
        })),
        tables,
        isScanned: false,
        rawText: fullText
      };
    } catch (err: any) {
      console.warn('[Excel Parser Error]', err.message);
      return this.parseText(buffer);
    }
  }

  // 4. Image Parser
  private async parseImage(buffer: Buffer): Promise<ParsedDocumentResult> {
    const ocrPage = await defaultOCRProvider.processImage(buffer, 1);
    return {
      pageCount: 1,
      pages: [ocrPage],
      tables: [],
      isScanned: true,
      rawText: ocrPage.text
    };
  }

  // 5. Plain Text / CSV Parser
  private async parseText(buffer: Buffer): Promise<ParsedDocumentResult> {
    const text = buffer.toString('utf8');
    const tables: ParsedTable[] = [];

    const detected = this.detectTableFromText(text, 1);
    if (detected) tables.push(detected);

    return {
      pageCount: Math.max(1, Math.ceil(text.length / 1800)),
      pages: [{
        pageNumber: 1,
        text,
        confidence: 1.0,
        isScanned: false
      }],
      tables,
      isScanned: false,
      rawText: text
    };
  }

  // Helper to extract table from structured text or CSV lines
  private detectTableFromText(text: string, pageNumber: number): ParsedTable | null {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const tableLines = lines.filter(l => (l.includes(',') || l.includes('\t') || l.includes('|')) && l.split(/,|\t|\|/).length >= 3);

    if (tableLines.length >= 2) {
      const delimiter = tableLines[0].includes('|') ? '|' : tableLines[0].includes('\t') ? '\t' : ',';
      const headers = tableLines[0].split(delimiter).map(c => c.trim()).filter(c => c.length > 0);
      const rows = tableLines.slice(1, 15).map(l => l.split(delimiter).map(c => c.trim()));

      return {
        id: `tbl_extracted_${pageNumber}_${Date.now()}`,
        title: `Extracted Tabular Segment (Page ${pageNumber})`,
        pageNumber,
        headers,
        rows,
        confidence: 0.95
      };
    }
    return null;
  }
}

export const documentParser = new DocumentParserService();
