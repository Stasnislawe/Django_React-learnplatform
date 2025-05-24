import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useTheories } from '../hooks/useTheories';
import { Brain, Lock, CheckCircle, ArrowLeft } from 'lucide-react';

export function TheoriesListPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theories, loading, error, readParts } = useTheories(Number(id));

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

//   const isTheoryAccessible = (theoryId: number) => {
//     if (theoryId === 1) return true;
//     return readTheories.includes((theoryId - 1).toString());
//   };
    const isPartAccessible = (partNumber: number) => {
    // First part is always accessible
    if (partNumber === 1) return true;
    // Check if previous part has been read
    return readParts.includes((partNumber - 1).toString());
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between">
            <h1 className="text-3xl font-bold mb-8">Теоретические материалы</h1>
            <button className="flex items-center"
              onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
              Назад
            </button>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {theories.map((theory) => {
              const isRead = readParts.includes(theory.theory_id);
              const accessible = isPartAccessible(theory.theory_id);

              return (
                  <div
                    key={theory.theory_id}
                    onClick={() => accessible && navigate(`/course/${id}/theories/${theory.theory_id}`)}
                    className={`
                      relative aspect-square rounded-xl overflow-hidden shadow-lg
                      ${accessible ? 'cursor-pointer transform hover:scale-105 transition-transform' : 'cursor-not-allowed'}
                    `}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={theory.image_theory}
                        alt={theory.title_theory}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                    </div>

                    {/* Blur Overlay for Locked Parts */}
                    {!accessible && (
                      <div className="absolute inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center">
                        <Lock className="w-40 h-40 text-white/80" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-bold text-white">
                          Урок {theory.theory_id}
                        </h2>
                        {isRead && (
                          <div className="bg-green-500/90 rounded-full p-1">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>

                      <div>
                        {accessible && (
                            <h3 className="text-lg font-medium text-white mb-2">
                          {theory.title_theory}
                        </h3>
                        )}
                        {accessible && (
                          <p className="text-gray-200 text-sm line-clamp-3">
                            {theory.text_theory}
                          </p>
                        )}
                        {!accessible && (
                          <p className="text-gray-200 flex justify-center text-sm line-clamp-3">Прочтите предыдущую теорию</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </main>
    </div>
  );
}

