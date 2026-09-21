import { notFound } from 'next/navigation';
import {
  parseUserRoute,
  userListAction,
  userAddAction,
  userDetailAction,
  userUpdateAction,
} from '@/features/users';

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
 * 🎼 MASTER DISPATCHER: Điều phối Catch-All cho User Management (/users/[[...slug]])
 */
export default async function UserMasterPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const rawSearchParams = await searchParams;

  // 1. Phân tích route slug
  const route = parseUserRoute(slug);

  // 2. Dispatcher gọi Action tương ứng
  switch (route.type) {
    case 'LIST':
      return await userListAction(rawSearchParams);

    case 'ADD':
      return await userAddAction();

    case 'DETAIL':
      return await userDetailAction(route.id);

    case 'UPDATE':
      return await userUpdateAction(route.id);

    default:
      notFound();
  }
}
