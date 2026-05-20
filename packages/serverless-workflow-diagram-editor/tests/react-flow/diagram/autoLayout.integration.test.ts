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

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { ElkNode } from "elkjs/lib/elk.bundled.js";
import type { Node, Edge } from "@xyflow/react";
import {
  buildElkGraphFromReactFlowGraph,
  matchReactFlowGraphWithElkLayoutedGraph,
  applyAutoLayout,
  DEFAULT_NODE_SIZE,
  ROOT_LAYOUT_OPTIONS,
} from "../../../src/react-flow/diagram/autoLayout";
import type { ReactFlowGraph } from "../../../src/react-flow/diagram/diagramBuilder";
import * as core from "../../../src/core";

// Mock the processElkLayout function
vi.mock("../../../src/core", () => ({
  processElkLayout: vi.fn(),
}));

describe("autoLayout", () => {
  describe("buildElkGraphFromReactFlowGraph", () => {
    it("converts simple ReactFlow graph to ELK graph", () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [
          { id: "node1", position: { x: 0, y: 0 }, data: {}, measured: { width: 150, height: 50 } },
          { id: "node2", position: { x: 0, y: 0 }, data: {}, measured: { width: 200, height: 60 } },
        ] as Node[],
        edges: [{ id: "edge1", source: "node1", target: "node2", data: {} }] as Edge[],
      };

      const elkGraph = buildElkGraphFromReactFlowGraph(reactFlowGraph);

      expect(elkGraph.id).toBe("root");
      expect(elkGraph.layoutOptions).toEqual(ROOT_LAYOUT_OPTIONS);
      expect(elkGraph.children).toHaveLength(2);
      expect(elkGraph.children?.[0]).toEqual({
        id: "node1",
        width: 150,
        height: 50,
        children: [],
      });
      expect(elkGraph.children?.[1]).toEqual({
        id: "node2",
        width: 200,
        height: 60,
        children: [],
      });
      expect(elkGraph.edges).toHaveLength(1);
      expect(elkGraph.edges?.[0]).toEqual({
        id: "edge1",
        sources: ["node1"],
        targets: ["node2"],
      });
    });

    it("uses default node size when measured dimensions are not available", () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [{ id: "node1", position: { x: 0, y: 0 }, data: {} }] as Node[],
        edges: [],
      };

      const elkGraph = buildElkGraphFromReactFlowGraph(reactFlowGraph);

      expect(elkGraph.children?.[0]).toEqual({
        id: "node1",
        width: DEFAULT_NODE_SIZE.width,
        height: DEFAULT_NODE_SIZE.height,
        children: [],
      });
    });

    it("handles nested nodes with parentId", () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [
          {
            id: "parent",
            position: { x: 0, y: 0 },
            data: {},
            measured: { width: 300, height: 200 },
          },
          {
            id: "child1",
            position: { x: 10, y: 10 },
            data: {},
            parentId: "parent",
            measured: { width: 100, height: 50 },
          },
          {
            id: "child2",
            position: { x: 10, y: 70 },
            data: {},
            parentId: "parent",
            measured: { width: 100, height: 50 },
          },
        ] as Node[],
        edges: [],
      };

      const elkGraph = buildElkGraphFromReactFlowGraph(reactFlowGraph);

      expect(elkGraph.children).toHaveLength(1);
      expect(elkGraph.children?.[0].id).toBe("parent");
      expect(elkGraph.children?.[0].children).toHaveLength(2);
      expect(elkGraph.children?.[0].children?.[0].id).toBe("child1");
      expect(elkGraph.children?.[0].children?.[1].id).toBe("child2");
    });

    it("handles empty graph", () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [],
        edges: [],
      };

      const elkGraph = buildElkGraphFromReactFlowGraph(reactFlowGraph);

      expect(elkGraph.id).toBe("root");
      expect(elkGraph.children).toHaveLength(0);
      expect(elkGraph.edges).toHaveLength(0);
    });

    it("handles multiple edges between nodes", () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [
          { id: "node1", position: { x: 0, y: 0 }, data: {} },
          { id: "node2", position: { x: 0, y: 0 }, data: {} },
        ] as Node[],
        edges: [
          { id: "edge1", source: "node1", target: "node2", data: {} },
          { id: "edge2", source: "node2", target: "node1", data: {} },
        ] as Edge[],
      };

      const elkGraph = buildElkGraphFromReactFlowGraph(reactFlowGraph);

      expect(elkGraph.edges).toHaveLength(2);
      expect(elkGraph.edges?.[0]).toEqual({
        id: "edge1",
        sources: ["node1"],
        targets: ["node2"],
      });
      expect(elkGraph.edges?.[1]).toEqual({
        id: "edge2",
        sources: ["node2"],
        targets: ["node1"],
      });
    });

    it("ignores nodes with non-existent parentId", () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [
          { id: "node1", position: { x: 0, y: 0 }, data: {}, parentId: "nonexistent" },
        ] as Node[],
        edges: [],
      };

      const elkGraph = buildElkGraphFromReactFlowGraph(reactFlowGraph);

      expect(elkGraph.children).toHaveLength(1);
      expect(elkGraph.children?.[0].id).toBe("node1");
    });
  });

  describe("matchReactFlowGraphWithElkLayoutedGraph", () => {
    it("updates node positions from ELK layout", () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [
          { id: "node1", position: { x: 0, y: 0 }, data: {} },
          { id: "node2", position: { x: 0, y: 0 }, data: {} },
        ] as Node[],
        edges: [],
      };

      const layoutedElkGraph: ElkNode = {
        id: "root",
        children: [
          { id: "node1", x: 50, y: 100, width: 200, height: 60 },
          { id: "node2", x: 50, y: 200, width: 200, height: 60 },
        ],
        edges: [],
      };

      const result = matchReactFlowGraphWithElkLayoutedGraph(reactFlowGraph, layoutedElkGraph);

      expect(result.nodes[0].position).toEqual({ x: 50, y: 100 });
      expect(result.nodes[0].width).toBe(200);
      expect(result.nodes[0].height).toBe(60);
      expect(result.nodes[1].position).toEqual({ x: 50, y: 200 });
    });

    it("preserves original node data when no ELK node found", () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [{ id: "node1", position: { x: 10, y: 20 }, data: { label: "Test" } }] as Node[],
        edges: [],
      };

      const layoutedElkGraph: ElkNode = {
        id: "root",
        children: [],
        edges: [],
      };

      const result = matchReactFlowGraphWithElkLayoutedGraph(reactFlowGraph, layoutedElkGraph);

      expect(result.nodes[0].position).toEqual({ x: 10, y: 20 });
      expect(result.nodes[0].data).toEqual({ label: "Test" });
    });

    it("adds waypoints to edges from ELK bend points", () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [
          { id: "node1", position: { x: 0, y: 0 }, data: {} },
          { id: "node2", position: { x: 0, y: 0 }, data: {} },
        ] as Node[],
        edges: [{ id: "edge1", source: "node1", target: "node2", data: {} }] as Edge[],
      };

      const layoutedElkGraph: ElkNode = {
        id: "root",
        children: [
          { id: "node1", x: 0, y: 0 },
          { id: "node2", x: 200, y: 100 },
        ],
        edges: [
          {
            id: "edge1",
            sources: ["node1"],
            targets: ["node2"],
            sections: [
              {
                id: "section1",
                startPoint: { x: 0, y: 0 },
                endPoint: { x: 200, y: 100 },
                bendPoints: [
                  { x: 100, y: 0 },
                  { x: 100, y: 100 },
                ],
              },
            ],
          },
        ],
      };

      const result = matchReactFlowGraphWithElkLayoutedGraph(reactFlowGraph, layoutedElkGraph);

      expect(result.edges[0].data?.wayPoints).toEqual([
        { x: 100, y: 0 },
        { x: 100, y: 100 },
      ]);
    });

    it("handles edges without bend points", () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [
          { id: "node1", position: { x: 0, y: 0 }, data: {} },
          { id: "node2", position: { x: 0, y: 0 }, data: {} },
        ] as Node[],
        edges: [{ id: "edge1", source: "node1", target: "node2", data: {} }] as Edge[],
      };

      const layoutedElkGraph: ElkNode = {
        id: "root",
        children: [
          { id: "node1", x: 0, y: 0 },
          { id: "node2", x: 200, y: 0 },
        ],
        edges: [
          {
            id: "edge1",
            sources: ["node1"],
            targets: ["node2"],
            sections: [
              {
                id: "section1",
                startPoint: { x: 0, y: 0 },
                endPoint: { x: 200, y: 0 },
              },
            ],
          },
        ],
      };

      const result = matchReactFlowGraphWithElkLayoutedGraph(reactFlowGraph, layoutedElkGraph);

      expect(result.edges[0].data?.wayPoints).toBeUndefined();
    });

    it("preserves edge data when no ELK edge found", () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [],
        edges: [
          { id: "edge1", source: "node1", target: "node2", data: { label: "Test Edge" } },
        ] as Edge[],
      };

      const layoutedElkGraph: ElkNode = {
        id: "root",
        children: [],
        edges: [],
      };

      const result = matchReactFlowGraphWithElkLayoutedGraph(reactFlowGraph, layoutedElkGraph);

      expect(result.edges[0].data).toEqual({ label: "Test Edge" });
    });

    it("does not mutate original graph", () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [{ id: "node1", position: { x: 0, y: 0 }, data: {} }] as Node[],
        edges: [],
      };

      const originalPosition = { ...reactFlowGraph.nodes[0].position };

      const layoutedElkGraph: ElkNode = {
        id: "root",
        children: [{ id: "node1", x: 100, y: 200 }],
        edges: [],
      };

      matchReactFlowGraphWithElkLayoutedGraph(reactFlowGraph, layoutedElkGraph);

      expect(reactFlowGraph.nodes[0].position).toEqual(originalPosition);
    });

    it("handles multiple sections with bend points", () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [],
        edges: [{ id: "edge1", source: "node1", target: "node2", data: {} }] as Edge[],
      };

      const layoutedElkGraph: ElkNode = {
        id: "root",
        children: [],
        edges: [
          {
            id: "edge1",
            sources: ["node1"],
            targets: ["node2"],
            sections: [
              {
                id: "section1",
                startPoint: { x: 0, y: 0 },
                endPoint: { x: 100, y: 50 },
                bendPoints: [{ x: 50, y: 0 }],
              },
              {
                id: "section2",
                startPoint: { x: 100, y: 50 },
                endPoint: { x: 200, y: 100 },
                bendPoints: [{ x: 150, y: 100 }],
              },
            ],
          },
        ],
      };

      const result = matchReactFlowGraphWithElkLayoutedGraph(reactFlowGraph, layoutedElkGraph);

      expect(result.edges[0].data?.wayPoints).toEqual([
        { x: 50, y: 0 },
        { x: 150, y: 100 },
      ]);
    });
  });

  describe("applyAutoLayout", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("applies auto layout successfully", async () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [
          { id: "node1", position: { x: 0, y: 0 }, data: {}, measured: { width: 200, height: 60 } },
          { id: "node2", position: { x: 0, y: 0 }, data: {}, measured: { width: 200, height: 60 } },
        ] as Node[],
        edges: [{ id: "edge1", source: "node1", target: "node2", data: {} }] as Edge[],
      };

      const layoutedElkGraph: ElkNode = {
        id: "root",
        children: [
          { id: "node1", x: 50, y: 100, width: 200, height: 60 },
          { id: "node2", x: 50, y: 200, width: 200, height: 60 },
        ],
        edges: [
          {
            id: "edge1",
            sources: ["node1"],
            targets: ["node2"],
          },
        ],
      };

      vi.mocked(core.processElkLayout).mockResolvedValue(layoutedElkGraph);

      const result = await applyAutoLayout(reactFlowGraph);

      expect(core.processElkLayout).toHaveBeenCalledTimes(1);
      expect(result.nodes[0].position).toEqual({ x: 50, y: 100 });
      expect(result.nodes[1].position).toEqual({ x: 50, y: 200 });
    });

    it("returns original graph when ELK layout fails", async () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [{ id: "node1", position: { x: 10, y: 20 }, data: {} }] as Node[],
        edges: [],
      };

      vi.mocked(core.processElkLayout).mockResolvedValue(null);

      const result = await applyAutoLayout(reactFlowGraph);

      expect(result).toEqual(reactFlowGraph);
      expect(result.nodes[0].position).toEqual({ x: 10, y: 20 });
    });

    it("handles empty graph", async () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [],
        edges: [],
      };

      const layoutedElkGraph: ElkNode = {
        id: "root",
        children: [],
        edges: [],
      };

      vi.mocked(core.processElkLayout).mockResolvedValue(layoutedElkGraph);

      const result = await applyAutoLayout(reactFlowGraph);

      expect(result.nodes).toHaveLength(0);
      expect(result.edges).toHaveLength(0);
    });

    it("passes correct ELK graph structure to processElkLayout", async () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [
          { id: "node1", position: { x: 0, y: 0 }, data: {}, measured: { width: 150, height: 50 } },
        ] as Node[],
        edges: [],
      };

      const layoutedElkGraph: ElkNode = {
        id: "root",
        children: [{ id: "node1", x: 0, y: 0 }],
        edges: [],
      };

      vi.mocked(core.processElkLayout).mockResolvedValue(layoutedElkGraph);

      await applyAutoLayout(reactFlowGraph);

      expect(core.processElkLayout).toHaveBeenCalledWith({
        id: "root",
        layoutOptions: ROOT_LAYOUT_OPTIONS,
        children: [
          {
            id: "node1",
            width: 150,
            height: 50,
            children: [],
          },
        ],
        edges: [],
      });
    });

    it("handles complex graph with nested nodes and edges", async () => {
      const reactFlowGraph: ReactFlowGraph = {
        nodes: [
          {
            id: "parent",
            position: { x: 0, y: 0 },
            data: {},
            measured: { width: 300, height: 200 },
          },
          {
            id: "child1",
            position: { x: 10, y: 10 },
            data: {},
            parentId: "parent",
            measured: { width: 100, height: 50 },
          },
          { id: "node2", position: { x: 0, y: 0 }, data: {}, measured: { width: 200, height: 60 } },
        ] as Node[],
        edges: [{ id: "edge1", source: "parent", target: "node2", data: {} }] as Edge[],
      };

      const layoutedElkGraph: ElkNode = {
        id: "root",
        children: [
          {
            id: "parent",
            x: 0,
            y: 0,
            width: 300,
            height: 200,
            children: [{ id: "child1", x: 10, y: 10, width: 100, height: 50 }],
          },
          { id: "node2", x: 350, y: 50, width: 200, height: 60 },
        ],
        edges: [
          {
            id: "edge1",
            sources: ["parent"],
            targets: ["node2"],
          },
        ],
      };

      vi.mocked(core.processElkLayout).mockResolvedValue(layoutedElkGraph);

      const result = await applyAutoLayout(reactFlowGraph);

      expect(result.nodes).toHaveLength(3);
      expect(result.nodes[0].position).toEqual({ x: 0, y: 0 });
      expect(result.nodes[2].position).toEqual({ x: 350, y: 50 });
    });
  });
});
