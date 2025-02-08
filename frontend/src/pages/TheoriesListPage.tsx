import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useTheories } from '../hooks/useTheories';
import { Brain, Lock, CheckCircle } from 'lucide-react';

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
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Теоретические материалы</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {theories.map((theory) => {
              const isRead = readParts.includes(theory.theory_id);
              const accessible = isPartAccessible(theory.theory_id);

              return (
                  <div
                    key={theory.theory_id}
                    onClick={() => accessible && navigate(`/course/${id}/theories/${theory.theory_id}`)}
                    className={`z-10 bg-gray-300/80 ${accessible  ? 'cursor-pointer hover:bg-gray-50' : 'opacity-50'} p-6 rounded-lg  shadow-md hover:shadow-lg transition-shadow text-left`}
                  >
                  <Lock className="w-12 h-12 z-20 max-auto text-gray-400" />
                    <div>
                      <img className="bg-cover rounded-lg h-56 pointer-events-none w-full mb-1" src={theory.image_theory} />
                    </div>
                    <div className="flex items-center mb-2">
                      <Brain className="h-6 w-6 text-indigo-600 mr-2" />
                      <h2 className="text-xl font-semibold">{theory.title_theory}</h2>
                    </div>
                    <div>
                        <p className="text-gray-600 mb-4">{theory.about_theory}</p>
                        <div className="flex items-center gap-2">
                          {isRead && <CheckCircle className="w-5 h-5 text-green-500" />}
                          {!accessible && <Lock className="w-12 h-12 text-gray-400" />}
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
