
import React from 'react';
import { cn } from '../lib/utils';

interface Win98ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'destructive' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

const Win98Button: React.FC<Win98ButtonProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  disabled,
  icon,
  ...props
}) => {
  // Map variant to classes (using base win98-button class for styling)
  const variantClasses = {
    default: '',
    primary: 'bg-theme-highlight text-white',
    destructive: 'bg-red-600 text-white',
    ghost: 'shadow-none bg-transparent hover:bg-win98-gray hover:bg-opacity-20',
    icon: 'shadow-none bg-transparent p-1 hover:bg-win98-gray hover:bg-opacity-20',
  }[variant];

  // Map size to classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }[size];

  return (
    <button
      className={cn(
        `win98-button select-none`,
        variantClasses,
        variant !== 'icon' ? sizeClasses : '',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span className={children ? 'mr-1.5 inline-flex items-center' : 'inline-flex items-center'}>{icon}</span>}
      {children}
    </button>
  );
};

export default Win98Button;
