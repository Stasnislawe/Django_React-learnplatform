import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PracticePage } from '../../pages/PracticePage';
import { usePracticeDetails } from '../../hooks/usePracticeDetails';

// Mock the custom hook
vi.mock('../../hooks/usePracticeDetails');

describe('PracticePage', () => {
  it('shows loading state', () => {
    vi.mocked(usePracticeDetails).mockReturnValue({
      questions: [],
      answers: [],
      loading: true,
      error: null
    });

    render(
      <MemoryRouter initialEntries={['/course/1/practice/1']}>
        <Routes>
          <Route path="/course/:id/practice/:practiceId" element={<PracticePage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message', () => {
    vi.mocked(usePracticeDetails).mockReturnValue({
      questions: [],
      answers: [],
      loading: false,
      error: 'Failed to load practice'
    });

    render(
      <MemoryRouter initialEntries={['/course/1/practice/1']}>
        <Routes>
          <Route path="/course/:id/practice/:practiceId" element={<PracticePage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Failed to load practice')).toBeInTheDocument();
  });

  it('renders practice questions when loaded', () => {
    vi.mocked(usePracticeDetails).mockReturnValue({
      questions: [
        { id: 1, question: "Test Question", answer: "Correct Answer", just_resp: "Explanation" }
      ],
      answers: [
        { id: 1, question_str: "Correct Answer", question: 1 },
        { id: 2, question_str: "Wrong Answer", question: 1 }
      ],
      loading: false,
      error: null
    });

    render(
      <MemoryRouter initialEntries={['/course/1/practice/1']}>
        <Routes>
          <Route path="/course/:id/practice/:practiceId" element={<PracticePage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Test Question')).toBeInTheDocument();
    expect(screen.getByText('Вопрос 1 из 1')).toBeInTheDocument();
  });
});