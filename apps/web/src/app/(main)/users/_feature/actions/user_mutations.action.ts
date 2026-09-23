'use server';

import { revalidatePath } from 'next/cache';
import { userRepository, CreateUserInput, UpdateUserInput } from '@repo/shared';
import { UserFormSchema } from '../schemas/user.schema';
import { getCurrentUser } from '@/lib/session';

export interface MutationResult {
  success: boolean;
  error?: string;
  id?: number;
}

/**
 * ⚡ SERVER ACTION: Tạo người dùng mới
 */
export async function createUserAction(formData: unknown): Promise<MutationResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Bạn cần đăng nhập để thực hiện thao tác này!' };
    }

    const parsed = UserFormSchema.safeParse(formData);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((i) => i.message).join(', ');
      return { success: false, error: errorMessage };
    }

    const input: CreateUserInput = parsed.data;
    const created = await userRepository.createUser(input);

    revalidatePath('/users');
    revalidatePath('/dashboard');

    return { success: true, id: created.id };
  } catch (error: any) {
    console.error('Lỗi khi tạo user:', error);
    return { success: false, error: error?.message || 'Không thể tạo người dùng mới!' };
  }
}

/**
 * ⚡ SERVER ACTION: Cập nhật người dùng
 */
export async function updateUserAction(id: number, formData: unknown): Promise<MutationResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Bạn cần đăng nhập để thực hiện thao tác này!' };
    }

    const parsed = UserFormSchema.safeParse(formData);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues.map((i) => i.message).join(', ');
      return { success: false, error: errorMessage };
    }

    const input: UpdateUserInput = parsed.data;
    await userRepository.updateUser(id, input);

    revalidatePath('/users');
    revalidatePath(`/users/${id}`);
    revalidatePath('/dashboard');

    return { success: true, id };
  } catch (error: any) {
    console.error('Lỗi khi cập nhật user:', error);
    return { success: false, error: error?.message || 'Không thể cập nhật thông tin người dùng!' };
  }
}

/**
 * ⚡ SERVER ACTION: Xóa người dùng
 */
export async function deleteUserAction(id: number): Promise<MutationResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Bạn cần đăng nhập để thực hiện thao tác này!' };
    }

    // Không cho phép tự xóa chính mình
    if (user.userId === id) {
      return { success: false, error: 'Bạn không thể tự xóa tài khoản đang đăng nhập của chính mình!' };
    }

    await userRepository.deleteUser(id);

    revalidatePath('/users');
    revalidatePath('/dashboard');

    return { success: true, id };
  } catch (error: any) {
    console.error('Lỗi khi xóa user:', error);
    return { success: false, error: error?.message || 'Không thể xóa người dùng!' };
  }
}
