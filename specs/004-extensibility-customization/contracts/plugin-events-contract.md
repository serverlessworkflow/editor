# Contract: Plugin Lifecycle Events

## Events

- `pluginActivated`
- `pluginDeactivated`
- `pluginFaulted`
- `pluginWarning`

## Common Payload Fields

- `version`
- `revision`
- `pluginId`
- `timestamp`
- `rendererId` (`rete-lit | react-flow`) when event phase is renderer-coupled

## Fault Payload Fields

Additional fields for `pluginFaulted`:

- `reason`
- `phase` (setup, command, renderer, validator, teardown)
- `recoverable`
- `rendererId` for renderer-phase faults

## Warning Payload Fields

Common fields for `pluginWarning`:

- `reason` (`unsupported-renderer-target | invalid-slot-name | duplicate-slot-key | budget-timeout | budget-exceeded`)
- `phase` (`renderer | slots | validator`)
- `contributionType` (`nodeRenderer | propertyEditor | toolbarAction | slotComponent | validationRule`)
- `contributionKey`

Additional fields for `reason=unsupported-renderer-target`:

- `requestedRendererId`
- `resolvedRendererId` (`portable | default`)

Additional fields for `reason=invalid-slot-name`:

- `slotName`
- `allowedSlotNames`

Additional fields for `reason=duplicate-slot-key`:

- `slotName`
- `replacedContributionPluginId`

Additional fields for `reason=budget-timeout | budget-exceeded`:

- `budgetType` (`validation-timeout | renderer-callback`)
- `budgetLimitMs`
- `observedDurationMs`
- `rendererId` when `budgetType=renderer-callback`

## Compatibility Rules

- Event names are stable.
- Backward-compatible payload expansion is allowed in minor versions.
- Removal or semantic redefinition requires major version increment.
