import { z } from 'zod';

// =========================================================================
// 🛡️ LOGIN & REGISTER SCHEMAS
// =========================================================================

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập địa chỉ Email')
    .email('Địa chỉ Email không đúng định dạng'),
  password: z
    .string()
    .min(4, 'Mật khẩu phải có tối thiểu 4 ký tự')
    .max(100, 'Mật khẩu không được vượt quá 100 ký tự'),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Họ và tên phải có tối thiểu 2 ký tự')
      .max(60, 'Họ và tên không được vượt quá 60 ký tự'),
    email: z
      .string()
      .trim()
      .min(1, 'Vui lòng nhập địa chỉ Email')
      .email('Địa chỉ Email không đúng định dạng'),
    password: z
      .string()
      .min(6, 'Mật khẩu phải có tối thiểu 6 ký tự')
      .max(100, 'Mật khẩu không được vượt quá 100 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;

// Demo Accounts có sẵn trong hệ thống
export const DEMO_ACCOUNTS = [
  {
    name: 'John Doe',
    email: 'john@mail.com',
    password: 'changeme',
    role: 'Admin',
    description: 'Tài khoản Quản trị viên (Toàn quyền hệ thống)',
    badge: 'bg-primary',
  },
  {
    name: 'Maria Garcia',
    email: 'maria@mail.com',
    password: '12345',
    role: 'Customer',
    description: 'Tài khoản Khách hàng / Người dùng',
    badge: 'bg-info',
  },
];
