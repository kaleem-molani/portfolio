let lastRenderedSvg = '';

export function setLastRenderedSvg(svg: string) {
  lastRenderedSvg = svg;
}

export function getFirstRenderedSvg(): string | null {
  return lastRenderedSvg || null;
}

export function downloadSvg(svgString: string, filename: string) {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function clearDiagramCache() {
  lastRenderedSvg = '';
}
