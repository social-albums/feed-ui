import { authApi } from './api';
import type { TokenPair, RegisterResponse } from '../types';

export const register = (username: string, email: string, password: string) =>
  authApi.post<RegisterResponse>('/auth/register', { username, email, password }).then((r) => r.data);

export const login = (email: string, password: string) =>
  authApi.post<TokenPair>('/auth/login', { email, password }).then((r) => r.data);

export const refresh = (refresh_token: string) =>
  authApi.post<TokenPair>('/auth/refresh', { refresh_token }).then((r) => r.data);

export const logout = () =>
  authApi.post('/auth/logout').then(() => undefined);
