import { ReactNode } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { authService } from '../services/auth';
import { fetchFreeCourse } from '../api/courses'; // исправлен импорт
import { useState, useEffect } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isFreeCourse, setIsFreeCourse] = useState(false); // правильное название

  useEffect(() => {
    const checkCourseAccess = async () => {
      if (id) {
        try {
          if (!authService.isAuthenticated()) {
            // Для неавторизованных проверяем бесплатный ли курс
            const course = await fetchFreeCourse(Number(id));
            setIsFreeCourse(course.free);
          } else {
            // Для авторизованных просто разрешаем доступ
            setIsFreeCourse(false);
          }
        } catch (error) {
          console.error('Error checking course access:', error);
          setIsFreeCourse(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkCourseAccess();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Allow access if the course is free or user is authenticated
  if (isFreeCourse || authService.isAuthenticated()) {
    return <>{children}</>;
  }

  // Redirect to login if not free and not authenticated
  return <Navigate to="/login" state={{ from: location }} replace />;
}