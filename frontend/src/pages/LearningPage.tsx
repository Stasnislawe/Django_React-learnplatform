import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ArrowRight } from 'lucide-react';
import { useCourse } from '../hooks/useCourse';

export function LearningPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { course, loading, error } = useCourse(Number(id));

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!course) return <div>Course not found</div>;

  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">{course.theory_1}</h1>

        <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: course.first_text_theory }} />
              <button
                onClick={() => navigate(`/course/${id}/learn2`)}
                className="mt-8 inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Перейти ко второй части
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
        </div>
      </main>
    </div>
  );
}