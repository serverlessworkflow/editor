/*
 * Copyright 2021-Present The Serverless Workflow Specification Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ReactFlowGraph } from "./diagramBuilder";

// Defaults
export const DEFAULT_NODE_SIZE = {
  height: 60,
  width: 180,
};

export type Point = {
  x: number;
  y: number;
};

export type Position = Point;

export type Size = {
  height: number;
  width: number;
};

export type WayPoints = Point[];

export function applyAutoLayout(graph: ReactFlowGraph): ReactFlowGraph {
  const graphClone = structuredClone(graph);

  // TODO: This is just a temporary implementation until the actual auto-layout engine is integrated
  let position: Position = { x: 0, y: 0 };

  // TODO: Containment is not supported for now.
  graphClone.nodes.forEach((node) => {
    node.height = DEFAULT_NODE_SIZE.height;
    node.width = DEFAULT_NODE_SIZE.width;
    node.position = { ...position };
    position.y = position.y + 100;
  });

  return graphClone;
}
