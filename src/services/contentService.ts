import { contentApi } from './api';
import type { PostResponse } from '../types';

export const createPost = (formData: FormData) =>
  contentApi
    .post<PostResponse>('/posts', formData)
    .then((r) => r.data);

export const getPost = (id: string) =>
  contentApi.get<PostResponse>(`/posts/${id}`).then((r) => r.data);

export const deletePost = (id: string) =>
  contentApi.delete(`/posts/${id}`).then(() => undefined);
