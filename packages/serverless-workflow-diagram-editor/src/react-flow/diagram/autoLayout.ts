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

// set
export function matchReactFlowGraphWithElkLayoutedGraph(
  graph: ReactFlowGraph,
  layoutedGraph: ElkNode,
): ReactFlowGraph {
  const graphClone = structuredClone(graph);

  // Map node positions
  const layoutedNodes = graphClone.nodes.map((node) => {
    const elkNode = layoutedGraph.children?.find((n) => n.id === node.id);
    if (elkNode && elkNode.x !== undefined && elkNode.y !== undefined) {
      return {
        ...node,
        position: { x: elkNode.x, y: elkNode.y },
        ...(elkNode.height && { height: elkNode.height }),
        ...(elkNode.width && { width: elkNode.width }),
      };
    }
    return node;
  });

  // Map edge waypoints (bend points)
  const layoutedEdges = graphClone.edges.map((edge) => {
    const elkEdge = layoutedGraph.edges?.find((e) => e.id === edge.id);
    if (elkEdge && elkEdge.sections) {
      // ELK returns sections which contain bend points. We pass these bendpoints to a custom edge.
      const bendPoints = elkEdge.sections.flatMap((section) => section.bendPoints || []);
      return {
        ...edge,
        data: {
          ...edge.data,
          ...(bendPoints.length > 0 && { wayPoints: bendPoints }),
        },
      };
    }
    return edge;
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
}

export async function applyAutoLayout(graph: ReactFlowGraph): Promise<ReactFlowGraph> {
  const elkGraph = buildElkGraphFromReactFlowGraph(graph);
  const layoutedGraph = await processElkLayout(elkGraph);

  // it is not possible to calculate auto-layout
  if (!layoutedGraph) {
    return graph;
  }

  return matchReactFlowGraphWithElkLayoutedGraph(graph, layoutedGraph);
}
