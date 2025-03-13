import { FC, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import ApiValidationErrors, { ProblemDetails } from '../ApiValidationErrors';
import Spinner from '../Spinner/Spinner';
import CustomButton from '../CustomButton';
import { useFileUpload, FileUploadResult } from './fileUploadApi';

interface FileUploadProps {
  onUpdate: (result?: FileUploadResult, file?: File) => void;
}

const FileUpload: FC<FileUploadProps> = ({ onUpdate }) => {
  const { t } = useTranslation();
  const [apiValidationErrors, setApiValidationErrors] =
    useState<ProblemDetails | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: uploadFile, isLoading: isFileUploading } = useFileUpload({
    onSuccess: (result) => {
      toast.success(t('fileUpload.success'));
      setApiValidationErrors(null);
      onUpdate(result, file || undefined);
    },
    onError: () => {
      toast.error(t('fileUpload.error'));
    },
  });

  useEffect(() => {
    if (isFileUploading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [isFileUploading]);

  const onDropFile = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (file.size > 100 * 1024 * 1024) {
          toast.error(t('fileSizeExceedsLimit', { limit: '100MB' }));
          return;
        }

        setFile(file);
      }
    },
    [t],
  );

  const { getRootProps: getFileRootProps, getInputProps: getFileInputProps } =
    useDropzone({
      onDrop: onDropFile,
      multiple: false,
    });

  const formatFileSize = (size: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;
    let formattedSize = size;

    while (formattedSize >= 1024 && unitIndex < units.length - 1) {
      formattedSize /= 1024;
      unitIndex += 1;
    }

    return `${formattedSize.toFixed(1)} ${units[unitIndex]}`;
  };

  const handleFileUpload = () => {
    if (file) {
      uploadFile({ file });
    }
  };

  return (
    <div className="w-full">
      <ApiValidationErrors problemDetails={apiValidationErrors} />
      <div
        {...getFileRootProps({
          className: 'dropzone relative block w-full',
        })}
      >
        <input {...getFileInputProps()} />
        <div
          className={`border-2 border-dashed ${file ? 'border-blue-400 bg-blue-50' : 'border-gray-300'} 
          rounded-lg p-6 transition-all duration-200 ease-in-out hover:border-blue-500 
          hover:bg-blue-50 flex flex-col items-center justify-center cursor-pointer`}
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <svg
                className={`w-12 h-12 ${file ? 'text-blue-500' : 'text-gray-400'} mb-3`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>

              {file ? (
                <div className="text-center">
                  <p className="text-blue-500 font-medium text-sm mb-1 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-700 font-medium mb-1">
                    {t('fileUpload.clickToUpload')}{' '}
                    {t('fileUpload.dragAndDrop')}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {t('fileUpload.pdfFilesLimit')}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <CustomButton
          disabled={!file || isLoading}
          onClick={handleFileUpload}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 hover:text-white text-gray-500 font-medium rounded-lg transition-colors duration-200 ease-in-out disabled:bg-blue-300 disabled:text-gray disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              ></path>
            </svg>
            <span>
              {isLoading ? t('fileUpload.uploading') : t('fileUpload.upload')}
            </span>
          </div>
        </CustomButton>
      </div>
    </div>
  );
};

export default FileUpload;
