
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Win98Button from './Win98Button';
import Win98Window from './Win98Window';
import { 
  Monitor, Terminal, Laptop, Palette, Code, Coffee, Brush, Sparkles, 
  Zap, FileCode, Sun, Waves, Sunset, Mountain, Star, Scroll, Droplets,
  Moon, Settings, Eye, ArrowLeft, ArrowRight, ToggleLeft, ToggleRight,
  Text, PanelLeft, PanelRight, Columns
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isOpen, onClose }) => {
  const { 
    theme, setTheme, 
    fontSize, setFontSize,
    spacing, setSpacing,
    roundedCorners, setRoundedCorners,
    animationsEnabled, setAnimationsEnabled
  } = useTheme();
  const [activeTab, setActiveTab] = useState<'themes' | 'appearance'>('themes');

  if (!isOpen) return null;

  const themes = [
    { 
      id: 'win98', 
      name: 'Windows 98', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="2" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
          <rect x="3" y="4" width="10" height="1" fill="currentColor"/>
          <rect x="4" y="6" width="2" height="2" fill="currentColor"/>
          <rect x="7" y="6" width="2" height="2" fill="currentColor"/>
          <rect x="10" y="6" width="2" height="2" fill="currentColor"/>
        </svg>
      ), 
      description: 'Classic Windows 98 look and feel' 
    },
    { 
      id: 'cyber', 
      name: 'Cyberpunk', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 2L12 6H10V10H12L8 14L4 10H6V6H4L8 2Z" fill="currentColor"/>
          <circle cx="3" cy="3" r="1" fill="currentColor"/>
          <circle cx="13" cy="3" r="1" fill="currentColor"/>
          <circle cx="3" cy="13" r="1" fill="currentColor"/>
          <circle cx="13" cy="13" r="1" fill="currentColor"/>
        </svg>
      ), 
      description: 'Purple cyberpunk interface with neon accents' 
    },
    { 
      id: 'terminal', 
      name: 'Terminal', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="2" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M3 5L6 7L3 9" stroke="currentColor" strokeWidth="1" fill="none"/>
          <rect x="7" y="8" width="4" height="1" fill="currentColor"/>
        </svg>
      ), 
      description: 'Classic green terminal aesthetic' 
    },
    { 
      id: 'y2k', 
      name: 'Y2K', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="6" cy="6" r="1" fill="currentColor"/>
          <circle cx="10" cy="6" r="1" fill="currentColor"/>
          <circle cx="8" cy="10" r="1" fill="currentColor"/>
          <path d="M5 12C6 13 10 13 11 12" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
      ), 
      description: 'Late 90s/early 2000s web design' 
    },
    { 
      id: 'hacker', 
      name: 'Hacker', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="3" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
          <rect x="3" y="5" width="1" height="6" fill="currentColor"/>
          <rect x="5" y="6" width="1" height="5" fill="currentColor"/>
          <rect x="7" y="5" width="1" height="6" fill="currentColor"/>
          <rect x="9" y="7" width="1" height="4" fill="currentColor"/>
          <rect x="11" y="5" width="1" height="6" fill="currentColor"/>
        </svg>
      ), 
      description: 'Matrix-inspired digital rain theme' 
    },
    { 
      id: 'coffee', 
      name: 'Coffee Shop', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M3 4H11C12 4 13 5 13 6V9C13 10 12 11 11 11H3V4Z" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M13 6H14C14.5 6 15 6.5 15 7V8C15 8.5 14.5 9 14 9H13" stroke="currentColor" strokeWidth="1" fill="none"/>
          <rect x="3" y="11" width="8" height="2" fill="currentColor"/>
          <path d="M5 2C5 2.5 5.5 3 6 3C6.5 3 7 2.5 7 2" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M7 2C7 2.5 7.5 3 8 3C8.5 3 9 2.5 9 2" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>
      ), 
      description: 'Warm, cozy brown tones' 
    },
    { 
      id: 'retro', 
      name: 'Retro Art', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="3" width="12" height="8" stroke="currentColor" strokeWidth="1" fill="none"/>
          <rect x="4" y="5" width="2" height="2" fill="currentColor"/>
          <rect x="7" y="5" width="2" height="2" fill="currentColor"/>
          <rect x="10" y="5" width="2" height="2" fill="currentColor"/>
          <rect x="5" y="8" width="6" height="1" fill="currentColor"/>
          <circle cx="8" cy="13" r="1" fill="currentColor"/>
        </svg>
      ), 
      description: 'Vibrant retro art style' 
    },
    { 
      id: 'minimal', 
      name: 'Minimal', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="8" r="2" fill="currentColor"/>
          <rect x="7" y="2" width="2" height="4" fill="currentColor"/>
          <rect x="7" y="10" width="2" height="4" fill="currentColor"/>
          <rect x="2" y="7" width="4" height="2" fill="currentColor"/>
          <rect x="10" y="7" width="4" height="2" fill="currentColor"/>
        </svg>
      ), 
      description: 'Clean, distraction-free interface' 
    },
    { 
      id: 'vaporwave', 
      name: 'Vaporwave', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="4" r="2" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M2 8H14" stroke="currentColor" strokeWidth="1"/>
          <path d="M3 10H13" stroke="currentColor" strokeWidth="1"/>
          <path d="M4 12H12" stroke="currentColor" strokeWidth="1"/>
          <path d="M5 14H11" stroke="currentColor" strokeWidth="1"/>
        </svg>
      ), 
      description: '80s retro-futurism with pink/blue aesthetics' 
    },
    { 
      id: 'forest', 
      name: 'Forest', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 2L6 6H10L8 2Z" fill="currentColor"/>
          <path d="M8 4L5 9H11L8 4Z" fill="currentColor"/>
          <rect x="7" y="9" width="2" height="5" fill="currentColor"/>
          <circle cx="4" cy="12" r="1" fill="currentColor"/>
          <circle cx="12" cy="11" r="1" fill="currentColor"/>
        </svg>
      ), 
      description: 'Calming natural green tones' 
    },
    { 
      id: 'midnight', 
      name: 'Midnight', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M8 8L10 6" stroke="currentColor" strokeWidth="1"/>
          <path d="M8 8L8 4" stroke="currentColor" strokeWidth="1"/>
          <circle cx="3" cy="3" r="0.5" fill="currentColor"/>
          <circle cx="13" cy="4" r="0.5" fill="currentColor"/>
          <circle cx="12" cy="12" r="0.5" fill="currentColor"/>
        </svg>
      ), 
      description: 'Dark blue night-time theme' 
    },
    { 
      id: 'bubblegum', 
      name: 'Bubblegum', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="4" cy="10" r="1.5" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="12" cy="4" r="1" fill="currentColor"/>
          <circle cx="3" cy="13" r="1" fill="currentColor"/>
        </svg>
      ), 
      description: 'Fun, pastel pink and blue' 
    },
    { 
      id: 'papyrus', 
      name: 'Papyrus', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="3" y="2" width="10" height="12" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M5 5H11" stroke="currentColor" strokeWidth="1"/>
          <path d="M5 7H11" stroke="currentColor" strokeWidth="1"/>
          <path d="M5 9H9" stroke="currentColor" strokeWidth="1"/>
          <path d="M5 11H10" stroke="currentColor" strokeWidth="1"/>
          <circle cx="1" cy="1" r="0.5" fill="currentColor"/>
          <circle cx="15" cy="15" r="0.5" fill="currentColor"/>
        </svg>
      ), 
      description: 'Elegant beige parchment-like style' 
    },
    { 
      id: 'sunshine', 
      name: 'Sunshine', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="8" cy="8" r="3" fill="currentColor"/>
          <rect x="7.5" y="1" width="1" height="2" fill="currentColor"/>
          <rect x="7.5" y="13" width="1" height="2" fill="currentColor"/>
          <rect x="1" y="7.5" width="2" height="1" fill="currentColor"/>
          <rect x="13" y="7.5" width="2" height="1" fill="currentColor"/>
          <rect x="3.5" y="3.5" width="1" height="1" fill="currentColor" transform="rotate(45 4 4)"/>
          <rect x="11.5" y="11.5" width="1" height="1" fill="currentColor" transform="rotate(45 12 12)"/>
          <rect x="3.5" y="11.5" width="1" height="1" fill="currentColor" transform="rotate(-45 4 12)"/>
          <rect x="11.5" y="3.5" width="1" height="1" fill="currentColor" transform="rotate(-45 12 4)"/>
        </svg>
      ), 
      description: 'Bright, cheerful yellow theme' 
    },
    { 
      id: 'ocean', 
      name: 'Ocean', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M1 8C3 6 5 10 7 8C9 6 11 10 13 8C15 6 15 6 15 8V14H1V8Z" fill="currentColor"/>
          <path d="M2 6C4 4 6 8 8 6C10 4 12 8 14 6" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="3" cy="3" r="1" fill="currentColor"/>
          <circle cx="13" cy="2" r="0.5" fill="currentColor"/>
        </svg>
      ), 
      description: 'Deep blue and teal water theme' 
    },
    { 
      id: 'starlight', 
      name: 'Starlight', 
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="1" width="14" height="14" fill="currentColor" fillOpacity="0.1"/>
          <path d="M8 2L9 6L8 7L7 6L8 2Z" fill="currentColor"/>
          <circle cx="3" cy="4" r="0.5" fill="currentColor"/>
          <circle cx="12" cy="3" r="0.5" fill="currentColor"/>
          <circle cx="4" cy="9" r="0.5" fill="currentColor"/>
          <circle cx="11" cy="11" r="0.5" fill="currentColor"/>
          <circle cx="13" cy="8" r="0.5" fill="currentColor"/>
          <circle cx="6" cy="12" r="0.5" fill="currentColor"/>
        </svg>
      ), 
      description: 'Dark theme with star-like accents' 
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
      <Win98Window
        title="Theme Settings"
        className="w-[800px] max-h-[90vh] z-50"
        onClose={onClose}
      >
        <div className="p-3 overflow-auto max-h-[80vh]">
          <div className="flex border-b border-theme-window-border-shadow mb-4">
            <div 
              className={cn(
                "px-4 py-2 cursor-pointer font-bold",
                activeTab === 'themes' ? "border-b-2 border-theme-highlight" : "opacity-70"
              )}
              onClick={() => setActiveTab('themes')}
            >
              <div className="flex items-center">
                <Palette size={16} className="mr-2" />
                Themes
              </div>
            </div>
            <div 
              className={cn(
                "px-4 py-2 cursor-pointer font-bold",
                activeTab === 'appearance' ? "border-b-2 border-theme-highlight" : "opacity-70"
              )}
              onClick={() => setActiveTab('appearance')}
            >
              <div className="flex items-center">
                <Settings size={16} className="mr-2" />
                Appearance
              </div>
            </div>
          </div>
          
          {activeTab === 'themes' && (
            <>
              <p className="text-sm mb-4">Select a theme for your RetroNotes experience:</p>
              
              <div className="grid grid-cols-2 gap-2">
                {themes.map((themeOption) => (
                  <div
                    key={themeOption.id}
                    className={cn(
                      "flex items-center p-2.5 cursor-pointer rounded border border-transparent transition-all",
                      theme === themeOption.id 
                        ? "win98-window-inset bg-theme-highlight text-theme-titlebar-text" 
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
            </>
          )}
          
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div className="win98-window p-3">
                <h3 className="font-bold mb-2 text-sm flex items-center">
                  <Text size={14} className="mr-2" /> Font Size
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <Win98Button 
                    onClick={() => setFontSize('sm')} 
                    className={cn(fontSize === 'sm' ? 'bg-theme-highlight text-theme-titlebar-text' : '')}
                  >
                    Small
                  </Win98Button>
                  <Win98Button 
                    onClick={() => setFontSize('md')} 
                    className={cn(fontSize === 'md' ? 'bg-theme-highlight text-theme-titlebar-text' : '')}
                  >
                    Medium
                  </Win98Button>
                  <Win98Button 
                    onClick={() => setFontSize('lg')} 
                    className={cn(fontSize === 'lg' ? 'bg-theme-highlight text-theme-titlebar-text' : '')}
                  >
                    Large
                  </Win98Button>
                </div>
              </div>
              
              <div className="win98-window p-3">
                <h3 className="font-bold mb-2 text-sm flex items-center">
                  <Columns size={14} className="mr-2" /> Content Spacing
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <Win98Button 
                    onClick={() => setSpacing('compact')} 
                    className={cn(spacing === 'compact' ? 'bg-theme-highlight text-theme-titlebar-text' : '')}
                  >
                    <PanelLeft size={14} className="mr-1" /> Compact
                  </Win98Button>
                  <Win98Button 
                    onClick={() => setSpacing('normal')} 
                    className={cn(spacing === 'normal' ? 'bg-theme-highlight text-theme-titlebar-text' : '')}
                  >
                    <Columns size={14} className="mr-1" /> Normal
                  </Win98Button>
                  <Win98Button 
                    onClick={() => setSpacing('wide')} 
                    className={cn(spacing === 'wide' ? 'bg-theme-highlight text-theme-titlebar-text' : '')}
                  >
                    <PanelRight size={14} className="mr-1" /> Wide
                  </Win98Button>
                </div>
              </div>
              
              <div className="win98-window p-3">
                <h3 className="font-bold mb-2 text-sm">Interface Options</h3>
                <div className="space-y-2">
                  <div 
                    className="flex items-center justify-between p-2 hover:bg-win98-gray hover:bg-opacity-20 cursor-pointer"
                    onClick={() => setRoundedCorners(!roundedCorners)}
                  >
                    <div className="flex items-center">
                      <Eye size={14} className="mr-2" />
                      <span>Rounded Corners</span>
                    </div>
                    <div>
                      {roundedCorners ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center justify-between p-2 hover:bg-win98-gray hover:bg-opacity-20 cursor-pointer"
                    onClick={() => setAnimationsEnabled(!animationsEnabled)}
                  >
                    <div className="flex items-center">
                      <Zap size={14} className="mr-2" />
                      <span>Enable Animations</span>
                    </div>
                    <div>
                      {animationsEnabled ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="win98-window p-3">
                <h3 className="font-bold mb-2 text-sm">Theme Preview</h3>
                <div className={cn(
                  "border p-3 min-h-[100px]",
                  roundedCorners ? "rounded-lg" : ""
                )}>
                  <div className="win98-window p-2 mb-2">
                    <div className="win98-titlebar text-xs mb-1">Sample Window</div>
                    <p className={cn(
                      "text-xs",
                      fontSize === 'sm' ? "text-xs" : 
                      fontSize === 'md' ? "text-sm" : "text-base"
                    )}>
                      This is a preview of your current theme.
                    </p>
                  </div>
                  <Win98Button size="sm">Sample Button</Win98Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <Win98Button onClick={onClose} className="px-6">Close</Win98Button>
          </div>
        </div>
      </Win98Window>
    </div>
  );
};

export default ThemeSelector;
