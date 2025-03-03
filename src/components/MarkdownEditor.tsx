
import React, { useState, useEffect } from 'react';
import { useNotes } from '../context/NoteContext';
import ReactMarkdown from 'react-markdown';
import Win98Button from './Win98Button';

const MarkdownEditor: React.FC = () => {
  const { currentNote, updateNote } = useNotes();
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
    }
  }, [currentNote]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    if (currentNote) {
      updateNote(currentNote.id, {
        title,
        content
      });
      setEditMode(false);
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      handleSave();
    } else {
      setEditMode(true);
    }
  };

  if (!currentNote) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        <p>Select a note or create a new one to start editing</p>
      </div>
    );
  }

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
        <Win98Button onClick={toggleEditMode} size="sm">
          {editMode ? 'Save' : 'Edit'}
        </Win98Button>
      </div>
      <div className="flex-1 overflow-auto">
        {editMode ? (
          <textarea
            value={content}
            onChange={handleContentChange}
            className="win98-inset w-full h-full p-2 text-sm resize-none focus:outline-none"
            placeholder="Write your note here... Markdown is supported!"
          />
        ) : (
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
      </div>
    </div>
  );
};

export default MarkdownEditor;
