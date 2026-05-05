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

import { FlatGraph, FlatGraphNode, GraphNodeType } from "@serverlessworkflow/sdk";

export function getNodesByType(graph: FlatGraph, type: GraphNodeType): FlatGraphNode[] {
  return graph.nodes.filter((node) => node.type === type);
}

// Inner entry and exit nodes cannot be connected external nodes so connections shall be moved to parent node
export function fixNodesConnections(graph: FlatGraph): FlatGraph {
  const entryNodes = getNodesByType(graph, GraphNodeType.Entry);
  const exitNodes = getNodesByType(graph, GraphNodeType.Exit);

  // Build maps of {entryNodeId -> parentId} and {exitNodeId -> parentId}
  const entryNodeToParent = new Map<string, string>();
  entryNodes.forEach((node) => {
    if (node.parentId) {
      entryNodeToParent.set(node.id, node.parentId);
    }
  });

  const exitNodeToParent = new Map<string, string>();
  exitNodes.forEach((node) => {
    if (node.parentId) {
      exitNodeToParent.set(node.id, node.parentId);
    }
  });

  const graphClone = structuredClone(graph);

  // Single pass over edges to rewrite sourceId/targetId
  graphClone.edges.forEach((edge) => {
    // Move entry node incoming connections to parent
    const entryParent = entryNodeToParent.get(edge.targetId);
    if (entryParent) {
      edge.targetId = entryParent;
    }

    // Move exit node outgoing connections to parent
    const exitParent = exitNodeToParent.get(edge.sourceId);
    if (exitParent) {
      edge.sourceId = exitParent;
    }
  });

  return graphClone;
}
