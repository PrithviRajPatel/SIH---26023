import fs from 'fs';
import path from 'path';
import { QdrantClient } from '@qdrant/js-client-rest';

export interface QdrantPoint {
  id: string;
  vector: number[];
  payload: {
    documentId: string;
    pageNumber: number;
    sectionTitle?: string;
    content: string;
    documentType?: string;
    date?: string;
    organization?: string;
    permissions?: string[];
    confidence?: number;
    [key: string]: any;
  };
}

export interface QdrantSearchResult {
  id: string;
  score: number;
  payload: QdrantPoint['payload'];
}

export interface QdrantFilter {
  documentId?: string;
  documentIds?: string[];
  organization?: string;
  documentType?: string;
}

export class QdrantVectorStore {
  private client: QdrantClient | null = null;
  private isRemoteAvailable = false;
  private localStoreDir: string;
  private localStoreFile: string;
  private inMemoryIndex: Map<string, QdrantPoint> = new Map();
  private collectionName = 'document_chunks';
  private isInitialized = false;

  constructor() {
    this.localStoreDir = path.resolve(process.cwd(), 'data', 'qdrant');
    this.localStoreFile = path.join(this.localStoreDir, 'vectors.json');
  }

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    if (!fs.existsSync(this.localStoreDir)) {
      fs.mkdirSync(this.localStoreDir, { recursive: true });
    }

    // Load persistent disk vectors if present
    if (fs.existsSync(this.localStoreFile)) {
      try {
        const raw = fs.readFileSync(this.localStoreFile, 'utf8');
        const points: QdrantPoint[] = JSON.parse(raw);
        for (const pt of points) {
          this.inMemoryIndex.set(pt.id, pt);
        }
        console.log(`[Qdrant] Loaded ${this.inMemoryIndex.size} indexed vectors from persistent storage at ${this.localStoreFile}`);
      } catch (err: any) {
        console.warn('[Qdrant] Could not read local vector store, starting clean:', err.message);
      }
    }

    // Check if remote Qdrant is configured
    const qdrantUrl = process.env.QDRANT_URL;
    if (qdrantUrl) {
      try {
        this.client = new QdrantClient({
          url: qdrantUrl,
          apiKey: process.env.QDRANT_API_KEY
        });
        await this.client.getCollections();
        this.isRemoteAvailable = true;
        console.log('[Qdrant] Connected to remote Qdrant instance at', qdrantUrl);
      } catch (err: any) {
        console.warn('[Qdrant] Remote Qdrant connection failed, using local persistent vector engine:', err.message);
        this.isRemoteAvailable = false;
      }
    }

    this.isInitialized = true;
  }

  private saveToDisk(): void {
    try {
      const points = Array.from(this.inMemoryIndex.values());
      fs.writeFileSync(this.localStoreFile, JSON.stringify(points, null, 2), 'utf8');
    } catch (err: any) {
      console.warn('[Qdrant] Failed persisting vector store to disk:', err.message);
    }
  }

  /**
   * Upsert vector embedding points into the collection with full metadata payload
   */
  public async upsertPoints(points: QdrantPoint[]): Promise<void> {
    await this.init();

    // 1. Store in local persistent vector database
    for (const pt of points) {
      this.inMemoryIndex.set(pt.id, pt);
    }
    this.saveToDisk();

    // 2. Mirror to remote Qdrant if connected
    if (this.isRemoteAvailable && this.client) {
      try {
        await this.client.upsert(this.collectionName, {
          wait: true,
          points: points.map(p => ({
            id: p.id,
            vector: p.vector,
            payload: p.payload
          }))
        });
      } catch (err: any) {
        console.warn('[Qdrant] Remote upsert error:', err.message);
      }
    }
  }

  /**
   * Cosine similarity search with payload filtering and top-K ranking
   */
  public async search(
    queryVector: number[],
    filter?: QdrantFilter,
    limit: number = 6
  ): Promise<QdrantSearchResult[]> {
    await this.init();

    if (queryVector.length === 0) return [];

    // If remote Qdrant is available, try remote search first
    if (this.isRemoteAvailable && this.client) {
      try {
        const qdrantFilter: any = { must: [] };
        if (filter?.documentId) {
          qdrantFilter.must.push({ key: 'documentId', match: { value: filter.documentId } });
        }
        if (filter?.organization) {
          qdrantFilter.must.push({ key: 'organization', match: { value: filter.organization } });
        }
        if (filter?.documentType) {
          qdrantFilter.must.push({ key: 'documentType', match: { value: filter.documentType } });
        }

        const res: any = await (this.client as any).search(this.collectionName, {
          vector: queryVector,
          filter: qdrantFilter.must.length > 0 ? qdrantFilter : undefined,
          limit
        });

        return (res || []).map((r: any) => ({
          id: String(r.id),
          score: r.score,
          payload: r.payload as any
        }));
      } catch (err: any) {
        console.warn('[Qdrant Remote Search Fallback]', err.message);
      }
    }

    // Exact Cosine Vector Search over local persistent store
    const scored: QdrantSearchResult[] = [];

    // Precalculate query norm
    let queryNorm = 0;
    for (let i = 0; i < queryVector.length; i++) {
      queryNorm += queryVector[i] * queryVector[i];
    }
    queryNorm = Math.sqrt(queryNorm) || 1e-9;

    for (const [id, point] of this.inMemoryIndex.entries()) {
      // Apply metadata filters
      if (filter?.documentId && point.payload.documentId !== filter.documentId) {
        continue;
      }
      if (filter?.documentIds && filter.documentIds.length > 0 && !filter.documentIds.includes(point.payload.documentId)) {
        continue;
      }
      if (filter?.organization && point.payload.organization && !point.payload.organization.toLowerCase().includes(filter.organization.toLowerCase())) {
        continue;
      }
      if (filter?.documentType && point.payload.documentType && point.payload.documentType !== filter.documentType) {
        continue;
      }

      // Compute dot product
      const vec = point.vector;
      const minLen = Math.min(vec.length, queryVector.length);
      let dot = 0;
      let vecNorm = 0;

      for (let i = 0; i < minLen; i++) {
        dot += queryVector[i] * vec[i];
        vecNorm += vec[i] * vec[i];
      }
      vecNorm = Math.sqrt(vecNorm) || 1e-9;

      const cosineSim = Math.max(0, Math.min(1, dot / (queryNorm * vecNorm)));
      scored.push({
        id,
        score: Number(cosineSim.toFixed(4)),
        payload: point.payload
      });
    }

    // Rank descending by cosine similarity score
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
  }

  /**
   * Delete vector points by document ID
   */
  public async deleteByDocumentId(documentId: string): Promise<number> {
    await this.init();

    let removed = 0;
    for (const [id, pt] of this.inMemoryIndex.entries()) {
      if (pt.payload.documentId === documentId) {
        this.inMemoryIndex.delete(id);
        removed++;
      }
    }

    if (removed > 0) {
      this.saveToDisk();
    }

    if (this.isRemoteAvailable && this.client) {
      try {
        await this.client.delete(this.collectionName, {
          filter: {
            must: [{ key: 'documentId', match: { value: documentId } }]
          }
        });
      } catch (err: any) {
        console.warn('[Qdrant Remote Delete Warning]', err.message);
      }
    }

    return removed;
  }

  /**
   * Clear all vector embeddings
   */
  public async clearAll(): Promise<void> {
    this.inMemoryIndex.clear();
    this.saveToDisk();
    if (this.isRemoteAvailable && this.client) {
      try {
        await this.client.deleteCollection(this.collectionName).catch(() => {});
        await this.client.createCollection(this.collectionName, {
          vectors: { size: 768, distance: 'Cosine' }
        }).catch(() => {});
      } catch {}
    }
  }

  public getCount(): number {
    return this.inMemoryIndex.size;
  }

  public getMode(): string {
    return this.isRemoteAvailable ? 'REMOTE_QDRANT' : 'EMBEDDED_PERSISTENT_VECTOR_STORE';
  }
}

export const qdrantVectorStore = new QdrantVectorStore();
