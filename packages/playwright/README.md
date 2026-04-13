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

# Playwright E2E Setup (Monorepo - pnpm)

This document explains how to set up and run Playwright end-to-end (E2E) tests for packages inside this monorepo.

---

## Configure Playwright

- Configure Playwright in playwright.config.ts for the package which you want to write tests for.
- Add an endpoint for that package and make sure it is the same port where the package/app starts.
- Navigate to tests folder and create a file with the package name which you want to write tests for and write all the tests in it.

## Steps for testing

- Run the command for testing :-
  - pnpm --filter @packageName test
  - Eg- pnpm --filter @serverlessworkflow/playwright test

- For testing it in UI :-
  - pnpm --filter @packageName test:ui
  - Eg- pnpm --filter @serverlessworkflow/playwright test:ui
