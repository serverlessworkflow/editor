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

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { vi, expect, afterEach, describe, it } from "vitest";
import { useDiagramEditorContext } from "../../src/store/DiagramEditorContext";
import { DiagramEditorContextProvider } from "../../src/store/DiagramEditorContextProvider";

const TestComponent: React.FC = () => {
  const { isReadOnly, locale } = useDiagramEditorContext();
  const renderCount = React.useRef<number>(0);

  // Increments on every render cycle
  renderCount.current++;

  return (
    <div data-testid="test-wrapper">
      <p data-testid="test-read-only">{`${isReadOnly}`}</p>
      <p data-testid="test-locale">{`${locale}`}</p>
      <p data-testid="test-render">{`${renderCount.current}`}</p>
    </div>
  );
};

describe("DiagramEditorContextProvider Component", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Consume properties from context", async () => {
    render(
      <DiagramEditorContextProvider isReadOnly={true} locale={"en"}>
        <TestComponent />
      </DiagramEditorContextProvider>,
    );

    const readOnlyElement = screen.getByTestId("test-read-only");
    const readOnlyLocale = screen.getByTestId("test-locale");
    const renderCount = screen.getByTestId("test-render");

    expect(readOnlyElement).toHaveTextContent(/true/i);
    expect(readOnlyLocale).toHaveTextContent(/en/i);

    // Only one rendering cycle is expected
    expect(renderCount).toHaveTextContent(/1/i);
  });

  it("Context provider props changes shall cause internal component to reload", async () => {
    const { rerender } = render(
      <DiagramEditorContextProvider isReadOnly={true} locale={"en"}>
        <TestComponent />
      </DiagramEditorContextProvider>,
    );

    rerender(
      <DiagramEditorContextProvider isReadOnly={false} locale={"pt"}>
        <TestComponent />
      </DiagramEditorContextProvider>,
    );

    const readOnlyElementChanged = screen.getByTestId("test-read-only");
    const readOnlyLocaleChanged = screen.getByTestId("test-locale");
    const renderCount = screen.getByTestId("test-render");

    expect(readOnlyElementChanged).toHaveTextContent(/false/i);
    expect(readOnlyLocaleChanged).toHaveTextContent(/pt/i);

    // 3 rendering cycles are expected 1- fist render, 2- forced by rerender and 3- caused by state updates
    expect(renderCount).toHaveTextContent(/3/i);
  });

  it("Context provider same props shall not cause internal component to reload", async () => {
    const { rerender } = render(
      <DiagramEditorContextProvider isReadOnly={true} locale={"en"}>
        <TestComponent />
      </DiagramEditorContextProvider>,
    );

    rerender(
      <DiagramEditorContextProvider isReadOnly={true} locale={"en"}>
        <TestComponent />
      </DiagramEditorContextProvider>,
    );

    const readOnlyElementChanged = screen.getByTestId("test-read-only");
    const readOnlyLocaleChanged = screen.getByTestId("test-locale");
    const renderCount = screen.getByTestId("test-render");

    expect(readOnlyElementChanged).toHaveTextContent(/true/i);
    expect(readOnlyLocaleChanged).toHaveTextContent(/en/i);

    // 2 rendering cycles are expected 1- fist render and 2- forced by rerender
    expect(renderCount).toHaveTextContent(/2/i);
  });
});
