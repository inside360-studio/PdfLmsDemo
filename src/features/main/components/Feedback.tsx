import { FC } from 'react';
import { FeedbackResponse } from '../mainApi';
import { useTranslation } from 'react-i18next';

interface FeedbackProps {
  feedbackData: FeedbackResponse;
}

const Feedback: FC<FeedbackProps> = ({ feedbackData }) => {
  const { t } = useTranslation();
  // Calculate score
  const totalQuestions = feedbackData.feedback.length;
  const correctAnswers = feedbackData.feedback.filter(
    (item) => item.isCorrect,
  ).length;
  const scorePercentage =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      {/* Feedback Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h1 className="text-2xl font-bold text-white flex items-center">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          {t('feedback.results')}
        </h1>
      </div>

      {/* Score Summary */}
      <div className="bg-indigo-50 p-6 border-b border-indigo-100">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold text-gray-800">
              {t('feedback.yourPerformance')}
            </h2>
            <p className="text-gray-600">
              {t('feedback.answeredCorrectly', {
                correctAnswers,
                totalQuestions,
              })}
            </p>
          </div>
          <div className="flex items-center">
            <div
              className={`text-3xl font-bold ${
                scorePercentage >= 70
                  ? 'text-green-600'
                  : scorePercentage >= 50
                    ? 'text-yellow-600'
                    : 'text-red-600'
              }`}
            >
              {scorePercentage}%
            </div>
            <div
              className={`ml-4 w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                scorePercentage >= 70
                  ? 'border-green-500 bg-green-100 text-green-700'
                  : scorePercentage >= 50
                    ? 'border-yellow-500 bg-yellow-100 text-yellow-700'
                    : 'border-red-500 bg-red-100 text-red-700'
              }`}
            >
              {scorePercentage >= 70 ? (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              ) : scorePercentage >= 50 ? (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Feedback */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {t('feedback.questionFeedback')}
        </h2>

        <div className="space-y-6">
          {feedbackData.feedback.map((item, index) => (
            <div
              key={index}
              className={`p-5 rounded-lg border ${
                item.isCorrect
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start mb-3">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    item.isCorrect
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {item.isCorrect ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.question}
                </h3>
              </div>

              <div className="ml-11">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    {t('feedback.yourAnswer')}
                  </span>
                  <div
                    className={`mt-1 font-medium ${
                      item.isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {item.userAnswer || (
                      <span className="italic text-gray-500">
                        {t('feedback.noAnswer')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white p-4 rounded border border-gray-200 mt-3">
                  <span className="text-sm font-medium text-gray-500">
                    {t('feedback.feedback')}
                  </span>
                  <p className="mt-1 text-gray-800">{item.feedback}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
