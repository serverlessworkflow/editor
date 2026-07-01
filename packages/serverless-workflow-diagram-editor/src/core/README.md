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

Abstraction layer over the `@serverlessworkflow/sdk`. Provides functions to parse, validate, and work with workflow definitions without exposing SDK internals to the rest of the editor.

### graph.ts

Utility functions for working with the SDK's `FlatGraph` type. Provides `getNodesByType()` to filter nodes by type and `fixNodesConnections()` to normalize graph edges by redirecting entry/exit node connections to their parent nodes.

### taskSubType.ts

Utilities for extracting task subtypes from task definitions. Provides functions like `getRunSubType()`, `getListenSubType()`, and `getCallSubType()` to determine the specific variant of each task type.

### taskDetails.ts

Flattens task properties into display-ready detail fields. Converts nested task objects into a flat array of `DetailField` objects (text, array, or object) for rendering in the UI, separating task-specific fields from inherited base fields.

### elkjs.ts

Wrapper for the ELK (Eclipse Layout Kernel) graph layout library. Provides `processElkLayout()` function with abort signal support for cancelable layout calculations.

### mermaidExport.ts

Converts workflow models to Mermaid diagram code. Thin wrapper over the SDK's `convertToMermaidCode()` function for exporting workflows to Mermaid format.

### validationErrors.ts

Filters and categorizes validation errors from the SDK. Separates node-specific errors from workflow-level errors, removes noise (redundant errors for invalid tasks), and provides utilities to map errors to their owning nodes.
