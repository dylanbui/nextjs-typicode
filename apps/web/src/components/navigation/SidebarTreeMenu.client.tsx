'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { MenuModule, isActionActive, getActiveModuleIds } from './menu.types';

interface SidebarTreeMenuProps {
  modules?: MenuModule[];
}

function TreeMenuContent({ modules = [] }: { modules: MenuModule[] }) {
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();
  const searchParamsString = searchParams?.toString();

  // Danh sách các module đang được mở rộng (expanded)
  const [expandedIds, setExpandedIds] = useState<string[]>(() => {
    return getActiveModuleIds(modules, pathname, searchParamsString);
  });

  // Tự động mở module khi route thay đổi nếu chưa được mở
  useEffect(() => {
    const activeModuleIds = getActiveModuleIds(modules, pathname, searchParamsString);
    if (activeModuleIds.length > 0) {
      setExpandedIds((prev) => {
        const set = new Set([...prev, ...activeModuleIds]);
        return Array.from(set);
      });
    }
  }, [pathname, searchParamsString, modules]);

  const toggleModule = (moduleId: string) => {
    setExpandedIds((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  return (
    <aside className="w-100" style={{ position: 'sticky', top: '75px' }}>
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white mb-4">
        {/* SIDEBAR TITLE */}
        <div className="card-header bg-white border-bottom py-3 px-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-primary-subtle text-primary rounded-2 p-1 d-flex align-items-center justify-content-center"
              style={{ width: '26px', height: '26px' }}
            >
              <i className="bi bi-diagram-3-fill fs-6"></i>
            </div>
            <span className="fw-bold text-dark small text-uppercase tracking-wider">
              Danh Mục
            </span>
          </div>
          <span className="badge bg-light text-secondary border small">{modules.length} modules</span>
        </div>

        {/* TREE MENU BODY */}
        <div className="card-body p-2 d-flex flex-column gap-1">
          {modules.map((module) => {
            const isExpanded = expandedIds.includes(module.id);
            const isModuleActive = module.children.some((action) =>
              isActionActive(action.path, pathname, searchParamsString)
            );

            return (
              <div key={module.id} className="menu-module-group rounded-3 overflow-hidden">
                {/* MODULE HEADER TOGGLE */}
                <button
                  type="button"
                  onClick={() => toggleModule(module.id)}
                  className={`btn w-100 d-flex align-items-center justify-content-between px-3 py-2 text-start rounded-3 border-0 transition ${isModuleActive
                      ? 'bg-light text-primary fw-semibold'
                      : 'text-dark hover-bg-light fw-medium'
                    }`}
                  style={{
                    backgroundColor: isModuleActive ? '#f0f7ff' : 'transparent',
                    fontSize: '0.88rem',
                  }}
                  aria-expanded={isExpanded}
                >
                  <div className="d-flex align-items-center gap-2 text-truncate">
                    {module.icon && (
                      <i
                        className={`bi ${module.icon} fs-6 ${isModuleActive ? 'text-primary' : 'text-secondary'
                          }`}
                      ></i>
                    )}
                    <span className="text-truncate">{module.title}</span>
                  </div>

                  <div className="d-flex align-items-center gap-1 ms-2">
                    {module.badge && (
                      <span
                        className={`badge rounded-pill bg-${module.badgeColor || 'primary'}-subtle text-${module.badgeColor || 'primary'
                          } small`}
                        style={{ fontSize: '0.65rem' }}
                      >
                        {module.badge}
                      </span>
                    )}
                    <i
                      className="bi bi-chevron-down text-muted small"
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease-in-out',
                        fontSize: '0.75rem',
                      }}
                    ></i>
                  </div>
                </button>

                {/* MODULE CHILDREN (ACTIONS) */}
                {isExpanded && module.children && module.children.length > 0 && (
                  <div
                    className="menu-actions-list ps-3 pe-1 py-1 d-flex flex-column gap-1 position-relative"
                    style={{
                      borderLeft: '2px dashed #e2e8f0',
                      marginLeft: '18px',
                      marginTop: '2px',
                      marginBottom: '4px',
                    }}
                  >
                    {module.children.map((action) => {
                      const active = isActionActive(action.path, pathname, searchParamsString);

                      return (
                        <Link
                          key={action.id}
                          href={action.path}
                          className={`d-flex align-items-center justify-content-between px-2 py-1-5 rounded-2 text-decoration-none transition ${active
                              ? 'bg-primary text-white fw-bold shadow-sm'
                              : 'text-secondary hover-bg-light hover-text-dark fw-normal'
                            }`}
                          style={{
                            fontSize: '0.82rem',
                            paddingTop: '6px',
                            paddingBottom: '6px',
                          }}
                        >
                          <div className="d-flex align-items-center gap-2 text-truncate">
                            <i
                              className={`bi ${action.icon || (active ? 'bi-circle-fill' : 'bi-circle')
                                } ${active ? 'text-white' : 'text-muted'}`}
                              style={{ fontSize: action.icon ? '0.85rem' : '0.45rem' }}
                            ></i>
                            <span className="text-truncate">{action.title}</span>
                          </div>

                          {action.badge && (
                            <span
                              className={`badge rounded-pill small ms-1 ${active
                                  ? 'bg-white text-primary'
                                  : `bg-${action.badgeColor || 'secondary'}-subtle text-${action.badgeColor || 'secondary'
                                  }`
                                }`}
                              style={{ fontSize: '0.65rem' }}
                            >
                              {action.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SIDEBAR FOOTER NOTE */}
        <div className="card-footer bg-light border-top py-2 px-3 text-center">
          <small className="text-muted" style={{ fontSize: '0.72rem' }}>
            <i className="bi bi-shield-check text-success me-1"></i>
            Clean Architecture v4.0
          </small>
        </div>
      </div>
    </aside>
  );
}

function SidebarTreeMenuSkeleton() {
  return (
    <aside className="w-100" style={{ position: 'sticky', top: '75px' }}>
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden bg-white mb-4 p-3 placeholder-glow">
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="placeholder rounded-2" style={{ width: '26px', height: '26px' }}></div>
          <div className="placeholder col-6"></div>
        </div>
        <div className="d-flex flex-column gap-2">
          <div className="placeholder col-12 py-3 rounded-2"></div>
          <div className="placeholder col-12 py-3 rounded-2"></div>
          <div className="placeholder col-12 py-3 rounded-2"></div>
        </div>
      </div>
    </aside>
  );
}

export function SidebarTreeMenu({ modules = [] }: SidebarTreeMenuProps) {
  return (
    <Suspense fallback={<SidebarTreeMenuSkeleton />}>
      <TreeMenuContent modules={modules} />
    </Suspense>
  );
}

