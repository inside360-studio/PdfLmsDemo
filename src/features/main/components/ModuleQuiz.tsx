import { FC, useState, useRef, useEffect } from 'react';
import { Chapter, UserAnswers } from '../types';
import toast from 'react-hot-toast';
import CustomButton from '../../../components/CustomButton';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

interface ModuleQuizProps {
  chapter: Chapter;
  chapterIndex: number;
  validationResults: { [key: string]: boolean };
  onSubmit: (userAnswers: UserAnswers) => void;
  isSubmitting: boolean;
}

const ModuleQuiz: FC<ModuleQuizProps> = ({
  chapter,
  chapterIndex,
  validationResults,
  onSubmit,
  isSubmitting,
}) => {
  const { t } = useTranslation();
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const firstErrorRef = useRef<HTMLDivElement>(null);

  const handleAnswerChange = (quizKey: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizKey]: answer,
    }));

    // Remove this question from validation errors if it was previously marked
    if (formSubmitted) {
      setValidationErrors((prev) => prev.filter((key) => key !== quizKey));
    }
  };

  // Check if all questions are answered
  const validateForm = () => {
    const unansweredQuestions = chapter.quiz
      .map((_, quizIndex) => `quiz-${chapterIndex}-${quizIndex}`)
      .filter(
        (key) => !selectedAnswers[key] || selectedAnswers[key].trim() === '',
      );

    setValidationErrors(unansweredQuestions);
    return unansweredQuestions.length === 0;
  };

  // Scroll to first error when validation errors change
  useEffect(() => {
    if (validationErrors.length > 0 && firstErrorRef.current) {
      firstErrorRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [validationErrors]);

  const handleSubmit = () => {
    setFormSubmitted(true);

    if (validateForm()) {
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
    } else {
      // Validation failed - the useEffect will scroll to the first error
      toast.error(t('quiz.required'));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      {/* Chapter Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white">{chapter.title}</h2>
      </div>

      {/* Chapter Content */}
      <div className="p-6">
        {/* Lecture Section */}
        <div className="mb-8 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-lg font-medium text-blue-800 mb-2">
            {t('quiz.moduleContent')}
          </h3>
          <div className="prose prose-lg max-w-none text-gray-800">
            <ReactMarkdown>{chapter.lecture}</ReactMarkdown>
          </div>
        </div>

        {/* Quiz Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
            {t('quiz.questions')}
          </h3>

          {chapter.quiz.map((quiz, quizIndex) => {
            const quizKey = `quiz-${chapterIndex}-${quizIndex}`;
            const isError = validationErrors.includes(quizKey);

            // Set ref for the first error element to enable scrolling
            const ref =
              isError && validationErrors[0] === quizKey ? firstErrorRef : null;

            return (
              <div
                key={quizIndex}
                ref={ref}
                className={`bg-white p-5 rounded-lg border ${
                  isError && formSubmitted
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200'
                } shadow-sm transition-all duration-200 hover:shadow-md`}
              >
                <div className="flex items-start mb-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold mr-3">
                    {quizIndex + 1}
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {quiz.question}
                      </h3>
                      <span className="ml-2 text-red-500 font-medium text-sm">
                        *
                      </span>
                    </div>
                    {isError && formSubmitted && (
                      <p className="text-red-500 text-sm mt-1">
                        {t('quiz.required')}
                      </p>
                    )}
                  </div>
                </div>

                {quiz.type.toLowerCase() === 'free-form' ||
                quiz.type.toLowerCase() === 'freeform' ||
                quiz.type.toLowerCase() === 'free_form' ? (
                  <div className="ml-11">
                    <input
                      type="text"
                      value={selectedAnswers[quizKey] || ''}
                      onChange={(e) =>
                        handleAnswerChange(quizKey, e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder={t('quiz.typeAnswer')}
                    />
                  </div>
                ) : (
                  <div className="ml-11 space-y-2">
                    {quiz.options.map((option, optionIndex) => {
                      const isSelected = selectedAnswers[quizKey] === option;
                      const isCorrect = validationResults[quizKey];
                      const isWrong = isSelected && isCorrect === false;
                      const isCorrectAnswer =
                        option?.[0]?.toLowerCase() ===
                        quiz.correctAnswer?.[0]?.toLowerCase();

                      return (
                        <label
                          key={optionIndex}
                          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                            ${isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}
                            ${isSelected && isWrong ? 'bg-red-50 border-red-200' : ''}
                            ${isSelected && isCorrectAnswer && isCorrect !== false ? 'bg-green-50 border-green-200' : ''}
                          `}
                        >
                          <div className="relative flex items-center">
                            <input
                              type="radio"
                              name={quizKey}
                              value={option}
                              checked={isSelected}
                              onChange={() =>
                                handleAnswerChange(quizKey, option)
                              }
                              className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                            />
                            <span
                              className={`ml-3 font-medium
                                ${isSelected && isWrong ? 'text-red-600' : ''}
                                ${isSelected && isCorrectAnswer && isCorrect !== false ? 'text-green-600' : 'text-gray-700'}
                              `}
                            >
                              {option}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <CustomButton
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="px-6 py-3 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 ease-in-out shadow-sm hover:shadow-md disabled:from-blue-200 disabled:to-blue-300 disabled:text-white disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span>
                {isSubmitting ? t('quiz.submitting') : t('quiz.submitAnswers')}
              </span>
            </div>
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default ModuleQuiz;
