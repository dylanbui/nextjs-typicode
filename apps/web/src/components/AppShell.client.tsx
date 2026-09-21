'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * 🖥️ APP SHELL: Điều phối layout toàn cục
 * - Trang /login & /login/*: Ẩn Navbar & Footer, full viewport 100vh căn giữa, không có scrollbar ngoài ý muốn.
 * - Các trang nghiệp vụ khác: Hiển thị Navbar, Container chính, và Footer.
 */
export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/login');

  if (isAuthPage) {
    return (
      <main className="min-vh-100 w-100 p-0 m-0 bg-light d-flex align-items-center justify-content-center">
        {children}
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="py-4">
        <div className="container">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
