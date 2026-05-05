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

import { describe, it, expect, beforeAll } from "vitest";
import * as RF from "@xyflow/react";
import { GraphNodeType } from "@serverlessworkflow/sdk";
import {
  getEdgeType,
  edgeSourceAndTargetExist,
  buildDiagramElements,
} from "../../../src/react-flow/diagram/diagramBuilder";
import { EdgeTypes } from "../../../src/react-flow/edges/Edges";
import { parseWorkflow } from "../../../src/core";
import {
  BASIC_VALID_WORKFLOW_JSON,
  BASIC_VALID_WORKFLOW_JSON_TASKS,
} from "../../fixtures/workflows";

// Type alias for diagram elements to reduce verbosity
type DiagramElements = ReturnType<typeof buildDiagramElements>;

// Test data factories for better reusability and maintainability
const createNode = (id: string, type: GraphNodeType, label: string, yPosition = 0): RF.Node => ({
  id,
  type,
  position: { x: 0, y: yPosition },
  data: { label },
});

const createEdge = (id: string, sourceId: string, targetId: string, label = "") => ({
  id,
  sourceId,
  targetId,
  label,
});

// Helper function to build diagram from workflow JSON
const buildDiagramFromWorkflow = (
  workflowJson: string,
): ReturnType<typeof buildDiagramElements> => {
  const parseResult = parseWorkflow(workflowJson);
  return buildDiagramElements(parseResult.model);
};

// Helper function to setup diagram data for edge tests
const setupDiagramForEdgeTests = (workflowJson: string) => {
  const diagram = buildDiagramFromWorkflow(workflowJson);
  return {
    diagram,
    nodeIdSet: new Set(diagram.nodes.map((node) => node.id)),
    nodeMap: new Map(diagram.nodes.map((node) => [node.id, node])),
  };
};

// Test assertion helpers for node properties
const assertAllNodesHaveBaseProperties = (nodes: RF.Node[]) => {
  nodes.forEach((node) => {
    expect(node).toHaveProperty("id");
    expect(node).toHaveProperty("type");
    expect(node).toHaveProperty("data");
    expect(node).toHaveProperty("position");
    expect(node.data).toHaveProperty("label");
  });
};

const assertAllNodesHavePositions = (nodes: RF.Node[]) => {
  nodes.forEach((node) => {
    expect(node.position).toBeDefined();
    expect(typeof node.position.x).toBe("number");
    expect(typeof node.position.y).toBe("number");
  });
};

const assertAllNodesHaveDimensions = (nodes: RF.Node[]) => {
  nodes.forEach((node) => {
    expect(node.width).toBeDefined();
    expect(node.height).toBeDefined();
    expect(typeof node.width).toBe("number");
    expect(typeof node.height).toBe("number");
  });
};

// Test assertion helpers for edge properties
const assertEdgeHasBaseProperties = (edge: RF.Edge) => {
  expect(edge).toMatchObject({
    id: expect.any(String),
    source: expect.any(String),
    target: expect.any(String),
    type: expect.any(String),
    data: expect.any(Object),
  });
};

const assertEdgeIsAnimated = (edge: RF.Edge) => {
  expect(edge.animated).toBe(true);
};

const assertEdgeNodesExist = (edge: RF.Edge, nodeIdSet: Set<string>) => {
  expect(nodeIdSet.has(edge.source)).toBe(true);
  expect(nodeIdSet.has(edge.target)).toBe(true);
};

const assertEdgeTypeMatchesSourceNode = (edge: RF.Edge, nodeMap: Map<string, RF.Node>) => {
  const graphEdge = {
    id: edge.id,
    sourceId: edge.source,
    targetId: edge.target,
    label: edge.data?.label as string | undefined,
  };
  const expectedType = getEdgeType(graphEdge, nodeMap);
  expect(edge.type).toBe(expectedType);
};

describe("diagramBuilder", () => {
  describe("getEdgeType", () => {
    it.each([
      {
        nodeType: GraphNodeType.Raise,
        nodeId: "raise-1",
        label: "Raise Error",
        expectedEdgeType: EdgeTypes.Error,
        description: "returns Error edge type when source node is a Raise node",
      },
      {
        nodeType: GraphNodeType.Switch,
        nodeId: "switch-1",
        label: "Switch",
        expectedEdgeType: EdgeTypes.Condition,
        description: "returns Condition edge type when source node is a Switch node",
      },
      {
        nodeType: GraphNodeType.Start,
        nodeId: "start-1",
        label: "Start",
        expectedEdgeType: EdgeTypes.Default,
        description: "returns Default edge type when source node is a Start node",
      },
      {
        nodeType: GraphNodeType.Do,
        nodeId: "do-1",
        label: "Do",
        expectedEdgeType: EdgeTypes.Default,
        description: "returns Default edge type when source node is a Do node",
      },
      {
        nodeType: GraphNodeType.Call,
        nodeId: "task-1",
        label: "Task 1",
        expectedEdgeType: EdgeTypes.Default,
        description: "returns Default edge type for regular task nodes",
      },
    ])("$description", ({ nodeType, nodeId, label, expectedEdgeType }) => {
      const nodes: RF.Node[] = [
        createNode(nodeId, nodeType, label),
        createNode("task-2", GraphNodeType.Call, "Task 2", 100),
      ];
      const nodeMap = new Map(nodes.map((node) => [node.id, node]));

      const edge = createEdge("edge-1", nodeId, "task-2");
      const edgeType = getEdgeType(edge, nodeMap);

      expect(edgeType).toBe(expectedEdgeType);
    });

    it("returns Default edge type when source node is not found", () => {
      const nodes: RF.Node[] = [createNode("task-1", GraphNodeType.Call, "Task 1")];
      const nodeMap = new Map(nodes.map((node) => [node.id, node]));

      const edge = createEdge("edge-1", "non-existent", "task-1");
      const edgeType = getEdgeType(edge, nodeMap);

      expect(edgeType).toBe(EdgeTypes.Default);
    });
  });

  describe("EdgeSourceAndTargetExist", () => {
    describe("valid edge scenarios", () => {
      it("returns true when both source and target nodes exist", () => {
        const nodes: RF.Node[] = [
          createNode("task-1", GraphNodeType.Call, "Task 1"),
          createNode("task-2", GraphNodeType.Set, "Task 2", 100),
        ];
        const nodeIdSet = new Set(nodes.map((node) => node.id));

        const edge = createEdge("edge-1", "task-1", "task-2");
        const result = edgeSourceAndTargetExist(edge, nodeIdSet);

        expect(result).toBe(true);
      });

      it("returns true for self-referencing edge when node exists", () => {
        const nodes: RF.Node[] = [createNode("task-1", GraphNodeType.Call, "Task 1")];
        const nodeIdSet = new Set(nodes.map((node) => node.id));

        const edge = createEdge("edge-1", "task-1", "task-1");
        const result = edgeSourceAndTargetExist(edge, nodeIdSet);

        expect(result).toBe(true);
      });
    });

    describe("invalid edge scenarios", () => {
      it("returns false when source node does not exist", () => {
        const nodes: RF.Node[] = [createNode("task-2", GraphNodeType.Set, "Task 2", 100)];
        const nodeIdSet = new Set(nodes.map((node) => node.id));

        const edge = createEdge("edge-1", "non-existent", "task-2");
        const result = edgeSourceAndTargetExist(edge, nodeIdSet);

        expect(result).toBe(false);
      });

      it("returns false when target node does not exist", () => {
        const nodes: RF.Node[] = [createNode("task-1", GraphNodeType.Call, "Task 1")];
        const nodeIdSet = new Set(nodes.map((node) => node.id));

        const edge = createEdge("edge-1", "task-1", "non-existent");
        const result = edgeSourceAndTargetExist(edge, nodeIdSet);

        expect(result).toBe(false);
      });

      it("returns false when both source and target nodes do not exist", () => {
        const nodes: RF.Node[] = [createNode("task-1", GraphNodeType.Call, "Task 1")];
        const nodeIdSet = new Set(nodes.map((node) => node.id));

        const edge = createEdge("edge-1", "non-existent-1", "non-existent-2");
        const result = edgeSourceAndTargetExist(edge, nodeIdSet);

        expect(result).toBe(false);
      });

      it("returns false when nodes array is empty", () => {
        const nodes: RF.Node[] = [];
        const nodeIdSet = new Set(nodes.map((node) => node.id));

        const edge = createEdge("edge-1", "task-1", "task-2");
        const result = edgeSourceAndTargetExist(edge, nodeIdSet);

        expect(result).toBe(false);
      });
    });
  });

  describe("buildDiagramElements", () => {
    describe("basic functionality", () => {
      it("builds diagram elements from a valid workflow model", () => {
        const diagram: DiagramElements = buildDiagramFromWorkflow(BASIC_VALID_WORKFLOW_JSON);

        expect(diagram.nodes.length).toBeGreaterThan(0);
        expect(diagram.edges.length).toBeGreaterThanOrEqual(0);
      });

      it("builds multiple nodes and edges from workflow with tasks", () => {
        const diagram: DiagramElements = buildDiagramFromWorkflow(BASIC_VALID_WORKFLOW_JSON_TASKS);

        expect(diagram.nodes).toHaveLength(7);
        expect(diagram.edges).toHaveLength(6);
      });

      it("returns empty nodes and edges when model is null", () => {
        const diagram: DiagramElements = buildDiagramElements(null);

        expect(diagram.nodes).toEqual([]);
        expect(diagram.edges).toEqual([]);
      });
    });

    describe("node properties", () => {
      let diagram: DiagramElements;

      beforeAll(() => {
        diagram = buildDiagramFromWorkflow(BASIC_VALID_WORKFLOW_JSON_TASKS);
      });

      it("creates nodes with correct base properties", () => {
        assertAllNodesHaveBaseProperties(diagram.nodes);
      });

      it("applies auto-layout to nodes with positions", () => {
        assertAllNodesHavePositions(diagram.nodes);
      });

      it("sets node dimensions from DEFAULT_NODE_SIZE", () => {
        assertAllNodesHaveDimensions(diagram.nodes);
      });

      it("preserves node task data when available", () => {
        const taskNodes = diagram.nodes.filter((node) => node.data.task !== undefined);
        taskNodes.forEach((node) => {
          expect(node.data.task).toBeDefined();
        });
      });

      it("creates unique IDs for all nodes", () => {
        const nodeIds = diagram.nodes.map((node) => node.id);
        const uniqueIds = new Set(nodeIds);
        expect(uniqueIds.size).toBe(nodeIds.length);
      });

      it("creates nodes with expected types from workflow", () => {
        const nodeTypes = new Set(diagram.nodes.map((node) => node.type));
        expect(nodeTypes).toContain(GraphNodeType.Start);
        expect(nodeTypes).toContain(GraphNodeType.Set);
        expect(nodeTypes.size).toBeGreaterThan(1);
      });
    });

    describe("edge properties", () => {
      let diagram: DiagramElements;
      let nodeIdSet: Set<string>;
      let nodeMap: Map<string, RF.Node>;

      beforeAll(() => {
        const testData = setupDiagramForEdgeTests(BASIC_VALID_WORKFLOW_JSON_TASKS);
        diagram = testData.diagram;
        nodeIdSet = testData.nodeIdSet;
        nodeMap = testData.nodeMap;
      });

      it("creates edges with correct base properties", () => {
        diagram.edges.forEach(assertEdgeHasBaseProperties);
      });

      it("creates edges with animated property for default label", () => {
        const defaultEdges = diagram.edges.filter((edge) => edge.data?.label === "default");
        defaultEdges.forEach(assertEdgeIsAnimated);
      });

      it("only creates edges for existing nodes", () => {
        diagram.edges.forEach((edge) => assertEdgeNodesExist(edge, nodeIdSet));
      });

      it("assigns correct edge types based on source node type", () => {
        diagram.edges.forEach((edge) => assertEdgeTypeMatchesSourceNode(edge, nodeMap));
      });

      it("creates unique IDs for all edges", () => {
        const edgeIds = diagram.edges.map((edge) => edge.id);
        const uniqueIds = new Set(edgeIds);
        expect(uniqueIds.size).toBe(edgeIds.length);
      });
    });

    describe("graph structure", () => {
      it("creates nodes from workflow", () => {
        const diagram: DiagramElements = buildDiagramFromWorkflow(BASIC_VALID_WORKFLOW_JSON_TASKS);

        expect(diagram.nodes.length).toBeGreaterThan(0);
      });
    });
  });
});
