import { FC, useState } from 'react';
import FileUpload from '../../components/FileUpload/fileUpload';
import { Course, UserAnswers } from './types';
import { FeedbackResponse, useFeedback } from './mainApi';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { ProblemDetails } from '../../components/ApiValidationErrors';
import ModuleQuiz from './components/ModuleQuiz';
import Feedback from './components/Feedback';

const MainPage: FC = () => {
  const { t } = useTranslation();
  const [apiValidationErrors, setApiValidationErrors] =
    useState<ProblemDetails | null>(null);
  const [courseData, setCourseData] = useState<Course>({ chapters: [] });
  const [validationResults, setValidationResults] = useState<{
    [key: string]: boolean;
  }>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);

  const { mutate: getFeedback, isLoading: isFileUploading } = useFeedback({
    onSuccess: (result: any) => {
      toast.success(t('fileUploaded'));
      setApiValidationErrors(null);
      debugger;
      setFeedback(result.output);
    },
    onError: (e: any) => {
      if (e.response) {
        setApiValidationErrors(e.response.data as ProblemDetails);
      }
    },
  });

  const handleUpdate = (result?: any, file?: File) => {
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
    getFeedback({ file: uploadedFile as File, userAnswers: userAnswers });
  };

  return (
    <div className="w-full p-4">
      <div className="w-full mb-4">
        <FileUpload onUpdate={handleUpdate}></FileUpload>
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
    </div>
  );
};

export default MainPage;
