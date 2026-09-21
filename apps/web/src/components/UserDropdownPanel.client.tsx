'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/app/(auth)/login/_feature/stores/auth.store.client';
import { logoutAction } from '@/app/(auth)/login/_feature/actions/logout.server';
import { SessionTimer } from '@/app/(main)/dashboard/_feature/components/SessionTimer.client';
import { SessionSizeBadge } from '@/app/(main)/dashboard/_feature/components/SessionSizeBadge.client';
import { cleanImageUrl } from '@/lib/image';

export function UserDropdownPanel() {
  const user = useAuthStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) {
    return (
      <Link href="/login" className="btn btn-primary btn-sm rounded-pill px-4 shadow-sm">
        <i className="bi bi-box-arrow-in-right me-1"></i> Đăng Nhập
      </Link>
    );
  }

  const avatarUrl = cleanImageUrl(user.userAvatar || 'https://i.imgur.com/LDOO4Qs.jpg');

  return (
    <div className="position-relative" ref={dropdownRef}>
      {/* TRIGGER BUTTON (Pill style theo chuẩn yêu cầu) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="btn d-flex align-items-center gap-2 ps-2 pe-3 py-1 bg-light border rounded-pill shadow-sm transition hover-lift text-start"
        style={{ cursor: 'pointer' }}
        aria-expanded={isOpen}
      >
        <img
          src={avatarUrl}
          alt={user.userName}
          className="rounded-circle border border-1 border-primary-subtle"
          style={{ width: '30px', height: '30px', objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://i.imgur.com/LDOO4Qs.jpg';
          }}
        />
        <div className="d-flex flex-column" style={{ lineHeight: 1.1 }}>
          <span className="fw-semibold text-dark small">{user.userName}</span>
          <span className="text-muted" style={{ fontSize: '0.7rem' }}>
            {user.userRole.toUpperCase()}
          </span>
        </div>
        <i
          className={`bi bi-chevron-down ms-1 text-secondary small transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
          }}
        ></i>
      </button>

      {/* DROPDOWN PANEL */}
      {isOpen && (
        <div
          className="position-absolute end-0 mt-2 bg-white rounded-4 shadow-lg border p-3 z-3"
          style={{
            width: '320px',
            animation: 'fadeInSlide 0.2s ease-out forwards',
          }}
        >
          {/* 1. Header: Thông tin User & Role */}
          <div className="d-flex align-items-center gap-3 pb-3 border-bottom">
            <img
              src={avatarUrl}
              alt={user.userName}
              className="rounded-circle border border-2 border-primary shadow-sm"
              style={{ width: '48px', height: '48px', objectFit: 'cover' }}
            />
            <div className="overflow-hidden">
              <div className="d-flex align-items-center gap-2 mb-0">
                <span className="fw-bold text-dark text-truncate" style={{ maxWidth: '140px' }}>
                  {user.userName}
                </span>
                <span
                  className={`badge rounded-pill small ${
                    user.userRole === 'admin' ? 'bg-primary' : 'bg-info'
                  }`}
                  style={{ fontSize: '0.68rem' }}
                >
                  {user.userRole}
                </span>
              </div>
              <div className="text-muted small text-truncate" style={{ fontSize: '0.78rem' }}>
                <i className="bi bi-envelope me-1"></i>
                {user.userEmail}
              </div>
              {user.sessionId && (
                <div className="text-secondary small mt-1" style={{ fontSize: '0.7rem' }}>
                  <i className="bi bi-shield-check text-success me-1"></i>
                  Session: <code>{user.sessionId.slice(0, 8)}...</code>
                </div>
              )}
            </div>
          </div>

          {/* 2. Session Metrics (Timer & Cookie Size) */}
          <div className="py-3 border-bottom d-flex flex-column gap-2">
            <div className="text-muted fw-semibold" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Trạng Thái Phiên & Bộ Nhớ
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <SessionTimer />
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <SessionSizeBadge />
            </div>
          </div>

          {/* 3. Quick Links (Danh sách User) */}
          <div className="py-2 border-bottom">
            <Link
              href="/users"
              onClick={() => setIsOpen(false)}
              className="dropdown-item d-flex align-items-center justify-content-between py-2 px-2 rounded-3 text-dark text-decoration-none hover-bg-light"
            >
              <div className="d-flex align-items-center gap-2">
                <div
                  className="bg-primary-subtle text-primary rounded-2 p-1 d-flex align-items-center justify-content-center"
                  style={{ width: '28px', height: '28px' }}
                >
                  <i className="bi bi-people-fill"></i>
                </div>
                <span className="small fw-semibold">Danh Sách Người Dùng</span>
              </div>
              <i className="bi bi-arrow-right-short text-muted fs-5"></i>
            </Link>
          </div>

          {/* 4. Logout Action */}
          <div className="pt-2">
            <form action={logoutAction} className="m-0">
              <button
                type="submit"
                className="btn btn-outline-danger btn-sm w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold shadow-sm"
              >
                <i className="bi bi-box-arrow-right"></i>
                <span>Đăng Xuất Khỏi Hệ Thống</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
