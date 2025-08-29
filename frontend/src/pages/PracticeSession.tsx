import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuestionCard } from '../components/QuestionCard';
import { QuizResults } from '../components/QuizResults';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { usePracticeDetails } from '../hooks/usePracticeDetails';
import { useTheme } from '../context/ThemeContext';

export function PracticeSession() {
  const { courseId, practiceId } = useParams<{ courseId: string; practiceId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]);

  const numericCourseId = parseInt(courseId || '0');
  const numericPracticeId = parseInt(practiceId || '0');

  const { questions, answers, loading, error } = usePracticeDetails(
    numericCourseId,
    numericPracticeId
  );

  const isDark = theme === 'dark';
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswers = answers.filter(answer =>
    answer.question === currentQuestion?.id
  );

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex >= questions.length) {
      setShowResults(true);
    }
  }, [currentQuestionIndex, questions.length]);

  const handleAnswerSelected = (isCorrect: boolean) => {
      setUserAnswers(prev => [...prev, isCorrect]);

      // Сохраняем прогресс
      const practiceKey = `course-${courseId}-practice-${practiceId}`;
      const practiceProgress = JSON.parse(localStorage.getItem('practiceProgress') || '{}');

      if (!practiceProgress[practiceKey]) {
        practiceProgress[practiceKey] = { completed: 0, total: questions.length };
      }

      practiceProgress[practiceKey].completed = userAnswers.length + 1;
      localStorage.setItem('practiceProgress', JSON.stringify(practiceProgress));

      // Проверяем завершение практики
      if (userAnswers.length + 1 === questions.length && isCorrect) {
        const completedPractices = JSON.parse(localStorage.getItem('completedPractices') || '{}');
        completedPractices[practiceKey] = true;
        localStorage.setItem('completedPractices', JSON.stringify(completedPractices));
      }

      if (isCorrect) {
        setCorrectAnswers(prev => prev + 1);
      }
    };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setUserAnswers([]);
    setShowResults(false);
    window.location.reload();
  };

  const handleBackToPractice = () => {
    navigate(`/course/${courseId}/practices`);
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <LoadingSpinner message="Загрузка вопросов..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
      }`}>
        <div className="max-w-2xl mx-auto p-6">
          <div className={`rounded-lg p-4 ${
            isDark ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'
          } border`}>
            <h3 className={`font-semibold ${
              isDark ? 'text-red-100' : 'text-red-800'
            }`}>Ошибка</h3>
            <p className={isDark ? 'text-red-200' : 'text-red-600'}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <QuizResults
          totalQuestions={questions.length}
          correctAnswers={correctAnswers}
          userAnswers={userAnswers}
          questions={questions}
          onRestart={handleRestart}
          onBackToPractice={handleBackToPractice}
        />
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
      }`}>
        <div className="max-w-2xl mx-auto p-6">
          <p>Вопросы не найдены</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
    }`}>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={handleBackToPractice}
            className={`mb-4 flex items-center transition-colors ${
              isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-800'
            }`}
          >
            ← Назад к практикам
          </button>

          <h1 className="text-2xl font-bold mb-2">
            Практика: Вопрос {currentQuestionIndex + 1} из {questions.length}
          </h1>

          <div className={`w-full rounded-full h-2 ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <QuestionCard
          question={currentQuestion}
          answers={currentAnswers}
          onAnswerSelected={handleAnswerSelected}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
        />
      </div>
    </div>
  );
}