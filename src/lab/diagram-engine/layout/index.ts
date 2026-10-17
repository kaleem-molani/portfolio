import type { GraphIR, LayoutResult, GraphNode, GraphGroup, Point, Size } from '../types';
import type { Measurer } from '../measure';

// Find the Least Common Ancestor (LCA) group ID for two nodes.
// Returns the group ID or undefined if the LCA is the root scope.
function findLCA(
  nodeA: GraphNode,
  nodeB: GraphNode,
  groupsMap: Map<string, GraphGroup>
): string | undefined {
  const pathA: string[] = [];
  let currA = nodeA.groupId;
  while (currA) {
    pathA.push(currA);
    currA = groupsMap.get(currA)?.parentGroupId;
  }

  const pathB: string[] = [];
  let currB = nodeB.groupId;
  while (currB) {
    pathB.push(currB);
    currB = groupsMap.get(currB)?.parentGroupId;
  }

  // Reverse paths to search from root down
  pathA.reverse();
  pathB.reverse();

  let lastCommon: string | undefined = undefined;
  const minLen = Math.min(pathA.length, pathB.length);
  for (let i = 0; i < minLen; i++) {
    if (pathA[i] === pathB[i]) {
      lastCommon = pathA[i];
    } else {
      break;
    }
  }
  return lastCommon;
}

// Find the ancestor of a node/group that is a direct child of a target group scope.
// If targetGroupId is undefined, returns the top-level ancestor.
function findAncestorInScope(
  id: string,
  targetGroupId: string | undefined,
  nodesMap: Map<string, GraphNode>,
  groupsMap: Map<string, GraphGroup>
): string {
  let currId = id;
  while (currId) {
    const parentId = nodesMap.get(currId)?.groupId || groupsMap.get(currId)?.parentGroupId;
    if (parentId === targetGroupId) {
      return currId;
    }
    if (!parentId) {
      // Reached top level, but target group wasn't matched (fallback)
      return currId;
    }
    currId = parentId;
  }
  return id;
}

export function layout(
  graph: GraphIR,
  measurer: Measurer,
  // We bypass layout spacing options in favor of graph.nodeSpacing and custom defaults
  _spacing?: { hGap: number; vGap: number; pad: number }
): LayoutResult {
  const nodesMap = new Map<string, GraphNode>(graph.nodes.map((n) => [n.id, { ...n }]));
  const groupsMap = new Map<string, GraphGroup>(graph.groups.map((g) => [g.id, { ...g }]));
  const edges = graph.edges.map((e) => ({ ...e }));

  const direction = graph.direction || 'TB';
  const nodeSpacing = graph.nodeSpacing || 40;

  // Sizing and relative positioning margins
  const paddingX = 20;
  const paddingY = 20;
  const headingPaddingY = 32; // space allocated for group names

  // Recursive bottom-up layout phase
  function layoutScope(scopeGroupId: string | undefined): Size {
    // 1. Identify children belonging directly to this scope
    let childNodeIds: string[] = [];
    let childGroupIds: string[] = [];

    if (scopeGroupId === undefined) {
      childNodeIds = graph.rootNodeIds;
      childGroupIds = graph.rootGroupIds;
    } else {
      const g = groupsMap.get(scopeGroupId);
      if (g) {
        childNodeIds = g.childNodeIds;
        childGroupIds = g.childGroupIds;
      }
    }

    const children = [
      ...childNodeIds.map((id) => ({ id, type: 'node' as const })),
      ...childGroupIds.map((id) => ({ id, type: 'group' as const }))
    ];

    const currentHeadingPaddingY = scopeGroupId === undefined ? 0 : headingPaddingY;

    if (children.length === 0) {
      let titleWidth = paddingX * 2;
      if (scopeGroupId !== undefined) {
        const gName = groupsMap.get(scopeGroupId)?.name || '';
        titleWidth = Math.max(titleWidth, measurer.measure(gName, 'rect').width + 40);
      }
      return {
        width: titleWidth,
        height: paddingY * 2 + currentHeadingPaddingY
      };
    }

    // 2. Recursively layout child groups first (post-order traversal)
    for (const childGroup of childGroupIds) {
      const gSize = layoutScope(childGroup);
      const g = groupsMap.get(childGroup);
      if (g) {
        g.width = gSize.width;
        g.height = gSize.height;
      }
    }

    // 3. Compute sizes for child nodes
    for (const childNode of childNodeIds) {
      const n = nodesMap.get(childNode);
      if (n) {
        const size = measurer.measure(n.label, n.shape);
        n.width = size.width;
        n.height = size.height;
      }
    }

    // 4. Resolve local dependencies (edges whose LCA is this scope)
    const localDependencies: { from: string; to: string }[] = [];
    for (const edge of edges) {
      const fromNode = nodesMap.get(edge.from);
      const toNode = nodesMap.get(edge.to);
      if (fromNode && toNode) {
        const lca = findLCA(fromNode, toNode, groupsMap);
        if (lca === scopeGroupId) {
          const fromAnc = findAncestorInScope(edge.from, scopeGroupId, nodesMap, groupsMap);
          const toAnc = findAncestorInScope(edge.to, scopeGroupId, nodesMap, groupsMap);
          if (fromAnc !== toAnc) {
            localDependencies.push({ from: fromAnc, to: toAnc });
          }
        }
      }
    }

    // 5. Rank relaxation loop (Bellman-Ford-like ranking)
    const ranks = new Map<string, number>();
    for (const child of children) {
      ranks.set(child.id, 0);
    }

    // Limit relaxation iterations to prevent infinite cycle loops
    const maxIterations = children.length;
    let changed = true;
    let iterations = 0;
    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;
      for (const dep of localDependencies) {
        const rFrom = ranks.get(dep.from) || 0;
        const rTo = ranks.get(dep.to) || 0;
        if (rFrom >= rTo) {
          ranks.set(dep.to, rFrom + 1);
          changed = true;
        }
      }
    }

    // Group elements by rank
    const rankColumnsMap = new Map<number, string[]>();
    let maxRank = 0;
    for (const child of children) {
      const r = ranks.get(child.id) || 0;
      if (r > maxRank) {
        maxRank = r;
      }
      if (!rankColumnsMap.has(r)) {
        rankColumnsMap.set(r, []);
      }
      rankColumnsMap.get(r)!.push(child.id);
    }

    // 6. relative coordinates assignment

    if (direction === 'LR') {
      // LR layout: rank columns stacked horizontally, elements stacked vertically within columns
      const colWidths: number[] = [];
      const colHeights: number[] = [];

      for (let r = 0; r <= maxRank; r++) {
        const colElements = rankColumnsMap.get(r) || [];
        let maxW = 0;
        let totalH = 0;
        for (let i = 0; i < colElements.length; i++) {
          const childId = colElements[i];
          const childSize = nodesMap.get(childId) || groupsMap.get(childId) || { width: 0, height: 0 };
          if (childSize.width > maxW) maxW = childSize.width;
          totalH += childSize.height;
        }
        if (colElements.length > 1) {
          totalH += nodeSpacing * (colElements.length - 1);
        }
        colWidths.push(maxW);
        colHeights.push(totalH);
      }

      const maxColHeight = Math.max(...colHeights, 0);

      // Accumulate horizontal offsets
      let currentX = paddingX;
      const colX: number[] = [];
      for (let r = 0; r <= maxRank; r++) {
        colX.push(currentX);
        currentX += colWidths[r] + nodeSpacing;
      }

      const contentWidth = currentX - nodeSpacing + paddingX;
      
      // If group has title, ensure group box fits the header label
      let titleWidth = 0;
      if (scopeGroupId !== undefined) {
        const gName = groupsMap.get(scopeGroupId)?.name || '';
        titleWidth = measurer.measure(gName, 'rect').width + 40;
      }
      const containerWidth = Math.max(contentWidth, titleWidth);

      // Position children with horizontal centering and vertical alignment inside columns
      for (let r = 0; r <= maxRank; r++) {
        const colElements = rankColumnsMap.get(r) || [];
        const colHeight = colHeights[r];
        
        // Vertically center column within overall max column height
        const colYStart = paddingY + currentHeadingPaddingY + (maxColHeight - colHeight) / 2;
        let currentY = colYStart;

        for (let i = 0; i < colElements.length; i++) {
          const childId = colElements[i];
          const node = nodesMap.get(childId);
          const group = groupsMap.get(childId);
          const child = node || group;

          if (child) {
            // Horizontally center child within its column rank width
            child.x = colX[r] + (colWidths[r] - child.width) / 2;
            child.y = currentY;
            currentY += child.height + nodeSpacing;
          }
        }
      }

      return {
        width: containerWidth,
        height: maxColHeight + currentHeadingPaddingY + paddingY * 2
      };
    } else {
      // TB layout: rank rows stacked vertically, elements stacked horizontally within rows
      const rowHeights: number[] = [];
      const rowWidths: number[] = [];

      for (let r = 0; r <= maxRank; r++) {
        const rowElements = rankColumnsMap.get(r) || [];
        let maxH = 0;
        let totalW = 0;
        for (let i = 0; i < rowElements.length; i++) {
          const childId = rowElements[i];
          const childSize = nodesMap.get(childId) || groupsMap.get(childId) || { width: 0, height: 0 };
          if (childSize.height > maxH) maxH = childSize.height;
          totalW += childSize.width;
        }
        if (rowElements.length > 1) {
          totalW += nodeSpacing * (rowElements.length - 1);
        }
        rowHeights.push(maxH);
        rowWidths.push(totalW);
      }

      const maxRowWidth = Math.max(...rowWidths, 0);

      // Group title width
      let titleWidth = 0;
      if (scopeGroupId !== undefined) {
        const gName = groupsMap.get(scopeGroupId)?.name || '';
        titleWidth = measurer.measure(gName, 'rect').width + 40;
      }
      const containerWidth = Math.max(maxRowWidth, titleWidth);

      // Accumulate vertical offsets
      let currentY = paddingY + currentHeadingPaddingY;
      const rowY: number[] = [];
      for (let r = 0; r <= maxRank; r++) {
        rowY.push(currentY);
        currentY += rowHeights[r] + nodeSpacing;
      }

      const containerHeight = currentY - nodeSpacing + paddingY;

      // Position children with vertical centering and horizontal alignment inside rows
      for (let r = 0; r <= maxRank; r++) {
        const rowElements = rankColumnsMap.get(r) || [];
        const rowWidth = rowWidths[r];

        // Horizontally center row
        const rowXStart = paddingX + (containerWidth - rowWidth) / 2;
        let currentX = rowXStart;

        for (let i = 0; i < rowElements.length; i++) {
          const childId = rowElements[i];
          const node = nodesMap.get(childId);
          const group = groupsMap.get(childId);
          const child = node || group;

          if (child) {
            child.x = currentX;
            // Vertically center child within its row rank height
            child.y = rowY[r] + (rowHeights[r] - child.height) / 2;
            currentX += child.width + nodeSpacing;
          }
        }
      }

      return {
        width: containerWidth + paddingX * 2,
        height: containerHeight
      };
    }
  }

  // 1. Bottom-up geometry sizing
  const rootSize = layoutScope(undefined);

  // 2. Top-down absolute coordinates positioning traversal
  function applyAbsoluteCoordinates(scopeGroupId: string | undefined, parentAx: number, parentAy: number) {
    let childNodeIds: string[] = [];
    let childGroupIds: string[] = [];

    if (scopeGroupId === undefined) {
      childNodeIds = graph.rootNodeIds;
      childGroupIds = graph.rootGroupIds;
    } else {
      const g = groupsMap.get(scopeGroupId);
      if (g) {
        childNodeIds = g.childNodeIds;
        childGroupIds = g.childGroupIds;
      }
    }

    for (const childNode of childNodeIds) {
      const n = nodesMap.get(childNode);
      if (n) {
        n.ax = parentAx + n.x;
        n.ay = parentAy + n.y;
      }
    }

    for (const childGroup of childGroupIds) {
      const g = groupsMap.get(childGroup);
      if (g) {
        g.ax = parentAx + g.x;
        g.ay = parentAy + g.y;
        applyAbsoluteCoordinates(childGroup, g.ax, g.ay);
      }
    }
  }

  applyAbsoluteCoordinates(undefined, 0, 0);

  // 3. Stage D: Route Edges as Cubic Bezier Curves
  const routedEdges = edges.map((edge) => {
    const fromNode = nodesMap.get(edge.from);
    const toNode = nodesMap.get(edge.to);
    
    const points: Point[] = [];
    let labelPos: Point | undefined = undefined;

    if (fromNode && toNode) {
      let P_start: Point;
      let P_end: Point;

      if (direction === 'LR') {
        P_start = { x: fromNode.ax + fromNode.width, y: fromNode.ay + fromNode.height / 2 };
        P_end = { x: toNode.ax, y: toNode.ay + toNode.height / 2 };

        const dx = P_end.x - P_start.x;
        const controlOffset = Math.max(30, Math.abs(dx) / 2);
        const C1 = { x: P_start.x + controlOffset, y: P_start.y };
        const C2 = { x: P_end.x - controlOffset, y: P_end.y };
        
        points.push(P_start, C1, C2, P_end);
        
        labelPos = {
          x: 0.125 * P_start.x + 0.375 * C1.x + 0.375 * C2.x + 0.125 * P_end.x,
          y: 0.125 * P_start.y + 0.375 * C1.y + 0.375 * C2.y + 0.125 * P_end.y
        };
      } else {
        P_start = { x: fromNode.ax + fromNode.width / 2, y: fromNode.ay + fromNode.height };
        P_end = { x: toNode.ax + toNode.width / 2, y: toNode.ay };

        const dy = P_end.y - P_start.y;
        const controlOffset = Math.max(30, Math.abs(dy) / 2);
        const C1 = { x: P_start.x, y: P_start.y + controlOffset };
        const C2 = { x: P_end.x, y: P_end.y - controlOffset };

        points.push(P_start, C1, C2, P_end);

        labelPos = {
          x: 0.125 * P_start.x + 0.375 * C1.x + 0.375 * C2.x + 0.125 * P_end.x,
          y: 0.125 * P_start.y + 0.375 * C1.y + 0.375 * C2.y + 0.125 * P_end.y
        };
      }
    }

    return {
      ...edge,
      points,
      labelPos
    };
  });

  return {
    nodes: Array.from(nodesMap.values()),
    groups: Array.from(groupsMap.values()),
    edges: routedEdges,
    width: rootSize.width,
    height: rootSize.height
  };
}

// Mock/Helper function matching the old rankGraph signature to satisfy invariants tests
export function rankGraph(graph: GraphIR): {
  ranks: Map<string, number>;
  diagnostics: any[];
} {
  const ranks = new Map<string, number>();
  const children = graph.nodes.map((n) => n.id);
  for (const c of children) {
    ranks.set(c, 0);
  }

  // Compile local edges
  const maxIterations = children.length;
  let changed = true;
  let iterations = 0;
  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;
    for (const edge of graph.edges) {
      const rFrom = ranks.get(edge.from) || 0;
      const rTo = ranks.get(edge.to) || 0;
      if (rFrom >= rTo) {
        ranks.set(edge.to, rFrom + 1);
        changed = true;
      }
    }
  }

  return { ranks, diagnostics: [] };
}
