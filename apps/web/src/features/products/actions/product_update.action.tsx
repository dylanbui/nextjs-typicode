import { notFound } from 'next/navigation';
import { categoryRepository, productRepository } from '@repo/shared';
import { ProductFormView } from '../views/ProductFormView';
import { submitUpdateProductAction } from './product_mutations.action';

export async function productUpdateAction(id: number) {
  try {
    // 1. Fetch song song chi tiết sản phẩm và danh mục tại Server
    const [product, categories] = await Promise.all([
      productRepository.getProductById(id),
      categoryRepository.getCategories(20),
    ]);

    if (!product || !product.id) {
      notFound();
    }

    // 2. Wrap Server Action với product ID cụ thể
    const boundUpdateAction = async (formData: Parameters<typeof submitUpdateProductAction>[1]) => {
      'use server';
      return await submitUpdateProductAction(id, formData);
    };

    // 3. Trả về trực tiếp React Element cho page.tsx render
    return (
      <ProductFormView
        mode="update"
        categories={categories}
        productId={product.id}
        initialData={{
          title: product.title,
          price: product.price,
          categoryId: product.category?.id || categories[0]?.id || 1,
          description: product.description || '',
          imageUrl: product.images?.[0] || '',
        }}
        onSubmitAction={boundUpdateAction}
      />
    );
  } catch {
    notFound();
  }
}
