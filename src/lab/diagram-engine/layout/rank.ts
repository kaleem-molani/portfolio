import type { GraphIR, Diagnostic } from '../types';

export function rankGraph(graph: GraphIR): {
  ranks: Map<string, number>;
  diagnostics: Diagnostic[];
} {
  const ranks = new Map<string, number>();
  const diagnostics: Diagnostic[] = [];
  const inDegrees = new Map<string, number>();
  const adj = new Map<string, string[]>();

  // Initialize nodes
  for (const node of graph.nodes) {
    inDegrees.set(node.id, 0);
    adj.set(node.id, []);
  }

  // Populate adjacency lists and compute initial in-degrees
  for (const edge of graph.edges) {
    if (!adj.has(edge.from)) adj.set(edge.from, []);
    if (!adj.has(edge.to)) adj.set(edge.to, []);
    if (!inDegrees.has(edge.from)) inDegrees.set(edge.from, 0);
    if (!inDegrees.has(edge.to)) inDegrees.set(edge.to, 0);

    adj.get(edge.from)!.push(edge.to);
    inDegrees.set(edge.to, inDegrees.get(edge.to)! + 1);
  }

  // Kahn's algorithm queue starting with nodes of in-degree 0
  const queue: string[] = [];
  for (const [nodeId, degree] of inDegrees.entries()) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  const topoOrder: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    topoOrder.push(u);

    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      inDegrees.set(v, inDegrees.get(v)! - 1);
      if (inDegrees.get(v) === 0) {
        queue.push(v);
      }
    }
  }

  // Kahn unvisited node check (identifying cycle occurrences)
  const visited = new Set(topoOrder);
  const unvisited = graph.nodes.filter((n) => !visited.has(n.id));

  if (unvisited.length > 0) {
    diagnostics.push({
      severity: 'warn',
      message: 'Cyclic dependencies detected in graph. Layout may contain backward edges.'
    });

    // Append unvisited leftovers to topoOrder in first-seen order
    for (const node of graph.nodes) {
      if (!visited.has(node.id)) {
        topoOrder.push(node.id);
      }
    }
  }

  // Longest-path ranking
  for (const nodeId of topoOrder) {
    ranks.set(nodeId, 0);
  }

  for (const u of topoOrder) {
    const uRank = ranks.get(u) || 0;
    const neighbors = adj.get(u) || [];
    for (const v of neighbors) {
      const vRank = ranks.get(v) || 0;
      ranks.set(v, Math.max(vRank, uRank + 1));
    }
  }

  // Post-pass ranking adjustments to ensure edge ranking invariants: rank(from) < rank(to)
  // Limited to N iterations to prevent infinite loops on cycles
  let changed = true;
  let iterations = 0;
  const maxIterations = graph.nodes.length;
  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;
    for (const edge of graph.edges) {
      const uRank = ranks.get(edge.from) || 0;
      const vRank = ranks.get(edge.to) || 0;
      if (uRank >= vRank) {
        ranks.set(edge.to, uRank + 1);
        changed = true;
      }
    }
  }

  return { ranks, diagnostics };
}
