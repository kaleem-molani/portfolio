import type { Point } from '../types';
import type { PositionedNode } from './coordinates';

export function routeEdge(
  fromNode: PositionedNode,
  toNode: PositionedNode
): Point[] {
  // Source bottom-center point
  const startX = fromNode.x + fromNode.width / 2;
  const startY = fromNode.y + fromNode.height;

  // Destination top-center point
  const endX = toNode.x + toNode.width / 2;
  const endY = toNode.y;

  return [
    { x: startX, y: startY },
    { x: endX, y: endY }
  ];
}
