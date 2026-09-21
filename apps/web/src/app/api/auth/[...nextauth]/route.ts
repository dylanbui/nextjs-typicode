import { handlers } from '@/auth';

/**
 * ------------------------------------------------------------------
 * AUTH.JS PROTOCOL GATEWAY ROUTE HANDLER
 * ------------------------------------------------------------------
 * Tiếp nhận toàn bộ luồng OAuth 2.0 / OpenID Connect từ Google, Facebook:
 * - /api/auth/signin
 * - /api/auth/callback/google
 * - /api/auth/callback/facebook
 * - /api/auth/signout
 * - /api/auth/session
 * - /api/auth/csrf
 */
export const { GET, POST } = handlers;
