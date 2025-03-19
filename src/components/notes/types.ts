
export type SortOption = 'title' | 'updated' | 'created';
export type ViewOption = 'all' | 'favorites' | 'recent' | 'tags' | 'untagged';
export type NoteFilter = 'none' | 'today' | 'yesterday' | 'week' | 'month';
export type EditorMode = 'edit' | 'preview' | 'split';
export type NoteDisplay = 'tree' | 'list' | 'card';

/**
 * Available theme variants for the application
 * - win98: Classic Windows 98 style
 * - cyber: Cyberpunk neon style
 * - terminal: Green terminal style
 * - y2k: Year 2000 bubble style
 * - hacker: Matrix-like hacker style
 * - coffee: Coffee shop brown tones
 * - retro: 80s/90s retro art style
 * - minimal: Clean minimal style
 * - vaporwave: Pink/purple 80s aesthetic
 * - forest: Nature-inspired green theme
 * - midnight: Dark blue night theme
 * - bubblegum: Pink bubble gum style
 * - papyrus: Ancient papyrus style
 * - sunshine: Bright yellow/orange theme
 * - ocean: Blue sea tones 
 * - starlight: Space-themed dark with stars
 */
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

/**
 * Wiki page status
 * - stub: Just started, minimal content
 * - draft: Work in progress
 * - complete: Finished and reviewed
 */
export type WikiPageStatus = 'stub' | 'draft' | 'complete';

/**
 * Extended metadata for wiki-like pages
 */
export type WikiPageType = {
  /** Current page status */
  status: WikiPageStatus;
  /** When the page was last modified */
  lastModified: string;
  /** List of users who contributed to the page */
  contributors: string[];
  /** Current version number */
  version: number;
  /** Whether to show table of contents */
  toc: boolean;
  /** Page revision history */
  revisions?: {
    version: number;
    date: string;
    editor: string;
    changes: string;
  }[];
};
