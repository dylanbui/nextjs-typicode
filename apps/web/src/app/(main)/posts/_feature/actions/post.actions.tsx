import { z } from 'zod';
import { Post } from '@repo/shared';
import { PostListView } from '../views/PostListView';
import { PostDetailView } from '../views/PostDetailView';
import { PostFormView } from '../views/PostFormView';
import { PostDeleteView } from '../views/PostDeleteView';
import { PostFilterSchema } from '../schemas/post.schema';

// Mock dữ liệu mẫu cho Posts Feature
const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: 'Kiến Trúc Catch-All Master Dispatcher & Private Feature Folder Trong Next.js',
    body: `Bằng cách đặt thư mục _feature ngay bên trong app/posts/, toàn bộ Schemas, Actions, Views của module Posts được gom lại thành một khối tự trị (Autonomous Feature).

Next.js tự động bảo vệ thư mục _feature bằng cơ chế Private Folder (không tạo URL public), biến module thành một Plugin độc lập dễ bảo trì và dễ tái sử dụng.`,
    author: 'Dylan Bui',
    tags: ['nextjs', 'colocation', 'architecture', 'private-folder'],
    createdAt: '18/09/2026',
    viewsCount: 512,
  },
  {
    id: 2,
    title: 'ActionDispatcher: Tự Động Phân Tách URL Slug Theo Phong Cách Controller-Action',
    body: `ActionDispatcher mang tư duy phân giải URL linh hoạt từ các Framework PHP (Laravel, CodeIgniter) vào Next.js App Router.

Mọi URL như /posts/add, /posts/edit/123, /posts/view-detail/123 đều được tự động ánh xạ sang hàm tương ứng (addAction, editAction, viewDetailAction) cùng với kiểm tra bảo mật và ép kiểu Zod tự động.`,
    author: 'Antigravity Architect',
    tags: ['typescript', 'clean-code', 'zod', 'rpc'],
    createdAt: '18/09/2026',
    viewsCount: 280,
  },
  {
    id: 3,
    title: 'Tối Ưu Hóa Trọng Lượng Bundle Với React Server Components (RSC Hybrid)',
    body: `Với RSC Hybrid, toàn bộ HTML tĩnh của danh sách và chi tiết được render 100% tại Server. Trình duyệt không cần tải về mã JS của các thư viện render nặng nề, giúp tốc độ First Contentful Paint (FCP) giảm xuống dưới 100ms.`,
    author: 'Tech Lead',
    tags: ['performance', 'rsc', 'web-vitals'],
    createdAt: '17/09/2026',
    viewsCount: 195,
  },
];

/**
 * 1. 🏠 INDEX ACTION (Mặc định khi vào URL: /posts)
 */
export async function indexAction(
  rawSearchParams?: Record<string, string | string[] | undefined>
) {
  const filter = PostFilterSchema.parse(rawSearchParams || {});
  return (
    <PostListView
      posts={MOCK_POSTS}
      search={filter.search}
      tag={filter.tag}
    />
  );
}

/**
 * 2. 📋 LIST ACTION (URL: /posts/list)
 */
export async function listAction(
  rawSearchParams?: Record<string, string | string[] | undefined>
) {
  const filter = PostFilterSchema.parse(rawSearchParams || {});
  let posts = MOCK_POSTS;
  if (filter.search) {
    const kw = filter.search.toLowerCase();
    posts = posts.filter((p) => p.title.toLowerCase().includes(kw) || p.body.toLowerCase().includes(kw));
  }
  return (
    <PostListView
      posts={posts}
      search={filter.search}
      tag={filter.tag}
    />
  );
}

/**
 * 3. ➕ ADD ACTION (URL: /posts/add)
 */
export async function addAction() {
  return <PostFormView mode="add" />;
}

/**
 * 4. ✏️ EDIT ACTION (URL: /posts/edit/:id)
 */
export async function editAction(id: number) {
  const post = MOCK_POSTS.find((p) => p.id === id) || {
    id,
    title: `Bài viết #${id} (Mẫu)`,
    body: 'Nội dung bài viết mẫu tải từ cơ sở dữ liệu...',
    author: 'Admin',
    tags: ['general', 'tech'],
    createdAt: '18/09/2026',
  };
  return <PostFormView mode="edit" post={post} />;
}
// Validate tham số ID: bắt buộc là số nguyên dương
editAction.paramsSchema = z.tuple([
  z.number().int().positive('ID bài viết phải là số nguyên dương'),
]);

/**
 * 5. 🗑️ DELETE ACTION (URL: /posts/delete/:id)
 */
export async function deleteAction(id: number) {
  return <PostDeleteView id={id} />;
}
// Validate tham số ID: bắt buộc là số nguyên dương
deleteAction.paramsSchema = z.tuple([
  z.number().int().positive('ID bài viết phải là số nguyên dương'),
]);

/**
 * 6. 📄 VIEW DETAIL ACTION (URL: /posts/view-detail/:id hoặc /posts/:id)
 */
export async function viewDetailAction(id: number) {
  const post = MOCK_POSTS.find((p) => p.id === id) || {
    id,
    title: `Bài Viết #${id}: Khám Phá Kiến Trúc Next.js 14`,
    body: `Đây là nội dung chi tiết của bài viết #${id} được nạp tự động qua viewDetailAction(id).
    
ActionDispatcher đã phân tích chính xác URL và ép kiểu tham số ID=${id} thành kiểu số nguyên an toàn trước khi truyền vào hàm này.`,
    author: 'Dylan Bui',
    tags: ['nextjs', 'action-dispatcher', 'clean-arch'],
    createdAt: '18/09/2026',
    viewsCount: 450,
  };
  return <PostDetailView post={post} />;
}
// Validate tham số ID: bắt buộc là số nguyên dương
viewDetailAction.paramsSchema = z.tuple([
  z.number().int().positive('ID bài viết phải là số nguyên dương'),
]);
