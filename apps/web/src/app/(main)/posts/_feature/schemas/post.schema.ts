import { z } from 'zod';

export const PostFilterSchema = z.object({
  search: z.string().optional(),
  tag: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
});

export type PostFilterData = z.infer<typeof PostFilterSchema>;

export const PostFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Tiêu đề bài viết phải có tối thiểu 5 ký tự')
    .max(150, 'Tiêu đề bài viết tối đa 150 ký tự'),
  author: z
    .string()
    .trim()
    .min(2, 'Tên tác giả phải có tối thiểu 2 ký tự')
    .max(50, 'Tên tác giả tối đa 50 ký tự'),
  tags: z.string().transform((val) =>
    val
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
  ),
  body: z
    .string()
    .trim()
    .min(20, 'Nội dung bài viết phải có tối thiểu 20 ký tự')
    .max(5000, 'Nội dung bài viết tối đa 5000 ký tự'),
});

export type PostFormData = z.infer<typeof PostFormSchema>;
