import React from 'react';
import { notFound } from 'next/navigation';
import { userRepository } from '@repo/shared';
import { UserFormView } from '../views/UserFormView';

/**
 * ⚡ SERVER ACTION (DATA LOADER): Nạp dữ liệu cũ và trả về Form cập nhật người dùng
 */
export async function userUpdateAction(id: number): Promise<React.ReactNode> {
  try {
    const user = await userRepository.getUserById(id);
    if (!user) {
      notFound();
    }
    return <UserFormView mode="update" initialData={user} />;
  } catch (error) {
    notFound();
  }
}
