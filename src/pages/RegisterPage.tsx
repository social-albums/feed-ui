import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { RegisterForm } from '../components/auth/RegisterForm';

export function RegisterPage() {
  const user = useAuthStore((s) => s.user);

  if (user) {
    return <Navigate to="/feed" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <RegisterForm />
    </div>
  );
}
