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
import { DiagramEditor } from "../../src/diagram-editor";
import { vi, test, expect, afterEach, describe } from "vitest";

describe("DiagramEditor Component", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Renders react flow Diagram component", async () => {
    const locale = "en";
    const isReadOnly = true;

    render(<DiagramEditor locale={locale} isReadOnly={isReadOnly} />);

    const reactFlowContainer = screen.getByTestId("diagram-container");

    expect(reactFlowContainer).toBeInTheDocument();
  });
});
