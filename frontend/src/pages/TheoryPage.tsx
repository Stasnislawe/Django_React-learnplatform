import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useTheory } from '../hooks/useTheory';

export function TheoryPage() {
  const { id, theoryId } = useParams<{ id: string; theoryId: string}>();
  const navigate = useNavigate();
  const { theory, loading, error } = useTheory(id, theoryId);
  const [hasNextTheory, setHasNextTheory] = useState(true);
  const [hasPrevTheory, setHasPrevTheory] = useState(false);
  const currentTheoryNum = Number(theoryId);

  // Проверяем существование следующей и предыдущей теории
  useEffect(() => {
    const checkTheories = async () => {
      if (!id || !theoryId) return;

      try {
        // Проверяем следующую теорию
        const nextTheoryId = currentTheoryNum + 1;
        const nextResponse = await fetch(`${API_URL}/courses/False/${id}/theories/${nextTheoryId}`);
        setHasNextTheory(nextResponse.status !== 404);

        // Проверяем предыдущую теорию (только если не первая страница)
        if (currentTheoryNum > 1) {
          const prevTheoryId = currentTheoryNum - 1;
          const prevResponse = await fetch(`${API_URL}/courses/False/${id}/theories/${prevTheoryId}`);
          setHasPrevTheory(prevResponse.status === 200);
        } else {
          setHasPrevTheory(false);
        }
      } catch (err) {
        console.error('Error checking theories:', err);
        setHasNextTheory(false);
        setHasPrevTheory(false);
      }
    };

    checkTheories();
  }, [id, theoryId, currentTheoryNum]);

  const handleNextClick = () => {
    if (hasNextTheory) {
      navigate(`/course/${id}/theories/${currentTheoryNum + 1}`);
    } else {
      navigate(`/course/${id}/practices`);
    }
  };

  const handlePrevClick = () => {
    if (hasPrevTheory) {
      navigate(`/course/${id}/theories/${currentTheoryNum - 1}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!theory) return <div>Theory not found</div>;

  return (
    <div>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">{theory.title_theory}</h1>

        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: theory.text_theory }} />

          <div className="flex justify-between mt-8">
            {hasPrevTheory && (
              <button
                onClick={handlePrevClick}
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Предыдущая теория
              </button>
            )}

            <button
              onClick={handleNextClick}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-auto"
            >
              {hasNextTheory ? 'Следующая теория' : 'Перейти к практике'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}