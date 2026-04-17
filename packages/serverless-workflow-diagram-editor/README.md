<!--
   Copyright 2021-Present The Serverless Workflow Specification Authors

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
-->

# serverless-workflow-diagram-editor

Serverless Workflow Diagram Editor React component / npm package

## Building the Component

```bash
# Go to serverless-workflow-diagram-editor package
cd ./packages/serverless-workflow-diagram-editor

# Install dependencies
pnpm install

# Build package (development)
pnpm run build:dev

# Or build package (production)
pnpm run build:prod

# Build storybook static content for publishing (documentation and demo)
pnpm run build:storybook

# Run storybook (test and development / debugging)
pnpm run start
```

## Package Structure

```
serverless-workflow-diagram-editor/
├── src/
│   ├── core/                   # SDK abstraction layer
│   ├── diagram-editor/         # Main DiagramEditor component
│   ├── i18n/locales/           # Locale string definitions (en, fr)
│   ├── react-flow/diagram/     # @xyflow/react diagram rendering
│   └── store/                  # React Context state management
├── tests/
│   ├── core/                   # SDK integration tests
│   ├── diagram-editor/         # DiagramEditor component tests
│   ├── react-flow/diagram/     # Diagram rendering tests
│   ├── store/                  # Context provider tests
│   └── fixtures/               # Shared test fixtures (workflow YAML/JSON)
├── stories/                    # Storybook stories and demo components
├── vitest.config.ts            # Unit test config
├── tsconfig.json               # TypeScript config
└── tsconfig.test.json          # TypeScript config for tests
```
