import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { NotificationBell } from '../notifications/NotificationBell';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link to="/feed" className="text-xl font-bold text-blue-600">
          FeedApp
        </Link>

        <nav className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <NotificationBell />
              <Link
                to={`/profile/${user.userId}`}
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Profile
              </Link>
              <Link to="/posts/new">
                <Button variant="secondary" className="text-xs">
                  + New Post
                </Button>
              </Link>
              <Button variant="ghost" className="text-xs" onClick={() => void logout()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link to="/register">
                <Button className="text-xs">Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
