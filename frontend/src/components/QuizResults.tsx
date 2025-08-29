import React from 'react';
import type { Question } from '../types';
import { useTheme } from '../context/ThemeContext';

interface QuizResultsProps {
  totalQuestions: number;
  correctAnswers: number;
  userAnswers: boolean[];
  questions: Question[];
  onRestart: () => void;
  onBackToPractice: () => void;
}

export function QuizResults({
  totalQuestions,
  correctAnswers,
  userAnswers,
  questions,
  onRestart,
  onBackToPractice
}: QuizResultsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getResultColor = () => {
    if (percentage >= 80) return isDark ? 'text-green-400' : 'text-green-600';
    if (percentage >= 60) return isDark ? 'text-yellow-400' : 'text-yellow-600';
    return isDark ? 'text-red-400' : 'text-red-600';
  };

  const cardStyles = isDark
    ? 'bg-gray-800 text-white border-gray-700'
    : 'bg-white text-gray-800 border-gray-200';

  const answerStyles = (isCorrect: boolean) => isDark
    ? isCorrect ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'
    : isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800';

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className={`rounded-lg shadow-md p-8 border transition-colors duration-200 ${cardStyles}`}>
          <h2 className="text-2xl font-bold mb-6 text-center">Результаты теста</h2>

          <div className="mb-8 text-center">
            <div className={`text-6xl font-bold mb-2 ${getResultColor()}`}>
              {percentage}%
            </div>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              Правильных ответов: {correctAnswers} из {totalQuestions}
            </p>
          </div>

          {/* Детализация ответов */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Детали ответов:</h3>
            <div className="space-y-2">
              {userAnswers.map((isCorrect, index) => (
                <div
                  key={index}
                  className={`flex items-center p-3 rounded-lg ${answerStyles(isCorrect)}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                    isCorrect
                      ? isDark ? 'bg-green-500' : 'bg-green-500 text-white'
                      : isDark ? 'bg-red-500' : 'bg-red-500 text-white'
                  }`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                  <span>
                    Вопрос {index + 1}: {isCorrect ? 'Правильно' : 'Неправильно'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={onRestart}
              className={`w-full py-3 px-6 rounded-lg transition-colors font-semibold ${
                isDark
                  ? 'bg-indigo-700 hover:bg-indigo-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              Пройти тест заново
            </button>

            <button
              onClick={onBackToPractice}
              className={`w-full py-3 px-6 rounded-lg transition-colors font-semibold ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Вернуться к списку практик
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}