# Scene 02 — Four-stroke Internal Combustion Engine

Scene specification and implementation plan. **Not** a production UI.

## Identity

```ts
{
  id: "four-stroke-engine",
  primaryModel: "chemical-energy-internal-energy-mechanical-energy",
  secondaryModels: [
    "mechanical-work-energy-transfer",
    "force-changes-motion-state"
  ],
  phenomenonId: "four-stroke-internal-combustion-engine"
}
```

Secondary models are supporting connections. They are **not** additional learning targets.

## Architecture contract

Read before implementing:

1. [`../../universal-physics-learning-protocol.md`](../../universal-physics-learning-protocol.md) — HOW students learn
2. [`../../physics-model-schema.md`](../../physics-model-schema.md) — WHAT a model contains
3. [`../../physics-model-library.md`](../../physics-model-library.md) — WHICH models exist
4. [`../../../content/physics-models/chemical-energy-internal-energy-mechanical-energy/`](../../../content/physics-models/chemical-energy-internal-energy-mechanical-energy/) — this Scene's primary model

This folder instantiates those documents. It does **not** redefine:

- universal stages or stage semantics;
- H1–H5 hint meanings;
- Physics Model structure or canonical IDs;
- AI_OFF as a hard application boundary.

## Documents

| File | Owns |
|---|---|
| [`scene-spec.md`](./scene-spec.md) | Scene purpose, boundaries, future UI/component plan |
| [`physics-state.md`](./physics-state.md) | Deterministic `EngineState` and four-stroke table |
| [`learning-flow.md`](./learning-flow.md) | Scene-specific mapping onto UPLP stages |
| [`interaction-script.md`](./interaction-script.md) | Grade 9 Chinese student experience |
| [`evidence-contract.md`](./evidence-contract.md) | Evidence mapping to `deriveModelEvidenceLevel` |
| [`ai-guardrails.md`](./ai-guardrails.md) | Scene-specific tutor constraints |
| [`exam-mapping.md`](./exam-mapping.md) | Exam World uses the model's exam patterns |
| [`test-plan.md`](./test-plan.md) | Future unit / learning / Playwright tests |

## What the student is learning

Not the names 吸气 → 压缩 → 做功 → 排气.

The four strokes are the **observable environment**. The learning target is the reusable chain:

燃料的化学能 → 燃烧使工作物质内能/状态变化 → 工作物质对机械系统做功 → 机械能

## Consistency check

- Universal stages: instantiated, not redefined.
- H1–H5: referenced from UPLP / model `tutorPolicy`, not redefined.
- New canonical model ID: none. Both secondary IDs are already in `physics-model-library.md`.
- Model experiments, transfer targets, exam patterns, independent challenges: referenced, not copied as a second source of truth.
- Exactly one `primaryModel`.
- Four strokes: Scene representation only.
- Experiment results: deterministic application state.
- AI_OFF: hard application boundary.

## Unresolved questions

1. Scene 02 Chinese stage labels vs shared `STUDENT_STAGE_LABELS` used by Scene 01 (`spec/OPEN_QUESTIONS.md` O013). Do not silently change Scene 01.
2. Future DESCRIBE gate: structured choices vs constrained parse of free text.
3. After a failed power stroke, how much crankshaft animation is allowed before students confuse motion with `main-output`.
4. Whether the MODEL builder should expose compression as “work done on the gas” or keep that implicit so the primary chain stays 化学能 → 内能/状态 → 做功 → 机械能.
5. Exam World: require all five model `examPatterns`, or the recommended subset in `exam-mapping.md`.
6. Library `metadata.status` is `prototype` after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. That is not learner-validated.

## Status

Physics engine core is implemented. Visualization demo lives at `/dev/engine`.
Production React Scene implements the full UPLP loop through COMPLETE.
