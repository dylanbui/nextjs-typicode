/**
 * ------------------------------------------------------------------
 * LAYER 3: INFRASTRUCTURE - Jose Cookie Session Manager
 * ------------------------------------------------------------------
 * Triển khai ISessionManager dựa trên thư viện `jose` (WebCrypto API):
 * - Hoàn toàn Isomorphic (Chạy trên Edge Middleware, Server Actions, RSC).
 * - Ký số HMAC-SHA256 (0.02ms) bảo vệ tính toàn vẹn của Session.
 * - Cookie Guard: Tự động đo kích thước Byte, cảnh báo khi > 2KB, nguy hiểm khi > 3.8KB.
 * - Breakdown Analyzer: Bóc tách chi tiết từng trường để tìm thủ phạm ngốn dung lượng.
 * - Debug Headers: Sinh header X-Session-Size-Bytes (Tự động tắt trên Production).
 */

import * as jose from 'jose';
import { ISessionManager } from './session.interface';
import { SessionData, SessionSizeReport } from './session.types';

const DEFAULT_SECRET = 'typicode_enterprise_secure_secret_key_32bytes_min!';
const MAX_COOKIE_SIZE = 4096;
const WARNING_THRESHOLD = 2048;
const DANGER_THRESHOLD = 3800;

export interface CookieAdapter {
  get(name: string): Promise<string | undefined> | string | undefined;
  set(name: string, value: string, options: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax' | 'strict' | 'none';
    path: string;
    maxAge: number;
    expires?: Date;
  }): Promise<void> | void;
  delete(name: string): Promise<void> | void;
}

export class JoseCookieSessionManager<TMetadata = Record<string, any>>
  implements ISessionManager<TMetadata>
{
  private secretKey: Uint8Array;
  private cookieName: string;
  private cookieAdapter?: CookieAdapter;

  constructor(options?: {
    secret?: string;
    cookieName?: string;
    cookieAdapter?: CookieAdapter;
  }) {
    const secret = options?.secret || (typeof process !== 'undefined' ? process.env.SESSION_SECRET : undefined) || DEFAULT_SECRET;
    this.secretKey = new TextEncoder().encode(secret);
    this.cookieName = options?.cookieName || 'auth_session';
    this.cookieAdapter = options?.cookieAdapter;
  }

  public setCookieAdapter(adapter: CookieAdapter): void {
    this.cookieAdapter = adapter;
  }

  /**
   * 1. Ký và mã hóa Session thành chuỗi Token an toàn
   */
  async createToken(data: SessionData<TMetadata>): Promise<string> {
    const nowSec = Math.floor(Date.now() / 1000);
    const expSec = data.expiresAt
      ? (data.expiresAt > 10_000_000_000 ? Math.floor(data.expiresAt / 1000) : data.expiresAt)
      : nowSec + 1800;

    const token = await new jose.SignJWT({ ...data, expiresAt: expSec })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expSec)
      .sign(this.secretKey);

    // 📏 Cookie Guard: Đo kích thước thực tế
    const report = this.analyzeSize(token, data);

    if (report.status === 'WARNING') {
      console.warn(
        `⚠️ [COOKIE_GUARD_WARNING] Session Cookie đang ở mức ${report.sizeBytes}B / ${MAX_COOKIE_SIZE}B (${report.usagePercent}%). Hãy cân nhắc tối ưu metadata!`
      );
    } else if (report.status === 'DANGER') {
      console.error(
        `🚨 [COOKIE_GUARD_CRITICAL] Session Cookie sắp chạm trần: ${report.sizeBytes}B / ${MAX_COOKIE_SIZE}B! Nguy cơ mất session.`
      );
      if (typeof console.table === 'function') {
        console.table(report.breakdown);
      }
    }

    return token;
  }

  /**
   * 2. Giải mã và verify token trong 0.02ms
   */
  async verifyToken(token: string): Promise<SessionData<TMetadata> | null> {
    try {
      const { payload } = await jose.jwtVerify(token, this.secretKey, {
        algorithms: ['HS256'],
      });
      return payload as unknown as SessionData<TMetadata>;
    } catch {
      return null;
    }
  }

  /**
   * 3. Khởi tạo & Lưu Session mới (Login)
   */
  async createSession(data: SessionData<TMetadata>): Promise<string> {
    const token = await this.createToken(data);

    if (this.cookieAdapter) {
      const nowSeconds = Math.floor(Date.now() / 1000);
      const maxAge = Math.max(0, data.expiresAt - nowSeconds);

      await this.cookieAdapter.set(this.cookieName, token, {
        httpOnly: true,
        secure: typeof process !== 'undefined' ? process.env.NODE_ENV === 'production' : false,
        sameSite: 'lax',
        path: '/',
        maxAge: maxAge || 1800,
      });
    }

    return token;
  }

  /**
   * 4. Lấy Session hiện tại
   */
  async getSession(): Promise<SessionData<TMetadata> | null> {
    if (!this.cookieAdapter) {
      return null;
    }
    const token = await this.cookieAdapter.get(this.cookieName);
    if (!token) return null;
    return this.verifyToken(token);
  }

  /**
   * 5. Cập nhật 1 phần dữ liệu / metadata
   */
  async updateSession(
    patch: Partial<SessionData<TMetadata>>
  ): Promise<SessionData<TMetadata> | null> {
    const current = await this.getSession();
    if (!current) return null;

    const updatedData: SessionData<TMetadata> = {
      ...current,
      ...patch,
      metadata: {
        ...(current.metadata || {}),
        ...(patch.metadata || {}),
      } as TMetadata,
    };

    await this.createSession(updatedData);
    return updatedData;
  }

  /**
   * 6. Gia hạn phiên trượt 30 phút (Sliding Window Session)
   */
  async refreshSession(extendSeconds: number = 1800): Promise<SessionData<TMetadata> | null> {
    const current = await this.getSession();
    if (!current) return null;

    const nowSeconds = Math.floor(Date.now() / 1000);
    current.expiresAt = nowSeconds + extendSeconds;

    await this.createSession(current);
    return current;
  }

  /**
   * 7. 🛑 HỦY SESSION TRIỆT ĐỂ (Logout)
   */
  async destroySession(): Promise<void> {
    if (this.cookieAdapter) {
      await this.cookieAdapter.set(this.cookieName, '', {
        httpOnly: true,
        secure: typeof process !== 'undefined' ? process.env.NODE_ENV === 'production' : false,
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
        expires: new Date(0),
      });
      await this.cookieAdapter.delete(this.cookieName);
    }
  }

  /**
   * 8. Phân tích kích thước byte & bóc tách từng trường
   */
  analyzeSize(tokenOrData?: string | SessionData<TMetadata>, dataObj?: SessionData<TMetadata>): SessionSizeReport {
    let sizeBytes = 0;
    let data = dataObj;

    if (typeof tokenOrData === 'string') {
      sizeBytes = new TextEncoder().encode(tokenOrData).length;
    } else if (tokenOrData) {
      data = tokenOrData;
      sizeBytes = new TextEncoder().encode(JSON.stringify(tokenOrData)).length;
    }

    const usagePercent = Math.round((sizeBytes / MAX_COOKIE_SIZE) * 100);

    let status: SessionSizeReport['status'] = 'SAFE';
    if (sizeBytes >= DANGER_THRESHOLD) status = 'DANGER';
    else if (sizeBytes >= WARNING_THRESHOLD) status = 'WARNING';

    const breakdown: Array<{ field: string; sizeBytes: number }> = [];
    if (data) {
      Object.entries(data).forEach(([key, val]) => {
        breakdown.push({
          field: key,
          sizeBytes: new TextEncoder().encode(JSON.stringify(val ?? '')).length,
        });
      });
      breakdown.sort((a, b) => b.sizeBytes - a.sizeBytes);
    }

    return { sizeBytes, maxBytes: MAX_COOKIE_SIZE, usagePercent, status, breakdown };
  }

  /**
   * 9. Sinh Header giám sát F12 (Bảo vệ Production)
   */
  getDebugHeaders(token?: string): Record<string, string> {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production' && !process.env.ENABLE_DEBUG_HEADERS) {
      return {};
    }

    if (!token) return {};

    const size = new TextEncoder().encode(token).length;
    return {
      'X-Session-Size-Bytes': String(size),
      'X-Session-Usage-Percent': `${Math.round((size / MAX_COOKIE_SIZE) * 100)}%`,
    };
  }
}

// Instance mặc định
export const defaultSessionManager = new JoseCookieSessionManager();
