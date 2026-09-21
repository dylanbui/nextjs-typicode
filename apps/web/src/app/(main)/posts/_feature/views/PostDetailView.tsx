import Link from 'next/link';
import { Post } from '@repo/shared';

interface PostDetailViewProps {
  post: Post;
}

export function PostDetailView({ post }: PostDetailViewProps) {
  return (
    <div className="w-100">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="/" className="text-decoration-none">Trang chủ</Link></li>
          <li className="breadcrumb-item"><Link href="/posts" className="text-decoration-none">Bài viết</Link></li>
          <li className="breadcrumb-item active text-truncate" style={{ maxWidth: '300px' }} aria-current="page">
            {post.title}
          </li>
        </ol>
      </nav>

      {/* Main Post Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="card-body p-4 p-md-5">
          {/* Header Info */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <span className="badge bg-primary text-white rounded-pill px-3 py-1">
              Bài viết #{post.id}
            </span>
            <div className="text-muted small d-flex align-items-center gap-3">
              <span><i className="bi bi-person-fill text-secondary me-1"></i>{post.author}</span>
              <span><i className="bi bi-calendar3 text-secondary me-1"></i>{post.createdAt}</span>
              <span><i className="bi bi-eye-fill text-secondary me-1"></i>{post.viewsCount ?? 120} lượt xem</span>
            </div>
          </div>

          <h1 className="fw-bold text-dark display-6 mb-4">{post.title}</h1>

          {/* Tags */}
          <div className="d-flex flex-wrap gap-1 mb-4 pb-3 border-bottom">
            {post.tags.map((t) => (
              <span key={t} className="badge bg-light text-primary border rounded-pill px-3 py-1">
                #{t}
              </span>
            ))}
          </div>

          {/* Body Content */}
          <div className="fs-5 text-dark lh-lg mb-5" style={{ whiteSpace: 'pre-line' }}>
            {post.body}
          </div>

          {/* Action Bar */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-4 border-top">
            <Link href="/posts" className="btn btn-outline-secondary rounded-pill px-4">
              <i className="bi bi-arrow-left me-1"></i> Quay lại danh sách
            </Link>

            <div className="d-flex gap-2">
              <Link href={`/posts/edit/${post.id}`} className="btn btn-primary rounded-pill px-4">
                <i className="bi bi-pencil-square me-1"></i> Chỉnh sửa
              </Link>
              <Link href={`/posts/delete/${post.id}`} className="btn btn-outline-danger rounded-pill px-3">
                <i className="bi bi-trash me-1"></i> Xóa
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
