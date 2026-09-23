import { z } from 'zod';

// =========================================================================
// 1. 🛡️ ROUTE SLUG PARSER SCHEMA (Catch-All Dispatcher: /products/[[...slug]])
// =========================================================================
export const ProductRouteSchema = z.discriminatedUnion('type', [
  // Case 1: GET /products
  z.object({
    type: z.literal('LIST'),
  }),
  // Case 2: GET /products/add (hoặc /products/new)
  z.object({
    type: z.literal('ADD'),
  }),
  // Case 3: GET /products/42
  z.object({
    type: z.literal('DETAIL'),
    id: z.coerce.number().int().positive('ID sản phẩm phải là số nguyên dương'),
  }),
  // Case 4: GET /products/update/42
  z.object({
    type: z.literal('UPDATE'),
    id: z.coerce.number().int().positive('ID sản phẩm phải là số nguyên dương'),
  }),
]);

export type ProductRouteType = z.infer<typeof ProductRouteSchema>;

/**
 * Helper hàm phân tích mảng slug từ Next.js params thành RouteType
 */
export function parseProductRoute(slug?: string[]): ProductRouteType | { type: 'NOT_FOUND' } {
  if (!slug || slug.length === 0) {
    return { type: 'LIST' };
  }
  // Hỗ trợ cả 'add' và 'new'
  if (slug.length === 1 && (slug[0] === 'add' || slug[0] === 'new')) {
    return { type: 'ADD' };
  }
  if (slug.length === 1 && /^\d+$/.test(slug[0])) {
    return { type: 'DETAIL', id: Number(slug[0]) };
  }
  if (slug.length === 2 && slug[0] === 'update' && /^\d+$/.test(slug[1])) {
    return { type: 'UPDATE', id: Number(slug[1]) };
  }
  return { type: 'NOT_FOUND' };
}

// =========================================================================
// 2. 🛡️ URL FILTER SCHEMA (Dùng validate query parameters)
// =========================================================================
export const ProductFilterSchema = z.object({
  categoryId: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
  mode: z.enum(['grid', 'table']).catch('grid'),
});

export type ProductFilterData = z.infer<typeof ProductFilterSchema>;

// =========================================================================
// 3. 🛡️ FORM SCHEMA (Dùng cho Form Client & Server Mutation Actions)
// =========================================================================
export const ProductFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Tên sản phẩm phải có tối thiểu 3 ký tự')
    .max(120, 'Tên sản phẩm tối đa 120 ký tự'),
  price: z.coerce
    .number({ message: 'Giá sản phẩm phải là một con số' })
    .min(1, 'Giá sản phẩm tối thiểu là $1'),
  categoryId: z.coerce
    .number({ message: 'Vui lòng chọn danh mục hợp lệ' })
    .int()
    .positive('Danh mục bắt buộc phải chọn'),
  description: z
    .string()
    .trim()
    .min(10, 'Mô tả chi tiết phải có tối thiểu 10 ký tự')
    .max(2000, 'Mô tả không được vượt quá 2000 ký tự'),
  imageUrl: z
    .string()
    .trim()
    .url('Link hình ảnh phải là một URL hợp lệ (ví dụ: https://...)'),
});

export type ProductFormData = z.infer<typeof ProductFormSchema>;

// Alias hỗ trợ tương thích ngược
export const CreateProductSchema = ProductFormSchema;
export type CreateProductFormData = ProductFormData;

// Giữ tương thích ngược nếu có chỗ nào gọi IdSchema cũ
export const ProductIdSchema = z.object({
  id: z.coerce.number().int().positive('ID không hợp lệ'),
});
