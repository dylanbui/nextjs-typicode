/**
 * ------------------------------------------------------------------
 * ISOMORPHIC LOGGER IMPLEMENTATION
 * ------------------------------------------------------------------
 * Hoạt động mượt mà và an toàn 100% trên cả 3 môi trường:
 * 1. Node.js Server Runtime (Server Actions, RSC, Route Handlers) -> Console + File Logs
 * 2. Edge Runtime (Next.js Middleware) -> Console (An toàn, không đụng Node.js fs)
 * 3. Browser Client Runtime (Client Components) -> Browser Console
 */

import {
  ILogger,
  LogContext,
  LogEntry,
  LogErrorDetails,
  LogLevel,
  LoggerConfig,
} from './logger.types';
import { appendLogToFile, isNodeRuntime } from './file-rotator.server';
import { logWithPino } from './pino-engine.server';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export class IsomorphicLogger implements ILogger {
  private config: LoggerConfig;

  constructor(config?: LoggerConfig) {
    const isProd = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';
    this.config = {
      minLevel: config?.minLevel || (isProd ? 'info' : 'debug'),
      logDir: config?.logDir,
      logFilename: config?.logFilename || 'app.log',
      maxFileSizeBytes: config?.maxFileSizeBytes,
      maxFiles: config?.maxFiles,
      maxAgeDays: config?.maxAgeDays,
      enableConsole: config?.enableConsole ?? true,
      enableFile: config?.enableFile ?? true,
    };
  }

  /**
   * Xác định môi trường thực thi hiện tại
   */
  private getRuntime(): 'node' | 'edge' | 'browser' {
    if (typeof window !== 'undefined') return 'browser';
    if (process.env.NEXT_RUNTIME === 'edge') return 'edge';
    return 'node';
  }

  /**
   * Kiểm tra xem mức log có thỏa mãn ngưỡng minLevel không
   */
  private shouldLog(level: LogLevel): boolean {
    const currentPriority = LEVEL_PRIORITY[level];
    const minPriority = LEVEL_PRIORITY[this.config.minLevel || 'debug'];
    return currentPriority >= minPriority;
  }

  /**
   * Chuẩn hóa Error object
   */
  private formatError(err?: Error | unknown): LogErrorDetails | undefined {
    if (!err) return undefined;
    if (err instanceof Error) {
      return {
        name: err.name,
        message: err.message,
        stack: err.stack,
      };
    }
    if (typeof err === 'object') {
      return {
        message: JSON.stringify(err),
      };
    }
    return {
      message: String(err),
    };
  }

  /**
   * Xử lý phát tán log (Console + File)
   */
  private log(level: LogLevel, message: string, err?: Error | unknown, context?: LogContext): void {
    if (!this.shouldLog(level)) return;

    const runtime = this.getRuntime();
    const timestamp = new Date().toISOString();
    const errorDetails = this.formatError(err);

    const entry: LogEntry = {
      timestamp,
      level,
      message,
      context,
      error: errorDetails,
      runtime,
    };

    // 1. IN RA CONSOLE
    if (this.config.enableConsole) {
      this.printToConsole(entry);
    }

    // 2. GHI RA FILE (Chỉ kích hoạt trên Node.js Server Runtime: Pino + Pino-Roll với Native Fallback)
    if (this.config.enableFile && isNodeRuntime()) {
      logWithPino(entry, this.config).then((loggedWithPino) => {
        if (!loggedWithPino) {
          appendLogToFile(entry, this.config).catch(() => {});
        }
      }).catch(() => {
        appendLogToFile(entry, this.config).catch(() => {});
      });
    }
  }

  /**
   * Format và in ra Console theo màu sắc & môi trường
   */
  private printToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp.split('T')[1]?.slice(0, 8)}] [${entry.level.toUpperCase()}]`;

    if (entry.runtime === 'browser') {
      const colors: Record<LogLevel, string> = {
        debug: 'color: #888',
        info: 'color: #0d6efd; font-weight: bold',
        warn: 'color: #ffc107; font-weight: bold',
        error: 'color: #dc3545; font-weight: bold',
      };
      const style = colors[entry.level];
      if (entry.level === 'error') {
        console.error(`%c${prefix}`, style, entry.message, entry.context || '', entry.error || '');
      } else if (entry.level === 'warn') {
        console.warn(`%c${prefix}`, style, entry.message, entry.context || '');
      } else {
        console.log(`%c${prefix}`, style, entry.message, entry.context || '');
      }
      return;
    }

    // Node / Edge Console
    const contextStr = entry.context && Object.keys(entry.context).length > 0
      ? ` ${JSON.stringify(entry.context)}`
      : '';

    switch (entry.level) {
      case 'error':
        console.error(`${prefix} ❌ ${entry.message}${contextStr}`, entry.error?.stack || entry.error?.message || '');
        break;
      case 'warn':
        console.warn(`${prefix} ⚠️  ${entry.message}${contextStr}`);
        break;
      case 'info':
        console.info(`${prefix} ℹ️  ${entry.message}${contextStr}`);
        break;
      case 'debug':
        console.debug(`${prefix} 🔍 ${entry.message}${contextStr}`);
        break;
    }
  }

  public debug(message: string, context?: LogContext): void {
    this.log('debug', message, undefined, context);
  }

  public info(message: string, context?: LogContext): void {
    this.log('info', message, undefined, context);
  }

  public warn(message: string, context?: LogContext): void {
    this.log('warn', message, undefined, context);
  }

  public error(message: string, error?: Error | unknown, context?: LogContext): void {
    this.log('error', message, error, context);
  }
}
