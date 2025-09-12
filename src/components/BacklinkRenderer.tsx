import React from 'react';
import { useNotes } from '../context/NoteContext';

interface BacklinkRendererProps {
  content: string;
}

const BacklinkRenderer: React.FC<BacklinkRendererProps> = ({ content }) => {
  const { notes, setCurrentNote } = useNotes();

  const renderWithBacklinks = (text: string) => {
    // Define all link patterns
    const patterns = [
      { regex: /\(\-::\-\s*(.*?)\s*\-::\-\)/g, type: 'priority', style: 'priority-link' },
      { regex: /\[\[(.*?)\]\]/g, type: 'wiki', style: 'wiki-link' },
      { regex: /\[(.*?)\](?!\()/g, type: 'quick', style: 'quick-link' },
      { regex: /\-x\-\s*(.*?)\s*\-x\-/g, type: 'cross', style: 'cross-link' },
      { regex: /\+\s+([^\n]+)/g, type: 'additive', style: 'additive-link' },
      { regex: /=\s+([^\n]+)/g, type: 'equivalent', style: 'equivalent-link' },
      { regex: /\/\s*(.*?)\s*\//g, type: 'alternate', style: 'alternate-link' },
      { regex: /\/\/\s*(.*?)\s*\/\//g, type: 'commentary', style: 'commentary-link' }
    ];

    let processedText = text;
    const replacements: Array<{ match: string; replacement: JSX.Element; index: number }> = [];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.regex.exec(text)) !== null) {
        const linkText = match[1].trim();
        const linkedNote = notes.find(note => 
          note.title.toLowerCase() === linkText.toLowerCase()
        );

        if (linkedNote) {
          const replacement = (
            <span
              key={`${pattern.type}-${match.index}`}
              className={`backlink ${pattern.style} cursor-pointer hover:opacity-80 transition-opacity`}
              onClick={() => setCurrentNote(linkedNote)}
              title={`${pattern.type} link to: ${linkText}`}
            >
              {match[0]}
            </span>
          );

          replacements.push({
            match: match[0],
            replacement,
            index: match.index
          });
        }
      }
      pattern.regex.lastIndex = 0; // Reset regex
    });

    // Sort replacements by index (descending) to avoid index shifting
    replacements.sort((a, b) => b.index - a.index);

    // Apply replacements
    let result: (string | JSX.Element)[] = [processedText];
    
    replacements.forEach(({ match, replacement, index }) => {
      const newResult: (string | JSX.Element)[] = [];
      
      result.forEach(item => {
        if (typeof item === 'string') {
          const matchIndex = item.indexOf(match);
          if (matchIndex !== -1) {
            const before = item.substring(0, matchIndex);
            const after = item.substring(matchIndex + match.length);
            
            if (before) newResult.push(before);
            newResult.push(replacement);
            if (after) newResult.push(after);
          } else {
            newResult.push(item);
          }
        } else {
          newResult.push(item);
        }
      });
      
      result = newResult;
    });

    return result;
  };

  return (
    <div className="backlink-content">
      {renderWithBacklinks(content)}
    </div>
  );
};

export default BacklinkRenderer;