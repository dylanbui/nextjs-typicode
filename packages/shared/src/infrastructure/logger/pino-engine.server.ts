/**
 * ------------------------------------------------------------------
 * PINO SERVER-SIDE ENGINE (High Performance & Log Rotation)
 * ------------------------------------------------------------------
 * Tích hợp lõi thư viện Pino v10 + Pino-Roll v4 + Pino-Pretty v13:
 * - Ghi log phi luồng (Asynchronous I/O), tốc độ cao nhất hệ sinh thái Node.js.
 * - Tự động xoay vòng file khi đạt dung lượng (mặc định 5MB) hoặc theo ngày.
 * - Tự động xóa dọn dẹp các file log cũ quá hạn (mặc định giữ tối đa 5 files).
 */

import { LogEntry, LoggerConfig } from './logger.types';
import { isNodeRuntime } from './file-rotator.server';

let pinoLoggerInstance: any = null;

/**
 * Khởi tạo hoặc lấy instance Pino trên Node.js runtime
 */
export async function getPinoServerLogger(config?: LoggerConfig): Promise<any> {
  if (!isNodeRuntime()) return null;
  if (pinoLoggerInstance) return pinoLoggerInstance;

  try {
    const pinoMod = 'pino';
    const pathMod = 'path';
    const pinoModule = await import(/* webpackIgnore: true */ pinoMod);
    const pino = pinoModule.default || pinoModule;
    const path = await import(/* webpackIgnore: true */ pathMod);

    const logDir = config?.logDir || path.resolve(process.cwd(), 'logs');
    const logFilename = config?.logFilename || 'app.log';
    const filePath = path.join(logDir, logFilename);
    const maxSizeBytes = config?.maxFileSizeBytes || 5 * 1024 * 1024;
    const maxFiles = config?.maxFiles || 5;

    // Đảm bảo thư mục tồn tại
    const fsMod = 'fs';
    const fs = await import(/* webpackIgnore: true */ fsMod);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const destination = pino.destination({
      dest: filePath,
      sync: false,
      mkdir: true,
    });

    pinoLoggerInstance = pino(
      {
        level: config?.minLevel || 'debug',
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
          level: (label: string) => ({ level: label.toUpperCase() }),
        },
      },
      destination
    );

    return pinoLoggerInstance;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[PinoEngine] Khởi tạo Pino transport không khả dụng, sử dụng fallback native file rotator:', err);
    }
    return null;
  }
}

/**
 * Gửi log qua Pino Engine
 */
export async function logWithPino(entry: LogEntry, config?: LoggerConfig): Promise<boolean> {
  if (!isNodeRuntime()) return false;

  try {
    const pinoInstance = await getPinoServerLogger(config);
    if (!pinoInstance) return false;

    const payload = {
      ...(entry.context || {}),
      err: entry.error,
      runtime: entry.runtime,
    };

    switch (entry.level) {
      case 'debug':
        pinoInstance.debug(payload, entry.message);
        break;
      case 'info':
        pinoInstance.info(payload, entry.message);
        break;
      case 'warn':
        pinoInstance.warn(payload, entry.message);
        break;
      case 'error':
        pinoInstance.error(payload, entry.message);
        break;
    }

    return true;
  } catch {
    return false;
  }
}
