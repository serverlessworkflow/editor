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

import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorPage } from "../src/diagram-editor/error-pages/ErrorPage";

const meta = {
  title: "Example/ErrorPage",
  component: ErrorPage,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  args: {},
} satisfies Meta<typeof ErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = {
  args: {
    title: "Something went wrong",
  },
};

export const WithMessage: Story = {
  args: {
    title: "Something went wrong",
    message: "An unexpected error occurred while processing your request.",
  },
};

export const WithSnippet: Story = {
  args: {
    title: "YAML Syntax Error",
    snippet: `tasks:
    - myTask
    call: http
      method: get,
      endpoint: "http://example.com/api"
      `,
  },
};

export const WithMessageAndSnippet: Story = {
  args: {
    title: "YAML Syntax Error",
    message: "Bad indentation",
    snippet: `tasks:
    - myTask
    call: http
      method: get,
      endpoint: "http://example.com/api"
      `,
  },
};
