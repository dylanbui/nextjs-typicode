'use client';

import { Product } from '@repo/shared';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onDelete?: (id: number) => void;
}

import { cleanImageUrl } from '@/lib/image';
export { cleanImageUrl };

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(() => {
    return cleanImageUrl(product.images?.[0]);
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!onDelete) return;
    if (confirm(`Bạn có chắc muốn xóa sản phẩm "${product.title}"?`)) {
      setIsDeleting(true);
      await onDelete(product.id);
      setIsDeleting(false);
    }
  };

  return (
    <div className="col">
      <div className="card h-100 shadow-sm rounded-3 product-card overflow-hidden bg-white">
        <div className="product-img-wrapper">
          <img
            src={imgSrc}
            alt={product.title}
            onError={() => setImgSrc('https://placehold.co/600x400?text=Image+Not+Found')}
            loading="lazy"
          />
          {product.category && (
            <span className="position-absolute top-0 start-0 m-2 badge bg-dark bg-opacity-75 rounded-pill px-2 py-1 small">
              {product.category.name}
            </span>
          )}
        </div>

        <div className="card-body d-flex flex-column p-3">
          <div className="d-flex justify-content-between align-items-baseline mb-2">
            <h5 className="card-title text-truncate fw-bold fs-6 mb-0 text-dark" title={product.title}>
              {product.title}
            </h5>
            <span className="badge bg-primary-subtle text-primary fw-bold fs-6 ms-2">
              ${product.price}
            </span>
          </div>

          <p className="card-text text-muted small flex-grow-1" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.description || 'Không có mô tả chi tiết.'}
          </p>

          <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-2 gap-2">
            <Link
              href={`/products/${product.id}`}
              className="btn btn-outline-primary btn-sm rounded-pill flex-grow-1"
            >
              <i className="bi bi-eye me-1"></i> Chi tiết
            </Link>
            {onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn btn-outline-danger btn-sm rounded-circle p-1"
                style={{ width: 32, height: 32 }}
                title="Xóa sản phẩm"
              >
                {isDeleting ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : (
                  <i className="bi bi-trash"></i>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
