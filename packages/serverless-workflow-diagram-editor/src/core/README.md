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

# core

Core package agnostic from the rendering library and its types.

## Modules

### workflowSdk.ts

Abstraction layer over the `@serverlessworkflow/sdk`. This is the only place in the diagram editor that imports from the SDK directly keeping the rest of the editor decoupled from SDK implementation details.
