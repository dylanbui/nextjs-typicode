import React from 'react';
import { notFound } from 'next/navigation';
import { userRepository } from '@repo/shared';
import { UserDetailView } from '../views/UserDetailView';

/**
 * ⚡ SERVER ACTION (DATA LOADER): Nạp chi tiết User và trả về <UserDetailView />
 */
export async function userDetailAction(id: number): Promise<React.ReactNode> {
  try {
    const user = await userRepository.getUserById(id);
    if (!user) {
      notFound();
    }
    return <UserDetailView user={user} />;
  } catch (error) {
    notFound();
  }
}
