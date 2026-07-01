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

# react-flow

This directory contains all React Flow (`@xyflow/react`) library-specific code. **All React Flow specifics must be contained within this directory** to maintain library isolation and ensure the editor remains embeddable across different platforms.

## Architecture Constraint

React Flow is the rendering library used to visualize Serverless Workflow diagrams. By isolating all React Flow dependencies to this directory, we ensure:

- The core workflow logic remains independent of the rendering implementation
- The editor can be adapted to different rendering libraries if needed
- Platform-specific integrations (VS Code, browser extensions) don't become coupled to React Flow

## Files and Their Purpose

### `diagram/`

#### [`autoLayout.ts`](diagram/autoLayout.ts)

Automatic graph layout using the ELK (Eclipse Layout Kernel) algorithm. Handles:

- Node sizing (default task nodes: 220×65, terminal nodes: 95×30)
- Converting React Flow graphs to ELK format
- Processing ELK layout results back to React Flow positions
- Edge waypoint calculation for orthogonal routing

#### [`diagramBuilder.ts`](diagram/diagramBuilder.ts)

Converts the SDK's graph representation into React Flow-compatible nodes and edges:

- Transforms `sdk.Graph` to `ReactFlowGraph` (nodes + edges)
- Determines edge types based on source node (error edges, condition edges, default edges)
- Handles catch container nodes (special React Flow type for catch nodes with children)
- Filters out edges where source or target nodes don't exist
- Manages node data (labels, errors, task references)

#### [`Diagram.tsx`](diagram/Diagram.tsx)

The main diagram component that orchestrates the React Flow canvas:

- Renders the `ReactFlowProvider` and `ReactFlow` components
- Manages diagram state (nodes, edges, selection)
- Handles auto-layout triggering
- Configures viewport (fit view, zoom limits, pan/zoom controls)
- Applies z-index management for edge selection highlighting
- Integrates with the diagram editor context
- Registers custom node and edge types

#### [`Diagram.css`](diagram/Diagram.css)

Styles for the diagram component and React Flow overrides.

### `edges/`

#### [`Edges.tsx`](edges/Edges.tsx)

Custom edge implementations for different workflow transition types:

- **`DefaultEdge`**: Standard workflow transitions
- **`ErrorEdge`**: Error/exception flow (dashed red line with error icon)
- **`ConditionEdge`**: Conditional branches from switch tasks (dashed blue line with branch icon)
- **Edge label positioning**: Handles waypoint-based paths and calculates label midpoints
- **Custom path rendering**: Creates orthogonal paths from ELK waypoints
- **Z-index management**: Ensures selected edge labels appear above regular ones

### `nodes/`

#### [`Nodes.tsx`](nodes/Nodes.tsx)

Defines all custom node components for Serverless Workflow task types:

- **Terminal nodes**: `StartNode`, `EndNode`, `EntryNode`, `ExitNode` (compact pill shapes)
- **Leaf task nodes**: `CallNode`, `CatchNode`, `EmitNode`, `ListenNode`, `RaiseNode`, `RunNode`, `SetNode`, `SwitchNode`, `WaitNode`
- **Container task nodes**: `DoNode`, `ForNode`, `ForkNode`, `TryCatchNode`, `TryNode`, `CatchContainerNode`

Features:

- Icon and color coding per task type (from `taskNodeConfig.ts`)
- Badge rendering for task subtypes (http, grpc, asyncapi, openapi, container, script, workflow, etc.)
- Error indication (red border with alert icon)
- Task labels with i18n support
- Handle positioning for edge connections
- Click handlers for side panel integration

Exports:

- `ReactFlowNodeTypes`: Mapping of `GraphNodeType` to React components
- `BaseNodeData<T>`: Type definition for node data (label, task, hasError)

#### [`taskNodeConfig.ts`](taskNodeConfig.ts)

Visual configuration for all task node types:

- **Colors**: Hex color codes for each task type (e.g., Call: blue, Catch: orange, Raise: red)
- **Icons**: Lucide React icons for each task type
- **Type labels**: Display labels (e.g., "CALL", "EMIT", "FOR")
- **Type guards**: `isLeafNodeType()`, `isContainerNodeType()`, `isTerminalNodeType()`
- **Custom types**:
  - `CATCH_CONTAINER_NODE_TYPE`: Special React Flow type for catch nodes with children
  - `TerminalNodeType`, `ContainerNodeType`, `LeafNodeType`: Union types for node categorization

### Root Level

#### [`zIndexConstants.ts`](zIndexConstants.ts)

Centralized z-index layering constants for diagram rendering.

Ensures proper visual stacking:

- Selected edges appear above regular edges
- All labels appear above all edges (preventing overlap)
- Selected edge labels appear above regular labels

## Integration Points

This directory integrates with:

- **`src/core/`**: Imports SDK graph types and workflow abstractions (via `workflowSdk.ts` and `graph.ts`)
- **`src/store/`**: Uses `DiagramEditorContext` for state management
- **`src/i18n/`**: Uses `useI18n` hook for internationalized labels
- **`src/side-panel/`**: Integrates `SidePanelTrigger` for node selection panels

## Key Concepts

### Node Types

- **Terminal nodes**: Entry/exit points (start, end, entry, exit) - compact visual style
- **Leaf nodes**: Task nodes without children (call, emit, listen, raise, run, set, switch, wait, catch)
- **Container nodes**: Task nodes that contain child nodes (do, for, fork, try, try-catch, catch-container)

### Edge Types

- **Default**: Standard workflow transitions (solid line)
- **Error**: Exception/error flow from raise tasks (dashed red line with AlertTriangle icon)
- **Condition**: Conditional branches from switch tasks (dashed blue line with GitBranch icon)

### Auto-Layout

The ELK algorithm provides automatic orthogonal layout with:

- Top-to-bottom flow direction
- Hierarchical layering
- Waypoint-based edge routing (90-degree bends)
- Container node support (parent-child relationships)
