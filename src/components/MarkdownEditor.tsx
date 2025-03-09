
import React, { useState, useEffect, useRef } from 'react';
import { useNotes } from '../context/NoteContext';
import ReactMarkdown from 'react-markdown';
import Win98Button from './Win98Button';
import NotionLikeToolbar from './NotionLikeToolbar';
import { 
  Bold, Italic, List, ListOrdered, Image, Link, Code, 
  Heading1, Heading2, Heading3, CheckSquare, Calendar, Table, 
  Clock, Tag, Upload, ArrowRightLeft, Highlighter,
  CloudLightning, Save, Eye, Edit, LayoutGrid, Coffee, SquarePen,
  FileText, Search, Bookmark, Star, History, MoreHorizontal
} from 'lucide-react';

const MarkdownEditor: React.FC = () => {
  const { currentNote, updateNote, getNoteChildren } = useNotes();
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('preview');
  const [showHistory, setShowHistory] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setTags(currentNote.tags || []);
    }
  }, [currentNote]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsSaved(false);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsSaved(false);
    
    // Auto-detect tags with hashtags
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const foundTags = e.target.value.match(hashtagRegex) || [];
    setTags(Array.from(new Set(foundTags.map(tag => tag.substring(1)))));
  };

  const handleSave = () => {
    if (currentNote) {
      updateNote(currentNote.id, {
        title,
        content,
        tags
      });
      setIsSaved(true);
      if (viewMode === 'edit') {
        setViewMode('preview');
      }
      setEditMode(false);
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      handleSave();
    } else {
      setEditMode(true);
      setViewMode('edit');
    }
  };

  const handleToolbarAction = (action: string, template?: string) => {
    if (action === 'format' && template) {
      insertMarkdown(template);
    } else if (action === 'insert' && template) {
      insertText(template);
    } else if (action === 'action' && template === 'uploadImage') {
      // This would ideally open a file dialog
      alert('Image upload would be implemented here');
    }
  };

  const insertText = (text: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const beforeSelection = content.substring(0, start);
    const afterSelection = content.substring(start);
    
    const newText = beforeSelection + text + afterSelection;
    setContent(newText);
    setIsSaved(false);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + text.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertMarkdown = (markdownTemplate: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeSelection = content.substring(0, start);
    const afterSelection = content.substring(end);
    
    let newText;
    let cursorPosition;
    
    if (selectedText) {
      newText = beforeSelection + markdownTemplate.replace('{{text}}', selectedText) + afterSelection;
      cursorPosition = start + markdownTemplate.replace('{{text}}', selectedText).length;
    } else {
      const placeholder = markdownTemplate.replace('{{text}}', 'text');
      newText = beforeSelection + placeholder + afterSelection;
      cursorPosition = start + placeholder.indexOf('text');
      
      // Move cursor to appropriate position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(cursorPosition, cursorPosition + 4);
      }, 0);
    }
    
    setContent(newText);
    setIsSaved(false);
    textarea.focus();
  };

  const addTag = (tagName: string) => {
    if (!tagName || tags.includes(tagName)) return;
    
    const newTags = [...tags, tagName];
    setTags(newTags);
    setIsSaved(false);
    if (currentNote) {
      updateNote(currentNote.id, { tags: newTags });
    }
  };

  const removeTag = (tagName: string) => {
    const newTags = tags.filter(tag => tag !== tagName);
    setTags(newTags);
    setIsSaved(false);
    if (currentNote) {
      updateNote(currentNote.id, { tags: newTags });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Ctrl+S for save
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  if (!currentNote) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        <p>Select a note or create a new one to start editing</p>
      </div>
    );
  }

  const children = getNoteChildren(currentNote.id);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-2 border-b border-win98-gray">
        <div className="flex items-center flex-1">
          {editMode ? (
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="win98-inset flex-1 text-sm px-2 py-1 mr-2 focus:outline-none"
              placeholder="Note title"
            />
          ) : (
            <h3 className="text-sm font-bold truncate">{title || 'Untitled Note'}</h3>
          )}
        </div>
        
        <div className="flex space-x-1">
          {!isSaved && (
            <Win98Button 
              size="sm" 
              icon={<Save size={14} />}
              onClick={handleSave}
              tooltip="Save note"
            >
              Save
            </Win98Button>
          )}
          
          <Win98Button 
            onClick={toggleEditMode} 
            size="sm" 
            icon={editMode ? <Eye size={14} /> : <Edit size={14} />}
            tooltip={editMode ? "Preview" : "Edit"}
          >
            {editMode ? 'Preview' : 'Edit'}
          </Win98Button>
          
          <Win98Button 
            size="sm" 
            icon={<MoreHorizontal size={14} />}
            onClick={() => setShowOptions(!showOptions)}
            tooltip="More options"
          />
        </div>
      </div>
      
      {showOptions && (
        <div className="win98-window absolute right-4 top-16 z-10 shadow-win98 w-48">
          <div className="p-1">
            <Win98Button 
              variant="menu" 
              className="py-1 px-2" 
              size="sm"
              icon={<Star size={14} />}
              onClick={() => alert('Feature would be implemented here')}
            >
              Add to Favorites
            </Win98Button>
            <Win98Button 
              variant="menu" 
              className="py-1 px-2" 
              size="sm"
              icon={<Bookmark size={14} />}
              onClick={() => alert('Feature would be implemented here')}
            >
              Bookmark
            </Win98Button>
            <Win98Button 
              variant="menu" 
              className="py-1 px-2" 
              size="sm"
              icon={<History size={14} />}
              onClick={() => setShowHistory(!showHistory)}
            >
              View History
            </Win98Button>
            <Win98Button 
              variant="menu" 
              className="py-1 px-2" 
              size="sm"
              icon={<Search size={14} />}
              onClick={() => alert('Feature would be implemented here')}
            >
              Search in Note
            </Win98Button>
          </div>
        </div>
      )}
      
      {editMode && (
        <NotionLikeToolbar 
          onAction={handleToolbarAction}
          viewMode={viewMode}
          onViewChange={setViewMode}
        />
      )}
      
      {showTags && (
        <div className="win98-window p-2 border-b border-win98-gray flex flex-wrap gap-1">
          {tags.map((tag) => (
            <div key={tag} className="flex items-center bg-win98-lightgray px-1.5 py-0.5 rounded text-xs">
              #{tag}
              <button 
                className="ml-1 text-xs hover:text-red-600" 
                onClick={() => removeTag(tag)}
              >
                ×
              </button>
            </div>
          ))}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector('input');
              if (input && input.value) {
                addTag(input.value);
                input.value = '';
              }
            }}
            className="inline-flex"
          >
            <input 
              type="text" 
              placeholder="Add tag..." 
              className="win98-inset text-xs px-1.5 py-0.5 w-20 focus:outline-none focus:w-32 transition-all"
            />
          </form>
        </div>
      )}
      
      <div className="flex-1 overflow-auto relative">
        {viewMode === 'edit' && (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            className="win98-inset w-full h-full p-2 text-sm resize-none focus:outline-none"
            placeholder="Write your note here... Markdown is supported!"
          />
        )}
        
        {viewMode === 'preview' && (
          <div className="p-4 win98-inset h-full overflow-auto">
            {content ? (
              <ReactMarkdown className="prose prose-sm max-w-none">
                {content}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-500">No content. Click Edit to start writing.</p>
            )}
          </div>
        )}
        
        {viewMode === 'split' && (
          <div className="flex h-full">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              className="win98-inset w-1/2 h-full p-2 text-sm resize-none focus:outline-none border-r"
              placeholder="Write your note here... Markdown is supported!"
            />
            <div className="p-4 win98-inset w-1/2 h-full overflow-auto">
              {content ? (
                <ReactMarkdown className="prose prose-sm max-w-none">
                  {content}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-500">No content. Click Edit to start writing.</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {children.length > 0 && (
        <div className="p-2 border-t border-win98-gray win98-window">
          <h4 className="text-xs font-bold mb-1">Linked Notes ({children.length})</h4>
          <div className="flex flex-wrap gap-1">
            {children.slice(0, 5).map(child => (
              <Win98Button 
                key={child.id} 
                size="sm" 
                className="text-xs"
                onClick={() => updateNote(currentNote.id, { content: content + `\n\n[${child.title}](#${child.id})` })}
              >
                {child.title || 'Untitled'}
              </Win98Button>
            ))}
            {children.length > 5 && (
              <span className="text-xs text-gray-500">+{children.length - 5} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
