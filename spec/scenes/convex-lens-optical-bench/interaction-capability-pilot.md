# Scene 07 Interaction Capability Pilot

> Date: 2026-09-13  
> Scene id: `convex-lens-optical-bench`  
> Primary model: `convex-lens-imaging` (reviewed / prototype — **not** learner-validated)  
> Kind: Scene-local pilot artifact. **CANDIDATE — not a project standard.**  
> Not an architecture owner. Does not change UPLP, Physics Truth, evaluators, L3/L4, Scene DSL, or Interaction Shell.

This file answers: given fixed UPLP stage semantics and the reviewed Scene 07 Physics Model, can the frontend be built from explicit learner interaction capabilities rather than ad-hoc page composition?

**Pilot answer:** Yes for Scene 07, if capabilities stay Scene-local, renderers stay implementation, and Scene actions remain the only Physics / Evidence / Progress owners. One Scene is not enough evidence to promote a universal capability standard.

```text
UPLP + reviewed Physics Model + Evidence Design
  → stage cognitive task
  → allowed interaction capabilities
  → concrete components
  → semantic learner actions
  → Scene action / physics / evaluator
  → learner-visible response
  → evidence / progression
```

---

## 1. Terminology

| Term | Meaning here |
|---|---|
| Capability | Learner action the current cognitive task allows. Not a React name. |
| Semantic action | Domain-valued event (`ObjectStation`, screen at/off image plane, ray draft). Not pixels. |
| Renderer | DOM / SVG implementation mechanism. |
| Interaction trace | Process history. **Not Evidence.** Must not assign L-levels or advance Progress. |
| CANDIDATE | May later be reusable. Not a standard. |

Do not encode `ConvexLensOpticalBench` or `LensRayConstruction` into Physics Model semantics.

---

## 2. Renderer / technology decisions

No new npm dependency. Convex-lens imaging is a **2D discrete geometrical model**. 3D is not required.

| Capability | Chosen technology | Alternatives | Why | Gesture → semantic | Physics Truth | Test | A11y / fallback | Limits |
|---|---|---|---|---|---|---|---|---|
| move-object / choose-object-station | SVG hit targets on station bands (bench units) + DOM cycle button | Canvas drag; Three.js; free pixel drag | Discrete stations are the model; SVG stays inspectable and testable | pointer on object-side band → `ObjectStation` | `officialImagingState(station)` in physics-boundary | adapter unit + bench testids | cycle button + keyboard radios in MODEL | No continuous u; Grade-9 stations only |
| move-screen | DOM toggle + optional SVG screen click | Continuous screen drag | Physics is `screenAtImagePlane` boolean. Continuous x would imply the image follows the screen | click → `{ atImagePlane: boolean }` | `officialScreenReceive` | Lab + physics tests | existing button | Two states only |
| inspect-screen-result | SVG redraw from official display | Canvas | Same bench, no second engine | none (look) | official display | PRI attrs | `role="img"` | Official image off in MODEL |
| construct-required-ray | DOM structured pickers + SVG student-ray overlay | Canvas path editor; click-draw free rays | Canonical ray is kind/before/after/incident, not a free polyline | picker change → `CanonicalRayChoice` draft | evaluator on submit only | MODEL tests | radios / labels | Not a free-hand ray tracer |
| All authored / classify / commit | React DOM | — | Forms are enough | click / type → draft or Scene action | unchanged evaluators | existing | native controls | — |

**Three.js:** not used. The cognitive task is station-relative 2D geometry, not spatial 3D manipulation.

**Canvas:** not used. Station count is five; SVG hit testing is enough.

**Ownership:**

```text
deterministic Scene / physics state
  → officialBenchDisplay (geometry in bench units)
  → SVG pixels (render only)

pointer
  → bench units
  → semantic ObjectStation / screen flag
  → Scene action
  → physics module
  → render
```

Forbidden: `objectX = 341px` therefore case = `between-f-and-2f` inside the SVG.

---

## 3. Trace storage choice

Reuse existing `session.events` (`LearningEvent`).

- New process events: `type: "student_response"` + `metadata.kind === "lens-interaction"`.
- Existing `experiment_run`, `prediction_made`, `model_submitted`, `transfer_attempted`, `exam_answered` remain and are **also** readable as process traces.
- Do **not** create a second evidence engine.
- Do **not** add a project-wide event type for this pilot.
- Trace write must not call `advanceIfReady`, must not write Evidence arrays, must not change official imaging rules.

Reader: `lib/learning/lens-interaction-trace.ts` (`lensInteractionTraces`).  
Display: “刚才动过什么” in `LensCognitiveTrace`, labeled as process, not mastery.

---

## 4. Physical surface review

| Question | Current | Pilot change |
|---|---|---|
| A. Object movement | Cycle button only; station vs F/2F not directly choosable | SVG object-side station hits map to canonical stations; cycle remains fallback |
| B. Screen movement | Discrete on/off image plane | Keep discrete. Do not drag screen through pixels. Official image must not follow the screen (existing physics) |
| C. Ray construction | Structured pickers; student rays drawn after assembly | Keep pickers. Color student rays as learner-owned. Official rays stay hidden |
| D. MODEL disclosure | Seven steps | Unchanged grammar; step 1 may use bench station hits as the same capability |
| E. Pointer / touch | Buttons work | Large SVG bands + buttons |
| F. Visual clarity | Student rays same ink as apparatus | Distinct learner-ray stroke + “你装的光线” |

Do not add manipulation on DESCRIBE / PREDICT / EXPLAIN / TRANSFER / EXAM / AI_OFF.

---

## 5. Capability map (every stage / MODEL substep)

Legend: **Auth** = Scene action / evaluator / progression owner.

### ENTRY

| Field | Value |
|---|---|
| Cognitive objective | Start the phenomenon, not the imaging table |
| Student question | 要不要先看这个光具座？ |
| Response shape | start the lesson |
| Visible references | none |
| Capabilities | `start-lesson` |
| Semantic actions | `{ kind: "start-lesson" }` |
| Components | landing copy + footer CTA |
| Renderer | DOM |
| Action trace | none required |
| Auth | `startLesson` → OBSERVE |
| Protected | rays, table, MODEL editor |
| Why | Invitation only. A bench here would start MODEL too early |

### OBSERVE

| Field | Value |
|---|---|
| Cognitive objective | Manipulate, attend, record what was seen |
| Student question | 动过之后，你确实看见了什么？ |
| Response shape | select observed states |
| Visible references | object, lens, screen, F/2F, visible-image-state |
| Capabilities | `move-object`, `move-screen`, `inspect-screen-result`, `record-observation` |
| Semantic actions | `move-object { from, to }`; `move-screen { atImagePlane }`; `record-observation { optionIds }` |
| Components | `ConvexLensOpticalBench`, `LensObserveTask` |
| Renderer | SVG bench + DOM checklist |
| Action trace | station changed; screen moved; observation recorded |
| Auth | `applyLensObjectStation` / screen / demo + `applyLensObservationSave` → `evaluateLensObservation` |
| Protected | official rays, meeting marks, table |
| Why cycle is insufficient | Learner must choose a station **relative to F/2F**, not only “next” |
| Why not free drag | Would make pixel x into a hidden continuous-u engine |

### DESCRIBE

| Field | Value |
|---|---|
| Cognitive objective | Separate object, lens, F/2F, image, screen |
| Student question | 物体、透镜、F/2F、像和光屏是不是同一件东西？刚才动的是哪一样？ |
| Response shape | object + quantity set + change + own sentence |
| Visible references | same bench (look, not manipulate) |
| Capabilities | `identify-apparatus-elements`, `distinguish-image-from-screen`, `author-description` |
| Semantic actions | draft field changes; `submit-description` |
| Components | `LensDescribeTask` + frozen-looking bench (no station hits) |
| Renderer | DOM |
| Action trace | description recorded (existing) |
| Auth | `applyLensDescriptionSave` |
| Protected | rays, meeting language as the task |
| Why no SVG edit | Identification, not a new intervention |

### PREDICT

| Field | Value |
|---|---|
| Cognitive objective | Commit outcome + reason before intervention |
| Student question | 物体换位置以后，你预计会看见什么？ |
| Response shape | choose one predicted state + own-words reason |
| Visible references | bench situation being guessed |
| Capabilities | `select-predicted-outcome`, `author-prediction-reason`, `commit-prediction` |
| Semantic actions | `commit-prediction { experimentId, outcome, reason }` |
| Components | `LensPredictTask` |
| Renderer | DOM |
| Action trace | `prediction_made` |
| Auth | `applyLensPredictionCommit` |
| Protected | official outcome |

### EXPERIMENT

| Field | Value |
|---|---|
| Cognitive objective | Five-part loop against locked prediction |
| Student question | 这一次改了什么？看见的和刚才猜的一样吗？ |
| Response shape | do → observed pair → comparison → reflection |
| Visible references | bench + committed prediction |
| Capabilities | bounded `move-object` or `cover-lens`, then `record-observed-result`, `compare-with-prediction`, `author-reflection` |
| Semantic actions | learner intervention → Scene validates → official after-state |
| Components | `LensExperimentTask` + bench station hits or cover button (+ predict on later trials) |
| Renderer | DOM; SVG only redraws after Scene physics |
| Action trace | prepare-trial / move-object / cover-lens / experiment_run; observed / comparison / reflection committed. Trace ≠ Evidence |
| Auth | `applyLensTrialIntervention` → existing after-state + evidence write; observed / comparison / reflection applies |
| Protected | free station jumping that bypasses the locked trial; auto-run without learner manipulation |
| Why bounded hits | Official trial still has one required change. Hits are the learner action; `runExperiment()` is not the student click |

### EXPLAIN

| Field | Value |
|---|---|
| Cognitive objective | L3 fragment account of already-seen screen results |
| Student question | 该用真正相交、反向延长，还是有限远处不相交来说明那些光屏结果？ |
| Response shape | meeting fragment + screen/image fragment + own words |
| Visible references | bench memory; rays textual only |
| Capabilities | `classify-meeting-fragment`, `classify-screen-image-consequence`, `author-explanation` |
| Semantic actions | `submit-explanation` |
| Components | `LensExplainTask` |
| Renderer | DOM |
| Action trace | explanation recorded |
| Auth | `applyLensExplanationSave` |
| Protected | official rays, ray editor, finished diagram |
| Why no construct-ray | Decision A: L3 ≠ L4. Construction is MODEL |

### MODEL 1 — station

| Field | Value |
|---|---|
| Cognitive objective | Choose object station relative to F/2F |
| Student question | 物体相对 F / 2F 在哪里？ |
| Response shape | choose one station |
| Visible references | bench marks; official image off |
| Capabilities | `choose-object-station` |
| Semantic actions | `{ kind: "choose-object-station", station }` (draft only) |
| Components | `LensRayConstruction` radios + SVG station hits |
| Renderer | DOM + SVG |
| Action trace | station chosen (draft) |
| Auth | draft write; evaluator only on final submit |
| Protected | official image overlay, official rays |

### MODEL 2 / 3 — rays

| Field | Value |
|---|---|
| Cognitive objective | Construct two required learner rays |
| Student question | 这一条必做光线到达透镜前、过透镜后怎么走？ |
| Response shape | construct one (then a second) canonical ray |
| Visible references | ray editor; constructed ray after complete |
| Capabilities | `construct-required-ray`, `revise-constructed-ray` |
| Semantic actions | `{ kind: "construct-ray", slot, ray }` |
| Components | ray pickers + SVG `StudentRay` |
| Renderer | DOM + SVG overlay |
| Action trace | ray constructed / revised |
| Auth | draft; `buildLensModelAttempt` on submit |
| Protected | official rays, finished diagram |
| Why not click-draw | Canonical ray is typed, not a free polyline |

### MODEL 4 — meeting

| Field | Value |
|---|---|
| Cognitive objective | Name how the learner’s two rays meet |
| Student question | 这两条你装的光线是真正相交、反向延长，还是有限远处不相交？ |
| Response shape | choose one meeting mode |
| Capabilities | `classify-meeting-mode` |
| Auth | draft until submit |
| Protected | official meeting mark |

### MODEL 5 — image

| Field | Value |
|---|---|
| Cognitive objective | Image consequence of that meeting |
| Student question | 这样相遇以后，像在哪一侧、是什么性质、屏能不能接到？ |
| Response shape | side / nature / orientation / size / receivable |
| Capabilities | `classify-image-consequence` |
| Auth | draft until submit |
| Protected | official image drawn on the bench |

### MODEL 6 — bind

| Field | Value |
|---|---|
| Cognitive objective | Authored meeting→image bind |
| Student question | 为什么这种会聚方式会带来这样的像？ |
| Response shape | own sentence (not table slogan) |
| Capabilities | `author-model-bind` |
| Auth | draft until submit |

### MODEL 7 — submit

| Field | Value |
|---|---|
| Cognitive objective | Submit one constructed relation |
| Student question | 这一条自己装的关系能不能交出去？ |
| Response shape | submit |
| Capabilities | `submit-model` |
| Semantic actions | `{ kind: "submit-model", draft }` |
| Auth | `applyLensModelSubmit` → `buildLensModelAttempt` |
| Rule | complete labels ≠ accepted. Complete-but-wrong → `rejected` |

### TRANSFER

| Field | Value |
|---|---|
| Cognitive objective | Same meeting→image on a new surface |
| Student question | 这个新情境里，物体相对焦点在哪里？会聚和像怎样跟着变？ |
| Response shape | station + meeting + image + own words |
| Visible references | textual new-situation only |
| Capabilities | `inspect-new-situation`, `classify-transfer-structure`, `author-transfer-reason`, `submit-transfer` |
| Components | `LensTransferTask` |
| Renderer | DOM |
| Auth | `applyLensTransferSubmit` |
| Protected | bench copy of last construction; “都有凸透镜” as success |
| Why no SVG bench | Would invite copying the last drawing |

### EXAM

| Field | Value |
|---|---|
| Cognitive objective | Exam World sequencing |
| Student question | 这题在考哪一段成像关系？你选哪一个答案？ |
| Response shape | representation → model → choice + reason |
| Capabilities | `inspect-stem`, `identify-representation`, `identify-model-relation`, `select-answer`, `author-reason`, `submit-exam` |
| Renderer | DOM |
| Auth | step continue = draft; submit = `applyLensExamSubmit` |
| Protected | options before reveal |

### AI_OFF

| Field | Value |
|---|---|
| Cognitive objective | Independent judgment, zero help |
| Student question | 没有提示时，这一题的物距和会聚该怎么判断？ |
| Capabilities | `independent-classify`, `independent-author`, `commit-independent-response`, `post-check` |
| Renderer | DOM |
| Auth | `applyLensAiOffCommit` / `applyLensAiOffPostCheckSave` |
| Protected | any help / Tutor |

### COMPLETE

| Field | Value |
|---|---|
| Cognitive objective | Look back at learner-owned traces. No mastery |
| Capabilities | none (start-over is chrome) |
| Visible | evidence summaries + process traces |
| Auth | terminal |

---

## 6. Scene07-specific vs CANDIDATE reusable

**Scene07-specific:** `construct-required-ray` (canonical convex-lens rays), station bands vs F/2F, `classify-meeting-mode`, optical-bench screen receive.

**CANDIDATE only (do not promote):** discrete manipulate → inspect → record; commit-before-intervention; construct-then-submit with evaluator-owned acceptance; process trace ≠ Evidence; SVG as 2D geometry renderer; gesture → domain value → Scene action.

**Not extracted:** no `UniversalInteractionCapability`, no `UniversalPhysicsRenderer`, no `UniversalGestureAdapter`.

---

## 7. Stop line

This pilot does not change Physics Model semantics, evaluators, L3/L4, UPLP, transfer, AI_OFF evidence, or official imaging rows.
