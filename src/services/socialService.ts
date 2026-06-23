import { socialApi } from './api';
import type { FollowRelation, UserStats } from '../types';

export const followUser = (targetId: string) =>
  socialApi.post<{ status: string }>(`/follow/${targetId}`).then((r) => r.data);

export const unfollowUser = (targetId: string) =>
  socialApi.delete(`/follow/${targetId}`).then(() => undefined);

export const getFollowers = (userId: string, limit = 20, offset = 0) =>
  socialApi
    .get<FollowRelation[]>(`/users/${userId}/followers`, { params: { limit, offset } })
    .then((r) => r.data);

export const getFollowing = (userId: string, limit = 20, offset = 0) =>
  socialApi
    .get<FollowRelation[]>(`/users/${userId}/following`, { params: { limit, offset } })
    .then((r) => r.data);

export const getUserStats = (userId: string) =>
  socialApi.get<UserStats>(`/users/${userId}/stats`).then((r) => r.data);
