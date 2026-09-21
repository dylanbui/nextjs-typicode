'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/app/(auth)/login/_feature/stores/auth.store.client';
import { getCurrentSessionAction } from '@/app/(auth)/login/_feature/actions/session.server';
import { UserDropdownPanel } from './UserDropdownPanel.client';

export default function Navbar() {
  const setUser = useAuthStore((state) => state.setUser);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      getCurrentSessionAction().then((session) => {
        setUser(session);
      });
    }
  }, [isInitialized, setUser]);

  return (
    <header className="sticky-top bg-white border-bottom shadow-sm z-3">
      <nav className="navbar navbar-expand navbar-light container-fluid px-3 px-md-4 py-2">
        {/* LEFT: Logo & Brand Name */}
        <Link href="/dashboard" className="navbar-brand d-flex align-items-center gap-2 m-0 text-decoration-none">
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

        {/* RIGHT: User Dropdown Panel */}
        <div className="ms-auto d-flex align-items-center gap-2">
          <UserDropdownPanel />
        </div>
      </nav>
    </header>
  );
}

