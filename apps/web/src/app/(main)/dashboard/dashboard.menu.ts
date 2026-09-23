import { MenuModule } from '@/components/navigation';

export const dashboardMenu: MenuModule = {
  id: 'dashboard',
  title: 'Bảng Điều Khiển',
  order: 10,
  icon: 'bi-speedometer2',
  badge: 'Chính',
  badgeColor: 'primary',
  children: [
    {
      id: 'dashboard-overview',
      title: 'Tổng quan thống kê',
      path: '/dashboard',
      icon: 'bi-grid-1x2-fill',
    },
  ],
};
