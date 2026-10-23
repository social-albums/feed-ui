import { Link } from 'react-router-dom';
import { useUserPosts } from '../../hooks/usePosts';
import { Button } from '../ui/Button';

interface PostGridProps {
  userId: string;
}

// Grilla de 3 columnas estilo Instagram con los posts del usuario.
export function PostGrid({ userId }: PostGridProps) {
  const { posts, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useUserPosts(userId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="aspect-square animate-pulse bg-gray-200" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="p-3 text-sm text-red-600">Failed to load posts: {error.message}</p>;
  }

  if (posts.length === 0) {
    return <p className="p-3 text-sm text-gray-500">No posts yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/posts/${post.id}`}
            className="relative block aspect-square overflow-hidden bg-gray-100"
          >
            {post.media_urls.length > 0 && (
              <img
                src={post.media_urls[0]}
                alt={post.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-opacity hover:opacity-80"
              />
            )}
            {post.media_urls.length > 1 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-label={`${post.media_urls.length} images`}
                className="absolute right-1.5 top-1.5 h-4 w-4 text-white drop-shadow"
              >
                <path d="M8 2h12a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2z" />
                <path d="M4 6v14h14v2H4a2 2 0 01-2-2V6h2z" />
              </svg>
            )}
            {post.visibility !== 'public' && (
              <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                {post.visibility}
              </span>
            )}
          </Link>
        ))}
      </div>

      {hasNextPage && (
        <Button
          variant="secondary"
          className="w-full"
          loading={isFetchingNextPage}
          onClick={() => void fetchNextPage()}
        >
          Load more
        </Button>
      )}
    </div>
  );
}
