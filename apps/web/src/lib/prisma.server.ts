import 'server-only';

/**
 * ------------------------------------------------------------------
 * WEB APP LIB: Prisma Client Singleton with Automated SQL Telemetry
 * ------------------------------------------------------------------
 * Quản lý kết nối Database Prisma (SQLite) - SERVER ONLY:
 * - Singleton tránh quá tải connection pool khi Next.js hot-reload.
 * - Tự động đo đạc thời gian thực thi câu lệnh SQL ($on 'query').
 * - Tự động phát hiện và cảnh báo Slow Query (>= 50ms).
 * - Tự động bắt lỗi cú pháp, vi phạm ràng buộc Unique / Foreign Key ($on 'error').
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '@repo/shared';

const isDev = process.env.NODE_ENV !== 'production';

function createPrismaClient() {
  const client = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'warn' },
    ],
  });

  // 1. Tự động bắt và đo lường thời gian thực thi câu lệnh SQL (ORM & $queryRaw)
  client.$on('query' as never, (e: any) => {
    const durationMs = e.duration;
    const sql = e.query;
    const params = isDev ? e.params : undefined;

    // Cảnh báo nếu câu query chạy chậm (>= 50ms đối với SQLite / >= 100ms với PostgreSQL)
    if (durationMs >= 50) {
      logger.warn(`[SLOW_SQL] (${durationMs}ms) ${sql}`, {
        durationMs,
        target: e.target,
        params,
      });
    } else {
      logger.debug(`[SQL] (${durationMs}ms) ${sql}`, {
        durationMs,
        params,
      });
    }
  });

  // 2. Bắt lỗi Database (Constraint violation, connection loss, syntax error)
  client.$on('error' as never, (e: any) => {
    logger.error(`[DB_ERROR] ${e.message}`, undefined, {
      target: e.target,
      timestamp: e.timestamp,
    });
  });

  client.$on('warn' as never, (e: any) => {
    logger.warn(`[DB_WARN] ${e.message}`, {
      target: e.target,
    });
  });

  return client;
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
