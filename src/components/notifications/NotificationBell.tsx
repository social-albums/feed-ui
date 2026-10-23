import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useNotificationSocket,
} from '../../hooks/useNotifications';
import { formatRelativeTime } from '../../utils/time';
import type { Notification } from '../../types';

function shortId(id: string): string {
  return id.slice(0, 8);
}

function NotificationText({ n }: { n: Notification }) {
  switch (n.type) {
    case 'new_follower': {
      const follower = n.payload.follower_id ?? n.source_user_id;
      return (
        <>
          <Link to={`/profile/${follower}`} className="font-semibold hover:underline">
            {shortId(follower)}
          </Link>{' '}
          started following you
        </>
      );
    }
    default:
      return <>New notification</>;
  }
}

export function NotificationBell() {
  useNotificationSocket();
  const { data, isLoading, error } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click afuera o con Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const unread = data?.unread_count ?? 0;
  const notifications = data?.notifications ?? [];

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
            <span className="text-sm font-semibold text-gray-900">Notifications</span>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
                className="text-xs font-medium text-blue-600 hover:underline disabled:opacity-50"
              >
                Mark all as read
              </button>
            )}
          </div>

          <ul className="max-h-96 overflow-y-auto">
            {isLoading && <li className="px-4 py-6 text-center text-sm text-gray-500">Loading…</li>}
            {error && <li className="px-4 py-6 text-center text-sm text-red-600">Could not load notifications.</li>}
            {!isLoading && !error && notifications.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-gray-500">No notifications yet.</li>
            )}
            {notifications.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (!n.read) markRead.mutate(n.id);
                  }}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-gray-50 ${n.read ? 'text-gray-600' : 'bg-blue-50/60 text-gray-900'}`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-blue-600'}`}
                    aria-hidden="true"
                  />
                  <span className="flex-1">
                    <NotificationText n={n} />
                    <span className="block text-xs text-gray-400">{formatRelativeTime(n.created_at)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
