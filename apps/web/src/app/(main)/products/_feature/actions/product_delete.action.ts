'use server';

import { revalidatePath } from 'next/cache';
import { productRepository } from '@repo/shared';

export async function deleteProductAction(id: number) {
  try {
    await productRepository.deleteProduct(id);
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Không thể xóa sản phẩm';
    return { success: false, error: message };
  }
}
