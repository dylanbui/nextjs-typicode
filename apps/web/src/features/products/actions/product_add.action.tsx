import { categoryRepository } from '@repo/shared';
import { ProductFormView } from '../views/ProductFormView';
import { submitCreateProductAction } from './product_mutations.action';

export async function productAddAction() {
  // Nạp sẵn danh mục từ Server
  const categories = await categoryRepository.getCategories(20);

  // Trả về trực tiếp React Element cho page.tsx render
  return (
    <ProductFormView
      mode="add"
      categories={categories}
      onSubmitAction={submitCreateProductAction}
    />
  );
}

// Alias hỗ trợ cả productCreateAction
export const productCreateAction = productAddAction;
