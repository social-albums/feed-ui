import { useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePost } from '../../hooks/usePosts';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const MAX_CAPTION = 2200;
const MAX_FILES = 10;

export function PostCreator() {
  const navigate = useNavigate();
  const { mutateAsync: createPost, isPending, error } = useCreatePost();

  const [caption, setCaption] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'followers_only' | 'private'>('public');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).slice(0, MAX_FILES);
    setFiles(selected);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('visibility', visibility);
    files.forEach((file) => formData.append('media', file));
    await createPost(formData);
    navigate('/feed');
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <h1 className="mb-6 text-xl font-bold text-gray-900">Create new post</h1>
      <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-5">
        {/* Caption */}
        <div className="flex flex-col gap-1">
          <label htmlFor="caption" className="text-sm font-medium text-gray-700">
            Caption
          </label>
          <textarea
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={MAX_CAPTION}
            rows={4}
            placeholder="Write a caption…"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
          />
          <p className="text-right text-xs text-gray-400">
            {caption.length}/{MAX_CAPTION}
          </p>
        </div>

        {/* Visibility */}
        <div className="flex flex-col gap-1">
          <label htmlFor="visibility" className="text-sm font-medium text-gray-700">
            Visibility
          </label>
          <select
            id="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as typeof visibility)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="public">Public</option>
            <option value="followers_only">Followers only</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Media */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Media (up to {MAX_FILES} files)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
          />
          {files.length > 0 && (
            <p className="text-xs text-gray-500">{files.length} file(s) selected</p>
          )}
        </div>

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error instanceof Error ? error.message : 'Failed to create post'}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" loading={isPending} className="flex-1">
            Publish
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/feed')}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
