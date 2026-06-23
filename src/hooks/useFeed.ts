import { useInfiniteQuery } from '@tanstack/react-query';
import { getFeed } from '../services/feedService';
import type { FeedResponse } from '../types';

export function useFeed(userId: string) {
  const query = useInfiniteQuery<FeedResponse, Error, { pages: FeedResponse[] }, ['feed', string], string | null>({
    queryKey: ['feed', userId],
    queryFn: ({ pageParam }) => getFeed(userId, pageParam ?? undefined),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.next_cursor : undefined,
  });

  return {
    pages: query.data?.pages ?? [],
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    error: query.error,
  };
}
