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
import { ReactFlowNodeTypes } from "../nodes/Nodes";
import "@xyflow/react/dist/style.css";
import "./Diagram.css";
import { ResolvedColorMode } from "../../types/colorMode";
import { ReactFlowEdgeTypes } from "../edges/Edges";
import { useDiagramEditorContext } from "../../store/DiagramEditorContext";
import { buildDiagramElements } from "./diagramBuilder";

const FIT_VIEW_OPTIONS: RF.FitViewOptions = {
  maxZoom: 1,
  minZoom: 0.1,
  duration: 400,
};

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
  const { model, nodes, edges, setNodes, setEdges } = useDiagramEditorContext();

  const [minimapVisible, setMinimapVisible] = React.useState(false);

  React.useImperativeHandle(
    ref,
    () => ({
      doSomething: () => {
        // TODO: to be implemented, it is just a placeholder
      },
    }),
    [],
  );

  const onNodesChange = React.useCallback<RF.OnNodesChange>(
    (changes) => setNodes((nodesSnapshot) => RF.applyNodeChanges(changes, nodesSnapshot)),
    [setNodes],
  );
  const onEdgesChange = React.useCallback<RF.OnEdgesChange>(
    (changes) => setEdges((edgesSnapshot) => RF.applyEdgeChanges(changes, edgesSnapshot)),
    [setEdges],
  );

  // Rebuild nodes and edges as model changes
  React.useEffect(() => {
    const { nodes, edges } = buildDiagramElements(model);
    setNodes(nodes);
    setEdges(edges);
  }, [model, setNodes, setEdges]);

  return (
    <div ref={divRef} className="dec:h-full dec:relative" data-testid={"diagram-container"}>
      <RF.ReactFlow
        nodeTypes={ReactFlowNodeTypes}
        nodes={nodes}
        edgeTypes={ReactFlowEdgeTypes}
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
        defaultEdgeOptions={{
          markerEnd: {
            type: RF.MarkerType.ArrowClosed,
            width: 10,
            height: 10,
          },
        }}
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
