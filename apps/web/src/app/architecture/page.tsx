import Link from 'next/link';

export default function ArchitecturePage() {
  return (
    <div className="py-2">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-5">
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 mb-2">
          Hướng Dẫn Kiến Trúc Chuẩn Doanh Nghiệp (Enterprise Scale)
        </span>
        <h1 className="fw-bold text-dark display-6">Mô Hình RSC Hybrid &amp; Catch-All Dispatcher</h1>
        <p className="text-muted">
          Cân bằng tải Server - Client cho 10.000 users: <strong>1 Master Dispatcher</strong> + <strong>3 Trụ Cột (Schemas - Actions - Views)</strong> + <strong>Action trả về React Element</strong>.
        </p>
      </div>

      {/* Sơ đồ tổng quan */}
      <div className="card border-0 shadow-sm rounded-4 bg-white mb-5 overflow-hidden">
        <div className="card-header bg-dark text-white p-4">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-diagram-3-fill text-primary me-2"></i>Cây Thư Mục Thực Tế Dự Án (Mới Nhất)
          </h5>
        </div>
        <div className="card-body p-4 p-md-5">
          <pre className="bg-light p-3 rounded-3 text-dark mb-0 fs-6" style={{ fontFamily: 'monospace' }}>
{`typi-code/
├── prisma/                          # 🗄️ CƠ SỞ DỮ LIỆU PRISMA SQLITE
│   ├── schema.prisma                # -> Models: User, Account (OAuth), Session, Log
│   └── dev.db                       # -> SQLite Database File
│
├── packages/shared/                 # 🧠 [CORE] Dùng chung Web & Mobile (Domain & Infra)
│   ├── domain/                      # -> Types, Entities, Repositories Interfaces
│   └── infrastructure/              # -> Http-client, Repositories, Router Dispatchers
│
└── apps/web/src/
    ├── auth.config.ts               # 🛡️ Edge-Safe Auth Config (cho Middleware)
    ├── auth.ts                      # 🔐 Node Runtime Auth Config (Prisma, Providers)
    ├── middleware.ts                # ⚡ Edge Firewall bảo vệ Tuyến (~0.02ms)
    │
    └── app/                         # 🚪 [AUTONOMOUS FEATURE MODULES]
        ├── api/auth/[...nextauth]/  # -> OAuth Protocol Gateway (Google, Facebook)
        │
        ├── login/                   # 🔑 Module Xác Thực & Đăng Nhập
        │   ├── _feature/            # -> [Private] actions, views, schemas, stores
        │   └── [[...slug]]/page.tsx # -> Dispatcher (/login, /login/register)
        │
        ├── posts/                   # 📝 Module Bài Viết (Colocated ActionDispatcher)
        │   ├── _feature/            # -> [Private] actions, views, schemas
        │   └── [[...slug]]/page.tsx # -> Dispatcher (/posts, /posts/add, /posts/[id]...)
        │
        ├── products/                # 🛍️ Module Sản Phẩm (CRUD Master Dispatcher)
        ├── users/                   # 👥 Module Quản Lý Người Dùng
        └── dashboard/               # 📊 Module Bảng Điều Khiển Tổng Quan`}
          </pre>
        </div>
      </div>

      {/* Chi tiết 4 trụ cột */}
      <div className="row g-4 mb-5">
        {/* Khối 1 */}
        <div className="col-lg-6">
          <div className="card h-100 border-0 shadow-sm rounded-4 bg-white">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-secondary rounded-pill px-3 py-1">Trụ Cột 1</span>
                <h5 className="fw-bold text-dark mb-0">Catch-All Master Dispatcher</h5>
              </div>
              <p className="text-muted small">
                Sử dụng <code>[[...slug]]/page.tsx</code> duy nhất để bắt mọi URL (<code>/products</code>, <code>/products/add</code>, <code>/products/42</code>, <code>/products/update/42</code>), xóa bỏ folder nesting rườm rà.
              </p>
              <div className="bg-light p-3 rounded-3 small">
                <div className="text-muted fw-bold mb-1">// app/products/[[...slug]]/page.tsx</div>
                <code className="text-dark">
                  switch (route.type) &#123;<br />
                  &nbsp;&nbsp;case &apos;LIST&apos;: return await productListAction(searchParams);<br />
                  &nbsp;&nbsp;case &apos;ADD&apos;: return await productAddAction();<br />
                  &nbsp;&nbsp;case &apos;DETAIL&apos;: return await productDetailAction(route.id);<br />
                  &#125;
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Khối 2 */}
        <div className="col-lg-6">
          <div className="card h-100 border-0 shadow-sm rounded-4 bg-white">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-info text-dark rounded-pill px-3 py-1">Trụ Cột 2</span>
                <h5 className="fw-bold text-dark mb-0">Zod Schemas Isomorphic</h5>
              </div>
              <p className="text-muted small">
                Tập trung toàn bộ luật xác thực vào <code>schemas/</code>: Phân tích Route an toàn tại Server, lọc query URL và kiểm tra Form tức thì tại Client (0ms).
              </p>
              <div className="bg-light p-3 rounded-3 small">
                <div className="text-muted fw-bold mb-1">// features/products/schemas/product.schema.ts</div>
                <code className="text-dark">
                  export const ProductFormSchema = z.object(&#123;<br />
                  &nbsp;&nbsp;title: z.string().min(3),<br />
                  &nbsp;&nbsp;price: z.coerce.number().min(1),<br />
                  &#125;);
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Khối 3 */}
        <div className="col-lg-6">
          <div className="card h-100 border-0 shadow-sm rounded-4 bg-white">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-success rounded-pill px-3 py-1">Trụ Cột 3</span>
                <h5 className="fw-bold text-dark mb-0">Server Action Return React Element</h5>
              </div>
              <p className="text-muted small">
                Mỗi <code>*.action.tsx</code> đóng vai trò nạp dữ liệu tại Server, xử lý nghiệp vụ, gắn kết vào View tương ứng và trả về <code>JSX.Element</code> sẵn sàng hiển thị.
              </p>
              <div className="bg-light p-3 rounded-3 small">
                <div className="text-muted fw-bold mb-1">// features/products/actions/product_list.action.tsx</div>
                <code className="text-dark">
                  export async function productListAction(searchParams) &#123;<br />
                  &nbsp;&nbsp;const [cats, prods] = await Promise.all([...]);<br />
                  &nbsp;&nbsp;return &lt;ProductListView products=&#123;prods&#125; /&gt;;<br />
                  &#125;
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Khối 4 */}
        <div className="col-lg-6">
          <div className="card h-100 border-0 shadow-sm rounded-4 bg-white">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-primary rounded-pill px-3 py-1">Trụ Cột 4</span>
                <h5 className="fw-bold text-dark mb-0">Dumb Views &amp; Client Interactive Leaves</h5>
              </div>
              <p className="text-muted small">
                Views là Server Component (0KB JS bundle). Chỉ những phần cần tương tác gõ phím/bấm nút (<code>ProductFilterBar.client.tsx</code>) mới dùng <code>&apos;use client&apos;</code>.
              </p>
              <div className="bg-light p-3 rounded-3 small">
                <div className="text-muted fw-bold mb-1">// features/products/components/ProductFilterBar.client.tsx</div>
                <code className="text-dark">
                  &apos;use client&apos;;<br />
                  // Cập nhật URL searchParams với useTransition()
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="p-4 bg-white rounded-4 shadow-sm border text-center">
        <h5 className="fw-bold text-dark mb-2">Khám Phá Hệ Thống Ngay!</h5>
        <p className="text-muted small mb-3">
          Trải nghiệm tốc độ tải trang dưới 100ms với mô hình Catch-All Master Dispatcher.
        </p>
        <Link href="/products" className="btn btn-primary rounded-pill px-4">
          <i className="bi bi-arrow-left me-1"></i> Xem danh sách sản phẩm
        </Link>
      </div>
    </div>
  );
}
