export interface Course {
  id: number;
  title_theory: string;
  image_title: string;
  about: string;
  free: boolean;
}

export Theories {
  id: number;
  title_theory: string;
  text_theory: string;
  image_theory: string;
  about_theory: string;
  course_id: number;
  theory_id: number;
}

export interface Practice {
  id: number;
  title: string;
  description: string;
  question_count: number;
  course_id: number;
  image: string;
}

export interface Question {
  id: number;
  question: string;
  image_question?: string;
  answer: string;
  just_resp: string;
}

export interface Answer {
  id: number;
  question_str: string;
  question: number;
}

export interface UserProgress {
  completedTheories: number[];
  completedPractices: number[];
  correctAnswersRate: number;
}