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
import { composeStories } from "@storybook/react-vite";
import * as stories from "../../stories/DiagramEditor.stories";
import userEvent from "@testing-library/user-event";
import { vi, test, expect, afterEach, describe } from "vitest";

// Composes all stories in the file
const { Component } = composeStories(stories);

describe("DiagramEditor component story", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Render DiagramEditor Component from story", async () => {
    const content = "Sample Content";
    const isReadOnly = true;
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<Component content={content} isReadOnly={isReadOnly} />);

    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: /Click me!/i });

    await user.click(button);

    expect(alertMock).toHaveBeenCalledWith("Hello from Diagram!");
  });
});
