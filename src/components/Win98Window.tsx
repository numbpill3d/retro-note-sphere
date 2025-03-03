
import React, { useState } from 'react';
import { X, Minus, Square } from 'lucide-react';

interface Win98WindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  minimizable?: boolean;
  maximizable?: boolean;
  defaultMaximized?: boolean;
  width?: string;
  height?: string;
}

const Win98Window: React.FC<Win98WindowProps> = ({
  title,
  children,
  className = '',
  onClose,
  minimizable = false,
  maximizable = false,
  defaultMaximized = false,
  width = 'auto',
  height = 'auto',
}) => {
  const [isMaximized, setIsMaximized] = useState(defaultMaximized);
  const [isDragging, setIsDragging] = useState(false);

  const toggleMaximize = () => {
    if (maximizable) {
      setIsMaximized(!isMaximized);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const windowStyle = isMaximized
    ? { width: '100%', height: '100%' }
    : { width, height };

  return (
    <div 
      className={`win98-window ${isMaximized ? 'fixed inset-0 z-50' : 'relative animate-slide-in'} ${className}`}
      style={windowStyle}
    >
      <div 
        className="win98-titlebar cursor-move select-none"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onDoubleClick={toggleMaximize}
      >
        <div className="flex items-center gap-1">
          <span className="text-sm mr-2 tracking-tight">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          {minimizable && (
            <button 
              className="border-0 w-5 h-5 flex items-center justify-center bg-theme-button-bg text-theme-text shadow-win98 hover:bg-win98-gray"
              onClick={() => {}}
            >
              <Minus size={14} />
            </button>
          )}
          {maximizable && (
            <button 
              className="border-0 w-5 h-5 flex items-center justify-center bg-theme-button-bg text-theme-text shadow-win98 hover:bg-win98-gray"
              onClick={toggleMaximize}
            >
              <Square size={14} />
            </button>
          )}
          {onClose && (
            <button 
              className="border-0 w-5 h-5 flex items-center justify-center bg-theme-button-bg text-theme-text shadow-win98 hover:bg-win98-gray hover:text-theme-highlight"
              onClick={handleClose}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      <div className="p-2 h-[calc(100%-28px)] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Win98Window;
