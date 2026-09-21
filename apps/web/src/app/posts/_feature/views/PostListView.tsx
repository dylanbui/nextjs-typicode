import Link from 'next/link';
import { Post } from '@repo/shared';

interface PostListViewProps {
  posts: Post[];
  search?: string;
  tag?: string;
}

export function PostListView({ posts, search = '', tag = '' }: PostListViewProps) {
  return (
    <div className="container py-4">
      {/* Breadcrumb & Title */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1 small">
              <li className="breadcrumb-item"><Link href="/" className="text-decoration-none">Trang chủ</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Bài viết (Posts)</li>
            </ol>
          </nav>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-journal-richtext text-primary me-2"></i>Quản Lý Bài Viết
          </h2>
          <p className="text-muted small mb-0">
            Mô hình Colocation Private Folder <code>app/posts/_feature</code> + <strong>ActionDispatcher</strong>.
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link href="/posts/add" className="btn btn-primary rounded-pill px-3 shadow-sm">
            <i className="bi bi-plus-circle-fill me-1"></i> Viết bài mới
          </Link>
        </div>
      </div>

      {/* Action Route Quick Links Demo */}
      <div className="card border-0 bg-light rounded-4 p-3 mb-4 shadow-sm">
        <div className="d-flex flex-wrap align-items-center gap-2 small">
          <span className="fw-bold text-secondary">
            <i className="bi bi-signpost-split me-1"></i>Kiểm thử URL Action:
          </span>
          <Link href="/posts" className="badge bg-white text-dark border text-decoration-none p-2 rounded-pill">
            /posts (index)
          </Link>
          <Link href="/posts/list" className="badge bg-white text-dark border text-decoration-none p-2 rounded-pill">
            /posts/list (listAction)
          </Link>
          <Link href="/posts/add" className="badge bg-white text-dark border text-decoration-none p-2 rounded-pill">
            /posts/add (addAction)
          </Link>
          <Link href="/posts/view-detail/1" className="badge bg-white text-dark border text-decoration-none p-2 rounded-pill">
            /posts/view-detail/1 (viewDetailAction)
          </Link>
          <Link href="/posts/1" className="badge bg-white text-dark border text-decoration-none p-2 rounded-pill">
            /posts/1 (Fallback ID)
          </Link>
          <Link href="/posts/edit/1" className="badge bg-white text-dark border text-decoration-none p-2 rounded-pill">
            /posts/edit/1 (editAction)
          </Link>
          <Link href="/posts/delete/1" className="badge bg-white text-dark border text-decoration-none p-2 rounded-pill">
            /posts/delete/1 (deleteAction)
          </Link>
        </div>
      </div>

      {/* Post List */}
      <div className="row g-4">
        {posts.map((post) => (
          <div key={post.id} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden transition-all hover-shadow">
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2 py-1 small">
                    #{post.id}
                  </span>
                  <span className="text-muted small">
                    <i className="bi bi-clock me-1"></i>{post.createdAt}
                  </span>
                </div>

                <h5 className="card-title fw-bold text-dark mb-2 line-clamp-2">
                  <Link href={`/posts/view-detail/${post.id}`} className="text-dark text-decoration-none hover-primary">
                    {post.title}
                  </Link>
                </h5>

                <p className="card-text text-muted small flex-grow-1 line-clamp-3 mb-3">
                  {post.body}
                </p>

                {/* Tags */}
                <div className="d-flex flex-wrap gap-1 mb-3">
                  {post.tags.map((t) => (
                    <span key={t} className="badge bg-light text-secondary border rounded-pill px-2 py-1 small">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Footer Meta & Actions */}
                <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                  <div className="small text-muted">
                    <i className="bi bi-person-circle me-1"></i>{post.author}
                  </div>
                  <div className="btn-group btn-group-sm">
                    <Link
                      href={`/posts/view-detail/${post.id}`}
                      className="btn btn-outline-secondary rounded-start-pill"
                      title="Xem chi tiết"
                    >
                      <i className="bi bi-eye"></i>
                    </Link>
                    <Link
                      href={`/posts/edit/${post.id}`}
                      className="btn btn-outline-primary"
                      title="Chỉnh sửa"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <Link
                      href={`/posts/delete/${post.id}`}
                      className="btn btn-outline-danger rounded-end-pill"
                      title="Xóa bài viết"
                    >
                      <i className="bi bi-trash"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
