import { MenuModule } from '@/components/navigation';

export const architectureMenu: MenuModule = {
  id: 'architecture',
  title: 'Kiến Trúc & Tài Liệu',
  order: 99,
  icon: 'bi-diagram-3',
  children: [
    {
      id: 'architecture-overview',
      title: 'Clean Architecture 4 Lớp',
      path: '/architecture',
      icon: 'bi-layers',
    },
  ],
};
