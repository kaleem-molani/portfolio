import type { EngineResult } from './types';
import { parse } from './parser';
import type { Measurer } from './measure';
import { BrowserMeasurer } from './measure';
import { layout } from './layout';
import { toSvg } from './render/svg';

export function renderFlow(
  source: string,
  opts?: {
    measurer?: Measurer;
  }
): EngineResult {
  const parsed = parse(source);
  const diagnostics = [...parsed.diagnostics];

  // Zero nodes check: return an empty, valid SVG representation
  if (parsed.graph.nodes.length === 0) {
    return {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" viewBox="0 0 0 0"></svg>',
      bounds: { width: 0, height: 0 },
      diagnostics
    };
  }

  const measurer = opts?.measurer || new BrowserMeasurer();

  try {
    const layoutResult = layout(parsed.graph, measurer);
    const svg = toSvg(layoutResult, parsed.graph.theme);

    return {
      svg,
      bounds: { width: layoutResult.width, height: layoutResult.height },
      diagnostics
    };
  } catch (err: any) {
    // Defend: ensure the function is strictly total and never leaks crash stacks
    diagnostics.push({
      severity: 'error',
      message: `Internal Layout Error: ${err.message || 'Layout execution failed'}`
    });

    return {
      svg: '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80"><text x="10" y="40" fill="#ba1a1a" font-family="sans-serif" font-size="12px">Layout Pipeline Failure</text></svg>',
      bounds: { width: 200, height: 80 },
      diagnostics
    };
  }
}

// Re-export seams for unit testing and composition
export { parse } from './parser';
export { layout } from './layout';
export { toSvg } from './render/svg';
export * from './types';
export { BrowserMeasurer, TestMeasurer } from './measure';
