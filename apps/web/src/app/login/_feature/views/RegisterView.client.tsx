'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RegisterSchema } from '../schemas/auth.schema';
import { registerUserAction } from '../actions/auth_mutations.server';

export function RegisterView() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    // 1. Client-side Zod validation
    const result = RegisterSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
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

    // 2. Server Action
    startTransition(async () => {
      const response = await registerUserAction({
        name,
        email,
        password,
        confirmPassword,
      });

      if (!response.success) {
        setServerError(response.error || 'Đăng ký tài khoản không thành công!');
        return;
      }

      router.push(response.redirectUrl || '/login?registered=true');
    });
  };

  return (
    <div className="container py-3">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          {/* Card Đăng Ký - Giữ nguyên 100% Size & Style Ban Đầu */}
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            {/* Header Card */}
            <div className="card-header bg-dark text-white p-4 text-center border-0 bg-gradient">
              <div className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-25 rounded-circle p-3 mb-3">
                <i className="bi bi-person-plus-fill text-success fs-1"></i>
              </div>
              <h3 className="fw-bold mb-1">Tạo Tài Khoản Mới</h3>
              <p className="text-secondary small mb-0">
                Đăng ký tài khoản hệ thống lưu trữ trên Prisma SQLite
              </p>
            </div>

            {/* Body Card */}
            <div className="card-body p-4 p-md-5">
              {/* Thông báo lỗi Server */}
              {serverError && (
                <div className="alert alert-danger d-flex align-items-center rounded-3 mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2 fs-5"></i>
                  <div className="small fw-medium">{serverError}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Họ và tên */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">
                    Họ và tên <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-person text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className={`form-control bg-light border-start-0 ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isPending}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>
                </div>

                {/* Email Input */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">
                    Địa chỉ Email <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      className={`form-control bg-light border-start-0 ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isPending}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                {/* Password Input */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary small">
                    Mật khẩu <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-key text-muted"></i>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`form-control bg-light border-start-0 border-end-0 ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Tối thiểu 6 ký tự..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      className="input-group-text bg-light border-start-0 text-muted"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary small">
                    Xác nhận mật khẩu <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-check2-circle text-muted"></i>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`form-control bg-light border-start-0 border-end-0 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder="Nhập lại mật khẩu..."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isPending}
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">{errors.confirmPassword}</div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-success w-100 py-2 fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Đang tạo tài khoản...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-check-fill"></i>
                      <span>Đăng Ký Tài Khoản</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quay lại trang đăng nhập */}
              <div className="text-center mt-4 pt-3 border-top">
                <span className="text-muted small">Đã có tài khoản? </span>
                <Link href="/login" className="small fw-semibold text-decoration-none text-primary">
                  Đăng nhập ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
