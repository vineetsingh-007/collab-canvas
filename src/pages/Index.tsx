import { useAuth } from '@/lib/auth-context';
import Landing from './Landing';
import { Navigate } from 'react-router-dom';

const Index = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <Landing />;
};

export default Index;
