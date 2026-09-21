/**
 * ------------------------------------------------------------------
 * LAYER 3: INFRASTRUCTURE - Product API Repository Implementation
 * ------------------------------------------------------------------
 * Triển khai IProductRepository bằng cách gọi Platzi API qua HttpClient.
 */

import {
  CreateProductInput,
  IProductRepository,
  Product,
  ProductFilter,
  UpdateProductInput,
} from '..';
import { IHttpClient, defaultHttpClient } from '../../infrastructure/http-client/http-client';

export class ProductApiRepository implements IProductRepository {
  private client: IHttpClient;

  constructor(client: IHttpClient = defaultHttpClient) {
    this.client = client;
  }

  async getProducts(filter?: ProductFilter): Promise<Product[]> {
    return this.client.get<Product[]>('/products', {
      params: {
        title: filter?.title,
        price: filter?.price,
        price_min: filter?.price_min,
        price_max: filter?.price_max,
        categoryId: filter?.categoryId,
        offset: filter?.offset ?? 0,
        limit: filter?.limit ?? 20,
      },
    });
  }

  async getProductById(id: number): Promise<Product> {
    return this.client.get<Product>(`/products/${id}`);
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    return this.client.post<Product>('/products', input);
  }

  async updateProduct(id: number, input: UpdateProductInput): Promise<Product> {
    return this.client.put<Product>(`/products/${id}`, input);
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.client.delete<boolean>(`/products/${id}`);
  }
}
