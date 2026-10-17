import LZString from 'lz-string';
import { DEFAULT_SAMPLE_DOC } from './sample-doc';

const LOCAL_STORAGE_DOC_KEY = 'bbl:diagram-notebook:doc';
const LOCAL_STORAGE_TITLE_KEY = 'bbl:diagram-notebook:title';

export interface DocumentState {
  title: string;
  markdown: string;
}

// Function to extract first heading (# Heading) from markdown to use as auto title
export function extractTitleFromMarkdown(markdown: string): string | null {
  const match = markdown.match(/^\s*#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

export function loadDocumentState(): DocumentState {
  // 1. Try to load from URL search or hash query parameter: /lab?d=<compressed> or #/lab?d=<compressed>
  const searchStr = window.location.search || (window.location.hash.indexOf('?') !== -1 ? window.location.hash.slice(window.location.hash.indexOf('?')) : '');
  if (searchStr) {
    const params = new URLSearchParams(searchStr);
    const compressed = params.get('d');
    if (compressed) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
        if (decompressed) {
          // Decompressed document loaded from URL
          const autoTitle = extractTitleFromMarkdown(decompressed) || 'Shared Diagram';
          return {
            title: autoTitle,
            markdown: decompressed
          };
        }
      } catch (err) {
        console.error('Failed to decompress document from URL query', err);
      }
    }
  }

  // 2. Try to load from localStorage
  const savedDoc = localStorage.getItem(LOCAL_STORAGE_DOC_KEY);
  const savedTitle = localStorage.getItem(LOCAL_STORAGE_TITLE_KEY);

  if (savedDoc) {
    return {
      title: savedTitle || extractTitleFromMarkdown(savedDoc) || 'Untitled diagram',
      markdown: savedDoc
    };
  }

  // 3. Fallback to sample doc
  return {
    title: extractTitleFromMarkdown(DEFAULT_SAMPLE_DOC) || 'User Registration Flow',
    markdown: DEFAULT_SAMPLE_DOC
  };
}

export function saveDocumentState(state: DocumentState) {
  localStorage.setItem(LOCAL_STORAGE_DOC_KEY, state.markdown);
  localStorage.setItem(LOCAL_STORAGE_TITLE_KEY, state.title);
}

export function generateShareUrl(markdown: string): string {
  const compressed = LZString.compressToEncodedURIComponent(markdown);
  return `${window.location.origin}/lab?d=${compressed}`;
}

export function clearDocumentState() {
  localStorage.removeItem(LOCAL_STORAGE_DOC_KEY);
  localStorage.removeItem(LOCAL_STORAGE_TITLE_KEY);
}
