// =========================================================================
// 📦 BARREL EXPORT: FEATURES / PRODUCTS
// =========================================================================

// 1. Schemas
export * from './schemas/product.schema';

// 2. Action Loaders (Trả về React Element cho page.tsx)
export * from './actions/product_list.action';
export * from './actions/product_detail.action';
export * from './actions/product_add.action';
export * from './actions/product_update.action';

// 3. Server Actions Mutation ('use server')
export * from './actions/product_delete.action';
export * from './actions/product_mutations.action';

// 4. Views
export * from './views/ProductListView';
export * from './views/ProductDetailView';
export * from './views/ProductFormView';

// 5. Components
export * from './components/ProductGridView';
export * from './components/ProductTableView';
export * from './components/ProductFilterBar.client';
export * from './components/ProductDetailActions.client';
