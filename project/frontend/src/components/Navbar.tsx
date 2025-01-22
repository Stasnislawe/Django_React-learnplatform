import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, LogIn } from 'lucide-react';
import { authService } from '../services/auth';

export function Navbar() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const username = localStorage.getItem('username');
  const isAuthenticated = authService.isAuthenticated();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed top-0 right-0 m-4 z-50">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          <span>Авторизироваться</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-0 right-0 m-4 z-50">
      <div className="relative">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
        >
          <User className="w-4 h-4" />
          <span>{username || 'User'}</span>
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}