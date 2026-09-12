# Cross-Scene Student UI Audit — Scene 01–05

> Date: 2026-09-12  
> Contract: [`../student-ui-interaction-contract.md`](../student-ui-interaction-contract.md)  
> Request: [`../prompts/audit-and-fix-student-ui.md`](../prompts/audit-and-fix-student-ui.md)  
> Not: Physics Model redesign, PRE/POST rewrite, learner validation

Inventory and issue matrix were produced **before** code changes.

```text
Physics Model semantics changed: NO
UPLP / L1–L6 changed: NO
Evaluators changed: NO
```

---

## A. Inventory

Audited Scenes: 01 `microwave-bread`, 02 `four-stroke-engine`, 03 `horizontal-force-cart`, 04 `equal-volume-material-samples`, 05 `equal-mass-heated-samples`.

Stages: ENTRY → COMPLETE.

Shared chrome: `LearningShell`, `StageHeader` (Scene-owned prompts), `TutorPanel`, `STUDENT_CHROME`.

| Scene | MODEL grammar | Primary MODEL CTA | Tutor in AI_OFF/COMPLETE |
|---|---|---|---|
| 01 | energy/state chain | `记下这条因果链` | hidden |
| 02 | energy/causal slots | `记下这条关系` | hidden |
| 03 | three-case force board | `记下关系` | hidden |
| 04 | ratio board | `记下关系` | hidden |
| 05 | product board | `记下关系` | hidden |

AI_OFF / COMPLETE: TutorPanel gated off in all five Labs. No U6 found.

---

## B. Issue matrix

| ID | Scene | Stage | Contract | Type | Sev | Shared/Local | Evidence | Fix | Status |
|---|---|---|---|---|---|---|---|---|---|
| I01 | 04 | MODEL | UI-01, UI-02 | U1/U2/U7 | P0 | Local | NONE | Visible questions under cut-compare | Fixed |
| I02 | 04 | MODEL | UI-04, UI-06 | U3/U4 | P0 | Shared pattern | NONE | Missing vs incorrect feedback; visible status | Fixed |
| I03 | 01–05 | all tutor stages | UI-03, UI-07 | U5 | P0 | Shared | NONE | Tutor CTA → 给我一点提示 | Fixed |
| I04 | 03, 05 | MODEL | UI-04, UI-06 | U3/U4 | P1 | Shared | NONE | Same missing/incorrect feedback pattern | Fixed |
| I05 | 02 | MODEL | UI-01, UI-10 | U1/U7 | P1 | Local | NONE | Show relation-slot question | Fixed |
| I06 | 01 | MODEL | UI-03 | U2 | P2 | Local | NONE | CTA `连好了` → `记下这条因果链` | Fixed |
| I07 | 01–05 | MODEL | UI-04 | U3 | P2 | Shared | NONE | ValidationMessage contrast | Fixed |
| I08 | 01–05 | — | — | U9 | P1 | Shared | POSSIBLE | Dual hint systems (Tutor + ladder). Do **not** merge or change provenance this pass. | Report only |
| I09 | 04 | MODEL table | UI-01 | U8 | P3 | Local | NONE | Table first column already labels rows; leave | No change |

No U6 (AI_OFF/COMPLETE tutor leak) found.

U9 I08: changing which control records `aiInteractions` / `tutorUsed` could affect L6. Left unchanged.

---

## Evidence completion

Coverage table, 35-screenshot baseline, human-review matrix, Scene 04 wording, and U9 targeted review:

[`cross-scene-ui-audit-evidence.md`](./cross-scene-ui-audit-evidence.md)

```text
U9 verdict: NO_EVIDENCE_REGRESSION
Formal POST rerun: NO
New P0/P1 this evidence pass: none
```
