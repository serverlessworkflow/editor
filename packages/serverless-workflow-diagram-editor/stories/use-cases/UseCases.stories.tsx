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
import { DiagramEditor } from "../features/DiagramEditor";
import * as workflows from "./index";

const meta = {
  title: "Use Cases",
  component: DiagramEditor,
  parameters: {
    layout: "fullscreen",
  },
  render: (args, { globals }) => {
    return <DiagramEditor {...args} colorMode={args.colorMode ?? globals.colorMode ?? "system"} />;
  },
} satisfies Meta<typeof DiagramEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AccumulateRoomReadings: Story = {
  args: {
    isReadOnly: true,
    locale: "en",
    content: workflows.accumulateRoomReadings,
  },
};

export const AuthenticationOAuth2: Story = {
  args: {
    isReadOnly: true,
    locale: "en",
    content: workflows.authenticationOAuth2,
  },
};

export const AuthenticationReusable: Story = {
  args: {
    isReadOnly: true,
    locale: "en",
    content: workflows.authenticationReusable,
  },
};

export const CallAsyncAPIPublish: Story = {
  args: {
    isReadOnly: true,
    locale: "en",
    content: workflows.callAsyncAPIPublish,
  },
};

export const CallAsyncAPISubscribe: Story = {
  args: {
    isReadOnly: true,
    locale: "en",
    content: workflows.callAsyncAPISubscribe,
  },
};

export const CallCustomFunctionCataloged: Story = {
  args: {
    isReadOnly: true,
    locale: "en",
    content: workflows.callCustomFunctionCataloged,
  },
};

export const CallCustomFunctionInline: Story = {
  args: {
    isReadOnly: true,
    locale: "en",
    content: workflows.callCustomFunctionInline,
  },
};

export const CallGrpc: Story = {
  args: {
    isReadOnly: true,
    locale: "en",
    content: workflows.callGrpc,
  },
};

export const CallHttpQueryHeadersExpression: Story = {
  args: {
    isReadOnly: true,
    locale: "en",
    content: workflows.callHttpQueryHeadersExpressions,
  },
};

export const CallMCP: Story = {
  args: {
    isReadOnly: true,
    locale: "en",
    content: workflows.callMCP,
  },
};

export const CallOpenAPI: Story = {
  args: {
    isReadOnly: true,
    locale: "en",
    content: workflows.callOpenApi,
  },
};

export const ConditionalTask: Story = {
  args: {
    isReadOnly: true,
    locale: "en",
    content: workflows.conditionalTask,
  },
};

export const DoMultiple: Story = {
  args: {
    isReadOnly: true,
    locale: "en",
    content: workflows.doMultiple,
  },
};

export const DoSingle: Story = {
  args: {
    isReadOnly: true,
    locale: "en",
    content: workflows.doSingle,
  },
};
