import { Product } from '@repo/shared';
import Link from 'next/link';
import { cleanImageUrl } from '@/lib/image';

interface ProductTableViewProps {
  products: Product[];
}

export function ProductTableView({ products }: ProductTableViewProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-5 bg-white rounded-3 shadow-sm border border-light">
        <i className="bi bi-inbox text-muted display-4 d-block mb-3"></i>
        <h5 className="fw-bold text-dark">Không tìm thấy sản phẩm nào</h5>
        <p className="text-muted small">Vui lòng thử từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col" className="ps-4" style={{ width: 80 }}>Hình Ảnh</th>
              <th scope="col">Tên Sản Phẩm</th>
              <th scope="col">Danh Mục</th>
              <th scope="col">Giá Bán</th>
              <th scope="col" className="text-end pe-4">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const imgUrl = cleanImageUrl(p.images?.[0]);
              return (
                <tr key={p.id}>
                  <td className="ps-4">
                    <img
                      src={imgUrl}
                      alt={p.title}
                      className="rounded-3 object-fit-cover shadow-sm"
                      style={{ width: 48, height: 48 }}
                    />
                  </td>
                  <td>
                    <div className="fw-bold text-dark">{p.title}</div>
                    <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: 320 }}>
                      {p.description || 'Không có mô tả'}
                    </small>
                  </td>
                  <td>
                    {p.category ? (
                      <span className="badge bg-secondary-subtle text-secondary border rounded-pill px-2 py-1">
                        {p.category.name}
                      </span>
                    ) : (
                      <span className="text-muted small">—</span>
                    )}
                  </td>
                  <td>
                    <span className="fw-bold text-primary">${p.price}</span>
                  </td>
                  <td className="text-end pe-4">
                    <div className="btn-group btn-group-sm">
                      <Link
                        href={`/products/${p.id}`}
                        className="btn btn-outline-primary"
                        title="Xem chi tiết"
                      >
                        <i className="bi bi-eye"></i>
                      </Link>
                      <Link
                        href={`/products/update/${p.id}`}
                        className="btn btn-outline-secondary"
                        title="Chỉnh sửa"
                      >
                        <i className="bi bi-pencil"></i>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
