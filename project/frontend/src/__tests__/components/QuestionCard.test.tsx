import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuestionCard } from '../../components/QuestionCard';

describe('QuestionCard', () => {
  const mockQuestion = {
    id: 1,
    question: "Test Question?",
    answer: "Correct Answer",
    just_resp: "This is the explanation"
  };

  const mockAnswers = [
    { id: 1, question_str: "Correct Answer", question: 1 },
    { id: 2, question_str: "Wrong Answer", question: 1 }
  ];

  const mockOnNextQuestion = vi.fn();

  it('renders question and answers', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        answers={mockAnswers}
        onNextQuestion={mockOnNextQuestion}
        isLastQuestion={false}
      />
    );

    expect(screen.getByText("Test Question?")).toBeInTheDocument();
    expect(screen.getByText("Correct Answer")).toBeInTheDocument();
    expect(screen.getByText("Wrong Answer")).toBeInTheDocument();
  });

  it('shows explanation and next button after correct answer', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        answers={mockAnswers}
        onNextQuestion={mockOnNextQuestion}
        isLastQuestion={false}
      />
    );

    fireEvent.click(screen.getByText("Correct Answer"));
    expect(screen.getByText("This is the explanation")).toBeInTheDocument();
    expect(screen.getByText("Следующий вопрос")).toBeInTheDocument();
  });

  it('shows different button text on last question', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        answers={mockAnswers}
        onNextQuestion={mockOnNextQuestion}
        isLastQuestion={true}
      />
    );

    fireEvent.click(screen.getByText("Correct Answer"));
    expect(screen.getByText("Завершить практику")).toBeInTheDocument();
  });
});