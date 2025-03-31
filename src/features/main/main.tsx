import { FC, useState, useEffect } from 'react';
import { Course, UserAnswers } from './types';
import { FeedbackResponse, useFeedback, useFetchCourseData } from './mainApi';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import ModuleQuiz from './components/ModuleQuiz';
import Feedback from './components/Feedback';
import Chat from '../../components/Chat/Chat';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../components/LanguageSelector/LanguageSelector';
import Spinner from '../../components/Spinner/Spinner';

const MainPage: FC = () => {
  const { t } = useTranslation();
  const [courseData, setCourseData] = useState<Course>({ chapters: [] });
  const [validationResults] = useState<{
    [key: string]: boolean;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [quizUserAnswers, setQuizUserAnswers] = useState<UserAnswers | null>(
    null,
  );

  // Fetch course data using the API
  const { data, isLoading, error: fetchError } = useFetchCourseData();

  // Set course data when API returns results
  useEffect(() => {
    if (data) {
      setCourseData(data);
    }
    if (fetchError) {
      setError(t('api.fetchError'));
      toast.error(t('api.fetchError'));
    }
  }, [data, fetchError, t]);

  const { mutate: getFeedback, isLoading: isSubmitting } = useFeedback({
    onSuccess: (result: FeedbackResponse) => {
      toast.success(t('feedbackReceived'));
      // Cast result to any to handle possible structure differences
      const feedbackData = result as unknown as { output?: FeedbackResponse };
      setFeedback(feedbackData.output || result);
    },
    onError: (e: AxiosError) => {
      if (e.response) {
        console.log('Error response:', e.response.data);
      }
      toast.error(t('fileUpload.error'));
    },
  });

  const handleModuleQuizSubmit = (userAnswers: UserAnswers) => {
    setQuizUserAnswers(userAnswers);
    getFeedback({ userAnswers });
  };

  return (
    <div className={`min-h-screen bg-gray-50 `}>
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('main.title')}</h1>
          <LanguageSelector />
        </div>
      </header>

      <div className="max-w-5xl mx-auto my-8 p-6">
        <>
          {isLoading && (
            <div className="flex justify-center items-center p-12">
              <Spinner />
            </div>
          )}
          {error && (
            <div className="text-center p-12 text-red-500">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {t('common.reload')}
              </button>
            </div>
          )}
        </>

        {courseData.chapters.slice(0, 1).map((chapter, index) => (
          <ModuleQuiz
            key={index}
            chapter={chapter}
            chapterIndex={index}
            validationResults={validationResults}
            onSubmit={handleModuleQuizSubmit}
            isSubmitting={isSubmitting}
          />
        ))}

        {feedback && <Feedback feedbackData={feedback} />}
        {feedback && (
          <Chat userAnswers={quizUserAnswers} feedbackData={feedback} />
        )}
      </div>
    </div>
  );
};

export default MainPage;
