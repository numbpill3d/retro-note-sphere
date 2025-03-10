
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Win98Button from './Win98Button';
import Win98Window from './Win98Window';
import { Monitor, Terminal, Laptop, Palette, Code } from 'lucide-react';
import { cn } from '../lib/utils';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  const themes = [
    { id: 'win98', name: 'Windows 98', icon: <Monitor size={16} /> },
    { id: 'cyber', name: 'Cyberpunk', icon: <Laptop size={16} /> },
    { id: 'terminal', name: 'Terminal', icon: <Terminal size={16} /> },
    { id: 'y2k', name: 'Y2K', icon: <Palette size={16} /> },
    { id: 'hacker', name: 'Hacker', icon: <Code size={16} /> },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
      <Win98Window
        title="Theme Settings"
        className="w-80 z-50"
        onClose={onClose}
      >
        <div className="p-2 overflow-auto">
          <p className="text-sm mb-4">Select a theme for your RetroNotes experience:</p>
          
          <div className="space-y-2">
            {themes.map((themeOption) => (
              <div
                key={themeOption.id}
                className={cn(
                  "flex items-center p-2 cursor-pointer border border-transparent",
                  theme === themeOption.id 
                    ? "win98-window-inset bg-win98-blue text-white" 
                    : "hover:bg-win98-gray hover:bg-opacity-20"
                )}
                onClick={() => setTheme(themeOption.id as any)}
              >
                <div className="mr-2">{themeOption.icon}</div>
                <span>{themeOption.name}</span>
                {theme === themeOption.id && (
                  <span className="ml-auto">✓</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-center">
            <Win98Button onClick={onClose}>Close</Win98Button>
          </div>
        </div>
      </Win98Window>
    </div>
  );
};

export default ThemeSelector;
