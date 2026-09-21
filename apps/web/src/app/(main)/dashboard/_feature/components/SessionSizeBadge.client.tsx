'use client';

import { useAuthStore } from '@/app/(auth)/login/_feature/stores/auth.store.client';

interface SessionSizeBadgeProps {
  initialSizeBytes?: number;
}

export function SessionSizeBadge({ initialSizeBytes = 680 }: SessionSizeBadgeProps) {
  const user = useAuthStore((state) => state.user);
  
  // Tính kích thước ước lượng nếu có user
  const sizeBytes = user ? new TextEncoder().encode(JSON.stringify(user)).length : initialSizeBytes;
  const maxBytes = 4096;
  const percent = Math.min(100, Math.round((sizeBytes / maxBytes) * 100));

  const isDanger = percent > 90;
  const isWarning = percent > 50 && percent <= 90;

  return (
    <div
      className="d-none d-md-flex align-items-center gap-2 px-3 py-1 bg-light border rounded-pill small text-secondary"
      title="Dung lượng Cookie Session thực tế / Giới hạn trình duyệt 4KB"
    >
      <i className="bi bi-cookie text-muted"></i>
      <span style={{ fontSize: '0.78rem' }}>
        Cookie Size: <strong>{sizeBytes} B / 4 KB</strong>
      </span>
      <div className="progress" style={{ width: '50px', height: '5px' }}>
        <div
          className={`progress-bar ${isDanger ? 'bg-danger' : isWarning ? 'bg-warning' : 'bg-success'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.7rem' }}>
        {percent}%
      </span>
    </div>
  );
}
