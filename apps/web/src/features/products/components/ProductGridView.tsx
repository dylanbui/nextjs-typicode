import { Product } from '@repo/shared';
import ProductCard from '@/components/ProductCard';

interface ProductGridViewProps {
  products: Product[];
}

export function ProductGridView({ products }: ProductGridViewProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-5 bg-white rounded-3 shadow-sm border border-light">
        <i className="bi bi-inbox text-muted display-4 d-block mb-3"></i>
        <h5 className="fw-bold text-dark">Không tìm thấy sản phẩm nào</h5>
        <p className="text-muted small">Vui lòng thử từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
