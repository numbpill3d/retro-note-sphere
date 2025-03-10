
import React, { useState } from 'react';
import { SortOption } from './types';
import { ArrowDown, ArrowUp, CalendarCheck, CalendarClock, SortAsc } from 'lucide-react';
import { cn } from '../../lib/utils';
import Win98Button from '../Win98Button';

interface SortOptionsProps {
  sortBy: SortOption;
  setSortBy: (sortBy: SortOption) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ sortBy, setSortBy }) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const toggleDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  const options = [
    { id: 'title', label: 'Title', icon: <SortAsc size={14} /> },
    { id: 'updated', label: 'Last Updated', icon: <CalendarCheck size={14} /> },
    { id: 'created', label: 'Date Created', icon: <CalendarClock size={14} /> },
  ];

  return (
    <div className="mt-2 win98-window p-2 text-xs">
      <div className="font-bold mb-2 flex items-center justify-between">
        <span>Sort By</span>
        <Win98Button 
          size="xs" 
          className="px-1"
          onClick={toggleDirection}
          title={sortDirection === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
        >
          {sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
        </Win98Button>
      </div>
      
      <div className="flex flex-col space-y-1">
        {options.map(option => (
          <div 
            key={option.id}
            className={cn(
              "flex items-center py-1.5 px-2 cursor-pointer rounded",
              sortBy === option.id 
                ? "win98-window-inset bg-win98-blue text-white" 
                : "hover:bg-win98-gray hover:bg-opacity-20"
            )}
            onClick={() => setSortBy(option.id as SortOption)}
          >
            <div className="mr-2">{option.icon}</div>
            <span>{option.label}</span>
            {sortBy === option.id && (
              <span className="ml-auto">✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortOptions;
