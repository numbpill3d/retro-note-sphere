
import React from 'react';
import { cn } from '../lib/utils';

interface Win98ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'destructive' | 'ghost' | 'icon' | 'menu' | 'toolbar';
  size?: 'sm' | 'md' | 'lg' | 'xs' | 'icon';
  className?: string;
  icon?: React.ReactNode;
  active?: boolean;
  tooltip?: string;
}

const Win98Button: React.FC<Win98ButtonProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  disabled,
  icon,
  active = false,
  tooltip,
  ...props
}) => {
  // Map variant to classes (using base win98-button class for styling)
  const variantClasses = {
    default: '',
    primary: 'bg-theme-highlight text-white',
    destructive: 'bg-red-600 text-white',
    ghost: 'shadow-none bg-transparent hover:bg-win98-gray hover:bg-opacity-20',
    icon: 'shadow-none bg-transparent p-1 hover:bg-win98-gray hover:bg-opacity-20',
    menu: 'shadow-none bg-transparent text-left justify-start w-full hover:bg-win98-gray hover:bg-opacity-20',
    toolbar: 'shadow-none bg-transparent p-0.5 hover:bg-win98-gray hover:bg-opacity-20',
  }[variant];

  // Map size to classes
  const sizeClasses = {
    xs: 'text-xs px-1 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
    icon: 'p-0.5',
  }[size];

  return (
    <button
      className={cn(
        `win98-button select-none`,
        variantClasses,
        variant !== 'icon' ? sizeClasses : '',
        active ? 'border-top-color: var(--theme-button-border-shadow); border-left-color: var(--theme-button-border-shadow); border-right-color: var(--theme-button-border); border-bottom-color: var(--theme-button-border);' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className
      )}
      disabled={disabled}
      title={tooltip}
      {...props}
    >
      {icon && <span className={children ? 'mr-1.5 inline-flex items-center' : 'inline-flex items-center'}>{icon}</span>}
      {children}
    </button>
  );
};

export default Win98Button;
