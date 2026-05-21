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

import type { ElkNode, LayoutOptions, ElkExtendedEdge } from "elkjs/lib/elk.bundled.js";
import { processElkLayout } from "@/core";
import { ReactFlowGraph } from "./diagramBuilder";

// Defaults
export const DEFAULT_NODE_SIZE = {
  height: 60,
  width: 200,
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

export const ROOT_LAYOUT_OPTIONS: LayoutOptions = {
  "elk.algorithm": "org.eclipse.elk.layered",
  "elk.hierarchyHandling": "INCLUDE_CHILDREN",
  "elk.direction": "DOWN",
  "org.eclipse.elk.layered.layering.strategy": "INTERACTIVE",
  "org.eclipse.elk.edgeRouting": "ORTHOGONAL",
  "elk.layered.unnecessaryBendpoints": "true",
  "org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
  "org.eclipse.elk.layered.nodePlacement.bk.edgeStraightening": "IMPROVE_STRAIGHTNESS",
  "org.eclipse.elk.layered.cycleBreaking.strategy": "DEPTH_FIRST",
  "org.eclipse.elk.insideSelfLoops.activate": "true",
  "elk.separateConnectedComponents": "false",
  "org.eclipse.elk.layered.nodePlacement.favorStraightEdges": "true",
  "org.eclipse.elk.layered.considerModelOrder.strategy": "EDGES",
  "org.eclipse.elk.layered.considerModelOrder.crossingCounterNodeInfluence": "0.001",
  "elk.layered.crossingMinimization.strategy": "INTERACTIVE",
  spacing: "75",
  "spacing.componentComponent": "70",
  "spacing.nodeNodeBetweenLayers": "80",
  "elk.layered.spacing.edgeNodeBetweenLayers": "40",
  "org.eclipse.elk.spacing.edgeNode": "24",
  "org.eclipse.elk.layered.mergeEdges": "true",
};

export function buildElkGraphFromReactFlowGraph(reactFlowGraph: ReactFlowGraph): ElkNode {
  // Create a map for easy lookup
  const nodeMap = new Map(
    reactFlowGraph.nodes.map((node) => [
      node.id,
      {
        id: node.id,
        width: node.measured?.width ?? DEFAULT_NODE_SIZE.width,
        height: node.measured?.height ?? DEFAULT_NODE_SIZE.height,
        children: [] as ElkNode[],
      },
    ]),
  );

  const rootChildren: ElkNode[] = [];
  // Nest children based on parentId
  reactFlowGraph.nodes.forEach((node) => {
    const elkNode = nodeMap.get(node.id)!;
    if (node.parentId && nodeMap.has(node.parentId)) {
      nodeMap.get(node.parentId)!.children.push(elkNode);
    } else {
      rootChildren.push(elkNode);
    }
  });

  // edges
  const elkEdges: ElkExtendedEdge[] = reactFlowGraph.edges.map((edge) => ({
    id: edge.id,
    sources: [edge.source],
    targets: [edge.target],
  }));

  return {
    id: "root",
    layoutOptions: ROOT_LAYOUT_OPTIONS,
    children: rootChildren,
    edges: elkEdges,
  };
}

// Helper function to recursively build a flat map of all ELK nodes
function buildElkNodeMap(
  elkNode: ElkNode,
  map: Map<string, ElkNode> = new Map(),
): Map<string, ElkNode> {
  map.set(elkNode.id, elkNode);
  if (elkNode.children) {
    for (const child of elkNode.children) {
      buildElkNodeMap(child, map);
    }
  }
  return map;
}

// set
export function matchReactFlowGraphWithElkLayoutedGraph(
  graph: ReactFlowGraph,
  layoutedGraph: ElkNode,
): ReactFlowGraph {
  // Build flat maps for O(1) lookups
  const elkNodeMap = buildElkNodeMap(layoutedGraph);
  const elkEdgeMap = new Map(layoutedGraph.edges?.map((e) => [e.id, e]) || []);

  // Map node positions
  const layoutedNodes = graph.nodes.map((node) => {
    const elkNode = elkNodeMap.get(node.id);
    if (elkNode && elkNode.x !== undefined && elkNode.y !== undefined) {
      return {
        ...node,
        position: { x: elkNode.x, y: elkNode.y },
        ...(elkNode.height !== undefined && { height: elkNode.height }),
        ...(elkNode.width !== undefined && { width: elkNode.width }),
      };
    }
    return node;
  });

  // Map edge waypoints (bend points)
  const layoutedEdges = graph.edges.map((edge) => {
    const elkEdge = elkEdgeMap.get(edge.id);
    if (elkEdge) {
      // Reconstruct data without old wayPoints to avoid stale routing whenever ELK produced this edge.
      const { wayPoints: _oldWayPoints, ...restData } = edge.data || {};
      const bendPoints = elkEdge.sections?.flatMap((section) => section.bendPoints || []) || [];
      return {
        ...edge,
        data: {
          ...restData,
          ...(bendPoints.length > 0 && { wayPoints: bendPoints }),
        },
      };
    }
    return edge;
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
}

export async function applyAutoLayout(
  graph: ReactFlowGraph,
  signal?: AbortSignal,
): Promise<ReactFlowGraph> {
  const elkGraph = buildElkGraphFromReactFlowGraph(graph);
  const layoutedGraph = await processElkLayout(elkGraph, signal);

  // it is not possible to calculate auto-layout
  if (!layoutedGraph) {
    return graph;
  }

  return matchReactFlowGraphWithElkLayoutedGraph(graph, layoutedGraph);
}
