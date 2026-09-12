# Scene 04 Hybrid DSL Pilot

> Date: 2026-09-12  
> Kind: behavior-preserving architecture extraction  
> Scene: `equal-volume-material-samples` / `density-mass-volume`  
> Decision: D059

Scene 01–03 and 05–06 were not migrated. No Scene 07. No database. No universal renderer.

---

## A. DSL v0.1 schema

Typed in `lib/scene-dsl/v01.ts` (Zod). Scene 04 literals only.

Owned fields (all used at Scene 04 runtime):

| Field | Why it is in v0.1 |
|---|---|
| `identity.sceneId`, `primaryModelId` | Adapter / model binding |
| `plugins.physics`, `modelRepresentation`, `evaluator` | Named plugins; no formulas |
| `stageOrder`, `stagePrompts`, `stageFooters` | UPLP chrome Scene 04 already shows |
| `tutorGoals` | `getSamplesTutorContext` learning goals |
| `copy.*` | Landing, observe/predict CTAs, complete, PRI units |
| `observe.options`, `observe.requiredIds` | Checklist + evaluator gate |
| `describe.accepted` | Structured describe gate |
| `predict.outcomes` | Outcome membership |
| `explain.accepted`, `explain.rejectIds` | Explain gate |
| `transfer.requiredFullModelIds`, `boundaryTargetId`, `relationIds` | Required pair + relation cards |
| `exam.patternIds`, `maxAttemptsPerItem` | Exam sequence |
| `aiOff.challengeIds`, `tutorEnabled: false` | AI_OFF sequence; Tutor forbidden |
| `hintLadder.source = "physics-model"` | Binding only; ladder stays on the model |
| `evidenceBindings` | Names existing predicates; accumulator stays code |

Rejected by schema / catalog check:

- unknown stage keys
- missing required prompts
- invalid plugin names
- unknown transfer / exam / AI_OFF IDs
- `aiOff.tutorEnabled !== false`
- AI_OFF challenge with `llmAllowed !== false`
- empty exam sequence

Not included (unused `SceneDefinition` fields): `visualType`, `experimentOperations`, `physicsEngine` string path, `targetEvidence`, `controllableVariables`.

---

## B. Canonical source-of-truth map

| Concern | Owner after pilot | Runtime reads |
|---|---|---|
| Student chrome, options, IDs, units | `lib/content/equal-volume-material-samples.ts` via `samplesSceneDsl` | Yes |
| Transfer stems / modes | `content/physics-models/density-mass-volume/transfer.ts` | Yes |
| Exam stems / options | `content/physics-models/density-mass-volume/exam.ts` | Yes |
| AI_OFF stems / `llmAllowed` | `content/physics-models/density-mass-volume/independent-challenges.ts` | Yes |
| Exam/AI_OFF intended answers | `assessment-overlay.ts` | Yes |
| Hint ladder text | `PhysicsModel.tutorPolicy.hintLadder` | Yes |
| Tutor permissions | Universal `STAGE_TUTOR_POLICY` | Yes |
| Official density / cut | `lib/physics/equal-volume-material-samples` | Yes |
| MODEL board | `SamplesRatioBoard` + `evaluateSamplesModelStructure` | Yes |
| L-levels | `deriveModelEvidenceLevel` | Yes |
| Tutor leaks | `looksLikeSamplesTutorLeak` + `samplesTutorConstraint` | Yes |
| `SceneDefinition` on the model | Readiness / inventory only | No |

There is no third config file. `samples-exam.ts` / `samples-ai-off.ts` / `samples-transfer.ts` re-export IDs from the Scene config.

---

## C. Scene 04 before / after

Before:

```text
lib/content (copy + options)
  + samples-exam.ts IDs
  + samples-ai-off.ts IDs
  + samples-transfer.ts IDs
  + hardcoded observe/describe/explain literals
  + SamplesObserve/Predict/Complete implementations
```

After:

```text
samplesSceneDsl (Zod-validated)
        ↓
ChecklistObserveTask / OutcomePredictTask / LookbackCompleteView
        ↓
named plugins: density physics, SamplesRatioBoard, samples-* evaluators
```

Lab, session hook, ratio board, experiment observed-fields, and adapter completion predicates are unchanged.

---

## D. What became declarative

- Exam pattern ID sequence
- AI_OFF challenge ID sequence + `tutorEnabled: false`
- Transfer required pair + boundary id
- Observe required IDs
- Describe / explain accepted and reject IDs
- Stage prompts, observe/predict/complete copy, PRI units
- Plugin names
- Evidence-binding identifiers (documentation + allowlist, not a dispatcher)

---

## E. What remained code, and why

| Code | Why |
|---|---|
| `densityGPerCm3`, `applyCutFactor`, experiment runners | Physics Truth |
| `SamplesRatioBoard`, `evaluateSamplesModelStructure` | MODEL grammar |
| `samples-experiment.ts` observed-field logic | Not a generic form |
| `samples-transfer.ts` / exam / AI_OFF evaluators | Nontrivial + overlay |
| `EqualVolumeSamples` | PRI rendering |
| `looksLikeSamplesTutorLeak` | Leak detection |
| `deriveModelEvidenceLevel` | Sole L-level owner |
| `accumulateSamplesSceneEvidence` | Still function calls, not string dispatch |

---

## F. Plugin boundaries

Reused existing adapter boundary. No second plugin system.

| Plugin | Name in DSL | Implementation |
|---|---|---|
| Physics | `deterministic-equal-volume-samples` | `lib/physics/equal-volume-material-samples` |
| MODEL | `ratio-quantitative` | `SamplesRatioBoard` + `samples-model.ts` |
| Evaluator | `density-mass-volume-samples` | `lib/learning/samples-*.ts` + model evaluator |

`SceneAdapter` still owns completion, evidence, overlay, `runExperiment`.

---

## G. Files created / changed / deleted

Created:

- `lib/scene-dsl/v01.ts`
- `components/learning/dsl/ChecklistObserveTask.tsx`
- `components/learning/dsl/OutcomePredictTask.tsx`
- `components/learning/dsl/LookbackCompleteView.tsx`
- `tests/scene-dsl/v01-schema.test.ts`
- `tests/scene-dsl/samples-behavior-equivalence.test.ts`
- `spec/architecture/scene-04-hybrid-dsl-pilot.md`

Changed:

- `lib/content/equal-volume-material-samples.ts`
- `lib/learning/samples-{exam,ai-off,transfer,observe,describe,explain,tutor-context}.ts`
- `components/learning/Samples{Observe,Predict}Task.tsx`, `SamplesCompleteView.tsx`

Deleted: none. ID arrays were removed from learning modules by re-export.

Unchanged: Scene 01–03, 05–06 production files; UPLP; L-level derivation; density physics; ratio board.

---

## H. Duplication delta

| Item | Change |
|---|---|
| Scene 04 Observe/Predict/Complete implementations | 234 → 132 LOC wrappers (−102) |
| Generic reusable shells | +258 LOC |
| Schema | +232 LOC |
| Validated config composition | +141 LOC in the content file |
| Duplicate exam/AI_OFF/transfer ID arrays in learning modules | removed (re-export) |
| Hardcoded observe/describe/explain accepted IDs | moved to config |
| Exam/AI_OFF/MODEL/EXPERIMENT task components | not extracted (behavior risk) |

Net production TypeScript is **up** because the schema and shells are new infrastructure. Scene 04-specific shell code is **down**. The reusable payoff appears only if a later Scene uses the same three shells. That is why the recommendation is not multi-scene migration.

---

## I. Behavior-equivalence tests

`tests/scene-dsl/*.ts` plus existing Scene 04 suite:

| Check | Result |
|---|---|
| A. Stage prompts / order | PASS |
| B. `densityGPerCm3` / catalog | PASS |
| C. MODEL `completeSamplesModelInput` | PASS (`samples-stages`) |
| D. Transfer cups/hollow IDs | PASS |
| E. Exam pattern sequence | PASS |
| F. AI_OFF Tutor hard block | PASS |
| G–H. Accumulator + `deriveModelEvidenceLevel` L0 empty session | PASS |
| I. `STAGE_TUTOR_POLICY[AI_OFF] = []` | PASS |
| J. Units `g` / `cm³` / `g/cm³` | PASS |
| K. Persistence keys | unchanged (`samples-scene-data.ts` not edited) |
| L. CTA / prompt identity | PASS (golden strings) |

Existing: `samples-stages` 23, `samples-exam` 16, `samples-ai-off` 19, `samples-ratio-pedagogy` 12, physics 7, adapter 4, ratio-board UI 4. **103/103** with the new DSL tests.

---

## J. Evidence-equivalence

`accumulateSamplesSceneEvidence` still writes the same 7 flags. It does not read `evidenceBindings` as a program. Official L-levels still come only from `deriveModelEvidenceLevel`. Adversarial Scene 04 tests still pass.

---

## K. PRI-equivalence

`EqualVolumeSamples` still renders mass/volume/density from official functions. Unit strings still come from Scene copy (`g`, `cm³`, `g/cm³`). Quantity identity unchanged.

---

## L. Runtime contamination check

`lib/learning/progression.ts`, `lib/learning/tutor-request.ts`, and `hooks/useTutor.ts` have **no** `equal-volume-material-samples` / `sceneId` branch.

---

## M. Risks discovered

1. Zod 4 `z.record(enum, string)` required every stage key. Tutor goals are intentionally partial; the schema had to list the stages Scene 04 actually uses.
2. Extracting Exam/AI_OFF shells in this pass would have rewritten draft machines. Stopped; those remain Scene 04 code.
3. Putting `evidenceBindings` into a dispatcher would become an evaluator language. Bindings stay allowlisted names.
4. Generic shells do not yet pay for themselves until a second Scene uses them.
5. `SceneDefinition` is still unread at runtime. The pilot did not revive unused fields.

No stop condition fired: behavior did not change to fit the DSL; no formula strings; no sceneId branches; MODEL board not generalized; evidence/PRI semantics unchanged; other Scenes not modified.

---

## N. Recommendation

**KEEP_SCENE04_ONLY**

The schema is Scene 04–literal. The three shells are reusable later, but migrating Scene 05 now would require widening the schema and is out of scope.

Not `ABANDON_DSL_PILOT`: validation and ID ownership are real.
Not `EXPAND_TO_SECOND_SCENE` in this pass.
Not `READY_FOR_CONTROLLED_MULTI_SCENE_MIGRATION`.

Next authorized step, if any: a later Scene 05 **chrome-only** pass onto the existing shells, without touching heat physics or the product board.
