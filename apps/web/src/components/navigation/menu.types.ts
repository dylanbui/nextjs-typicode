export type UserRole = 'admin' | 'manager' | 'customer' | 'user' | string;

export interface MenuAction {
  id: string;
  title: string;
  path: string;
  icon?: string;
  badge?: string;
  badgeColor?: string;
  /** Danh sách các role được phép truy cập link này (nếu để trống = cho phép tất cả) */
  roles?: UserRole[];
  /** Ẩn link này khỏi sidebar menu nhưng vẫn hợp lệ cho routing nội bộ */
  hideInMenu?: boolean;
}

export interface MenuModule {
  id: string;
  title: string;
  /** Thứ tự sắp xếp hiển thị trên sidebar (vd: 10, 20, 30...) */
  order: number;
  icon?: string;
  badge?: string;
  badgeColor?: string;
  /** Danh sách các role được phép truy cập module này */
  roles?: UserRole[];
  children: MenuAction[];
}

/**
 * Kiểm tra xem một action item có đang active với URL hiện tại hay không.
 */
export function isActionActive(actionPath: string, currentPathname: string, searchParamsString?: string): boolean {
  // Nếu có query params trong actionPath (ví dụ /products?category=Shoes)
  if (actionPath.includes('?')) {
    const [pathPart, queryPart] = actionPath.split('?');
    if (currentPathname !== pathPart) return false;
    if (!searchParamsString) return false;
    return searchParamsString.includes(queryPart);
  }

  // Khớp chính xác root của module hoặc subpath
  if (actionPath === '/dashboard') {
    return currentPathname === '/dashboard' || currentPathname === '/dashboard/overview' || currentPathname === '/';
  }

  if (currentPathname === actionPath) {
    return true;
  }

  // Khớp tiền tố (prefix) cho các sub-actions như /products/123 -> /products
  return currentPathname.startsWith(`${actionPath}/`);
}

/**
 * Tìm module ID cần được tự động mở rộng (expand) dựa trên URL hiện tại
 */
export function getActiveModuleIds(modules: MenuModule[], currentPathname: string, searchParamsString?: string): string[] {
  const activeIds: string[] = [];

  for (const module of modules) {
    const hasActiveChild = module.children.some((action) =>
      isActionActive(action.path, currentPathname, searchParamsString)
    );

    if (hasActiveChild) {
      activeIds.push(module.id);
    }
  }

  return activeIds;
}
