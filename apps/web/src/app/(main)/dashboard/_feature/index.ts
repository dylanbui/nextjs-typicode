// =========================================================================
// 📦 RESPONSIBLE BARREL EXPORT: DASHBOARD FEATURE MODULE
// =========================================================================
// Cổng giao tiếp công khai (Public API) cho module Dashboard.
// Tuân thủ chuẩn kiến trúc: Route-Level Colocation + ActionDispatcher.
// =========================================================================

// 1. 🔄 Shared Types & Schemas
export * from './schemas/dashboard.schema';

// 2. 🎬 Server Dispatcher Action Handlers (Chỉ chạy trên Server)
export * from './actions/dashboard.server';

// 3. 🎨 Views & Components
export * from './views/DashboardOverviewView';
export * from './components/StatCard';
export * from './components/QuickNavGrid';
export * from './components/SessionTimer.client';
export * from './components/SessionSizeBadge.client';
