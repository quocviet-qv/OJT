import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ element, requiredRole }) {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    const redirectPath =
      userProfile?.role === 'admin'
        ? '/admin'
        : userProfile?.role === 'teacher'
          ? '/teacher'
          : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return element;
}
