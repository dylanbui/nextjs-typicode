import Link from 'next/link';

interface PostDeleteViewProps {
  id: number;
}

export function PostDeleteView({ id }: PostDeleteViewProps) {
  return (
    <div className="w-100 py-3 d-flex justify-content-center">
      <div className="w-100" style={{ maxWidth: '560px' }}>
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden text-center p-4 p-md-5">
          <div className="mb-3">
            <div
              className="d-inline-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-circle"
              style={{ width: '80px', height: '80px' }}
            >
              <i className="bi bi-exclamation-triangle-fill fs-1"></i>
            </div>
          </div>

          <span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-1 mb-2 d-inline-block mx-auto">
            Action: deleteAction
          </span>

          <h3 className="fw-bold text-dark mb-2">Xác Nhận Xóa Bài Viết #{id}</h3>
          <p className="text-muted mb-4">
            Bạn có chắc chắn muốn xóa bài viết này không? Hành động này sẽ không thể hoàn tác sau khi thực hiện.
          </p>

          <div className="d-flex justify-content-center gap-3">
            <Link href="/posts" className="btn btn-outline-secondary rounded-pill px-4">
              Hủy bỏ
            </Link>
            <Link href="/posts" className="btn btn-danger rounded-pill px-4 shadow-sm">
              <i className="bi bi-trash-fill me-1"></i> Đồng ý xóa
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
