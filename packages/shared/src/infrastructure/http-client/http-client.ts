/**
 * ------------------------------------------------------------------
 * LAYER 3: INFRASTRUCTURE - HTTP Client (Interface & Ky Implementation)
 * ------------------------------------------------------------------
 * Thiết kế theo chuẩn Clean Architecture (DIP - Dependency Inversion Principle):
 * - IHttpClient: Hợp đồng chung cho mọi HTTP Client (dễ dàng hoán đổi sang Fetch, Axios, Mock).
 * - KyHttpClient: Triển khai mặc định sử dụng thư viện `ky` (Sindre Sorhus) tối ưu cho Next.js 14:
 *   + Hỗ trợ Isomorphic: Chạy cả Server (Node/Edge) và Client (Trình duyệt).
 *   + Tích hợp sẵn Auto Retries thông minh với Exponential Backoff.
 *   + Hỗ trợ Hooks / Interceptors (Tự động gắn Bearer Auth Token, chuẩn hóa lỗi).
 *   + Tích hợp hàm upload hình ảnh đa năng (`uploadImage`).
 */

import ky, { isHTTPError, type KyInstance, type Options as KyOptions } from 'ky';
import { logger } from '../logger';

const BASE_URL = 'https://api.escuelajs.co/api/v1';

// ============================================================================
// 1. INTERFACES & TYPES
// ============================================================================

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  authToken?: string;
  timeout?: number | false;
  retry?: number | { limit?: number; statusCodes?: number[] };
  next?: { revalidate?: number | false; tags?: string[] };
  cache?: RequestCache;
}

export interface FileUploadResponse {
  originalname: string;
  filename: string;
  location: string;
}

export interface IHttpClient {
  get<T>(endpoint: string, options?: RequestOptions): Promise<T>;
  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T>;
  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T>;
  delete<T>(endpoint: string, options?: RequestOptions): Promise<T>;
  uploadImage(
    fileOrFormData: File | Blob | FormData,
    options?: RequestOptions
  ): Promise<FileUploadResponse>;
  setAuthToken(token: string | null): void;
  getAuthToken(): string | null;
}

// ============================================================================
// 2. KY HTTP CLIENT IMPLEMENTATION WITH AUTOMATED LOGGING
// ============================================================================

export class KyHttpClient implements IHttpClient {
  private client: KyInstance;
  private baseUrl: string;
  private currentAuthToken: string | null = null;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.client = ky.create({
      prefix: this.baseUrl,
      retry: {
        limit: 2,
        methods: ['get'],
        statusCodes: [408, 413, 429, 500, 502, 503, 504],
      },
      hooks: {
        beforeRequest: [
          ({ request }) => {
            const requestId = Math.random().toString(36).substring(2, 9);
            (request as any)._startTime = Date.now();
            (request as any)._requestId = requestId;

            if (this.currentAuthToken && !request.headers.has('Authorization')) {
              request.headers.set('Authorization', `Bearer ${this.currentAuthToken}`);
            }

            logger.debug(`[HTTP_REQ] [${request.method}] ${request.url}`, {
              requestId,
              method: request.method,
              url: request.url,
            });
          },
        ],
        afterResponse: [
          ({ request, response }) => {
            const startTime = (request as any)._startTime || Date.now();
            const durationMs = Date.now() - startTime;
            const requestId = (request as any)._requestId;

            if (durationMs > 1000) {
              logger.warn(`[SLOW_API] [${request.method}] ${request.url} (${durationMs}ms)`, {
                requestId,
                status: response.status,
                durationMs,
              });
            } else {
              logger.info(`[HTTP_RES] [${request.method}] ${request.url} - ${response.status} (${durationMs}ms)`, {
                requestId,
                status: response.status,
                durationMs,
              });
            }
          },
        ],
        beforeError: [
          async ({ error, request }) => {
            const requestId = (request as any)?._requestId;
            if (isHTTPError(error) && error.response) {
              try {
                const errorJson = (await error.response.json()) as any;
                const message = Array.isArray(errorJson?.message)
                  ? errorJson.message.join(', ')
                  : errorJson?.message ||
                    `HTTP Error ${error.response.status}: ${error.response.statusText}`;
                error.message = message;
              } catch {
                // Giữ nguyên error mặc định
              }
            }

            logger.error(`[HTTP_ERR] [${request?.method}] ${request?.url} thất bại: ${error.message}`, error, {
              requestId,
              status: isHTTPError(error) ? error.response?.status : undefined,
              url: request?.url,
            });

            return error;
          },
        ],
      },
    });
  }

  setAuthToken(token: string | null): void {
    this.currentAuthToken = token;
  }

  getAuthToken(): string | null {
    return this.currentAuthToken;
  }

  private buildKyOptions(options?: RequestOptions): KyOptions {
    const kyOptions: KyOptions = {};

    if (options?.params) {
      const searchParams: Record<string, string> = {};
      Object.entries(options.params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams[key] = String(val);
        }
      });
      kyOptions.searchParams = searchParams;
    }

    if (options?.headers) {
      kyOptions.headers = { ...options.headers };
    }

    if (options?.authToken) {
      kyOptions.headers = {
        ...(kyOptions.headers as Record<string, string> | undefined),
        Authorization: `Bearer ${options.authToken}`,
      };
    }

    if (options?.timeout !== undefined) {
      kyOptions.timeout = options.timeout;
    }

    if (options?.retry !== undefined) {
      kyOptions.retry = options.retry;
    }

    // Tương thích Next.js 14 Extended Fetch Cache Options
    if (options?.next || options?.cache) {
      (kyOptions as any).next = options.next;
      if (options.cache) (kyOptions as any).cache = options.cache;
    }

    return kyOptions;
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    return await this.client.get(cleanEndpoint, this.buildKyOptions(options)).json<T>();
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const kyOptions = this.buildKyOptions(options);
    if (body !== undefined) {
      kyOptions.json = body;
    }
    return await this.client.post(cleanEndpoint, kyOptions).json<T>();
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const kyOptions = this.buildKyOptions(options);
    if (body !== undefined) {
      kyOptions.json = body;
    }
    return await this.client.put(cleanEndpoint, kyOptions).json<T>();
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const response = await this.client.delete(cleanEndpoint, this.buildKyOptions(options));
    if (response.status === 204) {
      return {} as T;
    }
    try {
      return (await response.json()) as T;
    } catch {
      return true as unknown as T;
    }
  }

  /**
   * 📤 Upload hình ảnh lên Platzi API (/files/upload)
   * Nhận File, Blob hoặc FormData và trả về URL ảnh lưu trữ trên server.
   */
  async uploadImage(
    fileOrFormData: File | Blob | FormData,
    options?: RequestOptions
  ): Promise<FileUploadResponse> {
    let formData: FormData;
    if (typeof FormData !== 'undefined' && fileOrFormData instanceof FormData) {
      formData = fileOrFormData;
    } else {
      formData = new FormData();
      formData.append('file', fileOrFormData as Blob);
    }

    const cleanEndpoint = 'files/upload';
    const kyOptions = this.buildKyOptions(options);
    kyOptions.body = formData;

    return await this.client.post(cleanEndpoint, kyOptions).json<FileUploadResponse>();
  }
}

// ============================================================================
// 3. EXPORTS & ALIASES
// ============================================================================

// Alias HttpClient để đảm bảo tương thích ngược 100%
export const HttpClient = KyHttpClient;
export type HttpClient = KyHttpClient;

// Instance mặc định dùng chung
export const defaultHttpClient: IHttpClient = new KyHttpClient();
