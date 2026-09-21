import 'server-only';

import React from 'react';
import { redirect } from 'next/navigation';
import {
  productRepository,
  categoryRepository,
  userRepository,
} from '@repo/shared';
import { getCurrentUser } from '@/lib/session.server';
import { DashboardOverviewView } from '../views/DashboardOverviewView';

// =========================================================================
// 🎬 DASHBOARD ACTION HANDLERS (Return React Elements for ActionDispatcher)
// =========================================================================

/**
 * 1. Action mặc định (/dashboard hoặc /dashboard/overview)
 */
export async function indexAction() {
  const user = await getCurrentUser();

  // Nếu chưa đăng nhập hoặc hết hạn, redirect về /login
  if (!user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  // Fetch song song 3 nguồn dữ liệu
  const [products, categories, users] = await Promise.all([
    productRepository.getProducts({ limit: 10 }).catch(() => []),
    categoryRepository.getCategories().catch(() => []),
    userRepository.getUsers({ limit: 10 }).catch(() => []),
  ]);

  return (
    <DashboardOverviewView
      user={user}
      totalProducts={products.length > 0 ? 50 : 0}
      totalCategories={categories.length}
      totalUsers={users.length > 0 ? 30 : 0}
      recentProducts={products.slice(0, 5)}
      recentUsers={users.slice(0, 5)}
    />
  );
}

/**
 * Alias cho indexAction
 */
export const overviewAction = indexAction;

/**
 * 2. Phím tắt chuyển hướng sang module Products (/dashboard/products)
 */
export async function productsAction() {
  redirect('/products');
}

/**
 * 3. Phím tắt chuyển hướng sang module Users (/dashboard/users)
 */
export async function usersAction() {
  redirect('/users');
}
