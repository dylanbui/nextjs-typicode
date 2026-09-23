import { categoryRepository, productRepository } from '@repo/shared';
import { ProductFilterSchema } from '../schemas/product.schema';
import { ProductListView } from '../views/ProductListView';

export async function productListAction(
  rawSearchParams?: Record<string, string | string[] | undefined>
) {
  // 1. Validate và parse query parameters
  const filter = ProductFilterSchema.parse(rawSearchParams || {});
  const categoryId = filter.categoryId;
  const search = filter.search || '';
  const viewMode = filter.mode;

  // 2. Fetch song song Categories và Products tại Server
  const [categories, rawProducts] = await Promise.all([
    categoryRepository.getCategories(10),
    productRepository.getProducts({
      categoryId,
      title: search || undefined,
      limit: 24,
    }),
  ]);

  // 3. Fallback client-like search nếu API không lọc case-insensitive
  let products = rawProducts;
  if (search && search.trim()) {
    const keyword = search.toLowerCase().trim();
    products = rawProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(keyword) ||
        (p.description && p.description.toLowerCase().includes(keyword))
    );
  }

  // 4. Trả về trực tiếp React Element cho page.tsx render
  return (
    <ProductListView
      products={products}
      categories={categories}
      selectedCategoryId={categoryId ?? null}
      searchTerm={search}
      viewMode={viewMode}
    />
  );
}

// Aliases cho ActionDispatcher
export { productListAction as indexAction, productListAction as listAction };
export default productListAction;
