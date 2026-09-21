import React from 'react';
import Link from 'next/link';
import { Product, User, SessionData } from '@repo/shared';
import { cleanImageUrl } from '@/lib/image';
import { StatCard } from '../components/StatCard';
import { QuickNavGrid } from '../components/QuickNavGrid';

interface DashboardOverviewViewProps {
  user: SessionData;
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  recentProducts: Product[];
  recentUsers: User[];
  sessionSizeBytes?: number;
}

export function DashboardOverviewView({
  totalProducts,
  totalCategories,
  totalUsers,
  recentProducts,
  recentUsers,
}: DashboardOverviewViewProps) {
  return (
    <div className="w-100">
      {/* 1. STATS KPI CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Tổng Sản Phẩm"
            value={totalProducts}
            subtitle="Nạp realtime từ Platzi Fake API"
            icon="bi-box-seam-fill"
            colorClass="bg-primary"
            badgeText="Sẵn sàng"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Tổng Danh Mục"
            value={totalCategories}
            subtitle="Phân loại hàng hóa tự động"
            icon="bi-tags-fill"
            colorClass="bg-success"
            badgeText="Đồng bộ"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Tổng Người Dùng"
            value={totalUsers}
            subtitle="Admin & Customer tài khoản"
            icon="bi-people-fill"
            colorClass="bg-info"
            badgeText="Hoạt động"
            badgeClass="bg-info-subtle text-info-emphasis"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Trạng Thái Phiên"
            value="30 Phút"
            subtitle="Tự động gia hạn khi có tương tác"
            icon="bi-shield-check"
            colorClass="bg-warning text-dark"
            badgeText="Sliding"
            badgeClass="bg-warning-subtle text-warning-emphasis"
          />
        </div>
      </div>

      {/* 3. QUICK NAVIGATION GRID (SUB-FEATURES) */}
      <QuickNavGrid />

      {/* 4. RECENT ACTIVITY: PRODUCTS & USERS */}
      <div className="row g-4">
        {/* Recent Products */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 h-100 overflow-hidden">
            <div className="card-header bg-white border-bottom p-4 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-box-seam text-primary fs-5"></i>
                <h6 className="fw-bold mb-0">Sản Phẩm Mới Cập Nhật</h6>
              </div>
              <Link href="/products" className="btn btn-sm btn-light rounded-pill px-3 small fw-semibold">
                Xem tất cả <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>

            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {recentProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="list-group-item list-group-item-action p-3 d-flex align-items-center justify-content-between text-decoration-none border-0 border-bottom"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={cleanImageUrl(p.images?.[0] || 'https://placehold.co/60x60')}
                        alt={p.title}
                        className="rounded-3"
                        style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                      />
                      <div>
                        <div className="fw-semibold text-dark small text-truncate" style={{ maxWidth: '240px' }}>
                          {p.title}
                        </div>
                        <span className="badge bg-light text-muted border small">
                          {p.category?.name || 'Chung'}
                        </span>
                      </div>
                    </div>
                    <div className="fw-bold text-primary">${p.price}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 h-100 overflow-hidden">
            <div className="card-header bg-white border-bottom p-4 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-people text-success fs-5"></i>
                <h6 className="fw-bold mb-0">Người Dùng Trong Hệ Thống</h6>
              </div>
              <Link href="/users" className="btn btn-sm btn-light rounded-pill px-3 small fw-semibold">
                Quản lý User <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>

            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {recentUsers.map((u) => (
                  <Link
                    key={u.id}
                    href={`/users/${u.id}`}
                    className="list-group-item list-group-item-action p-3 d-flex align-items-center justify-content-between text-decoration-none border-0 border-bottom"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={cleanImageUrl(u.avatar || 'https://i.imgur.com/LDOO4Qs.jpg')}
                        alt={u.name}
                        className="rounded-circle border"
                        style={{ width: '44px', height: '44px', objectFit: 'cover' }}
                      />
                      <div>
                        <div className="fw-semibold text-dark small">{u.name}</div>
                        <div className="text-muted small" style={{ fontSize: '0.78rem' }}>
                          {u.email}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`badge rounded-pill ${
                        u.role === 'admin' ? 'bg-primary-subtle text-primary' : 'bg-light text-muted border'
                      }`}
                    >
                      {u.role}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
