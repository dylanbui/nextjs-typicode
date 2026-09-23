import Link from 'next/link';

export default function ArchitecturePage() {
  return (
    <div className="py-2">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-5">
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 mb-2">
          Hướng Dẫn Kiến Trúc Chuẩn Doanh Nghiệp (Enterprise Scale)
        </span>
        <h1 className="fw-bold text-dark display-6">Mô Hình RSC Hybrid &amp; Autonomous Feature Modules</h1>
        <p className="text-muted">
          Cân bằng tải Server - Client cho 10.000 users: <strong>ActionDispatcher Thống Nhất</strong> + <strong>Route-Level Colocation (`_feature`)</strong> + <strong>Modular Navigation Registry</strong> + <strong>RSC Hybrid 0KB Bundle</strong>.
        </p>
      </div>

      {/* Sơ đồ tổng quan cây thư mục */}
      <div className="card border-0 shadow-sm rounded-4 bg-white mb-5 overflow-hidden">
        <div className="card-header bg-dark text-white p-4 d-flex align-items-center justify-content-between">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-diagram-3-fill text-primary me-2"></i>Cây Thư Mục Thực Tế Dự Án (Chuẩn Hóa Mới Nhất)
          </h5>
          <span className="badge bg-success rounded-pill px-3 py-1">Clean Architecture v4.0</span>
        </div>
        <div className="card-body p-4 p-md-5">
          <pre className="bg-light p-3 rounded-3 text-dark mb-0 fs-6" style={{ fontFamily: 'monospace' }}>
{`typi-code/
├── prisma/                                  # 🗄️ CƠ SỞ DỮ LIỆU PRISMA SQLITE
│   ├── schema.prisma                        # -> Models: User, Account (OAuth), Session, Log
│   └── dev.db                               # -> SQLite Database File
│
├── packages/shared/                         # 🧠 [CORE] Thư viện chia sẻ đa nền tảng
│   ├── domain/                              # -> Types, Entities, Repositories Interfaces
│   └── infrastructure/                      # -> Http-client, ActionDispatcher, Logger, Session
│
└── apps/web/src/
    ├── auth.config.ts                       # 🛡️ Edge-Safe Auth Config (cho Middleware)
    ├── auth.ts                              # 🔐 Node Runtime Auth Config (Prisma, Providers)
    ├── middleware.ts                        # ⚡ Edge Firewall bảo vệ Tuyến (~0.02ms)
    │
    ├── components/
    │   ├── navigation/                      # 🧭 PHÂN HỆ MENU & NAVIGATION ĐÓNG GÓI
    │   │   ├── SidebarTreeMenu.client.tsx   # -> UI Tree Menu Client Component
    │   │   ├── menu.types.ts                # -> Kiểu MenuModule, MenuAction, UserRole
    │   │   ├── menu.registry.ts             # -> Tổng hợp & sort order tất cả module menu
    │   │   └── index.ts                     # -> Barrel export (@/components/navigation)
    │   ├── Navbar.tsx                       # -> Header Bar & User Dropdown Panel
    │   └── Footer.tsx                       # -> Footer chuẩn
    │
    └── app/                                 # 🚪 [ROUTE GROUPS & AUTONOMOUS MODULES]
        ├── (auth)/                          # 🔒 Route Group Xác Thực (100vh Centered Layout)
        │   ├── layout.tsx
        │   └── login/                       # 🔑 Module Đăng Nhập & Đăng Ký
        │       ├── _feature/                # -> [Private] actions, views, schemas, stores
        │       └── [[...slug]]/page.tsx     # -> ActionDispatcher (/login, /login/register)
        │
        └── (main)/                          # 🏛️ Route Group Nghiệp Vụ Chính (2-Column SPA Layout)
            ├── layout.tsx                   # -> Server Layout (Auth Guard & Cung cấp Menu)
            │
            ├── dashboard/                   # 📊 Module Bảng Điều Khiển
            │   ├── dashboard.menu.ts        # -> Cấu hình Menu & Quyền (order: 10)
            │   ├── _feature/                # -> [Private] actions, views, schemas
            │   └── [[...slug]]/page.tsx     # -> ActionDispatcher (/dashboard)
            │
            ├── products/                    # 🛍️ Module Quản Lý Sản Phẩm
            │   ├── products.menu.ts         # -> Cấu hình Menu & Quyền (order: 20)
            │   ├── _feature/                # -> [Private] actions, views, schemas, components
            │   └── [[...slug]]/page.tsx     # -> ActionDispatcher (/products, /add, /[id]...)
            │
            ├── posts/                       # 📝 Module Quản Lý Bài Viết
            │   ├── posts.menu.ts            # -> Cấu hình Menu & Quyền (order: 30)
            │   ├── _feature/                # -> [Private] actions, views, schemas
            │   └── [[...slug]]/page.tsx     # -> ActionDispatcher (/posts, /posts/add...)
            │
            ├── users/                       # 👥 Module Quản Lý Người Dùng
            │   ├── users.menu.ts            # -> Cấu hình Menu & Quyền (order: 40)
            │   ├── _feature/                # -> [Private] actions, views, schemas
            │   └── [[...slug]]/page.tsx     # -> ActionDispatcher (/users, /users/add...)
            │
            └── architecture/                # 📐 Module Tài Liệu Kiến Trúc
                ├── architecture.menu.ts     # -> Cấu hình Menu (order: 99)
                └── page.tsx`}
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
                <h5 className="fw-bold text-dark mb-0">Master ActionDispatcher Thống Nhất</h5>
              </div>
              <p className="text-muted small">
                Sử dụng <code>dispatchAction()</code> tự động ánh xạ URL slug sang hàm Action tương ứng (<code>indexAction</code>, <code>addAction</code>, <code>viewDetailAction</code>, <code>updateAction</code>), kèm đầy đủ lifecycle hooks.
              </p>
              <div className="bg-light p-3 rounded-3 small">
                <div className="text-muted fw-bold mb-1">// app/(main)/products/[[...slug]]/page.tsx</div>
                <code className="text-dark">
                  return await dispatchAction(<br />
                  &nbsp;&nbsp;productActions,<br />
                  &nbsp;&nbsp;slug,<br />
                  &nbsp;&nbsp;rawSearchParams,<br />
                  &nbsp;&nbsp;&#123; moduleName: &apos;Products&apos; &#125;<br />
                  );
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
                <h5 className="fw-bold text-dark mb-0">Modular Menu &amp; Centralized Registry</h5>
              </div>
              <p className="text-muted small">
                Mỗi module tự quản lý file <code>*.menu.ts</code> riêng biệt (khai báo <code>order</code>, <code>roles</code>, <code>path</code>). Registry tập trung sắp xếp và lọc quyền an toàn tại Server trước khi truyền xuống Client Sidebar.
              </p>
              <div className="bg-light p-3 rounded-3 small">
                <div className="text-muted fw-bold mb-1">// app/(main)/products/products.menu.ts</div>
                <code className="text-dark">
                  export const productsMenu: MenuModule = &#123;<br />
                  &nbsp;&nbsp;id: &apos;products&apos;,<br />
                  &nbsp;&nbsp;order: 20,<br />
                  &nbsp;&nbsp;children: [...]<br />
                  &#125;;
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
                <div className="text-muted fw-bold mb-1">// app/(main)/products/_feature/actions/product_list.action.tsx</div>
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
                <div className="text-muted fw-bold mb-1">// app/(main)/products/_feature/components/ProductFilterBar.client.tsx</div>
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
