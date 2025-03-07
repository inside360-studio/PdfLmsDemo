import { FC, useState } from 'react';
import FileUpload from '../../components/FileUpload/fileUpload';
import { Course, UserAnswers } from './types';
import { useFeedback } from './mainApi';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { ProblemDetails } from '../../components/ApiValidationErrors';

const MainPage: FC = () => {
  const { t } = useTranslation();
  const [apiValidationErrors, setApiValidationErrors] =
    useState<ProblemDetails | null>(null);
  const [courseData, setCourseData] = useState<Course>({ chapters: [] });
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: string;
  }>({});
  const [validationResults, setValidationResults] = useState<{
    [key: string]: boolean;
  }>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { mutate: getFeedback, isLoading: isFileUploading } = useFeedback({
    onSuccess: (result) => {
      toast.success(t('fileUploaded'));
      setApiValidationErrors(null);
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

  const handleAnswerChange = (quizKey: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizKey]: answer,
    }));
  };

  const handleSubmit = () => {
    const userAnswers: UserAnswers = {
      userAnswers: courseData.chapters.flatMap((chapter, chapterIndex) =>
        chapter.quiz.map((quiz, quizIndex) => {
          const key = `quiz-${chapterIndex}-${quizIndex}`;
          return {
            question: quiz.question,
            userAnswer: selectedAnswers[key],
            correctAnswer: quiz.correctAnswer,
          };
        }),
      ),
    };

    console.log('UserAnswers:', userAnswers);
    getFeedback({ file: uploadedFile as File, userAnswers });

    const results: { [key: string]: boolean } = {};
    courseData.chapters.forEach((chapter, chapterIndex) => {
      chapter.quiz.forEach((quiz, quizIndex) => {
        const quizKey = `quiz-${chapterIndex}-${quizIndex}`;
        const userAnswer = selectedAnswers[quizKey];
        const isCorrect =
          userAnswer?.[0]?.toLowerCase() ===
          quiz.correctAnswer?.[0]?.toLowerCase();
        results[quizKey] = isCorrect;
      });
    });

    setValidationResults(results);
    console.log('Validation results:', results);
  };

  return (
    <div className="w-full p-4">
      <div className="w-full mb-4">
        <FileUpload onUpdate={handleUpdate}></FileUpload>
      </div>
      {courseData.chapters.slice(0, 1).map((chapter, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{chapter.title}</h2>
          <p className="mb-4">{chapter.lecture}</p>
          {chapter.quiz.map((quiz, quizIndex) => {
            const quizKey = `quiz-${index}-${quizIndex}`;
            return (
              <div key={quizIndex} className="mb-4">
                <h3 className="text-xl font-semibold mb-2">{quiz.question}</h3>
                {quiz.type === 'free-form' ? (
                  <input
                    type="text"
                    value={selectedAnswers[quizKey] || ''}
                    onChange={(e) =>
                      handleAnswerChange(quizKey, e.target.value)
                    }
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
                              onChange={() =>
                                handleAnswerChange(quizKey, option)
                              }
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
        </div>
      ))}
      {courseData.chapters.length > 0 && (
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default MainPage;
