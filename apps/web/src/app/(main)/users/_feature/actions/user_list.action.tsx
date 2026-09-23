import React from 'react';
import { userRepository, UserRole } from '@repo/shared';
import { UserListView } from '../views/UserListView';
import { UserFilterSchema } from '../schemas/user.schema';

/**
 * ⚡ SERVER ACTION (DATA LOADER): Nạp danh sách User và trả về <UserListView />
 */
export async function userListAction(
  searchParams?: Record<string, string | string[] | undefined>
): Promise<React.ReactNode> {
  const parsedFilter = UserFilterSchema.safeParse(searchParams || {});
  const filter = parsedFilter.success ? parsedFilter.data : {};

  const users = await userRepository.getUsers({
    role: filter.role as UserRole | undefined,
    limit: 50,
  }).catch(() => []);

  // Filter client search if provided
  let filtered = users;
  if (filter.search) {
    const q = filter.search.toLowerCase();
    filtered = users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  return (
    <UserListView
      users={filtered}
      currentRoleFilter={filter.role}
      searchKeyword={filter.search}
    />
  );
}

// Aliases cho ActionDispatcher
export { userListAction as indexAction, userListAction as listAction };
export default userListAction;
