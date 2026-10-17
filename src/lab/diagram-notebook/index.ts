import { buildShell } from './shell';
import { initializeEditor } from './editor';
import {
  loadDocumentState,
  saveDocumentState,
  generateShareUrl,
  clearDocumentState,
  extractTitleFromMarkdown
} from './doc-state';
import { renderPreview, initializePreviewEvents } from './preview';
import { getFirstRenderedSvg, downloadSvg, clearDiagramCache } from './diagrams';

import './styles.css';

const DEBOUNCE_DELAY_MS = 200;

export function init(root: HTMLElement): () => void {
  // 1. Build DOM Shell
  const elements = buildShell(root);
  const {
    editorContainer,
    previewContainer,
    titleInput,
    shareBtn,
    resetBtn,
    exportBtn,
    fullscreenBtn,
    divider
  } = elements;

  // 3. Load Document State
  const state = loadDocumentState();
  titleInput.value = state.title;

  let debounceTimer: number | null = null;

  // Debounced preview compilation + localStorage save
  const scheduleRebuild = (markdownContent: string) => {
    if (debounceTimer) {
      window.clearTimeout(debounceTimer);
    }

    debounceTimer = window.setTimeout(() => {
      // Auto-extract title if it starts with a header, otherwise keep user title
      const extractedTitle = extractTitleFromMarkdown(markdownContent);
      if (extractedTitle && titleInput.value === 'Untitled diagram') {
        titleInput.value = extractedTitle;
      }

      saveDocumentState({
        title: titleInput.value,
        markdown: markdownContent
      });

      renderPreview(previewContainer, markdownContent);
    }, DEBOUNCE_DELAY_MS);
  };

  // 4. Mount CodeMirror Editor
  const editorControls = initializeEditor(
    editorContainer,
    state.markdown,
    (content) => {
      scheduleRebuild(content);
    }
  );

  // Initial preview build
  renderPreview(previewContainer, state.markdown);

  // 5. Title input listeners
  const handleTitleChange = () => {
    saveDocumentState({
      title: titleInput.value,
      markdown: editorControls.getDoc()
    });
  };
  titleInput.addEventListener('input', handleTitleChange);

  // 6. Action Button handlers
  // Share link: compresses via lz-string, updates hash, copies to clipboard
  const handleShareClick = async () => {
    const currentDoc = editorControls.getDoc();
    const shareUrl = generateShareUrl(currentDoc);
    
    // Update URL query parameter without triggering page reload
    window.history.replaceState(null, '', shareUrl);

    try {
      await navigator.clipboard.writeText(shareUrl);
      
      // Visual feedback
      const originalHtml = shareBtn.innerHTML;
      shareBtn.innerHTML = `<span class="material-symbols-outlined">done</span>Copied!`;
      shareBtn.style.color = 'var(--color-secondary)';
      setTimeout(() => {
        shareBtn.innerHTML = originalHtml;
        shareBtn.style.color = '';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy share link to clipboard', err);
      alert('Could not copy link automatically. Here is the URL:\n' + shareUrl);
    }
  };
  shareBtn.addEventListener('click', handleShareClick);

  // Reset: restore defaults
  const handleResetClick = () => {
    if (confirm('Are you sure you want to reset this document? All current edits will be lost.')) {
      clearDocumentState();
      clearDiagramCache();
      
      const freshState = loadDocumentState();
      titleInput.value = freshState.title;
      editorControls.setDoc(freshState.markdown);
      
      // Reset hash back to standard lab path
      window.location.hash = '#/lab';
      
      renderPreview(previewContainer, freshState.markdown);
    }
  };
  resetBtn.addEventListener('click', handleResetClick);

  // Export SVG: downloads first diagram
  const handleExportClick = () => {
    const firstSvg = getFirstRenderedSvg();
    if (firstSvg) {
      const docTitle = titleInput.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'diagram';
      downloadSvg(firstSvg, `${docTitle}-export.svg`);
    } else {
      alert('No diagrams are currently rendered to export.');
    }
  };
  exportBtn.addEventListener('click', handleExportClick);

  // Fullscreen toggle: toggles class on the container element
  const container = root.querySelector('.dn-container') as HTMLElement;
  let isFullscreen = false;

  const handleFullscreenClick = () => {
    isFullscreen = !isFullscreen;
    if (isFullscreen) {
      container.classList.add('dn-fullscreen');
      fullscreenBtn.innerHTML = `<span class="material-symbols-outlined">fullscreen_exit</span>Exit fullscreen`;
    } else {
      container.classList.remove('dn-fullscreen');
      fullscreenBtn.innerHTML = `<span class="material-symbols-outlined">fullscreen</span>Full screen`;
    }
  };
  fullscreenBtn.addEventListener('click', handleFullscreenClick);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isFullscreen) {
      isFullscreen = false;
      container.classList.remove('dn-fullscreen');
      fullscreenBtn.innerHTML = `<span class="material-symbols-outlined">fullscreen</span>Full screen`;
    }
  };
  window.addEventListener('keydown', handleKeyDown);

  // Adjustable middle divider dragging logic
  const panes = root.querySelector('.dn-panes') as HTMLElement;
  let isDraggingDivider = false;

  const handleDividerMouseDown = () => {
    isDraggingDivider = true;
    divider.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleDividerMouseMove = (e: MouseEvent) => {
    if (!isDraggingDivider) return;
    const rect = panes.getBoundingClientRect();
    let percent = ((e.clientX - rect.left) / rect.width) * 100;
    
    // Constrain columns so editor or preview do not disappear completely (min 15%, max 85%)
    if (percent < 15) percent = 15;
    if (percent > 85) percent = 85;

    panes.style.gridTemplateColumns = `${percent}% 1px 1fr`;
  };

  const handleDividerMouseUp = () => {
    if (isDraggingDivider) {
      isDraggingDivider = false;
      divider.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  };

  divider.addEventListener('mousedown', handleDividerMouseDown);
  window.addEventListener('mousemove', handleDividerMouseMove);
  window.addEventListener('mouseup', handleDividerMouseUp);

  // 7. Preview click delegation (inline download buttons)
  initializePreviewEvents(previewContainer, () => titleInput.value);

  // Return teardown function
  return () => {
    // Clean up CM6
    editorControls.view.destroy();
    
    // Clear timeout
    if (debounceTimer) {
      window.clearTimeout(debounceTimer);
    }
    
    // Remove listeners
    titleInput.removeEventListener('input', handleTitleChange);
    shareBtn.removeEventListener('click', handleShareClick);
    resetBtn.removeEventListener('click', handleResetClick);
    exportBtn.removeEventListener('click', handleExportClick);
    fullscreenBtn.removeEventListener('click', handleFullscreenClick);
    window.removeEventListener('keydown', handleKeyDown);
    divider.removeEventListener('mousedown', handleDividerMouseDown);
    window.removeEventListener('mousemove', handleDividerMouseMove);
    window.removeEventListener('mouseup', handleDividerMouseUp);
  };
}
