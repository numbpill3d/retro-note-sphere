import { describe, expect, it } from 'vitest';
import { extractNoteReferences } from './note-links';

describe('extractNoteReferences', () => {
  it('extracts wiki, advanced relationship, and direct-id links', () => {
    const references = extractNoteReferences(`
[[Basic Concepts]]
(-::- Critical Information -::-)
-x- Related Research -x-
+ Advanced Topics
= Equivalent Concept
/ Alternate Perspective /
// Commentary //
[Stored link](#note-123)
`);

    expect(references.titles).toEqual([
      'Basic Concepts',
      'Critical Information',
      'Related Research',
      'Advanced Topics',
      'Equivalent Concept',
      'Alternate Perspective',
      'Commentary',
    ]);
    expect(references.ids).toEqual(['note-123']);
  });

  it('deduplicates repeated references and ignores malformed markers', () => {
    const references = extractNoteReferences('[[One]] [[One]]\n+ \n[broken](#)');
    expect(references).toEqual({ titles: ['One'], ids: [] });
  });
});
