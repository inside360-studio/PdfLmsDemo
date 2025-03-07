// Course
interface Quiz {
  type: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface Chapter {
  title: string;
  lecture: string;
  quiz: Quiz[];
}

export interface Course {
  chapters: Chapter[];
}

// Answers
interface UserAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
}

export interface UserAnswers {
  userAnswers: UserAnswer[];
}
