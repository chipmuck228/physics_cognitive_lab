# Physics Cognitive Lab

Research prototype for a Grade 9 physics learning environment. The first scene explores one vertical slice:

`microwave bread -> observation -> physics description -> explanation -> model -> transfer -> exam -> AI off`

The application owns the physical world and learning progression. AI, when added, is a constrained scaffold rather than the source of physics truth or official learning state.

## Current Status

Current implementation is an early foundation checkpoint, not the full learning loop yet.

Implemented now:

- landing page and `/scenes/microwave-bread`
- deterministic microwave heating engine with clamped inputs
- visual heating scene and experiment result display
- student evidence capture for `OBSERVE`, `DESCRIBE`, `PREDICT`, and `EXPLAIN`
- controlled follow-up experiment controls for `EXPERIMENT`
- accessible click-based model construction for `MODEL`
- structured three-scenario transfer flow for `TRANSFER`
- learning-stage enum, transition rules, and tutor-permission policy
- localStorage-backed learning session store
- tests for physics rules, state-machine rules, persistence, and initial scene behavior

Not implemented yet:

- student interaction for `EXAM` and `AI_OFF`
- tutor API route and schema-validated server-side AI integration
- curated exam experiences
- Playwright end-to-end coverage for the full learning journey

## Project Structure

Core folders:

- `app/` - routes and page entry points
- `components/physics/` - microwave scene and experiment UI
- `components/learning/` - learning shell and stage presentation
- `lib/physics/` - deterministic pedagogical simulation
- `lib/learning/` - session model, storage, progression, and policies
- `types/` - shared TypeScript contracts
- `tests/` - Vitest unit and component coverage
- `spec/` - product, pedagogy, and architecture source-of-truth documents

Important design docs to read before major changes:

- `spec/PROJECT_BRAIN.md`
- `spec/DECISION_LOG.md`
- `spec/learning-spec.md`
- `spec/state-machine.md`

## Scripts

```bash
npm run dev
npm run lint
npm test
```

## Notes

- Physics behavior is intentionally a pedagogical approximation, not a real microwave engineering simulation.
- `AI_OFF` remains a hard product boundary even before the tutor is implemented.
- The current codebase keeps later-stage types and guards in place so the rest of the MVP can be added without changing the learning philosophy.
