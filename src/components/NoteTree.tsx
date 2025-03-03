
import React, { useState } from 'react';
import { useNotes, NoteType } from '../context/NoteContext';
import { FolderOpen, Folder, File, Plus, Trash2 } from 'lucide-react';
import Win98Button from './Win98Button';

interface NoteItemProps {
  note: NoteType;
  level: number;
  expandedFolders: Set<string>;
  toggleFolder: (id: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, level, expandedFolders, toggleFolder }) => {
  const { notes, currentNote, setCurrentNote, getNoteChildren, createNote, deleteNote } = useNotes();
  const children = getNoteChildren(note.id);
  const hasChildren = children.length > 0;
  const isExpanded = expandedFolders.has(note.id);
  const isSelected = currentNote?.id === note.id;

  const handleCreateChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newNote = createNote(note.id);
    toggleFolder(note.id); // Expand folder after creating a note
  };

  const handleDeleteNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note and all its children?')) {
      deleteNote(note.id);
    }
  };

  return (
    <div>
      <div 
        className={`
          flex items-center px-1 py-0.5 cursor-pointer text-sm
          ${isSelected ? 'bg-win98-blue text-white' : 'hover:bg-win98-gray hover:bg-opacity-20'}
        `}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={() => setCurrentNote(note)}
      >
        <div 
          className="mr-1 flex items-center"
          onClick={(e) => {
            if (hasChildren) {
              e.stopPropagation();
              toggleFolder(note.id);
            }
          }}
        >
          {hasChildren ? (
            isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />
          ) : (
            <File size={16} />
          )}
        </div>
        <span className="truncate flex-1">{note.title || 'Untitled Note'}</span>
        <div className="flex opacity-0 group-hover:opacity-100 ml-auto">
          <button
            className="p-0.5 hover:bg-white hover:bg-opacity-30 rounded"
            onClick={handleCreateChild}
            title="Create child note"
          >
            <Plus size={14} />
          </button>
          <button
            className="p-0.5 hover:bg-white hover:bg-opacity-30 rounded"
            onClick={handleDeleteNote}
            title="Delete note"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {isExpanded && hasChildren && (
        <div>
          {children.map(child => (
            <NoteItem 
              key={child.id} 
              note={child} 
              level={level + 1} 
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const NoteTree: React.FC = () => {
  const { notes, createNote, getNoteChildren } = useNotes();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const rootNotes = getNoteChildren(null);

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleCreateRootNote = () => {
    createNote(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-2 border-b border-win98-gray">
        <h3 className="text-sm font-bold">Notes Explorer</h3>
        <Win98Button 
          size="sm" 
          onClick={handleCreateRootNote}
          title="Create new note"
        >
          <Plus size={14} className="mr-1" />
          New
        </Win98Button>
      </div>
      <div className="flex-1 overflow-y-auto win98-window-inset p-1">
        {rootNotes.length === 0 ? (
          <div className="p-2 text-sm text-gray-500">
            No notes yet. Click "New" to create one.
          </div>
        ) : (
          rootNotes.map(note => (
            <NoteItem 
              key={note.id} 
              note={note} 
              level={0} 
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NoteTree;
