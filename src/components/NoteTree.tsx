
import React, { useState, useEffect } from 'react';
import { useNotes } from '../context/NoteContext';
import { Search, ArrowUpDown, FileText, Plus } from 'lucide-react';
import Win98Button from './Win98Button';
import NoteItem from './notes/NoteItem';
import FilterOptions from './notes/FilterOptions';
import SortOptions from './notes/SortOptions';
import { SortOption, ViewOption } from './notes/types';

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
          <FilterOptions 
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        )}
        
        {showSortOptions && (
          <SortOptions 
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
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
