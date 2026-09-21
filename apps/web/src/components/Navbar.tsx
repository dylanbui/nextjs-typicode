'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/app/login/_feature/stores/auth.store.client';
import { logoutAction } from '@/app/login/_feature/actions/logout.server';
import { getCurrentSessionAction } from '@/app/login/_feature/actions/session.server';

export default function Navbar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      getCurrentSessionAction().then((session) => {
        setUser(session);
      });
    }
  }, [isInitialized, setUser]);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return 'active fw-bold text-primary';
    if (path !== '/' && pathname.startsWith(path)) return 'active fw-bold text-primary';
    return 'text-dark';
  };

  return (
    <header className="sticky-top bg-white border-bottom shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-light container-fluid px-md-5 py-2">
        <Link href="/dashboard" className="navbar-brand d-flex align-items-center gap-2">
          <div
            className="bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: 38, height: 38 }}
          >
            <i className="bi bi-layers-fill fs-5"></i>
          </div>
          <div>
            <span className="fw-bold text-dark fs-5">TypiCode</span>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle ms-2 small">
              Dashboard
            </span>
          </div>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3 gap-1">
            <li className="nav-item">
              <Link href="/dashboard" className={`nav-link px-3 ${isActive('/dashboard')}`}>
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/products" className={`nav-link px-3 ${isActive('/products')}`}>
                <i className="bi bi-box-seam me-1"></i> Sản phẩm
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/posts" className={`nav-link px-3 ${isActive('/posts')}`}>
                <i className="bi bi-journal-richtext me-1"></i> Bài viết
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/users" className={`nav-link px-3 ${isActive('/users')}`}>
                <i className="bi bi-people me-1"></i> Người dùng
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/architecture" className={`nav-link px-3 ${isActive('/architecture')}`}>
                <i className="bi bi-diagram-3 me-1"></i> Kiến trúc
              </Link>
            </li>
          </ul>

          {/* User Profile / Auth State */}
          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            {user ? (
              <div className="d-flex align-items-center gap-2">
                {/* User Info */}
                <div className="d-flex align-items-center gap-2 ps-2 pe-3 py-1 bg-light border rounded-pill">
                  <img
                    src={user.userAvatar || 'https://i.imgur.com/LDOO4Qs.jpg'}
                    alt={user.userName}
                    className="rounded-circle"
                    style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://i.imgur.com/LDOO4Qs.jpg';
                    }}
                  />
                  <span className="fw-semibold text-dark small">{user.userName}</span>
                  <span className="badge bg-primary rounded-pill small">{user.userRole}</span>
                </div>

                {/* ICON BUTTON DẪN VÀO TRANG QUẢN LÝ USER */}
                <Link
                  href="/users"
                  className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: '34px', height: '34px' }}
                  title="Quản Lý Người Dùng"
                >
                  <i className="bi bi-people-fill"></i>
                </Link>

                {/* LOGOUT BUTTON */}
                <form action={logoutAction} className="m-0">
                  <button
                    type="submit"
                    className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
                    title="Đăng xuất"
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Thoát</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link href="/login" className="btn btn-primary btn-sm rounded-pill px-4 shadow-sm">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Đăng Nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
