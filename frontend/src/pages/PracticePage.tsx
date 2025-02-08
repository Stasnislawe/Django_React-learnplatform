import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { QuestionCard } from '../components/QuestionCard';
import { usePracticeDetails } from '../hooks/usePracticeDetails';

export function PracticePage() {
  const { id, practiceId } = useParams();
  const navigate = useNavigate();
  const { questions, answers, loading, error } = usePracticeDetails(Number(id), Number(practiceId));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!questions.length) return <ErrorMessage message="No practice questions available" />;

  const currentQuestion = questions[currentQuestionIndex];
  const questionAnswers = answers.filter(a => a.question === currentQuestion.id);
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      navigate(`/course/${id}/practices`);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Практика</h1>
        <div className="mb-4">
          Вопрос {currentQuestionIndex + 1} из {questions.length}
        </div>

        <QuestionCard
          question={currentQuestion}
          answers={questionAnswers}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={isLastQuestion}
        />
      </main>
    </div>
  );
}