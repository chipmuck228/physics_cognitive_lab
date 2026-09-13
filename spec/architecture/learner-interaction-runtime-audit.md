# Learner Interaction Runtime — Cross-Scene Audit

> Date: 2026-09-13  
> Kind: architecture audit  
> Status: DESIGN_ONLY  
> Does not authorize: production extraction, Scene DSL growth, mass migration, lifecycle change, learner-validation claims  
> Related: `learner-interaction-runtime-contract.md`, `learner-interaction-state-contract.md`, `learner-interaction-design-template.md`

This audit compares the **actual learner-facing interaction behavior** of Scene 01–07. It is not a quality-review gate and not a Physics Model inventory.

```text
Same UPLP stage
≠
same learner interaction
≠
same reusable runtime
```

Scene 07 TaskFrame / HelpIntent / revisit / reviewPhysics / feedbackKind are **candidates**. They must not be renamed into a universal abstraction.

---

## 1. How this audit was made

Read, then compared production code (not UI copy alone):

| Scene | Lab | Session hook | Scene-data / drafts | Help / Tutor | MODEL surface |
|---|---|---|---|---|---|
| 01 microwave-bread | `MicrowaveBreadLab.tsx` | `useLearningSession.ts` | `microwave-scene-data.ts` | TutorPanel only | `MicrowaveModelBoard` |
| 02 four-stroke-engine | `FourStrokeEngineLab.tsx` | `useEngineLearningSession.ts` | engine drafts in events/sceneData | hint-ladder + TutorPanel | energy / causal chain |
| 03 horizontal-force-cart | `HorizontalForceCartLab.tsx` | `useCartLearningSession.ts` | `cart-*-scene-data` keys | hint-ladder + TutorPanel | `CartModelBoard` cases |
| 04 equal-volume-material-samples | `EqualVolumeSamplesLab.tsx` | `useSamplesLearningSession.ts` | samples draft keys | hint-ladder + TutorPanel | `SamplesRatioBoard` |
| 05 equal-mass-heated-samples | `EqualMassHeatedSamplesLab.tsx` | `useHeatSamplesLearningSession.ts` | heat draft keys | hint-ladder + TutorPanel | heat relation board |
| 06 simple-resistor-circuit | `SimpleResistorCircuitLab.tsx` | `useOhmsLearningSession.ts` | ohms draft keys | hint-ladder + TutorPanel | `OhmsRelationBoard` |
| 07 convex-lens-optical-bench | `ConvexLensOpticalBenchLab.tsx` | `useConvexLensLearningSession.ts` | `lens-scene-data.ts` + reviewPhysics | LensHelpPanel only | `LensRayConstruction` steps |

Also read: UPLP, Evidence Design, Student UI Interaction Contract, Interaction Shell Contract, PRI, Implementation Protocol.

---

## 2. Scene 01–07 matrix

Legend:

- **Progress** = what later stages and completion predicates treat as furthest official stage  
- **Draft** = uncommitted learner input  
- **View** = what the student currently sees as “this page”  
- **Physics view** = what the bench/animation renders  
- **Back** = header 返回  
- **Trace** = events written for later inspection (not L-levels)

### Scene 01 — microwave-bread

| Concern | Current production |
|---|---|
| Authoritative progress | `session.stage`. `goBack` writes `stage` and emits `stage_entered`. |
| Draft ownership | Later-stage drafts in `sceneData`. Observe/predict/experiment forms are largely Lab local state. Hydrate from `session` object. |
| View state | Equals `session.stage`. No viewing/review split. |
| Physics view state | Authoritative `physicsState` plus experiment history in `sceneData`. Back can leave the student on an earlier stage with the later physics already applied. |
| Back / revisit | **Regressing back.** Furthest stage is lost as `session.stage`. Evidence arrays usually remain, but progress and `stage_entered` are corrupted relative to “furthest work”. |
| Help system | No Scene-owned intent ladder. |
| Tutor system | `TutorPanel` / `useTutor`. Hidden in AI_OFF / COMPLETE. |
| Feedback style | Missing vs incorrect via `studentUiFeedback`. Not a consistent failureKind → student-kind map. |
| Task framing | `STAGE_PROMPTS` heading + task copy. No context / goal / focus / action object. |
| Experiment subflow | Predict → run heating → compare → reflect. History list is Scene-owned. |
| MODEL subflow | Energy / internal-energy / temperature board. One construction grammar. |
| Cognitive trace | `events` (`student_response`, `model_submitted`, `stage_entered`). No learner-visible process trace. |
| Known risks | Progress/view conflation. Dual local/persisted draft. Large Lab orchestration. Back looks like review but is regression. |

### Scene 02 — four-stroke-engine

| Concern | Current production |
|---|---|
| Authoritative progress | `session.stage`. `goBack` writes `stage` + `stage_entered`. |
| Draft ownership | Explain/model/transfer/exam/AI_OFF drafts persist. Observe/describe/experiment forms rehydrate from latest evidence when `session` changes. |
| View state | Equals `session.stage`. |
| Physics view state | Authoritative engine cycle / experiment snapshot. No review preview layer. |
| Back / revisit | Regressing back. |
| Help system | Stage hint-ladder (`revealHint`) on EXPLAIN / MODEL / TRANSFER / EXAM. |
| Tutor system | `TutorPanel` in parallel with hint-ladder. Two help entries. |
| Feedback style | Domain `failureKinds` summarized to missing/incorrect copy. |
| Task framing | Stage prompts + long task chrome. Cognitive process is implicit. |
| Experiment subflow | Two experiments, five-part loop (predict / do / see / compare / think). Strongest existing experiment process, still Scene-owned. |
| MODEL subflow | Causal energy chain (source → gas state → work). Must not be copied to other models. |
| Cognitive trace | Events + hint-ladder metadata. |
| Known risks | Dual help. `useEffect` on session can wipe uncommitted fields. Lab is the largest orchestrator (~1100 lines). Back regresses progress. |

### Scene 03 — horizontal-force-cart

| Concern | Current production |
|---|---|
| Authoritative progress | `session.stage`. `goBack` writes `stage` + `stage_entered`. |
| Draft ownership | Describe/explain/model/transfer/exam/AI_OFF in `sceneData`. Observe checkboxes rehydrate from last observation on every session change. |
| View state | Equals `session.stage`. |
| Physics view state | Demo frames are local playback. Authoritative cart state is session physics. No review preview. |
| Back / revisit | Regressing back. |
| Help system | `cart-hint-ladder` on later stages. |
| Tutor system | `TutorPanel` + hint-ladder. |
| Feedback style | `studentUiFeedback` + case-board messages. |
| Task framing | Stage prompts. OBSERVE/PREDICT use proven shells (`ChecklistObserveTask`, `OutcomePredictTask`). |
| Experiment subflow | Predict-gated interventions; comparison/reflection Scene-owned. |
| MODEL subflow | Condition / relation **case board** (`CartModelBoard`). Different grammar from Scene 02 chain. |
| Cognitive trace | Events + hint ids. |
| Known risks | Same progress/back defect as 01/02. Help not bound to visible case. Dual help. Draft wipe on Tutor/hint session writes. |

### Scene 04 — equal-volume-material-samples

| Concern | Current production |
|---|---|
| Authoritative progress | `session.stage`. Regressing `goBack`. |
| Draft ownership | Same family as Scene 03/05: later drafts persisted; observe/predict local + evidence rehydrate. |
| View state | Equals `session.stage`. |
| Physics view state | Authoritative sample physics. Demo playback local. |
| Back / revisit | Regressing back. |
| Help system | `samples-hint-ladder`. |
| Tutor system | `TutorPanel` + hint-ladder. |
| Feedback style | missing/incorrect. |
| Task framing | Stage prompts. OBSERVE/PREDICT via proven shells. |
| Experiment subflow | Same family as 03/05. |
| MODEL subflow | `SamplesRatioBoard` (mass/volume/density). |
| Cognitive trace | Events. |
| Known risks | Identical orchestration clone of 03/05 with different MODEL grammar. Complete uses demonstrated-list chrome (`LookbackCompleteView`) that does **not** fit Scene 05. |

### Scene 05 — equal-mass-heated-samples

| Concern | Current production |
|---|---|
| Authoritative progress | `session.stage`. Regressing `goBack`. |
| Draft ownership | Same family as 03/04. |
| View state | Equals `session.stage`. |
| Physics view state | Authoritative heat-sample physics. PRI-sensitive quantitative labels are Scene/model-owned. |
| Back / revisit | Regressing back. |
| Help system | `heat` hint-ladder. |
| Tutor system | `TutorPanel` + hint-ladder. |
| Feedback style | missing/incorrect. |
| Task framing | Stage prompts + PRI-bearing dishes/labels (owned by PRI, not interaction chrome). |
| Experiment subflow | Same family as 03/04. |
| MODEL subflow | Heat relation board (`c`, `m`, `ΔT`, `Q` identities). |
| Cognitive trace | Events. |
| Known risks | Same interaction defects as 03/04. Complete chrome must not be forced through Scene 04 lookback. PRI must stay outside any future runtime. |

### Scene 06 — simple-resistor-circuit

| Concern | Current production |
|---|---|
| Authoritative progress | `session.stage`. Regressing `goBack`. |
| Draft ownership | Same later-stage persist / early-stage local pattern. |
| View state | Equals `session.stage`. |
| Physics view state | Authoritative circuit state. Quantitative meters are PRI-sensitive. |
| Back / revisit | Regressing back. |
| Help system | `ohms-hint-ladder`. |
| Tutor system | `TutorPanel` + hint-ladder. |
| Feedback style | Rich authored `failureKind` in ohms modules; UI still mostly missing/incorrect. |
| Task framing | Stage prompts. |
| Experiment subflow | Predict-gated circuit change + compare/reflect. |
| MODEL subflow | `OhmsRelationBoard` (U/I/R identities and control relations). |
| Cognitive trace | Events. |
| Known risks | Evaluator kinds exist but are not a learner-visible lifecycle. Dual help. Back regresses. Quantitative MODEL must not be generalized from Scene 03 cases or Scene 07 rays. |

### Scene 07 — convex-lens-optical-bench

| Concern | Current production |
|---|---|
| Authoritative progress | `session.stage` only. `goBack` must **not** write it. |
| Draft ownership | Observe/predict/experiment/describe/explain/model/transfer/exam/AI_OFF drafts in `sceneData`. Hydrate keyed by session identity + committed counts, not whole `session`. |
| View state | `sceneData.viewingStage` vs `session.stage`. |
| Physics view state | Authoritative `physicsState` plus optional `sceneData.reviewPhysics` while revisiting. Return discards preview. |
| Back / revisit | **Review/revisit.** Evidence, drafts, and furthest stage stay. Return CTA restores progress view. |
| Help system | Bounded help intents filtered by stage/substep. No generic TutorPanel in this Scene (pilot). |
| Tutor system | Intentionally not rendered until bindable to stage + substep + visible affordance. `useTutor` remains for 01–06. |
| Feedback style | `failureKind` → missing / inconsistent / think_again. Candidate only. |
| Task framing | `LENS_TASK_FRAMES` context / focus / action plus StageHeader prompt. Candidate only. |
| Experiment subflow | ①预测 ②做了什么 ③看见 ④对照 ⑤想法. Process chrome is Scene-owned. |
| MODEL subflow | Seven-step ray construction; one L4 evaluator on final submit. |
| Cognitive trace | Events; help state in `sceneData`; no first-class process trace type. |
| Known risks | Candidates are optics-flavored. Must not be renamed `Universal*`. Help hidden while revisiting. Still one large Lab. |

---

## 3. Repeated patterns

### 3.1 Genuinely reusable runtime behavior

These repeat as **behavior**, not as a shared type:

1. Authoritative progress vs what the student is looking at.  
2. Uncommitted draft vs committed evidence.  
3. “I clicked; what happened?” (advance / missing / rejected / loading / error).  
4. Blocked action needs a student-visible reason (UI-05).  
5. Help that must not perform the target cognitive action (UPLP).  
6. AI_OFF / COMPLETE must remove help and Tutor (UI-13 / UI-14).  
7. Refresh should resume a meaningful draft.  
8. Unrelated session writes must not wipe drafts.  
9. Navigation that looks like review must not destroy furthest progress.  
10. A stage may have substeps; the student should see only the current step’s capabilities.

These belong to a **Learner Interaction Runtime** if extracted later. They do not belong to Scene DSL.

### 3.2 Reusable presentation primitives (already frozen)

Owned by `architecture/interaction-shell-contract.md`:

| Primitive | Status | Must not become |
|---|---|---|
| `ChecklistObserveTask` | Proven shell (03/04/05) | Universal OBSERVE |
| `OutcomePredictTask` | Proven shell (03/04/05) | Universal PREDICT |
| `QuestionGroup` | Proven atom | Stage shell |
| `LearningShell` | Shared chrome | Domain owner |
| `ValidationMessage` | Shared chrome | Evaluator |
| `LookbackCompleteView` | Conditional | Universal COMPLETE |

Do not harvest more shells because Labs look similar.

### 3.3 Scene-specific / domain behavior

Must stay in Scene / Physics Model / Evidence modules:

- official physics and `physicsState`
- MODEL grammar (chain / cases / ratio / heat identities / UIR / rays)
- Transfer target semantics and `transferMode`
- AI_OFF pre-commit and post-check rules
- evaluator predicates and L-level derivation
- PRI labels, units, arrows
- experiment physical interventions
- misconception IDs and leak tables

### 3.4 Accidental duplication

Not a license to extract yet:

- Seven `XxxLab.tsx` files that each wire stage → task → tutor → footer
- Nearly identical `goBack` that mutates `session.stage` in Scene 01–06
- Parallel `*-hint-ladder.ts` + `TutorPanel` on 02–06
- `useEffect([session])` rehydrate that treats any `sceneData` write as “reload the form”
- `studentUiFeedback` collapsing every rejected construction to “incorrect”
- Repeated exam-world step chrome with Scene-owned pattern IDs inside the task (acceptable duplication; not a UniversalExam)

---

## 4. Current architectural defects

### 4.1 Progress and navigation conflation

Scene 01–06 `goBack` assigns `session.stage = previousStage` and appends `stage_entered`.

That makes “look again” indistinguishable from “the student is officially in an earlier stage.” Completion, Tutor stage context, and furthest-progress chrome can all lie.

Scene 07 is the only production counterexample: `viewingStage` + discardable `reviewPhysics`.

### 4.2 Local React state vs persisted draft dual truth

Typical 01–06 Lab:

```text
keydown / checkbox
  → useState
  → (sometimes) sceneData draft
  → any session update
  → useEffect([session])
  → useState overwritten from last committed evidence
```

Tutor, hint-ladder, demo flags, and help all update `session`. The student loses uncommitted work. Scene 07 patched this locally with a hydrate key; that patch is a **candidate policy**, not a proven runtime.

### 4.3 Help / Tutor duplication

| Scene | Learner-facing help entries |
|---|---|
| 01 | TutorPanel |
| 02–06 | hint-ladder **and** TutorPanel |
| 07 | LensHelpPanel only (Tutor hidden by Scene policy) |

Student UI contract (UI-07) wants one understandable Tutor affordance. Production often shows two. Neither is bound to “what control is on screen now.”

### 4.4 Help not bound to visible affordance / substep

Hint-ladders are **stage-level**. MODEL boards still show “给我一个台阶” when the current case/ray/identity is not the thing the hint talks about.

Scene 07 `availableLensHelpIntents(stage, constructionStep)` is the first production bound. It is still Scene-owned and must not be copied as `availableUniversalHelp`.

### 4.5 Silent no-op controls

Historical Scene 07 defect: revisit showed enabled screen/object controls that no-op’d on `physicsState`. Fixed locally with review preview.

Scene 01–06 do not have that exact bug, but regressing back can show experiment/model controls that rewrite **authoritative** physics while the student thinks they are reviewing. That is the inverse silent-harm: the control works, but it is the wrong world.

### 4.6 `failureKind` not mapped consistently

Evaluators already emit `failureKinds`. Learner UI usually maps:

```text
missing labels → missing
everything else → incorrect
```

Scene 07 adds `inconsistent` / `think_again` without revealing the official choice. That mapping is a candidate **feedback lifecycle**, not an evaluator change.

### 4.7 Stage UI not reflecting cognitive process

Most stages are “prompt + form + submit.” Experiment in Scene 02/07 makes the process visible (predict → do → see → compare → think). MODEL in Scene 07 discloses construction steps. Other MODEL UIs are one board. Transfer often jumps to structure fields before the new situation is established (Scene 07 added “先看这个新情境”).

### 4.8 Large XxxLab orchestration

Each Lab is a stage switch plus draft hydrate plus physics bind plus tutor plus exam/AI_OFF. The repeated part is **interaction orchestration**, not physics. Extracting it too early would pull MODEL/Transfer/AI_OFF into a fake universal renderer.

---

## 5. Non-goals

This audit and any later runtime **must not**:

- migrate Physics Truth or official calculations
- migrate evaluators or `deriveModelEvidenceLevel`
- migrate L4 / L5 / L6 meanings
- generalize MODEL grammar
- generalize Transfer semantics or `transferMode`
- generalize AI_OFF evidence / post-check rules
- widen Scene DSL or treat repeated chrome as schema growth
- put `sceneId` / `modelId` switches inside a generic runtime
- mass-migrate Scene 01–06 because Scene 07 has nicer UX
- rename `Lens*` → `Universal*`
- claim learner validation
- change `metadata.status`

---

## 6. Migration order (proposal)

1. **Scene 07 reference implementation** of the runtime contract, Scene-local files, no `Lens*` rename to universal.  
2. **Scene 03 fit test** — force/motion case board + proven Observe/Predict shells.  
3. **Scene 06 fit test** — quantitative electrical relation + PRI surface.  
4. **Runtime v1 freeze** only if 07/03/06 share behavior without domain branches.  
5. Then consider 04 / 05 / 02 / 01, each by fit, never by bulk.

Why 07 / 03 / 06 are enough difference:

| Scene | Interaction family | Why it stresses the runtime |
|---|---|---|
| 07 | Spatial optics construction | Substeps, review preview physics, help-by-affordance |
| 03 | Causal force/motion cases | Proven shells + case-board MODEL; must not absorb case grammar |
| 06 | Quantitative electrical relation | PRI-bearing numbers; runtime must not own identities or formula truth |

Scene 02 is a later fit (energy chain). Scene 01 is compatibility, not the template. Scene 04/05 are closer to 03/06 and should not be used as the first generalization sample.

---

## 7. Freeze relationship

Interaction Shell Contract remains `SUFFICIENT_EVIDENCE_TO_FREEZE`.

This audit does **not** unfreeze shell extraction.

```text
Interaction Shell
  = reusable presentation primitive
Learner Interaction Runtime
  = how progress / draft / view / review / help / feedback / navigation behave
```

A runtime may *use* a frozen shell. It must not become a new shell harvest.
