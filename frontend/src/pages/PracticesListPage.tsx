import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePractices } from '../hooks/usePractices';
import { useTheme } from '../context/ThemeContext';

export function PracticesListPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { practices, loading, error } = usePractices(id);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handlePracticeClick = (practiceId: number) => {
    navigate(`/course/${id}/practice/${practiceId}`);
  };

  if (loading) return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900' : 'bg-red-50'} border ${isDark ? 'border-red-700' : 'border-red-200'}`}>
          <p>Error: {error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className={`mb-6 flex items-center transition-colors ${
            isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
          }`}
        >
          ← Назад
        </button>

        <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Практические задания
        </h1>

        {practices?.length === 0 ? (
          <div className={`text-center py-12 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Практические задания пока не добавлены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practices?.map((practice) => (
              <div
                key={practice.id}
                onClick={() => handlePracticeClick(practice.id)}
                className="cursor-pointer group"
              >
                <div className={`relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-80 w-full border ${
                  isDark ? 'border-gray-700 group-hover:border-gray-600' : 'border-gray-200 group-hover:border-gray-300'
                } transform group-hover:scale-105`}>

                  {/* Фоновое изображение практики */}
                  {practice.image && (
                    <div
                      className="absolute inset-0 bg-cover bg-center z-0"
                      style={{ backgroundImage: `url(${practice.image})` }}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-60 group-hover:bg-opacity-50 transition-opacity"></div>
                    </div>
                  )}

                  {/* Если нет изображения, используем цветной фон */}
                  {!practice.image && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 z-0">
                      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity"></div>
                    </div>
                  )}

                  <div className="relative z-10 p-6 text-white h-full flex flex-col justify-between">

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                        {practice.title}
                      </h3>
                      <p className="text-gray-200 mb-4 line-clamp-3">
                        {practice.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Прогресс бар для пройденных практик */}
                      {practice.is_completed && practice.completed_questions !== undefined && practice.total_questions !== undefined && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-green-300">Прогресс:</span>
                            <span className="text-green-300">
                              {practice.completed_questions}/{practice.total_questions}
                            </span>
                          </div>
                          <div className={`w-full bg-gray-600 bg-opacity-50 rounded-full h-2`}>
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(practice.completed_questions / practice.total_questions) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Прогресс для начатых но не завершенных практик */}
                      {!practice.is_completed && practice.completed_questions > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-blue-300">В процессе:</span>
                            <span className="text-blue-300">
                              {practice.completed_questions}/{practice.total_questions}
                            </span>
                          </div>
                          <div className={`w-full bg-gray-600 bg-opacity-50 rounded-full h-2`}>
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(practice.completed_questions / practice.total_questions) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-gray-600 border-opacity-50">
                        <span className="text-sm text-gray-300">
                          {practice.total_questions} вопрос{practice.question_count % 10 === 1 && practice.question_count !== 11 ? '' : 'ов'}
                        </span>

                        {/* Статус прохождения */}
                        {practice.is_completed ? (
                          <span className="text-xs text-green-300 bg-green-900 bg-opacity-50 px-2 py-1 rounded">
                            Завершено
                          </span>
                        ) : practice.completed_questions > 0 ? (
                          <span className="text-xs text-blue-300 bg-blue-900 bg-opacity-50 px-2 py-1 rounded">
                            В процессе
                          </span>
                        ) : (
                          <span className="text-xs text-yellow-300 bg-yellow-900 bg-opacity-50 px-2 py-1 rounded">
                            Не начато
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity z-5"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}