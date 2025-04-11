import React from 'react';
import { useNotes } from '../context/NoteContext';
import Win98Button from './Win98Button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Heading1, 
  Heading2,
  Hash,
  Calendar,
  CheckSquare,
  Table,
  FileSpreadsheet,
  AlignLeft,
  FileText,
  GitFork,
  CornerDownRight,
  Star,
  Tag
} from 'lucide-react';

const NoteSidebar: React.FC = () => {
  const { currentNote } = useNotes();
  
  const handleInsertMarkdown = (markdown: string) => {
    // Get the element that has focus
    const activeElement = document.activeElement as HTMLTextAreaElement;
    
    // Check if the active element is a textarea
    if (activeElement && activeElement.tagName === 'TEXTAREA') {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      const value = activeElement.value;
      
      // Insert markdown at cursor position or wrap selected text
      const newValue = value.substring(0, start) + 
                      (start === end ? markdown : markdown.replace('text', value.substring(start, end))) + 
                      value.substring(end);
      
      // Update the textarea value
      activeElement.value = newValue;
      
      // Trigger input event to update state
      const event = new Event('input', { bubbles: true });
      activeElement.dispatchEvent(event);
      
      // Set focus back to textarea
      activeElement.focus();
      
      // Set cursor position
      if (start === end) {
        // If no text was selected, place cursor within the markdown (like between ** and **)
        const cursorPosition = markdown.indexOf('text');
        if (cursorPosition !== -1) {
          activeElement.selectionStart = start + cursorPosition;
          activeElement.selectionEnd = start + cursorPosition + 4;
        } else {
          // Otherwise place cursor at the end of the inserted text
          activeElement.selectionStart = start + markdown.length;
          activeElement.selectionEnd = start + markdown.length;
        }
      }
    }
  };

  // Button groups
  const textFormatting = [
    { icon: <Bold size={16} />, tooltip: 'Bold (Ctrl+B)', onClick: () => handleInsertMarkdown('**text**') },
    { icon: <Italic size={16} />, tooltip: 'Italic (Ctrl+I)', onClick: () => handleInsertMarkdown('*text*') },
    { icon: <Underline size={16} />, tooltip: 'Underline', onClick: () => handleInsertMarkdown('__text__') },
  ];
  
  const headings = [
    { icon: <Heading1 size={16} />, tooltip: 'Heading 1', onClick: () => handleInsertMarkdown('# Heading') },
    { icon: <Heading2 size={16} />, tooltip: 'Heading 2', onClick: () => handleInsertMarkdown('## Heading') },
  ];
  
  const lists = [
    { icon: <List size={16} />, tooltip: 'Bullet List', onClick: () => handleInsertMarkdown('\n- Item 1\n- Item 2\n- Item 3\n') },
    { icon: <ListOrdered size={16} />, tooltip: 'Numbered List', onClick: () => handleInsertMarkdown('\n1. Item 1\n2. Item 2\n3. Item 3\n') },
    { icon: <CheckSquare size={16} />, tooltip: 'Task List', onClick: () => handleInsertMarkdown('\n- [ ] Task 1\n- [ ] Task 2\n- [x] Completed task\n') },
  ];
  
  const insertions = [
    { icon: <Link size={16} />, tooltip: 'Insert Link (Ctrl+K)', onClick: () => handleInsertMarkdown('[text](url)') },
    { icon: <Image size={16} />, tooltip: 'Insert Image', onClick: () => handleInsertMarkdown('![alt text](image.jpg)') },
    { icon: <Table size={16} />, tooltip: 'Insert Table', onClick: () => handleInsertMarkdown('\n| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n| Cell 3 | Cell 4 |\n') },
  ];
  
  const wiki = [
    { icon: <GitFork size={16} />, tooltip: 'Insert Wiki Link', onClick: () => handleInsertMarkdown('[[Page Name]]') },
    { icon: <CornerDownRight size={16} />, tooltip: 'Block Quote', onClick: () => handleInsertMarkdown('\n> Quoted text\n') },
    { icon: <FileSpreadsheet size={16} />, tooltip: 'Code Block', onClick: () => handleInsertMarkdown('\n```\ncode block\n```\n') },
  ];
  
  const organization = [
    { icon: <Tag size={16} />, tooltip: 'Add Tag', onClick: () => handleInsertMarkdown('#tag') },
    { icon: <Star size={16} />, tooltip: 'Add to Favorites', onClick: () => alert('Favorite feature would be implemented here') },
    { icon: <Calendar size={16} />, tooltip: 'Insert Date', onClick: () => handleInsertMarkdown(new Date().toLocaleDateString()) },
  ];
  
  if (!currentNote) return null;

  return (
    <div className="win98-window border-r w-[46px] flex flex-col items-center py-2 gap-3 overflow-y-auto">
      {/* Text formatting */}
      <div className="flex flex-col gap-1">
        {textFormatting.map((button, index) => (
          <Win98Button
            key={index}
            variant="icon"
            title={button.tooltip}
            onClick={button.onClick}
            className="h-8 w-8"
          >
            {button.icon}
          </Win98Button>
        ))}
      </div>
      
      <div className="w-full h-px bg-win98-gray my-1"></div>
      
      {/* Headings */}
      <div className="flex flex-col gap-1">
        {headings.map((button, index) => (
          <Win98Button
            key={index}
            variant="icon"
            title={button.tooltip}
            onClick={button.onClick}
            className="h-8 w-8"
          >
            {button.icon}
          </Win98Button>
        ))}
      </div>
      
      <div className="w-full h-px bg-win98-gray my-1"></div>
      
      {/* Lists */}
      <div className="flex flex-col gap-1">
        {lists.map((button, index) => (
          <Win98Button
            key={index}
            variant="icon"
            title={button.tooltip}
            onClick={button.onClick}
            className="h-8 w-8"
          >
            {button.icon}
          </Win98Button>
        ))}
      </div>
      
      <div className="w-full h-px bg-win98-gray my-1"></div>
      
      {/* Insertions */}
      <div className="flex flex-col gap-1">
        {insertions.map((button, index) => (
          <Win98Button
            key={index}
            variant="icon"
            title={button.tooltip}
            onClick={button.onClick}
            className="h-8 w-8"
          >
            {button.icon}
          </Win98Button>
        ))}
      </div>
      
      <div className="w-full h-px bg-win98-gray my-1"></div>
      
      {/* Wiki features */}
      <div className="flex flex-col gap-1">
        {wiki.map((button, index) => (
          <Win98Button
            key={index}
            variant="icon"
            title={button.tooltip}
            onClick={button.onClick}
            className="h-8 w-8"
          >
            {button.icon}
          </Win98Button>
        ))}
      </div>
      
      <div className="w-full h-px bg-win98-gray my-1"></div>
      
      {/* Organization */}
      <div className="flex flex-col gap-1">
        {organization.map((button, index) => (
          <Win98Button
            key={index}
            variant="icon"
            title={button.tooltip}
            onClick={button.onClick}
            className="h-8 w-8"
          >
            {button.icon}
          </Win98Button>
        ))}
      </div>
    </div>
  );
};

export default NoteSidebar;
