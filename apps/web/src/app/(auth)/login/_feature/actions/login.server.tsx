import 'server-only';

import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session.server';
import { LoginView } from '../views/LoginView.client';
import { RegisterView } from '../views/RegisterView.client';

// =========================================================================
// 🎬 LOGIN ACTION HANDLERS (Return React Elements for ActionDispatcher)
// =========================================================================

/**
 * 1. Action hiển thị màn hình Đăng nhập chính (/login)
 */
export async function indexAction() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/dashboard');
  }

  return (
    <Suspense
      fallback={
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      }
    >
      <LoginView />
    </Suspense>
  );
}

/**
 * 2. Action hiển thị màn hình Đăng ký tài khoản (/login/register)
 */
export async function registerAction() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/dashboard');
  }

  return (
    <Suspense
      fallback={
        <div className="container py-5 text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      }
    >
      <RegisterView />
    </Suspense>
  );
}
