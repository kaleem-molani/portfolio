import { renderFlow } from '../diagram-engine';
import { setLastRenderedSvg } from './diagrams.ts';

function setupPanZoom(container: HTMLElement) {
  const svg = container.querySelector('svg');
  if (!svg) return;
  const g = svg.querySelector('.dn-zoom-pan-layer') as SVGGElement;
  if (!g) return;

  container.style.cursor = 'grab';
  container.style.userSelect = 'none';

  let panX = 0;
  let panY = 0;
  let scale = 1.0;

  function updateTransform() {
    g.setAttribute('transform', `translate(${panX}, ${panY}) scale(${scale})`);
  }

  let isPanning = false;
  let startX = 0;
  let startY = 0;

  container.addEventListener('mousedown', (e) => {
    isPanning = true;
    container.style.cursor = 'grabbing';
    startX = e.clientX - panX;
    startY = e.clientY - panY;
  });

  const handleMouseMove = (e: MouseEvent) => {
    // Auto-teardown window listeners if container is removed from DOM
    if (!document.body.contains(container)) {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      return;
    }
    if (!isPanning) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    updateTransform();
  };

  const handleMouseUp = () => {
    if (!document.body.contains(container)) {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      return;
    }
    if (isPanning) {
      isPanning = false;
      container.style.cursor = 'grab';
    }
  };

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.08;
    const rect = svg.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const nextScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;

    if (nextScale < 0.15 || nextScale > 15.0) return;

    // Adjust pan coordinates to center zoom on mouse cursor
    panX = mouseX - (mouseX - panX) * (nextScale / scale);
    panY = mouseY - (mouseY - panY) * (nextScale / scale);
    scale = nextScale;

    updateTransform();
  };

  container.addEventListener('wheel', handleWheel, { passive: false });
}

export function renderPreview(
  previewContainer: HTMLElement,
  markdownSource: string
) {
  // 1. Render the entire markdown document as a single flow diagram
  const res = renderFlow(markdownSource);

  // 2. Cache the SVG for toolbar exports
  setLastRenderedSvg(res.svg);

  // 3. Render inline diagnostics alerts if warnings/errors exist
  let diagnosticsHtml = '';
  if (res.diagnostics && res.diagnostics.length > 0) {
    diagnosticsHtml = res.diagnostics
      .map((d) => `
        <div class="dn-error-block" style="margin: 16px; padding: 12px; border: 1px solid var(--color-error); background-color: var(--color-error-container); color: var(--color-error); font-family: monospace; font-size: 12px;">
          [Line ${d.line || '?'}] ${d.severity.toUpperCase()}: ${d.message}
        </div>
      `)
      .join('');
  }

  // Determine theme and apply matching background to the viewport container
  const theme = markdownSource.match(/theme:\s*(\w+)/)?.[1] || 'light';
  let bgStyle = 'background-color: #FFFFFF;';
  if (theme === 'dark') {
    bgStyle = 'background-color: #141210;';
  } else if (theme === 'glass') {
    bgStyle = 'background: linear-gradient(135deg, #1f1a1a 0%, #121010 100%);';
  }

  // 4. Update preview pane DOM (fill container height)
  previewContainer.innerHTML = `
    <div class="dn-flow" style="width: 100%; height: 100%; flex-grow: 1; display: flex; justify-content: center; align-items: center; overflow: hidden; min-height: 550px; position: relative; ${bgStyle}">
      ${res.svg}
    </div>
    ${diagnosticsHtml}
  `;

  // 5. Initialize mouse pan & zoom interactions on the SVG container
  const targetEl = previewContainer.querySelector('.dn-flow') as HTMLElement;
  if (targetEl) {
    setupPanZoom(targetEl);
  }
}

// Retain empty signature to satisfy index.ts import contract
export function initializePreviewEvents(
  _previewContainer: HTMLElement,
  _getTitle: () => string
) {}
