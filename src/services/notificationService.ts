import { notificationApi } from './api';
import type { NotificationList } from '../types';

export const getNotifications = (limit = 20) =>
  notificationApi
    .get<NotificationList>('/notifications', { params: { limit } })
    .then((r) => r.data);

export const markNotificationRead = (id: string) =>
  notificationApi.patch(`/notifications/${id}/read`).then(() => undefined);

export const markAllNotificationsRead = () =>
  notificationApi.patch('/notifications/read-all').then(() => undefined);

// URL absoluta del WebSocket a partir de la base relativa (ej. /api/notification):
// el navegador no acepta rutas relativas en new WebSocket, y el esquema tiene que
// ser ws/wss según la página.
export function notificationSocketUrl(): string {
  const base = import.meta.env.VITE_NOTIFICATION_URL as string;
  const url = new URL(`${base.replace(/\/$/, '')}/ws`, window.location.href);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  return url.toString();
}
