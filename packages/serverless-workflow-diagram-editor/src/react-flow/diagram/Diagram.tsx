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
import "@xyflow/react/dist/style.css";
import "./Diagram.css";

const FIT_VIEW_OPTIONS: RF.FitViewOptions = { maxZoom: 1, minZoom: 0.1, duration: 400 };

// TODO: Nodes and Edges are hardcoded for now to generate a renderable basic workflow
// It shall be replaced by the actual implementation based on graph structure
const initialNodes: RF.Node[] = [
  { id: "n1", position: { x: 100, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 100, y: 100 }, data: { label: "Node 2" } },
  { id: "n3", position: { x: 0, y: 200 }, data: { label: "Node 3" } },
  { id: "n4", position: { x: 200, y: 200 }, data: { label: "Node 4" } },
  { id: "n5", position: { x: 100, y: 300 }, data: { label: "Node 5" } },
];
const initialEdges: RF.Edge[] = [
  { id: "n1-n2", source: "n1", target: "n2" },
  { id: "n2-n3", source: "n2", target: "n3" },
  { id: "n2-n4", source: "n2", target: "n4" },
  { id: "n3-n5", source: "n3", target: "n5" },
  { id: "n4-n5", source: "n4", target: "n5" },
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
};

export const Diagram = ({ divRef, ref }: DiagramProps) => {
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
    <div ref={divRef} className={"diagram-container"} data-testid={"diagram-container"}>
      <RF.ReactFlow
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
