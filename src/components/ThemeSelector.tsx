
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Win98Button from './Win98Button';
import Win98Window from './Win98Window';
import { Monitor, Terminal, Laptop, Palette, Code, Coffee, Brush, Sparkles, Zap, FileCode } from 'lucide-react';
import { cn } from '../lib/utils';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  const themes = [
    { id: 'win98', name: 'Windows 98', icon: <Monitor size={16} />, description: 'Classic Windows 98 look and feel' },
    { id: 'cyber', name: 'Cyberpunk', icon: <Zap size={16} />, description: 'High-tech, neon-styled interface' },
    { id: 'terminal', name: 'Terminal', icon: <Terminal size={16} />, description: 'Minimalist command-line aesthetic' },
    { id: 'y2k', name: 'Y2K', icon: <Sparkles size={16} />, description: 'Late 90s/early 2000s web design' },
    { id: 'hacker', name: 'Hacker', icon: <FileCode size={16} />, description: 'Matrix-inspired green-on-black' },
    { id: 'coffee', name: 'Coffee Shop', icon: <Coffee size={16} />, description: 'Warm, cozy brown tones' },
    { id: 'retro', name: 'Retro Art', icon: <Palette size={16} />, description: 'Vibrant retro art style' },
    { id: 'minimal', name: 'Minimal', icon: <Brush size={16} />, description: 'Clean, distraction-free interface' },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
      <Win98Window
        title="Theme Settings"
        className="w-96 max-h-[90vh] z-50"
        onClose={onClose}
      >
        <div className="p-3 overflow-auto max-h-[80vh]">
          <p className="text-sm mb-4">Select a theme for your RetroNotes experience:</p>
          
          <div className="grid grid-cols-1 gap-2">
            {themes.map((themeOption) => (
              <div
                key={themeOption.id}
                className={cn(
                  "flex items-center p-2.5 cursor-pointer rounded border border-transparent transition-all",
                  theme === themeOption.id 
                    ? "win98-window-inset bg-win98-blue text-white" 
                    : "hover:bg-win98-gray hover:bg-opacity-30"
                )}
                onClick={() => setTheme(themeOption.id as any)}
              >
                <div className="mr-3 flex items-center justify-center w-8 h-8 win98-button">
                  {themeOption.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold">{themeOption.name}</span>
                  <span className="text-xs opacity-80">{themeOption.description}</span>
                </div>
                {theme === themeOption.id && (
                  <span className="ml-auto">✓</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-center">
            <Win98Button onClick={onClose} className="px-6">Close</Win98Button>
          </div>
        </div>
      </Win98Window>
    </div>
  );
};

export default ThemeSelector;
