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

import { render, screen, waitFor } from "@testing-library/react";
import { vi, it, expect, afterEach, describe, beforeEach } from "vitest";
import { Diagram } from "../../../src/react-flow/diagram/Diagram";
import { DiagramEditorContextProvider } from "../../../src/store/DiagramEditorContextProvider";
import { SidebarProvider } from "../../../src/components/ui/sidebar";
import { I18nProvider } from "@serverlessworkflow/i18n";
import { en } from "../../../src/i18n/locales/en";
import { ReactFlowProvider } from "@xyflow/react";
import * as autoLayoutModule from "../../../src/react-flow/diagram/autoLayout";

describe("Diagram Component", () => {
  let applyAutoLayoutSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Mock applyAutoLayout to return a resolved promise with empty nodes and edges
    applyAutoLayoutSpy = vi.spyOn(autoLayoutModule, "applyAutoLayout").mockResolvedValue({
      nodes: [],
      edges: [],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("render Diagram component and canvas", async () => {
    render(
      <ReactFlowProvider>
        <DiagramEditorContextProvider content={""} isReadOnly={true} locale={"en"}>
          <I18nProvider locale="en" dictionaries={{ en }}>
            <SidebarProvider>
              <Diagram />
            </SidebarProvider>
          </I18nProvider>
        </DiagramEditorContextProvider>
      </ReactFlowProvider>,
    );

    const diagram = screen.getByTestId("diagram-container");
    const canvas = screen.getByTestId("react-flow-canvas");

    expect(diagram).toBeInTheDocument();
    expect(canvas).toBeInTheDocument();

    // Verify that applyAutoLayout was called
    await waitFor(() => {
      expect(applyAutoLayoutSpy).toHaveBeenCalled();
    });
  });
});
