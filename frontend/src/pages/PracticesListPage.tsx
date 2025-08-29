import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { usePractices } from '../hooks/usePractices';

export function PracticesListPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { practices, loading, error } = usePractices(id);

  const handlePracticeClick = (practiceId: number) => {
    navigate(`/course/${id}/practice/${practiceId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Практические задания</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {practices?.map((practice) => (
            <div
              key={practice.id}
              onClick={() => handlePracticeClick(practice.id)}
              className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow h-80 w-full">
                {/* Фоновое изображение практики */}
                {practice.image && (
                  <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: `url(${practice.image})` }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                  </div>
                )}

                {/* Если нет изображения, используем цветной фон */}
                {!practice.image && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 z-0">
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  </div>
                )}

                <div className="relative z-10 p-6 text-white h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                      {practice.title}
                    </h3>
                    <p className="text-gray-200 mb-4 line-clamp-3">
                      {practice.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">
                        Вопросов: {practice.questions_count}
                      </span>
                    </div>

                    {practice.estimated_time && (
                      <span className="text-sm text-gray-300">
                        ⏱️ {practice.estimated_time}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}