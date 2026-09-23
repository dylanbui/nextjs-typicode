import { MenuModule, UserRole } from './menu.types';
import { dashboardMenu } from '@/app/(main)/dashboard/dashboard.menu';
import { productsMenu } from '@/app/(main)/products/products.menu';
import { postsMenu } from '@/app/(main)/posts/posts.menu';
import { usersMenu } from '@/app/(main)/users/users.menu';
import { architectureMenu } from '@/app/(main)/architecture/architecture.menu';

/**
 * 🎼 MENU REGISTRY: Nơi đăng ký và tổng hợp tất cả menu cấu hình từ từng module.
 * Danh sách được tự động sắp xếp tăng dần theo thuộc tính `order`.
 */
export const allMenuModules: MenuModule[] = [
  dashboardMenu,
  productsMenu,
  postsMenu,
  usersMenu,
  architectureMenu,
].sort((a, b) => a.order - b.order);

/**
 * Lấy toàn bộ danh sách menu của hệ thống
 */
export function getAllMenus(): MenuModule[] {
  return allMenuModules;
}

/**
 * Lấy danh sách menu sau khi đã lọc theo Role (RBAC) và cờ hideInMenu
 */
export function getAuthorizedMenu(role?: UserRole): MenuModule[] {
  if (!role) return allMenuModules;

  return allMenuModules
    .filter((mod) => !mod.roles || mod.roles.length === 0 || mod.roles.includes(role))
    .map((mod) => ({
      ...mod,
      children: mod.children.filter(
        (action) =>
          !action.hideInMenu &&
          (!action.roles || action.roles.length === 0 || action.roles.includes(role))
      ),
    }))
    .filter((mod) => mod.children.length > 0);
}
