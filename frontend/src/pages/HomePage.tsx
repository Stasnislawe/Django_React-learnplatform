import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { CourseCard } from '../components/CourseCard';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Course } from '../types/index';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses';
import { authService } from '../services/auth';
import { fetchTheories } from '../api/courses';
import { fetchCourses, fetchFreeCourses } from '../api/courses';

export function HomePage() {
  const [ courses, setCourses ] = useState<Course[]>([]);
  const [ freeCourses, setFreeCourses ] = useState<Course[]>([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<string | null>(null);
  const [ showFreeCourses, setShowFreeCourses ] = useState(true);
  const [ showReadedCourses, setShowReadedCourses ] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const [allCourses, freeCoursesData] = await Promise.all([
            fetchCourses(),
            fetchFreeCourses()
        ]);
        setCourses(allCourses);
        setFreeCourses(freeCoursesData);
      } catch (err) {
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const getReadParts = (id: number) => {
    return JSON.parse(localStorage.getItem(`course-${id}-read-theories`) || '[]');
  };

  const { unreadCourses, readCoursesFully } = courses.reduce<{
    unreadCourses: Course[];
    readCoursesPercent: Course[];
    readCoursesFully: Course[];
  }>(
    (acc, course) => {
      const readParts = getReadParts(course.id);
      if (readParts.length > 0) {
        acc.readCoursesFully.push(course);
      } else {
        acc.unreadCourses.push(course);
      }
      return acc;
    },
    { unreadCourses: [], readCoursesFully: [] }
  );

  const canReadFreeCourse = (courseId: number) => {
    if (isAuthenticated) return true;
    const readFreeCourses = JSON.parse(localStorage.getItem('readFreeCourses') || '[]');
    return readFreeCourses.length < 2 || readFreeCourses.includes(courseId.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">
        <span>Loading courses...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-4 px-4 sm:px-6 lg:px-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Доступные курсы</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {unreadCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="flex">
          <div className="w-1/2 pr-2">
            <button
              onClick={() => setShowFreeCourses(!showFreeCourses)}
              className="w-full flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-6"
            >
              <span className="text-xl font-semibold text-gray-900 dark:text-white">Бесплатные курсы</span>
              {showFreeCourses ? (
                <ChevronUp className="w-6 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-6 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
            <div className={`overflow-hidden transition-all duration-1000 ease-in ${showFreeCourses ? 'max-h-screen' : 'max-h-0'}`}>
              {showFreeCourses && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
                  {freeCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      id={course.id.toString()}
                      isAccessible={canReadFreeCourse(course.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-1/2 pl-2">
            <button
              onClick={() => setShowReadedCourses(!showReadedCourses)}
              className="w-full flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-6"
            >
              <span className="text-xl font-semibold text-gray-900 dark:text-white">Прочитанные курсы</span>
              {showReadedCourses ? (
                <ChevronUp className="w-6 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-6 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
            <div className={`overflow-hidden transition-all duration-1000 ease-in ${showReadedCourses && readCoursesFully.length > 0 ? 'max-h-screen' : 'max-h-0'}`}>
              {showReadedCourses && readCoursesFully.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {readCoursesFully.map((course) => (
                    <div key={course.id} className="opacity-70 transition-opacity hover:opacity-100">
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}