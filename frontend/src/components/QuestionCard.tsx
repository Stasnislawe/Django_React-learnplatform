import React, { useState, useEffect } from 'react';
import type { Question, Answer } from '../types';
import { useTheme } from '../context/ThemeContext'; // Используем ваш контекст

interface QuestionCardProps {
  question: Question;
  answers: Answer[];
  onAnswerSelected: (isCorrect: boolean) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
  showResults?: boolean;
}

export function QuestionCard({
  question,
  answers,
  onAnswerSelected,
  onNextQuestion,
  isLastQuestion,
  showResults = false
}: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const { theme } = useTheme(); // Используем ваш контекст

  const isDark = theme === 'dark';

  useEffect(() => {
    setSelectedAnswer(null);
    setHasAnswered(false);
  }, [question.id]);

  const handleAnswerClick = (answer: Answer) => {
    if (hasAnswered) return;

    setSelectedAnswer(answer);
    setHasAnswered(true);

    const isCorrect = answer.question_str === question.answer;
    onAnswerSelected(isCorrect);
  };

  // Стили для светлой и темной темы
  const cardStyles = isDark
    ? 'bg-gray-800 text-white shadow-lg'
    : 'bg-white text-gray-800 shadow-md';

  const answerBaseStyles = isDark
    ? 'border-gray-600 text-white'
    : 'border-gray-200 text-gray-800';

  const answerHoverStyles = isDark && !hasAnswered
    ? 'hover:bg-gray-700 hover:border-gray-500'
    : !hasAnswered
    ? 'hover:bg-gray-50 hover:border-gray-300'
    : '';

  const getAnswerClass = (answer: Answer) => {
    if (!hasAnswered) {
      return `${answerBaseStyles} ${answerHoverStyles}`;
    }

    if (answer.question_str === question.answer) {
      return isDark
        ? 'bg-green-900 border-green-600 text-green-100'
        : 'bg-green-50 border-green-500 text-green-800';
    }

    if (answer === selectedAnswer && answer.question_str !== question.answer) {
      return isDark
        ? 'bg-red-900 border-red-600 text-red-100'
        : 'bg-red-50 border-red-500 text-red-800';
    }

    return isDark
      ? 'border-gray-600 text-gray-400 opacity-70'
      : 'border-gray-200 text-gray-500 opacity-70';
  };

  const explanationStyles = isDark
    ? 'bg-blue-900 border-blue-700 text-blue-100'
    : 'bg-blue-50 border-blue-200 text-blue-800';

  const buttonStyles = isDark
    ? 'bg-indigo-700 hover:bg-indigo-600 text-white'
    : 'bg-indigo-600 hover:bg-indigo-700 text-white';

  return (
    <div className={`rounded-lg p-6 max-w-2xl mx-auto transition-colors duration-200 ${cardStyles}`}>
      <h3 className="text-xl font-semibold mb-4">
        {question.question}
      </h3>

      {question.image_question && (
        <img
          src={question.image_question}
          alt="Question illustration"
          className="w-full h-48 object-contain rounded-lg mb-4"
        />
      )}

      <div className="space-y-3 mb-6">
        {answers.map((answer) => (
          <button
            key={answer.id}
            onClick={() => handleAnswerClick(answer)}
            disabled={hasAnswered}
            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${getAnswerClass(answer)} ${
              !hasAnswered ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            {answer.question_str}
          </button>
        ))}
      </div>

      {hasAnswered && (
        <div className="space-y-4">
          <div className={`p-4 border rounded-lg ${explanationStyles}`}>
            <h4 className="font-semibold mb-2">Объяснение:</h4>
            <p>{question.just_resp}</p>
          </div>

          <button
            onClick={onNextQuestion}
            className={`w-full py-3 px-6 rounded-lg transition-colors font-semibold ${buttonStyles}`}
          >
            {isLastQuestion ? 'Завершить практику' : 'Следующий вопрос'}
          </button>
        </div>
      )}
    </div>
  );
}