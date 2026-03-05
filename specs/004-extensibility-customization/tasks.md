# Tasks: Extensibility Customization

**Input**: Design documents from `specs/004-extensibility-customization/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Create plugin fixture set in `tests/fixtures/plugins/`
- [ ] T002 [P] Add plugin fault-injection helpers in `packages/editor-core/tests/plugins/`

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T003 Implement plugin registry and lifecycle state machine in `packages/editor-core/src/plugins/plugin-host.ts`
- [ ] T004 [P] Implement safe invocation wrapper and timeout handling in `packages/editor-core/src/plugins/safe-invoke.ts`
- [ ] T005 [P] Implement contribution registry abstractions in `packages/editor-core/src/plugins/registries/`
- [ ] T006 Implement plugin lifecycle event bridge in `packages/editor-web-component/src/plugins/plugin-events.ts`

## Phase 3: User Story 1 - Register And Manage Plugins Safely (Priority: P1)

**Goal**: Provide robust plugin lifecycle APIs with fault isolation.

**Independent Test**: Register, fault, and unregister plugin without editor crash.

- [ ] T007 [P] [US1] Implement `registerPlugin` and `unregisterPlugin` host APIs in `packages/editor-web-component/src/api/plugins.ts`
- [ ] T008 [US1] Implement plugin state query API in `packages/editor-core/src/plugins/plugin-info.ts`
- [ ] T009 [US1] Add lifecycle contract tests in `tests/contract/plugin-lifecycle.contract.spec.ts`
- [ ] T023 [US1] Add duplicate-key conflict policy contract tests in `tests/contract/plugin-conflict-policy.contract.spec.ts`

## Phase 4: User Story 2 - Extend Behavior Through Commands And Validation (Priority: P2)

**Goal**: Enable command and validation contributions with bounded execution.

**Independent Test**: Plugin commands and validation rules execute under context and budget constraints.

- [ ] T010 [P] [US2] Add command contribution adapter in `packages/editor-core/src/plugins/command-registry.ts`
- [ ] T011 [P] [US2] Add validation rule contribution adapter in `packages/editor-core/src/plugins/validation-registry.ts`
- [ ] T012 [US2] Add integration tests for plugin command and validation flows in `tests/integration/plugin-behavior.spec.ts`

## Phase 5: User Story 3 - Extend UI Through Node Renderers And Slots (Priority: P3)

**Goal**: Enable renderer-aware UI contributions with deterministic fallback behavior.

**Independent Test**: Custom renderer and slot contributions execute with deterministic target/fallback resolution in both renderer bundles.

- [ ] T013 [P] [US3] Implement renderer-neutral node renderer registry and target resolution in `packages/editor-web-component/src/plugins/node-renderers.ts`
- [ ] T014 [P] [US3] Implement `rete-lit` renderer contribution bridge in `packages/editor-renderer-rete-lit/src/plugins/node-renderer-bridge.ts`
- [ ] T015 [P] [US3] Implement `react-flow` renderer contribution bridge in `packages/editor-renderer-react-flow/src/plugins/node-renderer-bridge.ts`
- [ ] T016 [P] [US3] Implement toolbar and property editor registries in `packages/editor-web-component/src/plugins/ui-registries.ts`
- [ ] T017 [US3] Implement slot context bridge in `packages/editor-web-component/src/slots/slot-context.ts`
- [ ] T018 [US3] Add renderer matrix integration tests for UI contribution and fallback flows in `tests/integration/plugin-ui-renderer-matrix.spec.ts`
- [ ] T024 [US3] Add warning/event payload contract tests for unsupported renderer-targeted contributions in `tests/contract/plugin-renderer-warning.contract.spec.ts`
- [ ] T025 [US3] Add slot semantics contract tests (valid slot names, deterministic ordering, duplicate key policy, unregister cleanup) in `tests/contract/plugin-slot-contract.spec.ts`

## Phase 6: Polish & Cross-Cutting Concerns

**Shared Acceptance Criteria (T019, T020)**:

- Enforce node renderer callback budget under 1 ms per node for the active renderer backend.
- Enforce validation rule timeout at 500 ms.
- Assert budget violations emit warning/event payloads including `pluginId`, `phase`, `reason`, `budgetType`, `budgetLimitMs`, and `observedDurationMs`.
- Assert `rendererId` is present when `budgetType=renderer-callback`.

- [ ] T019 [P] Add plugin budget integration tests for `rete-lit` renderer in `tests/integration/plugin-budget-rete-lit.spec.ts`
- [ ] T020 [P] Add plugin budget integration tests for `react-flow` renderer in `tests/integration/plugin-budget-react-flow.spec.ts`
- [ ] T021 [P] Add e2e observability checks for plugin lifecycle events including renderer context in `tests/e2e/plugin-events.spec.ts`
- [ ] T026 [P] Add e2e accessibility checks for plugin-contributed toolbar/slot UI keyboard and accessible-name behavior in `tests/e2e/plugin-accessibility.spec.ts`
- [ ] T022 Run quickstart scenarios from `specs/004-extensibility-customization/quickstart.md` and capture results
