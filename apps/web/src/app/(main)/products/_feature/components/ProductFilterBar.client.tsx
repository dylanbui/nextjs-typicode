'use client';

import { useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Category } from '@repo/shared';

interface ProductFilterBarProps {
  categories: Category[];
  selectedCategoryId: number | null;
  searchTerm: string;
  viewMode: 'grid' | 'table';
}

export function ProductFilterBar({
  categories,
  selectedCategoryId,
  searchTerm,
  viewMode,
}: ProductFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateUrl = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="card shadow-sm border-0 mb-4 p-3 bg-white rounded-3">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
        {/* Danh mục (Category Tabs) */}
        <div className="d-flex gap-1 flex-wrap align-items-center">
          <button
            type="button"
            className={`btn btn-sm rounded-pill px-3 ${
              selectedCategoryId === null ? 'btn-primary text-white' : 'btn-outline-secondary'
            }`}
            onClick={() => updateUrl({ categoryId: null })}
          >
            Tất cả
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                className={`btn btn-sm rounded-pill px-3 ${
                  isSelected ? 'btn-primary text-white' : 'btn-outline-secondary'
                }`}
                onClick={() => updateUrl({ categoryId: isSelected ? null : String(cat.id) })}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Thanh tìm kiếm & Nút chuyển View Mode */}
        <div className="d-flex gap-2 align-items-center flex-wrap">
          {/* Input Search */}
          <div className="input-group" style={{ minWidth: 220, maxWidth: 300 }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="search"
              className="form-control border-start-0 ps-0 form-control-sm"
              placeholder="Tìm theo tên..."
              defaultValue={searchTerm}
              onChange={(e) => updateUrl({ search: e.target.value.trim() || null })}
            />
          </div>

          {/* Toggle Grid / Table */}
          <div className="btn-group btn-group-sm" role="group" aria-label="View Mode">
            <button
              type="button"
              className={`btn ${viewMode === 'grid' ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => updateUrl({ mode: 'grid' })}
              title="Xem dạng Lưới thẻ"
            >
              <i className="bi bi-grid-fill me-1"></i> Lưới
            </button>
            <button
              type="button"
              className={`btn ${viewMode === 'table' ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => updateUrl({ mode: 'table' })}
              title="Xem dạng Bảng"
            >
              <i className="bi bi-table me-1"></i> Bảng
            </button>
          </div>

          {/* Loading Indicator khi chuyển URL */}
          {isPending && (
            <div className="spinner-border spinner-border-sm text-primary ms-1" role="status">
              <span className="visually-hidden">Đang lọc...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
