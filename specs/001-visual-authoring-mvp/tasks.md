# Tasks: Visual Authoring MVP

**Input**: Design documents from `specs/001-visual-authoring-mvp/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Create package layout for core, web component, and host client modules in `packages/`
- [ ] T002 Configure baseline toolchain in repo config files (Node.js 24 LTS, `pnpm@10.30.3`, `@biomejs/biome@2.4.5`, `vitest@4.0.18`, `@playwright/test@1.58.2`)
- [ ] T003 [P] Add fixtures for JSON and YAML workflow sources in `tests/fixtures/`

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T004 Implement source parse/serialize service in `packages/editor-core/src/source/`
- [ ] T005 [P] Implement diagnostics model and event payload types in `packages/editor-core/src/diagnostics/`
- [ ] T006 [P] Implement host contract surface types in `packages/editor-host-client/src/contracts/`
- [ ] T007 Implement monotonic revision tracking in `packages/editor-core/src/state/`
- [ ] T008 Implement event bridge from core to web component in `packages/editor-web-component/src/events/`

## Phase 2b: Renderer Foundation (Blocking Prerequisites)

- [ ] T009 Define renderer abstraction contract (`mount`, `update`, `dispose`, selection/event bridge) in `packages/editor-renderer-contract/src/renderer-adapter.ts`
- [ ] T010 [P] Implement `rete-lit` adapter against renderer contract in `packages/editor-renderer-rete-lit/src/rete-lit-adapter.ts`
- [ ] T011 [P] Implement `react-flow` adapter against renderer contract in `packages/editor-renderer-react-flow/src/react-flow-adapter.ts`
- [ ] T012 Wire bundle-level renderer selection and capability exposure in `packages/editor-host-client/src/contracts/capabilities.ts`

## Phase 3: User Story 1 - Create A Valid Workflow Visually (Priority: P1)

**Goal**: Author workflows from blank state using insertion and property editing.

**Independent Test**: Build a new workflow visually and export valid source.

- [ ] T013 [P] [US1] Add start/end synthetic node bootstrap logic in `packages/editor-core/src/graph/bootstrap.ts`
- [ ] T014 [P] [US1] Add insertion command handling in `packages/editor-core/src/commands/insert-task.ts`
- [ ] T015 [US1] Wire insertion affordance and focus behavior in `packages/editor-web-component/src/graph/insertion-ui.ts`
- [ ] T016 [US1] Implement selection-driven property panel switching in `packages/editor-web-component/src/panel/panel-controller.ts`
- [ ] T017 [US1] Add export action and format selection in `packages/editor-host-client/src/export.ts`

## Phase 4: User Story 2 - Load And Continue Editing Existing Source (Priority: P2)

**Goal**: Load JSON/YAML workflows and continue editing without semantic loss.

**Independent Test**: Load fixtures, edit, and export equivalent source.

- [ ] T018 [P] [US2] Implement load workflow command in `packages/editor-core/src/commands/load-workflow.ts`
- [ ] T019 [P] [US2] Map loaded model to graph projection in `packages/editor-core/src/graph/project.ts`
- [ ] T020 [US2] Wire load API on web component host surface in `packages/editor-web-component/src/api/load.ts`
- [ ] T021 [US2] Add round-trip integration tests in `tests/integration/workflow-roundtrip.spec.ts`

## Phase 5: User Story 3 - Get Immediate Validation Feedback (Priority: P3)

**Goal**: Emit and render diagnostics for live and explicit validation.

**Independent Test**: Invalid edits produce expected diagnostics payloads and UI indicators.

- [ ] T022 [P] [US3] Implement debounced validation trigger in `packages/editor-core/src/validation/live-validator.ts`
- [ ] T023 [P] [US3] Implement explicit full validation command in `packages/editor-core/src/validation/full-validator.ts`
- [ ] T024 [US3] Implement diagnostics event payload emission in `packages/editor-web-component/src/events/diagnostics.ts`
- [ ] T025 [US3] Implement diagnostics UI mapping and fallback behavior in `packages/editor-web-component/src/diagnostics/rendering.ts`
- [ ] T026 [US3] Add contract tests for diagnostics payloads in `tests/contract/editor-diagnostics.contract.spec.ts`

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T027 [P] Add keyboard and screen-reader checks for core flows in `tests/e2e/accessibility-mvp.spec.ts`
- [ ] T028 [P] Add performance measurement harness for validation latency in `tests/integration/validation-latency.spec.ts`
- [ ] T029 Run quickstart scenarios from `specs/001-visual-authoring-mvp/quickstart.md` and capture results
- [ ] T030 [P] Add renderer-matrix contract tests for `getCapabilities()` payload in `tests/contract/renderer-capabilities.contract.spec.ts`
- [ ] T031 [P] Add renderer-matrix integration tests for create/load/edit/export/validate parity in `tests/integration/renderer-mvp-parity.spec.ts`
