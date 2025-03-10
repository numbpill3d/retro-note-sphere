
import React from 'react';
import { SortOption } from './types';

interface SortOptionsProps {
  sortBy: SortOption;
  setSortBy: (sortBy: SortOption) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ sortBy, setSortBy }) => {
  return (
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
  );
};

export default SortOptions;
