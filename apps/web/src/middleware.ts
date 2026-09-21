import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

/**
 * ------------------------------------------------------------------
 * EDGE MIDDLEWARE AUTH FIREWALL (Auth.js v5)
 * ------------------------------------------------------------------
 * - Xác thực token trực tiếp ở Edge Runtime (~0.02ms) không tốn DB roundtrip.
 * - Tự động bảo vệ các tuyến /dashboard, /users.
 * - Tự động chuyển hướng người dùng đã login ra khỏi /login.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const isLoginPage = pathname === '/login' || pathname.startsWith('/login/');
  const isPublicApi = pathname.startsWith('/api/auth');
  const isProtected = !isLoginPage && !isPublicApi;

  // 1. Chuyển hướng nếu đã đăng nhập mà vào lại trang /login
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 2. Chặn và chuyển hướng về /login nếu truy cập trang bảo vệ khi chưa đăng nhập
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, svg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
