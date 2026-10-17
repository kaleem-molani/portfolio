import { describe, test, expect } from 'vitest';
import { parse } from '../parser';
import { layout } from '../layout';
import { TestMeasurer } from '../measure';

describe('Layout Engine Seam', () => {
  test('should compute correct hierarchical layers and relative coordinates', () => {
    const source = `
---
direction: TB
nodeSpacing: 45
---
# Main
- [A] Node A
- [B] Node B
- [A] -> [B]
    `;
    const { graph } = parse(source);
    const measurer = new TestMeasurer(10, 8, 40); // fixed width padding = 20, height = 40

    const result = layout(graph, measurer);

    expect(result.nodes).toHaveLength(2);
    expect(result.groups).toHaveLength(1);
    expect(result.edges).toHaveLength(1);

    const nodeA = result.nodes.find(n => n.id === 'A')!;
    const nodeB = result.nodes.find(n => n.id === 'B')!;
    const mainGroup = result.groups.find(g => g.name === 'Main')!;

    // A is in layer 0, B is in layer 1 inside Main Group
    // Node dimensions: Node A is 20 + 6*8 = 68px wide. Node B is 20 + 6*8 = 68px wide.
    expect(nodeA.width).toBe(68);
    expect(nodeB.width).toBe(68);

    // Height checks:
    // Heading padding = 32px. Padding Y = 20px on top/bottom.
    // Node A top Y offset relative to group should be Y_0 = 20 + 32 = 52px.
    // Node B top Y offset relative to group should be Y_1 = 52 + 40 + 45 = 137px.
    expect(nodeA.y).toBe(52);
    expect(nodeB.y).toBe(137);

    // Group size should enclose nodes with padding:
    // width = max(maxRowWidth, titleWidth) + paddingX * 2 = 92 + 20 * 2 = 132px.
    // height = Y_1 + 40 + paddingY = 137 + 40 + 20 = 197px.
    expect(mainGroup.width).toBe(132);
    expect(mainGroup.height).toBe(197);

    // Verify absolute canvas coordinates mapping
    expect(nodeA.ax).toBe(mainGroup.ax + nodeA.x);
    expect(nodeA.ay).toBe(mainGroup.ay + nodeA.y);

    // Verify Bezier routing points
    const edge = result.edges[0];
    expect(edge.points).toHaveLength(4);
    // Cubic Bezier curve starts at bottom of A and ends at top of B
    expect(edge.points[0].x).toBe(nodeA.ax + nodeA.width / 2);
    expect(edge.points[0].y).toBe(nodeA.ay + nodeA.height);
    expect(edge.points[3].x).toBe(nodeB.ax + nodeB.width / 2);
    expect(edge.points[3].y).toBe(nodeB.ay);
  });
});
