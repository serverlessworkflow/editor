# Feature Specification: Visual Authoring MVP

**Feature Branch**: `001-visual-authoring-mvp`  
**Created**: 2026-03-02  
**Status**: Draft  
**Input**: User description: "Embeddable visual authoring for Serverless Workflow with source round-trip, insertion UX, and live diagnostics"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create A Valid Workflow Visually (Priority: P1)

A workflow author starts from a blank canvas, inserts tasks between connected nodes, edits properties, and exports valid workflow source without hand-writing JSON or YAML.

**Why this priority**: This is the core value proposition and minimum usable product behavior.

**Independent Test**: Start from blank, add multiple task types, set required properties, export source, validate output against target spec version.

**Acceptance Scenarios**:

1. **Given** an empty editor session, **When** a user creates a new workflow, **Then** the graph starts with start and end nodes connected.
2. **Given** two connected nodes, **When** the user selects the insertion affordance and chooses a task, **Then** the new task is inserted between them and becomes selected.
3. **Given** an inserted task, **When** the user edits task properties, **Then** changes are reflected in workflow source and validation state.

---

### User Story 2 - Load And Continue Editing Existing Source (Priority: P2)

A workflow author loads existing JSON or YAML source into the editor and continues editing visually.

**Why this priority**: Existing workflows must be editable for adoption in host tools.

**Independent Test**: Load a valid source file, edit graph and properties, export source, verify semantic preservation.

**Acceptance Scenarios**:

1. **Given** valid workflow JSON or YAML, **When** it is loaded, **Then** the graph and panel reflect its structure.
2. **Given** a loaded workflow, **When** visual edits are made, **Then** export returns updated source in requested format.

---

### User Story 3 - Get Immediate Validation Feedback (Priority: P3)

A workflow author receives live diagnostics while editing and can run explicit full validation when needed.

**Why this priority**: Immediate feedback reduces authoring errors and improves confidence.

**Independent Test**: Introduce known schema and semantic issues, verify diagnostics trigger, severity rendering, and event payloads.

**Acceptance Scenarios**:

1. **Given** invalid field input, **When** the debounce window elapses, **Then** diagnostics update with mapped location and severity.
2. **Given** explicit validation is invoked, **When** validation completes, **Then** full diagnostics are emitted and rendered consistently.

---

### Edge Cases

- Loading malformed JSON or YAML.
- Inserting tasks in rapidly changing graph state.
- Editing workflows with unresolved reusable component references.
- Export requests during concurrent edits.
- Diagnostics that cannot map to a specific field.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST initialize a new workflow with connected start and end graph nodes.
- **FR-002**: System MUST load existing workflow source in JSON and YAML.
- **FR-003**: System MUST provide insertion actions between connected nodes.
- **FR-004**: System MUST expose the full supported task insertion menu for MVP.
- **FR-005**: System MUST focus and select inserted tasks immediately after insertion.
- **FR-006**: System MUST switch property editing context based on current selection.
- **FR-007**: System MUST support export to JSON or YAML source.
- **FR-008**: System MUST preserve workflow semantics and structural content during load/edit/export.
- **FR-009**: System MUST run debounced live validation on edits.
- **FR-010**: System MUST provide explicit full validation on demand.
- **FR-011**: System MUST emit structured diagnostics events for host integrations.
- **FR-012**: System MUST avoid editor-initiated network calls during authoring flows.
- **FR-013**: System MUST support two renderer backends: `rete-lit` and `react-flow`.
- **FR-014**: System MUST expose active renderer identity in host capability payloads.
- **FR-015**: System MUST preserve create/load/edit/export/validate behavior across both renderer bundles.
- **FR-016**: Repository bootstrap MUST pin the runtime and package manager to Node.js 24 LTS and `pnpm@10.30.3` using `engines` and `packageManager` metadata.
- **FR-017**: Repository tooling MUST use `@biomejs/biome@2.4.5` as the single formatter and linter for TypeScript/JavaScript and JSON/YAML-adjacent config surfaces.
- **FR-018**: Repository test tooling MUST use `vitest@4.0.18` for unit/integration and `@playwright/test@1.58.2` for end-to-end validation.

### Key Entities *(include if feature involves data)*

- **WorkflowSource**: Serialized JSON or YAML content and format metadata.
- **GraphNode**: Visual node representing a workflow task or synthetic boundary node.
- **EditorSelection**: Current node or edge selection state.
- **ValidationDiagnostic**: Structured issue record with severity, location, and message.
- **RendererId**: Active renderer backend identifier (`rete-lit | react-flow`).
- **RendererCapabilitySnapshot**: Renderer-specific capability metadata reported to hosts.
- **CapabilitySnapshot**: Runtime contract, renderer identity, and supported version information returned to hosts.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can create and export a valid workflow in under 10 minutes.
- **SC-002**: At least 95% of normal edit actions show validation feedback within 500 ms after debounce.
- **SC-003**: Round-trip editing preserves semantic and structural correctness for at least 95% of baseline fixture workflows.
- **SC-004**: Host embedding setup requires no more than one custom element and one client initialization step.
- **SC-005**: Renderer parity tests pass for 100% of MVP baseline fixtures across `rete-lit` and `react-flow` bundles.
- **SC-006**: Host setup remains one custom element and one client initialization step regardless of selected renderer bundle.
- **SC-007**: A new contributor can bootstrap the repository and run lint, unit/integration tests, and e2e smoke checks in under 15 minutes on a clean machine with Node.js 24 LTS.
