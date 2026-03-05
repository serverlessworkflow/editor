# Research: Extensibility Customization

## Decision 1: Hybrid Extension Model

- **Decision**: Use imperative plugin APIs for behavior and declarative slots for UI chrome.
- **Rationale**: Separates behavior extensibility from host layout customization cleanly.
- **Alternatives considered**:
  - API-only extension model: rejected due weak host UI composition.

## Decision 2: First-Party Trust Model In MVP

- **Decision**: Plugins run in same runtime context with no sandboxing.
- **Rationale**: Minimizes implementation overhead for initial release.
- **Alternatives considered**:
  - Worker isolation and permission model: deferred to post-MVP.

## Decision 3: Bounded Extension Points

- **Decision**: Keep extension points as a closed typed set per release.
- **Rationale**: Improves maintainability and testability.
- **Alternatives considered**:
  - Open arbitrary hook injection: rejected due stability risk.

## Decision 4: Last Registered Wins On Conflicts

- **Decision**: Duplicate keys resolve to last registered contribution with warning.
- **Rationale**: Deterministic behavior with low operational complexity.
- **Alternatives considered**:
  - Hard errors on conflicts: rejected due poor developer ergonomics for host composition.

## Decision 5: Fault Isolation + Lifecycle Events

- **Decision**: Wrap plugin callbacks in safe boundaries and emit lifecycle events.
- **Rationale**: Keeps editor resilient and host-observable.
- **Alternatives considered**:
  - Silent failure handling: rejected because it reduces debuggability.

## Decision 6: Strict Slot Contract With Deterministic Ordering

- **Decision**: Restrict slot contributions to declared slot names, order contributions deterministically (`order`, then registration time), and reject invalid slot names with warning events.
- **Rationale**: Keeps host layout extension predictable and testable while maintaining bounded extension points.
- **Alternatives considered**:
  - Accept arbitrary slot names at runtime: rejected due layout drift and unclear host guarantees.
