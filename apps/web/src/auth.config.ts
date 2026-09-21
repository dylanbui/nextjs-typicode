import type { NextAuthConfig } from 'next-auth';

/**
 * ------------------------------------------------------------------
 * AUTH.JS EDGE CONFIGURATION (auth.config.ts)
 * ------------------------------------------------------------------
 * Cấu hình tương thích hoàn toàn với Next.js Edge Runtime (Middleware):
 * - Tuyệt đối KHÔNG import PrismaClient hoặc native Node.js modules tại đây.
 * - Xử lý JWT & Session Claims (id, role, metadata) chuyển đổi giữa Client/Server.
 * - Cung cấp hàm `authorized` cho Middleware kiểm tra quyền truy cập routes.
 */
export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET || 'typicode-super-secure-auth-secret-key-2026',
  pages: {
    signIn: '/login',
    newUser: '/dashboard',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // 30 phút session
  },
  providers: [], // Sẽ được bổ sung đầy đủ trong auth.ts (Node Runtime)
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as any).role || 'customer';
        token.status = (user as any).status || 'active';
        token.metadata = (user as any).metadata || null;
      }
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = (token.role as string) || 'customer';
        (session.user as any).status = (token.status as string) || 'active';
        (session.user as any).metadata = token.metadata || null;
      }
      return session;
    },

    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      const isProtected =
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/users');
      const isLoginPage = pathname === '/login' || pathname.startsWith('/login/');

      // 1. Chuyển hướng về /dashboard nếu đã đăng nhập mà cố vào /login
      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl.origin));
      }

      // 2. Chặn truy cập trang bảo vệ nếu chưa đăng nhập
      if (isProtected) {
        return isLoggedIn;
      }

      return true;
    },
  },
};
