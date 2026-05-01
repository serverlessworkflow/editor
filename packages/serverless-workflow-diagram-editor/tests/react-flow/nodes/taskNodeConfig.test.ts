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

import { it, expect, describe } from "vitest";
import { GraphNodeType } from "@serverlessworkflow/sdk";
import { LeafNodeType, taskNodeConfigMap } from "../../../src/react-flow/nodes/taskNodeConfig";

const leafNodeTypes: LeafNodeType[] = [
  GraphNodeType.Call,
  GraphNodeType.Emit,
  GraphNodeType.Listen,
  GraphNodeType.Raise,
  GraphNodeType.Run,
  GraphNodeType.Set,
  GraphNodeType.Switch,
  GraphNodeType.Wait,
];

describe("taskNodeConfig", () => {
  it("should have config for all leaf nodes", () => {
    for (const leaf of leafNodeTypes) {
      expect(taskNodeConfigMap[leaf]).toBeDefined();
    }
  });

  it.each(leafNodeTypes)("should have config color, icon and typeLabel for %s", (leaf) => {
    const config = taskNodeConfigMap[leaf];

    expect(config.color).toMatch(/^#([0-9A-Fa-f]{6})$/);
    expect(config.icon).toBeDefined();
    expect(config.typeLabel).toBe(config.typeLabel.toUpperCase());
  });
});
