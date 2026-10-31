// The UI's text files that leave the build with a Brotli and a gzip copy next
// to them (apps/ui/scripts/compress.ts), which the server sends to a browser
// that takes them (apps/api/src/middleware/static.ts). Fonts and images come
// compressed already, and the pages' HTML is compressed by nginx on its way out.
export const COMPRESSED_FILE = /\.(js|css|json|svg|md|xml)$/;

// Best first: Brotli comes out about a sixth smaller than gzip on the main script
export const COMPRESSED_COPIES = [
  { encoding: 'br', extension: '.br' },
  { encoding: 'gzip', extension: '.gz' },
] as const;
