# 🚀 TypiCode - Kiến Trúc Cân Bằng Chuẩn Doanh Nghiệp (Enterprise Next.js 14 Monorepo)

Dự án phát triển **TypeScript** & **React / Next.js 14 App Router** theo kiến trúc **Autonomous Feature Modules (Route-Level Colocation)**, **Catch-All Master Dispatcher**, **3 Trụ Cột (Schemas - Actions - Views)**, **Action trả về React Element**, xác thực dữ liệu **Zod Isomorphic** và tích hợp **Platzi Fake Store API**.

---

## 📚 TÀI LIỆU HỆ THỐNG (DOCUMENTATION PORTAL)

Toàn bộ tài liệu chi tiết chuyên sâu đã được phân loại theo chủ đề trong thư mục [`docs/`](./docs):

| Tài liệu | Nội dung chính |
| :--- | :--- |
| 📘 [**Kiến Trúc Tổng Quan (Architecture Overview)**](./docs/ARCHITECTURE_OVERVIEW.md) | Phân tích 4 Trụ Cột, mô hình RSC Hybrid, Bảng so sánh tải trọng & hiệu năng 10.000 Users Scale. |
| 🏛️ [**Tiêu Chuẩn Kiến Trúc Module (Module Standard)**](./docs/MODULE_ARCHITECTURE_STANDARD.md) | **Hình mẫu chuẩn khi tạo module mới**: Private Folder (`_feature`), 2 mô hình Dispatcher, Đề xuất Registry Object Enterprise, Quy trình 6 bước tạo module. |
| 🧠 [**Chiến Lược State & Xác Thực (State & Auth)**](./docs/STATE_AND_AUTH_STRATEGY.md) | Kiến trúc Auth.js v5 (NextAuth), Prisma Adapter SQLite, Hybrid JWT, Account Linking (Google, Facebook), Edge Middleware và Ma trận 6 tầng State. |
| 🪵 [**Cẩm Nang Logging & Quản Lý File Log**](./docs/LOGGING_AND_MONITORING_GUIDE.md) | Hệ thống Logging Isomorphic, tích hợp lõi **Pino v10 + Pino-Roll v4**, cơ chế xoay vòng 5MB và tự dọn dẹp file cũ > 7 ngày. |
| 📚 [**Cẩm Nang Hệ Sinh Thái Thư Viện (Ecosystem Guide)**](./docs/ECOSYSTEM_LIBRARIES_GUIDE.md) | Tổng hợp và đánh giá thư viện chuẩn mực (UI, State, Auth, Database/ORM, Testing, Utilities). |

---

## 📁 Cấu Trúc Thư Mục Toàn Dự Án (Monorepo)

```
typi-code/
├── docs/                                    # 📚 TỔ HỢP TÀI LIỆU KIẾN TRÚC TOÀN DỰ ÁN
│   ├── ARCHITECTURE_OVERVIEW.md             # -> Kiến trúc tổng thể & Benchmark
│   ├── MODULE_ARCHITECTURE_STANDARD.md      # -> Tiêu chuẩn tạo module mới & Dispatcher
│   ├── STATE_AND_AUTH_STRATEGY.md           # -> Cẩm nang Auth.js v5, Hybrid JWT & State
│   ├── LOGGING_AND_MONITORING_GUIDE.md      # -> Cẩm nang Logging Pino, Isomorphic & Rotation
│   └── ECOSYSTEM_LIBRARIES_GUIDE.md         # -> Cẩm nang thư viện React/Next.js
│
├── logs/                                    # 🪵 THƯ MỤC LOG TẬP TRUNG (server.log, app.log)
├── prisma/                                  # 🗄️ CƠ SỞ DỮ LIỆU PRISMA ORM
│   ├── schema.prisma                        # -> 5 Models: User, Account, Session, VerificationToken, ActivityLog
│   └── dev.db                               # -> SQLite Database
│
├── packages/
│   └── shared/                              # 🧠 [CORE SHARED PACKAGE - Dùng chung Web & Mobile]
│       ├── src/domain/                      # -> Types, DTOs, Entities, Repositories Interfaces
│       └── src/infrastructure/              # -> Http-client (ky/fetch), Repositories, Router Dispatchers
│
└── apps/
    └── web/                                 # 💻 [TẦNG GIAO DIỆN WEB (Next.js 14 + Bootstrap 5.3)]
        ├── src/auth.config.ts               # -> Edge-Safe Auth Config (cho Middleware)
        ├── src/auth.ts                      # -> Node Runtime Auth Config (PrismaAdapter, Providers)
        ├── src/middleware.ts                # -> Edge Firewall bảo vệ Route (~0.02ms)
        ├── src/components/                  # -> UI dùng chung toàn web (Navbar, Footer, Loading)
        └── src/app/                         # -> Các Feature Modules tự trị (Autonomous Modules)
            ├── api/auth/[...nextauth]/      # -> OAuth Protocol Gateway cho Google, Facebook
            ├── login/                       # -> Module Xác thực & Đăng nhập (Auth.js v5)
            │   ├── _feature/                # -> [Private Folder] actions, views, schemas, stores
            │   └── [[...slug]]/page.tsx     # -> Dispatcher: /login (Đăng nhập), /login/register (Đăng ký)
            ├── products/                    # -> Module Sản phẩm (CRUD Master Dispatcher)
            ├── posts/                       # -> Module Bài viết (Colocation + ActionDispatcher)
            ├── users/                       # -> Module Người dùng
            └── dashboard/                   # -> Module Dashboard tổng quan
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Mở trình duyệt tại: [http://localhost:3000](http://localhost:3000)

### 3. Kiểm tra kiểu dữ liệu (Typecheck) & Build sản phẩm
```bash
npm run typecheck
npm run build
```

---

## 🛠️ Các Tính Năng Đã Xây Dựng

- 🛍️ **Quản lý sản phẩm (`/products`)**: Chuyển đổi Grid/Table, lọc danh mục, tìm kiếm realtime qua URL SearchParams, CRUD Server Actions.
- 📝 **Quản lý bài viết (`/posts`)**: Áp dụng mô hình **ActionDispatcher + Private Feature Folder (`_feature`)** tự động ánh xạ URL sang các action (`index`, `list`, `add`, `edit`, `delete`, `view-detail`).
- 👥 **Quản lý người dùng (`/users`)**: Danh sách người dùng, phân quyền Role.
- 📊 **Bảng điều khiển (`/dashboard`)**: Tổng quan thống kê và tình trạng hệ thống.
- 📘 **Trang học kiến trúc (`/architecture`)**: Tài liệu chi tiết và sơ đồ trực quan về mô hình **Master Dispatcher + 3 Trụ Cột (Schemas - Actions - Views)**.
