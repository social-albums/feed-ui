import { useAuthStore } from '../../store/authStore';
import { useUserStats } from '../../hooks/useSocial';
import { FollowButton } from '../social/FollowButton';

interface ProfileHeaderProps {
  userId: string;
}

function AvatarPlaceholder({ userId }: { userId: string }) {
  const initials = userId.slice(0, 2).toUpperCase();
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
      {initials}
    </div>
  );
}

export function ProfileHeader({ userId }: ProfileHeaderProps) {
  const currentUser = useAuthStore((s) => s.user);
  const { data: stats, isLoading } = useUserStats(userId);

  const isOwnProfile = currentUser?.userId === userId;

  return (
    <div className="flex items-center gap-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <AvatarPlaceholder userId={userId} />

      <div className="flex-1">
        <p className="text-lg font-bold text-gray-900 font-mono">{userId.slice(0, 12)}…</p>

        <div className="mt-2 flex gap-6">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              {isLoading ? '—' : (stats?.follower_count ?? 0)}
            </p>
            <p className="text-xs text-gray-500">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">
              {isLoading ? '—' : (stats?.following_count ?? 0)}
            </p>
            <p className="text-xs text-gray-500">Following</p>
          </div>
        </div>
      </div>

      {!isOwnProfile && currentUser && (
        <FollowButton targetId={userId} />
      )}
    </div>
  );
}
