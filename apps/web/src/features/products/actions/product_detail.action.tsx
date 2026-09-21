import { notFound } from 'next/navigation';
import { productRepository } from '@repo/shared';
import { ProductDetailView } from '../views/ProductDetailView';

export async function productDetailAction(id: number) {
  try {
    const product = await productRepository.getProductById(id);

    if (!product || !product.id) {
      notFound();
    }

    // Trả về trực tiếp React Element cho page.tsx render
    return <ProductDetailView product={product} />;
  } catch {
    notFound();
  }
}
