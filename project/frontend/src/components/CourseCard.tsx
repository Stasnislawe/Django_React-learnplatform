import React from 'react';
import { Clock, BarChart } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import type { Course } from '../types';
import { authService } from '../services/auth';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCourseClick = () => {
    if (!authService.isAuthenticated()) {
      navigate(`/login`, { state: { from: `/course/${course.id}/theories` } });
    } else {
      navigate(`/course/${course.id}/theories`);
    }
  }

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
          <h3 className="text-xl font-semibold mb-2">{course.title_theory}</h3>
          <p className="text-gray-200 mb-4 line-clamp-2">{course.about}</p>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{course.time_to_read}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}