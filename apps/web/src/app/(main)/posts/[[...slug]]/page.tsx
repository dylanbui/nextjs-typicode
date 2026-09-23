import * as postActions from '@/app/(main)/posts/_feature';
import { dispatchAction } from '@repo/shared';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * 🎼 POSTS MASTER DISPATCHER: Tự động điều phối toàn bộ URL Posts qua ActionDispatcher
 * 
 * URL Mapping:
 * - /posts                 -> Action: indexAction (Mặc định)
 * - /posts/list            -> Action: listAction
 * - /posts/add             -> Action: addAction
 * - /posts/edit/[id]       -> Action: editAction(id)
 * - /posts/delete/[id]     -> Action: deleteAction(id)
 * - /posts/view-detail/[id]-> Action: viewDetailAction(id)
 * - /posts/[id]            -> Action: viewDetailAction(id) (Fallback cho ID)
 */
export default async function PostsMasterPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;

  return await dispatchAction(
    postActions,
    slug,
    rawSearchParams,
    {
      defaultActionNames: ['indexAction', 'index', 'listAction', 'list'],
      idFallbackActionNames: ['viewDetailAction', 'viewDetail', 'detailAction'],
      before: (ctx) => {
        console.log(`[Posts Dispatcher] 🚀 Running action: "${ctx.actionName}" with slug:`, ctx.slug);
      },
      after: (_result, ctx) => {
        const duration = Date.now() - ctx.startTime;
        console.log(`[Posts Dispatcher] ✅ Completed action: "${ctx.actionName}" in ${duration}ms`);
      },
    }
  );
}
