import { AxiosError } from 'axios';
import axios from 'axios';
import { useMutation, UseMutationOptions, useQuery } from 'react-query';
import api from '../../utils/api';
import { Course, Chapter, UserAnswers } from './types';

interface Quiz {
  type: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export const useFeedback = (
  options?: UseMutationOptions<
    FeedbackResponse,
    AxiosError,
    { userAnswers: UserAnswers }
  >,
) => {
  return useMutation(
    async ({
      userAnswers,
    }: {
      userAnswers: UserAnswers;
    }): Promise<FeedbackResponse> => {
      const response: FeedbackResponse = await api.post(
        '/feedback',
        userAnswers,
      );

      return response;
    },
    {
      ...options,
    },
  );
};

export interface FeedbackItem {
  question: string;
  userAnswer: string;
  isCorrect: boolean;
  feedback: string;
}

export interface FeedbackResponse {
  feedback: FeedbackItem[];
}

// Function to transform API response to Course format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformApiResponseToCourse(apiData: any): Course {
  const courseItem = apiData.list[0];
  if (!courseItem) return { chapters: [] };

  // Create quiz items from questions and answers
  const quizItems: Quiz[] = [];

  for (let i = 1; i <= 4; i++) {
    const question = courseItem[`Frage ${i}`];
    const answer = courseItem[`Antwort ${i}`];
    const questionType = courseItem[`Frage-Typ ${i}`];

    if (question && question.trim() !== '') {
      const quizItem: {
        type: string;
        question: string;
        correctAnswer: string;
        options: string[];
      } = {
        type: questionType || 'free-form',
        question,
        correctAnswer: answer || '',
        options: [],
      };

      // Use provided options from the API response
      if (questionType === 'multiple-choice') {
        const optionsStr = courseItem[`Optionen ${i}`];
        if (optionsStr) {
          try {
            quizItem.options = JSON.parse(optionsStr);
          } catch (e) {
            console.error(`Failed to parse options for question ${i}:`, e);
            // Fallback to a default set of options if parsing fails
            quizItem.options = [answer || ''];
            if (answer) {
              quizItem.options.push(
                'Keine der Antworten ist richtig',
                'Alle der oben genannten',
                'Nicht spezifiziert in der Dokumentation',
              );
            }
          }
        } else if (answer) {
          // Fallback if no options are provided
          quizItem.options = [answer];
          quizItem.options.push(
            'Keine der Antworten ist richtig',
            'Alle der oben genannten',
            'Nicht spezifiziert in der Dokumentation',
          );
        }
      }

      quizItems.push(quizItem);
    }
  }

  const chapter: Chapter = {
    title: courseItem['Kapitel-Titel'] || 'Default Chapter Title',
    lecture:
      courseItem['Kapitel-Text'] ||
      courseItem['Lernziel'] ||
      'No lecture content available.',
    quiz: quizItems,
  };

  return { chapters: [chapter] };
}

export const useFetchCourseData = () => {
  return useQuery<Course>(['courseData'], async (): Promise<Course> => {
    const response = await axios.get(
      'https://data.inside360.studio/api/v2/tables/mh5ppxtugwhzi49/records?limit=1&shuffle=0&offset=0',
      {
        headers: {
          accept: 'application/json',
          'xc-token': 'W7BaGY7m1D5EtAR4U3HqzrieZOomqNYe_dBIZyza',
        },
      },
    );

    return transformApiResponseToCourse(response.data);
  });
};
