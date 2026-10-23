import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPost, getUserPosts, createPost, deletePost } from '../services/contentService';

const USER_POSTS_PAGE = 30;

export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id),
    enabled: !!id,
  });
}

// Posts de un usuario para la grilla del perfil, paginados por offset.
// Una página incompleta indica que no hay más.
export function useUserPosts(userId: string) {
  const query = useInfiniteQuery({
    queryKey: ['userPosts', userId],
    queryFn: ({ pageParam }) => getUserPosts(userId, pageParam, USER_POSTS_PAGE),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === USER_POSTS_PAGE ? allPages.length * USER_POSTS_PAGE : undefined,
    enabled: !!userId,
  });

  return {
    posts: query.data?.pages.flat() ?? [],
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createPost(formData),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
      void queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['feed'] });
      void queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    },
  });
}
