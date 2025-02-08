import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, GraduationCap } from 'lucide-react';
import { authService } from '../services/auth';

export function Header() {
  const isAuthenticated = authService.isAuthenticated();
  const navigate = useNavigate();
  console.log(isAuthenticated);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
          </Link>
          {isAuthenticated ? (
            <nav className="flex space-x-8">
              <Link
                to="/courses"
                className="flex items-center text-gray-700 hover:text-indigo-600"
              >
                <BookOpen className="h-5 w-5 mr-1" />
                <span>Курсы</span>
              </Link>
            
              <Link
                to="/profile"
                className="flex items-center text-gray-700 hover:text-indigo-600"
              >
                <User className="h-5 w-5 mr-1" />
                <span>Личный кабинет</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center text-gray-700 hover:text-indigo-600"
              >
                <User className="h-5 w-5 mr-1" />
                <span>Поддержка</span>
              </Link>
              </nav>
            ) : (
              <nav>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Sign In
              </button>
              </nav>
            )}
        </div>
      </div>
    </header>
  );
}