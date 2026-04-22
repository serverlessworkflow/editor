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
import { applyAutoLayout, buildGraph, parseWorkflow } from "../../src/core";
import { BASIC_VALID_WORKFLOW_JSON_TASKS } from "../fixtures/workflows";

describe("applyAutoLayout", () => {
  it("apply auto-layout calculated layout to graph elements", () => {
    const result = parseWorkflow(BASIC_VALID_WORKFLOW_JSON_TASKS);

    const graph = applyAutoLayout(buildGraph(result.model!));

    expect(graph!.nodes).toHaveLength(7);
    expect(graph!.edges).toHaveLength(6);

    let y = 0;
    graph!.nodes.forEach((node) => {
      // TODO coordinates are fixed (y = y + 100) for now
      expect(node.position!.y).toBe(y);
      y += 100;
    });
  });
});
