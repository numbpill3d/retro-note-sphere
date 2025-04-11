import React, { useState, useEffect, useRef } from 'react';
import { useNotes } from '../context/NoteContext';
import ReactMarkdown from 'react-markdown';
import Win98Button from './Win98Button';
import NotionLikeToolbar from './NotionLikeToolbar';
import WikiFeatures from './WikiFeatures';
import { 
  Bold, Italic, List, ListOrdered, Image, Link, Code, 
  Heading1, Heading2, Heading3, CheckSquare, Calendar, Table, 
  Clock, Tag, Upload, ArrowRightLeft, Highlighter,
  CloudLightning, Save, Eye, Edit, LayoutGrid, Coffee, SquarePen,
  FileText, Search, Bookmark, Star, History, MoreHorizontal,
  BookOpen
} from 'lucide-react';

const MarkdownEditor: React.FC = () => {
  const { currentNote, updateNote, getNoteChildren, createNote } = useNotes();
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('preview');
  const [showHistory, setShowHistory] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [showWikiFeatures, setShowWikiFeatures] = useState(false);
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
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  const handleWikiLinkFormat = () => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const wikiLinkTemplate = `[[${selectedText || 'Page Title'}]]`;
    
    const beforeSelection = content.substring(0, start);
    const afterSelection = content.substring(end);
    const newText = beforeSelection + wikiLinkTemplate + afterSelection;
    
    setContent(newText);
    setIsSaved(false);
    
    setTimeout(() => {
      textarea.focus();
      if (!selectedText) {
        const newCursorPos = start + 2;
        textarea.setSelectionRange(newCursorPos, newCursorPos + 10);
      }
    }, 0);
  };

  const parseWikiLinks = (content: string) => {
    let parsedContent = content;
    const wikiLinkRegex = /\[\[(.+?)\]\]/g;
    
    parsedContent = parsedContent.replace(wikiLinkRegex, (match, linkText) => {
      const linkedNote = currentNote ? getNoteChildren(null).find(note => 
        note.title.toLowerCase() === linkText.toLowerCase()
      ) : null;
      
      if (linkedNote) {
        return `[${linkText}](#${linkedNote.id})`;
      } else {
        return `[${linkText}](#create-note-${linkText.toLowerCase().replace(/\s+/g, '-')})`;
      }
    });
    
    return parsedContent;
  };

  const handleWikiLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#create-note-')) {
      e.preventDefault();
      
      const href = target.getAttribute('href') || '';
      const titleSlug = href.replace('#create-note-', '');
      const title = titleSlug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      const newNote = createNote(currentNote?.id || null);
      updateNote(newNote.id, { title });
      
      const updatedContent = content.replace(
        new RegExp(`\\[\\[${title}\\]\\]`, 'gi'),
        `[[${title}]]`
      );
      
      setContent(updatedContent);
      updateNote(currentNote?.id || '', { content: updatedContent });
    }
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          handleSave();
          break;
        case 'b':
          e.preventDefault();
          insertMarkdown('**{{text}}**');
          break;
        case 'i':
          e.preventDefault();
          insertMarkdown('*{{text}}*');
          break;
        case 'k':
          e.preventDefault();
          insertMarkdown('[{{text}}](url)');
          break;
      }
    }
    
    if (e.key === '[' && textareaRef.current) {
      const textarea = textareaRef.current;
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = content.substring(cursorPos - 1, cursorPos);
      
      if (textBeforeCursor === '[') {
      }
    }
    
    if (e.key === ']' && textareaRef.current) {
      const textarea = textareaRef.current;
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = content.substring(0, cursorPos);
      
      const openBrackets = textBeforeCursor.match(/\[\[(?!\]\])/g);
      const closeBrackets = textBeforeCursor.match(/\]\]/g);
      
      const openCount = openBrackets ? openBrackets.length : 0;
      const closeCount = closeBrackets ? closeBrackets.length : 0;
      
      if (openCount > closeCount) {
        e.preventDefault();
        const newText = content.substring(0, cursorPos) + ']' + content.substring(cursorPos);
        setContent(newText);
        setIsSaved(false);
        
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(cursorPos + 1, cursorPos + 1);
        }, 0);
      }
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
        
        <div className="flex gap-1">
          <Win98Button 
            variant="icon" 
            size="sm"
            onClick={() => setShowWikiFeatures(!showWikiFeatures)}
            tooltip="Wiki Tools"
            icon={<BookOpen size={14} />}
          />
          
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
              className="py-1 px-2 w-full text-left" 
              size="sm"
              icon={<Star size={14} />}
              onClick={() => alert('Feature would be implemented here')}
            >
              Add to Favorites
            </Win98Button>
            <Win98Button 
              variant="menu" 
              className="py-1 px-2 w-full text-left" 
              size="sm"
              icon={<Bookmark size={14} />}
              onClick={() => alert('Feature would be implemented here')}
            >
              Bookmark
            </Win98Button>
            <Win98Button 
              variant="menu" 
              className="py-1 px-2 w-full text-left" 
              size="sm"
              icon={<History size={14} />}
              onClick={() => setShowHistory(!showHistory)}
            >
              View History
            </Win98Button>
            <Win98Button 
              variant="menu" 
              className="py-1 px-2 w-full text-left" 
              size="sm"
              icon={<Search size={14} />}
              onClick={() => alert('Feature would be implemented here')}
            >
              Search in Note
            </Win98Button>
            <Win98Button 
              variant="menu" 
              className="py-1 px-2 w-full text-left" 
              size="sm"
              icon={<Tag size={14} />}
              onClick={() => setShowTags(!showTags)}
            >
              Manage Tags
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
            onKeyDown={(e) => {
              handleKeyDown(e);
              handleEditorKeyDown(e);
            }}
            className="win98-inset w-full h-full p-2 text-sm resize-none focus:outline-none"
            placeholder="Write your note here... Markdown is supported! Use [[double brackets]] to create wiki links."
          />
        )}
        
        {viewMode === 'preview' && (
          <div 
            className="p-4 win98-inset h-full overflow-auto" 
            onClick={handleWikiLinkClick}
          >
            {content ? (
              <ReactMarkdown className="prose prose-sm max-w-none">
                {parseWikiLinks(content)}
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
              onKeyDown={(e) => {
                handleKeyDown(e);
                handleEditorKeyDown(e);
              }}
              className="win98-inset w-1/2 h-full p-2 text-sm resize-none focus:outline-none border-r"
              placeholder="Write your note here... Markdown is supported! Use [[double brackets]] to create wiki links."
            />
            <div 
              className="p-4 win98-inset w-1/2 h-full overflow-auto"
              onClick={handleWikiLinkClick}
            >
              {content ? (
                <ReactMarkdown className="prose prose-sm max-w-none">
                  {parseWikiLinks(content)}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-500">No content. Click Edit to start writing.</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {showWikiFeatures && <WikiFeatures noteId={currentNote.id} />}
      
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
