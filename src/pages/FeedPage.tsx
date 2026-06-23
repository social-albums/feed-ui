import { useAuthStore } from '../store/authStore';
import { Header } from '../components/layout/Header';
import { FeedList } from '../components/feed/FeedList';

export function FeedPage() {
  const user = useAuthStore((s) => s.user);

  // user is guaranteed by ProtectedRoute
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-8">
        <FeedList userId={user.userId} />
      </main>
    </div>
  );
}
