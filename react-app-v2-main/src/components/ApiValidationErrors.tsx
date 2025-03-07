import React, { useEffect, useState } from 'react';

export interface ProblemDetails {
  title: string;
  status: number;
  detail: string;
  type: string;
  instance: string;
  errors: string[][];
}

interface ApiValidationErrorsProps {
  problemDetails: ProblemDetails | null;
}

const ApiValidationErrors: React.FC<ApiValidationErrorsProps> = ({
  problemDetails,
}) => {
  const [flatErrors, setFlatErrors] = useState<string[] | null>(null);

  const flattenErrors = (errors: string[][]): string[] => {
    return Object.values(errors).reduce((acc, curr) => acc.concat(curr), []);
  };

  useEffect(() => {
    if (problemDetails?.errors?.length === 0) {
      setFlatErrors([]);
    } else if (problemDetails != null && problemDetails.errors) {
      const flatErrors = flattenErrors(problemDetails.errors);
      setFlatErrors(flatErrors);
    }
  }, [problemDetails]);

  if (problemDetails) {
    return (
      <div className="text-red-500 font-silka font-medium text-sm leading-6 mt-1.5 flex items-center gap-1">
        <ul>
          {problemDetails?.detail && <li>{problemDetails.detail}</li>}
          {flatErrors?.map((error, index) => <li key={index}>{error}</li>)}
        </ul>
      </div>
    );
  } else {
    return <></>;
  }
};

export default ApiValidationErrors;
