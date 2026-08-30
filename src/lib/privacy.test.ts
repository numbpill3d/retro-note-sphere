import { describe, expect, it } from 'vitest';
import { isRemoteResource } from './privacy';

describe('isRemoteResource', () => {
  it.each([
    'https://tracker.example/image.png',
    'http://tracker.example/image.png',
    '//tracker.example/image.png',
  ])('blocks remote URL %s', (source) => {
    expect(isRemoteResource(source)).toBe(true);
  });

  it.each([
    '/images/local.png',
    './images/local.png',
    'data:image/png;base64,AAAA',
    'blob:https://localhost/id',
    undefined,
  ])('allows local or embedded source %s', (source) => {
    expect(isRemoteResource(source)).toBe(false);
  });
});
