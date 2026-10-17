import type { GraphIR } from '../types';

export function orderLayers(graph: GraphIR, ranks: Map<string, number>): string[][] {
  const layers: string[][] = [];

  // Find max rank to size the layers array
  let maxRank = 0;
  for (const rank of ranks.values()) {
    if (rank > maxRank) {
      maxRank = rank;
    }
  }

  for (let i = 0; i <= maxRank; i++) {
    layers.push([]);
  }

  // Populate layers in first-seen order of the nodes array
  for (const node of graph.nodes) {
    const r = ranks.get(node.id) ?? 0;
    if (r >= 0 && r < layers.length) {
      layers[r].push(node.id);
    }
  }

  // Filter out any accidentally empty layers
  return layers.filter((layer) => layer.length > 0);
}
