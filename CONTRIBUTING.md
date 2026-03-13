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

# Contributing to Serverless Workflow Editor

Thank you for your interest in contributing to the CNCF Serverless Workflow Editor! We welcome all types of contributions, including bug reports, feature requests, documentation improvements, and code changes.

This project is the official, vendor-neutral visual editor for the [Serverless Workflow Specification](https://github.com/serverlessworkflow/specification).

---

## Prerequisites

To build and run the editor locally, you will need:
- **Node.js** (current LTS version; see https://nodejs.org/)
- **pnpm**

## Building the Project

The project is structured as a monorepo to support multiple distribution targets (Web, VS Code, etc.) as defined in our architectural decisions.

```bash
# Clone the repository
git clone https://github.com/serverlessworkflow/editor.git
cd editor

# Install dependencies
pnpm install

# Build all packages in the monorepo (development)
pnpm run build:dev

# Or build all packages in the monorepo (production)
pnpm run build:prod
```

## Development Environment

This project uses the following core technology stack:

* **Language**: [TypeScript](https://www.typescriptlang.org/) (for type safety and maintainability)
* **Library**: [React](https://react.dev/) (for building the user interface)

The project aims for the editor to be **embeddable**, with the core logic decoupled from specific platform APIs (like VS Code or Chrome APIs) through an abstraction layer.

## Reporting an Issue

If you find a bug or have a question, please check the [existing issues](https://github.com/serverlessworkflow/editor/issues) first.
1. Open a new issue using the appropriate template.
2. Provide a clear description of the problem.
3. Include steps to reproduce the bug and provide a sample workflow file (`.sw.json` or `.sw.yaml`) if applicable.

## Suggesting a Change

For new features or architectural changes:
1. Open an **Issue** or a **GitHub Discussion** to propose your idea.
2. Ensure the proposal aligns with the goals of being **vendor-neutral** and **specification-first**.
3. Once the approach is agreed upon by maintainers, you may proceed with a Pull Request.

## Coding Standards

* **TypeScript**: Always use strict typing. Avoid `any`.
* **Linting & Formatting**: Follow the existing code style and formatting conventions used in the files you are editing. If the package you are changing defines linting or formatting scripts, run those before submitting code.
* **Testing**: Ensure that logic changes are covered by tests, and run the relevant test commands for the packages you modify (see their documentation or `package.json`).
* **Component Design**: Follow functional component patterns and ensure that UI state is managed predictably within the monorepo structure.
* **New package creation**: If a new package needs to be created, please follow the standards used by the existing packages, including the standard commands `build:dev`, `build:prod`, `test`, `e2e-test`, `lint`

## Pull Request Process

1. **Fork** the repository and create your branch from `main`.
2. **Commit** your changes with clear, descriptive messages.
3. **Verify** your changes by running the appropriate build and/or test commands for the packages you modified.
4. **Submit** a Pull Request (PR).
5. **DCO Sign-off**: As a CNCF project, all commits must be signed off (`git commit -s`) to certify the Developer Certificate of Origin.
6. **Review**: At least one maintainer must review and approve your PR before it is merged.

---

### Community and Communication
Join the conversation on the [CNCF Slack](https://slack.cncf.io/) in the `#serverless-workflow` channel.