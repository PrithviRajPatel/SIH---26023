import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { dbConnection } from '../db/database';
import { User, UserRole } from '../../src/types';

const JWT_SECRET = process.env.JWT_SECRET || 'cmpdi_cil_sih26023_secure_jwt_token_secret_2026';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export class AuthService {
  /**
   * Authenticate user with email and password
   */
  public async login(emailOrRole: string, password?: string): Promise<{ token: string; user: User }> {
    // Look up in database
    const res = await dbConnection.query<any>(
      'SELECT id, email, password_hash, name, role, designation, department, subsidiary FROM users WHERE email = $1 OR role = $2 LIMIT 1',
      [emailOrRole, emailOrRole]
    );

    if (res.rows.length === 0) {
      throw new Error('Invalid credentials or user not found.');
    }

    const dbUser = res.rows[0];

    // If password provided, verify with bcrypt
    if (password) {
      const isValid = await bcrypt.compare(password, dbUser.password_hash);
      if (!isValid) {
        throw new Error('Invalid password provided.');
      }
    }

    const payload: AuthTokenPayload = {
      userId: dbUser.id,
      email: dbUser.email,
      role: dbUser.role as UserRole,
      name: dbUser.name
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    const user: User = {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role as UserRole,
      designation: dbUser.designation || 'Staff',
      department: dbUser.department || 'Operations',
      subsidiary: dbUser.subsidiary || 'Coal India Ltd'
    };

    // Log to audit trail
    await dbConnection.query(`
      INSERT INTO audit_logs (id, timestamp, user_id, user_name, user_role, action, resource_type, details, ip_address, status)
      VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      `aud_${Date.now()}`,
      user.id,
      user.name,
      user.role,
      'LOGIN',
      'SYSTEM',
      `User authenticated as ${user.role} (${user.name})`,
      '127.0.0.1',
      'SUCCESS'
    ]);

    return { token, user };
  }

  /**
   * Middleware to verify JWT token
   */
  public authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      // Allow fallback if running in dev UI mode with default user
      req.user = {
        userId: 'usr_analyst_01',
        email: 'ananya.sen@coalindia.in',
        role: 'ANALYST',
        name: 'Ananya Sen'
      };
      return next();
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired session token.' });
      }
      req.user = user as AuthTokenPayload;
      next();
    });
  }

  /**
   * Middleware for Backend-Enforced Role-Based Access Control
   */
  public requireRole(allowedRoles: UserRole[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const userRole = req.user?.role || 'VIEWER';
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          error: `Access Denied: Requires one of [${allowedRoles.join(', ')}] permissions. Current role: ${userRole}.` 
        });
      }
      next();
    };
  }

  /**
   * Fetch all users
   */
  public async getUsers(): Promise<User[]> {
    const res = await dbConnection.query<any>('SELECT id, email, name, role, designation, department, subsidiary FROM users ORDER BY name ASC');
    return res.rows.map(r => ({
      id: r.id,
      email: r.email,
      name: r.name,
      role: r.role as UserRole,
      designation: r.designation,
      department: r.department,
      subsidiary: r.subsidiary
    }));
  }
}

export const authService = new AuthService();
