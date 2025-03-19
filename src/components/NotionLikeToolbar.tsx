
import React from 'react';
import Win98Button from './Win98Button';
import { 
  Bold, Italic, List, ListOrdered, Image, Link, Code, 
  Heading1, Heading2, Heading3, CheckSquare, Calendar, Table, 
  BoldIcon, PanelLeft, Columns, SplitSquareVertical, FileText, 
  Tag, Quote, FileImage, Coffee, TerminalSquare
} from 'lucide-react';

interface NotionLikeToolbarProps {
  onAction: (action: string, template?: string) => void;
  viewMode: 'edit' | 'preview' | 'split';
  onViewChange: (mode: 'edit' | 'preview' | 'split') => void;
}

const NotionLikeToolbar: React.FC<NotionLikeToolbarProps> = ({ 
  onAction, 
  viewMode,
  onViewChange
}) => {
  // Define toolbar action groups
  const actionGroups = [
    {
      name: 'format',
      actions: [
        { icon: <BoldIcon size={16} />, action: 'format', template: '**{{text}}**', tooltip: 'Bold (Ctrl+B)' },
        { icon: <Italic size={16} />, action: 'format', template: '*{{text}}*', tooltip: 'Italic (Ctrl+I)' },
        { icon: <Code size={16} />, action: 'format', template: '`{{text}}`', tooltip: 'Code (Ctrl+`)' },
        { icon: <Quote size={16} />, action: 'format', template: '> {{text}}', tooltip: 'Quote' },
      ]
    },
    {
      name: 'headings',
      actions: [
        { icon: <Heading1 size={16} />, action: 'format', template: '# {{text}}', tooltip: 'Heading 1' },
        { icon: <Heading2 size={16} />, action: 'format', template: '## {{text}}', tooltip: 'Heading 2' },
        { icon: <Heading3 size={16} />, action: 'format', template: '### {{text}}', tooltip: 'Heading 3' },
      ]
    },
    {
      name: 'lists',
      actions: [
        { icon: <List size={16} />, action: 'format', template: '- {{text}}', tooltip: 'Bulleted List' },
        { icon: <ListOrdered size={16} />, action: 'format', template: '1. {{text}}', tooltip: 'Numbered List' },
        { icon: <CheckSquare size={16} />, action: 'format', template: '- [ ] {{text}}', tooltip: 'Todo List' },
      ]
    },
    {
      name: 'insert',
      actions: [
        { icon: <Table size={16} />, action: 'insert', template: '| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |', tooltip: 'Table' },
        { icon: <Link size={16} />, action: 'format', template: '[{{text}}](url)', tooltip: 'Link' },
        { icon: <Image size={16} />, action: 'format', template: '![{{text}}](image_url)', tooltip: 'Image' },
        { icon: <Calendar size={16} />, action: 'insert', template: `Date: ${new Date().toISOString().split('T')[0]}`, tooltip: 'Date' },
        { icon: <FileImage size={16} />, action: 'action', template: 'uploadImage', tooltip: 'Upload Image' },
      ]
    },
    {
      name: 'blocks',
      actions: [
        { icon: <Coffee size={16} />, action: 'insert', template: '```\n// Code block\nconst hello = "world";\n```', tooltip: 'Code Block' },
        { icon: <TerminalSquare size={16} />, action: 'insert', template: '```bash\n# Terminal command\necho "Hello"\n```', tooltip: 'Terminal Block' },
      ]
    },
    {
      name: 'view',
      actions: [
        { icon: <FileText size={16} />, action: 'view', template: 'edit', active: viewMode === 'edit', tooltip: 'Edit Mode' },
        { icon: <PanelLeft size={16} />, action: 'view', template: 'preview', active: viewMode === 'preview', tooltip: 'Preview Mode' },
        { icon: <Columns size={16} />, action: 'view', template: 'split', active: viewMode === 'split', tooltip: 'Split Mode' },
      ]
    }
  ];

  // Render a group of toolbar buttons
  const renderToolbarGroup = (group: any, isLast = false) => (
    <div key={group.name} className="flex items-center">
      <div className="flex items-center space-x-0.5">
        {group.actions.map((item: any, index: number) => (
          <Win98Button 
            key={index}
            variant="toolbar" 
            size="icon"
            icon={item.icon}
            active={item.active}
            tooltip={item.tooltip}
            onClick={() => {
              if (item.action === 'view') {
                onViewChange(item.template as any);
              } else {
                onAction(item.action, item.template);
              }
            }}
          />
        ))}
      </div>
      {!isLast && <div className="border-r border-win98-gray mx-1 h-5"></div>}
    </div>
  );

  return (
    <div className="win98-window p-1 flex flex-wrap items-center gap-1 border-b border-win98-gray">
      {actionGroups.slice(0, -1).map(group => renderToolbarGroup(group))}
      <div className="flex-1"></div>
      {renderToolbarGroup(actionGroups[actionGroups.length - 1], true)}
    </div>
  );
};

export default NotionLikeToolbar;
