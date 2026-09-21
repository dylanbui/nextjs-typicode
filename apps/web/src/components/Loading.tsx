export default function Loading({ message = 'Đang tải dữ liệu...' }: { message?: string }) {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted fw-medium">{message}</p>
    </div>
  );
}
