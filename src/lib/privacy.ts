export function isRemoteResource(source: string | undefined): boolean {
  return typeof source === 'string' && /^(https?:)?\/\//i.test(source.trim());
}
