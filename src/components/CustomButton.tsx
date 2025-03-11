import React from 'react';

type CustomButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  inactive?: boolean;
  disabled?: boolean;
  className?: string;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  colorScheme?:
    | 'default'
    | 'blackWhite'
    | 'redWhite'
    | 'greenWhite'
    | 'nonBorderActive'
    | 'nonBorder'; // Add redWhite color scheme
  buttonType?: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  inactive,
  className,
  iconBefore,
  iconAfter,
  colorScheme = 'default',
  disabled = false,
  buttonType = 'button',
}) => {
  const baseClassNames =
    'border rounded-lg px-2 py-1.5 h-8 flex items-center justify-center font-silka';
  const defaultClassNames = 'border-gray-300 text-black bg-transparent';
  const blackWhiteClassNames = 'bg-black text-white border-black';
  const redWhiteClassNames = 'bg-red-500 text-white border-red-500'; // Define redWhite class names
  const greenWhiteClassNames = 'bg-green-500 text-white border-green-500';
  const disabledClassName =
    'bg-gray-300 text-white cursor-not-allowed border-transparent hover:border-transparent focus:outline-none focus:ring-0';
  const nonBorderActiveClassName =
    'border-transparent hover:border-transparent text-black bg-white focus:outline-none focus:ring-0';
  const nonBorderClassName =
    'border-transparent hover:border-transparent color-[#808189] bg-[#F4F4F5] focus:outline-none focus:ring-0';

  const variantClassNames = disabled
    ? disabledClassName
    : colorScheme === 'blackWhite'
      ? blackWhiteClassNames
      : colorScheme === 'redWhite'
        ? redWhiteClassNames
        : colorScheme === 'greenWhite'
          ? greenWhiteClassNames
          : colorScheme === 'nonBorderActive'
            ? nonBorderActiveClassName
            : colorScheme === 'nonBorder'
              ? nonBorderClassName
              : defaultClassNames;

  const inactiveClassNames = inactive || disabled ? 'text-gray-400' : '';

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${baseClassNames} ${variantClassNames} ${inactiveClassNames} ${className}`}
      type={buttonType == 'button' ? 'button' : 'submit'}
    >
      {iconBefore && <span className="mr-1">{iconBefore}</span>}
      <span>{children}</span>
      {iconAfter && <span className="ml-1">{iconAfter}</span>}
    </button>
  );
};

export default CustomButton;
