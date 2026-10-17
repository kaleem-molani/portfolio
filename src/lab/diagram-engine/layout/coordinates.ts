import type { Size } from '../types';

export interface PositionedNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function computeCoordinates(
  layers: string[][],
  nodeSizes: Map<string, Size>,
  spacing: { hGap: number; vGap: number; pad: number }
): {
  positions: Map<string, PositionedNode>;
  totalWidth: number;
  totalHeight: number;
} {
  const { hGap, vGap, pad } = spacing;
  const positions = new Map<string, PositionedNode>();

  if (layers.length === 0) {
    return { positions, totalWidth: pad * 2, totalHeight: pad * 2 };
  }

  // Calculate layout dimension info per layer
  const layerWidths: number[] = [];
  const layerHeights: number[] = [];

  for (let j = 0; j < layers.length; j++) {
    const layer = layers[j];
    let width = 0;
    let maxHeight = 0;

    for (let i = 0; i < layer.length; i++) {
      const nodeId = layer[i];
      const size = nodeSizes.get(nodeId) || { width: 60, height: 40 };
      width += size.width;
      if (size.height > maxHeight) {
        maxHeight = size.height;
      }
    }

    if (layer.length > 1) {
      width += hGap * (layer.length - 1);
    }

    layerWidths.push(width);
    layerHeights.push(maxHeight);
  }

  // Find the widest layer
  const maxLayerWidth = Math.max(...layerWidths);

  // Position nodes layer-by-layer
  let currentY = pad;

  for (let j = 0; j < layers.length; j++) {
    const layer = layers[j];
    const layerWidth = layerWidths[j];
    const layerHeight = layerHeights[j];

    // Centering offset for current layer
    let startX = pad + (maxLayerWidth - layerWidth) / 2;

    for (let i = 0; i < layer.length; i++) {
      const nodeId = layer[i];
      const size = nodeSizes.get(nodeId) || { width: 60, height: 40 };

      // Align node top-left coordinate, centering vertically within layer
      const yOffset = (layerHeight - size.height) / 2;
      positions.set(nodeId, {
        x: startX,
        y: currentY + yOffset,
        width: size.width,
        height: size.height
      });

      startX += size.width + hGap;
    }

    currentY += layerHeight + vGap;
  }

  const totalWidth = maxLayerWidth + pad * 2;
  const totalHeight = currentY - vGap + pad; // strip trailing vGap and add bottom padding

  return {
    positions,
    totalWidth,
    totalHeight
  };
}
