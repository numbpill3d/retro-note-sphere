
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Win98Button from './Win98Button';
import Win98Window from './Win98Window';
import { 
  Monitor, Terminal, Laptop, Palette, Code, Coffee, Brush, Sparkles, 
  Zap, FileCode, Sun, Waves, Sunset, Mountains, Star, Scroll, Droplets,
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
    { id: 'win98', name: 'Windows 98', icon: <Monitor size={16} />, description: 'Classic Windows 98 look and feel' },
    { id: 'cyber', name: 'Cyberpunk', icon: <Zap size={16} />, description: 'High-tech, neon-styled interface' },
    { id: 'terminal', name: 'Terminal', icon: <Terminal size={16} />, description: 'Minimalist command-line aesthetic' },
    { id: 'y2k', name: 'Y2K', icon: <Sparkles size={16} />, description: 'Late 90s/early 2000s web design' },
    { id: 'hacker', name: 'Hacker', icon: <FileCode size={16} />, description: 'Matrix-inspired green-on-black' },
    { id: 'coffee', name: 'Coffee Shop', icon: <Coffee size={16} />, description: 'Warm, cozy brown tones' },
    { id: 'retro', name: 'Retro Art', icon: <Palette size={16} />, description: 'Vibrant retro art style' },
    { id: 'minimal', name: 'Minimal', icon: <Brush size={16} />, description: 'Clean, distraction-free interface' },
    { id: 'vaporwave', name: 'Vaporwave', icon: <Sunset size={16} />, description: '80s retro-futurism with pink/blue aesthetics' },
    { id: 'forest', name: 'Forest', icon: <Mountains size={16} />, description: 'Calming natural green tones' },
    { id: 'midnight', name: 'Midnight', icon: <Moon size={16} />, description: 'Dark blue night-time theme' },
    { id: 'bubblegum', name: 'Bubblegum', icon: <Droplets size={16} />, description: 'Fun, pastel pink and blue' },
    { id: 'papyrus', name: 'Papyrus', icon: <Scroll size={16} />, description: 'Elegant beige parchment-like style' },
    { id: 'sunshine', name: 'Sunshine', icon: <Sun size={16} />, description: 'Bright, cheerful yellow theme' },
    { id: 'ocean', name: 'Ocean', icon: <Waves size={16} />, description: 'Deep blue and teal water theme' },
    { id: 'starlight', name: 'Starlight', icon: <Star size={16} />, description: 'Dark theme with star-like accents' },
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
