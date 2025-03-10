import { FC, useState } from 'react';
import { Chapter, UserAnswers } from '../types';

interface ModuleQuizProps {
  chapter: Chapter;
  chapterIndex: number;
  validationResults: { [key: string]: boolean };
  onSubmit: (userAnswers: UserAnswers) => void;
}

const ModuleQuiz: FC<ModuleQuizProps> = ({
  chapter,
  chapterIndex,
  validationResults,
  onSubmit,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});

  const handleAnswerChange = (quizKey: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizKey]: answer,
    }));
  };

  const handleSubmit = () => {
    const userAnswers: UserAnswers = {
      userAnswers: chapter.quiz.map((quiz, quizIndex) => {
        const key = `quiz-${chapterIndex}-${quizIndex}`;
        return {
          question: quiz.question,
          userAnswer: selectedAnswers[key],
          correctAnswer: quiz.correctAnswer,
        };
      }),
    };

    console.log('UserAnswers:', userAnswers);
    onSubmit(userAnswers);
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-2">{chapter.title}</h2>
      <p className="mb-4">{chapter.lecture}</p>
      {chapter.quiz.map((quiz, quizIndex) => {
        const quizKey = `quiz-${chapterIndex}-${quizIndex}`;
        return (
          <div key={quizIndex} className="mb-4">
            <h3 className="text-xl font-semibold mb-2">{quiz.question}</h3>
            {quiz.type === 'free-form' ? (
              <input
                type="text"
                value={selectedAnswers[quizKey] || ''}
                onChange={(e) => handleAnswerChange(quizKey, e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              <form>
                {quiz.options.map((option, optionIndex) => {
                  const isSelected = selectedAnswers[quizKey] === option;
                  const isCorrect = validationResults[quizKey];
                  const isWrong = isSelected && isCorrect === false;
                  const isCorrectAnswer =
                    option?.[0]?.toLowerCase() ===
                    quiz.correctAnswer?.[0]?.toLowerCase();

                  return (
                    <div key={optionIndex} className="mb-1">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={quizKey}
                          value={option}
                          className={`form-radio ${
                            isSelected && isWrong ? 'text-red-500' : ''
                          }`}
                          onChange={() => handleAnswerChange(quizKey, option)}
                        />
                        <span
                          className={`ml-2 ${
                            isSelected && isWrong
                              ? 'text-red-500'
                              : isSelected && isCorrectAnswer
                                ? 'text-green-500'
                                : ''
                          }`}
                        >
                          {option}
                        </span>
                      </label>
                    </div>
                  );
                })}
              </form>
            )}
          </div>
        );
      })}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
};

export default ModuleQuiz;
