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

import { render, screen } from "@testing-library/react";
import { vi, it, expect, afterEach, describe } from "vitest";
import * as RF from "@xyflow/react";
import { GraphNodeType } from "@serverlessworkflow/sdk";
import { ReactFlowNodeTypes } from "../../../src/react-flow/nodes/Nodes";
import { taskNodeConfigMap, type LeafNodeType } from "../../../src/react-flow/nodes/taskNodeConfig";
import { DEFAULT_NODE_SIZE } from "../../../src/react-flow/diagram/autoLayout";

function testNode(id: string, type: string, y: number, label: string): RF.Node {
  return {
    id,
    type,
    position: { x: 100, y },
    height: DEFAULT_NODE_SIZE.height,
    width: DEFAULT_NODE_SIZE.width,
    data: { label },
  };
}

const allNodes: RF.Node[] = [
  testNode("start", GraphNodeType.Start, 0, "Start"),
  testNode("n1", GraphNodeType.Call, 0, "Node 1"),
  testNode("n2", GraphNodeType.Do, 100, "Node 2"),
  testNode("n3", GraphNodeType.Switch, 200, "Node 3"),
  testNode("n4", GraphNodeType.Emit, 300, "Node 4"),
  testNode("n5", GraphNodeType.For, 400, "Node 5"),
  testNode("n6", GraphNodeType.Fork, 500, "Node 6"),
  testNode("n7", GraphNodeType.Listen, 600, "Node 7"),
  testNode("n8", GraphNodeType.Raise, 700, "Node 8"),
  testNode("n9", GraphNodeType.Run, 800, "Node 9"),
  testNode("n10", GraphNodeType.Set, 900, "Node 10"),
  testNode("n11", GraphNodeType.Try, 1000, "Node 11"),
  testNode("n12", GraphNodeType.Wait, 1100, "Node 12"),
  testNode("end", GraphNodeType.End, 0, "End"),
];

const allEdges: RF.Edge[] = [
  { id: "start-n1", source: "start", target: "n1" },
  { id: "n1-n2", source: "n1", target: "n2" },
  { id: "n2-n3", source: "n2", target: "n3" },
  { id: "n3-n4", source: "n3", target: "n4" },
  { id: "n3-n5", source: "n3", target: "n5" },
  { id: "n3-n6", source: "n3", target: "n6" },
  { id: "n4-n7", source: "n4", target: "n7" },
  { id: "n5-n7", source: "n5", target: "n7" },
  { id: "n6-n7", source: "n6", target: "n7" },
  { id: "n7-n8", source: "n7", target: "n8" },
  { id: "n8-n9", source: "n8", target: "n9" },
  { id: "n9-n10", source: "n9", target: "n10" },
  { id: "n10-n11", source: "n10", target: "n11" },
  { id: "n11-n12", source: "n11", target: "n12" },
  { id: "n12-end", source: "n12", target: "end" },
];

describe("React Flow custom node types", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("render react flow custom node types", () => {
    render(
      <div>
        <RF.ReactFlow nodeTypes={ReactFlowNodeTypes} nodes={allNodes} edges={allEdges} />
      </div>,
    );

    expect(screen.getByTestId("start-node-start")).toBeInTheDocument();
    expect(screen.getByTestId("call-node-n1")).toBeInTheDocument();
    expect(screen.getByTestId("do-node-n2")).toBeInTheDocument();
    expect(screen.getByTestId("switch-node-n3")).toBeInTheDocument();
    expect(screen.getByTestId("emit-node-n4")).toBeInTheDocument();
    expect(screen.getByTestId("for-node-n5")).toBeInTheDocument();
    expect(screen.getByTestId("fork-node-n6")).toBeInTheDocument();
    expect(screen.getByTestId("listen-node-n7")).toBeInTheDocument();
    expect(screen.getByTestId("raise-node-n8")).toBeInTheDocument();
    expect(screen.getByTestId("run-node-n9")).toBeInTheDocument();
    expect(screen.getByTestId("set-node-n10")).toBeInTheDocument();
    expect(screen.getByTestId("try-node-n11")).toBeInTheDocument();
    expect(screen.getByTestId("wait-node-n12")).toBeInTheDocument();
    expect(screen.getByTestId("end-node-end")).toBeInTheDocument();
  });

  describe("should render leaf nodes with TaskNodeContent", () => {
    const leafNodes: { id: string; type: LeafNodeType; testId: string }[] = [
      { id: "n1", type: GraphNodeType.Call, testId: "call" },
      { id: "n3", type: GraphNodeType.Switch, testId: "switch" },
      { id: "n4", type: GraphNodeType.Emit, testId: "emit" },
      { id: "n7", type: GraphNodeType.Listen, testId: "listen" },
      { id: "n8", type: GraphNodeType.Raise, testId: "raise" },
      { id: "n9", type: GraphNodeType.Run, testId: "run" },
      { id: "n10", type: GraphNodeType.Set, testId: "set" },
      { id: "n12", type: GraphNodeType.Wait, testId: "wait" },
    ];

    it.each(leafNodes)("should render %s node with correct config", ({ id, type, testId }) => {
      render(
        <div>
          <RF.ReactFlow nodeTypes={ReactFlowNodeTypes} nodes={allNodes} edges={allEdges} />
        </div>,
      );

      const nodeData = allNodes.find((n) => n.id === id);
      const node = screen.getByTestId(`${testId}-node-${id}`);
      const config = taskNodeConfigMap[type];

      expect(node).toHaveClass("dec-task-node-container");
      expect(node.querySelector(".dec-task-node-type")?.textContent).toBe(config.typeLabel);
      expect(node.querySelector(".dec-task-node-name")?.textContent).toBe(nodeData?.data.label);
      expect(node.style.getPropertyValue("--task-node-color")).toBe(config.color);
    });
  });
});
