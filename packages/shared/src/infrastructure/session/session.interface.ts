/**
 * ------------------------------------------------------------------
 * LAYER 1: DOMAIN - Session Manager Interface (Contract)
 * ------------------------------------------------------------------
 * Hợp đồng trừu tượng định nghĩa toàn bộ vòng đời (Lifecycle) của Session:
 * - Khởi tạo (createSession)
 * - Đọc session (getSession)
 * - Cập nhật dữ liệu / metadata (updateSession)
 * - Gia hạn phiên trượt 30 phút (refreshSession)
 * - Hủy session triệt để (destroySession)
 * - Giám sát kích thước & Header F12 (analyzeSize, getDebugHeaders)
 */

import { SessionData, SessionSizeReport } from './session.types';

export interface ISessionManager<TMetadata = Record<string, any>> {
  /**
   * Tạo chuỗi token mã hóa từ SessionData và lưu trữ cookie/session
   */
  createSession(data: SessionData<TMetadata>): Promise<string>;

  /**
   * Đọc và giải mã session hiện tại từ request context / cookie
   */
  getSession(): Promise<SessionData<TMetadata> | null>;

  /**
   * Cập nhật một phần dữ liệu hoặc metadata trong session
   */
  updateSession(patch: Partial<SessionData<TMetadata>>): Promise<SessionData<TMetadata> | null>;

  /**
   * Gia hạn thêm thời gian sống cho session (Sliding Window Session)
   */
  refreshSession(extendSeconds?: number): Promise<SessionData<TMetadata> | null>;

  /**
   * Hủy bỏ hoàn toàn session (Logout / Revocation)
   */
  destroySession(): Promise<void>;

  /**
   * Phân tích kích thước byte của token / payload và bóc tách các trường
   */
  analyzeSize(tokenOrData?: string | SessionData<TMetadata>): SessionSizeReport;

  /**
   * Trả về các headers giám sát an toàn (tự động tắt trên production)
   */
  getDebugHeaders(token?: string): Record<string, string>;
}
