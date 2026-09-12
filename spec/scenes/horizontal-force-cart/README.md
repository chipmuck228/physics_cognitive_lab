# Scene 03 — Horizontal Force Cart

Scene specification and implementation plan. **Not** a production UI.

## Identity

```ts
{
  id: "horizontal-force-cart",
  primaryModel: "force-changes-motion-state",
  secondaryModels: ["force-equilibrium", "inertia-motion-state"],
  phenomenonId: "horizontal-cart-net-force"
}
```

Secondary models are supporting connections. They are **not** additional learning targets.

## Architecture contract

Read before implementing:

1. [`../../universal-physics-learning-protocol.md`](../../universal-physics-learning-protocol.md) — HOW students learn
2. [`../../physics-model-schema.md`](../../physics-model-schema.md) — WHAT a model contains
3. [`../../physics-model-library.md`](../../physics-model-library.md) — WHICH models exist
4. [`../../../content/physics-models/force-changes-motion-state/`](../../../content/physics-models/force-changes-motion-state/) — this Scene's primary model

This folder instantiates those documents. It does **not** redefine:

- universal stages or stage semantics;
- H1–H5 hint meanings;
- Physics Model structure or canonical IDs;
- AI_OFF as a hard application boundary.

## Documents

| File | Owns |
|---|---|
| [`scene-spec.md`](./scene-spec.md) | Scene purpose, boundaries, future UI/component plan |
| [`physics-state.md`](./physics-state.md) | Deterministic qualitative cart state |
| [`learning-flow.md`](./learning-flow.md) | Scene-specific mapping onto UPLP stages |
| [`interaction-script.md`](./interaction-script.md) | Grade 9 Chinese student experience |
| [`evidence-contract.md`](./evidence-contract.md) | Evidence mapping to `deriveModelEvidenceLevel` |
| [`ai-guardrails.md`](./ai-guardrails.md) | Scene-specific tutor constraints |
| [`exam-mapping.md`](./exam-mapping.md) | Exam World uses the model's exam patterns |
| [`test-plan.md`](./test-plan.md) | Future unit / learning / Playwright tests |

## What the student is learning

Not “这辆小车怎么画”.

The cart is the **observable environment**. The learning target is the reusable relation:

当前运动状态 + 合力条件 / 方向关系 → 运动状态变化

This Scene exists to validate that the Universal Runtime can teach a Physics Model whose deep structure is **not** Scene 02's four-node energy-conversion chain.

## Consistency check

- Universal stages: instantiated, not redefined.
- H1–H5: referenced from UPLP / model `tutorPolicy`, not redefined.
- New canonical model ID: none. `force-changes-motion-state` already existed in the Library.
- Model experiments, transfer targets, exam patterns, independent challenges: referenced, not copied as a second source of truth.
- Exactly one `primaryModel`.
- Cart, arrows, and qualitative speed ticks: Scene representation only.
- Experiment results: deterministic application state.
- AI_OFF: hard application boundary.

## Unresolved questions

1. Shared `STUDENT_STAGE_LABELS` vs Scene-local copy (`spec/OPEN_QUESTIONS.md` O013). Scene 03 should use the shared registry. Do not silently change Scene 01.
2. Whether opposite-force experiments should always continue until reversal, or stop at “slowed down” unless the student keeps the force applied.
3. Future DESCRIBE gate: structured choices vs constrained parse of free text.
4. Whether `LearningSession.experimentEvidence.experimentId` should be widened from Scene 02's engine union before production implementation, or Scene 03 should store experiment records only in `sceneData`.
5. Library status is `prototype` after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. The model is not learner-validated.

## Status

Specification and canonical model definition only. No production React Scene. No cart physics module in `lib/physics/` yet.
