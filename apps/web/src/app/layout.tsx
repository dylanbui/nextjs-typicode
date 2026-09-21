import type { Metadata } from 'next';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}

