
import React, { useState, useEffect } from 'react';
import Win98Button from './Win98Button';
import { useNotes } from '../context/NoteContext';
import { PlusCircle, HelpCircle, BarChart2, Palette, UserRound, LayoutGrid, LayoutList, Grip, Search } from 'lucide-react';

interface TaskbarProps {
  onOpenHelp: () => void;
  onToggleGraph: () => void;
  onOpenThemeSelector: () => void;
  onOpenProfile: () => void;
  onToggleLayout: () => void;
  onOpenSearch: () => void;
  layoutMode: 'default' | 'wide' | 'focus';
  showGraph: boolean;
}

const Taskbar: React.FC<TaskbarProps> = ({ 
  onOpenHelp, 
  onToggleGraph, 
  onOpenThemeSelector,
  onOpenProfile,
  onToggleLayout,
  onOpenSearch,
  layoutMode,
  showGraph 
}) => {
  const { createNote } = useNotes();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="win98-window h-10 flex items-center justify-between px-2 shadow-md">
      <div className="flex items-center space-x-2">
        <Win98Button 
          onClick={() => createNote(null)}
          title="Create new note"
          className="flex items-center"
        >
          <PlusCircle size={16} className="mr-1" />
          New Note
        </Win98Button>
        
        <Win98Button 
          onClick={onToggleGraph}
          title={showGraph ? "Hide Graph View" : "Show Graph View"}
          className="flex items-center"
        >
          <BarChart2 size={16} className="mr-1" />
          {showGraph ? "Hide Graph" : "Show Graph"}
        </Win98Button>
        
        <Win98Button 
          onClick={onOpenThemeSelector}
          title="Change Theme"
          className="flex items-center"
        >
          <Palette size={16} className="mr-1" />
          Themes
        </Win98Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Win98Button variant="icon" onClick={onOpenProfile} title="User profile">
          <UserRound size={16} />
        </Win98Button>
        <Win98Button variant="icon" onClick={onToggleLayout} title="Toggle layout">
          {layoutMode === 'default' ? <LayoutGrid size={16} /> :
           layoutMode === 'wide' ? <LayoutList size={16} /> : <Grip size={16} />}
        </Win98Button>
        <Win98Button variant="icon" onClick={onOpenSearch} title="Search notes">
          <Search size={16} />
        </Win98Button>
        <Win98Button 
          onClick={onOpenHelp}
          title="Open Help"
          className="flex items-center"
        >
          <HelpCircle size={16} className="mr-1" />
          Help
        </Win98Button>
        
        <div className="win98-window-inset px-3 py-1 text-sm ml-2">
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
