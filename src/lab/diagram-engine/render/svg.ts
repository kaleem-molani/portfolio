import type { LayoutResult } from '../types';

export function toSvg(layout: LayoutResult, themeName: 'glass' | 'dark' | 'light'): string {
  const { width, height, nodes, edges, groups } = layout;

  // Define Theme Colors
  let bgFill = '#FFFFFF';
  let bgStyle = '';
  let nodeFill = '#F3ECE0'; // parchment
  let nodeBorder = '#2B2622'; // ink
  let textColor = '#2B2622';
  let arrowColor = '#C8643C'; // terracotta
  let groupFill = '#FDFBF7';
  let groupBorder = '#E5DEC9';
  let groupTitleColor = '#2B2622';
  let effectDefs = '';
  let filterAttr = '';

  if (themeName === 'dark') {
    bgFill = '#141210';
    nodeFill = '#2B2622';
    nodeBorder = '#E5DEC9';
    textColor = '#E5DEC9';
    arrowColor = '#C8643C';
    groupFill = '#1C1917';
    groupBorder = '#403833';
    groupTitleColor = '#E5DEC9';
  } else if (themeName === 'glass') {
    bgFill = 'url(#glass-bg-grad)';
    bgStyle = 'background: linear-gradient(135deg, #1f1a1a 0%, #121010 100%);';
    nodeFill = 'rgba(255, 255, 255, 0.08)';
    nodeBorder = 'rgba(255, 255, 255, 0.2)';
    textColor = '#FFFFFF';
    arrowColor = '#4fc3f7'; // neon sky blue
    groupFill = 'rgba(255, 255, 255, 0.03)';
    groupBorder = 'rgba(255, 255, 255, 0.1)';
    groupTitleColor = 'rgba(255, 255, 255, 0.8)';
    
    // Glassmorphism filters and linear gradient backgrounds
    effectDefs = `
    <linearGradient id="glass-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1f1a1a" />
      <stop offset="100%" stop-color="#121010" />
    </linearGradient>
    <filter id="glass-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.3   0 0 0 0 0.76  0 0 0 0 0.97  0 0 0 0.15 0" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    `;
    filterAttr = 'filter="url(#glass-glow)"';
  }

  const svgLines: string[] = [];

  // 1. Root SVG Element with style bindings for HMR viewport container sizing
  svgLines.push(`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${width} ${height}" style="${bgStyle}">`);

  // 2. Definitions
  svgLines.push('  <defs>');
  if (effectDefs) {
    svgLines.push(effectDefs);
  }
  svgLines.push(`    <marker id="arrow-forward" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">`);
  svgLines.push(`      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="${arrowColor}" />`);
  svgLines.push('    </marker>');
  svgLines.push(`    <marker id="arrow-backward" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">`);
  svgLines.push(`      <path d="M 10 1.5 L 2 5 L 10 8.5 z" fill="${arrowColor}" />`);
  svgLines.push('    </marker>');
  svgLines.push('  </defs>');

  // 3. Backdrop Background Rect (fills viewport with theme color)
  svgLines.push(`  <rect width="${width}" height="${height}" fill="${bgFill}" />`);

  // Wrap all drawable elements in a panning/zooming group
  svgLines.push('  <g class="dn-zoom-pan-layer">');

  // 4. Backdrop Groups (render outermost first)
  const sortedGroups = [...groups].sort((a, b) => a.level - b.level);
  for (const group of sortedGroups) {
    const fill = group.styles?.fill || groupFill;
    const stroke = group.styles?.stroke || groupBorder;
    const strokeWidth = group.styles?.['stroke-width'] || '1.5';
    
    // Draw container rectangle
    svgLines.push(`  <rect x="${group.ax}" y="${group.ay}" width="${group.width}" height="${group.height}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" rx="4" ry="4" style="backdrop-filter: blur(4px);" />`);
    
    // Draw heading text label
    svgLines.push(`  <text x="${group.ax + 16}" y="${group.ay + 22}" font-family="Karla, sans-serif" font-size="14px" fill="${groupTitleColor}" font-weight="700">${group.name}</text>`);
  }

  // 5. Connection Edges (Bezier Curves + Labels)
  for (const edge of edges) {
    if (edge.points.length === 4) {
      const P0 = edge.points[0];
      const P1 = edge.points[1];
      const P2 = edge.points[2];
      const P3 = edge.points[3];

      // Shorten endpoints to accommodate arrowheads
      let startPoint = { ...P0 };
      let endPoint = { ...P3 };

      // Shorten forward end
      const dx32 = P3.x - P2.x;
      const dy32 = P3.y - P2.y;
      const len32 = Math.sqrt(dx32 * dx32 + dy32 * dy32);
      if (len32 > 0) {
        endPoint.x = P3.x - (dx32 / len32) * 6;
        endPoint.y = P3.y - (dy32 / len32) * 6;
      }

      // Shorten backward end (for bidirectional `<->` or reverse `<-`)
      const dx10 = P1.x - P0.x;
      const dy10 = P1.y - P0.y;
      const len10 = Math.sqrt(dx10 * dx10 + dy10 * dy10);
      if (len10 > 0 && (edge.arrowStyle === '<->' || edge.arrowStyle === '<-')) {
        startPoint.x = P0.x + (dx10 / len10) * 6;
        startPoint.y = P0.y + (dy10 / len10) * 6;
      }

      // Determine markers
      let markerEndAttr = '';
      let markerStartAttr = '';
      if (edge.arrowStyle === '->' || edge.arrowStyle === '-->') {
        markerEndAttr = 'marker-end="url(#arrow-forward)"';
      } else if (edge.arrowStyle === '<-') {
        markerStartAttr = 'marker-start="url(#arrow-backward)"';
      } else if (edge.arrowStyle === '<->') {
        markerStartAttr = 'marker-start="url(#arrow-backward)"';
        markerEndAttr = 'marker-end="url(#arrow-forward)"';
      }

      // Stroke dash bindings
      let dashAttr = '';
      if (edge.arrowStyle === '-->') {
        dashAttr = 'stroke-dasharray="5,5"';
      }

      const strokeColor = edge.styles?.stroke || arrowColor;
      const strokeW = edge.styles?.['stroke-width'] || '1.5';

      // Draw cubic Bezier curve
      svgLines.push(`  <path d="M ${startPoint.x} ${startPoint.y} C ${P1.x} ${P1.y}, ${P2.x} ${P2.y}, ${endPoint.x} ${endPoint.y}" fill="none" stroke="${strokeColor}" stroke-width="${strokeW}" ${dashAttr} ${markerStartAttr} ${markerEndAttr} />`);

      // Draw midpoint label if provided
      if (edge.label && edge.labelPos) {
        const labelText = edge.label;
        const labelW = labelText.length * 6.5 + 8;
        const labelH = 16;
        const lx = edge.labelPos.x - labelW / 2;
        const ly = edge.labelPos.y - labelH / 2;

        const labelBg = themeName === 'dark' ? '#1c1917' : (themeName === 'glass' ? 'rgba(20,20,20,0.85)' : '#fdfbf7');
        const labelStroke = themeName === 'glass' ? 'rgba(255,255,255,0.1)' : '#e5dec9';
        
        svgLines.push(`  <rect x="${lx}" y="${ly}" width="${labelW}" height="${labelH}" fill="${labelBg}" stroke="${labelStroke}" stroke-width="1" rx="3" ry="3" />`);
        svgLines.push(`  <text x="${edge.labelPos.x}" y="${edge.labelPos.y}" font-family="Karla, sans-serif" font-size="10px" fill="${textColor}" text-anchor="middle" dominant-baseline="central">${labelText}</text>`);
      }
    }
  }

  // 6. Foreground Nodes (8 Custom Shapes)
  for (const node of nodes) {
    const fill = node.styles?.fill || nodeFill;
    const stroke = node.styles?.stroke || nodeBorder;
    const strokeW = node.styles?.['stroke-width'] || '1.5';
    
    const x = node.ax;
    const y = node.ay;
    const w = node.width;
    const h = node.height;

    // Outer Shape geometry dispatch
    if (node.shape === 'roundrect') {
      svgLines.push(`  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" rx="8" ry="8" ${filterAttr} />`);
    } else if (node.shape === 'circle') {
      const radius = Math.min(w, h) / 2;
      svgLines.push(`  <circle cx="${x + w / 2}" cy="${y + h / 2}" r="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" ${filterAttr} />`);
    } else if (node.shape === 'oval') {
      svgLines.push(`  <ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" ${filterAttr} />`);
    } else if (node.shape === 'diamond') {
      const pts = `${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}`;
      svgLines.push(`  <polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" ${filterAttr} />`);
    } else if (node.shape === 'database' || node.shape === 'cylinder') {
      const lidH = Math.min(8, h * 0.2);
      // Side and bottom walls path
      const cylinderPath = `M ${x} ${y + lidH} L ${x} ${y + h - lidH} A ${w / 2} ${lidH} 0 0 0 ${x + w} ${y + h - lidH} L ${x + w} ${y + lidH} A ${w / 2} ${lidH} 0 0 1 ${x} ${y + lidH}`;
      svgLines.push(`  <path d="${cylinderPath}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" ${filterAttr} />`);
      // Top lid ellipse
      svgLines.push(`  <ellipse cx="${x + w / 2}" cy="${y + lidH}" rx="${w / 2}" ry="${lidH}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" />`);
    } else if (node.shape === 'cloud') {
      // Draw standard multi-arc cloud path enclosing bounds
      const cloudPath = `
        M ${x + w * 0.2} ${y + h * 0.75}
        A ${h * 0.25} ${h * 0.25} 0 0 1 ${x + w * 0.1} ${y + h * 0.45}
        A ${h * 0.3} ${h * 0.3} 0 0 1 ${x + w * 0.4} ${y + h * 0.15}
        A ${h * 0.35} ${h * 0.35} 0 0 1 ${x + w * 0.75} ${y + h * 0.2}
        A ${h * 0.25} ${h * 0.25} 0 0 1 ${x + w * 0.9} ${y + h * 0.55}
        A ${h * 0.22} ${h * 0.22} 0 0 1 ${x + w * 0.7} ${y + h * 0.85}
        A ${h * 0.22} ${h * 0.22} 0 0 1 ${x + w * 0.25} ${y + h * 0.85}
        Z
      `.replace(/\s+/g, ' ').trim();
      svgLines.push(`  <path d="${cloudPath}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" ${filterAttr} />`);
    } else if (node.shape === 'actor' || node.shape === 'user') {
      // Render stick-figure lines within a fixed 48px height at the top of the node bounding box
      const cx = x + w / 2;
      const actorH = Math.max(30, h - 20); // exclude bottom text label space
      const headR = Math.min(10, actorH * 0.2);
      const headY = y + headR + 2;
      const bodyYStart = headY + headR;
      const bodyYEnd = y + actorH * 0.65;
      const legSpread = 10;
      
      // Head
      svgLines.push(`  <circle cx="${cx}" cy="${headY}" r="${headR}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" ${filterAttr} />`);
      // Torso
      svgLines.push(`  <line x1="${cx}" y1="${bodyYStart}" x2="${cx}" y2="${bodyYEnd}" stroke="${stroke}" stroke-width="${strokeW}" />`);
      // Arms
      svgLines.push(`  <line x1="${cx - 14}" y1="${bodyYStart + 6}" x2="${cx + 14}" y2="${bodyYStart + 6}" stroke="${stroke}" stroke-width="${strokeW}" />`);
      // Left leg
      svgLines.push(`  <line x1="${cx}" y1="${bodyYEnd}" x2="${cx - legSpread}" y2="${y + actorH}" stroke="${stroke}" stroke-width="${strokeW}" />`);
      // Right leg
      svgLines.push(`  <line x1="${cx}" y1="${bodyYEnd}" x2="${cx + legSpread}" y2="${y + actorH}" stroke="${stroke}" stroke-width="${strokeW}" />`);
    } else {
      // Default rect shape (sharp corners rx="0")
      svgLines.push(`  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" rx="0" ry="0" ${filterAttr} />`);
    }

    // Centered label text overlay (drawn on top of all shapes except stick-figure actor)
    const labelYOffset = (node.shape === 'actor' || node.shape === 'user') ? (y + h - 8) : (y + h / 2);
    const labelColor = (node.shape === 'actor' || node.shape === 'user') ? textColor : (node.styles?.color || textColor);
    const labelWeight = (node.shape === 'actor' || node.shape === 'user') ? '700' : '700';

    if (node.shape === 'actor' || node.shape === 'user') {
      // Place text below actor stick-figure
      const actorH = Math.max(30, h - 20);
      svgLines.push(`  <text x="${x + w / 2}" y="${y + actorH + 8}" font-family="Karla, sans-serif" font-size="11px" fill="${labelColor}" font-weight="${labelWeight}" text-anchor="middle" dominant-baseline="hanging">${node.label}</text>`);
    } else {
      svgLines.push(`  <text x="${x + w / 2}" y="${labelYOffset}" font-family="Karla, sans-serif" font-size="12px" fill="${labelColor}" font-weight="${labelWeight}" text-anchor="middle" dominant-baseline="central">${node.label}</text>`);
    }
  }

  // Close the panning/zooming group
  svgLines.push('  </g>');

  // 7. Close SVG tag
  svgLines.push('</svg>');

  return svgLines.join('\n');
}
