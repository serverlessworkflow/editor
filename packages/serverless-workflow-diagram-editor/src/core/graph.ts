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

import { Graph, GraphEdge, GraphNode, GraphNodeType } from "@serverlessworkflow/sdk";

// Override / add multiple properties of a type in a generic way
export type Override<T, NewProps> = Omit<T, keyof NewProps> & NewProps;

// Supported edge types
export enum GraphEdgeType {
  Default = "default",
  Error = "error",
  Condition = "condition",
}

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

// Add extra properties to GraphNode
export type ExtendedGraphNode = Override<
  GraphNode,
  {
    position?: Position;
    size?: Size;
  }
>;

// Add extra properties to GraphEdge
export type ExtendedGraphEdge = GraphEdge & {
  type?: GraphEdgeType;
  wayPoints?: WayPoints;
};

export type ExtendedGraph = Override<
  Graph,
  {
    parent?: ExtendedGraph | null;
    nodes: ExtendedGraphNode[];
    edges: ExtendedGraphEdge[];
    entryNode: ExtendedGraphNode;
    exitNode: ExtendedGraphNode;
  }
>;

export function solveEdgeTypes(graph: ExtendedGraph): ExtendedGraph {
  const graphClone = structuredClone(graph);

  // root level
  setEdgeTypes(graphClone);
  // children n level
  graphClone.nodes.flat().forEach((node) => setEdgeTypes(node as ExtendedGraph));

  return graphClone;
}

function setEdgeTypes(graph: ExtendedGraph): ExtendedGraph {
  if (!graph.edges || !graph.nodes) {
    return graph;
  }

  for (let i = 0; i < graph.nodes.length; i++) {
    const graphNode = graph.nodes[i]! as ExtendedGraph;

    for (let j = 0; j < graph.edges.length; j++) {
      const graphEdge = graph.edges[j]!;

      if (graphNode.id === graphEdge.sourceId) {
        switch (graphNode.type) {
          case GraphNodeType.Raise:
            graphEdge.type = GraphEdgeType.Error;
            break;
          case GraphNodeType.Switch:
            graphEdge.type = GraphEdgeType.Condition;
            break;
          default:
            graphEdge.type = GraphEdgeType.Default;
        }
      }
    }
  }

  return graph;
}
