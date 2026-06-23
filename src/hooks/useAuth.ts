import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import * as authService from '../services/authService';

function decodeUserId(token: string): string {
  try {
    const payload = token.split('.')[1];
    if (!payload) throw new Error('Invalid token');
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const json = JSON.parse(decoded) as Record<string, unknown>;
    // Common JWT claim names for user id
    const id =
      json['sub'] ??
      json['user_id'] ??
      json['userId'] ??
      json['id'];
    return String(id);
  } catch {
    return 'unknown';
  }
}

export function useAuth() {
  const { user, setAuth, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const isAuthenticated = user !== null;

  async function login(email: string, password: string) {
    const tokens = await authService.login(email, password);
    const userId = decodeUserId(tokens.access_token);
    setAuth({
      userId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
  }

  async function register(username: string, email: string, password: string) {
    return authService.register(username, email, password);
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      clearAuth();
      navigate('/login');
    }
  }

  return { user, isAuthenticated, login, register, logout };
}
