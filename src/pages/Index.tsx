
import React, { useState } from 'react';
import { NoteProvider } from '../context/NoteContext';
import Win98Window from '../components/Win98Window';
import NoteTree from '../components/NoteTree';
import MarkdownEditor from '../components/MarkdownEditor';
import GraphView from '../components/GraphView';
import Taskbar from '../components/Taskbar';
import { X } from 'lucide-react';
import Win98Button from '../components/Win98Button';

const Index = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showGraph, setShowGraph] = useState(false);

  return (
    <NoteProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex-1 flex p-4 gap-4 overflow-hidden">
          <Win98Window 
            title="Notes Explorer" 
            className="w-1/4 h-full"
            minimizable={true}
            maximizable={true}
          >
            <NoteTree />
          </Win98Window>

          <Win98Window 
            title="Note Editor" 
            className="flex-1 h-full"
            minimizable={true}
            maximizable={true}
          >
            <MarkdownEditor />
          </Win98Window>

          {showGraph && (
            <Win98Window 
              title="Note Graph" 
              className="w-1/3 h-full"
              minimizable={true}
              maximizable={true}
              onClose={() => setShowGraph(false)}
            >
              <GraphView />
            </Win98Window>
          )}

          {showHelp && (
            <Win98Window 
              title="Help" 
              className="absolute inset-0 m-auto w-96 h-96 z-50"
              onClose={() => setShowHelp(false)}
            >
              <div className="h-full overflow-auto p-4">
                <h2 className="font-bold text-lg mb-4">RetroNotes Help</h2>
                
                <h3 className="font-bold mt-4 mb-2">Getting Started</h3>
                <p className="mb-2">Welcome to RetroNotes, a Windows 98-style note-taking application!</p>
                
                <h3 className="font-bold mt-4 mb-2">Features:</h3>
                <ul className="list-disc pl-6 mb-4">
                  <li>Create hierarchical notes with parent/child relationships</li>
                  <li>Edit notes using Markdown syntax</li>
                  <li>View note relationships in the Graph View</li>
                  <li>Save notes automatically to your browser storage</li>
                </ul>
                
                <h3 className="font-bold mt-4 mb-2">Keyboard Shortcuts:</h3>
                <div className="win98-inset p-2 mb-4">
                  <p><strong>Ctrl+N</strong>: Create new note</p>
                  <p><strong>Ctrl+S</strong>: Save current note</p>
                  <p><strong>Ctrl+E</strong>: Toggle edit mode</p>
                </div>
                
                <h3 className="font-bold mt-4 mb-2">Tips:</h3>
                <p className="mb-4">
                  To create a child note, click the + button next to a parent note in the Notes Explorer.
                  Notes are automatically saved to your browser's local storage.
                </p>
                
                <div className="flex justify-center mt-6">
                  <Win98Button onClick={() => setShowHelp(false)}>Close Help</Win98Button>
                </div>
              </div>
            </Win98Window>
          )}
        </div>
        <Taskbar 
          onOpenHelp={() => setShowHelp(true)} 
          onToggleGraph={() => setShowGraph(!showGraph)}
          showGraph={showGraph}
        />
      </div>
    </NoteProvider>
  );
};

export default Index;
