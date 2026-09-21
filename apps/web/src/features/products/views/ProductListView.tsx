import { Category, Product } from '@repo/shared';
import { ProductFilterBar } from '../components/ProductFilterBar.client';
import { ProductGridView } from '../components/ProductGridView';
import { ProductTableView } from '../components/ProductTableView';
import CleanArchExplainer from '@/components/CleanArchExplainer';

interface ProductListViewProps {
  products: Product[];
  categories: Category[];
  selectedCategoryId: number | null;
  searchTerm: string;
  viewMode: 'grid' | 'table';
}

export function ProductListView({
  products,
  categories,
  selectedCategoryId,
  searchTerm,
  viewMode,
}: ProductListViewProps) {
  return (
    <div className="container py-4">
      {/* Banner giải thích kiến trúc */}
      <CleanArchExplainer />

      {/* Header tính năng */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Danh Sách Sản Phẩm</h2>
          <p className="text-muted small mb-0">
            Dữ liệu được nạp và xử lý từ <strong>Server Action Loader</strong> qua mô hình <strong>RSC Hybrid &amp; Catch-All Dispatcher</strong>.
          </p>
        </div>
      </div>

      {/* 🔵 Client Leaf: Thanh điều khiển URL (Search, Filter, Mode) */}
      <ProductFilterBar
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        searchTerm={searchTerm}
        viewMode={viewMode}
      />

      {/* 🟢 Server View: Render HTML tĩnh (0KB JS bundle cho danh sách) */}
      {viewMode === 'table' ? (
        <ProductTableView products={products} />
      ) : (
        <ProductGridView products={products} />
      )}
    </div>
  );
}
