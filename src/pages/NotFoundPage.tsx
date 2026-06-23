import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
      <p className="text-7xl font-extrabold text-gray-200">404</p>
      <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="text-gray-500">The page you are looking for does not exist.</p>
      <Link
        to="/feed"
        className="mt-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        Back to Feed
      </Link>
    </div>
  );
}
