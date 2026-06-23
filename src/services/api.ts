import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { TokenPair } from '../types';
import { useAuthStore } from '../store/authStore';

// ── Axios instances ──────────────────────────────────────────────────────────

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL as string,
});

export const feedApi = axios.create({
  baseURL: import.meta.env.VITE_FEED_URL as string,
});

export const contentApi = axios.create({
  baseURL: import.meta.env.VITE_CONTENT_URL as string,
});

export const socialApi = axios.create({
  baseURL: import.meta.env.VITE_SOCIAL_URL as string,
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function getAccessToken(): string | null {
  return useAuthStore.getState().user?.accessToken ?? null;
}

function getRefreshToken(): string | null {
  return useAuthStore.getState().user?.refreshToken ?? null;
}

function injectBearer(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}

// ── Request interceptors (inject Bearer) ─────────────────────────────────────

authApi.interceptors.request.use(injectBearer);
contentApi.interceptors.request.use(injectBearer);
socialApi.interceptors.request.use(injectBearer);

// ── Token-refresh response interceptor factory ────────────────────────────────

// Flag to prevent infinite refresh loops
let isRefreshing = false;
type FailedRequest = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
};
let failedQueue: FailedRequest[] = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

function addRefreshInterceptor(instance: typeof authApi) {
  instance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error)) return Promise.reject(error);

      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue subsequent 401s while we are refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token as string}`;
            return instance(originalRequest);
          })
          .catch((err: unknown) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await authApi.post<TokenPair>('/auth/refresh', {
          refresh_token: refreshToken,
        });

        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          useAuthStore.getState().setAuth({
            ...currentUser,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          });
        }

        processQueue(null, data.access_token);
        originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
        return instance(originalRequest);
      } catch (refreshError: unknown) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}

addRefreshInterceptor(authApi);
addRefreshInterceptor(contentApi);
addRefreshInterceptor(socialApi);
