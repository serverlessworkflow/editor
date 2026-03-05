# Data Model: Extensibility Customization

## Entities

### EditorPlugin

- **Fields**:
  - `id`: string
  - `setup(ctx)`
  - `teardown?()`
- **Rules**:
  - Plugin IDs must be unique in active registry.

### PluginContext

- **Fields**:
  - command dispatch API
  - typed registry APIs
  - selection and workflow accessors
  - logger and disposable store
- **Rules**:
  - Context must not expose unrestricted internal mutation primitives.

### PluginInfo

- **Fields**:
  - `id`
  - `state`: `active | deactivated | faulted`
  - `faultReason?`
- **Rules**:
  - State transitions emit lifecycle events.

### ContributionEntry

- **Fields**:
  - `type`
  - `key`
  - `pluginId`
  - `registeredAt`
- **Rules**:
  - Duplicate keys follow deterministic conflict policy.

### SlotContributionEntry

- **Fields**:
  - `slotName`
  - `key`
  - `pluginId`
  - `order` (number, default `0`)
  - `registeredAt`
- **Rules**:
  - `slotName` must be one of the declared slot extension points.
  - Contributions in a slot are ordered by `order` ascending, then `registeredAt` ascending.
  - Duplicate keys within the same slot follow last-registered-wins and emit warning context.
  - All entries are removed when owning plugin is unregistered.

### PluginBudget

- **Fields**:
  - callback timeout thresholds
  - render budget hints
- **Rules**:
  - Budget violations result in warnings and fault handling as configured.
