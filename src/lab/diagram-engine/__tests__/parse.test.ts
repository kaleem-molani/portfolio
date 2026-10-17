import { describe, test, expect } from 'vitest';
import { parse } from '../parser';

describe('DSL Parser Seam', () => {
  test('should parse frontmatter, nodes, groups, and edges', () => {
    const source = `
---
direction: LR
theme: dark
nodeSpacing: 50
---
# Root Group
## Nested Group (circle) {fill: #ff0000}
- [node_a](oval){color: blue} Node A Label
- Node B Label(database)
- [node_a] -> [node-b-label] {stroke: green} : link
    `;
    const { graph, diagnostics } = parse(source);

    expect(diagnostics).toHaveLength(0);
    expect(graph.direction).toBe('LR');
    expect(graph.theme).toBe('dark');
    expect(graph.nodeSpacing).toBe(50);

    // Groups
    expect(graph.groups).toHaveLength(2);
    const rootG = graph.groups.find(g => g.name === 'Root Group')!;
    const nestedG = graph.groups.find(g => g.name === 'Nested Group')!;
    
    expect(rootG.level).toBe(1);
    expect(nestedG.level).toBe(2);
    expect(nestedG.shape).toBe('circle');
    expect(nestedG.styles?.fill).toBe('#ff0000');
    expect(nestedG.parentGroupId).toBe(rootG.id);

    // Nodes
    expect(graph.nodes).toHaveLength(2);
    const nodeA = graph.nodes.find(n => n.id === 'node_a')!;
    const nodeB = graph.nodes.find(n => n.id === 'node-b-label')!;

    expect(nodeA.label).toBe('Node A Label');
    expect(nodeA.shape).toBe('oval');
    expect(nodeA.styles?.color).toBe('blue');
    expect(nodeA.groupId).toBe(nestedG.id);

    expect(nodeB.label).toBe('Node B Label');
    expect(nodeB.shape).toBe('database');
    expect(nodeB.groupId).toBe(nestedG.id);

    // Edges
    expect(graph.edges).toHaveLength(1);
    expect(graph.edges[0].from).toBe('node_a');
    expect(graph.edges[0].to).toBe('node-b-label');
    expect(graph.edges[0].arrowStyle).toBe('->');
    expect(graph.edges[0].styles?.stroke).toBe('green');
    expect(graph.edges[0].label).toBe('link');
  });

  test('should execute missing node auto-recovery at the root level', () => {
    const source = `
- [web] -> [db]
    `;
    const { graph, diagnostics } = parse(source);

    expect(diagnostics).toHaveLength(0);
    expect(graph.nodes).toHaveLength(2);
    expect(graph.nodes.some(n => n.id === 'web')).toBe(true);
    expect(graph.nodes.some(n => n.id === 'db')).toBe(true);
    expect(graph.edges).toHaveLength(1);
  });
});
