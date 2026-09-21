'use client';

export default function CleanArchExplainer() {
  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden bg-primary-subtle border-start border-4 border-primary">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className="badge bg-primary text-white">Kiến Trúc Cân Bằng Mới</span>
          <h5 className="card-title fw-bold text-primary-emphasis mb-0">
            RSC Hybrid + Catch-All Dispatcher + 3 Trụ Cột (Schemas - Actions - Views)
          </h5>
        </div>
        <p className="text-muted small mb-3">
          Tối ưu hóa toàn diện cho 10.000 users: Đưa logic nặng về Server, giữ 1 file điều phối duy nhất cho toàn bộ CRUD, và Action trả về trực tiếp React Element:
        </p>

        <div className="row g-3">
          <div className="col-md-3">
            <div className="p-3 bg-white rounded-3 shadow-sm h-100 border border-light-subtle">
              <span className="badge bg-secondary mb-2">1. Master Dispatcher</span>
              <h6 className="fw-bold fs-6 mb-1 text-dark">[[...slug]]/page.tsx</h6>
              <p className="text-muted small mb-0">
                1 file điều phối toàn bộ URL (list, add, detail, update) mà không cần tạo nhiều folder lồng nhau.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="p-3 bg-white rounded-3 shadow-sm h-100 border border-light-subtle">
              <span className="badge bg-info text-dark mb-2">2. Schemas (Zod)</span>
              <h6 className="fw-bold fs-6 mb-1 text-dark">Isomorphic Validation</h6>
              <p className="text-muted small mb-0">
                Dùng chung: Parse Route tại Server, validate form tại Client (0ms) và bảo vệ Server Actions.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="p-3 bg-white rounded-3 shadow-sm h-100 border border-light-subtle">
              <span className="badge bg-success mb-2">3. Server Actions</span>
              <h6 className="fw-bold fs-6 mb-1 text-dark">Loaders &amp; Mutations</h6>
              <p className="text-muted small mb-0">
                Action nạp dữ liệu tại Server và <strong>trả về trực tiếp React Element</strong> cho page.tsx.
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="p-3 bg-white rounded-3 shadow-sm h-100 border border-light-subtle">
              <span className="badge bg-primary mb-2">4. Views &amp; Client Leaves</span>
              <h6 className="fw-bold fs-6 mb-1 text-dark">RSC 0KB JS + UX</h6>
              <p className="text-muted small mb-0">
                Views render HTML tĩnh từ Server; Client components chỉ lo gõ search, đổi mode và bấm nút.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
