# Scene 07 — Convex-lens optical bench

Scene ID: `convex-lens-optical-bench`  
Primary model: `convex-lens-imaging`  
Secondary models: none  

Canonical model: [`../../../content/physics-models/convex-lens-imaging/`](../../../content/physics-models/convex-lens-imaging/)

This folder owns Scene 07 design sitting. The production Scene lives on the Universal Runtime (`app/scenes/convex-lens-optical-bench/`). It does not widen Scene DSL and does not extract a generic optics shell.

Library `metadata.status` is `prototype` after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. PRE is `MODEL_QUALITY_PASS_WITH_REFINEMENTS`. Readiness is `IMPLEMENTATION_READY`. Not learner-validated.

| File | Owns |
|---|---|
| [`evidence-claim-design.md`](./evidence-claim-design.md) | L4/L5/L6 claims; construction ≠ table |
| [`readiness.md`](./readiness.md) | Gate checklist and `validatePhysicsModelReadiness` result |
| [`physical-representation-plan.md`](./physical-representation-plan.md) | design-time PRI locks |
| [`interaction-plan.md`](./interaction-plan.md) | learner-interaction plan; first runtime reference consumer |

Experimental overlay (not an owner): [`../../learner-experience/scene07-learner-experience-v1.1.md`](../../learner-experience/scene07-learner-experience-v1.1.md) (v1 kept as history). Concept ledger: [`../../learner-experience/scene07-concept-ledger-v1.md`](../../learner-experience/scene07-concept-ledger-v1.md). Canonical contracts win.

Do not extract a generic optics shell. Do not widen Scene DSL.
