import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ArrowRight } from 'lucide-react';
import { useTheory } from '../hooks/useTheory';
import { CourseNavigator } from '../api/theory_navigator';

export function TheoryPage() {
  const { id, theoryId } = useParams<{ id: string; theoryId: string}>();
  const navigate = useNavigate();
  const { theory, loading, error } = useTheory(id, theoryId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!theory) return <div>Theory not found</div>;

  return (
    <div>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">{theory.title_theory}</h1>

        <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: theory.text_theory }} />
              <button
              onClick={() => navigate(`/course/${id}/theories/${Number(theoryId) + 1}`)}
              className="mt-8 inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Перейти к следующей теории
              <ArrowRight className="w-5 h-5" />
            </button>

        </div>
      </main>
    </div>
  );
}
