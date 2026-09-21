/**
 * ------------------------------------------------------------------
 * LOGGER TYPES & INTERFACES
 * ------------------------------------------------------------------
 * Định nghĩa chuẩn mực cho hệ thống ghi log Isomorphic toàn dự án.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogContext = Record<string, any>;

export interface LogErrorDetails {
  name?: string;
  message: string;
  stack?: string;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: LogErrorDetails;
  runtime: 'node' | 'edge' | 'browser';
}

export interface LoggerConfig {
  /** Mức log tối thiểu để ghi (mặc định: 'info' cho production, 'debug' cho development) */
  minLevel?: LogLevel;
  /** Thư mục lưu file log trên Node runtime (mặc định: 'logs') */
  logDir?: string;
  /** Tên file log chính (mặc định: 'app.log') */
  logFilename?: string;
  /** Dung lượng tối đa của 1 file log trước khi xoay vòng (mặc định: 5MB = 5 * 1024 * 1024 bytes) */
  maxFileSizeBytes?: number;
  /** Số lượng file log lưu trữ tối đa (mặc định: 5 files) */
  maxFiles?: number;
  /** Thời gian lưu trữ tối đa theo ngày (mặc định: 7 ngày) */
  maxAgeDays?: number;
  /** Bật/Tắt in ra console (mặc định: true) */
  enableConsole?: boolean;
  /** Bật/Tắt ghi file trên server (mặc định: true trên Node runtime) */
  enableFile?: boolean;
}

export interface ILogger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: Error | unknown, context?: LogContext): void;
}
