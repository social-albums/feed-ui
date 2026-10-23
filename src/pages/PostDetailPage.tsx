import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { usePost, useDeletePost } from '../hooks/usePosts';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MediaCarousel } from '../components/ui/MediaCarousel';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { data: post, isLoading, error } = usePost(id ?? '');
  const deletePost = useDeletePost();

  async function handleDelete() {
    if (!post) return;
    await deletePost.mutateAsync(post.id);
    navigate('/feed');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-8">
        {isLoading && (
          <Card className="animate-pulse space-y-4">
            <div className="aspect-square rounded-lg bg-gray-200" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </Card>
        )}

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            Failed to load post: {error.message}
          </p>
        )}

        {post && (
          <Card padding={false} className="overflow-hidden">
            {post.media_urls.length > 1 ? (
              <MediaCarousel
                urls={post.media_urls}
                alt={post.caption}
                className="aspect-square bg-gray-100"
              />
            ) : post.media_urls.length === 1 ? (
              <img
                src={post.media_urls[0]}
                alt={post.caption}
                className="w-full object-cover"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center bg-gray-100 text-gray-400">
                No media
              </div>
            )}
            <div className="p-5 space-y-3">
              <p className="text-sm font-semibold text-gray-800 font-mono">
                @{post.author_id.slice(0, 8)}
              </p>
              <p className="text-gray-700">{post.caption}</p>
              <p className="text-xs text-gray-400">
                {new Date(post.created_at).toLocaleString()}
              </p>
              <div className="flex gap-2 flex-wrap">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              {user?.userId === post.author_id && (
                <Button
                  variant="danger"
                  loading={deletePost.isPending}
                  onClick={() => void handleDelete()}
                  className="mt-2"
                >
                  Delete post
                </Button>
              )}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
