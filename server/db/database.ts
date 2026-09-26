import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { PGlite } from '@electric-sql/pglite';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

class DatabaseConnection {
  private pgPool: pg.Pool | null = null;
  private pgliteInstance: PGlite | null = null;
  private isInitialized = false;
  private mode: 'POSTGRES_REMOTE' | 'POSTGRES_EMBEDDED' = 'POSTGRES_EMBEDDED';

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    const databaseUrl = process.env.DATABASE_URL;

    if (databaseUrl && !databaseUrl.includes('localhost') && !databaseUrl.includes('geomine-postgres')) {
      // Attempt remote PostgreSQL connection
      try {
        const pool = new pg.Pool({
          connectionString: databaseUrl,
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        });

        await pool.query('SELECT 1');
        this.pgPool = pool;
        this.mode = 'POSTGRES_REMOTE';
        console.log('[DB] Connected to remote PostgreSQL via DATABASE_URL');
      } catch (err: any) {
        console.warn('[DB] Failed connecting to remote PostgreSQL, falling back to persistent embedded PostgreSQL:', err.message);
      }
    }

    if (!this.pgPool) {
      // Use Persistent Embedded PostgreSQL via PGlite in ./data/postgres
      const dataDir = path.resolve(process.cwd(), 'data', 'postgres');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      this.pgliteInstance = new PGlite(dataDir);
      await this.pgliteInstance.query('SELECT 1');
      this.mode = 'POSTGRES_EMBEDDED';
      console.log('[DB] Persistent PostgreSQL engine initialized at:', dataDir);
    }

    await this.applySchema();
    await this.seedDefaultUsers();
    this.isInitialized = true;
  }

  public async query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    if (!this.isInitialized) {
      await this.init();
    }

    try {
      if (this.pgPool) {
        const res = await this.pgPool.query(sql, params);
        return {
          rows: res.rows as T[],
          rowCount: res.rowCount || 0
        };
      } else if (this.pgliteInstance) {
        const res = await this.pgliteInstance.query<T>(sql, params);
        return {
          rows: res.rows || [],
          rowCount: (res.rows && res.rows.length) || 0
        };
      } else {
        throw new Error('No active database engine available.');
      }
    } catch (error: any) {
      console.error('[DB Query Error]', error.message, 'SQL:', sql.substring(0, 100));
      throw error;
    }
  }

  private async applySchema(): Promise<void> {
    try {
      const schemaPath = path.resolve(__dirname, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        // Split statements by semicolon where appropriate or execute block
        await this.query(schemaSql);
        console.log('[DB] PostgreSQL schema verified and applied.');
      }
    } catch (err: any) {
      console.error('[DB] Schema application warning:', err.message);
    }
  }

  private async seedDefaultUsers(): Promise<void> {
    try {
      const existing = await this.query('SELECT id FROM users LIMIT 1');
      if (existing.rows.length === 0) {
        const adminHash = await bcrypt.hash('Admin@1234', 10);
        const analystHash = await bcrypt.hash('Analyst@1234', 10);
        const viewerHash = await bcrypt.hash('Viewer@1234', 10);

        await this.query(`
          INSERT INTO users (id, email, password_hash, name, role, designation, department, subsidiary)
          VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8),
            ($9, $10, $11, $12, $13, $14, $15, $16),
            ($17, $18, $19, $20, $21, $22, $23, $24)
        `, [
          'usr_admin_01', 'admin@geomine.gov.in', adminHash, 'Dr. Rajeshwar Sharma', 'ADMIN', 'General Manager (Geomatics & IT)', 'CMPDI Central Geodata Centre', 'CMPDI HQ Ranchi',
          'usr_analyst_01', 'ananya.sen@coalindia.in', analystHash, 'Ananya Sen', 'ANALYST', 'Senior Mining Analyst (Production Planning)', 'Operations Directorate', 'Coal India Ltd Kolkata',
          'usr_viewer_01', 'v.roy@nic.in', viewerHash, 'Vikramaditya Roy', 'VIEWER', 'Under Secretary (Parliamentary & Statistics)', 'Ministry of Coal, New Delhi', 'Ministry of Coal'
        ]);

        console.log('[DB] Default enterprise accounts initialized (admin, analyst, viewer).');
      }
    } catch (err: any) {
      console.warn('[DB] User seeding check skipped or table pending:', err.message);
    }
  }

  public getMode(): string {
    return this.mode;
  }
}

export const dbConnection = new DatabaseConnection();
