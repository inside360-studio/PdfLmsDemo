import { AxiosError } from 'axios';
import { useMutation, UseMutationOptions } from 'react-query';
import api from '../../utils/api';

export interface UploadAvatarResponse {
  id: string;
  fileUrl: string;
}
export const useFileUpload = (
  options?: UseMutationOptions<UploadAvatarResponse, AxiosError, File>,
) => {
  return useMutation(
    async (file: File): Promise<UploadAvatarResponse> => {
      const formData = new FormData();
      formData.append('file', file);

      const response: UploadAvatarResponse = await api.post('/pdf', formData, {
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
