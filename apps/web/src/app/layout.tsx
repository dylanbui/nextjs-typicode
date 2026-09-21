import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell.client';

export const metadata: Metadata = {
  title: 'TypiCode - Clean Architecture with Next.js & TypeScript',
  description: 'Dự án học tập TypeScript & React với kiến trúc Clean Architecture 4 lớp tối giản kết hợp Monorepo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
