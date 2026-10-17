export interface GraphNode {
  id: string;
  label: string;
  shape: string;
  styles?: Record<string, string>;
  groupId?: string;
  line?: number;
  // Relative position (top-left relative to parent container)
  x: number;
  y: number;
  width: number;
  height: number;
  // Absolute canvas position
  ax: number;
  ay: number;
}

export interface GraphGroup {
  id: string;
  name: string;
  level: number;
  shape?: string;
  styles?: Record<string, string>;
  parentGroupId?: string;
  childNodeIds: string[];
  childGroupIds: string[];
  // Relative position (top-left relative to parent container)
  x: number;
  y: number;
  width: number;
  height: number;
  // Absolute canvas position
  ax: number;
  ay: number;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  arrowStyle: string; // "->", "-->", "<->", "<-", "-"
  styles?: Record<string, string>;
  line?: number;
  // Absolute routed path points
  points: Point[];
  labelPos?: Point;
}

export interface GraphIR {
  direction: 'TB' | 'LR';
  theme: 'glass' | 'dark' | 'light';
  nodeSpacing: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
  groups: GraphGroup[];
  rootNodeIds: string[];
  rootGroupIds: string[];
}

export interface Size {
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

// Retain compatibility with layout orchestration signature
export interface LayoutResult {
  nodes: GraphNode[];
  edges: GraphEdge[];
  groups: GraphGroup[];
  width: number;
  height: number;
}

export interface Diagnostic {
  severity: 'error' | 'warn';
  message: string;
  line?: number;
}

export interface EngineResult {
  svg: string;
  bounds: Size;
  diagnostics: Diagnostic[];
}

export interface Theme {
  bg: string;
  nodeFill: string;
  nodeBorder: string;
  arrowColor: string;
  textColor: string;
  fontFamily: string;
}
