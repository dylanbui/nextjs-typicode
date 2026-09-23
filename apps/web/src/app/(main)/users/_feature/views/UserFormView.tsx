'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '@repo/shared';
import { UserFormSchema, SAMPLE_AVATARS } from '../schemas/user.schema';
import { createUserAction, updateUserAction } from '../actions/user_mutations.action';

interface UserFormViewProps {
  mode: 'add' | 'update';
  initialData?: User;
}

export function UserFormView({ mode, initialData }: UserFormViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [password, setPassword] = useState(initialData?.password || '123456');
  const [role, setRole] = useState<UserRole>(initialData?.role || 'customer');
  const [avatar, setAvatar] = useState(initialData?.avatar || SAMPLE_AVATARS[0]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    // Validate Zod tại Client (0ms)
    const result = UserFormSchema.safeParse({
      name,
      email,
      password,
      role,
      avatar,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      let res;
      if (mode === 'add') {
        res = await createUserAction(result.data);
      } else {
        res = await updateUserAction(initialData!.id, result.data);
      }

      if (!res.success) {
        setServerError(res.error || 'Có lỗi xảy ra khi lưu thông tin!');
        return;
      }

      router.push('/users');
      router.refresh();
    });
  };

  return (
    <div className="w-100">
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
        <span className="small text-primary fw-semibold">
          {mode === 'add' ? 'Thêm Mới' : `Cập Nhật #${initialData?.id}`}
        </span>
      </div>

      {/* Full Width Card */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden w-100 bg-white">
        <div className="card-header bg-dark text-white p-4 border-0 bg-gradient">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div>
              <h4 className="fw-bold mb-1 d-flex align-items-center gap-2">
                <i className={`bi ${mode === 'add' ? 'bi-person-plus-fill' : 'bi-pencil-square'} text-primary`}></i>
                {mode === 'add' ? 'Thêm Người Dùng Mới' : `Cập Nhật Tài Khoản #${initialData?.id || ''}`}
              </h4>
              <p className="text-secondary small mb-0">
                Xác thực dữ liệu tức thì với Zod Isomorphic Schema &amp; Bảo mật tại Server Action
              </p>
            </div>
            <Link href="/users" className="btn btn-outline-light btn-sm rounded-pill px-3 align-self-start align-self-md-center">
              <i className="bi bi-arrow-left me-1"></i> Quay lại danh sách
            </Link>
          </div>
        </div>

        <div className="card-body p-4 p-md-5">
          {serverError && (
            <div className="alert alert-danger d-flex align-items-center rounded-3 mb-4">
              <i className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"></i>
              <div className="small fw-medium">{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-4">
              {/* Họ và tên */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-secondary small">
                  Họ và Tên <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-person text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className={`form-control bg-light border-start-0 ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Ví dụ: Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isPending}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
              </div>

              {/* Email */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-secondary small">
                  Địa Chỉ Email <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-envelope text-muted"></i>
                  </span>
                  <input
                    type="email"
                    className={`form-control bg-light border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="alex@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isPending}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
              </div>

              {/* Password */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-secondary small">
                  Mật Khẩu <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-shield-lock text-muted"></i>
                  </span>
                  <input
                    type="password"
                    className={`form-control bg-light border-start-0 ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Nhập mật khẩu..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
              </div>

              {/* Role */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold text-secondary small">
                  Vai Trò (Role) <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-shield-check text-muted"></i>
                  </span>
                  <select
                    className={`form-select bg-light border-start-0 ${errors.role ? 'is-invalid' : ''}`}
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    disabled={isPending}
                  >
                    <option value="customer">Customer (Khách hàng)</option>
                    <option value="admin">Admin (Quản trị viên)</option>
                  </select>
                  {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                </div>
              </div>

              {/* Avatar URL & Preview */}
              <div className="col-12">
                <label className="form-label fw-semibold text-secondary small">
                  Ảnh Đại Diện (Avatar URL) <span className="text-danger">*</span>
                </label>
                <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 p-3 bg-light rounded-4 border mb-2">
                  <img
                    src={avatar || SAMPLE_AVATARS[0]}
                    alt="Preview"
                    className="rounded-circle border shadow-sm flex-shrink-0"
                    style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = SAMPLE_AVATARS[0];
                    }}
                  />
                  <div className="flex-grow-1">
                    <input
                      type="url"
                      className={`form-control bg-white ${errors.avatar ? 'is-invalid' : ''}`}
                      placeholder="https://..."
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      disabled={isPending}
                    />
                    {errors.avatar && <div className="invalid-feedback d-block">{errors.avatar}</div>}
                    <small className="text-muted mt-1 d-block">
                      Dán đường link ảnh trực tiếp hoặc chọn nhanh ảnh mẫu bên dưới
                    </small>
                  </div>
                </div>

                {/* Sample Avatars Selector */}
                <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                  <span className="text-muted small fw-medium">Chọn nhanh avatar mẫu:</span>
                  <div className="d-flex align-items-center gap-2">
                    {SAMPLE_AVATARS.map((sample, idx) => (
                      <img
                        key={idx}
                        src={sample}
                        alt={`Sample ${idx}`}
                        className="rounded-circle border cursor-pointer hover-shadow transition"
                        style={{
                          width: '36px',
                          height: '36px',
                          objectFit: 'cover',
                          border: avatar === sample ? '2px solid #0d6efd' : '1px solid #dee2e6',
                          transform: avatar === sample ? 'scale(1.1)' : 'none',
                        }}
                        onClick={() => setAvatar(sample)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="d-flex align-items-center justify-content-between gap-2 mt-5 pt-4 border-top">
              <Link href="/users" className="btn btn-outline-secondary rounded-pill px-4">
                <i className="bi bi-x-circle me-1"></i> Hủy bỏ
              </Link>
              <button
                type="submit"
                className="btn btn-primary rounded-pill px-5 shadow-sm fw-semibold"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {mode === 'add' ? 'Tạo Người Dùng' : 'Lưu Thay Đổi'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
