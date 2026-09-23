import * as userActions from '@/app/(main)/users/_feature';
import { dispatchAction } from '@repo/shared';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Quản Lý Người Dùng | TypiCode Dashboard',
  description: 'Danh sách và thông tin tài khoản người dùng trong hệ thống',
};

/**
 * 🎼 MASTER DISPATCHER: Tự động điều phối toàn bộ URL Users qua ActionDispatcher
 * 
 * URL Mapping:
 * - /users                 -> Action: indexAction / listAction / userListAction
 * - /users/add             -> Action: addAction / userAddAction
 * - /users/new             -> Action: newAction / addAction (Alias)
 * - /users/[id]            -> Action: viewDetailAction / detailAction (Fallback cho ID)
 * - /users/update/[id]     -> Action: updateAction / editAction / userUpdateAction
 * - /users/edit/[id]       -> Action: editAction / updateAction
 */
export default async function UserMasterPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;

  return await dispatchAction(
    userActions,
    slug,
    rawSearchParams,
    {
      moduleName: 'Users',
      defaultActionNames: ['indexAction', 'listAction', 'userListAction', 'index', 'list'],
      idFallbackActionNames: ['viewDetailAction', 'detailAction', 'userDetailAction', 'detail'],
      before: (ctx) => {
        console.log(`[Users Dispatcher] 🚀 Running action: "${ctx.actionName}" with slug:`, ctx.slug);
      },
      after: (_result, ctx) => {
        const duration = Date.now() - ctx.startTime;
        console.log(`[Users Dispatcher] ✅ Completed action: "${ctx.actionName}" in ${duration}ms`);
      },
    }
  );
}
