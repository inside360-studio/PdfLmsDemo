import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import ApiValidationErrors, { ProblemDetails } from '../ApiValidationErrors';
import Spinner from '../Spinner/Spinner';
import CustomButton from '../CustomButton';
import { useFileUpload } from './fileUploadApi';

interface FileUploadProps {
  onUpdate: (result?: any, file?: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpdate }) => {
  const { t } = useTranslation();
  const [apiValidationErrors, setApiValidationErrors] =
    useState<ProblemDetails | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: uploadFile, isLoading: isFileUploading } = useFileUpload({
    onSuccess: (result) => {
      toast.success(t('fileUploaded'));
      setApiValidationErrors(null);
      onUpdate(result, file || undefined);
    },
    onError: (e: any) => {
      if (e.response) {
        setApiValidationErrors(e.response.data as ProblemDetails);
      }
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
    [uploadFile, t],
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
    uploadFile(file as File);
  };

  return (
    <>
      <ApiValidationErrors problemDetails={apiValidationErrors} />
      <label
        {...getFileRootProps({
          className: 'dropzone relative',
        })}
      >
        <input
          {...getFileInputProps()}
          onClick={(event) => event.stopPropagation()} // Prevents the file input from reopening
        />
        <div className="relative w-40 h-40 bg-gray-200 flex items-center justify-center rounded-lg cursor-pointer">
          {isLoading ? (
            <Spinner />
          ) : (
            <span className="text-gray-500 font-silka text-center w-full">
              {file ? file.name : t('clickToUpload')}
            </span>
          )}
        </div>
        {file && !isFileUploading && (
          <p className="text-gray-500 h-10 text-lg mt-1 font-silka">
            ({formatFileSize(file.size)})
          </p>
        )}
      </label>
      <div className="pt-2 flex items-start gap-4 ">
        <CustomButton
          disabled={!file || isLoading}
          onClick={() => handleFileUpload()}
        >
          <div className="flex items-center font-silka-semibold text-xs">
            {t('upload')}
          </div>
        </CustomButton>
      </div>
    </>
  );
};

export default FileUpload;
