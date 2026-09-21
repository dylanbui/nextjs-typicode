/**
 * ============================================================================
 * 🎼 ACTION DISPATCHER (AUTOMATIC RPC / CONTROLLER-ACTION DISPATCHER)
 * ============================================================================
 * 
 * Dispatcher phân tích mảng slug từ Next.js Catch-All Routes (`[[...slug]]`)
 * và tự động ánh xạ đến hàm Action tương ứng (theo phong cách Controller-Action của PHP):
 * 
 * - URL: /posts                 -> gọi indexAction(searchParams) hoặc listAction()
 * - URL: /posts/list            -> gọi listAction(searchParams) hoặc list()
 * - URL: /posts/add             -> gọi addAction() hoặc add()
 * - URL: /posts/edit/123        -> gọi editAction(123) hoặc edit(123)
 * - URL: /posts/delete/123      -> gọi deleteAction(123) hoặc delete(123)
 * - URL: /posts/view-detail/123 -> gọi viewDetailAction(123) hoặc viewDetail(123)
 * - URL: /posts/123             -> fallback gọi viewDetailAction(123) hoặc detailAction(123)
 * 
 * ============================================================================
 */

import { notFound } from 'next/navigation';
import { z } from 'zod';
import { logger } from '../logger';

export interface DispatchContext {
  slug: string[];
  searchParams: Record<string, string | string[] | undefined>;
  actionName: string;
  startTime: number;
}

export interface DispatcherOptions {
  /** Danh sách tên hàm ưu tiên khi slug rỗng (Mặc định: ['indexAction', 'index', 'listAction', 'list']) */
  defaultActionNames?: string[];
  /** Tên hàm fallback khi slug chỉ có 1 số ID: /module/123 (Mặc định: ['viewDetailAction', 'viewDetail', 'detailAction', 'detail']) */
  idFallbackActionNames?: string[];
  /** Hậu tố nhận diện action (Mặc định: 'Action') */
  actionSuffix?: string;
  /** Tên module để hiển thị trong log (vd: 'Posts', 'Login') */
  moduleName?: string;
  /** Hook chạy trước khi thực thi action (Auth, Permission Guard) */
  before?: (context: DispatchContext) => Promise<void> | void;
  /** Hook chạy sau khi action hoàn tất (Logging, Telemetry) */
  after?: (result: any, context: DispatchContext) => Promise<void> | void;
  /** Hook xử lý lỗi */
  onError?: (error: unknown, context: DispatchContext) => Promise<any> | any;
}

/**
 * Helper chuyển kebab-case sang camelCase (vd: view-detail -> viewDetail, add-with-cat -> addWithCat)
 */
export function toCamelCase(str: string): string {
  return str.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

/**
 * Tự động ép kiểu chuỗi slug sang Number, Boolean hoặc String an toàn
 */
export function autoCoerceParam(value: string): string | number | boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    const num = Number(value);
    if (!Number.isNaN(num)) return num;
  }
  return value;
}

/**
 * Tìm hàm action phù hợp trong module dựa trên danh sách tên ứng viên
 */
function findActionFunction(
  actionsModule: Record<string, any>,
  candidateNames: string[]
): { fnName: string; fn: Function } | null {
  for (const name of candidateNames) {
    if (
      name &&
      !name.startsWith('_') &&
      name !== '__proto__' &&
      name !== 'constructor' &&
      name !== 'prototype' &&
      Object.hasOwn(actionsModule, name) &&
      typeof actionsModule[name] === 'function'
    ) {
      return { fnName: name, fn: actionsModule[name] };
    }
  }
  return null;
}

/**
 * 🎼 DISPATCH ACTION: Điều phối tự động URL Slug sang hàm Action tương ứng
 */
export async function dispatchAction(
  actionsModule: Record<string, any>,
  slug: string[] = [],
  rawSearchParams: Record<string, string | string[] | undefined> = {},
  options: DispatcherOptions = {}
) {
  const {
    defaultActionNames = ['indexAction', 'index', 'listAction', 'list'],
    idFallbackActionNames = ['viewDetailAction', 'viewDetail', 'detailAction', 'detail'],
    actionSuffix = 'Action',
    moduleName = 'Dispatcher',
    before,
    after,
    onError,
  } = options;

  const startTime = Date.now();
  let resolved: { fnName: string; fn: Function } | null = null;
  let rawParams: string[] = [];

  // =========================================================================
  // 1. Phân giải Tên Action từ Slug
  // =========================================================================
  if (slug.length === 0) {
    // Trường hợp 1: Slug rỗng -> tìm hàm index/list mặc định
    resolved = findActionFunction(actionsModule, defaultActionNames);
    rawParams = [];
  } else if (slug.length === 1 && /^\d+$/.test(slug[0])) {
    // Trường hợp 2: Slug chỉ gồm 1 số ID (/posts/123) -> tìm hàm viewDetail/detail
    resolved = findActionFunction(actionsModule, idFallbackActionNames);
    rawParams = [slug[0]];
  } else {
    // Trường hợp 3: Slug có tên hàm (vd: /posts/add, /posts/view-detail/123)
    const rawActionSegment = slug[0];
    const camelBaseName = toCamelCase(rawActionSegment);
    const withSuffix = camelBaseName.endsWith(actionSuffix)
      ? camelBaseName
      : `${camelBaseName}${actionSuffix}`;

    // Tìm kiếm ưu tiên có hậu tố Action trước, sau đó là tên gốc
    resolved = findActionFunction(actionsModule, [withSuffix, camelBaseName]);
    rawParams = slug.slice(1);
  }

  // Nếu không tìm thấy hàm nào hợp lệ -> Chuyển hướng 404 Not Found
  if (!resolved) {
    logger.warn(`[${moduleName}] 404: Không tìm thấy action phù hợp cho slug: [${slug.join(', ')}]`, {
      slug,
      searchParams: rawSearchParams,
    });
    notFound();
  }

  const { fnName, fn } = resolved;
  const context: DispatchContext = {
    slug,
    searchParams: rawSearchParams,
    actionName: fnName,
    startTime,
  };

  try {
    logger.debug(`[${moduleName}] 🚀 Bắt đầu action: "${fnName}"`, {
      slug,
      searchParams: rawSearchParams,
    });

    // =======================================================================
    // 2. Lifecycle: BEFORE HOOK (Kiểm tra quyền, Logging)
    // =======================================================================
    if (before) {
      await before(context);
    }

    // =======================================================================
    // 3. Ép kiểu và Xác thực tham số qua Zod
    // =======================================================================
    const coercedParams = rawParams.map(autoCoerceParam);

    let finalArgs: any[] = coercedParams;
    const schema = (fn as any).paramsSchema;
    if (schema && schema instanceof z.ZodType) {
      const parsed = schema.safeParse(coercedParams);
      if (!parsed.success) {
        logger.warn(`[${moduleName}] Tham số không hợp lệ cho ${fnName}:`, {
          errors: parsed.error.format(),
          params: coercedParams,
        });
        notFound();
      }
      finalArgs = Array.isArray(parsed.data) ? parsed.data : [parsed.data];
    }

    // =======================================================================
    // 4. Thực thi Action
    // =======================================================================
    // Nếu action không có tham số slug (như list/index), truyền searchParams
    let result: any;
    if (rawParams.length === 0) {
      result = await fn(rawSearchParams);
    } else {
      // Nếu có tham số từ slug, truyền các params + searchParams vào cuối
      result = await fn(...finalArgs, rawSearchParams);
    }

    const durationMs = Date.now() - startTime;

    // Cảnh báo nếu Action render chậm (> 500ms)
    if (durationMs > 500) {
      logger.warn(`[SLOW_ACTION] [${moduleName}] Action "${fnName}" thực thi chậm (${durationMs}ms)`, {
        durationMs,
        slug,
      });
    } else {
      logger.info(`[${moduleName}] ✅ Hoàn tất action: "${fnName}" (${durationMs}ms)`, {
        durationMs,
        action: fnName,
      });
    }

    // =======================================================================
    // 5. Lifecycle: AFTER HOOK
    // =======================================================================
    if (after) {
      await after(result, context);
    }

    return result;
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error(`[${moduleName}] ❌ Lỗi khi thực thi action "${fnName}" (${durationMs}ms)`, error, {
      durationMs,
      slug,
      searchParams: rawSearchParams,
    });

    if (onError) {
      return await onError(error, context);
    }
    throw error;
  }
}
