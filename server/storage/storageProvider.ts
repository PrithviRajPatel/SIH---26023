import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface StoredFileMeta {
  storageKey: string;
  filePath: string;
  fileHash: string;
  fileSize: number;
  mimeType: string;
  originalFilename: string;
}

export interface FileStorageProvider {
  saveFile(buffer: Buffer, originalFilename: string, mimeType: string): Promise<StoredFileMeta>;
  getFile(storageKey: string): Promise<Buffer>;
  deleteFile(storageKey: string): Promise<boolean>;
  getPublicUrl(storageKey: string): string;
}

export class LocalStorageProvider implements FileStorageProvider {
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir || path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  public async saveFile(buffer: Buffer, originalFilename: string, mimeType: string): Promise<StoredFileMeta> {
    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');
    const sanitizedFilename = originalFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const ext = path.extname(sanitizedFilename) || '.bin';
    const storageKey = `${Date.now()}_${fileHash.substring(0, 12)}${ext}`;
    
    // Subdirectory based on year/month to prevent directory crowding
    const yearMonth = new Date().toISOString().substring(0, 7);
    const subDir = path.join(this.baseDir, yearMonth);
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir, { recursive: true });
    }

    const fullPath = path.join(subDir, storageKey);
    await fs.promises.writeFile(fullPath, buffer);

    return {
      storageKey: `${yearMonth}/${storageKey}`,
      filePath: fullPath,
      fileHash,
      fileSize: buffer.length,
      mimeType,
      originalFilename
    };
  }

  public async getFile(storageKey: string): Promise<Buffer> {
    // Prevent directory traversal attacks
    const normalizedKey = path.normalize(storageKey).replace(/^(\.\.[\/\\])+/, '');
    const fullPath = path.join(this.baseDir, normalizedKey);

    if (!fullPath.startsWith(this.baseDir) || !fs.existsSync(fullPath)) {
      throw new Error('File not found or unauthorized storage access.');
    }

    return await fs.promises.readFile(fullPath);
  }

  public async deleteFile(storageKey: string): Promise<boolean> {
    try {
      const normalizedKey = path.normalize(storageKey).replace(/^(\.\.[\/\\])+/, '');
      const fullPath = path.join(this.baseDir, normalizedKey);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public getPublicUrl(storageKey: string): string {
    return `/api/documents/download/${encodeURIComponent(storageKey)}`;
  }
}

export const storageProvider: FileStorageProvider = new LocalStorageProvider();
