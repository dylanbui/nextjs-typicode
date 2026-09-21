'use client';

import React, { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DEMO_ACCOUNTS, LoginSchema } from '../schemas/auth.schema';
import { credentialsLoginAction, oauthSignInAction } from '../actions/auth_mutations.server';

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const urlError = searchParams.get('error');
  const registeredSuccess = searchParams.get('registered') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(() => {
    if (urlError === 'OAuthAccountNotLinked') {
      return 'Email của tài khoản này đã được sử dụng. Vui lòng đăng nhập bằng đúng phương thức ban đầu!';
    }
    if (urlError === 'OAuthCallbackError') {
      return 'Lỗi xác thực OAuth từ nhà cung cấp. Vui lòng thử lại!';
    }
    return null;
  });

  const [isPending, startTransition] = useTransition();
  const [oauthLoading, setOauthLoading] = useState<'google' | 'facebook' | null>(null);

  // Chọn nhanh tài khoản demo 1-Click
  const handleSelectDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrors({});
    setServerError(null);
  };

  // Đăng nhập bằng Email/Mật khẩu
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    // 1. Validate Form Input với Zod tại Client (0ms)
    const result = LoginSchema.safeParse({ email, password });
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

    // 2. Gọi Server Action
    startTransition(async () => {
      const response = await credentialsLoginAction({ email, password }, callbackUrl);
      if (response && !response.success) {
        setServerError(response.error || 'Đăng nhập không thành công!');
        return;
      }
      if (response && response.redirectUrl) {
        router.push(response.redirectUrl);
        router.refresh();
      }
    });
  };

  // Đăng nhập qua OAuth (Google / Facebook)
  const handleOAuthLogin = (provider: 'google' | 'facebook') => {
    setServerError(null);
    setOauthLoading(provider);
    startTransition(async () => {
      try {
        await oauthSignInAction(provider, callbackUrl);
      } catch (err: any) {
        if (!err?.message?.includes('NEXT_REDIRECT') && !err?.digest?.includes('NEXT_REDIRECT')) {
          setServerError(`Không thể kết nối với ${provider === 'google' ? 'Google' : 'Facebook'}. Vui lòng thử lại!`);
          setOauthLoading(null);
        }
      }
    });
  };

  return (
    <div className="container py-3">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
            {/* Card Đăng Nhập - Giữ nguyên 100% Size & Style Ban Đầu */}
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              {/* Header Card */}
              <div className="card-header bg-dark text-white p-4 text-center border-0 bg-gradient">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-25 rounded-circle p-3 mb-3">
                  <i className="bi bi-shield-lock-fill text-primary fs-1"></i>
                </div>
                <h3 className="fw-bold mb-1">TypiCode Platform</h3>
                <p className="text-secondary small mb-0">
                  Hệ thống xác thực Auth.js v5 • Account Linking • Prisma SQLite
                </p>
              </div>

              {/* Body Card */}
              <div className="card-body p-4 p-md-5">
                {/* Thông báo đăng ký thành công */}
                {registeredSuccess && (
                  <div className="alert alert-success d-flex align-items-center rounded-3 mb-4" role="alert">
                    <i className="bi bi-check-circle-fill flex-shrink-0 me-2 fs-5"></i>
                    <div className="small fw-medium">Đăng ký tài khoản thành công! Vui lòng đăng nhập.</div>
                  </div>
                )}

                {/* Thông báo lỗi Server */}
                {serverError && (
                  <div className="alert alert-danger d-flex align-items-center rounded-3 mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2 fs-5"></i>
                    <div className="small fw-medium">{serverError}</div>
                  </div>
                )}

                {/* 1. NÚT ĐĂNG NHẬP NHANH VỚI OAUTH (Google & Facebook) */}
                <div className="d-grid gap-2 mb-4">
                  {/* Nút Google */}
                  <button
                    type="button"
                    className="btn btn-outline-dark py-2 px-3 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-medium shadow-sm hover-shadow"
                    onClick={() => handleOAuthLogin('google')}
                    disabled={isPending || !!oauthLoading}
                  >
                    {oauthLoading === 'google' ? (
                      <span className="spinner-border spinner-border-sm text-danger" role="status" />
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                        />
                      </svg>
                    )}
                    <span>Tiếp tục với Google</span>
                  </button>

                  {/* Nút Facebook */}
                  <button
                    type="button"
                    className="btn btn-outline-primary py-2 px-3 rounded-3 d-flex align-items-center justify-content-center gap-2 fw-medium shadow-sm hover-shadow"
                    onClick={() => handleOAuthLogin('facebook')}
                    disabled={isPending || !!oauthLoading}
                  >
                    {oauthLoading === 'facebook' ? (
                      <span className="spinner-border spinner-border-sm text-primary" role="status" />
                    ) : (
                      <i className="bi bi-facebook fs-5 text-primary"></i>
                    )}
                    <span>Tiếp tục với Facebook</span>
                  </button>
                </div>

                {/* Phân Cách */}
                <div className="position-relative my-4 text-center">
                  <hr className="text-muted" />
                  <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                    hoặc đăng nhập bằng Email
                  </span>
                </div>

                {/* 2. FORM ĐĂNG NHẬP CREDENTIALS (Email/Password) */}
                <form onSubmit={handleSubmit} noValidate>
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
                  <div className="mb-4">
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
                        placeholder="Nhập mật khẩu..."
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                    disabled={isPending || !!oauthLoading}
                  >
                    {isPending ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Đang xác thực thông tin...</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right"></i>
                        <span>Đăng Nhập Vào Dashboard</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Chuyển hướng sang trang Tạo tài khoản */}
                <div className="text-center mt-3">
                  <span className="text-muted small">Chưa có tài khoản? </span>
                  <Link href="/login/register" className="small fw-semibold text-decoration-none text-primary">
                    Đăng ký tài khoản mới
                  </Link>
                </div>

                {/* Phân Cách Chọn Demo */}
                <div className="position-relative my-4 text-center">
                  <hr className="text-muted" />
                  <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                    hoặc chọn 1-Click Demo
                  </span>
                </div>

                {/* 3. 1-CLICK DEMO ACCOUNTS SELECTOR */}
                <div className="d-flex flex-column gap-2">
                  {DEMO_ACCOUNTS.map((acc, index) => (
                    <button
                      key={index}
                      type="button"
                      className="btn btn-outline-secondary text-start p-2 rounded-3 d-flex align-items-center justify-content-between hover-shadow transition"
                      onClick={() => handleSelectDemo(acc.email, acc.password)}
                      disabled={isPending || !!oauthLoading}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle bg-light p-2 text-primary d-flex align-items-center justify-content-center"
                          style={{ width: '36px', height: '36px' }}
                        >
                          <i className="bi bi-person-fill"></i>
                        </div>
                        <div>
                          <div className="fw-bold text-dark small">{acc.name}</div>
                          <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
                            {acc.email} • pass: <code>{acc.password}</code>
                          </div>
                        </div>
                      </div>
                      <span className={`badge ${acc.badge}`}>{acc.role}</span>
                    </button>
                  ))}
                </div>

                {/* Footer Ghi Chú Bảo Mật */}
                <div className="mt-4 pt-3 border-top text-center">
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    <i className="bi bi-shield-check text-success me-1"></i>
                    Auth.js v5 • Session 30 phút • Account Linking Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
