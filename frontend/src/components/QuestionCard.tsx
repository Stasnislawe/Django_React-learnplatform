import React, { useState, useEffect } from 'react';
import type { Question, Answer } from '../types';

interface QuestionCardProps {
  question: Question;
  answers: Answer[];
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export function QuestionCard({ 
  question, 
  answers, 
  onNextQuestion,
  isLastQuestion 
}: QuestionCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  
  // Reset state when question changes
  useEffect(() => {
    setShowExplanation(false);
    setSelectedAnswer(null);
  }, [question.id]);
  
  const handleAnswerClick = (answer: Answer) => {
    if (selectedAnswer) return; // Prevent multiple selections
    setSelectedAnswer(answer);
    
    if (answer.question_str === question.answer) {
      setShowExplanation(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
      
      {question.image_question && (
        <img 
          src={question.image_question} 
          alt="Question illustration" 
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
      
      <div className="space-y-3">
        {answers.map((answer) => (
          <button
            key={answer.id}
            onClick={() => handleAnswerClick(answer)}
            disabled={selectedAnswer !== null}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              selectedAnswer === answer
                ? answer.question_str === question.answer
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            {answer.question_str}
          </button>
        ))}
      </div>
      
      {showExplanation && (
        <div className="mt-4">
          <div className="p-4 bg-green-50 rounded-lg mb-4">
            <p className="text-green-800">{question.just_resp}</p>
          </div>
          
          <button
            onClick={onNextQuestion}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {isLastQuestion ? 'Завершить практику' : 'Следующий вопрос'}
          </button>
        </div>
      )}
    </div>
  );
}