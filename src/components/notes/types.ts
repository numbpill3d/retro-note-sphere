
export type SortOption = 'title' | 'updated' | 'created';
export type ViewOption = 'all' | 'favorites' | 'recent' | 'tags' | 'untagged';
export type NoteFilter = 'none' | 'today' | 'yesterday' | 'week' | 'month';
export type EditorMode = 'edit' | 'preview' | 'split';
export type NoteDisplay = 'tree' | 'list' | 'card';
export type ThemeVariant = 
  | 'win98' 
  | 'cyber' 
  | 'terminal' 
  | 'y2k' 
  | 'hacker' 
  | 'coffee' 
  | 'retro' 
  | 'minimal'
  | 'vaporwave'
  | 'forest'
  | 'midnight'
  | 'bubblegum'
  | 'papyrus'
  | 'sunshine'
  | 'ocean'
  | 'starlight';

// Wiki-like feature types
export type BacklinkType = {
  id: string;
  title: string;
  excerpt: string;
};

export type WikiPageStatus = 'stub' | 'draft' | 'complete';

export type WikiPageType = {
  status: WikiPageStatus;
  lastModified: string;
  contributors: string[];
  version: number;
  toc: boolean;
};
