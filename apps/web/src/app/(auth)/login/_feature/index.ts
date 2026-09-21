// =========================================================================
// 📦 RESPONSIBLE BARREL EXPORT: LOGIN FEATURE MODULE
// =========================================================================
// Cổng giao tiếp công khai (Public API) cho module Login.
// Mọi file đều được bảo vệ bởi hậu tố .server.ts / .client.tsx và server-only.
// =========================================================================

// 1. 🔄 Shared Types & Schemas (Isomorphic - An toàn cho cả Server & Client)
export * from './schemas/auth.schema';

// 2. 🎬 Server Dispatcher Action Handlers (Chỉ chạy trên Server)
export * from './actions/login.server';

// 3. ⚡ Server Actions Mutations (Chỉ gọi qua Server Action RPC)
export * from './actions/auth_mutations.server';
export * from './actions/logout.server';
export * from './actions/session.server';

// 4. 🎨 Client Views (Chỉ dùng khi render UI Client)
export * from './views/LoginView.client';
export * from './views/RegisterView.client';

// 5. 📦 Client UI Stores
export * from './stores/auth.store.client';
