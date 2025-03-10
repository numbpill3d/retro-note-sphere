
import React, { useState } from 'react';
import { useNotes, NoteType } from '../context/NoteContext';
import Win98Window from './Win98Window';
import Win98Button from './Win98Button';
import { 
  Link, ArrowLeft, ArrowRight, History, 
  BookOpen, GitFork, ListTree, PlusCircle,
  FileSymlink, Share2, Sparkles, Eye
} from 'lucide-react';
import { WikiPageStatus } from './notes/types';

interface WikiFeaturesProps {
  noteId: string | null;
}

const WikiFeatures: React.FC<WikiFeaturesProps> = ({ noteId }) => {
  const { notes, getNoteById, updateNote } = useNotes();
  const [showBacklinks, setShowBacklinks] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<WikiPageStatus>('draft');

  if (!noteId) return null;
  
  const currentNote = getNoteById(noteId);
  if (!currentNote) return null;

  // Find any backlinks - notes that link to this one
  const findBacklinks = () => {
    return notes.filter(note => 
      note.id !== noteId && 
      note.content.includes(`[${currentNote.title}](#${noteId})`)
    );
  };

  const backlinks = findBacklinks();

  // Extract all internal links from current note
  const extractLinks = (content: string) => {
    const linkRegex = /\[([^\]]+)\]\(#([^)]+)\)/g;
    const links: {title: string, id: string}[] = [];
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      links.push({
        title: match[1],
        id: match[2]
      });
    }
    
    return links;
  };

  const internalLinks = extractLinks(currentNote.content);

  // Generate a table of contents
  const generateTOC = () => {
    const headingRegex = /^(#+)\s+(.+)$/gm;
    const toc: {level: number, text: string}[] = [];
    let match;
    
    while ((match = headingRegex.exec(currentNote.content)) !== null) {
      toc.push({
        level: match[1].length,
        text: match[2].trim()
      });
    }
    
    return toc;
  };

  const handleAddTOC = () => {
    const toc = generateTOC();
    if (toc.length === 0) return;
    
    let tocText = "## Table of Contents\n\n";
    toc.forEach(heading => {
      const indent = "  ".repeat(heading.level - 1);
      tocText += `${indent}- ${heading.text}\n`;
    });
    
    const newContent = `${tocText}\n---\n\n${currentNote.content}`;
    updateNote(currentNote.id, { content: newContent });
  };

  const handleChangeStatus = (status: WikiPageStatus) => {
    setSelectedStatus(status);
    
    // Add status marker at top of document if not already there
    let newContent = currentNote.content;
    if (!newContent.includes("*Wiki Status:")) {
      newContent = `*Wiki Status: ${status}*\n\n${newContent}`;
    } else {
      newContent = newContent.replace(/\*Wiki Status: [a-z]+\*/i, `*Wiki Status: ${status}*`);
    }
    
    updateNote(currentNote.id, { content: newContent });
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="win98-window p-2 border-win98-gray">
        <h4 className="text-xs font-bold mb-2">Wiki Features</h4>
        
        <div className="grid grid-cols-4 gap-2">
          <Win98Button 
            size="sm" 
            className="text-xs flex items-center justify-center"
            onClick={() => setShowBacklinks(!showBacklinks)}
            icon={<FileSymlink size={12} />}
          >
            Backlinks ({backlinks.length})
          </Win98Button>
          
          <Win98Button 
            size="sm" 
            className="text-xs flex items-center justify-center"
            onClick={handleAddTOC}
            icon={<ListTree size={12} />}
          >
            Add TOC
          </Win98Button>
          
          <Win98Button 
            size="sm" 
            className="text-xs flex items-center justify-center"
            onClick={() => setShowHistory(!showHistory)}
            icon={<History size={12} />}
          >
            History
          </Win98Button>
          
          <Win98Button 
            size="sm" 
            className="text-xs flex items-center justify-center"
            onClick={() => {
              // Simple citation feature
              const citation = `\n\n> Source: ${window.location.href}#${noteId}\n> Accessed: ${new Date().toLocaleDateString()}`;
              navigator.clipboard.writeText(citation);
              alert("Citation copied to clipboard!");
            }}
            icon={<Share2 size={12} />}
          >
            Cite
          </Win98Button>
        </div>
        
        <div className="mt-2">
          <div className="flex items-center text-xs font-bold mb-1">
            <Sparkles size={12} className="mr-1" /> Page Status:
          </div>
          <div className="grid grid-cols-3 gap-1">
            <Win98Button 
              size="sm" 
              className={`text-xs ${selectedStatus === 'stub' ? 'bg-theme-highlight text-theme-titlebar-text' : ''}`}
              onClick={() => handleChangeStatus('stub')}
            >
              Stub
            </Win98Button>
            <Win98Button 
              size="sm" 
              className={`text-xs ${selectedStatus === 'draft' ? 'bg-theme-highlight text-theme-titlebar-text' : ''}`}
              onClick={() => handleChangeStatus('draft')}
            >
              Draft
            </Win98Button>
            <Win98Button 
              size="sm" 
              className={`text-xs ${selectedStatus === 'complete' ? 'bg-theme-highlight text-theme-titlebar-text' : ''}`}
              onClick={() => handleChangeStatus('complete')}
            >
              Complete
            </Win98Button>
          </div>
        </div>
      </div>
      
      {showBacklinks && (
        <Win98Window title="Backlinks" className="w-64 absolute right-0 top-10 z-30" onClose={() => setShowBacklinks(false)}>
          <div className="p-2 max-h-60 overflow-auto">
            {backlinks.length > 0 ? (
              <ul className="space-y-1">
                {backlinks.map(link => (
                  <li key={link.id} className="text-xs">
                    <a 
                      className="text-theme-highlight hover:underline cursor-pointer"
                      onClick={() => {
                        setShowBacklinks(false);
                        // Set current note logic would go here
                      }}
                    >
                      {link.title || 'Untitled Note'}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-500">No backlinks found</p>
            )}
          </div>
        </Win98Window>
      )}
      
      {showHistory && (
        <Win98Window title="Page History" className="w-80 absolute right-0 top-10 z-30" onClose={() => setShowHistory(false)}>
          <div className="p-2 max-h-60 overflow-auto">
            <div className="text-xs win98-inset p-2 mb-2">
              <div className="flex justify-between font-bold border-b border-gray-300 pb-1">
                <span>Version</span>
                <span>Date</span>
              </div>
              <div className="py-1 hover:bg-gray-100 cursor-pointer">
                <div className="flex justify-between">
                  <span>v1.0</span>
                  <span>{new Date(currentNote.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-gray-500 mt-1">Initial version</div>
              </div>
              <div className="py-1 hover:bg-gray-100 cursor-pointer">
                <div className="flex justify-between">
                  <span>Current</span>
                  <span>{new Date(currentNote.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="text-gray-500 mt-1">Latest version</div>
              </div>
            </div>
            <div className="flex justify-end">
              <Win98Button size="sm" className="text-xs" onClick={() => setShowHistory(false)}>
                Close
              </Win98Button>
            </div>
          </div>
        </Win98Window>
      )}
      
      {internalLinks.length > 0 && (
        <div className="win98-window p-2">
          <h4 className="text-xs font-bold mb-1">Links in this page ({internalLinks.length})</h4>
          <div className="max-h-20 overflow-auto">
            <ul className="space-y-0.5">
              {internalLinks.map((link, index) => (
                <li key={index} className="text-xs flex items-center">
                  <Link size={10} className="mr-1 text-theme-highlight" />
                  <span className="truncate">{link.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default WikiFeatures;
