import * as loginActions from '../_feature';
import { dispatchAction } from '@repo/shared';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Xác Thực & Đăng Nhập | TypiCode Enterprise Platform',
  description: 'Hệ thống xác thực Auth.js v5 với Account Linking (Google, Facebook, Credentials) và Prisma SQLite',
};

/**
 * 🎼 LOGIN MASTER DISPATCHER: Tự động điều phối toàn bộ URL Login qua ActionDispatcher
 * 
 * URL Mapping:
 * - /login                 -> Action: indexAction (Màn hình Đăng nhập)
 * - /login/register        -> Action: registerAction (Màn hình Tạo tài khoản)
 */
export default async function LoginMasterPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;

  return await dispatchAction(
    loginActions,
    slug,
    rawSearchParams,
    {
      defaultActionNames: ['indexAction', 'index'],
      idFallbackActionNames: ['indexAction', 'index'],
      before: (ctx) => {
        console.log(`[Login Dispatcher] 🚀 Running action: "${ctx.actionName}" with slug:`, ctx.slug);
      },
      after: (_result, ctx) => {
        const duration = Date.now() - ctx.startTime;
        console.log(`[Login Dispatcher] ✅ Completed action: "${ctx.actionName}" in ${duration}ms`);
      },
    }
  );
}
