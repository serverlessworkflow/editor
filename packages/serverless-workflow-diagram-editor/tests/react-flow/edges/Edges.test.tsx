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

import { vi, it, expect, afterEach, describe } from "vitest";
import { render } from "@testing-library/react";
import { GraphEdgeType } from "../../../src/core/graph";
import {
  ConditionEdge,
  DefaultEdge,
  EdgeLabel,
  EdgeTypes,
  ErrorEdge,
  createPathFromWayPoints,
} from "../../../src/react-flow/edges/Edges";
import * as RF from "@xyflow/react";

describe("React Flow custom edge types", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("exports all edge types from GraphEdgeType enum", () => {
    expect(EdgeTypes).toHaveProperty(GraphEdgeType.Default);
    expect(EdgeTypes).toHaveProperty(GraphEdgeType.Error);
    expect(EdgeTypes).toHaveProperty(GraphEdgeType.Condition);
    expect(Object.keys(EdgeTypes)).toHaveLength(3);
  });

  it.each([
    { component: DefaultEdge, edgeDescription: "default", edgeClass: "" },
    { component: ErrorEdge, edgeDescription: "error", edgeClass: "error" },
    { component: ConditionEdge, edgeDescription: "condition", edgeClass: "condition" },
  ])("renders $edgeDescription edge", ({ component, edgeClass }) => {
    const Component = component;
    const { container } = render(
      <RF.ReactFlowProvider>
        <Component
          id={"n1-n2"}
          source={"n1"}
          target={"n2"}
          sourceX={0}
          sourceY={0}
          targetX={0}
          targetY={0}
          sourcePosition={RF.Position.Left}
          targetPosition={RF.Position.Left}
        />
      </RF.ReactFlowProvider>,
    );
    const path = container.querySelector("path.edge-line");
    expect(path).toBeInTheDocument();
    expect(path).toHaveClass(`edge-line ${edgeClass}`);
  });

  it("matches snapshot with waypoints", () => {
    const { container } = render(
      <RF.ReactFlowProvider>
        <DefaultEdge
          id={"n1-n2"}
          source={"n1"}
          target={"n2"}
          sourceX={0}
          sourceY={0}
          targetX={0}
          targetY={0}
          sourcePosition={RF.Position.Left}
          targetPosition={RF.Position.Left}
          data={{
            wayPoints: [{ x: 50, y: 50 }],
          }}
        />
      </RF.ReactFlowProvider>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});

describe("createPathFromWayPoints helper function", () => {
  type context = {
    description: string;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    wayPoints?: Array<{ x: number; y: number }>;
    expected: string;
  };

  it.each<context>([
    {
      description: "creates simple path without waypoints",
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      wayPoints: undefined,
      expected: "M 0,0 L 100,100",
    },
    {
      description: "creates simple path with empty waypoints array",
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      wayPoints: [],
      expected: "M 0,0 L 100,100",
    },
    {
      description: "creates path with single waypoint",
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      wayPoints: [{ x: 50, y: 50 }],
      expected: "M 0,0 L 50,50 L 100,100",
    },
    {
      description: "creates path with multiple waypoints",
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      wayPoints: [
        { x: 25, y: 25 },
        { x: 50, y: 50 },
        { x: 75, y: 75 },
      ],
      expected: "M 0,0 L 25,25 L 50,50 L 75,75 L 100,100",
    },
    {
      description: "creates path with negative coordinates",
      sourceX: -100,
      sourceY: -100,
      targetX: 100,
      targetY: 100,
      wayPoints: [
        { x: -50, y: -50 },
        { x: 50, y: 50 },
      ],
      expected: "M -100,-100 L -50,-50 L 50,50 L 100,100",
    },
    {
      description: "creates path with decimal coordinates",
      sourceX: 0.5,
      sourceY: 10.25,
      targetX: 100.75,
      targetY: 200.5,
      wayPoints: [{ x: 50.5, y: 75.25 }],
      expected: "M 0.5,10.25 L 50.5,75.25 L 100.75,200.5",
    },
    {
      description: "handles complex path with many waypoints",
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      wayPoints: [
        { x: 10, y: 10 },
        { x: 20, y: 30 },
        { x: 40, y: 20 },
        { x: 60, y: 50 },
        { x: 80, y: 40 },
        { x: 90, y: 90 },
      ],
      expected: "M 0,0 L 10,10 L 20,30 L 40,20 L 60,50 L 80,40 L 90,90 L 100,100",
    },
    {
      description: "preserves coordinate precision",
      sourceX: 0.1,
      sourceY: 0.2,
      targetX: 99.9,
      targetY: 99.8,
      wayPoints: [
        { x: 33.333333, y: 66.666666 },
        { x: 77.777777, y: 88.888888 },
      ],
      expected: "M 0.1,0.2 L 33.333333,66.666666 L 77.777777,88.888888 L 99.9,99.8",
    },
  ])("$description", ({ sourceX, sourceY, targetX, targetY, wayPoints, expected }) => {
    const path = createPathFromWayPoints(sourceX, sourceY, targetX, targetY, wayPoints);
    expect(path).toBe(expected);
  });
});

describe("EdgeLabel component", () => {
  it("returns empty when no label is provided", () => {
    const result = EdgeLabel({
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
    });

    expect(result).toEqual(<></>);
  });

  it("returns JSX when label is provided", () => {
    const result = EdgeLabel({
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      data: { label: "Test" },
    });

    expect(result).not.toBeNull();
    expect(result).toBeTruthy();
  });

  it.each([
    { edgeType: GraphEdgeType.Default, description: "default" },
    { edgeType: GraphEdgeType.Error, description: "error" },
    { edgeType: GraphEdgeType.Condition, description: "condition" },
  ])("edge label $description", ({ edgeType }) => {
    const result = EdgeLabel({
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      type: edgeType,
      data: { label: "Test" },
    });

    const resultString = JSON.stringify(result);
    expect(resultString).toContain("edge-label");
    expect(resultString).toContain(edgeType);
  });

  describe("integration with edges", () => {
    it.each([
      {
        component: DefaultEdge,
        description: "DefaultEdge renders without crash when label not provided",
        data: {},
        selector: "path.edge-line",
      },
      {
        component: DefaultEdge,
        description: "DefaultEdge renders without crash when label provided",
        data: { label: "Default Label" },
        selector: "path.edge-line",
      },
      {
        component: ErrorEdge,
        description: "ErrorEdge renders without crash with label",
        data: { label: "Error Label" },
        selector: "path.edge-line.error",
      },
      {
        component: ConditionEdge,
        description: "ConditionEdge renders without crash with label",
        data: { label: "Condition Label" },
        selector: "path.edge-line.condition",
      },
    ])("$description", ({ component: Component, data, selector }) => {
      const { container } = render(
        <RF.ReactFlowProvider>
          <Component
            id="e1"
            source="n1"
            target="n2"
            sourceX={0}
            sourceY={0}
            targetX={100}
            targetY={100}
            sourcePosition={RF.Position.Right}
            targetPosition={RF.Position.Left}
            data={data}
          />
        </RF.ReactFlowProvider>,
      );

      const path = container.querySelector(selector);
      expect(path).toBeTruthy();
    });
  });
});
