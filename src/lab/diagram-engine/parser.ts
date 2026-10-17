import { tokenize, TokenTypes } from './lexer';
import type { GraphIR, GraphNode, GraphGroup, GraphEdge, Diagnostic } from './types';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parse(source: string): { graph: GraphIR; diagnostics: Diagnostic[] } {
  const tokens = tokenize(source);
  const diagnostics: Diagnostic[] = [];

  const nodesMap = new Map<string, GraphNode>();
  const groupsMap = new Map<string, GraphGroup>();
  const edges: GraphEdge[] = [];

  const rootNodeIds: string[] = [];
  const rootGroupIds: string[] = [];

  let direction: 'TB' | 'LR' = 'TB';
  let theme: 'glass' | 'dark' | 'light' = 'light';
  let nodeSpacing = 40;

  // Stack of active groups
  const groupStack: GraphGroup[] = [];
  // Counter to ensure uniqueness of group IDs in case of name collisions
  let groupCounter = 0;
  // Counter to ensure unique edge IDs
  let edgeCounter = 0;

  for (const token of tokens) {
    if (token.type === TokenTypes.FRONTMATTER_PROP) {
      if (token.key === 'direction') {
        const val = token.propValue?.toUpperCase();
        if (val === 'LR' || val === 'TB') {
          direction = val;
        } else {
          diagnostics.push({
            severity: 'warn',
            message: `Invalid direction: "${token.propValue}". Defaulting to "TB".`,
            line: token.line
          });
        }
      } else if (token.key === 'theme') {
        const val = token.propValue?.toLowerCase();
        if (val === 'glass' || val === 'dark' || val === 'light') {
          theme = val as 'glass' | 'dark' | 'light';
        } else {
          diagnostics.push({
            severity: 'warn',
            message: `Invalid theme: "${token.propValue}". Defaulting to "light".`,
            line: token.line
          });
        }
      } else if (token.key === 'nodeSpacing') {
        const val = parseInt(token.propValue || '', 10);
        if (!isNaN(val) && val > 0) {
          nodeSpacing = val;
        } else {
          diagnostics.push({
            severity: 'warn',
            message: `Invalid nodeSpacing: "${token.propValue}". Defaulting to 40.`,
            line: token.line
          });
        }
      }
      continue;
    }

    if (token.type === TokenTypes.HEADING) {
      const level = token.level || 1;
      const name = token.name || 'Group';

      // Pop groups from stack until we find a parent group of a strictly lower level
      while (groupStack.length > 0 && groupStack[groupStack.length - 1].level >= level) {
        groupStack.pop();
      }

      const parentGroup = groupStack[groupStack.length - 1];
      
      // Generate clean scoped group ID
      let baseId = slugify(name);
      if (parentGroup) {
        baseId = `${parentGroup.id}__${baseId}`;
      }
      
      // Prevent key collisions in case of duplicate heading names
      let uniqueId = baseId;
      if (groupsMap.has(uniqueId)) {
        uniqueId = `${baseId}_g${groupCounter++}`;
      }

      const newGroup: GraphGroup = {
        id: uniqueId,
        name,
        level,
        shape: token.shape,
        styles: token.styles,
        parentGroupId: parentGroup ? parentGroup.id : undefined,
        childNodeIds: [],
        childGroupIds: [],
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        ax: 0,
        ay: 0
      };

      groupsMap.set(uniqueId, newGroup);
      groupStack.push(newGroup);

      if (parentGroup) {
        parentGroup.childGroupIds.push(uniqueId);
      } else {
        rootGroupIds.push(uniqueId);
      }
      continue;
    }

    if (token.type === TokenTypes.NODE_DEF) {
      const id = token.explicit ? (token.id || '') : slugify(token.label || '');
      
      if (id === '') {
        diagnostics.push({
          severity: 'error',
          message: 'Node definition resulted in empty ID.',
          line: token.line
        });
        continue;
      }

      const activeGroup = groupStack[groupStack.length - 1];

      // If node already exists, we can update its properties (label, shape, styles)
      if (nodesMap.has(id)) {
        const existingNode = nodesMap.get(id)!;
        existingNode.label = token.label || existingNode.label;
        existingNode.shape = token.shape || existingNode.shape;
        if (token.styles) {
          existingNode.styles = { ...existingNode.styles, ...token.styles };
        }
      } else {
        const newNode: GraphNode = {
          id,
          label: token.label || id,
          shape: token.shape || 'rect',
          styles: token.styles,
          groupId: activeGroup ? activeGroup.id : undefined,
          line: token.line,
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          ax: 0,
          ay: 0
        };

        nodesMap.set(id, newNode);

        if (activeGroup) {
          activeGroup.childNodeIds.push(id);
        } else {
          rootNodeIds.push(id);
        }
      }
      continue;
    }

    if (token.type === TokenTypes.EDGE_DEF) {
      if (!token.source || !token.target) {
        diagnostics.push({
          severity: 'error',
          message: 'Edge definition requires source and target node IDs.',
          line: token.line
        });
        continue;
      }

      edges.push({
        id: `edge_${edgeCounter++}`,
        from: token.source,
        to: token.target,
        arrowStyle: token.arrowStyle || '->',
        styles: token.customStyle,
        line: token.line,
        label: token.edgeLabel,
        points: []
      });
      continue;
    }

    if (token.type === TokenTypes.TEXT_LINE && token.value.trim().startsWith('-')) {
      // User typed a list item that we failed to match as a node/edge definition
      diagnostics.push({
        severity: 'warn',
        message: `Skipped unrecognized list item format: "${token.value.trim()}"`,
        line: token.line
      });
    }
  }

  // Stage A: Missing Node Auto-Recovery
  // Scan all edge references. If any refer to undeclared nodes, instantiate them at the root group level.
  for (const edge of edges) {
    if (!nodesMap.has(edge.from)) {
      const recoveredNode: GraphNode = {
        id: edge.from,
        label: edge.from,
        shape: 'rect',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        ax: 0,
        ay: 0
      };
      nodesMap.set(edge.from, recoveredNode);
      rootNodeIds.push(edge.from);
    }
    if (!nodesMap.has(edge.to)) {
      const recoveredNode: GraphNode = {
        id: edge.to,
        label: edge.to,
        shape: 'rect',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        ax: 0,
        ay: 0
      };
      nodesMap.set(edge.to, recoveredNode);
      rootNodeIds.push(edge.to);
    }
  }

  const nodes = Array.from(nodesMap.values());
  const groups = Array.from(groupsMap.values());

  return {
    graph: {
      direction,
      theme,
      nodeSpacing,
      nodes,
      edges,
      groups,
      rootNodeIds,
      rootGroupIds
    },
    diagnostics
  };
}
