import React, { useEffect, useState } from 'react';
import { Clock, BarChart } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import type { Course } from '../types';
import { authService } from '../services/auth';
import { fetchTheories } from '../api/theories';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
      const calculateProgress = async () => {
          try {
              const readParts = JSON.parse(localStorage.getItem(`course-${course.id}-read-theories`) || '[]');
              if (readParts.length > 0) {
                  const theories = await fetchTheories(course.id);
                  const progressValue = (readParts.length / theories.length) * 100;
                  setProgress(progressValue);
              }
          } catch (error) {
              console.error('Failed:', error);
          }
      };

      calculateProgress();
  }, [course.id]);

  const handleCourseClick = () => {
    if (course.free) {
      navigate(`/course/${course.id}/theories`);
    } else if (!authService.isAuthenticated()) {
      navigate(`/login`, { state: { from: `/course/${course.id}/theories` } });
    } else {
      navigate(`/course/${course.id}/theories`);
    }
  };

  return (
    <div onClick={handleCourseClick}>
      <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${course.image_title})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="relative z-10 p-6 text-white">
          <h3 className="text-xm font-semibold mb-2">{course.title_theory}</h3>
          <p className="text-gray-200 mb-4 line-clamp-4">{course.about}</p>
          
            <div className="flex flex-col gap-4">
              {progress !== null && (
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-gray-200 text-sm font-medium">
                    {Math.round(progress)}%
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}