import React from 'react';
import Link from 'next/link';

interface NavShortcut {
  title: string;
  description: string;
  href: string;
  icon: string;
  colorClass: string;
  badge?: string;
}

const SHORTCUTS: NavShortcut[] = [
  {
    title: 'Quản Lý Sản Phẩm',
    description: 'Xem danh sách, thêm, sửa, xóa sản phẩm và phân trang tự động',
    href: '/products',
    icon: 'bi-box-seam',
    colorClass: 'bg-primary text-primary',
    badge: 'Platzi API',
  },
  {
    title: 'Bài Viết (Posts)',
    description: 'Quản lý bài viết với Master Catch-All Router & Isomorphic Fetch',
    href: '/posts',
    icon: 'bi-journal-richtext',
    colorClass: 'bg-warning text-warning',
    badge: 'JSONPlaceholder',
  },
  {
    title: 'Tài Khoản Người Dùng',
    description: 'Quản lý phân quyền Role (Admin/Customer), trạng thái Active/Blocked',
    href: '/users',
    icon: 'bi-people',
    colorClass: 'bg-success text-success',
    badge: 'Prisma SQLite',
  },
  {
    title: 'Kiến Trúc Hệ Thống',
    description: 'Sơ đồ Clean Architecture, NextAuth v5, Multi-Transport Logging',
    href: '/architecture',
    icon: 'bi-diagram-3',
    colorClass: 'bg-info text-info',
    badge: 'Tài Liệu',
  },
];

export function QuickNavGrid() {
  return (
    <div className="row g-3 mb-4">
      {SHORTCUTS.map((s, idx) => (
        <div key={idx} className="col-12 col-md-6 col-xl-3">
          <Link
            href={s.href}
            className="card shadow-sm border-0 rounded-4 text-decoration-none h-100 p-4 transition hover-lift bg-white"
          >
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div
                className={`rounded-3 p-2 bg-opacity-10 d-flex align-items-center justify-content-center ${s.colorClass}`}
                style={{ width: '44px', height: '44px' }}
              >
                <i className={`bi ${s.icon} fs-4`}></i>
              </div>
              {s.badge && (
                <span className="badge bg-light text-secondary border small">{s.badge}</span>
              )}
            </div>
            <h6 className="fw-bold text-dark mb-1">{s.title}</h6>
            <p className="text-secondary small mb-0 line-clamp-2">{s.description}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}
