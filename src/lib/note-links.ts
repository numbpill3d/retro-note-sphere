export type NoteReferences = {
  titles: string[];
  ids: string[];
};

const TITLE_PATTERNS = [
  /\[\[([^\]\n]+)\]\]/g,
  /\(-::-\s*(.*?)\s*-::-\)/g,
  /-x-\s*(.*?)\s*-x-/g,
  /^\+[ \t]+(.+)$/gm,
  /^=[ \t]+(.+)$/gm,
  /^\/[ \t]+(.+?)[ \t]+\/$/gm,
  /^\/\/[ \t]+(.+?)[ \t]+\/\/$/gm,
];

const DIRECT_ID_PATTERN = /\[[^\]]*\]\(#([^)]+)\)/g;

export function extractNoteReferences(content: string): NoteReferences {
  const titles = new Set<string>();
  const ids = new Set<string>();

  for (const pattern of TITLE_PATTERNS) {
    pattern.lastIndex = 0;
    for (const match of content.matchAll(pattern)) {
      const title = match[1]?.trim();
      if (title) titles.add(title);
    }
  }

  DIRECT_ID_PATTERN.lastIndex = 0;
  for (const match of content.matchAll(DIRECT_ID_PATTERN)) {
    const id = match[1]?.trim();
    if (id) ids.add(id);
  }

  return { titles: [...titles], ids: [...ids] };
}
