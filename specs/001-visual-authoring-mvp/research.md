# Research: Visual Authoring MVP

## Decision 1: Source-Only Host Exchange

- **Decision**: Use source input/output as the host contract baseline.
- **Rationale**: Keeps behavior consistent across hosts and prevents model drift.
- **Alternatives considered**:
  - Model-object host API: rejected for MVP due compatibility and ownership ambiguity.

## Decision 2: Validation Owned By Editor Core

- **Decision**: Keep schema and semantic validation inside editor core.
- **Rationale**: Ensures consistent diagnostics regardless of host stack.
- **Alternatives considered**:
  - Host-provided validators: rejected because it fragments correctness behavior.

## Decision 3: Debounced Live Validation + Explicit Full Validation

- **Decision**: Live diagnostics are debounced; explicit full-pass action remains available.
- **Rationale**: Balances responsiveness with compute cost.
- **Alternatives considered**:
  - Full validation on every keystroke: rejected for performance and UX noise.

## Decision 4: No Editor Network Calls

- **Decision**: Editor runtime is network-isolated.
- **Rationale**: Enforces privacy and predictable embedding behavior.
- **Alternatives considered**:
  - Optional telemetry/export in editor: rejected for MVP; delegated to host.

## Decision 5: Web Component + Headless Core

- **Decision**: UI integration in web component, semantics in headless core.
- **Rationale**: Supports multiple hosts while keeping logic portable and testable.
- **Alternatives considered**:
  - Single monolithic UI package: rejected due weaker portability and test isolation.

## Decision 6: Baseline Runtime And Tooling Stack

- **Decision**: Standardize repository bootstrap on Node.js 24 LTS, `pnpm@10.30.3`, `@biomejs/biome@2.4.5`, `vitest@4.0.18`, and `@playwright/test@1.58.2`; pin versions in repo metadata.
- **Rationale**: Provides a stable LTS runtime, reproducible installs, a single fast lint/format toolchain, and clear separation between unit/integration and e2e test execution.
- **Alternatives considered**:
  - Deno-first stack: rejected for now due lower fit with current package ecosystem and existing TypeScript package workflows.
  - Bun-first stack: rejected for now because ecosystem compatibility checks add bootstrap risk for initial delivery.
  - ESLint + Prettier split tooling: rejected in favor of a single-tool chain to reduce config and maintenance overhead.
