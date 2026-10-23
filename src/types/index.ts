export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface RegisterResponse {
  user_id: string;
}

export interface PostResponse {
  id: string;
  author_id: string;
  caption: string;
  status: 'published' | 'processing' | 'deleted';
  visibility: 'public' | 'followers_only' | 'private';
  media_urls: string[];
  tags: string[];
  created_at: string;
}

export interface FeedEntry {
  post_id: string;
  author_id: string;
  score: number;
  inserted_at: string;
}

export interface FeedResponse {
  entries: FeedEntry[];
  next_cursor: string | null;
  has_more: boolean;
}

export interface FollowRelation {
  follower_id: string;
  following_id: string;
  mutual: boolean;
}

export interface UserStats {
  user_id: string;
  follower_count: number;
  following_count: number;
}

export interface AuthUser {
  userId: string;
  accessToken: string;
  refreshToken: string;
}

export type NotificationType = 'new_follower' | 'new_post' | 'post_liked' | 'comment_added';

export interface Notification {
  id: string;
  type: NotificationType;
  source_user_id: string;
  payload: Record<string, string>;
  read: boolean;
  created_at: string;
}

export interface NotificationList {
  notifications: Notification[];
  unread_count: number;
}
