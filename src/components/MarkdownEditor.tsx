
import React, { useState, useEffect, useRef } from 'react';
import { useNotes } from '../context/NoteContext';
import ReactMarkdown from 'react-markdown';
import Win98Button from './Win98Button';
import { 
  Bold, Italic, List, ListOrdered, Image, Link, Code, 
  Heading1, Heading2, Heading3, CheckSquare, Calendar, Table, 
  Clock, Tag, Upload, ArrowRightLeft, Highlighter
} from 'lucide-react';

const MarkdownEditor: React.FC = () => {
  const { currentNote, updateNote, getNoteChildren } = useNotes();
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('preview');
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
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
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
    textarea.focus();
  };

  const addTag = (tagName: string) => {
    if (!tagName || tags.includes(tagName)) return;
    
    const newTags = [...tags, tagName];
    setTags(newTags);
    if (currentNote) {
      updateNote(currentNote.id, { tags: newTags });
    }
  };

  const removeTag = (tagName: string) => {
    const newTags = tags.filter(tag => tag !== tagName);
    setTags(newTags);
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

  const renderToolbar = () => (
    <div className="win98-window p-1 flex flex-wrap items-center gap-1 border-b border-win98-gray">
      <Win98Button 
        variant="icon" 
        title="Bold (Ctrl+B)"
        icon={<Bold size={16} />}
        onClick={() => insertMarkdown('**{{text}}**')}
      />
      <Win98Button 
        variant="icon" 
        title="Italic (Ctrl+I)"
        icon={<Italic size={16} />}
        onClick={() => insertMarkdown('*{{text}}*')}
      />
      <Win98Button 
        variant="icon"
        title="Heading 1"
        icon={<Heading1 size={16} />}
        onClick={() => insertMarkdown('# {{text}}')}
      />
      <Win98Button 
        variant="icon"
        title="Heading 2"
        icon={<Heading2 size={16} />}
        onClick={() => insertMarkdown('## {{text}}')}
      />
      <Win98Button 
        variant="icon"
        title="Heading 3"
        icon={<Heading3 size={16} />}
        onClick={() => insertMarkdown('### {{text}}')}
      />
      <div className="border-r border-win98-gray mx-1 h-5"></div>
      
      <Win98Button 
        variant="icon"
        title="Bulleted List"
        icon={<List size={16} />}
        onClick={() => insertMarkdown('- {{text}}')}
      />
      <Win98Button 
        variant="icon"
        title="Numbered List"
        icon={<ListOrdered size={16} />}
        onClick={() => insertMarkdown('1. {{text}}')}
      />
      <Win98Button 
        variant="icon"
        title="Todo List"
        icon={<CheckSquare size={16} />}
        onClick={() => insertMarkdown('- [ ] {{text}}')}
      />
      <div className="border-r border-win98-gray mx-1 h-5"></div>
      
      <Win98Button 
        variant="icon"
        title="Link"
        icon={<Link size={16} />}
        onClick={() => insertMarkdown('[{{text}}](url)')}
      />
      <Win98Button 
        variant="icon"
        title="Image"
        icon={<Image size={16} />}
        onClick={() => insertMarkdown('![{{text}}](image_url)')}
      />
      <Win98Button 
        variant="icon"
        title="Code"
        icon={<Code size={16} />}
        onClick={() => insertMarkdown('`{{text}}`')}
      />
      <div className="border-r border-win98-gray mx-1 h-5"></div>
      
      <Win98Button 
        variant="icon"
        title="Table"
        icon={<Table size={16} />}
        onClick={() => insertMarkdown('| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |')}
      />
      <Win98Button 
        variant="icon"
        title="Highlight"
        icon={<Highlighter size={16} />}
        onClick={() => insertMarkdown('=={{text}}==')}
      />
      <Win98Button 
        variant="icon"
        title="Tags"
        icon={<Tag size={16} />}
        onClick={() => setShowTags(!showTags)}
      />
      <div className="flex-1"></div>
      
      <Win98Button 
        size="sm"
        variant={viewMode === 'edit' ? 'primary' : 'default'}
        onClick={() => setViewMode('edit')}
      >
        Edit
      </Win98Button>
      <Win98Button 
        size="sm"
        variant={viewMode === 'preview' ? 'primary' : 'default'}
        onClick={() => { handleSave(); setViewMode('preview'); }}
      >
        Preview
      </Win98Button>
      <Win98Button 
        size="sm"
        variant={viewMode === 'split' ? 'primary' : 'default'}
        onClick={() => setViewMode('split')}
      >
        Split
      </Win98Button>
    </div>
  );

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
        <Win98Button 
          onClick={toggleEditMode} 
          size="sm" 
          icon={editMode ? <ArrowRightLeft size={14} /> : <ArrowRightLeft size={14} />}
        >
          {editMode ? 'Save' : 'Edit'}
        </Win98Button>
      </div>
      
      {editMode && renderToolbar()}
      
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
