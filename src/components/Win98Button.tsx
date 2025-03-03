
import React from 'react';

interface Win98ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Win98Button: React.FC<Win98ButtonProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  // Map variant to classes
  const variantClasses = {
    default: 'bg-win98-lightgray text-win98-black',
    primary: 'bg-win98-blue text-white',
    destructive: 'bg-red-600 text-white',
  }[variant];

  // Map size to classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }[size];

  return (
    <button
      className={`
        win98-button select-none
        ${variantClasses}
        ${sizeClasses}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-win98-gray hover:bg-opacity-20'}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Win98Button;
