import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  colorClass: string;
  badgeText?: string;
  badgeClass?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  colorClass,
  badgeText,
  badgeClass = 'bg-primary-subtle text-primary-emphasis',
}: StatCardProps) {
  return (
    <div className="card shadow-sm border-0 rounded-4 h-100 overflow-hidden transition hover-lift">
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div
            className={`rounded-3 p-3 text-white d-flex align-items-center justify-content-center shadow-sm ${colorClass}`}
            style={{ width: '52px', height: '52px' }}
          >
            <i className={`bi ${icon} fs-4`}></i>
          </div>
          {badgeText && (
            <span className={`badge rounded-pill small px-3 py-2 fw-semibold ${badgeClass}`}>
              {badgeText}
            </span>
          )}
        </div>
        <h6 className="text-secondary small fw-medium mb-1">{title}</h6>
        <h2 className="fw-bold mb-1 text-dark">{value}</h2>
        <p className="text-muted small mb-0">{subtitle}</p>
      </div>
    </div>
  );
}
