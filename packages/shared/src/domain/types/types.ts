/**
 * ------------------------------------------------------------------
 * LAYER 1: DOMAIN - Data Types & Entities
 * ------------------------------------------------------------------
 * Đây là lớp cốt lõi nhất trong Clean Architecture:
 * - Định nghĩa cấu trúc dữ liệu thuần túy (TypeScript Types / Interfaces).
 * - Không phụ thuộc vào bất kỳ framework (React/Next.js) hay API bên ngoài nào.
 */

// ============================================================================
// 1. CATEGORY & PRODUCT DOMAIN
// ============================================================================

export interface Category {
  id: number;
  name: string;
  image: string;
  creationAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
  creationAt?: string;
  updatedAt?: string;
}

export interface CreateProductInput {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  images: string[];
}

export interface UpdateProductInput {
  title?: string;
  price?: number;
  description?: string;
  categoryId?: number;
  images?: string[];
}

export interface ProductFilter {
  title?: string;
  price?: number;
  price_min?: number;
  price_max?: number;
  categoryId?: number;
  offset?: number;
  limit?: number;
}

// ============================================================================
// 1.5. POSTS DOMAIN
// ============================================================================

export interface Post {
  id: number;
  title: string;
  body: string;
  author: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  viewsCount?: number;
}

export interface CreatePostInput {
  title: string;
  body: string;
  author: string;
  tags?: string[];
}

export interface UpdatePostInput {
  title?: string;
  body?: string;
  author?: string;
  tags?: string[];
}

// ============================================================================
// 2. USER & AUTH DOMAIN
// ============================================================================

export type UserRole = 'admin' | 'customer';

export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  avatar: string;
  creationAt?: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  avatar: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  role?: UserRole;
}

export interface UserFilter {
  role?: UserRole;
  limit?: number;
  offset?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthSession {
  user: User;
  tokens: AuthTokens;
}

// ============================================================================
// 4. DASHBOARD DOMAIN
// ============================================================================

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  recentProducts: Product[];
  recentUsers: User[];
}
