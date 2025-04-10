
import React, { useState } from 'react';
import { useNotes } from '../context/NoteContext';
import Win98Button from './Win98Button';
import { FileText, GitBranch, History, Users, Bookmark, Clipboard, ListTree } from 'lucide-react';
import { WikiPageStatus } from './notes/types';

interface WikiFeaturesProps {
  noteId: string;
}

const WikiFeatures: React.FC<WikiFeaturesProps> = ({ noteId }) => {
  const { getNoteById, updateNote, getBacklinks } = useNotes();
  const note = getNoteById(noteId);
  const backlinks = getBacklinks(noteId);
  const [showHistory, setShowHistory] = useState(false);
  const [showBacklinks, setShowBacklinks] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  
  if (!note) return null;
  
  // Don't display wiki features for folders
  if (note.isFolder) return null;
  
  const wikiStatus = note.wikiStatus || 'stub';
  const contributors = note.contributors || ['User'];
  const version = note.version || 1;
  const history = note.history || [];
  
  const setWikiStatus = (status: WikiPageStatus) => {
    updateNote(noteId, { wikiStatus: status });
  };
  
  const statusColors = {
    stub: 'bg-red-200 text-red-800',
    draft: 'bg-yellow-200 text-yellow-800',
    complete: 'bg-green-200 text-green-800'
  };
  
  return (
    <div className="win98-window p-2 border-t border-win98-gray">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <div className="flex items-center gap-1">
          <span className="text-xs">Status:</span>
          <select
            value={wikiStatus}
            onChange={(e) => setWikiStatus(e.target.value as WikiPageStatus)}
            className="win98-inset text-xs px-1 py-0.5"
          >
            <option value="stub">Stub</option>
            <option value="draft">Draft</option>
            <option value="complete">Complete</option>
          </select>
          <span className={`text-xs px-2 py-0.5 rounded ${statusColors[wikiStatus]}`}>
            {wikiStatus.charAt(0).toUpperCase() + wikiStatus.slice(1)}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <span className="text-xs">v{version}</span>
          <span className="text-xs mx-1">•</span>
          <span className="text-xs">{new Date(note.updatedAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex-1"></div>
        
        <Win98Button
          size="sm"
          icon={<History size={14} />}
          onClick={() => setShowHistory(!showHistory)}
          tooltip="View history"
        >
          History
        </Win98Button>
        
        <Win98Button
          size="sm"
          icon={<GitBranch size={14} />}
          onClick={() => setShowBacklinks(!showBacklinks)}
          tooltip="View backlinks"
        >
          Backlinks ({backlinks.length})
        </Win98Button>
        
        <Win98Button
          size="sm"
          icon={<ListTree size={14} />}
          onClick={() => alert('Table of contents would be implemented here')}
          tooltip="Table of contents"
        >
          TOC
        </Win98Button>
      </div>
      
      {showHistory && (
        <div className="win98-inset p-2 mb-2 text-xs max-h-32 overflow-auto">
          <h4 className="font-bold mb-1">Version History</h4>
          {history.length > 0 ? (
            <ul className="space-y-1">
              {history.map((entry, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>v{index + 1}</span>
                  <span>{new Date(entry.date).toLocaleString()}</span>
                  <Win98Button
                    size="sm"
                    variant="icon"
                    icon={<Clipboard size={12} />}
                    onClick={() => alert('This would restore the selected version')}
                    tooltip="Restore this version"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p>No history available.</p>
          )}
        </div>
      )}
      
      {showBacklinks && (
        <div className="win98-inset p-2 mb-2 text-xs max-h-32 overflow-auto">
          <h4 className="font-bold mb-1">Backlinks</h4>
          {backlinks.length > 0 ? (
            <ul className="space-y-1">
              {backlinks.map(link => (
                <li key={link.id} className="hover:bg-win98-gray hover:bg-opacity-20 p-0.5">
                  <Win98Button
                    variant="ghost"
                    className="text-xs text-left"
                    onClick={() => {
                      // Fixed: Don't try to use a hook inside a callback
                      // Instead, use the imported useNotes methods
                      setCurrentNote(link);
                    }}
                  >
                    {link.title || 'Untitled Note'}
                  </Win98Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No backlinks found.</p>
          )}
        </div>
      )}
      
      <div className="flex items-center gap-1 text-xs">
        <Users size={12} />
        <span>Contributors:</span>
        <div className="flex gap-1">
          {contributors.map((contributor, index) => (
            <span key={index} className="bg-win98-blue text-white px-1 rounded text-xs">
              {contributor}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WikiFeatures;
