
import React, { useState, useEffect } from 'react';
import Win98Button from './Win98Button';
import { Menu, ChevronUp } from 'lucide-react';

interface TaskbarProps {
  onOpenHelp: () => void;
  onToggleGraph: () => void;
  showGraph: boolean;
}

const Taskbar: React.FC<TaskbarProps> = ({ onOpenHelp, onToggleGraph, showGraph }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showStartMenu, setShowStartMenu] = useState(false);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  return (
    <div className="win98-window z-10 border-t-2 border-win98-lightgray p-1 flex items-center shadow-none">
      <div className="relative">
        <Win98Button 
          className="flex items-center" 
          onClick={() => setShowStartMenu(!showStartMenu)}
        >
          <Menu size={16} className="mr-1" />
          <span className="font-bold">Start</span>
        </Win98Button>
        
        {showStartMenu && (
          <div 
            className="absolute bottom-full left-0 win98-window w-48 mb-1 animate-fade-in z-50"
            onMouseLeave={() => setShowStartMenu(false)}
          >
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-win98-blue"></div>
            <ul className="py-1">
              <li 
                className="px-2 py-1 pl-10 hover:bg-win98-blue hover:text-white cursor-pointer"
                onClick={() => {
                  onToggleGraph();
                  setShowStartMenu(false);
                }}
              >
                {showGraph ? 'Hide Graph View' : 'Show Graph View'}
              </li>
              <li 
                className="px-2 py-1 pl-10 hover:bg-win98-blue hover:text-white cursor-pointer"
                onClick={() => {
                  onOpenHelp();
                  setShowStartMenu(false);
                }}
              >
                Help
              </li>
              <li className="border-t border-win98-gray my-1"></li>
              <li 
                className="px-2 py-1 pl-10 hover:bg-win98-blue hover:text-white cursor-pointer font-bold"
                onClick={() => {
                  window.location.reload();
                }}
              >
                Restart
              </li>
            </ul>
          </div>
        )}
      </div>
      
      <div className="flex-1"></div>
      
      <div className="win98-inset flex items-center px-2 py-1 text-xs">
        <span className="font-mono">{formatTime(currentTime)}</span>
      </div>
    </div>
  );
};

export default Taskbar;
