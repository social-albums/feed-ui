import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  notificationSocketUrl,
} from '../services/notificationService';
import type { NotificationList } from '../types';

const NOTIFICATIONS_KEY = ['notifications'] as const;

// Subprotocolo con el que viaja el token: la API WebSocket del navegador no
// permite mandar el header Authorization (ver NOTIFICATION.md en el backend).
const TOKEN_SUBPROTOCOL = 'access_token';

// Códigos con los que notification-service cierra el WebSocket.
const CLOSE_TOKEN_EXPIRED = 4001; // refrescar el token y reconectar
const CLOSE_TOKEN_REVOKED = 4003; // logout: no reconectar

const MAX_RECONNECT_DELAY_MS = 30_000;

export function useNotifications() {
  const userId = useAuthStore((s) => s.user?.userId);
  return useQuery<NotificationList, Error>({
    queryKey: [...NOTIFICATIONS_KEY, userId],
    queryFn: () => getNotifications(),
    enabled: Boolean(userId),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });
}

// useNotificationSocket mantiene abierto el WebSocket de notificaciones mientras
// haya sesión. Cada mensaje del servidor refresca la lista (el push trae menos
// datos que GET /notifications, y así el contador de no leídas queda bien).
//
// Reconexión según el código de cierre:
//   - 4003 (logout): no reconecta.
//   - 4001 (token vencido) y cualquier corte: refresca la lista, lo que con un
//     token vencido da 401 y el interceptor de axios renueva el token. El token
//     nuevo en el store vuelve a correr este effect, que reconecta con él.
//   - otros cortes: además reintenta con backoff exponencial (1 s … 30 s).
export function useNotificationSocket() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.user?.accessToken);

  useEffect(() => {
    if (!token) return;

    let socket: WebSocket | null = null;
    let retryTimer: number | undefined;
    let attempt = 0;
    let stopped = false;

    const refreshList = () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });

    function connect() {
      socket = new WebSocket(notificationSocketUrl(), [TOKEN_SUBPROTOCOL, token as string]);

      socket.onopen = () => {
        attempt = 0;
        void refreshList(); // lo que llegó mientras estaba desconectado
      };
      socket.onmessage = () => {
        void refreshList();
      };
      socket.onclose = (event) => {
        if (stopped || event.code === CLOSE_TOKEN_REVOKED) return;
        void refreshList();
        if (event.code === CLOSE_TOKEN_EXPIRED) return; // reconecta al cambiar el token
        const delay = Math.min(MAX_RECONNECT_DELAY_MS, 1000 * 2 ** attempt);
        attempt += 1;
        retryTimer = window.setTimeout(connect, delay);
      };
    }

    connect();
    return () => {
      stopped = true;
      window.clearTimeout(retryTimer);
      socket?.close();
    };
  }, [token, queryClient]);
}
