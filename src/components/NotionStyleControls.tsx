
import React from 'react';
import Win98Button from './Win98Button';
import { 
  Grid, List, ListTree, Group, Inbox, StarIcon, 
  Clock, Tag, Filter, Search, Plus, ArrowUpDown, 
  Calendar, Hash
} from 'lucide-react';

interface NotionStyleControlsProps {
  onViewChange: (view: string) => void;
  onFilterToggle: () => void;
  onSortToggle: () => void;
  onSearch: (term: string) => void;
  onCreateNote: () => void;
  currentView: string;
  searchTerm: string;
  className?: string;
}

const NotionStyleControls: React.FC<NotionStyleControlsProps> = ({
  onViewChange,
  onFilterToggle,
  onSortToggle,
  onSearch,
  onCreateNote,
  currentView,
  searchTerm,
  className = '',
}) => {
  const viewOptions = [
    { id: 'all', label: 'All Notes', icon: <ListTree size={14} /> },
    { id: 'favorites', label: 'Favorites', icon: <StarIcon size={14} /> },
    { id: 'recent', label: 'Recent', icon: <Clock size={14} /> },
    { id: 'tags', label: 'Tags', icon: <Tag size={14} /> },
  ];

  return (
    <div className={`p-2 border-b border-win98-gray ${className}`}>
      <div className="flex mb-2">
        <div className="win98-inset flex-1 flex items-center px-2 py-1">
          <Search size={14} className="text-gray-500 mr-1" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
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
            icon={<ListTree size={14} />}
            onClick={() => onFilterToggle()}
          />
          <Win98Button 
            size="sm"
            title="Sort options"
            icon={<ArrowUpDown size={14} />}
            onClick={() => onSortToggle()}
          />
        </div>
        
        <Win98Button 
          size="sm" 
          onClick={onCreateNote}
          title="Create new note"
          icon={<Plus size={14} />}
          variant="primary"
        >
          New
        </Win98Button>
      </div>
      
      <div className="flex mt-2 space-x-1">
        {viewOptions.map((option) => (
          <Win98Button
            key={option.id}
            size="xs"
            variant={currentView === option.id ? 'primary' : 'default'}
            onClick={() => onViewChange(option.id)}
            icon={option.icon}
          >
            {option.label}
          </Win98Button>
        ))}
      </div>
    </div>
  );
};

export default NotionStyleControls;
