/**
 * Resolves a public asset path using Vite's base URL.
 * In dev: base = '/' → '/cards/the-fool.png'
 * On GitHub Pages: base = '/Tarot-reader/' → '/Tarot-reader/cards/the-fool.png'
 */
export function resolveAssetPath(path: string): string {
  const base = import.meta.env.BASE_URL;
  // Remove leading slash from path to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}
