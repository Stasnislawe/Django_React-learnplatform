import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}