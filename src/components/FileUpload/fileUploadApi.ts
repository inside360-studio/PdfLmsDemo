import { AxiosError } from 'axios';
import { useMutation, UseMutationOptions } from 'react-query';
import api from '../../utils/api';
import { Course } from '../../features/main/types';

export interface FileUploadResult {
  output: Course;
  [key: string]: unknown;
}

export interface FileUploadParams {
  file: File;
}

export const useFileUpload = (
  options?: UseMutationOptions<FileUploadResult, AxiosError, FileUploadParams>,
) => {
  return useMutation(
    async ({ file }: FileUploadParams): Promise<FileUploadResult> => {
      const formData = new FormData();
      formData.append('file', file);

      const response: FileUploadResult = await api.post('/pdf', formData, {
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
