# Microwave Bread — Development Notes

> Version: 0.2 alignment wrapper; implementation status remains a dated snapshot

This optional file collects implementation-level notes that do not belong in the learning philosophy.

## Authority / Freshness Notice

This file is a **non-authoritative historical implementation snapshot**. It may become stale as code changes. Do not use it as the source of truth for architecture, current repository status, stage semantics, model IDs, or AI policy.

Authoritative design sources are:

1. [`universal-physics-learning-protocol.md`](./universal-physics-learning-protocol.md) — universal learning protocol / AI stage policy.
2. [`physics-model-schema.md`](./physics-model-schema.md) — Physics Model contract.
3. [`physics-model-library.md`](./physics-model-library.md) — canonical model inventory.

Current implementation claims in this file must be re-verified against the repository before being used for planning or completion decisions.


## Current Checkpoint

As of 2026-09-11, the repository contains the foundation for the microwave-bread scene, but not the full end-to-end learning loop.

Implemented now:

- deterministic physics engine
- learning session creation and localStorage persistence
- stage transition rules and tutor-permission policy
- landing page plus microwave scene route
- heating animation and experiment result UI
- observation, description, prediction, and explanation UI with persisted evidence
- controlled experiment settings for power and heating time
- deterministic explanation-level classification
- accessible click-based model construction with deterministic structure checking
- structured transfer-scenario content and staged transfer responses
- test coverage for physics, progression, persistence, and initial component flow

Still pending:

- exam-mode experience
- `AI_OFF` user flow
- server-side tutor route and schema validation
- Playwright end-to-end coverage

## Current TypeScript Modules

```text
app/
  page.tsx
  scenes/
    microwave-bread/
      page.tsx

components/
  common/
    Button.tsx
    Card.tsx
  learning/
    LearningShell.tsx
    MicrowaveBreadLab.tsx
    StageHeader.tsx
    StageProgress.tsx
  physics/
    Bread.tsx
    ExperimentResult.tsx
    MicrowaveControls.tsx
    MicrowaveScene.tsx
    TemperatureDisplay.tsx

hooks/
  useHeatingAnimation.ts
  useLearningSession.ts

lib/
  learning/
    events.ts
    progression.ts
    session-storage.ts
    session-store.ts
    session.ts
    stage-policy.ts
    state-machine.ts
  content/
    microwave-bread.ts
    transfer-scenarios.ts
  physics/
    constants.ts
    microwave.ts
    visual.ts

tests/
  components/
  learning/
  physics/

types/
  ai.ts
  learning.ts
  physics.ts
```

## Planned Next Modules

```text
app/
  api/
    tutor/
      route.ts

components/
  learning/
    StudentInput.tsx
    VocabularyChips.tsx
    PredictionPanel.tsx
    ExplanationPanel.tsx
    ModelCanvas.tsx
    TransferScenario.tsx
    ExamQuestion.tsx
    IndependentChallenge.tsx
  tutor/
    TutorPanel.tsx
    TutorMessage.tsx
    TutorLoading.tsx

lib/
  ai/
    provider.ts
    tutor.ts
    tutor-schema.ts
    tutor-prompt.ts
  content/
    misconceptions.ts
    transfer-scenarios.ts
    exam-questions.ts
```

## Implementation Rules

1. Physics functions are pure.
2. Learning state transitions remain application-controlled.
3. Content should continue moving into structured data modules.
4. AI responses must be schema validated.
5. AI errors must not crash the session.
6. `AI_OFF` must not call the server tutor route.
