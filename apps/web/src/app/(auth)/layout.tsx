import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Xác Thực & Đăng Nhập | TypiCode',
  description: 'Đăng nhập vào hệ thống quản trị TypiCode',
};

/**
 * 🚪 AUTH GROUP LAYOUT: Layout chuẩn cho các trang xác thực (Login, Register)
 * - Thuần Server Component 100%
 * - 🛡️ ROUTE GROUP SERVER GUARD: Kiểm tra nếu user đã đăng nhập -> Chuyển hướng ngay về /dashboard.
 * - Không có Navbar hay Sidebar thừa, căn giữa toàn màn hình min-vh-100
 */
export default async function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🛡️ Lớp bảo vệ: Người dùng đã đăng nhập không cần vào lại trang /login
  const session = await auth();
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <main className="min-vh-100 w-100 p-0 m-0 bg-light d-flex align-items-center justify-content-center">
      {children}
    </main>
  );
}
