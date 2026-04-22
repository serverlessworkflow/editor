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

import { describe, it, expect } from "vitest";
import { ExtendedGraph, GraphEdgeType, solveEdgeTypes } from "../../src/core";
import * as sdk from "@serverlessworkflow/sdk";

describe("ExtendedGraph", () => {
  it("Add type property to default edges", () => {
    const sdkGraph = {
      id: "root",
      type: "root",
      entryNode: { type: "start", id: "root-entry-node" },
      exitNode: { type: "end", id: "root-exit-node" },
      nodes: [
        { type: "start", id: "root-entry-node" },
        { type: "end", id: "root-exit-node" },
        { type: "set", id: "/do/0/step1", label: "step1" },
        { type: "set", id: "/do/1/step2", label: "step2" },
        { type: "set", id: "/do/2/step3", label: "step3" },
        { type: "set", id: "/do/3/step4", label: "step4" },
        { type: "set", id: "/do/4/step5", label: "step5" },
      ],
      edges: [
        {
          label: "",
          id: "/do/4/step5-root-exit-node",
          sourceId: "/do/4/step5",
          destinationId: "root-exit-node",
        },
        {
          label: "",
          id: "/do/3/step4-/do/4/step5",
          sourceId: "/do/3/step4",
          destinationId: "/do/4/step5",
        },
        {
          label: "",
          id: "/do/2/step3-/do/3/step4",
          sourceId: "/do/2/step3",
          destinationId: "/do/3/step4",
        },
        {
          label: "",
          id: "/do/1/step2-/do/2/step3",
          sourceId: "/do/1/step2",
          destinationId: "/do/2/step3",
        },
        {
          label: "",
          id: "/do/0/step1-/do/1/step2",
          sourceId: "/do/0/step1",
          destinationId: "/do/1/step2",
        },
        {
          label: "",
          id: "root-entry-node-/do/0/step1",
          sourceId: "root-entry-node",
          destinationId: "/do/0/step1",
        },
      ],
    } as sdk.Graph;

    const graph = solveEdgeTypes(sdkGraph);

    expect(graph.edges).toHaveLength(6);
    graph.edges.forEach((edge) => expect(edge.type!).toBe(GraphEdgeType.Default));
  });

  it("Add type property to error edges", () => {
    const sdkGraph = {
      id: "root",
      type: "root",
      entryNode: { id: "root-entry-node", type: "start" },
      exitNode: { id: "root-exit-node", type: "end" },
      nodes: [
        { id: "root-entry-node", type: "start" },
        { id: "root-exit-node", type: "end" },
        {
          id: "/do/0/raiseUndefinedPriorityError",
          label: "raiseUndefinedPriorityError",
          type: "raise",
        },
        { id: "/do/1/escalateToManager", label: "escalateToManager", type: "call" },
      ],
      edges: [
        {
          destinationId: "root-exit-node",
          id: "/do/1/escalateToManager-root-exit-node",
          sourceId: "/do/1/escalateToManager",
        },
        {
          destinationId: "/do/1/escalateToManager",
          id: "/do/0/raiseUndefinedPriorityError-/do/1/escalateToManager",
          sourceId: "/do/0/raiseUndefinedPriorityError",
        },
        {
          destinationId: "/do/0/raiseUndefinedPriorityError",
          id: "root-entry-node-/do/0/raiseUndefinedPriorityError",
          sourceId: "root-entry-node",
        },
      ],
    } as sdk.Graph;

    const graph = solveEdgeTypes(sdkGraph);

    expect(graph.edges[1].type!).toBe(GraphEdgeType.Error);
  });

  it("Add type property to condition edges", () => {
    const sdkGraph = {
      type: "root",
      id: "root",
      entryNode: { id: "root-entry-node", type: "start" },
      exitNode: { id: "root-exit-node", type: "end" },
      nodes: [
        { id: "root-entry-node", type: "start" },
        { id: "root-exit-node", type: "end" },
        { id: "/do/0/processOrder", label: "processOrder", type: "switch" },
        { id: "/do/1/step1", label: "step1", type: "set" },
        { id: "/do/2/step2", label: "step2", type: "set" },
        { id: "/do/3/stepDefault", label: "stepDefault", type: "set" },
      ],
      edges: [
        {
          destinationId: "/do/0/processOrder",
          id: "root-entry-node-/do/0/processOrder",
          sourceId: "root-entry-node",
        },
        {
          destinationId: "root-exit-node",
          id: "/do/1/step1-root-exit-node",
          sourceId: "/do/1/step1",
        },
        {
          destinationId: "root-exit-node",
          id: "/do/2/step2-root-exit-node",
          sourceId: "/do/2/step2",
        },
        {
          destinationId: "root-exit-node",
          id: "/do/3/stepDefault-root-exit-node",
          sourceId: "/do/3/stepDefault",
        },
        {
          destinationId: "/do/1/step1",
          id: "/do/0/processOrder-/do/1/step1",
          sourceId: "/do/0/processOrder",
        },
        {
          destinationId: "/do/2/step2",
          id: "/do/0/processOrder-/do/2/step2-case2",
          sourceId: "/do/0/processOrder",
        },
        {
          destinationId: "/do/3/stepDefault",
          id: "/do/0/processOrder-/do/3/stepDefault-default",
          sourceId: "/do/0/processOrder",
        },
      ],
    } as sdk.Graph;

    const graph = solveEdgeTypes(sdkGraph);

    const switchNode = graph.nodes.find((node) => node.type === sdk.GraphNodeType.Switch);
    expect(switchNode).toBeDefined();

    const conditionEdges = graph.edges.filter((edge) => edge.sourceId === switchNode!.id);
    expect(conditionEdges).toHaveLength(3);
    conditionEdges.forEach((edge) => expect(edge.type!).toBe(GraphEdgeType.Condition));
  });

  it("Add type property to nested edges", () => {
    const sdkGraph = {
      id: "root",
      type: "root",
      entryNode: { id: "root-entry-node", type: "start" },
      exitNode: { id: "root-exit-node", type: "end" },
      nodes: [
        { id: "root-entry-node", type: "start" },
        { id: "root-exit-node", type: "end" },
        {
          id: "/do/0/checkup",
          type: "for",
          label: "checkup",
          entryNode: { id: "/do/0/checkup-entry-node", type: "entry" },
          exitNode: { id: "/do/0/checkup-exit-node", type: "exit" },
          nodes: [
            { id: "/do/0/checkup-entry-node", type: "entry" },
            { id: "/do/0/checkup-exit-node", type: "exit" },
            { id: "/do/0/checkup/for/do/0/step1", label: "step1", type: "set" },
            {
              id: "/do/0/checkup/for/do/1/raiseUndefinedPriorityError",
              label: "raiseUndefinedPriorityError",
              type: "raise",
            },
            {
              id: "/do/0/checkup/for/do/2/escalateToManager",
              label: "escalateToManager",
              type: "call",
            },
          ],
          edges: [
            {
              destinationId: "/do/0/checkup-exit-node",
              id: "/do/0/checkup/for/do/2/escalateToManager-/do/0/checkup-exit-node",
              sourceId: "/do/0/checkup/for/do/2/escalateToManager",
            },
            {
              destinationId: "/do/0/checkup/for/do/2/escalateToManager",
              id: "/do/0/checkup/for/do/1/raiseUndefinedPriorityError-/do/0/checkup/for/do/2/escalateToManager",
              sourceId: "/do/0/checkup/for/do/1/raiseUndefinedPriorityError",
            },
            {
              destinationId: "/do/0/checkup/for/do/1/raiseUndefinedPriorityError",
              id: "/do/0/checkup/for/do/0/step1-/do/0/checkup/for/do/1/raiseUndefinedPriorityError",
              sourceId: "/do/0/checkup/for/do/0/step1",
            },
            {
              destinationId: "/do/0/checkup/for/do/0/step1",
              id: "/do/0/checkup-entry-node-/do/0/checkup/for/do/0/step1",
              sourceId: "/do/0/checkup-entry-node",
            },
          ],
        },
      ],
      edges: [
        {
          destinationId: "root-exit-node",
          id: "/do/0/checkup-exit-node-root-exit-node",
          sourceId: "/do/0/checkup-exit-node",
        },
        {
          destinationId: "/do/0/checkup-entry-node",
          id: "root-entry-node-/do/0/checkup-entry-node",
          sourceId: "root-entry-node",
        },
      ],
    } as sdk.Graph;

    const extendedGraph = solveEdgeTypes(sdkGraph);

    const forNode = extendedGraph.nodes.find((node) => node.type === sdk.GraphNodeType.For) as
      | ExtendedGraph
      | undefined;

    // looking into for task nodes
    expect(forNode).toBeDefined();
    expect(forNode!.type!).toBe(sdk.GraphNodeType.For);
    expect(forNode!.edges[0].type!).toBe(GraphEdgeType.Default);
    expect(forNode!.edges[1].type!).toBe(GraphEdgeType.Error);
    expect(forNode!.edges[2].type!).toBe(GraphEdgeType.Default);
    expect(forNode!.edges[3].type!).toBe(GraphEdgeType.Default);
  });
});
