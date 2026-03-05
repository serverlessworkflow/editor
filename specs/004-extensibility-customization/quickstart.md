# Quickstart Validation: Extensibility Customization

## Scenario 1: Lifecycle Basics

1. Register a plugin with setup and teardown hooks.
2. Verify active state.
3. Unregister plugin.

Expected: activation and deactivation events emitted; teardown executes once.

## Scenario 2: Fault Isolation

1. Register plugin with setup that throws.
2. Verify plugin fault state and event payload.
3. Continue editing workflow.

Expected: editor remains functional and plugin is marked faulted.

## Scenario 3: Behavioral Contributions

1. Register command contribution and dispatch it.
2. Register validation rule with `EXT-` rule ID.
3. Trigger validation.

Expected: command executes and diagnostics include plugin rule output.

## Scenario 4: UI Contributions

1. Register node renderer for a task kind.
2. Add toolbar action contribution.
3. Mount slot component in `toolbar-end`.

Expected: node rendering, toolbar action, and slot UI all integrate without core modifications.

4. Register a renderer-targeted contribution for a non-active renderer backend.

Expected: deterministic fallback is applied and warning payload includes renderer target and resolution context.

## Scenario 5: Slot Validation And Ordering

1. Register two slot components in `toolbar-end` with different `order` values.
2. Verify rendered order follows ascending `order`.
3. Register a slot contribution with an unknown slot name.
4. Unregister owning plugin and verify slot contribution cleanup.

Expected: slot ordering is deterministic, unknown slots are rejected with warning/event context, and unregister removes plugin-owned slot contributions.

## Scenario 6: Accessibility Baseline For Plugin UI

1. Mount plugin-contributed toolbar action and slot component.
2. Navigate core authoring actions and plugin UI using keyboard only.
3. Validate focus order/visibility and accessible names for plugin-contributed controls.

Expected: plugin UI remains keyboard operable and screen-reader understandable with no pointer-only blockers in core authoring flows.
