import { AxiosError } from 'axios';
import { useMutation, UseMutationOptions } from 'react-query';
import api from '../../utils/api';
import { UserAnswers } from './types';

export const useFeedback = (
  options?: UseMutationOptions<
    FeedbackResponse,
    AxiosError,
    { file: File; userAnswers: UserAnswers }
  >,
) => {
  return useMutation(
    async ({
      file,
      userAnswers,
    }: {
      file: File;
      userAnswers: UserAnswers;
    }): Promise<FeedbackResponse> => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userAnswers', JSON.stringify(userAnswers));

      const response: FeedbackResponse = await api.post('/feedback', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
