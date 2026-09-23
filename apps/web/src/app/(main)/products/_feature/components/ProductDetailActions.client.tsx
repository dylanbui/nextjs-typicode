'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@repo/shared';
import { deleteProductAction } from '../actions/product_delete.action';

interface ProductDetailActionsProps {
  product: Product;
}

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const router = useRouter();
  const [addedToCart, setAddedToCart] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [, startTransition] = useTransition();

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.title}"?`)) return;

    setIsDeleting(true);
    try {
      const res = await deleteProductAction(product.id);
      if (res.success) {
        alert('Đã xóa sản phẩm thành công!');
        startTransition(() => {
          router.push('/products');
        });
      } else {
        alert(res.error || 'Xóa sản phẩm thất bại.');
        setIsDeleting(false);
      }
    } catch {
      alert('Đã có lỗi xảy ra khi xóa sản phẩm.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      {addedToCart && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-0 py-2" role="alert">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <div>Đã thêm <strong>{product.title}</strong> vào giỏ hàng demo!</div>
        </div>
      )}

      <div className="d-flex flex-wrap gap-2 align-items-center">
        {/* Nút Thêm vào giỏ hàng */}
        <button
          onClick={handleAddToCart}
          className="btn btn-primary btn-lg rounded-pill px-4 flex-grow-1 shadow-sm d-flex align-items-center justify-content-center gap-2"
        >
          <i className="bi bi-cart-plus-fill"></i>
          <span>Thêm Vào Giỏ Hàng</span>
        </button>

        {/* Nút Sửa sản phẩm */}
        <Link
          href={`/products/update/${product.id}`}
          className="btn btn-outline-secondary btn-lg rounded-pill px-4 d-flex align-items-center gap-2"
        >
          <i className="bi bi-pencil-square"></i>
          <span>Sửa</span>
        </Link>

        {/* Nút Xóa sản phẩm */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="btn btn-outline-danger btn-lg rounded-pill px-3 d-flex align-items-center gap-2"
          title="Xóa sản phẩm này"
        >
          {isDeleting ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          ) : (
            <i className="bi bi-trash-fill"></i>
          )}
          <span>{isDeleting ? 'Đang xóa...' : 'Xóa'}</span>
        </button>
      </div>
    </div>
  );
}
