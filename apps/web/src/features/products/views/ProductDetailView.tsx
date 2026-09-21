import { Product } from '@repo/shared';
import Link from 'next/link';
import { cleanImageUrl } from '@/lib/image';
import { ProductDetailActions } from '../components/ProductDetailActions.client';

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) => cleanImageUrl(img))
      : ['https://placehold.co/600x400?text=No+Image'];

  const mainImage = images[0];

  return (
    <div className="container py-4">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item">
            <Link href="/products" className="text-decoration-none">
              <i className="bi bi-house-door me-1"></i>Sản phẩm
            </Link>
          </li>
          {product.category && (
            <li className="breadcrumb-item">
              <span className="text-muted">{product.category.name}</span>
            </li>
          )}
          <li className="breadcrumb-item active text-truncate" aria-current="page" style={{ maxWidth: 260 }}>
            {product.title}
          </li>
        </ol>
      </nav>

      {/* Main Content Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white mb-4">
        <div className="card-body p-4 p-lg-5">
          <div className="row g-4 g-lg-5">
            {/* Gallery hình ảnh */}
            <div className="col-lg-6">
              <div className="ratio ratio-4x3 rounded-3 overflow-hidden bg-light mb-3 border">
                <img
                  src={mainImage}
                  alt={product.title}
                  className="object-fit-cover w-100 h-100"
                />
              </div>

              {/* Thumbnail preview */}
              {images.length > 1 && (
                <div className="d-flex gap-2 overflow-auto pb-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="p-1 rounded-3 border border-light-subtle"
                      style={{ width: 72, height: 72, flexShrink: 0 }}
                    >
                      <img
                        src={img}
                        alt={`thumb-${idx}`}
                        className="w-100 h-100 object-fit-cover rounded-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Thông tin sản phẩm & Actions */}
            <div className="col-lg-6 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1">
                    <i className="bi bi-tag-fill me-1"></i>
                    {product.category?.name || 'Chung'}
                  </span>
                  <span className="badge bg-light text-muted border rounded-pill px-2">
                    ID: #{product.id}
                  </span>
                </div>

                <h1 className="fw-bold text-dark fs-3 mb-3">{product.title}</h1>

                <div className="fs-2 fw-bold text-primary mb-4">
                  ${product.price}
                </div>

                <div className="border-top border-bottom py-3 mb-4">
                  <h6 className="fw-semibold text-muted mb-2 text-uppercase small">Mô tả sản phẩm:</h6>
                  <p className="text-secondary leading-relaxed mb-0">
                    {product.description || 'Chưa có mô tả cho sản phẩm này.'}
                  </p>
                </div>
              </div>

              {/* 🔵 Client Leaf: Nút Thêm giỏ hàng, Nút Sửa, Nút Xóa */}
              <div>
                <ProductDetailActions product={product} />

                <div className="mt-4 p-3 bg-light rounded-3 small text-muted">
                  <i className="bi bi-info-circle text-primary me-1"></i>
                  <strong>RSC Hybrid:</strong> Chi tiết sản phẩm được nạp và render từ Server Action Loader &rarr; HTML tải tức thì <strong>&lt; 100ms</strong>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
