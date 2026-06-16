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
import { screen } from "@testing-library/react";
import type * as RF from "@xyflow/react";
import { NodeDetailsView } from "../../src/side-panel/NodeDetailsView";
import type { BaseNodeData } from "../../src/react-flow/nodes/Nodes";
import { renderWithProviders } from "../test-utils/render-helpers";

const makeNode = (data: BaseNodeData, type = "call"): RF.Node<BaseNodeData> => ({
  id: "node-1",
  type,
  position: { x: 0, y: 0 },
  data,
});

describe("NodeDetailsView", () => {
  it("renders every task field as a path labelled row under the Properties header", () => {
    const node = makeNode({
      label: "getPets",
      // eslint-disable-next-line unicorn/no-thenable -- 'then' is a real SWF directive
      task: { call: "http", with: { endpoint: "https://api.example.com" }, then: "continue" },
    });

    renderWithProviders(<NodeDetailsView node={node} />);

    expect(screen.getByTestId("node-details")).toBeInTheDocument();
    expect(screen.getByText("Properties")).toBeInTheDocument();
    expect(screen.getByText("call")).toBeInTheDocument();
    expect(screen.getByText("http")).toBeInTheDocument();
    expect(screen.getByText("with.endpoint")).toBeInTheDocument();
    expect(screen.getByText("https://api.example.com")).toBeInTheDocument();
    expect(screen.getByText("then")).toBeInTheDocument();
    expect(screen.getByText("continue")).toBeInTheDocument();
  });

  it.each([
    { length: 1, text: "1 item" },
    { length: 2, text: "2 items" },
  ])("renders an array field as a summary $text", ({ length, text }) => {
    const items = Array.from({ length }, () => ({}));
    const node = makeNode({ label: "step", task: { switch: items } });

    renderWithProviders(<NodeDetailsView node={node} />);

    expect(screen.getByText("switch")).toBeInTheDocument();
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it("renders an object field as a placeholder glyph (full value in source)", () => {
    const node = makeNode({
      label: "step",
      task: { with: { a: { b: { client: { config: { z: 1 } } } } } },
    });

    renderWithProviders(<NodeDetailsView node={node} />);
    expect(screen.getByText("with.a.b.client.config")).toBeInTheDocument();
    expect(screen.getByText("{...}")).toBeInTheDocument();
  });

  it("renders a collapsed Source section with full yaml task", () => {
    const task = { call: "http", with: { endpoint: "https://api.example.com" } };
    const node = makeNode({ label: "getPets", task });

    const { container } = renderWithProviders(<NodeDetailsView node={node} />);

    expect(screen.getByRole("heading", { name: "Source" })).toBeInTheDocument();
    expect(container.querySelector(".dec-sidebar-yaml-summary")?.textContent).toBe("View source");
    expect(container.querySelector(".dec-sidebar-yaml-pre")?.textContent).toBe(
      "call: http\nwith:\n  endpoint: https://api.example.com\n",
    );
  });

  it("renders node details message when the task has no task", () => {
    const node = makeNode({ label: "start" }, "start");

    renderWithProviders(<NodeDetailsView node={node} />);

    expect(screen.queryByTestId("node-details")).not.toBeInTheDocument();
    expect(screen.queryByText("Properties")).not.toBeInTheDocument();
    expect(screen.queryByText("Source")).not.toBeInTheDocument();
    expect(screen.getByText("No additional details for this node")).toBeInTheDocument();
  });
});
