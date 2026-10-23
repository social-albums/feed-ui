import { feedApi } from './api';
import type { FeedResponse } from '../types';

// El feed es siempre el del usuario autenticado: feed-service lo toma del JWT.
export const getFeed = (cursor?: string | null, limit = 20) =>
  feedApi
    .get<FeedResponse>('/feed', { params: { cursor, limit } })
    .then((r) => r.data);
