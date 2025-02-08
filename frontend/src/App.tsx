import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CoursePage } from './pages/CoursePage';
import { LearningPage } from './pages/LearningPage';
import { PracticesListPage } from './pages/PracticesListPage';
import { TheoriesListPage } from './pages/TheoriesListPage';
import { TheoryPage } from './pages/TheoryPage';
import { PracticePage } from './pages/PracticePage';
import { ProfilePage } from './pages/ProfilePage';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AuthGuard } from './components/AuthGuard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/course/:id/theories"
          element={
            <AuthGuard>
              <TheoriesListPage />
            </AuthGuard>
          }
        />
        <Route
          path="/course/:id/theories/:theoryId" element={
            <AuthGuard>
              <TheoryPage />
            </AuthGuard>
          }
        />
        <Route
          path="/course/:id/practices" element={
            <AuthGuard>
              <PracticesListPage />
            </AuthGuard>
          }
        />
        <Route
          path="/course/:id/practice/:practiceId" element={
            <AuthGuard>
              <PracticePage />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

