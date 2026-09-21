/**
 * ------------------------------------------------------------------
 * LAYER 1: DOMAIN - Repository Interfaces (Contracts)
 * ------------------------------------------------------------------
 * Định nghĩa các "hợp đồng" (Interface) để truy xuất dữ liệu:
 * - Domain và Use Cases chỉ biết Interface này, không quan tâm dữ liệu lấy từ đâu (API, DB, Mock).
 * - Lớp Infrastructure sẽ là nơi triển khai (implement) thực tế.
 */

import {
  AuthTokens,
  Category,
  CreateProductInput,
  CreateUserInput,
  LoginCredentials,
  Product,
  ProductFilter,
  UpdateProductInput,
  UpdateUserInput,
  User,
  UserFilter,
} from '../types/types';
import { SessionData } from '../../infrastructure/session/session.types';

export interface IProductRepository {
  getProducts(filter?: ProductFilter): Promise<Product[]>;
  getProductById(id: number): Promise<Product>;
  createProduct(input: CreateProductInput): Promise<Product>;
  updateProduct(id: number, input: UpdateProductInput): Promise<Product>;
  deleteProduct(id: number): Promise<boolean>;
}

export interface ICategoryRepository {
  getCategories(limit?: number): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category>;
}

export interface IUserRepository {
  getUsers(filter?: UserFilter): Promise<User[]>;
  getUserById(id: number): Promise<User>;
  createUser(input: CreateUserInput): Promise<User>;
  updateUser(id: number, input: UpdateUserInput): Promise<User>;
  deleteUser(id: number): Promise<boolean>;
}

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthTokens>;
  getProfile(token: string): Promise<User>;
  refreshToken(refreshToken: string): Promise<AuthTokens>;
}

export interface ISessionRepository {
  saveSession(session: SessionData): Promise<void>;
  findSessionById(sessionId: string): Promise<SessionData | null>;
  deleteSession(sessionId: string): Promise<void>;
  cleanExpiredSessions(): Promise<number>;
}
