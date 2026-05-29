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
  "org.eclipse.elk.algorithm": "org.eclipse.elk.layered",
  "org.eclipse.elk.direction": "DOWN",
  "org.eclipse.elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
  "org.eclipse.elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
  "org.eclipse.elk.layered.nodePlacement.bk.edgeStraightening": "IMPROVE_STRAIGHTNESS",
  "org.eclipse.elk.layered.nodePlacement.favorStraightEdges": "true",
  "org.eclipse.elk.layered.priority.straightness": "10",
  "org.eclipse.elk.hierarchyHandling": "INCLUDE_CHILDREN",
  "org.eclipse.elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "org.eclipse.elk.edgeRouting": "ORTHOGONAL",
  "org.eclipse.elk.layered.unnecessaryBendpoints": "true",
  "org.eclipse.elk.layered.cycleBreaking.strategy": "GREEDY_MODEL_ORDER",
  "org.eclipse.elk.layered.considerModelOrder.crossingCounterNodeInfluence": "0.001",
  "org.eclipse.elk.layered.spacing.edgeNode": "24",
  "org.eclipse.elk.layered.spacing.edgeNodeBetweenLayers": "40",
  "org.eclipse.elk.layered.spacing.nodeNode": "24",
  "org.eclipse.elk.layered.spacing.nodeNodeBetweenLayers": "80",
  "org.eclipse.elk.layered.spacing.componentComponent": "70",
  "org.eclipse.elk.layered.mergeEdges": "true",
};

export const PARENT_LAYOUT_OPTIONS: LayoutOptions = {
  ...ROOT_LAYOUT_OPTIONS,
  "org.eclipse.elk.padding": "[top=60,left=20,bottom=20,right=20]",
};

// Helper function to clean up empty edges arrays from nodes
function cleanupEmptyEdges(node: ElkNode): void {
  if (node.edges && node.edges.length === 0) {
    delete node.edges;
  }
  if (node.children) {
    node.children.forEach(cleanupEmptyEdges);
  }
}

// Helper function to find the common ancestor of two nodes
function findCommonAncestor(
  sourceId: string,
  targetId: string,
  reactFlowNodeMap: Map<string, { id: string; parentId?: string | undefined }>,
): string {
  // Build path from source to root
  const sourcePath = new Set<string>();
  let currentId: string | undefined = sourceId;
  while (currentId) {
    sourcePath.add(currentId);
    const node = reactFlowNodeMap.get(currentId);
    currentId = node?.parentId;
  }

  // Traverse from target to root and find first common node
  currentId = targetId;
  while (currentId) {
    if (sourcePath.has(currentId)) {
      return currentId;
    }
    const node = reactFlowNodeMap.get(currentId);
    currentId = node?.parentId;
  }

  // If no common ancestor found, return "root"
  return "root";
}

export function buildElkGraphFromReactFlowGraph(reactFlowGraph: ReactFlowGraph): ElkNode {
  // Create a map for easy lookup (without width/height initially)
  const nodeMap = new Map<string, ElkNode>(
    reactFlowGraph.nodes.map((node) => [
      node.id,
      {
        id: node.id,
        children: [] as ElkNode[],
        edges: [] as ElkExtendedEdge[],
      },
    ]),
  );

  const rootChildren: ElkNode[] = [];
  // Nest children based on parentId
  reactFlowGraph.nodes.forEach((node) => {
    const elkNode = nodeMap.get(node.id)!;
    if (node.parentId && nodeMap.has(node.parentId)) {
      const parentNode = nodeMap.get(node.parentId)!;
      if (!parentNode.children) {
        parentNode.children = [];
      }
      parentNode.children.push(elkNode);
    } else {
      rootChildren.push(elkNode);
    }
  });

  // Apply layout options and dimensions based on whether node has children
  reactFlowGraph.nodes.forEach((node) => {
    const elkNode = nodeMap.get(node.id)!;
    if (elkNode.children && elkNode.children.length > 0) {
      // Nodes with children get layout options but no fixed dimensions
      elkNode.layoutOptions = { ...PARENT_LAYOUT_OPTIONS };
    } else {
      // Leaf nodes get fixed dimensions
      elkNode.width = node.measured?.width ?? DEFAULT_NODE_SIZE.width;
      elkNode.height = node.measured?.height ?? DEFAULT_NODE_SIZE.height;
    }
  });

  const reactFlowNodeMap = new Map(reactFlowGraph.nodes.map((node) => [node.id, node]));

  // Nest edges in the appropriate hierarchy level
  const rootEdges: ElkExtendedEdge[] = [];
  reactFlowGraph.edges.forEach((edge) => {
    const elkEdge: ElkExtendedEdge = {
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    };

    // Find the lowest common ancestor that contains both source and target
    const commonAncestor = findCommonAncestor(edge.source, edge.target, reactFlowNodeMap);

    if (commonAncestor === "root") {
      rootEdges.push(elkEdge);
    } else {
      const ancestorNode = nodeMap.get(commonAncestor);
      if (ancestorNode) {
        if (!ancestorNode.edges) {
          ancestorNode.edges = [];
        }
        ancestorNode.edges.push(elkEdge);
      }
    }
  });

  // Clean up empty edges arrays from nodes that don't need them
  rootChildren.forEach(cleanupEmptyEdges);

  return {
    id: "root",
    layoutOptions: ROOT_LAYOUT_OPTIONS,
    children: rootChildren,
    edges: rootEdges,
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

// Helper function to recursively collect all edges from ELK graph
function buildElkEdgeMap(
  elkNode: ElkNode,
  map: Map<string, ElkExtendedEdge> = new Map(),
): Map<string, ElkExtendedEdge> {
  if (elkNode.edges) {
    for (const edge of elkNode.edges) {
      map.set(edge.id, edge);
    }
  }
  if (elkNode.children) {
    for (const child of elkNode.children) {
      buildElkEdgeMap(child, map);
    }
  }
  return map;
}

// Helper function to check if an edge is inside a parent node
function isEdgeInsideParent(
  edge: { source: string; target: string },
  nodeMap: Map<string, { id: string; parentId: string | undefined }>,
): boolean {
  // Edge is inside a parent if the lowest common ancestor is not the root
  // This matches the logic used in findCommonAncestor when building the ELK graph
  const commonAncestor = findCommonAncestor(edge.source, edge.target, nodeMap);
  return commonAncestor !== "root";
}

// set
export function matchReactFlowGraphWithElkLayoutedGraph(
  graph: ReactFlowGraph,
  layoutedGraph: ElkNode,
): ReactFlowGraph {
  // Build flat maps for O(1) lookups
  const elkNodeMap = buildElkNodeMap(layoutedGraph);
  const elkEdgeMap = buildElkEdgeMap(layoutedGraph);

  // Build node map for O(1) lookups in isEdgeInsideParent
  const reactFlowNodeMap = new Map(
    graph.nodes.map((node) => [node.id, { id: node.id, parentId: node.parentId }]),
  );

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
      // Reconstruct data without old wayPoints to avoid stale routing
      const { wayPoints: _oldWayPoints, ...restData } = edge.data || {};
      const bendPoints = elkEdge.sections?.flatMap((section) => section.bendPoints || []) || [];

      // Always create new data object, only add wayPoints if there are bend points
      const newData = { ...restData };
      if (bendPoints.length > 0) {
        // Drop ELK-provided way points for edges nested inside a parent to avoid React Flow rendering distortion
        const isInsideParent = isEdgeInsideParent(edge, reactFlowNodeMap);
        if (isInsideParent) {
          // There is an incompatibility with the react flow library, the wayPoints are calculated correctly by ELK
          // but the way react flow render edges inside parent nodes cause path distortions.
          newData.wayPoints = undefined;
        } else {
          newData.wayPoints = bendPoints;
        }
      }

      return {
        ...edge,
        data: newData,
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
