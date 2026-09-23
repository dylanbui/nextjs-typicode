'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, UserRole } from '@repo/shared';
import { deleteUserAction } from '../actions/user_mutations.action';

interface UserListViewProps {
  users: User[];
  currentRoleFilter?: string;
  searchKeyword?: string;
}

export function UserListView({
  users,
  currentRoleFilter,
  searchKeyword = '',
}: UserListViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchKeyword);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleFilterRole = (role?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (role) {
      params.set('role', role);
    } else {
      params.delete('role');
    }
    router.push(`/users?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) {
      params.set('search', search.trim());
    } else {
      params.delete('search');
    }
    router.push(`/users?${params.toString()}`);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${name}" (ID: ${id}) không?`)) {
      return;
    }
    setDeletingId(id);
    const result = await deleteUserAction(id);
    setDeletingId(null);
    if (!result.success) {
      alert(result.error || 'Xóa không thành công!');
    } else {
      router.refresh();
    }
  };

  return (
    <div className="w-100">
      {/* 1. Header Bar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <Link href="/dashboard" className="text-decoration-none text-muted small">
              <i className="bi bi-arrow-left me-1"></i> Dashboard
            </Link>
            <span className="text-muted">/</span>
            <span className="small text-primary fw-semibold">Quản Lý Người Dùng</span>
          </div>
          <h2 className="fw-bold mb-0 text-dark">
            <i className="bi bi-people-fill text-primary me-2"></i> Danh Sách Người Dùng
          </h2>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link href="/dashboard" className="btn btn-outline-secondary rounded-pill px-3">
            <i className="bi bi-speedometer2 me-1"></i> Về Dashboard
          </Link>
          <Link href="/users/add" className="btn btn-primary rounded-pill px-3 shadow-sm">
            <i className="bi bi-person-plus-fill me-1"></i> Thêm Người Dùng
          </Link>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body p-3 p-md-4">
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-12 col-md-6">
              <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control bg-light border-start-0"
                    placeholder="Tìm theo tên hoặc email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-dark rounded-3 px-3">
                  Tìm
                </button>
              </form>
            </div>

            {/* Role Filter Pills */}
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-center justify-content-md-end gap-2">
                <span className="text-muted small me-1">Vai trò:</span>
                <button
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 ${
                    !currentRoleFilter ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  onClick={() => handleFilterRole(undefined)}
                >
                  Tất cả ({users.length})
                </button>
                <button
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 ${
                    currentRoleFilter === 'admin' ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  onClick={() => handleFilterRole('admin')}
                >
                  Admin
                </button>
                <button
                  type="button"
                  className={`btn btn-sm rounded-pill px-3 ${
                    currentRoleFilter === 'customer' ? 'btn-primary' : 'btn-outline-secondary'
                  }`}
                  onClick={() => handleFilterRole('customer')}
                >
                  Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. User Table */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-secondary small text-uppercase tracking-wider">
              <tr>
                <th scope="col" className="ps-4">ID</th>
                <th scope="col">Người Dùng</th>
                <th scope="col">Địa Chỉ Email</th>
                <th scope="col">Vai Trò</th>
                <th scope="col" className="text-end pe-4">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary opacity-50"></i>
                    Không tìm thấy người dùng nào phù hợp với bộ lọc!
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="transition">
                    <td className="ps-4 fw-bold text-muted">#{u.id}</td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={u.avatar || 'https://i.imgur.com/LDOO4Qs.jpg'}
                          alt={u.name}
                          className="rounded-circle border shadow-sm"
                          style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://i.imgur.com/LDOO4Qs.jpg';
                          }}
                        />
                        <div>
                          <div className="fw-bold text-dark">{u.name}</div>
                          <div className="text-muted small">Tài khoản Platzi</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-dark">{u.email}</span>
                    </td>
                    <td>
                      <span
                        className={`badge rounded-pill px-3 py-2 ${
                          u.role === 'admin'
                            ? 'bg-primary-subtle text-primary border border-primary-subtle'
                            : 'bg-light text-muted border'
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-inline-flex gap-1">
                        <Link
                          href={`/users/${u.id}`}
                          className="btn btn-sm btn-outline-secondary rounded-3"
                          title="Xem Chi Tiết"
                        >
                          <i className="bi bi-eye"></i>
                        </Link>
                        <Link
                          href={`/users/update/${u.id}`}
                          className="btn btn-sm btn-outline-primary rounded-3"
                          title="Chỉnh Sửa"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Link>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-3"
                          onClick={() => handleDelete(u.id, u.name)}
                          disabled={deletingId === u.id}
                          title="Xóa Người Dùng"
                        >
                          {deletingId === u.id ? (
                            <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                            <i className="bi bi-trash"></i>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
