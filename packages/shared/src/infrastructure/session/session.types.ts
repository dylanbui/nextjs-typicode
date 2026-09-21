
// ============================================================================
// 3. SESSION MANAGEMENT DOMAIN (Generic Session with Metadata)
// ============================================================================

import { UserRole } from "../../domain";

export interface SessionData<TMetadata = Record<string, any>> {
  sessionId: string;
  userId: number;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  userAvatar?: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // Unix timestamp in seconds
  metadata?: TMetadata; // Hỗ trợ lưu int, string, json tùy biến
}

export interface SessionSizeReport {
  sizeBytes: number;
  maxBytes: number;
  usagePercent: number;
  status: 'SAFE' | 'WARNING' | 'DANGER';
  breakdown: Array<{ field: string; sizeBytes: number }>;
}
