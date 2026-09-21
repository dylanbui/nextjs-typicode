export * from './logger.types';
export * from './isomorphic-logger';
export * from './file-rotator.server';

import { IsomorphicLogger } from './isomorphic-logger';

// Khởi tạo instance logger mặc định dùng chung toàn dự án
export const logger = new IsomorphicLogger();
