import 'server-only';

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma.server';
import { authConfig } from '@/auth.config';

/**
 * ------------------------------------------------------------------
 * DEMO ACCOUNTS SEED HELPER (Khởi tạo tài khoản mẫu vào SQLite)
 * ------------------------------------------------------------------
 */
async function ensureDemoAccounts() {
  try {
    const demoAccounts = [
      {
        name: 'John Doe',
        email: 'john@mail.com',
        plainPassword: 'changeme',
        role: 'admin',
        image: 'https://i.pravatar.cc/150?img=12',
      },
      {
        name: 'Maria Garcia',
        email: 'maria@mail.com',
        plainPassword: '12345',
        role: 'customer',
        image: 'https://i.pravatar.cc/150?img=47',
      },
    ];

    for (const acc of demoAccounts) {
      const existing = await prisma.user.findUnique({
        where: { email: acc.email },
      });

      if (!existing) {
        const hashedPassword = await bcrypt.hash(acc.plainPassword, 10);
        await prisma.user.create({
          data: {
            name: acc.name,
            email: acc.email,
            password: hashedPassword,
            role: acc.role,
            image: acc.image,
            metadata: JSON.stringify({ theme: 'dark', demo: true }),
          },
        });
      }
    }
  } catch (error) {
    console.warn('[Auth Seed] Không thể tự khởi tạo demo accounts:', error);
  }
}

/**
 * ------------------------------------------------------------------
 * AUTH.JS NODE RUNTIME (auth.ts)
 * ------------------------------------------------------------------
 * Quản lý xác thực đầy đủ với Database Prisma SQLite:
 * 1. PrismaAdapter: Lưu trữ User, Account, Session, VerificationToken.
 * 2. CredentialsProvider: Đăng nhập Email + Mật khẩu (bcrypt hash).
 * 3. GoogleProvider: OAuth 2.0 + Account Linking.
 * 4. FacebookProvider: OAuth 2.0 + Account Linking.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || 'typicode-super-secure-auth-secret-key-2026',
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // 30 phút
  },
  providers: [
    // 1. Google OAuth Provider (Hỗ trợ Account Linking)
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || 'mock-google-client-id',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || 'mock-google-client-secret',
      allowDangerousEmailAccountLinking: true,
    }),

    // 2. Facebook OAuth Provider (Hỗ trợ Account Linking)
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID || process.env.FACEBOOK_CLIENT_ID || 'mock-facebook-client-id',
      clientSecret: process.env.AUTH_FACEBOOK_SECRET || process.env.FACEBOOK_CLIENT_SECRET || 'mock-facebook-client-secret',
      allowDangerousEmailAccountLinking: true,
    }),

    // 3. Credentials Provider (Email & Password với bcrypt)
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        // Đảm bảo có tài khoản demo nếu chưa seed
        await ensureDemoAccounts();

        // Tìm User trong cơ sở dữ liệu Prisma SQLite
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        // Kiểm tra mật khẩu mã hóa bcrypt
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return null;
        }

        // Ghi nhận Activity Log vào SQLite
        try {
          await prisma.userActivityLog.create({
            data: {
              userId: user.id,
              action: 'LOGIN',
              details: `Đăng nhập thành công qua Credentials (${user.role})`,
            },
          });
        } catch (logError) {
          console.warn('[Auth Log] Không thể ghi nhật ký hoạt động:', logError);
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          status: user.status,
          metadata: user.metadata,
        };
      },
    }),
  ],
});
