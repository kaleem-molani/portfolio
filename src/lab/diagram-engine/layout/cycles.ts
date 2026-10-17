import type { GraphIR, Diagnostic } from '../types';

// Stub for cycle detection analysis (M0 baseline)
export function detectCycles(_graph: GraphIR): Diagnostic[] {
  return [];
}
