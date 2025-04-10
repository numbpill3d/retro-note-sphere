
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WikiPageStatus } from '../components/notes/types';

// Types
export type NoteType = {
  id: string;
  title: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  wikiStatus?: WikiPageStatus;
  contributors?: string[];
  version?: number;
  history?: { date: string; content: string; title: string }[];
  isFolder?: boolean;
};

type NoteContextType = {
  notes: NoteType[];
  currentNote: NoteType | null;
  createNote: (parentId: string | null) => NoteType;
  createFolder: (parentId: string | null) => NoteType;
  updateNote: (id: string, data: Partial<NoteType>) => void;
  deleteNote: (id: string) => void;
  setCurrentNote: (note: NoteType | null) => void;
  getNoteChildren: (parentId: string | null) => NoteType[];
  getNoteById: (id: string) => NoteType | undefined;
  getBacklinks: (noteId: string) => NoteType[];
};

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};

const STORAGE_KEY = 'retro-notes-data';

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [currentNote, setCurrentNote] = useState<NoteType | null>(null);

  // Load notes from localStorage on initial render
  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
        
        // Set first note as current if available
        if (parsedNotes.length > 0 && !currentNote) {
          setCurrentNote(parsedNotes[0]);
        }
      } catch (error) {
        console.error('Failed to parse saved notes:', error);
      }
    } else {
      // Create a default welcome note if no notes exist
      const welcomeNote: NoteType = {
        id: uuidv4(),
        title: 'Welcome to RetroNotes',
        content: '# Welcome to RetroNotes\n\n*Wiki Status: complete*\n\nThis is your first note. You can edit it or create a new one.\n\n## Features\n\n- Markdown support\n- Hierarchical organization\n- Retro Windows 98 style\n- Wiki-like features\n\nEnjoy taking notes!',
        parentId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['welcome'],
        wikiStatus: 'complete',
        contributors: ['System'],
        version: 1,
        history: [
          {
            date: new Date().toISOString(),
            content: '# Welcome to RetroNotes\n\nThis is your first note. You can edit it or create a new one.',
            title: 'Welcome to RetroNotes'
          }
        ]
      };
      
      setNotes([welcomeNote]);
      setCurrentNote(welcomeNote);
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes]);

  // Create a new note
  const createNote = (parentId: string | null) => {
    const newNote: NoteType = {
      id: uuidv4(),
      title: 'Untitled Note',
      content: '',
      parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      wikiStatus: 'stub',
      contributors: ['User'],
      version: 1,
      history: [
        {
          date: new Date().toISOString(),
          content: '',
          title: 'Untitled Note'
        }
      ],
      isFolder: false
    };

    setNotes((prevNotes) => [...prevNotes, newNote]);
    setCurrentNote(newNote);
    return newNote;
  };
  
  // Create a new folder
  const createFolder = (parentId: string | null) => {
    const newFolder: NoteType = {
      id: uuidv4(),
      title: 'New Folder',
      content: '',
      parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      isFolder: true,
      wikiStatus: 'complete',
      contributors: ['User'],
      version: 1
    };
    
    setNotes((prevNotes) => [...prevNotes, newFolder]);
    
    // We don't set the folder as the current note since it's not editable content
    return newFolder;
  };

  // Update a note
  const updateNote = (id: string, data: Partial<NoteType>) => {
    setNotes((prevNotes) => 
      prevNotes.map((note) => {
        if (note.id === id) {
          // Create history entry if content or title is changed
          const updatedHistory = note.history || [];
          if ((data.content && data.content !== note.content) ||
              (data.title && data.title !== note.title)) {
            updatedHistory.push({
              date: new Date().toISOString(),
              content: data.content || note.content,
              title: data.title || note.title,
            });
          }
          
          // Update version number
          const updatedVersion = updatedHistory.length > (note.history?.length || 0) 
            ? (note.version || 1) + 1 
            : note.version || 1;
            
          return { 
            ...note, 
            ...data, 
            updatedAt: new Date().toISOString(),
            history: updatedHistory,
            version: updatedVersion
          };
        }
        return note;
      })
    );

    // Update currentNote if it's the one being edited
    if (currentNote?.id === id) {
      setCurrentNote((prev) => 
        prev ? { 
          ...prev, 
          ...data, 
          updatedAt: new Date().toISOString(),
          version: prev.version ? prev.version + 1 : 1
        } : prev
      );
    }
  };

  // Delete a note and all its children
  const deleteNote = (id: string) => {
    // Function to collect all child note IDs recursively
    const getChildIds = (noteId: string): string[] => {
      const children = notes.filter(note => note.parentId === noteId);
      const childIds = children.map(child => child.id);
      
      const descendantIds = children.flatMap(child => getChildIds(child.id));
      return [...childIds, ...descendantIds];
    };
    
    // Get all descendants of the note to be deleted
    const childIds = getChildIds(id);
    const idsToDelete = [id, ...childIds];
    
    setNotes(prevNotes => prevNotes.filter(note => !idsToDelete.includes(note.id)));
    
    // Reset currentNote if it's being deleted
    if (currentNote?.id === id || childIds.includes(currentNote?.id || '')) {
      const remainingNotes = notes.filter(note => !idsToDelete.includes(note.id));
      setCurrentNote(remainingNotes.length > 0 ? remainingNotes[0] : null);
    }
  };

  // Get all children of a note
  const getNoteChildren = (parentId: string | null) => {
    return notes.filter(note => note.parentId === parentId);
  };

  // Get a note by its ID
  const getNoteById = (id: string) => {
    return notes.find(note => note.id === id);
  };

  // Get all notes that link to the given noteId
  const getBacklinks = (noteId: string) => {
    return notes.filter(note => 
      note.id !== noteId && 
      (note.content.includes(`[](#${noteId})`) || 
       note.content.includes(`#${noteId}`))
    );
  };

  const contextValue: NoteContextType = {
    notes,
    currentNote,
    createNote,
    createFolder,
    updateNote,
    deleteNote,
    setCurrentNote,
    getNoteChildren,
    getNoteById,
    getBacklinks,
  };

  return (
    <NoteContext.Provider value={contextValue}>
      {children}
    </NoteContext.Provider>
  );
};

export default NoteContext;
