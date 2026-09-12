# Scene 07 — Readiness

> Engineering-information gate, not a lifecycle status and not Gate A/B.  
> Model: `convex-lens-imaging`  
> Scene: `convex-lens-optical-bench`  
> Method: `validatePhysicsModelReadiness` + Evidence Claim Design

## Checklist

| Item | Status |
|---|---|
| Canonical ID `convex-lens-imaging` | present |
| Core idea | present; not a five-row slogan |
| Quantities / entities | present |
| Relations | present; `depends-on` only |
| Conditions / boundaries | present; thin-lens equation excluded |
| Misconceptions | cli-M1–M10 |
| Anchor | `convex-lens-optical-bench` |
| Experiments | four high-information probes |
| Transfer | required projector + magnifier |
| Exam | five patterns; overlay covered |
| AI_OFF | two challenges; overlay covered |
| Evaluator design | construction.ts READY_FOR_SCENE_EVIDENCE |
| Overlay | present; judgment-alone TOO_WEAK_FOR_L6 |
| Deterministic physics | `officialImagingState` discrete stations |
| Intended SceneDefinition | declared on the model |
| MODEL representation contract | `spatial-ray-relation`; inference may say `relation-condition` |
| PRI implementation locks | `physical-representation-plan.md` |
| Formal Evidence Claim Design | this folder |

## `validatePhysicsModelReadiness`

Expected result: **`IMPLEMENTATION_READY`**

Expected warnings:

- `energyRelations` / `modelRepresentation`: inferred `relation-condition` because the readiness helper has no spatial-ray kind. Implementation must still use the spatial-ray contract, not Scene 02–06 boards.

Missing: none  
Blockers: none

`metadata.status` stays **`draft`**. This result does not authorize React, a route, a DSL, or a new shell.

## Stop conditions checked

None of these were required to reach readiness:

- weakening UPLP
- changing L4/L5/L6 semantics
- widening Scene DSL
- a universal optics renderer
- `sceneId` / `modelId` branches in generic shells
- LLM deciding ray geometry or correctness
- thin-lens equation entering the Grade-9 primary
- MODEL becoming a five-row lookup table
- post-check manufacturing pre-commit evidence

## Verdict

**`IMPLEMENTATION_READY`**

This means there is enough canonical information to implement later.  
It does **not** mean `MODEL_QUALITY_PASS` is a new result.  
It does **not** mean Scene 07 should be built in this pass.
