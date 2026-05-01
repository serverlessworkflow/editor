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

import * as RF from "@xyflow/react";
import { GraphEdgeType, WayPoints } from "../../core";

// Edge types must match GraphEdgeType enum
export const EdgeTypes: RF.EdgeTypes = {
  [GraphEdgeType.Default]: DefaultEdge,
  [GraphEdgeType.Error]: ErrorEdge,
  [GraphEdgeType.Condition]: ConditionEdge,
};

export type BaseEdgeData = {
  label?: string;
  wayPoints?: WayPoints;
};

/* Base edge component*/
function CustomBaseEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  classname,
}: RF.EdgeProps & { data?: BaseEdgeData; classname?: string }) {
  const edgePath = data?.wayPoints
    ? createPathFromWayPoints(sourceX, sourceY, targetX, targetY, data.wayPoints)
    : RF.getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      })[0];

  return (
    <RF.BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd ?? ""}
      className={classname ?? "edge-line"}
    />
  );
}

/* Default Edge */
export type DefaultEdgeType = RF.Edge<BaseEdgeData, typeof GraphEdgeType.Default>;
export function DefaultEdge(props: RF.EdgeProps<DefaultEdgeType>) {
  return (
    <>
      <CustomBaseEdge {...props} />;
      <EdgeLabel {...props} />
    </>
  );
}

/* Error Edge */
export type ErrorEdgeType = RF.Edge<BaseEdgeData, typeof GraphEdgeType.Error>;
export function ErrorEdge(props: RF.EdgeProps<ErrorEdgeType>) {
  return (
    <>
      <CustomBaseEdge {...props} classname="edge-line error" />;
      <EdgeLabel {...props} />
    </>
  );
}

/* Condition Edge */
export type ConditionEdgeType = RF.Edge<BaseEdgeData, typeof GraphEdgeType.Condition>;
export function ConditionEdge(props: RF.EdgeProps<ConditionEdgeType>) {
  return (
    <>
      <CustomBaseEdge {...props} classname="edge-line condition" />;
      <EdgeLabel {...props} />
    </>
  );
}

export type EdgeLabelProps = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  type?: GraphEdgeType;
  data?: BaseEdgeData | undefined;
};

export function EdgeLabel({ sourceX, sourceY, targetX, targetY, type, data }: EdgeLabelProps) {
  return (
    <>
      {data?.label && (
        <RF.EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${(sourceX + targetX) / 2}px,${(sourceY + targetY) / 2}px)`,
            }}
            className={type ? `edge-label ${type}` : "edge-label"}
          >
            {data.label}
          </div>
        </RF.EdgeLabelRenderer>
      )}
    </>
  );
}

export function createPathFromWayPoints(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  wayPoints?: WayPoints,
): string {
  if (!wayPoints || wayPoints.length === 0) {
    return `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
  }

  let path = `M ${sourceX},${sourceY}`;
  for (const point of wayPoints) {
    path += ` L ${point.x},${point.y}`;
  }

  path += ` L ${targetX},${targetY}`;

  return path;
}
