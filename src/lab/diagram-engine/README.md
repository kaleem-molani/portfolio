# Custom Flow Diagram Engine (M0)

A hand-rolled, client-side graph layout and rendering engine built from scratch in pure TypeScript. It parses a minimalist `flow` text DSL, calculates layered coordinates based on longest-path topological sorting, and outputs self-contained SVG vectors.

## Pipeline Architecture

The layout pipeline runs entirely synchronously (CPU-only) and is split into five testable stages:

```
  source string
   -> LEX (lexer.ts)         -> tokens
   -> PARSE (parser.ts)      -> GraphIR (Node & Edge Lists)
   -> MEASURE (measure.ts)   -> node dimensions (pad + string length)
   -> LAYOUT (layout/)       -> LayoutResult (x/y coordinate placements)
   -> RENDER (render/svg.ts) -> SVG String
```

### 1. Lexer (`lexer.ts`)
Converts characters to typed tokens (`IDENT`, `ARROW('->')`, `NEWLINE`, `EOF`). Ignores horizontal spacing and comments (`#` or `//` to EOL) while tracking active line numbers for syntax reporting.

### 2. Parser (`parser.ts`)
Converts tokens into lists of nodes and edges (`GraphIR`). If an edge refers to undeclared nodes, the parser auto-creates them on the fly. Syntax errors are logged as `Diagnostic` warning arrays rather than throwing errors.

### 3. Measurer (`measure.ts`)
Exposes a simple dimensions contract (`Measurer`).
* `BrowserMeasurer` leverages offscreen HTML5 `CanvasRenderingContext2D.measureText()` to fetch exact font dimensions in the viewport.
* `TestMeasurer` calculates sizes mathematically based on character counts to enable headless environment unit testing in Node/CLI runners.

### 4. Layout Orchestration (`layout/`)
Computes absolute positions of nodes and routing points for edges:
* **Ranking** (`layout/rank.ts`): Layer assignment using longest-path algorithms over Kahn's topological sorting queue. Warns on cycles and forces ranks to prevent overlap loops.
* **Ordering** (`layout/order.ts`): Arranges nodes horizontally inside layers using stable first-seen order.
* **Coordinates** (`layout/coordinates.ts`): Stack layers vertically (layer height + `vGap`) and pack elements horizontally (node widths + `hGap`). Centers each layer relative to the widest layer.
* **Routing** (`layout/route.ts`): Plugs straight lines connecting source bottom-centers to target top-centers.

### 5. SVG Rendering (`render/svg.ts`)
Compiles the layout model into clean, vector inline SVG drawings containing markers, rectangles, and text fields inlined with colors from the portfolio's theme (`render/theme.ts`).

## Core Principles

1. **Total Functionality**: The entrypoint `renderFlow()` never throws. Bad input returns warnings alongside a best-effort layout.
2. **Determinism**: Same input string produces binary-identical output strings, allowing easy diffing and copy-pasting.
3. **No External Runtime Dependencies**: Built from scratch without dagre, elk, d3, cytoscape, or any graph layout libraries.
