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

import { describe, it, expect } from "vitest";
import { FlatGraph, FlatGraphNode, GraphNodeType } from "@serverlessworkflow/sdk";
import { getNodesByType, fixNodesConnections } from "../../src/core/graph";

function createFlatGraph(
  nodes: FlatGraphNode[],
  edges: Array<{ id: string; sourceId: string; targetId: string; label: string }>,
): FlatGraph {
  const entryNode = nodes.find((n) => n.type === GraphNodeType.Entry);
  const exitNode = nodes.find((n) => n.type === GraphNodeType.Exit);

  return {
    id: "root",
    type: GraphNodeType.Do,
    nodes,
    edges,
    entryNode,
    exitNode,
  } as FlatGraph;
}

describe("graph utils", () => {
  describe("getNodesByType", () => {
    it("returns all nodes matching the specified type", () => {
      const entryNode1: FlatGraphNode = {
        id: "entry-1",
        type: GraphNodeType.Entry,
      } as FlatGraphNode;
      const entryNode2: FlatGraphNode = {
        id: "entry-2",
        type: GraphNodeType.Entry,
      } as FlatGraphNode;
      const taskNode1: FlatGraphNode = { id: "task-1", type: GraphNodeType.Call } as FlatGraphNode;
      const exitNode1: FlatGraphNode = { id: "exit-1", type: GraphNodeType.Exit } as FlatGraphNode;
      const taskNode2: FlatGraphNode = { id: "task-2", type: GraphNodeType.Set } as FlatGraphNode;

      const graph = createFlatGraph([entryNode1, taskNode1, entryNode2, exitNode1, taskNode2], []);

      const entryNodes = getNodesByType(graph, GraphNodeType.Entry);

      expect(entryNodes).toHaveLength(2);
      expect(entryNodes[0]?.id).toBe("entry-1");
      expect(entryNodes[1]?.id).toBe("entry-2");
    });

    it("returns empty array when no nodes match the type", () => {
      const taskNode1: FlatGraphNode = { id: "task-1", type: GraphNodeType.Call } as FlatGraphNode;
      const taskNode2: FlatGraphNode = { id: "task-2", type: GraphNodeType.Set } as FlatGraphNode;

      const graph = createFlatGraph([taskNode1, taskNode2], []);

      const exitNodes = getNodesByType(graph, GraphNodeType.Exit);

      expect(exitNodes).toEqual([]);
    });

    it("returns empty array when graph has no nodes", () => {
      const graph = createFlatGraph([], []);

      const entryNodes = getNodesByType(graph, GraphNodeType.Entry);

      expect(entryNodes).toEqual([]);
    });

    it("returns all nodes when all nodes match the type", () => {
      const callNode1: FlatGraphNode = { id: "call-1", type: GraphNodeType.Call } as FlatGraphNode;
      const callNode2: FlatGraphNode = { id: "call-2", type: GraphNodeType.Call } as FlatGraphNode;
      const callNode3: FlatGraphNode = { id: "call-3", type: GraphNodeType.Call } as FlatGraphNode;

      const graph = createFlatGraph([callNode1, callNode2, callNode3], []);

      const callNodes = getNodesByType(graph, GraphNodeType.Call);

      expect(callNodes).toHaveLength(3);
      expect(callNodes.every((node) => node.type === GraphNodeType.Call)).toBe(true);
    });
  });

  describe("fixNodesConnections", () => {
    it("moves entry node incoming connections to parent node", () => {
      const parentNode: FlatGraphNode = { id: "parent-1", type: GraphNodeType.Do } as FlatGraphNode;
      const entryNode: FlatGraphNode = {
        id: "entry-1",
        type: GraphNodeType.Entry,
        parentId: "parent-1",
      } as FlatGraphNode;
      const taskNode: FlatGraphNode = { id: "task-1", type: GraphNodeType.Call } as FlatGraphNode;

      const graph = createFlatGraph(
        [parentNode, entryNode, taskNode],
        [{ id: "edge-1", sourceId: "task-1", targetId: "entry-1", label: "" }],
      );

      const fixedGraph = fixNodesConnections(graph);

      expect(fixedGraph.edges[0]?.targetId).toBe("parent-1");
      expect(fixedGraph.edges[0]?.sourceId).toBe("task-1");
    });

    it("moves exit node outgoing connections to parent node", () => {
      const parentNode: FlatGraphNode = { id: "parent-1", type: GraphNodeType.Do } as FlatGraphNode;
      const exitNode: FlatGraphNode = {
        id: "exit-1",
        type: GraphNodeType.Exit,
        parentId: "parent-1",
      } as FlatGraphNode;
      const taskNode: FlatGraphNode = { id: "task-1", type: GraphNodeType.Call } as FlatGraphNode;

      const graph = createFlatGraph(
        [parentNode, exitNode, taskNode],
        [{ id: "edge-1", sourceId: "exit-1", targetId: "task-1", label: "" }],
      );

      const fixedGraph = fixNodesConnections(graph);

      expect(fixedGraph.edges[0]?.sourceId).toBe("parent-1");
      expect(fixedGraph.edges[0]?.targetId).toBe("task-1");
    });

    it("handles both entry and exit node connections in the same graph", () => {
      const parentNode: FlatGraphNode = { id: "parent-1", type: GraphNodeType.Do } as FlatGraphNode;
      const entryNode: FlatGraphNode = {
        id: "entry-1",
        type: GraphNodeType.Entry,
        parentId: "parent-1",
      } as FlatGraphNode;
      const exitNode: FlatGraphNode = {
        id: "exit-1",
        type: GraphNodeType.Exit,
        parentId: "parent-1",
      } as FlatGraphNode;
      const taskBefore: FlatGraphNode = {
        id: "task-before",
        type: GraphNodeType.Call,
      } as FlatGraphNode;
      const taskAfter: FlatGraphNode = {
        id: "task-after",
        type: GraphNodeType.Call,
      } as FlatGraphNode;

      const graph = createFlatGraph(
        [parentNode, entryNode, exitNode, taskBefore, taskAfter],
        [
          { id: "edge-1", sourceId: "task-before", targetId: "entry-1", label: "" },
          { id: "edge-2", sourceId: "exit-1", targetId: "task-after", label: "" },
        ],
      );

      const fixedGraph = fixNodesConnections(graph);

      expect(fixedGraph.edges[0]?.targetId).toBe("parent-1");
      expect(fixedGraph.edges[1]?.sourceId).toBe("parent-1");
    });

    it("does not modify entry node connections when parentId is undefined", () => {
      const entryNode: FlatGraphNode = {
        id: "entry-1",
        type: GraphNodeType.Entry,
      } as FlatGraphNode;
      const taskNode: FlatGraphNode = { id: "task-1", type: GraphNodeType.Call } as FlatGraphNode;

      const graph = createFlatGraph(
        [entryNode, taskNode],
        [{ id: "edge-1", sourceId: "task-1", targetId: "entry-1", label: "" }],
      );

      const fixedGraph = fixNodesConnections(graph);

      expect(fixedGraph.edges[0]?.targetId).toBe("entry-1");
    });

    it("does not modify exit node connections when parentId is undefined", () => {
      const exitNode: FlatGraphNode = { id: "exit-1", type: GraphNodeType.Exit } as FlatGraphNode;
      const taskNode: FlatGraphNode = { id: "task-1", type: GraphNodeType.Call } as FlatGraphNode;

      const graph = createFlatGraph(
        [exitNode, taskNode],
        [{ id: "edge-1", sourceId: "exit-1", targetId: "task-1", label: "" }],
      );

      const fixedGraph = fixNodesConnections(graph);

      expect(fixedGraph.edges[0]?.sourceId).toBe("exit-1");
    });

    it("does not modify edges that do not involve entry or exit nodes", () => {
      const taskNode1: FlatGraphNode = { id: "task-1", type: GraphNodeType.Call } as FlatGraphNode;
      const taskNode2: FlatGraphNode = { id: "task-2", type: GraphNodeType.Set } as FlatGraphNode;
      const entryNode: FlatGraphNode = {
        id: "entry-1",
        type: GraphNodeType.Entry,
        parentId: "parent-1",
      } as FlatGraphNode;

      const graph = createFlatGraph(
        [taskNode1, taskNode2, entryNode],
        [{ id: "edge-1", sourceId: "task-1", targetId: "task-2", label: "" }],
      );

      const fixedGraph = fixNodesConnections(graph);

      expect(fixedGraph.edges[0]?.sourceId).toBe("task-1");
      expect(fixedGraph.edges[0]?.targetId).toBe("task-2");
    });

    it("returns a new graph object (does not mutate original)", () => {
      const parentNode: FlatGraphNode = { id: "parent-1", type: GraphNodeType.Do } as FlatGraphNode;
      const entryNode: FlatGraphNode = {
        id: "entry-1",
        type: GraphNodeType.Entry,
        parentId: "parent-1",
      } as FlatGraphNode;
      const taskNode: FlatGraphNode = { id: "task-1", type: GraphNodeType.Call } as FlatGraphNode;

      const graph = createFlatGraph(
        [parentNode, entryNode, taskNode],
        [{ id: "edge-1", sourceId: "task-1", targetId: "entry-1", label: "" }],
      );

      const originalTargetId = graph.edges[0]?.targetId;
      const fixedGraph = fixNodesConnections(graph);

      expect(graph.edges[0]?.targetId).toBe(originalTargetId);
      expect(fixedGraph.edges[0]?.targetId).toBe("parent-1");
      expect(graph).not.toBe(fixedGraph);
    });

    it("handles graph with no edges", () => {
      const entryNode: FlatGraphNode = {
        id: "entry-1",
        type: GraphNodeType.Entry,
        parentId: "parent-1",
      } as FlatGraphNode;
      const exitNode: FlatGraphNode = {
        id: "exit-1",
        type: GraphNodeType.Exit,
        parentId: "parent-1",
      } as FlatGraphNode;

      const graph = createFlatGraph([entryNode, exitNode], []);

      const fixedGraph = fixNodesConnections(graph);

      expect(fixedGraph.edges).toEqual([]);
    });

    it("handles graph with no entry or exit nodes", () => {
      const taskNode1: FlatGraphNode = { id: "task-1", type: GraphNodeType.Call } as FlatGraphNode;
      const taskNode2: FlatGraphNode = { id: "task-2", type: GraphNodeType.Set } as FlatGraphNode;

      const graph = createFlatGraph(
        [taskNode1, taskNode2],
        [{ id: "edge-1", sourceId: "task-1", targetId: "task-2", label: "" }],
      );

      const fixedGraph = fixNodesConnections(graph);

      expect(fixedGraph.edges).toEqual(graph.edges);
    });

    it("handles multiple entry nodes with different parents", () => {
      const parentNode1: FlatGraphNode = {
        id: "parent-1",
        type: GraphNodeType.Do,
      } as FlatGraphNode;
      const parentNode2: FlatGraphNode = {
        id: "parent-2",
        type: GraphNodeType.Do,
      } as FlatGraphNode;
      const entryNode1: FlatGraphNode = {
        id: "entry-1",
        type: GraphNodeType.Entry,
        parentId: "parent-1",
      } as FlatGraphNode;
      const entryNode2: FlatGraphNode = {
        id: "entry-2",
        type: GraphNodeType.Entry,
        parentId: "parent-2",
      } as FlatGraphNode;
      const taskNode1: FlatGraphNode = { id: "task-1", type: GraphNodeType.Call } as FlatGraphNode;
      const taskNode2: FlatGraphNode = { id: "task-2", type: GraphNodeType.Call } as FlatGraphNode;

      const graph = createFlatGraph(
        [parentNode1, parentNode2, entryNode1, entryNode2, taskNode1, taskNode2],
        [
          { id: "edge-1", sourceId: "task-1", targetId: "entry-1", label: "" },
          { id: "edge-2", sourceId: "task-2", targetId: "entry-2", label: "" },
        ],
      );

      const fixedGraph = fixNodesConnections(graph);

      expect(fixedGraph.edges[0]?.targetId).toBe("parent-1");
      expect(fixedGraph.edges[1]?.targetId).toBe("parent-2");
    });

    it("handles multiple exit nodes with different parents", () => {
      const parentNode1: FlatGraphNode = {
        id: "parent-1",
        type: GraphNodeType.Do,
      } as FlatGraphNode;
      const parentNode2: FlatGraphNode = {
        id: "parent-2",
        type: GraphNodeType.Do,
      } as FlatGraphNode;
      const exitNode1: FlatGraphNode = {
        id: "exit-1",
        type: GraphNodeType.Exit,
        parentId: "parent-1",
      } as FlatGraphNode;
      const exitNode2: FlatGraphNode = {
        id: "exit-2",
        type: GraphNodeType.Exit,
        parentId: "parent-2",
      } as FlatGraphNode;
      const taskNode1: FlatGraphNode = { id: "task-1", type: GraphNodeType.Call } as FlatGraphNode;
      const taskNode2: FlatGraphNode = { id: "task-2", type: GraphNodeType.Call } as FlatGraphNode;

      const graph = createFlatGraph(
        [parentNode1, parentNode2, exitNode1, exitNode2, taskNode1, taskNode2],
        [
          { id: "edge-1", sourceId: "exit-1", targetId: "task-1", label: "" },
          { id: "edge-2", sourceId: "exit-2", targetId: "task-2", label: "" },
        ],
      );

      const fixedGraph = fixNodesConnections(graph);

      expect(fixedGraph.edges[0]?.sourceId).toBe("parent-1");
      expect(fixedGraph.edges[1]?.sourceId).toBe("parent-2");
    });

    it("only modifies edges where entry/exit nodes are involved, not other edges", () => {
      const parentNode: FlatGraphNode = { id: "parent-1", type: GraphNodeType.Do } as FlatGraphNode;
      const entryNode: FlatGraphNode = {
        id: "entry-1",
        type: GraphNodeType.Entry,
        parentId: "parent-1",
      } as FlatGraphNode;
      const taskNode1: FlatGraphNode = { id: "task-1", type: GraphNodeType.Call } as FlatGraphNode;
      const taskNode2: FlatGraphNode = { id: "task-2", type: GraphNodeType.Set } as FlatGraphNode;
      const taskNode3: FlatGraphNode = { id: "task-3", type: GraphNodeType.Wait } as FlatGraphNode;

      const graph = createFlatGraph(
        [parentNode, entryNode, taskNode1, taskNode2, taskNode3],
        [
          { id: "edge-1", sourceId: "task-1", targetId: "entry-1", label: "" },
          { id: "edge-2", sourceId: "task-2", targetId: "task-3", label: "" },
          { id: "edge-3", sourceId: "task-1", targetId: "task-2", label: "" },
        ],
      );

      const fixedGraph = fixNodesConnections(graph);

      expect(fixedGraph.edges[0]?.targetId).toBe("parent-1");
      expect(fixedGraph.edges[1]?.sourceId).toBe("task-2");
      expect(fixedGraph.edges[1]?.targetId).toBe("task-3");
      expect(fixedGraph.edges[2]?.sourceId).toBe("task-1");
      expect(fixedGraph.edges[2]?.targetId).toBe("task-2");
    });
  });
});
