import { CategoryApiRepository } from '../domain/repositories/category.repository';
import { ProductApiRepository } from '../domain/repositories/product.repository';
import { AuthApiRepository } from '../domain/repositories/auth.repository';
import { UserApiRepository } from '../domain/repositories/user.repository';
import { JoseCookieSessionManager } from './session/jose-cookie-session.manager';

export * from './http-client/http-client';
export * from '../domain/repositories/product.repository';
export * from '../domain/repositories/category.repository';
export * from '../domain/repositories/auth.repository';
export * from '../domain/repositories/user.repository';
export * from './session';
export * from './router/RouteDispatcher';
export * from './router/ActionDispatcher';
export * from './logger';

// Khởi tạo sẵn các instances mặc định
export const productRepository = new ProductApiRepository();
export const categoryRepository = new CategoryApiRepository();
export const authRepository = new AuthApiRepository();
export const userRepository = new UserApiRepository();
export const sessionManager = new JoseCookieSessionManager();
