/**
 * ------------------------------------------------------------------
 * LAYER 3: INFRASTRUCTURE - User API Repository Implementation
 * ------------------------------------------------------------------
 * Triển khai IUserRepository bằng cách gọi Platzi API qua IHttpClient.
 */

import {
  CreateUserInput,
  IUserRepository,
  UpdateUserInput,
  User,
  UserFilter,
} from '..';
import { IHttpClient, defaultHttpClient } from '../../infrastructure/http-client/http-client';

export class UserApiRepository implements IUserRepository {
  private client: IHttpClient;

  constructor(client: IHttpClient = defaultHttpClient) {
    this.client = client;
  }

  async getUsers(filter?: UserFilter): Promise<User[]> {
    return this.client.get<User[]>('/users', {
      params: {
        role: filter?.role,
        limit: filter?.limit ?? 50,
        offset: filter?.offset ?? 0,
      },
    });
  }

  async getUserById(id: number): Promise<User> {
    return this.client.get<User>(`/users/${id}`);
  }

  async createUser(input: CreateUserInput): Promise<User> {
    return this.client.post<User>('/users', input);
  }

  async updateUser(id: number, input: UpdateUserInput): Promise<User> {
    return this.client.put<User>(`/users/${id}`, input);
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.client.delete<boolean>(`/users/${id}`);
  }
}
