'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '@repo/shared';
import { deleteUserAction } from '../actions/user_mutations.action';

interface UserDetailViewProps {
  user: User;
}

export function UserDetailView({ user }: UserDetailViewProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${user.name}" không?`)) {
      return;
    }
    setIsDeleting(true);
    const result = await deleteUserAction(user.id);
    setIsDeleting(false);

    if (!result.success) {
      alert(result.error || 'Xóa không thành công!');
    } else {
      router.push('/users');
      router.refresh();
    }
  };

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link href="/dashboard" className="text-decoration-none text-muted small">
          <i className="bi bi-speedometer2 me-1"></i> Dashboard
        </Link>
        <span className="text-muted">/</span>
        <Link href="/users" className="text-decoration-none text-muted small">
          Quản Lý Người Dùng
        </Link>
        <span className="text-muted">/</span>
        <span className="small text-primary fw-semibold">Chi Tiết #{user.id}</span>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            {/* Card Header Background */}
            <div className="card-header bg-dark text-white p-4 p-md-5 bg-gradient text-center position-relative">
              <img
                src={user.avatar || 'https://i.imgur.com/LDOO4Qs.jpg'}
                alt={user.name}
                className="rounded-circle border border-4 border-white shadow-lg mb-3"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://i.imgur.com/LDOO4Qs.jpg';
                }}
              />
              <h3 className="fw-bold mb-1 text-white">{user.name}</h3>
              <p className="text-secondary small mb-2">{user.email}</p>
              <span
                className={`badge rounded-pill px-3 py-2 ${
                  user.role === 'admin' ? 'bg-primary' : 'bg-info'
                }`}
              >
                {user.role.toUpperCase()}
              </span>
            </div>

            {/* Details Body */}
            <div className="card-body p-4 p-md-5">
              <h5 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                <i className="bi bi-person-vcard-fill text-primary"></i> Thông Tin Chi Tiết Tài Khoản
              </h5>

              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6">
                  <div className="p-3 bg-light rounded-3">
                    <div className="text-secondary small mb-1">Mã Định Danh (ID)</div>
                    <div className="fw-bold text-dark">#{user.id}</div>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="p-3 bg-light rounded-3">
                    <div className="text-secondary small mb-1">Vai Trò Hệ Thống</div>
                    <div className="fw-bold text-capitalize text-dark">{user.role}</div>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="p-3 bg-light rounded-3">
                    <div className="text-secondary small mb-1">Địa Chỉ Email</div>
                    <div className="fw-bold text-dark">{user.email}</div>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="p-3 bg-light rounded-3">
                    <div className="text-secondary small mb-1">Mật Khẩu (Mã hóa)</div>
                    <div className="fw-bold font-monospace text-muted small">••••••••••••••</div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="p-3 bg-light rounded-3">
                    <div className="text-secondary small mb-1">Link Ảnh Avatar</div>
                    <div className="text-truncate text-muted small">{user.avatar}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-3 border-top">
                <Link href="/users" className="btn btn-outline-secondary rounded-pill px-4">
                  <i className="bi bi-arrow-left me-1"></i> Quay lại
                </Link>

                <div className="d-flex align-items-center gap-2">
                  <Link
                    href={`/users/update/${user.id}`}
                    className="btn btn-primary rounded-pill px-4 shadow-sm"
                  >
                    <i className="bi bi-pencil-square me-1"></i> Chỉnh Sửa
                  </Link>

                  <button
                    type="button"
                    className="btn btn-outline-danger rounded-pill px-4"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <span className="spinner-border spinner-border-sm me-1"></span>
                    ) : (
                      <i className="bi bi-trash me-1"></i>
                    )}
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
