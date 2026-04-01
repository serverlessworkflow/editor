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

import { render, screen } from "@testing-library/react";
import { Diagram } from "../../../src/react-flow/diagram/Diagram";
import { vi, test, expect, afterEach, describe } from "vitest";

describe("Diagram Component", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Renders react flow nodes", async () => {
    render(<Diagram />);

    const node1 = screen.getByText("Node 1");
    const node2 = screen.getByText("Node 2");
    const node3 = screen.getByText("Node 3");
    const node4 = screen.getByText("Node 4");
    const node5 = screen.getByText("Node 5");

    expect(node1).toBeInTheDocument();
    expect(node2).toBeInTheDocument();
    expect(node3).toBeInTheDocument();
    expect(node4).toBeInTheDocument();
    expect(node5).toBeInTheDocument();
  });
});
