/**
 * ------------------------------------------------------------------
 * IMAGE UTILITIES (Isomorphic Helper)
 * ------------------------------------------------------------------
 * Dùng chung an toàn cho cả Server Component (RSC) và Client Component.
 */

export function cleanImageUrl(url?: string): string {
  if (!url) return 'https://placehold.co/600x400?text=No+Image';

  // Xử lý trường hợp Platzi API trả về chuỗi JSON bọc ngoài URL: ["https://..."]
  let cleaned = url.replace(/^[\["\s]+|[\]"\s]+$/g, '').trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    return 'https://placehold.co/600x400?text=Invalid+Image';
  }
  return cleaned;
}
