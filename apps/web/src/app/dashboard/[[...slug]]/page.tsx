import * as dashboardActions from '../_feature';
import { dispatchAction } from '@repo/shared';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Bảng Quản Trị | TypiCode Dashboard',
  description: 'Tổng quan hệ thống, thống kê sản phẩm, danh mục và quản lý người dùng',
};

/**
 * 🎼 MASTER DISPATCHER: Tự động điều phối toàn bộ URL Dashboard qua ActionDispatcher
 * 
 * URL Mapping:
 * - /dashboard              -> Action: indexAction (Tổng quan Dashboard)
 * - /dashboard/overview     -> Action: overviewAction (Alias cho indexAction)
 * - /dashboard/products     -> Action: productsAction (Chuyển hướng /products)
 * - /dashboard/users        -> Action: usersAction (Chuyển hướng /users)
 */
export default async function DashboardMasterPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;

  return await dispatchAction(
    dashboardActions,
    slug,
    rawSearchParams,
    {
      defaultActionNames: ['indexAction', 'overviewAction', 'index'],
      idFallbackActionNames: ['indexAction', 'overviewAction'],
      before: (ctx) => {
        console.log(`[Dashboard Dispatcher] 🚀 Running action: "${ctx.actionName}" with slug:`, ctx.slug);
      },
      after: (_result, ctx) => {
        const duration = Date.now() - ctx.startTime;
        console.log(`[Dashboard Dispatcher] ✅ Completed action: "${ctx.actionName}" in ${duration}ms`);
      },
    }
  );
}
