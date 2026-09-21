'use server';

import 'server-only';
import { getCurrentUser } from '@/lib/session.server';
import type { SessionData } from '@repo/shared';

/**
 * ⚡ SERVER ACTION: Lấy thông tin session hiện tại cho Client Components
 */
export async function getCurrentSessionAction(): Promise<SessionData | null> {
  return await getCurrentUser();
}
