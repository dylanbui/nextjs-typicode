/**
 * ------------------------------------------------------------------
 * LAYER 3: INFRASTRUCTURE - Auth API Repository Implementation
 * ------------------------------------------------------------------
 * Triển khai IAuthRepository bằng cách gọi Platzi Auth API qua IHttpClient.
 */

import {
  AuthTokens,
  IAuthRepository,
  LoginCredentials,
  User,
} from '..';
import { IHttpClient, defaultHttpClient } from '../../infrastructure/http-client/http-client';

export class AuthApiRepository implements IAuthRepository {
  private client: IHttpClient;

  constructor(client: IHttpClient = defaultHttpClient) {
    this.client = client;
  }

  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    return this.client.post<AuthTokens>('/auth/login', credentials);
  }

  async getProfile(token: string): Promise<User> {
    return this.client.get<User>('/auth/profile', {
      authToken: token,
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return this.client.post<AuthTokens>('/auth/refresh-token', {
      refreshToken,
    });
  }
}
