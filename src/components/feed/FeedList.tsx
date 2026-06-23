import { useFeed } from '../../hooks/useFeed';
import { PostCard } from './PostCard';
import { Button } from '../ui/Button';
import type { FeedEntry } from '../../types';

interface FeedListProps {
  userId: string;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <div className="aspect-square bg-gray-200" />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/4" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FeedList({ userId }: FeedListProps) {
  const { pages, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useFeed(userId);

  if (isLoading) return <LoadingSkeleton />;

  if (error) {
    return (
      <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
        Failed to load feed: {error.message}
      </p>
    );
  }

  const entries: FeedEntry[] = pages.flatMap((page) => page.entries);

  if (entries.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p className="text-lg font-medium">No posts yet</p>
        <p className="mt-1 text-sm">Follow people or create your first post.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <PostCard key={entry.post_id} entry={entry} />
      ))}

      {hasNextPage && (
        <div className="flex justify-center py-4">
          <Button
            variant="secondary"
            loading={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            {isFetchingNextPage ? 'Loading…' : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  );
}
