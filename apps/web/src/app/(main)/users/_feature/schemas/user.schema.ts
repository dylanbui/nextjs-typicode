import { z } from 'zod';
import { UserRole } from '@repo/shared';

// =========================================================================
// 1. 🛡️ USER ROUTE SLUG PARSER SCHEMA (Catch-All: /users/[[...slug]])
// =========================================================================

export const UserRouteSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('LIST'),
  }),
  z.object({
    type: z.literal('ADD'),
  }),
  z.object({
    type: z.literal('DETAIL'),
    id: z.coerce.number().int().positive('ID người dùng phải là số nguyên dương'),
  }),
  z.object({
    type: z.literal('UPDATE'),
    id: z.coerce.number().int().positive('ID người dùng phải là số nguyên dương'),
  }),
]);

export type UserRouteType = z.infer<typeof UserRouteSchema>;

export function parseUserRoute(slug?: string[]): UserRouteType | { type: 'NOT_FOUND' } {
  if (!slug || slug.length === 0) {
    return { type: 'LIST' };
  }
  if (slug.length === 1 && (slug[0] === 'add' || slug[0] === 'new')) {
    return { type: 'ADD' };
  }
  if (slug.length === 1 && /^\d+$/.test(slug[0])) {
    return { type: 'DETAIL', id: Number(slug[0]) };
  }
  if (slug.length === 2 && (slug[0] === 'update' || slug[0] === 'edit') && /^\d+$/.test(slug[1])) {
    return { type: 'UPDATE', id: Number(slug[1]) };
  }
  return { type: 'NOT_FOUND' };
}

// =========================================================================
// 2. 🛡️ USER FILTER SCHEMA
// =========================================================================

export const UserFilterSchema = z.object({
  role: z.enum(['admin', 'customer']).optional(),
  search: z.string().optional(),
});

export type UserFilterData = z.infer<typeof UserFilterSchema>;

// =========================================================================
// 3. 🛡️ USER FORM SCHEMA
// =========================================================================

export const UserFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Họ và tên phải có tối thiểu 2 ký tự')
    .max(60, 'Họ và tên tối đa 60 ký tự'),
  email: z
    .string()
    .trim()
    .min(1, 'Email không được để trống')
    .email('Email không đúng định dạng'),
  password: z
    .string()
    .min(4, 'Mật khẩu phải có tối thiểu 4 ký tự')
    .max(50, 'Mật khẩu tối đa 50 ký tự'),
  avatar: z
    .string()
    .trim()
    .url('Link avatar phải là URL hợp lệ (ví dụ: https://...)'),
  role: z.enum(['admin', 'customer'] as const, {
    message: 'Vai trò phải là admin hoặc customer',
  }),
});

export type UserFormData = z.infer<typeof UserFormSchema>;

export const SAMPLE_AVATARS = [
  'https://i.imgur.com/LDOO4Qs.jpg',
  'https://i.imgur.com/QkIa5tT.jpeg',
  'https://i.imgur.com/KeqdoEc.jpeg',
  'https://i.imgur.com/zKg0HVc.jpeg',
  'https://i.imgur.com/bp7uS0F.jpeg',
];
