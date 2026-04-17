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
import { NodeTypes } from "../../../src/react-flow/nodes/Nodes";
import { DEFAULT_NODE_SIZE } from "../../../src/core";

describe("React Flow custom node types", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("render react flow custom node types", () => {
    const nodes: RF.Node[] = [
      {
        id: "n1",
        type: GraphNodeType.Call,
        position: { x: 100, y: 0 },
        height: DEFAULT_NODE_SIZE.height,
        width: DEFAULT_NODE_SIZE.width,
        data: { label: "Node 1" },
      },
      {
        id: "n2",
        type: GraphNodeType.Do,
        position: { x: 100, y: 100 },
        height: DEFAULT_NODE_SIZE.height,
        width: DEFAULT_NODE_SIZE.width,
        data: { label: "Node 2" },
      },
      {
        id: "n3",
        type: GraphNodeType.Switch,
        position: { x: 100, y: 200 },
        height: DEFAULT_NODE_SIZE.height,
        width: DEFAULT_NODE_SIZE.width,
        data: { label: "Node 3" },
      },
      {
        id: "n4",
        type: GraphNodeType.Emit,
        position: { x: 0, y: 300 },
        height: DEFAULT_NODE_SIZE.height,
        width: DEFAULT_NODE_SIZE.width,
        data: { label: "Node 4" },
      },
      {
        id: "n5",
        type: GraphNodeType.For,
        position: { x: 100, y: 300 },
        height: DEFAULT_NODE_SIZE.height,
        width: DEFAULT_NODE_SIZE.width,
        data: { label: "Node 5" },
      },
      {
        id: "n6",
        type: GraphNodeType.Fork,
        position: { x: 200, y: 300 },
        height: DEFAULT_NODE_SIZE.height,
        width: DEFAULT_NODE_SIZE.width,
        data: { label: "Node 6" },
      },
      {
        id: "n7",
        type: GraphNodeType.Listen,
        position: { x: 100, y: 400 },
        height: DEFAULT_NODE_SIZE.height,
        width: DEFAULT_NODE_SIZE.width,
        data: { label: "Node 7" },
      },
      {
        id: "n8",
        type: GraphNodeType.Raise,
        position: { x: 100, y: 500 },
        height: DEFAULT_NODE_SIZE.height,
        width: DEFAULT_NODE_SIZE.width,
        data: { label: "Node 8" },
      },
      {
        id: "n9",
        type: GraphNodeType.Run,
        position: { x: 100, y: 600 },
        height: DEFAULT_NODE_SIZE.height,
        width: DEFAULT_NODE_SIZE.width,
        data: { label: "Node 9" },
      },
      {
        id: "n10",
        type: GraphNodeType.Set,
        position: { x: 100, y: 700 },
        height: DEFAULT_NODE_SIZE.height,
        width: DEFAULT_NODE_SIZE.width,
        data: { label: "Node 10" },
      },
      {
        id: "n11",
        type: GraphNodeType.Try,
        position: { x: 100, y: 800 },
        height: DEFAULT_NODE_SIZE.height,
        width: DEFAULT_NODE_SIZE.width,
        data: { label: "Node 11" },
      },
      {
        id: "n12",
        type: GraphNodeType.Wait,
        position: { x: 100, y: 900 },
        height: DEFAULT_NODE_SIZE.height,
        width: DEFAULT_NODE_SIZE.width,
        data: { label: "Node 12" },
      },
    ];

    const edges: RF.Edge[] = [
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
    ];

    render(
      <div>
        <RF.ReactFlow nodeTypes={NodeTypes} nodes={nodes} edges={edges} />
      </div>,
    );

    const callNode = screen.getByTestId("call-node-n1");
    const doNode = screen.getByTestId("do-node-n2");
    const switchNode = screen.getByTestId("switch-node-n3");
    const emitNode = screen.getByTestId("emit-node-n4");
    const forNode = screen.getByTestId("for-node-n5");
    const forkNode = screen.getByTestId("fork-node-n6");
    const listenNode = screen.getByTestId("listen-node-n7");
    const raiseNode = screen.getByTestId("raise-node-n8");
    const runNode = screen.getByTestId("run-node-n9");
    const setNode = screen.getByTestId("set-node-n10");
    const tryNode = screen.getByTestId("try-node-n11");
    const waitNode = screen.getByTestId("wait-node-n12");

    expect(callNode).toBeInTheDocument();
    expect(doNode).toBeInTheDocument();
    expect(switchNode).toBeInTheDocument();
    expect(emitNode).toBeInTheDocument();
    expect(forNode).toBeInTheDocument();
    expect(forkNode).toBeInTheDocument();
    expect(listenNode).toBeInTheDocument();
    expect(raiseNode).toBeInTheDocument();
    expect(runNode).toBeInTheDocument();
    expect(setNode).toBeInTheDocument();
    expect(tryNode).toBeInTheDocument();
    expect(waitNode).toBeInTheDocument();
  });
});
