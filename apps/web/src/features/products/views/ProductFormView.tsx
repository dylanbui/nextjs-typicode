'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Category } from '@repo/shared';
import { ProductFormData, ProductFormSchema } from '../schemas/product.schema';
import { cleanImageUrl } from '@/lib/image';

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
  'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
];

interface ProductFormViewProps {
  mode: 'add' | 'update';
  categories: Category[];
  initialData?: Partial<ProductFormData>;
  productId?: number;
  onSubmitAction: (formData: ProductFormData) => Promise<{ success: boolean; error?: string }>;
}

export function ProductFormView({
  mode,
  categories,
  initialData,
  productId,
  onSubmitAction,
}: ProductFormViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData?.title || '',
    price: initialData?.price || 99,
    categoryId: initialData?.categoryId || categories[0]?.id || 1,
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || SAMPLE_IMAGES[0],
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string | undefined>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAddMode = mode === 'add';
  const pageTitle = isAddMode ? 'Thêm Sản Phẩm Mới' : `Cập Nhật Sản Phẩm #${productId}`;
  const buttonText = isAddMode ? 'Lưu Sản Phẩm' : 'Cập Nhật Thay Đổi';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError(null);

    // 1. Validate nhanh bằng Zod tại Client (0ms)
    const validationResult = ProductFormSchema.safeParse(formData);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString();
        if (fieldName && !errors[fieldName]) {
          errors[fieldName] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    // 2. Submit qua Server Action
    setIsSubmitting(true);
    try {
      const res = await onSubmitAction(validationResult.data);
      if (res.success) {
        alert(isAddMode ? 'Tạo sản phẩm thành công!' : 'Cập nhật sản phẩm thành công!');
        startTransition(() => {
          router.push(productId ? `/products/${productId}` : '/products');
          router.refresh();
        });
      } else {
        setGlobalError(res.error || 'Thao tác thất bại. Vui lòng thử lại.');
      }
    } catch {
      setGlobalError('Đã có lỗi xảy ra trong quá trình lưu dữ liệu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item">
            <Link href="/products" className="text-decoration-none">
              Sản phẩm
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {pageTitle}
          </li>
        </ol>
      </nav>

      <div className="row justify-content-center">
        <div className="col-lg-9 col-xl-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="card-header bg-dark text-white p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h4 className="fw-bold mb-1">
                    <i className={`bi ${isAddMode ? 'bi-plus-circle-fill' : 'bi-pencil-square'} text-primary me-2`}></i>
                    {pageTitle}
                  </h4>
                  <p className="text-white-50 small mb-0">
                    Sử dụng <strong>Zod Schema Isomorphic</strong> để xác thực tức thì tại Client và bảo mật tại Server Action.
                  </p>
                </div>
                <Link href="/products" className="btn btn-outline-light btn-sm rounded-pill px-3">
                  <i className="bi bi-x-lg me-1"></i> Đóng
                </Link>
              </div>
            </div>

            <div className="card-body p-4 p-md-5">
              {globalError && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                  <div>{globalError}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Tên sản phẩm */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark">
                    Tên sản phẩm <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control rounded-3 ${fieldErrors.title ? 'is-invalid' : ''}`}
                    placeholder="Ví dụ: Tai nghe chống ồn Sony WH-1000XM5"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (fieldErrors.title) setFieldErrors({ ...fieldErrors, title: undefined });
                    }}
                  />
                  {fieldErrors.title && <div className="invalid-feedback">{fieldErrors.title}</div>}
                </div>

                <div className="row g-3 mb-3">
                  {/* Giá sản phẩm */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">
                      Giá sản phẩm (USD $) <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">$</span>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        className={`form-control ${fieldErrors.price ? 'is-invalid' : ''}`}
                        placeholder="99"
                        value={formData.price}
                        onChange={(e) => {
                          setFormData({ ...formData, price: Number(e.target.value) });
                          if (fieldErrors.price) setFieldErrors({ ...fieldErrors, price: undefined });
                        }}
                      />
                      {fieldErrors.price && <div className="invalid-feedback">{fieldErrors.price}</div>}
                    </div>
                  </div>

                  {/* Danh mục */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">
                      Danh mục <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${fieldErrors.categoryId ? 'is-invalid' : ''}`}
                      value={formData.categoryId}
                      onChange={(e) => {
                        setFormData({ ...formData, categoryId: Number(e.target.value) });
                        if (fieldErrors.categoryId) setFieldErrors({ ...fieldErrors, categoryId: undefined });
                      }}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.categoryId && <div className="invalid-feedback">{fieldErrors.categoryId}</div>}
                  </div>
                </div>

                {/* Mô tả sản phẩm */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark">
                    Mô tả sản phẩm <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control rounded-3 ${fieldErrors.description ? 'is-invalid' : ''}`}
                    rows={4}
                    placeholder="Nhập thông tin chi tiết về sản phẩm (tối thiểu 10 ký tự)..."
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (fieldErrors.description) setFieldErrors({ ...fieldErrors, description: undefined });
                    }}
                  />
                  {fieldErrors.description && <div className="invalid-feedback">{fieldErrors.description}</div>}
                </div>

                {/* Link hình ảnh */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark">
                    Link hình ảnh (URL) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="url"
                    className={`form-control rounded-3 ${fieldErrors.imageUrl ? 'is-invalid' : ''}`}
                    placeholder="https://images.unsplash.com/..."
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value });
                      if (fieldErrors.imageUrl) setFieldErrors({ ...fieldErrors, imageUrl: undefined });
                    }}
                  />
                  {fieldErrors.imageUrl && <div className="invalid-feedback">{fieldErrors.imageUrl}</div>}

                  {/* Ảnh mẫu chọn nhanh */}
                  <div className="mt-3">
                    <small className="text-muted d-block mb-2">Hoặc chọn nhanh một ảnh mẫu hợp lệ:</small>
                    <div className="d-flex gap-2 flex-wrap">
                      {SAMPLE_IMAGES.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, imageUrl: img });
                            if (fieldErrors.imageUrl) setFieldErrors({ ...fieldErrors, imageUrl: undefined });
                          }}
                          className={`btn p-1 rounded-3 border ${
                            formData.imageUrl === img ? 'border-primary border-2 shadow-sm' : 'border-light'
                          }`}
                          style={{ width: 56, height: 56 }}
                        >
                          <img
                            src={img}
                            alt={`sample-${idx}`}
                            className="w-100 h-100 object-fit-cover rounded-2"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview ảnh hiện tại */}
                  {formData.imageUrl && (
                    <div className="mt-3 p-2 bg-light rounded-3 d-flex align-items-center gap-3 border">
                      <img
                        src={cleanImageUrl(formData.imageUrl)}
                        alt="Preview"
                        className="rounded-2 object-fit-cover border"
                        style={{ width: 64, height: 64 }}
                      />
                      <small className="text-muted text-truncate">
                        Preview: {formData.imageUrl}
                      </small>
                    </div>
                  )}
                </div>

                {/* Buttons Action */}
                <div className="d-flex gap-3 pt-3 border-top">
                  <button
                    type="submit"
                    disabled={isSubmitting || isPending}
                    className="btn btn-primary btn-lg rounded-pill px-5 shadow-sm d-flex align-items-center gap-2"
                  >
                    {isSubmitting || isPending ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <i className={`bi ${isAddMode ? 'bi-check-circle-fill' : 'bi-save-fill'}`}></i>
                        <span>{buttonText}</span>
                      </>
                    )}
                  </button>

                  <Link
                    href="/products"
                    className="btn btn-outline-secondary btn-lg rounded-pill px-4"
                  >
                    Hủy bỏ
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
