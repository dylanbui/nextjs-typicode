/**
 * ------------------------------------------------------------------
 * LAYER 3: INFRASTRUCTURE - Category API Repository Implementation
 * ------------------------------------------------------------------
 * Triển khai ICategoryRepository bằng cách gọi Platzi API qua HttpClient.
 */

import { Category, ICategoryRepository } from '..';
import { IHttpClient, defaultHttpClient } from '../../infrastructure/http-client/http-client';

export class CategoryApiRepository implements ICategoryRepository {
  private client: IHttpClient;

  constructor(client: IHttpClient = defaultHttpClient) {
    this.client = client;
  }

  async getCategories(limit: number = 20): Promise<Category[]> {
    return this.client.get<Category[]>('/categories', {
      params: { limit },
    });
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.client.get<Category>(`/categories/${id}`);
  }
}
