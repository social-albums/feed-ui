import { useAuthStore } from '../../store/authStore';
import { usePost, useDeletePost } from '../../hooks/usePosts';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { MediaCarousel } from '../ui/MediaCarousel';
import type { FeedEntry } from '../../types';

interface PostCardProps {
  entry: FeedEntry;
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function shortId(id: string): string {
  return id.slice(0, 8);
}

export function PostCard({ entry }: PostCardProps) {
  const user = useAuthStore((s) => s.user);
  const { data: post, isLoading, error } = usePost(entry.post_id);
  const deletePost = useDeletePost();

  if (isLoading) {
    return (
      <Card padding={false} className="overflow-hidden animate-pulse">
        <div className="aspect-square bg-gray-200" />
        <div className="p-4 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/4" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
        </div>
      </Card>
    );
  }

  if (error || !post) {
    return (
      <Card>
        <p className="text-sm text-gray-500">Could not load post {shortId(entry.post_id)}.</p>
      </Card>
    );
  }

  const isOwner = user?.userId === entry.author_id;

  return (
    <Card padding={false} className="overflow-hidden">
      {/* Media */}
      <div className="aspect-square bg-gray-100">
        {post.media_urls.length > 0 ? (
          <MediaCarousel urls={post.media_urls} alt={post.caption} className="h-full w-full" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm font-semibold text-gray-800">@{shortId(post.author_id)}</p>
        <p className="mt-1 text-sm text-gray-700 line-clamp-3">{post.caption}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-400">{formatRelativeTime(post.created_at)}</span>
          {isOwner && (
            <Button
              variant="danger"
              className="text-xs px-2 py-1"
              loading={deletePost.isPending}
              onClick={() => void deletePost.mutateAsync(post.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
