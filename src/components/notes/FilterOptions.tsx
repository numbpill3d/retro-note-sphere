
import React from 'react';
import { ViewOption } from './types';

interface FilterOptionsProps {
  viewMode: ViewOption;
  setViewMode: (viewMode: ViewOption) => void;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({ viewMode, setViewMode }) => {
  return (
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
  );
};

export default FilterOptions;
