import { AxiosError } from 'axios';
import { useMutation, UseMutationOptions } from 'react-query';
import api from '../../utils/api';

export interface ChatFileUploadResponse {
  success: boolean;
  message?: string;
}

export const useChatFileUpload = (
  options?: UseMutationOptions<ChatFileUploadResponse, AxiosError, File>,
) => {
  return useMutation(
    async (file: File): Promise<ChatFileUploadResponse> => {
      // Create form data with the file
      const formData = new FormData();
      formData.append('data', file);

      // Use the file upload endpoint
      // We're using the API directly without additional path since
      // VITE_APP_API_SERVER_URL already contains the full webhook URL
      const response: ChatFileUploadResponse = await api.post(
        '/01d19f57-2cc5-494f-abe5-6cebfa95e753', // Empty string as we're using the base URL directly
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return response;
    },
    {
      ...options,
    },
  );
};
