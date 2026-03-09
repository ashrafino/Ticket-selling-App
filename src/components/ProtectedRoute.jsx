import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900 bg-mesh">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-neon-blue/30 border-t-neon-blue rounded-full animate-spin" />
          <p className="text-white/50 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900 bg-mesh">
        <div className="glass-card p-8 text-center max-w-md animate-slide-up">
          <div className="text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Access Denied</h2>
          <p className="text-white/50 mb-6">You don't have permission to access this page.</p>
          <Navigate to={userRole === 'admin' ? '/admin' : '/seller'} replace />
        </div>
      </div>
    );
  }

  return children;
}
