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

import * as React from "react";
import * as RF from "@xyflow/react";
import { GraphNodeType } from "@serverlessworkflow/sdk";
import { NodeTypes } from "../nodes/Nodes";
import { DEFAULT_NODE_SIZE } from "../../core";
import "@xyflow/react/dist/style.css";
import "./Diagram.css";
import { ResolvedColorMode } from "../../types/colorMode";

const FIT_VIEW_OPTIONS: RF.FitViewOptions = {
  maxZoom: 1,
  minZoom: 0.1,
  duration: 400,
};

// TODO: Nodes and Edges are hardcoded for now to generate a renderable basic workflow
// It shall be replaced by the actual implementation based on graph structure
const initialNodes: RF.Node[] = [
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
const initialEdges: RF.Edge[] = [
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

/**
 * Diagram component API
 */
export type DiagramRef = {
  doSomething: () => void; // TODO: to be implemented, it is just a placeholder
};

export type DiagramProps = {
  divRef?: React.RefObject<HTMLDivElement | null>;
  ref?: React.Ref<DiagramRef>;
  colorMode?: ResolvedColorMode;
};

export const Diagram = ({ divRef, ref, colorMode = "light" }: DiagramProps) => {
  const [minimapVisible, setMinimapVisible] = React.useState(false);
  const [nodes, setNodes] = React.useState<RF.Node[]>(initialNodes);
  const [edges, setEdges] = React.useState<RF.Edge[]>(initialEdges);

  const onNodesChange = React.useCallback<RF.OnNodesChange>(
    (changes) => setNodes((nodesSnapshot) => RF.applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = React.useCallback<RF.OnEdgesChange>(
    (changes) => setEdges((edgesSnapshot) => RF.applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  React.useImperativeHandle(
    ref,
    () => ({
      doSomething: () => {
        // TODO: to be implemented, it is just a placeholder
      },
    }),
    [],
  );

  return (
    <div ref={divRef} className="dec:h-full dec:relative" data-testid={"diagram-container"}>
      <RF.ReactFlow
        nodeTypes={NodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onlyRenderVisibleElements={true}
        zoomOnDoubleClick={false}
        elementsSelectable={true}
        panOnScroll={true}
        zoomOnScroll={false}
        preventScrolling={true}
        selectionOnDrag={true}
        fitView
        colorMode={colorMode}
        data-testid={"react-flow-canvas"}
      >
        {minimapVisible && <RF.MiniMap pannable zoomable position={"top-right"} />}

        <RF.Controls
          fitViewOptions={FIT_VIEW_OPTIONS}
          position={"bottom-right"}
          showInteractive={false}
        >
          <RF.ControlButton onClick={() => setMinimapVisible(!minimapVisible)}>M</RF.ControlButton>
        </RF.Controls>
        <RF.Background className="diagram-background" variant={RF.BackgroundVariant.Cross} />
      </RF.ReactFlow>
    </div>
  );
};
