
import React, { useState } from 'react';
import { useNotes, NoteType } from '../../context/NoteContext';
import { 
  FolderOpen, Folder, File, Plus, Trash2,
  Star, Copy, Pencil 
} from 'lucide-react';
import Win98Button from '../Win98Button';

interface NoteItemProps {
  note: NoteType;
  level: number;
  expandedFolders: Set<string>;
  toggleFolder: (id: string) => void;
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ 
  note, 
  level, 
  expandedFolders, 
  toggleFolder,
  favorites,
  toggleFavorite 
}) => {
  const { notes, currentNote, setCurrentNote, getNoteChildren, createNote, deleteNote, updateNote } = useNotes();
  const children = getNoteChildren(note.id);
  const hasChildren = children.length > 0;
  const isExpanded = expandedFolders.has(note.id);
  const isSelected = currentNote?.id === note.id;
  const isFavorite = favorites.has(note.id);
  const [showActions, setShowActions] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(note.title);

  const handleCreateChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    createNote(note.id);
    toggleFolder(note.id);
  };

  const handleDeleteNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note and all its children?')) {
      deleteNote(note.id);
    }
  };
  
  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
    setNewTitle(note.title);
  };
  
  const submitRename = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateNote(note.id, { title: newTitle });
    setIsRenaming(false);
  };
  
  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newNote = createNote(note.parentId);
    updateNote(newNote.id, { 
      title: `${note.title} (Copy)`,
      content: note.content,
      tags: note.tags
    });
  };

  return (
    <div>
      <div 
        className={`
          group flex items-center px-1 py-0.5 cursor-pointer text-sm relative
          ${isSelected ? 'bg-win98-blue text-white' : 'hover:bg-win98-gray hover:bg-opacity-20'}
        `}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={() => setCurrentNote(note)}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
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
        
        {isRenaming ? (
          <form onSubmit={submitRename} onClick={e => e.stopPropagation()} className="flex-1 mr-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="win98-inset w-full px-1 py-0 text-xs focus:outline-none text-black"
              autoFocus
              onBlur={submitRename}
              onClick={e => e.stopPropagation()}
            />
          </form>
        ) : (
          <span className="truncate flex-1">{note.title || 'Untitled Note'}</span>
        )}
        
        {isFavorite && !isSelected && (
          <Star size={12} className="text-yellow-500 ml-1" />
        )}
        
        {showActions && !isRenaming && (
          <div className="flex opacity-100 group-hover:opacity-100 absolute right-1 bg-inherit">
            <Win98Button
              variant="icon"
              className="p-0.5"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(note.id);
              }}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              icon={<Star size={14} className={isFavorite ? "text-yellow-500" : ""} />}
            />
            <Win98Button
              variant="icon"
              className="p-0.5"
              onClick={handleRename}
              title="Rename note"
              icon={<Pencil size={14} />}
            />
            <Win98Button
              variant="icon"
              className="p-0.5"
              onClick={handleCreateChild}
              title="Create child note"
              icon={<Plus size={14} />}
            />
            <Win98Button
              variant="icon"
              className="p-0.5"
              onClick={handleDuplicate}
              title="Duplicate note"
              icon={<Copy size={14} />}
            />
            <Win98Button
              variant="icon"
              className="p-0.5"
              onClick={handleDeleteNote}
              title="Delete note"
              icon={<Trash2 size={14} />}
            />
          </div>
        )}
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
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteItem;
