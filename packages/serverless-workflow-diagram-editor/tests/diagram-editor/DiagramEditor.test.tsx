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
import { BASIC_VALID_WORKFLOW_YAML } from "../fixtures/workflows";

describe("DiagramEditor Component", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const locale = "en";
  const isReadOnly = true;

  test("Renders react flow Diagram component", async () => {
    render(
      <DiagramEditor content={BASIC_VALID_WORKFLOW_YAML} locale={locale} isReadOnly={isReadOnly} />,
    );

    const reactFlowContainer = screen.getByTestId("diagram-container");

    expect(reactFlowContainer).toBeInTheDocument();
  });

  test("applies light mode class", () => {
    render(
      <DiagramEditor
        content={BASIC_VALID_WORKFLOW_YAML}
        locale={locale}
        isReadOnly={isReadOnly}
        colorMode="light"
      />,
    );

    const reactFlowContainer = screen.getByTestId("diagram-container");
    expect(reactFlowContainer).toHaveClass("colorMode-light");
  });

  test("applies dark mode class", () => {
    render(
      <DiagramEditor
        content={BASIC_VALID_WORKFLOW_YAML}
        locale={locale}
        isReadOnly={isReadOnly}
        colorMode="dark"
      />,
    );

    const reactFlowContainer = screen.getByTestId("diagram-container");
    expect(reactFlowContainer).toHaveClass("colorMode-dark");
  });

  test("applies system mode class", () => {
    render(
      <DiagramEditor
        content={BASIC_VALID_WORKFLOW_YAML}
        locale={locale}
        isReadOnly={isReadOnly}
        colorMode="system"
      />,
    );

    const reactFlowContainer = screen.getByTestId("diagram-container");
    expect(reactFlowContainer).toHaveClass("colorMode-system");
  });

  test("defaults to system mode when no colorMode is provided", () => {
    render(
      <DiagramEditor content={BASIC_VALID_WORKFLOW_YAML} locale={locale} isReadOnly={isReadOnly} />,
    );

    const reactFlowContainer = screen.getByTestId("diagram-container");
    expect(reactFlowContainer).toHaveClass("colorMode-system");
  });
});
