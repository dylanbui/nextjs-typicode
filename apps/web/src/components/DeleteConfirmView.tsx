'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface DeleteConfirmViewProps {
  /**
   * Tiêu đề hiển thị trên hộp thoại xác nhận (Ví dụ: "Xóa Sản Phẩm", "Xóa Bài Viết")
   */
  title?: string;
  /**
   * Tên định danh của mục cần xóa (Ví dụ: "iPhone 15 Pro Max", "Bài viết #12")
   */
  itemName: string;
  /**
   * Mô tả hoặc thông tin phụ thêm (Ví dụ: "Mã: #42 - Giá: $999")
   */
  itemDescription?: string;
  /**
   * Đường dẫn quay lại khi người dùng bấm Hủy (Ví dụ: "/products", "/")
   */
  cancelUrl?: string;
  /**
   * Callback Server Action thực thi hành động xóa
   */
  onConfirmDelete: () => Promise<{ success: boolean; error?: string }>;
  /**
   * Đường dẫn chuyển hướng sau khi xóa thành công (Mặc định sẽ quay về cancelUrl)
   */
  successRedirectUrl?: string;
}

/**
 * 🗑️ Generic Delete Confirm View Component
 * Component giao diện dùng chung cho các màn hình / popup xác nhận xóa dữ liệu
 */
export function DeleteConfirmView({
  title = 'Xác Nhận Xóa',
  itemName,
  itemDescription,
  cancelUrl = '/products',
  onConfirmDelete,
  successRedirectUrl,
}: DeleteConfirmViewProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleConfirm = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const result = await onConfirmDelete();

      if (result.success) {
        alert(`Đã xóa "${itemName}" thành công!`);
        startTransition(() => {
          router.push(successRedirectUrl || cancelUrl);
          router.refresh();
        });
      } else {
        setErrorMessage(result.error || 'Thao tác xóa thất bại. Vui lòng thử lại.');
        setIsDeleting(false);
      }
    } catch {
      setErrorMessage('Đã có lỗi xảy ra trong quá trình xử lý yêu cầu.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 col-xl-5">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white text-center p-4 p-md-5">
            {/* Icon cảnh báo */}
            <div className="text-danger mb-3">
              <i className="bi bi-exclamation-triangle-fill display-3"></i>
            </div>

            {/* Tiêu đề & Nội dung cảnh báo */}
            <h3 className="fw-bold text-dark mb-2">{title}</h3>
            <p className="text-muted mb-3">
              Bạn có chắc chắn muốn xóa mục <strong>&ldquo;{itemName}&rdquo;</strong> không?
            </p>
            <p className="text-danger-emphasis small mb-4">
              <i className="bi bi-shield-exclamation me-1"></i>
              Hành động này sẽ xóa vĩnh viễn dữ liệu và không thể hoàn tác.
            </p>

            {/* Khối mô tả chi tiết nếu có */}
            {itemDescription && (
              <div className="p-3 bg-light rounded-3 small text-secondary mb-4 border text-start">
                {itemDescription}
              </div>
            )}

            {/* Thông báo lỗi nếu có */}
            {errorMessage && (
              <div className="alert alert-danger py-2 px-3 mb-4 small d-flex align-items-center gap-2" role="alert">
                <i className="bi bi-x-circle-fill fs-5"></i>
                <div className="text-start">{errorMessage}</div>
              </div>
            )}

            {/* Các nút bấm thao tác */}
            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center pt-2">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isDeleting}
                className="btn btn-danger btn-lg rounded-pill px-4 shadow-sm d-flex align-items-center justify-content-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash-fill"></i>
                    <span>Xác Nhận Xóa</span>
                  </>
                )}
              </button>

              <Link
                href={cancelUrl}
                className="btn btn-outline-secondary btn-lg rounded-pill px-4 d-flex align-items-center justify-content-center gap-2"
              >
                <i className="bi bi-arrow-left"></i>
                <span>Hủy Bỏ</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmView;
