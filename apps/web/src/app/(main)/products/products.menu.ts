import { MenuModule } from '@/components/navigation';

export const productsMenu: MenuModule = {
  id: 'products',
  title: 'Quản Lý Sản Phẩm',
  order: 20,
  icon: 'bi-box-seam',
  children: [
    {
      id: 'products-list',
      title: 'Tất cả sản phẩm',
      path: '/products',
      icon: 'bi-list-ul',
    },
    {
      id: 'products-filter-shoes',
      title: 'Danh mục Shoes',
      path: '/products?category=Shoes',
      icon: 'bi-tags',
    },
    {
      id: 'products-filter-electronics',
      title: 'Danh mục Electronics',
      path: '/products?category=Electronics',
      icon: 'bi-laptop',
    },
  ],
};
