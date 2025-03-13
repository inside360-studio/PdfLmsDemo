import { FC, useState } from 'react';
import FileUpload from '../../components/FileUpload/fileUpload';
import { Course, UserAnswers } from './types';
import { FeedbackResponse, useFeedback } from './mainApi';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import ModuleQuiz from './components/ModuleQuiz';
import Feedback from './components/Feedback';
import Chat from '../../components/Chat/Chat';

const MainPage: FC = () => {
  const { t } = useTranslation();

  const [courseData, setCourseData] = useState<Course>({ chapters: [] });
  const [validationResults] = useState<{
    [key: string]: boolean;
  }>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [quizUserAnswers, setQuizUserAnswers] = useState<UserAnswers | null>(
    null,
  );

  const { mutate: getFeedback } = useFeedback({
    onSuccess: (result: FeedbackResponse) => {
      toast.success(t('fileUploaded'));
      // Cast result to any to handle possible structure differences
      const feedbackData = result as unknown as { output?: FeedbackResponse };
      setFeedback(feedbackData.output || result);
    },
    onError: (e: AxiosError) => {
      if (e.response) {
        console.log('Error response:', e.response.data);
      }
    },
  });

  // Define a type for the file upload result
  interface FileUploadResult {
    output: Course;
    [key: string]: unknown;
  }

  const handleUpdate = (result?: FileUploadResult, file?: File) => {
    if (result) {
      console.log('File upload result:', result);
      const courseData = result.output as Course;
      setCourseData(courseData);
      console.log(courseData);
    }
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleModuleQuizSubmit = (userAnswers: UserAnswers) => {
    setQuizUserAnswers(userAnswers);
    getFeedback({ file: uploadedFile as File, userAnswers: userAnswers });
  };

  return (
    <div className={`min-h-screen bg-gray-50 `}>
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 shadow-lg">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl font-bold">Learning System</h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto my-8 p-6">
        <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">File Upload</h2>
            <p className="text-sm text-gray-600">
              Upload a PDF to start learning
            </p>
          </div>
          <div className="p-6">
            <FileUpload onUpdate={handleUpdate} />
          </div>
        </div>

        {courseData.chapters.slice(0, 1).map((chapter, index) => (
          <ModuleQuiz
            key={index}
            chapter={chapter}
            chapterIndex={index}
            validationResults={validationResults}
            onSubmit={handleModuleQuizSubmit}
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
