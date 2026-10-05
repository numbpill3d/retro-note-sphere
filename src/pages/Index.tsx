
import React, { useState } from 'react';
import { NoteProvider } from '../context/NoteContext';
import Win98Window from '../components/Win98Window';
import NoteTree from '../components/NoteTree';
import MarkdownEditor from '../components/MarkdownEditor';
import GraphView from '../components/GraphView';
import Taskbar from '../components/Taskbar';
import ThemeSelector from '../components/ThemeSelector';
import Win98Button from '../components/Win98Button';
import NoteSidebar from '../components/NoteSidebar';
import UserProfileMenu from '../components/UserProfileMenu';

const Index = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'default' | 'wide' | 'focus'>('default');

  const getLayoutClass = () => {
    switch (layoutMode) {
      case 'wide':
        return 'grid-cols-[1fr_2fr]';
      case 'focus':
        return 'grid-cols-1';
      default:
        return 'grid-cols-[300px_1fr]';
    }
  };

  return (
    <NoteProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex-1 p-3 gap-3 overflow-hidden">
          <div className={`grid ${getLayoutClass()} h-full gap-3`}>
            {layoutMode !== 'focus' && (
              <Win98Window 
                title="Notes Explorer" 
                className="h-full"
                minimizable={true}
                maximizable={true}
              >
                <NoteTree />
              </Win98Window>
            )}

            <div className="flex flex-col gap-3 h-full">
              <Win98Window 
                title="Note Editor" 
                className="flex-1"
                minimizable={true}
                maximizable={true}
              >
                <div className="flex h-full">
                  <NoteSidebar />
                  <div className="flex-1 overflow-auto">
                    <MarkdownEditor />
                  </div>
                </div>
              </Win98Window>
            </div>
          </div>

          {showGraph && (
            <div className="fixed inset-0 z-30 flex items-center justify-center">
              <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setShowGraph(false)}></div>
              <Win98Window 
                title="Note Graph" 
                className="w-4/5 h-4/5 z-40"
                minimizable={true}
                maximizable={true}
                onClose={() => setShowGraph(false)}
              >
                <GraphView />
              </Win98Window>
            </div>
          )}

          {showHelp && (
            <div className="fixed inset-0 z-30 flex items-center justify-center">
              <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setShowHelp(false)}></div>
              <Win98Window 
                title="Help" 
                className="w-[450px] h-[450px] z-40"
                onClose={() => setShowHelp(false)}
              >
                <div className="h-full overflow-auto p-4">
                  <h2 className="font-bold text-lg mb-4">RetroNotes Help</h2>
                  
                  <h3 className="font-bold mt-4 mb-2">Getting Started</h3>
                  <p className="mb-2">Welcome to RetroNotes, a retro-style note-taking application inspired by Notion, Obsidian, Trillium, and Joplin!</p>
                  
                  <h3 className="font-bold mt-4 mb-2">Features:</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li>Create hierarchical notes with parent/child relationships</li>
                    <li>Edit notes using Markdown syntax</li>
                    <li>View note relationships in the Graph View</li>
                    <li>Save notes automatically to your browser storage</li>
                    <li>Choose from multiple retro themes (Win98, Cyberpunk, Terminal, Y2K, and more)</li>
                    <li>Tag and organize notes with customizable views</li>
                    <li>Use different sort options to find your notes</li>
                    <li>Favorite important notes for quick access</li>
                  </ul>
                  
                  <h3 className="font-bold mt-4 mb-2">Keyboard Shortcuts:</h3>
                  <div className="win98-inset p-3 mb-4">
                    <p><strong>Ctrl+S</strong>: Save current note while editing</p>
                    <p><strong>Ctrl+B</strong>: Bold text while editing</p>
                    <p><strong>Ctrl+I</strong>: Italic text while editing</p>
                    <p><strong>Ctrl+K</strong>: Insert link while editing</p>
                  </div>
                  
                  <h3 className="font-bold mt-4 mb-2">Wiki Linking:</h3>
                  <div className="win98-inset p-3 mb-4">
                    <p>Use <strong>[[Page Name]]</strong> to create wiki links</p>
                    <p>These links automatically create connections in the graph view</p>
                    <p>Click on a wiki link to navigate directly to that page</p>
                    <p>Create new pages instantly by linking to non-existent pages</p>
                  </div>
                  
                  <h3 className="font-bold mt-4 mb-2">Tips:</h3>
                  <p className="mb-4">
                    To create a child note, click the + button next to a parent note in the Notes Explorer.
                    Notes are automatically saved to your browser's local storage.
                    Use the theme selector to customize your RetroNotes experience!
                  </p>
                  
                  <div className="flex justify-center mt-6">
                    <Win98Button onClick={() => setShowHelp(false)}>Close Help</Win98Button>
                  </div>
                </div>
              </Win98Window>
            </div>
          )}

          <ThemeSelector 
            isOpen={showThemeSelector} 
            onClose={() => setShowThemeSelector(false)} 
          />
          
          <UserProfileMenu
            isOpen={showUserProfile}
            onClose={() => setShowUserProfile(false)}
          />
          
          {showSearch && (
            <div className="fixed inset-0 z-30 flex items-center justify-center">
              <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setShowSearch(false)}></div>
              <Win98Window 
                title="Search Notes" 
                className="w-[500px] z-40"
                onClose={() => setShowSearch(false)}
              >
                <div className="p-4">
                  <div className="win98-inset flex mb-4">
                    <input 
                      type="text" 
                      placeholder="Search for notes..." 
                      className="w-full p-2 bg-transparent outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="win98-window p-2 max-h-[400px] overflow-auto">
                    <p className="text-sm text-center opacity-70">Start typing to search...</p>
                  </div>
                </div>
              </Win98Window>
            </div>
          )}
        </div>
        
        <Taskbar 
          onOpenHelp={() => setShowHelp(true)} 
          onToggleGraph={() => setShowGraph(!showGraph)}
          onOpenThemeSelector={() => setShowThemeSelector(true)}
          onOpenProfile={() => setShowUserProfile(true)}
          onToggleLayout={() => setLayoutMode(prev =>
            prev === 'default' ? 'wide' : prev === 'wide' ? 'focus' : 'default'
          )}
          onOpenSearch={() => setShowSearch(true)}
          layoutMode={layoutMode}
          showGraph={showGraph}
        />
      </div>
    </NoteProvider>
  );
};

export default Index;
