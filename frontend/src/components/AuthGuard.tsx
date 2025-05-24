import { ReactNode } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { authService } from '../services/auth';
import { fetchFreeCourse, fetchCourse } from '../api/courses';
import { useState, useEffect } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isFreeCourse, setIsFreeCourse] = useState(false);

  useEffect(() => {
    const checkCourseAccess = async () => {
      if (id) {
        try {
          const course = await fetchFreeCourse(id);
          setIsFreeCourse(course.free);
        } catch (error) {
          console.error('Error checking course access:', error);
          setIsFreeBook(false);
        }
      }
      setIsLoading(false);
    };

    checkCourseAccess();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  // Allow access if the book is free or user is authenticated
  if (isFreeCourse || authService.isAuthenticated()) {
    return <>{children}</>;
  }

  // Redirect to login if not free and not authenticated
  return <Navigate to="/login" state={{ from: location }} replace />;
}