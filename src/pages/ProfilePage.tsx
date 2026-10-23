import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { PostGrid } from '../components/profile/PostGrid';
import { useFollowers, useFollowing } from '../hooks/useSocial';

type Tab = 'posts' | 'followers' | 'following';

function RelationList({ ids }: { ids: string[] }) {
  if (ids.length === 0) {
    return <p className="text-sm text-gray-500">None yet.</p>;
  }
  return (
    <ul className="divide-y divide-gray-100">
      {ids.map((id) => (
        <li key={id} className="py-2 text-sm font-mono text-gray-700">
          {id}
        </li>
      ))}
    </ul>
  );
}

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const [tab, setTab] = useState<Tab>('posts');

  const { data: followers = [] } = useFollowers(userId ?? '');
  const { data: following = [] } = useFollowing(userId ?? '');

  if (!userId) {
    return <p className="p-8 text-center text-gray-500">Invalid profile URL.</p>;
  }

  const followerIds = followers.map((r) => r.follower_id);
  const followingIds = following.map((r) => r.following_id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-8 space-y-6">
        <ProfileHeader userId={userId} />

        {/* Tabs */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {(
              [
                ['posts', 'Posts'],
                ['followers', `Followers (${followerIds.length})`],
                ['following', `Following (${followingIds.length})`],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  tab === key
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className={tab === 'posts' ? 'p-1' : 'p-4'}>
            {tab === 'posts' && <PostGrid userId={userId} />}
            {tab === 'followers' && <RelationList ids={followerIds} />}
            {tab === 'following' && <RelationList ids={followingIds} />}
          </div>
        </div>
      </main>
    </div>
  );
}
