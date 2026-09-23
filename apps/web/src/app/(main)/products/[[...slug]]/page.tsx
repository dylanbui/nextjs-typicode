import * as productActions from '@/app/(main)/products/_feature';
import { dispatchAction } from '@repo/shared';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * 🎼 MASTER DISPATCHER: Tự động điều phối toàn bộ URL Products qua ActionDispatcher
 * 
 * URL Mapping:
 * - /products             -> Action: indexAction / listAction / productListAction
 * - /products/add         -> Action: addAction / productAddAction
 * - /products/new         -> Action: newAction / addAction (Alias)
 * - /products/[id]        -> Action: viewDetailAction / detailAction (Fallback cho ID)
 * - /products/update/[id] -> Action: updateAction / editAction / productUpdateAction
 * - /products/edit/[id]   -> Action: editAction / updateAction
 */
export default async function ProductMasterPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;

  return await dispatchAction(
    productActions,
    slug,
    rawSearchParams,
    {
      moduleName: 'Products',
      defaultActionNames: ['indexAction', 'listAction', 'productListAction', 'index', 'list'],
      idFallbackActionNames: ['viewDetailAction', 'detailAction', 'productDetailAction', 'detail'],
      before: (ctx) => {
        console.log(`[Products Dispatcher] 🚀 Running action: "${ctx.actionName}" with slug:`, ctx.slug);
      },
      after: (_result, ctx) => {
        const duration = Date.now() - ctx.startTime;
        console.log(`[Products Dispatcher] ✅ Completed action: "${ctx.actionName}" in ${duration}ms`);
      },
    }
  );
}
