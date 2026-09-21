'use client';

import { Category } from '@repo/shared';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="d-flex flex-wrap gap-2 align-items-center mb-4 pb-2 border-bottom">
      <span className="text-muted small fw-semibold me-1">
        <i className="bi bi-funnel me-1"></i> Danh mục:
      </span>
      <button
        type="button"
        onClick={() => onSelectCategory(null)}
        className={`btn btn-sm rounded-pill px-3 transition-all ${
          selectedCategoryId === null
            ? 'btn-primary shadow-sm'
            : 'btn-outline-secondary'
        }`}
      >
        Tất cả
      </button>

      {categories.map((category) => {
        const isSelected = selectedCategoryId === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.id)}
            className={`btn btn-sm rounded-pill px-3 transition-all ${
              isSelected
                ? 'btn-primary shadow-sm'
                : 'btn-outline-secondary'
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
