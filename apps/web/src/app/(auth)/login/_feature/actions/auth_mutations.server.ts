'use server';

import 'server-only';
import { signIn } from '@/auth';
import { prisma } from '@/lib/prisma.server';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { LoginSchema, RegisterSchema } from '../schemas/auth.schema';

export interface MutationResult {
  success: boolean;
  error?: string;
  redirectUrl?: string;
}

/**
 * ⚡ SERVER ACTION: Đăng nhập bằng Email & Mật khẩu (Credentials)
 */
export async function credentialsLoginAction(
  formData: unknown,
  callbackUrl: string = '/dashboard'
): Promise<MutationResult> {
  try {
    const parsed = LoginSchema.safeParse(formData);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((i) => i.message).join(', ');
      return { success: false, error: errorMessage };
    }

    const { email, password } = parsed.data;

    // Thực hiện đăng nhập qua Auth.js v5
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl.startsWith('/') ? callbackUrl : '/dashboard',
    });

    return {
      success: true,
      redirectUrl: callbackUrl,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, error: 'Email hoặc mật khẩu không chính xác!' };
        case 'OAuthAccountNotLinked':
          return {
            success: false,
            error: 'Email này đã được liên kết với nhà cung cấp OAuth khác. Vui lòng đăng nhập bằng Google hoặc Facebook!',
          };
        default:
          return { success: false, error: 'Đăng nhập không thành công. Vui lòng thử lại!' };
      }
    }

    // Next.js redirect() throws an error internally with digest 'NEXT_REDIRECT'
    if ((error as any)?.message?.includes('NEXT_REDIRECT') || (error as any)?.digest?.includes('NEXT_REDIRECT')) {
      throw error;
    }

    console.error('Lỗi khi xử lý credentialsLoginAction:', error);
    return { success: false, error: 'Đã có lỗi xảy ra trong quá trình xác thực.' };
  }
}

/**
 * ⚡ SERVER ACTION: Đăng ký tài khoản mới (Sign Up)
 */
export async function registerUserAction(formData: unknown): Promise<MutationResult> {
  try {
    const parsed = RegisterSchema.safeParse(formData);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((i) => i.message).join(', ');
      return { success: false, error: errorMessage };
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Kiểm tra email đã tồn tại trong SQLite chưa
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return {
        success: false,
        error: 'Địa chỉ Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác!',
      };
    }

    // 2. Hash mật khẩu bằng bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Tạo User mới trong SQLite
    const newUser = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: 'customer',
        status: 'active',
        image: `https://i.pravatar.cc/150?u=${encodeURIComponent(normalizedEmail)}`,
        metadata: JSON.stringify({ theme: 'dark', registeredAt: new Date().toISOString() }),
      },
    });

    // 4. Ghi nhận Activity Log
    try {
      await prisma.userActivityLog.create({
        data: {
          userId: newUser.id,
          action: 'REGISTER',
          details: `Người dùng ${name} (${normalizedEmail}) đăng ký tài khoản mới thành công`,
        },
      });
    } catch (logErr) {
      console.warn('Lỗi ghi activity log:', logErr);
    }

    return {
      success: true,
      redirectUrl: '/login?registered=true',
    };
  } catch (error) {
    console.error('Lỗi khi xử lý registerUserAction:', error);
    return {
      success: false,
      error: 'Không thể tạo tài khoản vào lúc này. Vui lòng thử lại sau!',
    };
  }
}

/**
 * ⚡ SERVER ACTION: Kích hoạt luồng OAuth (Google / Facebook)
 */
export async function oauthSignInAction(
  provider: 'google' | 'facebook',
  callbackUrl: string = '/dashboard'
) {
  await signIn(provider, {
    redirectTo: callbackUrl.startsWith('/') ? callbackUrl : '/dashboard',
  });
}
