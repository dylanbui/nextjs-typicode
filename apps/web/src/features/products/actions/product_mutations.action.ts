'use server';

import { revalidatePath } from 'next/cache';
import { productRepository } from '@repo/shared';
import { ProductFormData, ProductFormSchema } from '../schemas/product.schema';

/**
 * ⚡ Server Action: Tạo sản phẩm mới
 */
export async function submitCreateProductAction(formData: ProductFormData) {
  // 1. Validate lại tại Server (Security check)
  const validation = ProductFormSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: 'Dữ liệu không hợp lệ.' };
  }

  try {
    const data = validation.data;
    const newProduct = await productRepository.createProduct({
      title: data.title,
      price: data.price,
      description: data.description,
      categoryId: data.categoryId,
      images: [data.imageUrl],
    });

    revalidatePath('/products');
    revalidatePath('/');
    return { success: true, data: newProduct };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Tạo sản phẩm thất bại';
    return { success: false, error: message };
  }
}

/**
 * ⚡ Server Action: Cập nhật sản phẩm
 */
export async function submitUpdateProductAction(id: number, formData: ProductFormData) {
  // 1. Validate lại tại Server
  const validation = ProductFormSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: 'Dữ liệu không hợp lệ.' };
  }

  try {
    const data = validation.data;
    const updatedProduct = await productRepository.updateProduct(id, {
      title: data.title,
      price: data.price,
      description: data.description,
      categoryId: data.categoryId,
      images: [data.imageUrl],
    });

    revalidatePath(`/products/${id}`);
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true, data: updatedProduct };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Cập nhật sản phẩm thất bại';
    return { success: false, error: message };
  }
}
