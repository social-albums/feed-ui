import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserStats,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
} from '../services/socialService';

export function useUserStats(userId: string) {
  return useQuery({
    queryKey: ['stats', userId],
    queryFn: () => getUserStats(userId),
    enabled: !!userId,
  });
}

export function useFollowers(userId: string) {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: () => getFollowers(userId),
    enabled: !!userId,
  });
}

export function useFollowing(userId: string) {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: () => getFollowing(userId),
    enabled: !!userId,
  });
}

export function useFollow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (targetId: string) => followUser(targetId),
    onSuccess: (_data, targetId) => {
      void queryClient.invalidateQueries({ queryKey: ['stats', targetId] });
    },
  });
}

export function useUnfollow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (targetId: string) => unfollowUser(targetId),
    onSuccess: (_data, targetId) => {
      void queryClient.invalidateQueries({ queryKey: ['stats', targetId] });
    },
  });
}
