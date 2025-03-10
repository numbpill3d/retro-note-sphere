
import React from 'react';
import { ViewOption } from './types';
import { ArrowUpDown, BookMarkIcon, ClockIcon, FilesIcon, HashIcon, FileQuestionIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FilterOptionsProps {
  viewMode: ViewOption;
  setViewMode: (viewMode: ViewOption) => void;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({ viewMode, setViewMode }) => {
  const options = [
    { id: 'all', label: 'All Notes', icon: <FilesIcon size={14} /> },
    { id: 'favorites', label: 'Favorites', icon: <BookMarkIcon size={14} /> },
    { id: 'recent', label: 'Recently Updated', icon: <ClockIcon size={14} /> },
    { id: 'tags', label: 'Tagged Notes', icon: <HashIcon size={14} /> },
    { id: 'untagged', label: 'Untagged Notes', icon: <FileQuestionIcon size={14} /> },
  ];

  return (
    <div className="mt-2 win98-window p-2 text-xs">
      <div className="font-bold mb-2">View</div>
      <div className="flex flex-col space-y-1">
        {options.map(option => (
          <div 
            key={option.id}
            className={cn(
              "flex items-center py-1.5 px-2 cursor-pointer rounded",
              viewMode === option.id 
                ? "win98-window-inset bg-win98-blue text-white" 
                : "hover:bg-win98-gray hover:bg-opacity-20"
            )}
            onClick={() => setViewMode(option.id as ViewOption)}
          >
            <div className="mr-2">{option.icon}</div>
            <span>{option.label}</span>
            {viewMode === option.id && (
              <span className="ml-auto">✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterOptions;
