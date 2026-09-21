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
        <span className="small text-primary fw-semibold">
          {mode === 'add' ? 'Thêm Mới' : `Cập Nhật #${initialData?.id}`}
        </span>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-dark text-white p-4 text-center border-0 bg-gradient">
              <h4 className="fw-bold mb-1">
                {mode === 'add' ? 'Thêm Người Dùng Mới' : 'Cập Nhật Tài Khoản Người Dùng'}
              </h4>
              <p className="text-secondary small mb-0">
                Xác thực dữ liệu tức thì với Zod Isomorphic Schema
              </p>
            </div>

            <div className="card-body p-4 p-md-5">
              {serverError && (
                <div className="alert alert-danger d-flex align-items-center rounded-3 mb-4">
                  <i className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"></i>
                  <div className="small fw-medium">{serverError}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">
                  {/* Họ và tên */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Họ và Tên <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control bg-light ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Ví dụ: Alex Johnson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isPending}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  {/* Email */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Địa Chỉ Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control bg-light ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="alex@mail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isPending}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  {/* Password */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Mật Khẩu <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control bg-light ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Nhập mật khẩu..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isPending}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>

                  {/* Role */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-semibold text-secondary small">
                      Vai Trò (Role) <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select bg-light ${errors.role ? 'is-invalid' : ''}`}
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      disabled={isPending}
                    >
                      <option value="customer">Customer (Khách hàng)</option>
                      <option value="admin">Admin (Quản trị viên)</option>
                    </select>
                    {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                  </div>

                  {/* Avatar URL */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-secondary small">
                      Link Ảnh Avatar <span className="text-danger">*</span>
                    </label>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <img
                        src={avatar || SAMPLE_AVATARS[0]}
                        alt="Preview"
                        className="rounded-circle border shadow-sm"
                        style={{ width: '56px', height: '56px', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = SAMPLE_AVATARS[0];
                        }}
                      />
                      <input
                        type="url"
                        className={`form-control bg-light ${errors.avatar ? 'is-invalid' : ''}`}
                        placeholder="https://..."
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        disabled={isPending}
                      />
                    </div>
                    {errors.avatar && <div className="invalid-feedback d-block">{errors.avatar}</div>}

                    {/* Sample Avatars Selector */}
                    <div className="d-flex align-items-center gap-2 mt-2">
                      <span className="text-muted small">Chọn ảnh mẫu nhanh:</span>
                      {SAMPLE_AVATARS.map((sample, idx) => (
                        <img
                          key={idx}
                          src={sample}
                          alt={`Sample ${idx}`}
                          className="rounded-circle border cursor-pointer hover-shadow"
                          style={{
                            width: '32px',
                            height: '32px',
                            objectFit: 'cover',
                            border: avatar === sample ? '2px solid #0d6efd' : '1px solid #dee2e6',
                          }}
                          onClick={() => setAvatar(sample)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="d-flex align-items-center justify-content-between gap-2 mt-5 pt-3 border-top">
                  <Link href="/users" className="btn btn-outline-secondary rounded-pill px-4">
                    Hủy bỏ
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 shadow-sm"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1"></span>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill me-1"></i>
                        {mode === 'add' ? 'Tạo Người Dùng' : 'Lưu Thay Đổi'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
