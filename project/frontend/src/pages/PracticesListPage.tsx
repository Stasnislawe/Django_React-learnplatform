import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { usePractices } from '../hooks/usePractices';
import { Brain } from 'lucide-react';

export function PracticesListPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { practices, loading, error } = usePractices(Number(id));

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Практические задания</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {practices.map((practice) => (
            <button
              key={practice.id}
              onClick={() => navigate(`/course/${id}/practice/${practice.id}`)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
            >
              <div className="flex items-center mb-4">
                <Brain className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold">{practice.title}</h2>
              </div>
              <p className="text-gray-600 mb-4">{practice.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{practice.questions_count} вопросов</span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}