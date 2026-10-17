export interface ShellElements {
  editorContainer: HTMLElement;
  previewContainer: HTMLElement;
  titleInput: HTMLInputElement;
  shareBtn: HTMLButtonElement;
  resetBtn: HTMLButtonElement;
  exportBtn: HTMLButtonElement;
  fullscreenBtn: HTMLButtonElement;
  divider: HTMLElement;
}

export function buildShell(root: HTMLElement): ShellElements {
  // Clear any existing content
  root.innerHTML = '';

  // Container wrapper
  const container = document.createElement('div');
  container.className = 'dn-container';

  // 1. Intro Section
  const intro = document.createElement('div');
  intro.className = 'dn-intro';
  intro.innerHTML = `
    <nav aria-label="Breadcrumb" class="flex text-on-surface-variant font-label-caps" style="font-size: 11px; gap: 8px; align-items: center;">
      <span class="hover:text-primary transition-colors cursor-pointer" onclick="window.location.hash = '#/'">Lab</span>
      <span class="material-symbols-outlined" style="font-size: 14px;">chevron_right</span>
      <span class="text-primary">Diagram Notebook</span>
    </nav>
    <h1>Diagram Notebook</h1>
    <div class="dn-intro-sub">Write in markdown, watch it become a diagram. A small tool I built to think in systems out loud.</div>
  `;
  container.appendChild(intro);

  // 2. Main Frame
  const frame = document.createElement('div');
  frame.className = 'dn-frame';

  // Toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'dn-toolbar';
  
  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'dn-title-wrapper';
  titleWrapper.innerHTML = `
    <span class="material-symbols-outlined dn-title-icon">description</span>
  `;
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'dn-title';
  titleInput.value = 'Untitled diagram';
  titleInput.ariaLabel = 'Document Title';
  titleWrapper.appendChild(titleInput);
  toolbar.appendChild(titleWrapper);

  const actions = document.createElement('div');
  actions.className = 'dn-actions';

  const shareBtn = document.createElement('button');
  shareBtn.className = 'dn-btn';
  shareBtn.innerHTML = `<span class="material-symbols-outlined">share</span>Share link`;
  shareBtn.title = 'Copy a link to this document to your clipboard';
  actions.appendChild(shareBtn);

  const resetBtn = document.createElement('button');
  resetBtn.className = 'dn-btn';
  resetBtn.innerHTML = `<span class="material-symbols-outlined">restart_alt</span>Reset`;
  resetBtn.title = 'Reset this document to the default example';
  actions.appendChild(resetBtn);

  const exportBtn = document.createElement('button');
  exportBtn.className = 'dn-btn';
  exportBtn.innerHTML = `<span class="material-symbols-outlined">download</span>Export SVG`;
  exportBtn.title = 'Export the first rendered diagram as an SVG file';
  actions.appendChild(exportBtn);

  const fullscreenBtn = document.createElement('button');
  fullscreenBtn.className = 'dn-btn';
  fullscreenBtn.innerHTML = `<span class="material-symbols-outlined">fullscreen</span>Full screen`;
  fullscreenBtn.title = 'Toggle distraction-free full page mode';
  actions.appendChild(fullscreenBtn);

  toolbar.appendChild(actions);
  frame.appendChild(toolbar);

  // Panes
  const panes = document.createElement('div');
  panes.className = 'dn-panes show-editor'; // default to editor on mobile

  const editorContainer = document.createElement('div');
  editorContainer.className = 'dn-editor';
  editorContainer.setAttribute('role', 'region');
  editorContainer.setAttribute('aria-label', 'Markdown Editor');
  panes.appendChild(editorContainer);

  const divider = document.createElement('div');
  divider.className = 'dn-divider';
  const handle = document.createElement('div');
  handle.className = 'dn-divider-handle';
  handle.innerHTML = `<span class="material-symbols-outlined" style="font-size: 16px;">drag_indicator</span>`;
  divider.appendChild(handle);
  panes.appendChild(divider);

  const previewContainer = document.createElement('div');
  previewContainer.className = 'dn-preview';
  previewContainer.setAttribute('role', 'region');
  previewContainer.setAttribute('aria-label', 'Live Preview');
  panes.appendChild(previewContainer);

  frame.appendChild(panes);

  // Mobile Tabs Toggles
  const tabs = document.createElement('div');
  tabs.className = 'dn-tabs';

  const writeTabBtn = document.createElement('button');
  writeTabBtn.className = 'dn-tab-btn active';
  writeTabBtn.innerHTML = 'Write';

  const previewTabBtn = document.createElement('button');
  previewTabBtn.className = 'dn-tab-btn';
  previewTabBtn.innerHTML = 'Preview';

  // Mobile tab toggles event listeners
  writeTabBtn.addEventListener('click', () => {
    writeTabBtn.classList.add('active');
    previewTabBtn.classList.remove('active');
    panes.className = 'dn-panes show-editor';
  });

  previewTabBtn.addEventListener('click', () => {
    previewTabBtn.classList.add('active');
    writeTabBtn.classList.remove('active');
    panes.className = 'dn-panes show-preview';
  });

  tabs.appendChild(writeTabBtn);
  tabs.appendChild(previewTabBtn);
  frame.appendChild(tabs);

  container.appendChild(frame);

  // 3. Crosslink Footer
  const crosslinkContainer = document.createElement('div');
  crosslinkContainer.className = 'dn-crosslink-container';
  crosslinkContainer.innerHTML = `
    <a href="#/learnings" class="dn-crosslink">The story behind this tool &rarr;</a>
  `;
  container.appendChild(crosslinkContainer);

  root.appendChild(container);

  return {
    editorContainer,
    previewContainer,
    titleInput,
    shareBtn,
    resetBtn,
    exportBtn,
    fullscreenBtn,
    divider,
  };
}
