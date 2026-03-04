# Quickstart Validation: Visual Authoring MVP

## Prerequisites

1. Install Node.js 24 LTS.
2. Ensure `pnpm@10.30.3` is active (via Corepack when available; otherwise install `corepack@0.34.6` userland and activate pnpm).
3. Install dependencies and verify baseline tooling:
   - `pnpm install --frozen-lockfile`
   - `pnpm biome check .`
   - `pnpm vitest --run`
   - `pnpm playwright test --list`

## Scenario 1: Create New Workflow

1. Open editor host page with empty state.
2. Create new workflow.
3. Verify graph starts with start and end nodes.

Expected: initial graph and workflow panel state are available.

## Scenario 2: Insert And Edit Task

1. Select insertion affordance between connected nodes.
2. Choose `Call` task.
3. Verify task is inserted and selected.
4. Edit task properties in panel.

Expected: graph and source reflect updated task.

## Scenario 3: Load Existing YAML

1. Load a valid YAML workflow source.
2. Verify graph structure and panel metadata.
3. Make a small edit and export YAML.

Expected: exported YAML stays semantically and structurally correct.

## Scenario 4: Diagnostics Flow

1. Enter an invalid transition target.
2. Wait for debounce window.
3. Verify diagnostics event and local/global UI cues.
4. Trigger explicit validation.

Expected: diagnostics update consistently for live and full validation.

## Scenario 5: Privacy Guardrail

1. Run editor in offline environment.
2. Repeat create/load/edit/export flow.

Expected: no editor-initiated network requests are observed.
