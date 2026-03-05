# Contract: Plugin API

## Lifecycle API

- `registerPlugin(plugin): Promise<void>`
- `unregisterPlugin(pluginId): Promise<void>`
- `getPluginInfo(pluginId?)`

## Core Contribution Registries

- `registerCommand(id, handler)`
- `registerValidationRule(rule)`

## UI Contribution Registries

- `registerNodeRenderer(taskKind, factory, options?)`
- `registerPropertyEditor(taskKind, factory)`
- `registerToolbarAction(action)`

Node renderer registration options:

- `options.target`: `portable | rete-lit | react-flow` (defaults to `portable`)

## Slot Extension Points

- `toolbar-start`
- `toolbar-end`
- `panel-header`
- `panel-footer`
- `overlay`
- `status-bar`

Slot contribution registration:

- `registerSlotComponent(slotName, contribution)`

Slot contribution fields:

- `key`
- `render(context)`
- `order?` (defaults to `0`)

## Operational Rules

- Plugin callbacks are wrapped in safe invocation boundaries.
- Duplicate contribution keys resolve with last-registered-wins policy.
- Plugin timeouts and budget violations are surfaced to host observability channels.
- Slot contributions MUST target one of the declared slot names; unknown slot names are rejected with warning/event context.
- Slot contributions in the same slot render in deterministic order: `order` ascending, then `registeredAt` ascending.
- Duplicate slot contribution keys in the same slot resolve with last-registered-wins policy and warning.
- Slot contributions are plugin-owned and are removed when the owning plugin is unregistered.
- Node renderer contribution fallback order is deterministic:
  - exact renderer target match
  - `portable` renderer contribution
  - built-in default renderer
