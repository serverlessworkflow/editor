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

import * as RF from "@xyflow/react";
import { buildFlatGraph } from "../../core";
import { BaseNodeData, ReactFlowNodeTypes } from "../nodes/Nodes";
import { BaseEdgeData, EdgeTypes } from "../edges/Edges";
import * as sdk from "@serverlessworkflow/sdk";
import { applyAutoLayout, DEFAULT_NODE_SIZE } from "./autoLayout";

export type ReactFlowGraph = {
  nodes: RF.Node[];
  edges: RF.Edge[];
};

export function getEdgeType(graphEdge: sdk.GraphEdge, nodeMap: Map<string, RF.Node>): EdgeTypes {
  const source = nodeMap.get(graphEdge.sourceId);

  if (!source) return EdgeTypes.Default;

  const typeMap: Partial<Record<sdk.GraphNodeType, EdgeTypes>> = {
    [sdk.GraphNodeType.Raise]: EdgeTypes.Error,
    [sdk.GraphNodeType.Switch]: EdgeTypes.Condition,
  };

  return typeMap[source.type as sdk.GraphNodeType] ?? EdgeTypes.Default;
}

export function edgeSourceAndTargetExist(
  graphEdge: sdk.GraphEdge,
  nodeIdSet: Set<string>,
): boolean {
  return nodeIdSet.has(graphEdge.sourceId) && nodeIdSet.has(graphEdge.targetId);
}

function buildReactFlowNode(graphNode: sdk.FlatGraph | sdk.FlatGraphNode): RF.Node<BaseNodeData> {
  // There is no corresponding react flow component implemented
  if (!Object.keys(ReactFlowNodeTypes).includes(graphNode.type)) {
    throw new Error(`Unsupported GraphNodeType: ${graphNode.type}!`);
  }

  return {
    id: graphNode.id,
    type: graphNode.type,
    data: {
      label: graphNode.label ?? "",
      ...(graphNode.task !== undefined && { task: structuredClone(graphNode.task) }),
    },
    height: DEFAULT_NODE_SIZE.height,
    width: DEFAULT_NODE_SIZE.width,
    position: { x: 0, y: 0 },
  };
}

function buildReactFlowEdge(
  graphEdge: sdk.GraphEdge,
  nodeMap: Map<string, RF.Node>,
): RF.Edge<BaseEdgeData> {
  const type = getEdgeType(graphEdge, nodeMap);

  return {
    id: graphEdge.id,
    source: graphEdge.sourceId,
    target: graphEdge.targetId,
    type,
    data: {
      label: graphEdge.label ?? "",
    },
    animated: graphEdge.label === "default" || type === EdgeTypes.Error,
  };
}

export function buildDiagramElements(model: sdk.Specification.Workflow | null): ReactFlowGraph {
  const nodes: RF.Node[] = [];
  const edges: RF.Edge[] = [];

  if (model) {
    const graph = buildFlatGraph(model);

    graph.nodes.forEach((graphNode) => {
      // TODO: only nodes on root level are supported for now
      if (graphNode.parentId === "root") {
        nodes.push(buildReactFlowNode(graphNode));
      }
    });

    // Precompute node ID set for O(1) membership checks
    const nodeIdSet = new Set(nodes.map((node) => node.id));
    // Build nodeId->node map for edge type determination
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    graph.edges.forEach((graphEdge) => {
      // Only create edges for existing nodes
      if (edgeSourceAndTargetExist(graphEdge, nodeIdSet)) {
        edges.push(buildReactFlowEdge(graphEdge, nodeMap));
      }
    });
  }

  return applyAutoLayout({ nodes, edges });
}
