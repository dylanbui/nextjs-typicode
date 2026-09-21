/**
 * ------------------------------------------------------------------
 * SERVER-SIDE FILE LOG ROTATOR & RETENTION CLEANER
 * ------------------------------------------------------------------
 * Quản lý ghi file log, kiểm tra dung lượng, tự động xoay vòng (Rotate)
 * và tự động xóa các file log cũ quá hạn trên môi trường Node.js.
 */

import { LogEntry, LoggerConfig } from './logger.types';

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const DEFAULT_MAX_FILES = 5;
const DEFAULT_MAX_AGE_DAYS = 7;

/**
 * Kiểm tra xem môi trường hiện tại có hỗ trợ Node.js File System không
 */
export function isNodeRuntime(): boolean {
  return (
    typeof process !== 'undefined' &&
    !!process.versions?.node &&
    process.env.NEXT_RUNTIME !== 'edge'
  );
}

/**
 * Ghi log entry vào file với cơ chế xoay vòng và dọn dẹp
 */
export async function appendLogToFile(entry: LogEntry, config?: LoggerConfig): Promise<void> {
  if (!isNodeRuntime()) return;

  try {
    const fsMod = 'fs/promises';
    const pathMod = 'path';
    const fs = await import(/* webpackIgnore: true */ fsMod);
    const path = await import(/* webpackIgnore: true */ pathMod);

    // Xác định thư mục root workspace hoặc CWD
    const logDir = config?.logDir || path.resolve(process.cwd(), 'logs');
    const logFilename = config?.logFilename || 'app.log';
    const filePath = path.join(logDir, logFilename);
    const maxSizeBytes = config?.maxFileSizeBytes || DEFAULT_MAX_SIZE;
    const maxFiles = config?.maxFiles || DEFAULT_MAX_FILES;
    const maxAgeDays = config?.maxAgeDays || DEFAULT_MAX_AGE_DAYS;

    // 1. Đảm bảo thư mục logs/ tồn tại
    await fs.mkdir(logDir, { recursive: true });

    // 2. Kiểm tra kích thước file hiện tại để xoay vòng nếu vượt trần
    try {
      const stats = await fs.stat(filePath);
      if (stats.size >= maxSizeBytes) {
        await rotateLogFile(logDir, logFilename, fs, path);
        await pruneOldLogs(logDir, logFilename, maxFiles, maxAgeDays, fs, path);
      }
    } catch (statError: any) {
      // File chưa tồn tại -> không cần rotate
      if (statError?.code !== 'ENOENT') {
        // Bỏ qua lỗi stat không nghiêm trọng
      }
    }

    // 3. Format dòng log thành chuẩn 1 dòng (Single-line structured log)
    const contextStr = entry.context && Object.keys(entry.context).length > 0
      ? ` | context=${JSON.stringify(entry.context)}`
      : '';
    const errorStr = entry.error
      ? ` | error=${entry.error.message} | stack=${entry.error.stack?.replace(/\n/g, ' -> ')}`
      : '';
    const logLine = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.runtime}] ${entry.message}${contextStr}${errorStr}\n`;

    // 4. Append dòng log vào file
    await fs.appendFile(filePath, logLine, 'utf8');
  } catch (err) {
    // Không bao giờ để lỗi ghi log làm crash ứng dụng
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Logger] Không thể ghi log vào file:', err);
    }
  }
}

/**
 * Xoay vòng file: app.log -> app.YYYY-MM-DD-HHmmss.log
 */
async function rotateLogFile(
  logDir: string,
  logFilename: string,
  fs: typeof import('fs/promises'),
  path: typeof import('path')
): Promise<void> {
  const currentPath = path.join(logDir, logFilename);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const ext = path.extname(logFilename) || '.log';
  const basename = path.basename(logFilename, ext);
  const rotatedFilename = `${basename}.${timestamp}${ext}`;
  const rotatedPath = path.join(logDir, rotatedFilename);

  try {
    await fs.rename(currentPath, rotatedPath);
  } catch (e) {
    // Nếu rename thất bại (file đang bị lock), bỏ qua
  }
}

/**
 * Tự động xóa các file log cũ nếu:
 * 1. Số lượng file vượt quá maxFiles.
 * 2. Tuổi thọ file vượt quá maxAgeDays.
 */
async function pruneOldLogs(
  logDir: string,
  logFilename: string,
  maxFiles: number,
  maxAgeDays: number,
  fs: typeof import('fs/promises'),
  path: typeof import('path')
): Promise<void> {
  try {
    const ext = path.extname(logFilename) || '.log';
    const basename = path.basename(logFilename, ext);
    const files = await fs.readdir(logDir);

    // Lọc các file đã xoay vòng: app.YYYY-MM-DD...log
    const rotatedFiles = files.filter(
      (f) => f.startsWith(`${basename}.`) && f.endsWith(ext)
    );

    const now = Date.now();
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;

    // Lấy thông tin thời gian sửa đổi (mtime) của từng file
    const fileStats = await Promise.all(
      rotatedFiles.map(async (file) => {
        const fullPath = path.join(logDir, file);
        try {
          const stat = await fs.stat(fullPath);
          return { file, fullPath, mtime: stat.mtimeMs };
        } catch {
          return null;
        }
      })
    );

    const validStats = fileStats.filter((s): s is NonNullable<typeof s> => s !== null);

    // Sắp xếp từ mới nhất -> cũ nhất
    validStats.sort((a, b) => b.mtime - a.mtime);

    // 1. Xóa các file quá hạn theo số ngày
    for (const item of validStats) {
      if (now - item.mtime > maxAgeMs) {
        await fs.unlink(item.fullPath).catch(() => {});
      }
    }

    // 2. Nếu số lượng file còn lại vẫn vượt quá maxFiles -> xóa các file cũ nhất
    if (validStats.length > maxFiles) {
      const filesToDelete = validStats.slice(maxFiles);
      for (const item of filesToDelete) {
        await fs.unlink(item.fullPath).catch(() => {});
      }
    }
  } catch (err) {
    // Bỏ qua lỗi dọn dẹp để không gián đoạn
  }
}
