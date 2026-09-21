/**
 * ============================================================================
 * 🎼 CRUD ROUTE DISPATCHER (CATCH-ALL MASTER ROUTER)
 * ============================================================================
 * 
 * Dispatcher dùng chung để phân tích mảng slug từ Next.js Catch-All Routes (`[[...slug]]`)
 * thành các đối tượng Route có định kiểu mạnh (Type-safe), hỗ trợ 5 hành động CRUD mặc định
 * và cho phép mở rộng (register) thêm các custom route tùy ý lúc cấu hình module.
 * 
 * ----------------------------------------------------------------------------
 * 💡 VÍ DỤ 1: SỬ DỤNG CƠ BẢN (5 CRUD MẶC ĐỊNH VỚI ID SỐ NGUYÊN)
 * ----------------------------------------------------------------------------
 * ```ts
 * // 1. Khởi tạo trong file schema của module (VD: product.schema.ts)
 * export const productRouteDispatcher = new CrudRouteDispatcher<number>();
 * 
 * // 2. Dispatcher phân tích các URL tương ứng:
 * productRouteDispatcher.parse([]);                       // -> { type: 'LIST' }
 * productRouteDispatcher.parse(['add']);                  // -> { type: 'ADD' }
 * productRouteDispatcher.parse(['new']);                  // -> { type: 'ADD' } (alias)
 * productRouteDispatcher.parse(['42']);                   // -> { type: 'DETAIL', id: 42 }
 * productRouteDispatcher.parse(['update', '42']);         // -> { type: 'UPDATE', id: 42 }
 * productRouteDispatcher.parse(['edit', '42']);           // -> { type: 'UPDATE', id: 42 } (alias)
 * productRouteDispatcher.parse(['delete', '42']);         // -> { type: 'DELETE', id: 42 }
 * productRouteDispatcher.parse(['invalid', 'foo', 'bar']); // -> { type: 'NOT_FOUND' }
 * ```
 * 
 * ----------------------------------------------------------------------------
 * 💡 VÍ DỤ 2: ĐĂNG KÝ CUSTOM ROUTE & PARSE SEARCHPARAMS VỚI ZOD SCHEMA
 * ----------------------------------------------------------------------------
 * ```ts
 * // Schema validate query params (VD: ?page=2&sort=asc&limit=10)
 * const BestSellerQuerySchema = z.object({
 *   page: z.coerce.number().int().positive().default(1),
 *   sort: z.enum(['asc', 'desc']).default('desc'),
 *   limit: z.coerce.number().int().positive().default(10),
 * });
 * 
 * export const productRouteDispatcher = new CrudRouteDispatcher<number>()
 *   // Route tĩnh: /products/display-best-product
 *   .registerRoute({
 *     type: 'DISPLAY_BEST_PRODUCT',
 *     match: ['display-best-product'],
 *   })
 *   // Route có Query Params: /products/best-sellers?page=2&sort=asc&limit=20
 *   .registerRoute({
 *     type: 'BEST_SELLERS',
 *     match: ['best-sellers'],
 *     parser: (_slug, searchParams) => {
 *       // Chuyển URLSearchParams hoặc Next.js SearchParams Record thành plain object
 *       const raw = searchParams instanceof URLSearchParams
 *         ? Object.fromEntries(searchParams.entries())
 *         : (searchParams ?? {});
 *       return { query: BestSellerQuerySchema.parse(raw) };
 *     },
 *   })
 *   // Route động kết hợp Slug + Query: /products/tag/:tagName?page=1
 *   .registerRoute({
 *     type: 'FILTER_BY_TAG',
 *     match: (slug) => slug.length === 2 && slug[0] === 'tag',
 *     parser: (slug, searchParams) => {
 *       const raw = searchParams instanceof URLSearchParams
 *         ? Object.fromEntries(searchParams.entries())
 *         : (searchParams ?? {});
 *       return {
 *         tag: slug[1],
 *         page: Number((raw as any).page || 1),
 *       };
 *     },
 *   });
 * 
 * export type ProductRoute = ReturnType<typeof productRouteDispatcher.parse>;
 * ```
 * 
 * ----------------------------------------------------------------------------
 * 💡 VÍ DỤ 3: TÙY BIẾN ĐỊNH DẠNG ID (VÍ DỤ UUID HOẶC SLUG CHUỖI)
 * ----------------------------------------------------------------------------
 * ```ts
 * const userRouteDispatcher = new CrudRouteDispatcher<string>({
 *   idSchema: z.string().uuid('ID người dùng phải là UUID hợp lệ'),
 * });
 * // /users/550e8400-e29b-41d4-a716-446655440000 -> { type: 'DETAIL', id: '550e84...' }
 * ```
 * 
 * ----------------------------------------------------------------------------
 * 💡 VÍ DỤ 4: ĐIỀU PHỐI TRONG NEXT.JS APP ROUTER (page.tsx)
 * ----------------------------------------------------------------------------
 * ```tsx
 * // app/products/[[...slug]]/page.tsx
 * export default async function ProductMasterPage({ params, searchParams }: PageProps) {
 *   const { slug } = await params;
 *   const rawSearchParams = await searchParams; // Record<string, string | string[] | undefined>
 * 
 *   // 1. Dispatcher phân tích cả slug lẫn searchParams
 *   const route = productRouteDispatcher.parse(slug, rawSearchParams);
 * 
 *   // 2. Dispatcher gọi Action tương ứng (Type-safe 100%)
 *   switch (route.type) {
 *     case 'LIST':
 *       return await productListAction(rawSearchParams);
 *     case 'ADD':
 *       return await productAddAction();
 *     case 'DETAIL':
 *       return await productDetailAction(route.id);
 *     case 'UPDATE':
 *       return await productUpdateAction(route.id);
 *     case 'DELETE':
 *       return await productDeleteConfirmAction(route.id);
 *     case 'BEST_SELLERS':
 *       // route.query đã được Zod parse sạch sẽ: { page: number, sort: 'asc'|'desc', limit: number }
 *       return await productBestSellersAction(route.query);
 *     case 'FILTER_BY_TAG':
 *       return await productTagAction(route.tag, route.page);
 *     default:
 *       notFound();
 *   }
 * }
 * ```
 * ============================================================================
 */

import { z } from 'zod';

export type DefaultCrudRoute<TId = number> =
  | { type: 'LIST' }
  | { type: 'ADD' }
  | { type: 'DETAIL'; id: TId }
  | { type: 'UPDATE'; id: TId }
  | { type: 'DELETE'; id: TId };

export interface CustomRouteDefinition<TType extends string, TData> {
  type: TType;
  match: string[] | ((slug: string[]) => boolean);
  parser?: (
    slug: string[],
    searchParams?: URLSearchParams | Record<string, string | string[] | undefined>
  ) => TData;
}

export class CrudRouteDispatcher<
  TId = number,
  TCustomRoute extends { type: string } = never
> {
  private idSchema: z.ZodType<TId>;
  private customRoutes: CustomRouteDefinition<any, any>[] = [];

  constructor(
    options: {
      idSchema?: z.ZodType<TId>;
    } = {}
  ) {
    this.idSchema = (options.idSchema ??
      z.coerce.number().int().positive('ID không hợp lệ')) as unknown as z.ZodType<TId>;
  }

  public registerRoute<
    TType extends string,
    TData extends Record<string, any> = Record<string, never>
  >(
    config: CustomRouteDefinition<TType, TData>
  ): CrudRouteDispatcher<TId, TCustomRoute | ({ type: TType } & TData)> {
    this.customRoutes.push(config);
    return this as unknown as CrudRouteDispatcher<TId, TCustomRoute | ({ type: TType } & TData)>;
  }

  public parse(
    slug?: string[],
    searchParams?: URLSearchParams | Record<string, string | string[] | undefined>
  ): (DefaultCrudRoute<TId> | TCustomRoute) | { type: 'NOT_FOUND' } {
    const segments = slug ?? [];

    // 1. LIST
    if (segments.length === 0) return { type: 'LIST' };

    // 2. ADD (hỗ trợ add / new)
    if (segments.length === 1 && (segments[0] === 'add' || segments[0] === 'new')) {
      return { type: 'ADD' };
    }

    // 3. Custom routes (Khớp trước khi kiểm tra dynamic id)
    for (const custom of this.customRoutes) {
      if (Array.isArray(custom.match)) {
        const matchArr = custom.match;
        if (
          segments.length === matchArr.length &&
          segments.every((val, i) => val === matchArr[i])
        ) {
          const extraData = custom.parser ? custom.parser(segments, searchParams) : {};
          return { type: custom.type, ...extraData } as any;
        }
      } else if (typeof custom.match === 'function' && custom.match(segments)) {
        const extraData = custom.parser ? custom.parser(segments, searchParams) : {};
        return { type: custom.type, ...extraData } as any;
      }
    }

    // 4. UPDATE (/update/:id hoặc /edit/:id)
    if (segments.length === 2 && (segments[0] === 'update' || segments[0] === 'edit')) {
      const parsedId = this.idSchema.safeParse(segments[1]);
      if (parsedId.success) return { type: 'UPDATE', id: parsedId.data };
    }

    // 5. DELETE (/delete/:id hoặc /remove/:id)
    if (segments.length === 2 && (segments[0] === 'delete' || segments[0] === 'remove')) {
      const parsedId = this.idSchema.safeParse(segments[1]);
      if (parsedId.success) return { type: 'DELETE', id: parsedId.data };
    }

    // 6. DETAIL (/:id)
    if (segments.length === 1) {
      const parsedId = this.idSchema.safeParse(segments[0]);
      if (parsedId.success) return { type: 'DETAIL', id: parsedId.data };
    }

    return { type: 'NOT_FOUND' };
  }
}
