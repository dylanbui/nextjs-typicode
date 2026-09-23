import { MenuModule } from '@/components/navigation';

export const postsMenu: MenuModule = {
  id: 'posts',
  title: 'Quản Lý Bài Viết',
  order: 30,
  icon: 'bi-journal-richtext',
  children: [
    {
      id: 'posts-list',
      title: 'Danh sách bài viết',
      path: '/posts',
      icon: 'bi-card-text',
    },
  ],
};
