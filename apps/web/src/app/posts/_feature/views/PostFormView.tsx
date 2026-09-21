import Link from 'next/link';
import { Post } from '@repo/shared';

interface PostFormViewProps {
  mode: 'add' | 'edit';
  post?: Post;
}

export function PostFormView({ mode, post }: PostFormViewProps) {
  const isEdit = mode === 'edit';
  const title = isEdit ? `Chỉnh Sửa Bài Viết #${post?.id}` : 'Tạo Bài Viết Mới';

  return (
    <div className="container py-4" style={{ maxWidth: '720px' }}>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/" className="text-decoration-none">Trang chủ</Link></li>
          <li className="breadcrumb-item"><Link href="/posts" className="text-decoration-none">Bài viết</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{title}</li>
        </ol>
      </nav>

      {/* Form Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white border-0 pt-4 px-4 px-md-5">
          <div className="d-flex align-items-center gap-2">
            <span className={`badge ${isEdit ? 'bg-warning text-dark' : 'bg-success'} rounded-pill px-3 py-1`}>
              {isEdit ? 'Action: editAction' : 'Action: addAction'}
            </span>
          </div>
          <h2 className="fw-bold text-dark mt-2 mb-0">{title}</h2>
          <p className="text-muted small">
            Colocation trong <code>app/posts/_feature</code> kết hợp ActionDispatcher.
          </p>
        </div>

        <div className="card-body p-4 p-md-5 pt-2">
          <form action="/posts" method="GET">
            {/* Tiêu đề */}
            <div className="mb-3">
              <label htmlFor="title" className="form-label fw-semibold">
                Tiêu đề bài viết <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={post?.title ?? ''}
                className="form-control rounded-3 py-2"
                placeholder="Nhập tiêu đề bài viết (tối thiểu 5 ký tự)..."
                required
              />
            </div>

            {/* Tác giả & Tags */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label htmlFor="author" className="form-label fw-semibold">
                  Tên tác giả <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  defaultValue={post?.author ?? 'Admin'}
                  className="form-control rounded-3 py-2"
                  placeholder="VD: Dylan Bui"
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="tags" className="form-label fw-semibold">
                  Tags (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  defaultValue={post?.tags?.join(', ') ?? 'nextjs, react, colocation'}
                  className="form-control rounded-3 py-2"
                  placeholder="nextjs, clean-arch, router"
                />
              </div>
            </div>

            {/* Nội dung */}
            <div className="mb-4">
              <label htmlFor="body" className="form-label fw-semibold">
                Nội dung chi tiết <span className="text-danger">*</span>
              </label>
              <textarea
                id="body"
                name="body"
                rows={6}
                defaultValue={post?.body ?? ''}
                className="form-control rounded-3"
                placeholder="Nhập nội dung bài viết chi tiết..."
                required
              />
            </div>

            {/* Nút bấm */}
            <div className="d-flex align-items-center justify-content-between pt-3 border-top">
              <Link href="/posts" className="btn btn-outline-secondary rounded-pill px-4">
                Hủy bỏ
              </Link>
              <button type="submit" className="btn btn-primary rounded-pill px-4 shadow-sm">
                <i className="bi bi-check2-circle me-1"></i>
                {isEdit ? 'Cập nhật bài viết' : 'Đăng bài viết'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
