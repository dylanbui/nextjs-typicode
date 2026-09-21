import 'server-only';

/**
 * ------------------------------------------------------------------
 * WEB APP LIB: Request-Scoped Session Helper (SERVER ONLY)
 * ------------------------------------------------------------------
 * Cung cấp hàm `getCurrentUser()` tương thích ngược tối ưu cho Next.js App Router:
 * - Đọc session trực tiếp từ Auth.js v5 (NextAuth v5).
 * - Sử dụng React `cache()` để deduplicate request trong 1 chu kỳ render.
 */

import { cache } from 'react';
import { auth } from '@/auth';
import type { SessionData, UserRole } from '@repo/shared';

/**
 * 🛡️ Hàm tiện ích lấy Session người dùng hiện tại (Request-Scoped)
 * Dùng được ở mọi Server Component và Server Action.
 */
export const getCurrentUser = cache(async (): Promise<SessionData | null> => {
  try {
    const session = await auth();
    if (!session?.user) return null;

    const user = session.user as any;
    const nowSeconds = Math.floor(Date.now() / 1000);
    const expiresAtSeconds = session.expires
      ? Math.floor(new Date(session.expires).getTime() / 1000)
      : nowSeconds + 1800;

    let metadataParsed: any = undefined;
    if (typeof user.metadata === 'string') {
      try {
        metadataParsed = JSON.parse(user.metadata);
      } catch {
        metadataParsed = user.metadata;
      }
    } else {
      metadataParsed = user.metadata;
    }

    return {
      sessionId: user.id || 'session-authjs',
      userId: typeof user.id === 'number' ? user.id : 1,
      userName: user.name || 'Anonymous User',
      userEmail: user.email || '',
      userRole: (user.role as UserRole) || 'customer',
      userAvatar: user.image || undefined,
      accessToken: 'authjs-jwt-token',
      expiresAt: expiresAtSeconds,
      metadata: metadataParsed || { theme: 'dark' },
    };
  } catch (error) {
    console.error('Lỗi khi đọc session từ Auth.js:', error);
    return null;
  }
});
