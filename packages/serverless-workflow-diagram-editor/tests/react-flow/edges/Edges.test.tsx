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

  it("renders default edge", () => {
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
        />
      </RF.ReactFlowProvider>,
    );

    const path = container.querySelector("path.edge-line");
    expect(path).toBeInTheDocument();
    expect(path).toHaveClass("edge-line");
  });

  it("renders error edge", () => {
    const { container } = render(
      <RF.ReactFlowProvider>
        <ErrorEdge
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
    expect(path).toHaveClass("edge-line error");
  });

  it("renders condition edge", () => {
    const { container } = render(
      <RF.ReactFlowProvider>
        <ConditionEdge
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
    expect(path).toHaveClass("edge-line condition");
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
  it("creates simple path without waypoints", () => {
    const path = createPathFromWayPoints(0, 0, 100, 100);
    expect(path).toBe("M 0,0 L 100,100");
  });

  it("creates simple path with undefined waypoints", () => {
    const path = createPathFromWayPoints(0, 0, 100, 100, undefined);
    expect(path).toBe("M 0,0 L 100,100");
  });

  it("creates simple path with empty waypoints array", () => {
    const path = createPathFromWayPoints(0, 0, 100, 100, []);
    expect(path).toBe("M 0,0 L 100,100");
  });

  it("creates path with single waypoint", () => {
    const wayPoints = [{ x: 50, y: 50 }];
    const path = createPathFromWayPoints(0, 0, 100, 100, wayPoints);
    expect(path).toBe("M 0,0 L 50,50 L 100,100");
  });

  it("creates path with multiple waypoints", () => {
    const wayPoints = [
      { x: 25, y: 25 },
      { x: 50, y: 50 },
      { x: 75, y: 75 },
    ];
    const path = createPathFromWayPoints(0, 0, 100, 100, wayPoints);
    expect(path).toBe("M 0,0 L 25,25 L 50,50 L 75,75 L 100,100");
  });

  it("creates path with negative coordinates", () => {
    const wayPoints = [
      { x: -50, y: -50 },
      { x: 50, y: 50 },
    ];
    const path = createPathFromWayPoints(-100, -100, 100, 100, wayPoints);
    expect(path).toBe("M -100,-100 L -50,-50 L 50,50 L 100,100");
  });

  it("creates path with decimal coordinates", () => {
    const wayPoints = [{ x: 50.5, y: 75.25 }];
    const path = createPathFromWayPoints(0.5, 10.25, 100.75, 200.5, wayPoints);
    expect(path).toBe("M 0.5,10.25 L 50.5,75.25 L 100.75,200.5");
  });

  it("handles complex path with many waypoints", () => {
    const wayPoints = [
      { x: 10, y: 10 },
      { x: 20, y: 30 },
      { x: 40, y: 20 },
      { x: 60, y: 50 },
      { x: 80, y: 40 },
      { x: 90, y: 90 },
    ];
    const path = createPathFromWayPoints(0, 0, 100, 100, wayPoints);
    expect(path).toBe("M 0,0 L 10,10 L 20,30 L 40,20 L 60,50 L 80,40 L 90,90 L 100,100");
  });

  it("preserves coordinate precision", () => {
    const wayPoints = [
      { x: 33.333333, y: 66.666666 },
      { x: 77.777777, y: 88.888888 },
    ];
    const path = createPathFromWayPoints(0.1, 0.2, 99.9, 99.8, wayPoints);
    expect(path).toBe("M 0.1,0.2 L 33.333333,66.666666 L 77.777777,88.888888 L 99.9,99.8");
  });
});

describe("EdgeLabel component", () => {
  it("returns null when no label is provided", () => {
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

  it("edge label default", () => {
    const result = EdgeLabel({
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      type: GraphEdgeType.Default,
      data: { label: "Test" },
    });

    const resultString = JSON.stringify(result);
    expect(resultString).toContain("edge-label");
    expect(resultString).toContain(GraphEdgeType.Default);
  });

  it("edge label error", () => {
    const result = EdgeLabel({
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      type: GraphEdgeType.Error,
      data: { label: "Test" },
    });

    const resultString = JSON.stringify(result);
    expect(resultString).toContain("edge-label");
    expect(resultString).toContain(GraphEdgeType.Error);
  });

  it("edge label condition", () => {
    const result = EdgeLabel({
      sourceX: 0,
      sourceY: 0,
      targetX: 100,
      targetY: 100,
      type: GraphEdgeType.Condition,
      data: { label: "Test" },
    });

    const resultString = JSON.stringify(result);
    expect(resultString).toContain("edge-label");
    expect(resultString).toContain(GraphEdgeType.Condition);
  });

  describe("integration with edges", () => {
    it("DefaultEdge renders without crash when label not provided", () => {
      const { container } = render(
        <RF.ReactFlowProvider>
          <DefaultEdge
            id="e1"
            source="n1"
            target="n2"
            sourceX={0}
            sourceY={0}
            targetX={100}
            targetY={100}
            sourcePosition={RF.Position.Right}
            targetPosition={RF.Position.Left}
            data={{}}
          />
        </RF.ReactFlowProvider>,
      );

      const path = container.querySelector("path.edge-line");
      expect(path).toBeTruthy();
    });

    it("DefaultEdge renders without crash when label provided", () => {
      const { container } = render(
        <RF.ReactFlowProvider>
          <DefaultEdge
            id="e1"
            source="n1"
            target="n2"
            sourceX={0}
            sourceY={0}
            targetX={100}
            targetY={100}
            sourcePosition={RF.Position.Right}
            targetPosition={RF.Position.Left}
            data={{ label: "Default Label" }}
          />
        </RF.ReactFlowProvider>,
      );

      const path = container.querySelector("path.edge-line");
      expect(path).toBeTruthy();
    });

    it("ErrorEdge renders without crash with label", () => {
      const { container } = render(
        <RF.ReactFlowProvider>
          <ErrorEdge
            id="e1"
            source="n1"
            target="n2"
            sourceX={0}
            sourceY={0}
            targetX={100}
            targetY={100}
            sourcePosition={RF.Position.Right}
            targetPosition={RF.Position.Left}
            data={{ label: "Error Label" }}
          />
        </RF.ReactFlowProvider>,
      );

      const path = container.querySelector("path.edge-line.error");
      expect(path).toBeTruthy();
    });

    it("ConditionEdge renders without crash with label", () => {
      const { container } = render(
        <RF.ReactFlowProvider>
          <ConditionEdge
            id="e1"
            source="n1"
            target="n2"
            sourceX={0}
            sourceY={0}
            targetX={100}
            targetY={100}
            sourcePosition={RF.Position.Right}
            targetPosition={RF.Position.Left}
            data={{ label: "Condition Label" }}
          />
        </RF.ReactFlowProvider>,
      );

      const path = container.querySelector("path.edge-line.condition");
      expect(path).toBeTruthy();
    });
  });
});
