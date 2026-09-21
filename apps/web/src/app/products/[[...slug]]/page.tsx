import { notFound } from 'next/navigation';
import {
  parseProductRoute,
  productListAction,
  productAddAction,
  productDetailAction,
  productUpdateAction,
} from '@/features/products';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * 🎼 MASTER DISPATCHER: Điều phối toàn bộ nghiệp vụ CRUD của Products
 * URL mapping:
 * - /products             -> Action: LIST (Danh sách)
 * - /products/add         -> Action: ADD (Thêm mới)
 * - /products/new         -> Action: ADD (Hỗ trợ alias)
 * - /products/[id]        -> Action: DETAIL (Chi tiết)
 * - /products/update/[id] -> Action: UPDATE (Chỉnh sửa)
 */
export default async function ProductMasterPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;

  // 1. Phân tích Route Slug qua Zod Parser
  const route = parseProductRoute(slug);

  // 2. Dispatcher gọi Action tương ứng và nhận về React Element
  switch (route.type) {
    case 'LIST':
      return await productListAction(rawSearchParams);

    case 'ADD':
      return await productAddAction();

    case 'DETAIL':
      return await productDetailAction(route.id);

    case 'UPDATE':
      return await productUpdateAction(route.id);

    default:
      notFound();
  }
}
