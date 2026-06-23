import { feedApi } from './api';
import type { FeedResponse } from '../types';

export const getFeed = (userId: string, cursor?: string | null, limit = 20) =>
  feedApi
    .get<FeedResponse>('/feed', {
      headers: { 'X-User-ID': userId },
      params: { cursor, limit },
    })
    .then((r) => r.data);
