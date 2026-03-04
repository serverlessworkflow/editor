# Implementation Plan: Visual Authoring MVP

**Branch**: `001-visual-authoring-mvp` | **Date**: 2026-03-02 | **Spec**: `specs/001-visual-authoring-mvp/spec.md`
**Input**: Feature specification from `specs/001-visual-authoring-mvp/spec.md`

## Summary

Implement the baseline editor flow for creating, loading, editing, validating, and exporting Serverless Workflow source through an embeddable web component and a source-first host contract, with dual renderer modules (`rete-lit` and `react-flow`) behind a shared adapter contract.

## Technical Context

**Language/Version**: TypeScript 5.9.3  
**Primary Dependencies**: Lit, Rete, React Flow, Serverless Workflow TypeScript SDK  
**Runtime/Package Manager**: Node.js 24 LTS, `pnpm@10.30.3` (via `packageManager` pin; use userland `corepack@0.34.6` when bundled Corepack is unavailable)  
**Lint/Format**: `@biomejs/biome@2.4.5`  
**Storage**: N/A (host-managed)  
**Testing**: `vitest@4.0.18` and `@playwright/test@1.58.2` (contract/integration/unit/e2e)  
**Target Platform**: Modern desktop browsers and VS Code webview host  
**Project Type**: Web component + headless core packages  
**Performance Goals**: Live diagnostics feedback under 500 ms after debounce for typical edits  
**Constraints**: No editor-initiated network calls, source-first contract, keyboard and screen-reader baseline  
**Scale/Scope**: MVP covering blank/load/edit/validate/export plus diagnostics events across both renderer bundles

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Source-first host contract preserved: PASS
- No editor egress network behavior: PASS
- Validation ownership in editor core: PASS
- Accessibility baseline explicit in quickstart scenarios: PASS
- Error isolation and compatibility/versioning rules defined: PASS

## Project Structure

### Documentation (this feature)

```text
specs/001-visual-authoring-mvp/
+-- plan.md
+-- research.md
+-- data-model.md
+-- quickstart.md
+-- contracts/
¦   +-- host-editor-contract.md
+-- tasks.md
```

### Source Code (repository root)

```text
packages/
+-- editor-core/
¦   +-- src/
¦   +-- tests/
+-- editor-web-component/
¦   +-- src/
¦   +-- tests/
+-- editor-host-client/
¦   +-- src/
¦   +-- tests/
+-- editor-renderer-contract/
¦   +-- src/
+-- editor-renderer-rete-lit/
¦   +-- src/
+-- editor-renderer-react-flow/
    +-- src/

tests/
+-- contract/
+-- integration/
+-- e2e/
```

**Structure Decision**: Use a package split between headless core, web component integration, optional thin host client, and dedicated renderer modules behind a shared renderer adapter contract (`mount`, `update`, `dispose`, plus normalized selection/event bridging). Renderer is selected by imported bundle at build time.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
