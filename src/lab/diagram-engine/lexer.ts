export const TokenTypes = {
  FRONTMATTER_START: 'FRONTMATTER_START',
  FRONTMATTER_PROP: 'FRONTMATTER_PROP',
  FRONTMATTER_END: 'FRONTMATTER_END',
  HEADING: 'HEADING',
  NODE_DEF: 'NODE_DEF',
  EDGE_DEF: 'EDGE_DEF',
  TEXT_LINE: 'TEXT_LINE',
  EMPTY_LINE: 'EMPTY_LINE',
  EOF: 'EOF'
} as const;

export type TokenType = typeof TokenTypes[keyof typeof TokenTypes];

export interface Token {
  type: TokenType;
  line: number;
  value: string;

  // For FRONTMATTER_PROP
  key?: string;
  propValue?: string;

  // For HEADING
  level?: number;
  name?: string;
  shape?: string;
  styles?: Record<string, string>;

  // For NODE_DEF
  id?: string;
  label?: string;
  explicit?: boolean;

  // For EDGE_DEF
  source?: string;
  target?: string;
  arrowStyle?: string;
  customStyle?: Record<string, string>;
  edgeLabel?: string;
}

export function parseStyles(styleStr: string | undefined): Record<string, string> {
  const styles: Record<string, string> = {};
  if (!styleStr) return styles;
  const parts = styleStr.split(',');
  for (const part of parts) {
    const colonIndex = part.indexOf(':');
    if (colonIndex !== -1) {
      const key = part.slice(0, colonIndex).trim();
      const val = part.slice(colonIndex + 1).trim();
      if (key && val) {
        styles[key] = val;
      }
    }
  }
  return styles;
}

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  const lines = source.split(/\r?\n/);
  let inFrontmatter = false;

  // Regular expression patterns
  const headingRegex = /^(#{1,6})\s+([^{(\n]+?)(?:\s*\(([^)]+)\))?\s*(?:\{([^}]+)\})?\s*$/;
  const frontmatterPropRegex = /^\s*([a-zA-Z0-9_-]+)\s*:\s*([^#\n]+)(?:\s*#.*)?$/;
  
  // Edge definition matches list items: - source_id Arrow target_id {styles} : Label
  // Arrow styles: ->, -->, <->, <-, -
  // We match source and target both as either explicit bracket [id] or implicit word id
  const edgeRegex = /^\s*-\s+(?:\[([^\]]+)\]|([a-zA-Z0-9_-]+))\s*(->|-->|<->|<-|-)\s*(?:\[([^\]]+)\]|([a-zA-Z0-9_-]+))(?:\s*\{([^}]+)\})?\s*(?::\s*(.+))?$/;
  
  // Node definitions
  // Explicit ID: - [node_id](shape){styles} Label
  const explicitNodeRegex = /^\s*-\s+\[([^\]]+)\](?:\s*\(([^)]+)\))?\s*(?:\{([^}]+)\})?\s*(.*)$/;
  // Implicit ID: - Node Label(shape){styles}
  const implicitNodeRegex = /^\s*-\s+([^[(\n]+?)(?:\s*\(([^)]+)\))?\s*(?:\{([^}]+)\})?\s*$/;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    const lineNum = i + 1;

    // 1. Comments and Empty Lines (ensuring markdown headings like '# Title' are not skipped as comments)
    const isComment = trimmed.startsWith('//') || (trimmed.startsWith('#') && !/^(#{1,6})\s/.test(trimmed));
    if (trimmed === '' || isComment) {
      tokens.push({
        type: TokenTypes.EMPTY_LINE,
        line: lineNum,
        value: rawLine
      });
      continue;
    }

    // 2. Frontmatter blocks
    if (trimmed === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
        tokens.push({
          type: TokenTypes.FRONTMATTER_START,
          line: lineNum,
          value: trimmed
        });
      } else {
        inFrontmatter = false;
        tokens.push({
          type: TokenTypes.FRONTMATTER_END,
          line: lineNum,
          value: trimmed
        });
      }
      continue;
    }

    if (inFrontmatter) {
      const match = trimmed.match(frontmatterPropRegex);
      if (match) {
        tokens.push({
          type: TokenTypes.FRONTMATTER_PROP,
          line: lineNum,
          value: trimmed,
          key: match[1].trim(),
          propValue: match[2].trim()
        });
      } else {
        tokens.push({
          type: TokenTypes.TEXT_LINE,
          line: lineNum,
          value: rawLine
        });
      }
      continue;
    }

    // 3. Headings (Groups)
    const headingMatch = rawLine.match(headingRegex);
    if (headingMatch) {
      tokens.push({
        type: TokenTypes.HEADING,
        line: lineNum,
        value: trimmed,
        level: headingMatch[1].length,
        name: headingMatch[2].trim(),
        shape: headingMatch[3] ? headingMatch[3].trim() : undefined,
        styles: parseStyles(headingMatch[4])
      });
      continue;
    }

    // 4. Edges and Connections
    const edgeMatch = trimmed.match(edgeRegex);
    if (edgeMatch) {
      const source = edgeMatch[1] || edgeMatch[2];
      const arrowStyle = edgeMatch[3];
      const target = edgeMatch[4] || edgeMatch[5];
      const styles = parseStyles(edgeMatch[6]);
      const edgeLabel = edgeMatch[7] ? edgeMatch[7].trim() : undefined;

      tokens.push({
        type: TokenTypes.EDGE_DEF,
        line: lineNum,
        value: trimmed,
        source: source.trim(),
        target: target.trim(),
        arrowStyle,
        customStyle: styles,
        edgeLabel
      });
      continue;
    }

    // 5. Node Definitions (Explicit list item)
    const explicitNodeMatch = trimmed.match(explicitNodeRegex);
    if (explicitNodeMatch) {
      const id = explicitNodeMatch[1].trim();
      const shape = explicitNodeMatch[2] ? explicitNodeMatch[2].trim() : 'rect';
      const styles = parseStyles(explicitNodeMatch[3]);
      const label = explicitNodeMatch[4] ? explicitNodeMatch[4].trim() : id;

      tokens.push({
        type: TokenTypes.NODE_DEF,
        line: lineNum,
        value: trimmed,
        id,
        label: label !== '' ? label : id,
        shape,
        styles,
        explicit: true
      });
      continue;
    }

    // 6. Node Definitions (Implicit list item)
    const implicitNodeMatch = trimmed.match(implicitNodeRegex);
    if (implicitNodeMatch) {
      const label = implicitNodeMatch[1].trim();
      const shape = implicitNodeMatch[2] ? implicitNodeMatch[2].trim() : 'rect';
      const styles = parseStyles(implicitNodeMatch[3]);

      tokens.push({
        type: TokenTypes.NODE_DEF,
        line: lineNum,
        value: trimmed,
        label,
        shape,
        styles,
        explicit: false
      });
      continue;
    }

    // 7. Fallback to normal text line
    tokens.push({
      type: TokenTypes.TEXT_LINE,
      line: lineNum,
      value: rawLine
    });
  }

  tokens.push({
    type: TokenTypes.EOF,
    line: lines.length + 1,
    value: ''
  });

  return tokens;
}
