import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Types
export type NoteType = {
  id: string;
  title: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  tags: string[];
};

type NoteContextType = {
  notes: NoteType[];
  currentNote: NoteType | null;
  createNote: (parentId: string | null) => NoteType;
  updateNote: (id: string, data: Partial<NoteType>) => void;
  deleteNote: (id: string) => void;
  setCurrentNote: (note: NoteType | null) => void;
  getNoteChildren: (parentId: string | null) => NoteType[];
  getNoteById: (id: string) => NoteType | undefined;
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
        content: '# Welcome to RetroNotes\n\nThis is your first note. You can edit it or create a new one.\n\n## Features\n\n- Markdown support\n- Hierarchical organization\n- Retro Windows 98 style\n\nEnjoy taking notes!',
        parentId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['welcome'],
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
    };

    setNotes((prevNotes) => [...prevNotes, newNote]);
    setCurrentNote(newNote);
    return newNote;
  };

  // Update a note
  const updateNote = (id: string, data: Partial<NoteType>) => {
    setNotes((prevNotes) => 
      prevNotes.map((note) => 
        note.id === id 
          ? { 
              ...note, 
              ...data, 
              updatedAt: new Date().toISOString() 
            } 
          : note
      )
    );

    // Update currentNote if it's the one being edited
    if (currentNote?.id === id) {
      setCurrentNote((prev) => 
        prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : prev
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

  const contextValue: NoteContextType = {
    notes,
    currentNote,
    createNote,
    updateNote,
    deleteNote,
    setCurrentNote,
    getNoteChildren,
    getNoteById,
  };

  return (
    <NoteContext.Provider value={contextValue}>
      {children}
    </NoteContext.Provider>
  );
};

export default NoteContext;
