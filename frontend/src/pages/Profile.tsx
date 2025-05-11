import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Course } from '../types/index';
import { fetchCourses } from '../api/courses';
import { fetchTheories } from '../api/theories';
import { BookOpen, ArrowLeft, LogOut, User, Moon, Sun } from 'lucide-react';
import { authService } from '../services/auth';
import { useTheme } from '../context/ThemeContext';

interface BookProgress {
  course: Course;
  progress: number;
  readParts: number;
  totalParts: number;
}

export function Profile() {
  const navigate = useNavigate();
  const [readCourses, setReadCourses] = useState<CourseProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const fetchReadCourses = async () => {
      try {
        const allCourses = await fetchCourses();
        const progressData = await Promise.all(
          allCourses.map(async (course) => {
            const readParts = JSON.parse(localStorage.getItem(`course-${course.id}-read-theories`) || '[]');
            if (readParts.length === 0) return null;

            const theories = await fetchTheories(course.id.toString());
            const progress = (readParts.length / theories.length) * 100;

            return {
              course,
              progress,
              readParts: readParts.length,
              totalParts: theories.length
            };
          })
        );
        setReadCourses(progressData.filter((course): course is CourseProgress => course !== null));
      } catch (error) {
        console.error('Failed to fetch read books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">
        <div className="animate-spin mr-2">
          <BookOpen className="w-6 h-6" />
        </div>
        <span>Loading your reading progress...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Library
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-5 h-5" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{username || 'User'}</h2>
              <p className="text-gray-500 dark:text-gray-400">Reading Progress</p>
            </div>
          </div>
        </div>

        {readCourses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No books read yet</h2>
            <p className="text-gray-600 dark:text-gray-400">Start reading to track your progress!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readCourses.map(({ course, progress, readParts, totalParts }) => (
              <div
                key={course.id}
                onClick={() => navigate(`/course/${course.id}/theories`)}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
              >
                <div className="relative h-48">
                  <img
                    src={course.image_title}
                    alt={course.title_theory}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute inset-0 flex items-end mb-1 justify-center">
                    <div className="w-full px-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">Progress</span>
                        <span className="text-white font-bold">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{course.title_theory}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {readParts} of {totalParts} parts read
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


