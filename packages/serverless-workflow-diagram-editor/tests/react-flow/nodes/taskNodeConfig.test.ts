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
import {
  CATCH_CONTAINER_NODE_TYPE,
  type ContainerNodeType,
  type LeafNodeType,
  containerNodeConfigMap,
  getNodeVisualConfig,
  leafNodeConfigMap,
} from "../../../src/react-flow/nodes/taskNodeConfig";

const leafNodeTypes: LeafNodeType[] = [
  GraphNodeType.Call,
  GraphNodeType.Emit,
  GraphNodeType.Listen,
  GraphNodeType.Raise,
  GraphNodeType.Run,
  GraphNodeType.Set,
  GraphNodeType.Switch,
  GraphNodeType.Wait,
  GraphNodeType.Catch,
];

const containerNodeTypes: ContainerNodeType[] = [
  GraphNodeType.Do,
  GraphNodeType.For,
  GraphNodeType.Fork,
  GraphNodeType.Try,
  GraphNodeType.TryCatch,
  CATCH_CONTAINER_NODE_TYPE,
];

describe("taskNodeConfig", () => {
  it("should have config for all leaf nodes", () => {
    for (const leaf of leafNodeTypes) {
      expect(leafNodeConfigMap[leaf]).toBeDefined();
    }
  });

  it("should have config for all container nodes", () => {
    for (const container of containerNodeTypes) {
      expect(containerNodeConfigMap[container]).toBeDefined();
    }
  });

  it.each(leafNodeTypes)("should have config color, icon and typeLabel for leaf %s", (leaf) => {
    const config = leafNodeConfigMap[leaf];

    expect(config.color).toMatch(/^#([0-9A-Fa-f]{6})$/);
    expect(config.icon).toBeDefined();
    expect(config.typeLabel).toBe(config.typeLabel.toUpperCase());
  });

  it.each(containerNodeTypes)(
    "should have config color, icon and typeLabel for container %s",
    (container) => {
      const config = containerNodeConfigMap[container];

      expect(config.color).toMatch(/^#([0-9A-Fa-f]{6})$/);
      expect(config.icon).toBeDefined();
      expect(config.typeLabel).toBe(config.typeLabel.toUpperCase());
    },
  );

  describe("getNodeVisualConfig", () => {
    it("resolves a leaf node type", () => {
      expect(getNodeVisualConfig(GraphNodeType.Call)).toBe(leafNodeConfigMap[GraphNodeType.Call]);
    });

    it("resolves a container node type", () => {
      expect(getNodeVisualConfig(GraphNodeType.Do)).toBe(containerNodeConfigMap[GraphNodeType.Do]);
    });

    it("resolves the custom catch-container node type", () => {
      expect(getNodeVisualConfig(CATCH_CONTAINER_NODE_TYPE)).toBe(
        containerNodeConfigMap[CATCH_CONTAINER_NODE_TYPE],
      );
    });

    it("returns undefined for an unknown type", () => {
      expect(getNodeVisualConfig("not-a-node-type")).toBeUndefined();
    });

    it("returns undefined when type is undefined", () => {
      expect(getNodeVisualConfig(undefined)).toBeUndefined();
    });
  });
});
