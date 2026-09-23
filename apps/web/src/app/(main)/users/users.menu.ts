import { MenuModule } from '@/components/navigation';

export const usersMenu: MenuModule = {
  id: 'users',
  title: 'Quản Lý Người Dùng',
  order: 40,
  icon: 'bi-people',
  children: [
    {
      id: 'users-list',
      title: 'Danh sách người dùng',
      path: '/users',
      icon: 'bi-person-lines-fill',
    },
  ],
};
