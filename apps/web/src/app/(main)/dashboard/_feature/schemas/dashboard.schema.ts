import { z } from 'zod';

// =========================================================================
// 🛡️ DASHBOARD ROUTE & FILTER SCHEMAS (Isomorphic)
// =========================================================================

export const DashboardFilterSchema = z.object({
  timeRange: z.enum(['7d', '30d', '90d', 'all']).default('30d'),
});

export type DashboardFilter = z.infer<typeof DashboardFilterSchema>;
