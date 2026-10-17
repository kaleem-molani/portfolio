import { describe, test, expect } from 'vitest';
import { parse } from '../parser';
import { layout, rankGraph } from '../layout';
import { renderFlow } from '../index';
import { TestMeasurer } from '../measure';

describe('Engine Invariants & Property-Based Tests', () => {
  const measurer = new TestMeasurer(16, 8, 40);

  // Invariant 1: Ranking Order (edges must point downward: rank(from) < rank(to))
  test('edge ranking invariant: rank(from) < rank(to) for all non-cyclic edges', () => {
    const source = `
      A -> B
      B -> C
      A -> D
      D -> E
      C -> E
    `;
    const { graph } = parse(source);
    const { ranks } = rankGraph(graph);

    for (const edge of graph.edges) {
      const fromRank = ranks.get(edge.from)!;
      const toRank = ranks.get(edge.to)!;
      expect(fromRank).toBeLessThan(toRank);
    }
  });

  // Invariant 2: Overlap Avoidance within Layers
  test('overlap invariant: no two nodes in the same layer overlap horizontally', () => {
    const source = `
      A -> B
      A -> C
      A -> D
      B -> E
      C -> E
      D -> E
    `;
    const { graph } = parse(source);
    const result = layout(graph, measurer, { hGap: 30, vGap: 40, pad: 20 });

    // Group nodes by Y position (each Y corresponds to a layer)
    const layerGroups = new Map<number, typeof result.nodes>();
    for (const node of result.nodes) {
      if (!layerGroups.has(node.y)) {
        layerGroups.set(node.y, []);
      }
      layerGroups.get(node.y)!.push(node);
    }

    // Verify overlap in each layer
    for (const nodesInLayer of layerGroups.values()) {
      // Sort nodes horizontally left to right
      const sorted = [...nodesInLayer].sort((a, b) => a.x - b.x);
      for (let i = 0; i < sorted.length - 1; i++) {
        const current = sorted[i];
        const next = sorted[i + 1];
        // The right edge of 'current' must be <= the left edge of 'next'
        expect(current.x + current.width).toBeLessThanOrEqual(next.x);
      }
    }
  });

  // Invariant 3: Determinism (Same input yields byte-identical SVG strings)
  test('determinism invariant: same source yields identical SVG outputs', () => {
    const source = `
      # Complex Graph
      A -> B
      B -> C
      A -> C
      C -> D
      D -> A // introducing cycle
    `;

    const res1 = renderFlow(source, { measurer });
    const res2 = renderFlow(source, { measurer });

    expect(res1.svg).toBe(res2.svg);
    expect(res1.bounds).toEqual(res2.bounds);
    expect(res1.diagnostics).toEqual(res2.diagnostics);
  });

  // Invariant 4: Robustness / Fuzzing (The engine NEVER throws on arbitrary/garbage inputs)
  test('robustness fuzzer: never throws on arbitrary inputs', () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_ \t\n->#/';
    
    // Run 100 fuzz cycles with randomly generated strings
    for (let fuzz = 0; fuzz < 100; fuzz++) {
      let randomSource = '';
      const length = Math.floor(Math.random() * 500);
      for (let i = 0; i < length; i++) {
        const randCharIndex = Math.floor(Math.random() * alphabet.length);
        randomSource += alphabet[randCharIndex];
      }

      // Execute layout: must run synchronously and never raise exceptions
      let result;
      expect(() => {
        result = renderFlow(randomSource, { measurer });
      }).not.toThrow();

      // Return object must always match the EngineResult interface
      expect(result).toBeDefined();
      expect(typeof (result as any).svg).toBe('string');
      expect((result as any).bounds).toHaveProperty('width');
      expect((result as any).bounds).toHaveProperty('height');
      expect(Array.isArray((result as any).diagnostics)).toBe(true);
    }
  });
});
