import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-top py-4 mt-5">
      <div className="container">
        <div className="row align-items-center gy-3">
          <div className="col-md-6 text-center text-md-start">
            <div className="fw-semibold text-dark mb-1">
              TypiCode - Minimal Clean Architecture
            </div>
            <small className="text-muted">
              Mô hình 4 lớp: Domain &rarr; UseCases &rarr; Infrastructure &rarr; UI (Next.js + Bootstrap)
            </small>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="d-flex justify-content-center justify-content-md-end gap-3 small text-muted">
              <Link href="/architecture" className="text-decoration-none text-muted">
                <i className="bi bi-book me-1"></i>Tài liệu kiến trúc
              </Link>
              <span>•</span>
              <a
                href="https://fakeapi.platzi.com/"
                target="_blank"
                rel="noreferrer"
                className="text-decoration-none text-muted"
              >
                Platzi API Docs
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
