'use server';

import 'server-only';
import { signOut } from '@/auth';

/**
 * ⚡ SERVER ACTION: Đăng xuất người dùng khỏi hệ thống
 */
export async function logoutAction() {
  await signOut({ redirectTo: '/login' });
}
