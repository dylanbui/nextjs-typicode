import React from 'react';
import { UserFormView } from '../views/UserFormView';

/**
 * ⚡ SERVER ACTION (DATA LOADER): Trả về Form tạo người dùng mới
 */
export async function userAddAction(): Promise<React.ReactNode> {
  return <UserFormView mode="add" />;
}
