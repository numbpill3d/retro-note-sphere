
import React, { useState, useEffect } from 'react';
import { useNotes, NoteType } from '../context/NoteContext';
import { 
  FolderOpen, Folder, File, Plus, Trash2, Search,
  Filter, ArrowUpDown, Star, Clock, Tag, Copy, Bookmark,
  FileText, Pencil, MoreHorizontal
} from 'lucide-react';
import Win98Button from './Win98Button';

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
    const newNote = createNote(note.id);
    toggleFolder(note.id); // Expand folder after creating a note
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
  
  const formattedDate = new Date(note.updatedAt).toLocaleDateString();

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

type SortOption = 'title' | 'updated' | 'created';
type ViewOption = 'all' | 'favorites' | 'recent';

const NoteTree: React.FC = () => {
  const { notes, createNote, getNoteChildren } = useNotes();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [viewMode, setViewMode] = useState<ViewOption>('all');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('note-favorites');
    return saved ? new Set(JSON.parse(saved)) : new Set<string>();
  });
  
  useEffect(() => {
    localStorage.setItem('note-favorites', JSON.stringify([...favorites]));
  }, [favorites]);

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
  
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
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
  
  const expandAll = () => {
    const allIds = notes.map(note => note.id);
    setExpandedFolders(new Set(allIds));
  };
  
  const collapseAll = () => {
    setExpandedFolders(new Set());
  };
  
  const filteredNotes = (
    viewMode === 'all' ? rootNotes :
    viewMode === 'favorites' ? notes.filter(note => favorites.has(note.id) && note.parentId === null) :
    notes.filter(note => {
      const updatedDate = new Date(note.updatedAt);
      const now = new Date();
      const daysDiff = (now.getTime() - updatedDate.getTime()) / (1000 * 3600 * 24);
      return daysDiff <= 7 && note.parentId === null;
    })
  ).filter(note => 
    searchTerm ? 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) :
      true
  );
  
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'updated') {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else { // created
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-2 border-b border-win98-gray">
        <h3 className="text-sm font-bold">Notes Explorer</h3>
        <Win98Button 
          size="sm" 
          onClick={handleCreateRootNote}
          title="Create new note"
          icon={<Plus size={14} />}
        >
          New
        </Win98Button>
      </div>
      
      <div className="p-2 border-b border-win98-gray">
        <div className="flex mb-2">
          <div className="win98-inset flex-1 flex items-center px-2 py-1">
            <Search size={14} className="text-gray-500 mr-1" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
        </div>
        
        <div className="flex justify-between">
          <div className="flex space-x-1">
            <Win98Button 
              size="sm"
              title="View options"
              icon={<FileText size={14} />}
              onClick={() => setShowFilterOptions(!showFilterOptions)}
            />
            <Win98Button 
              size="sm"
              title="Sort options"
              icon={<ArrowUpDown size={14} />}
              onClick={() => setShowSortOptions(!showSortOptions)}
            />
          </div>
          
          <div className="flex space-x-1">
            <Win98Button 
              size="sm"
              title="Expand all"
              onClick={expandAll}
            >
              <span className="text-xs">+</span>
            </Win98Button>
            <Win98Button 
              size="sm"
              title="Collapse all"
              onClick={collapseAll}
            >
              <span className="text-xs">-</span>
            </Win98Button>
          </div>
        </div>
        
        {showFilterOptions && (
          <div className="mt-2 win98-window p-2 text-xs">
            <div className="font-bold mb-1">View</div>
            <div className="flex flex-col space-y-1">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  checked={viewMode === 'all'} 
                  onChange={() => setViewMode('all')}
                  className="mr-1"
                />
                All Notes
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  checked={viewMode === 'favorites'} 
                  onChange={() => setViewMode('favorites')}
                  className="mr-1"
                />
                Favorites
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  checked={viewMode === 'recent'} 
                  onChange={() => setViewMode('recent')}
                  className="mr-1"
                />
                Recently Updated
              </label>
            </div>
          </div>
        )}
        
        {showSortOptions && (
          <div className="mt-2 win98-window p-2 text-xs">
            <div className="font-bold mb-1">Sort By</div>
            <div className="flex flex-col space-y-1">
              <label className="flex items-center">
                <input 
                  type="radio" 
                  checked={sortBy === 'title'} 
                  onChange={() => setSortBy('title')}
                  className="mr-1"
                />
                Title
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  checked={sortBy === 'updated'} 
                  onChange={() => setSortBy('updated')}
                  className="mr-1"
                />
                Last Updated
              </label>
              <label className="flex items-center">
                <input 
                  type="radio" 
                  checked={sortBy === 'created'} 
                  onChange={() => setSortBy('created')}
                  className="mr-1"
                />
                Date Created
              </label>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto win98-window-inset p-1">
        {sortedNotes.length === 0 ? (
          <div className="p-2 text-sm text-gray-500">
            {searchTerm ? 'No notes match your search.' : 'No notes yet. Click "New" to create one.'}
          </div>
        ) : (
          sortedNotes.map(note => (
            <NoteItem 
              key={note.id} 
              note={note} 
              level={0} 
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NoteTree;
