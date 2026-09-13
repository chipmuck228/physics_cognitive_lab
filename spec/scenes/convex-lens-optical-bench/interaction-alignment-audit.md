# Scene 07 — Interaction Alignment Audit

> Date: 2026-09-13  
> Scene: `convex-lens-optical-bench`  
> Model: `convex-lens-imaging`  
> Kind: Scene07-local audit. **Not** an architecture owner.  
> Implementation source of truth: current repo code (not specs alone).  
> Does **not** claim learner validation.

Contract: [`../../interaction-alignment-audit.md`](../../interaction-alignment-audit.md)

```text
INTERACTION_ALIGNMENT_PASS
```

Repair re-audit 2026-09-13: IA-07-01 / 02 / 03 / 04 / 05 are PASS. IA-07-04 is the Scene07-local Step 6 semantic-parse pilot. IA-07-05 is the TRANSFER authored-explanation repair. Not a universal Transfer or semantic engine.

---

## Scope and method

Audited the implemented path:

ENTRY → OBSERVE → DESCRIBE → PREDICT → EXPERIMENT (4 trials) → EXPLAIN → MODEL (7 steps + repair) → TRANSFER → EXAM → AI_OFF → COMPLETE

Audit units are the smallest implemented cognitive subtasks, not UPLP stages.

Known prior defects checked against **current** code:

| Known example | Current status |
|---|---|
| A. Partial lens cover invisible | **Fixed.** `lensPartiallyCovered` → `lens-partial-cover` on the lens |
| B. Experiment auto-run | **Fixed.** No learner `runExperiment` button; intervention is station-hit or cover |
| C. MODEL completeness-only local steps | **Mostly fixed.** Steps 2–4 semantic. Steps 5–6 leave official-size / authored-vs-meetingMode to the final evaluator (allowed cross-step leftover + repair) |
| D. Rejected MODEL with no repair path | **Fixed.** Visible failure + `回到第 N 步修改` |

---

## Confirmed Alignment Defects

None open after the 2026-09-13 OBSERVE / TRANSFER / MODEL Step 6 / TRANSFER authored-explanation repairs.

### IA-07-01 — repaired PASS

| Field | Result |
|---|---|
| ID | IA-07-01 |
| Severity | **P1** |
| Stage | OBSERVE |
| Audit Unit | Submit observation |
| Invariant | **IA-6** (also drives DESCRIBE frame mismatch) |
| Current status | **PASS (repaired).** Bench interaction (demo / station / screen) sets `watchedObserveDemo`. Eligibility = interaction + record. Checkbox-only cannot accept OBSERVE or set L1. |
| Expected behavior | L1 “noticed the bench changed” requires an attributable bench action, then a record of what was seen. Evidence Claim Design lists “watching only” as an invalid L1 shortcut. Scene07 repair spec also said submit should block without required seen changes. |
| Implementation evidence | `evaluateLensObservationEligibility` + `hasSufficientLensObservation` (`sufficient` ∧ `watchedFullCycle`). Working OBSERVE demo / station / screen set `watchedObserveDemo`. `applyLensObservationSave` accepts only when both are true. L1 still also needs DESCRIBE. Frame action: “先换物体位置或移动光屏…再勾你看见的。” |
| Learner consequence | Cannot skip the intended observe action. DESCRIBE frame is now true. Interaction trace alone still does not set L1. |
| Repair boundary used | Scene07 OBSERVE gate only. Reused `watchedObserveDemo`. No universal observe engine. L1 meaning unchanged. |

### IA-07-02 — repaired PASS

| Field | Result |
|---|---|
| ID | IA-07-02 |
| Severity | **P2** |
| Stage | OBSERVE |
| Audit Unit | Submit observation (missing checkboxes) |
| Invariant | **IA-5** |
| Current status | **PASS (repaired).** Missing interaction → `observeNeedInteraction`. Missing record after interaction → `observeNeedRecord`. |
| Expected behavior | Blocked reason names the real missing action (what still needs to be ticked), or the gate and the message stay the same. |
| Implementation evidence | `lensObserveMissingMessage(missingKind)` from `evaluateLensObservationEligibility`. `LensObserveTask` `lens-observe-need-more`. |
| Learner consequence | Interaction-missing and record-missing reasons are now separate. No silent no-op. |
| Repair boundary used | Scene07 OBSERVE missing-reason only. |

### IA-07-03 — repaired PASS

| Field | Result |
|---|---|
| ID | IA-07-03 |
| Severity | **P2** |
| Stage | TRANSFER |
| Audit Unit | Submit transfer (required pair) |
| Invariant | **IA-4** |
| Current status | **PASS (repaired).** `lens-transfer-progress` shows `第 N / 2 个新情境`. After the first accept, `transferFirstSaved` plus 2 / 2. |
| Expected behavior | Learner can see how many transfer targets remain. |
| Implementation evidence | `lensTransferProgress` + `lensTransferProgressLabel`. `LensTransferTask` `data-testid="lens-transfer-progress"`. E2E helpers assert 1/2 then 2/2. L5 evaluator unchanged. |
| Learner consequence | Learner can see which target they are on and that two are required. |
| Repair boundary used | Scene07 TRANSFER chrome only. Transfer targets / evaluator unchanged. |

### IA-07-04 — repaired PASS

| Field | Result |
|---|---|
| ID | IA-07-04 |
| Severity | **P1** |
| Stage | MODEL |
| Audit Unit | Step 6 authored causal relation |
| Invariant | **IA-3**, **IA-5**, **IA-6** |
| Current status | **PASS (pilot).** Task → authored sentence → local fast-path or LLM semantic parse → normalized claim → deterministic validator → visible reason → Next → same parse on final MODEL submit. LLM is not authoritative. Failure is recoverable and does not fabricate evidence. |
| Expected behavior | Step 6 extracts what the learner claims, then deterministic code decides ready / missing / inconsistent against the draft and Physics Truth. Natural Grade-9 paraphrases work. |
| Implementation evidence | Learner sentence maps on the deterministic fast path to actual-convergence + real + bind. `碰到一起` uses mocked LLM parse then the same validator. `evaluateLensAuthoredSemanticClaim` is the local/final owner. Parse provenance is `system-derived`. |
| Learner consequence | Equivalent meeting language is not rejected as “先写出真正相交”. Parser failure shows “这句话我还没判断清楚…”, not a false PASS. |
| Repair boundary used | Scene07-local semantic parse pilot only. No universal judge. Physics Truth / L4 / seven-step structure unchanged. |

### IA-07-05 — repaired PASS

| Field | Result |
|---|---|
| ID | IA-07-05 |
| Severity | **P1** |
| Stage | TRANSFER |
| Audit Unit | Authored explanation after structured model construction |
| Invariant | **IA-1**, **IA-3**, **IA-5**, **IA-6** |
| Current status | **PASS (repaired).** Structured radios own station / meeting / image. The textarea asks only “光线怎样相遇，为什么会得到这样的像？”. One submit shows one primary repair. Incomplete fields are not called “wrong”. `studentExplanation` stays learner-authored. |
| Expected behavior | Authored language measures the meeting→image bind. Feedback names the next repair. Surface checkbox does not rewrite the sentence. Completing TRANSFER still does not write L5 without valid MODEL + both targets. |
| Implementation evidence | `LENS_COPY.transferOwnWords`; `lens-transfer-recap` mirrors draft labels; `lensTransferRepairFeedback` first-match priority; `LensTransferTask` `lens-transfer-repair` is the only fail surface; action chrome hidden on TRANSFER missing/rejected; `draftToLensTransferAttempt` no longer appends `都有凸透镜`. `evaluateConvexLensTransfer` acceptance unchanged. |
| Learner consequence | After correct radios, a restatement is repaired as missing consequence/bind, not as “先选出物距站点”. One orange block. Recap shows the learner’s current choices, including wrong ones. |
| Repair boundary used | Scene07 TRANSFER copy, recap, feedback ownership, and adapter provenance only. No LLM. No evaluator / L5 / pair-semantics change. |

---

## Audit matrix

IA-3 on MODEL step 5: official image **size** vs station remains a **cross-step** leftover. Local step 5 claims meeting-compatible image (size vs official not in that claim). The IA contract allows the final evaluator to reject that. Repair path exists. **Not** logged as IA-3 FAIL.

IA-07-04: Step 6 now uses one normalized claim (`evaluateLensAuthoredSemanticClaim`) for Next and final submit. The LLM may only emit a parse. Fast-path sufficient sentences never call the LLM.

### 1. ENTRY / start lesson

| Field | Result |
|---|---|
| Stage / Subtask | ENTRY / start lesson |
| Cognitive task | Decide to look at the bench, not the five-case table |
| Required capability | start-lesson |
| Visible control / surface | “开始观察” |
| Semantic learner action | `startLesson` → `advanceLensLoop` |
| Authoritative owner | `advanceIfReady` / ENTRY always leavable |
| Expected state consequence | `stage = OBSERVE` |
| Expected visible consequence | OBSERVE frame + bench + observe task |
| Blocked condition + visible reason | None |
| Progression condition | Click start |
| Evidence input / provenance | `stage_entered` event. Not L-level evidence |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | N/A |
| IA-4 | PASS |
| IA-5 | N/A |
| IA-6 | PASS |

### 2. OBSERVE / manipulate bench

| Field | Result |
|---|---|
| Stage / Subtask | OBSERVE / manipulate |
| Cognitive task | Change object station or screen; see a physical change |
| Required capability | move-object, move-screen, play-demo |
| Visible control / surface | station hits; `lens-play-demo`; `lens-move-screen` |
| Semantic learner action | `applyLensObjectStationChange` / `applyLensScreenChange` / `applyLensObserveDemoCycle` |
| Authoritative owner | Scene lens-action + deterministic physics |
| Expected state consequence | `physicsState` / `watchedObserveDemo` |
| Expected visible consequence | Bench attrs / object / screen change; response class `applied` |
| Blocked condition + visible reason | Wrong stage: “现在不能换物体位置 / 移光屏” |
| Progression condition | **Not required** to leave OBSERVE (see unit 3) |
| Evidence input / provenance | Interaction trace only. Trace ≠ Evidence |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | N/A |
| IA-4 | PASS |
| IA-5 | PASS |
| IA-6 | N/A |

### 3. OBSERVE / submit observation

| Field | Result |
|---|---|
| Stage / Subtask | OBSERVE / submit observation |
| Cognitive task | Record what was actually seen after a change |
| Required capability | select observation fragments + commit |
| Visible control / surface | checkboxes + “提交观察” |
| Semantic learner action | `saveObservation` → `applyLensObservationSave` |
| Authoritative owner | `evaluateLensObservationEligibility` (interaction + record) |
| Expected state consequence | `observations[]`; advance if both flags |
| Expected visible consequence | DESCRIBE, or the matching missing reason |
| Blocked condition + visible reason | No bench action → `observeNeedInteraction`. Incomplete checkboxes after action → `observeNeedRecord` |
| Progression condition | `watchedObserveDemo` (demo / station / screen) ∧ required record IDs |
| Evidence input / provenance | `sufficient` only when `watchedFullCycle` and record complete. L1 still also needs DESCRIBE |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | N/A |
| IA-4 | PASS |
| IA-5 | PASS |
| IA-6 | PASS |

### 4. DESCRIBE / construct + commit

| Field | Result |
|---|---|
| Stage / Subtask | DESCRIBE / commit description |
| Cognitive task | Separate object, F/2F, image, screen in own words |
| Required capability | author-description |
| Visible control / surface | 3 radios + textarea + “记下我的说法”; bench visible, hits off |
| Semantic learner action | `applyLensDescriptionSave` |
| Authoritative owner | `evaluateLensDescription` |
| Expected state consequence | `descriptions[]`; PREDICT if sufficient |
| Expected visible consequence | PREDICT task |
| Blocked condition + visible reason | Missing structure / own words → `describeNeedStructure` |
| Progression condition | `evaluateLensDescription.sufficient` |
| Evidence input / provenance | `DescriptionEvidence` → L2 `identifiedQuantities` |
| IA-1 | PASS |
| IA-2 | PASS (bench still visible to point at) |
| IA-3 | N/A |
| IA-4 | PASS |
| IA-5 | PASS |
| IA-6 | PASS |

DESCRIBE frame “你刚在光具座上动过物体或光屏” is now guaranteed by the OBSERVE gate.

### 5. PREDICT / lock prediction

| Field | Result |
|---|---|
| Stage / Subtask | PREDICT (trial 1) and EXPERIMENT trials 2–4 / lock prediction |
| Cognitive task | Commit an expected screen/image outcome before intervening |
| Required capability | commit-prediction |
| Visible control / surface | `lens-predict-task` radios + reason + “锁定预测” |
| Semantic learner action | `applyLensPredictionCommit` |
| Authoritative owner | Scene prediction commit |
| Expected state consequence | `predictions[].committed`; trial 1 also `prepareLensTrialStart` + EXPERIMENT |
| Expected visible consequence | Locked fieldset; station hits / cover hidden until lock (trials 2–4) |
| Blocked condition + visible reason | Missing outcome/reason; prior trial not closed |
| Progression condition | Committed prediction for the active experiment id |
| Evidence input / provenance | `prediction_made` event. Not L4 |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | N/A |
| IA-4 | PASS (`先锁定这一次的预测…`) |
| IA-5 | PASS |
| IA-6 | PASS |

### 6. EXPERIMENT / move-object intervention (trials 1–3)

| Field | Result |
|---|---|
| Stage / Subtask | EXPERIMENT / perform required move |
| Cognitive task | Perform the trial’s object-station change (not auto-run) |
| Required capability | move-object to the required station |
| Visible control / surface | `station-hit-*` after lock; `lens-intervention-prompt` |
| Semantic learner action | `setObjectStation` → `applyLensTrialIntervention` |
| Authoritative owner | Trial spec + `prepareLensExperimentState` (via internal `applyLensRunExperiment` **after** learner action) |
| Expected state consequence | Official after-state; `experimentEvidence.interventionAt` |
| Expected visible consequence | Object/image/screen update; “已经在光具座上完成这次改变” |
| Blocked condition + visible reason | Wrong station → `wrongActionReason` (visible) |
| Progression condition | Prediction locked; required station |
| Evidence input / provenance | `ExperimentEvidence` + `experiment_run`. Not closed until reflection |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | N/A |
| IA-4 | PASS (`第 N / 4 次验证`) |
| IA-5 | PASS |
| IA-6 | PASS |

### 7. EXPERIMENT / cover-lens intervention (trial 4)

| Field | Result |
|---|---|
| Stage / Subtask | EXPERIMENT / cover part of the lens |
| Cognitive task | Cover part of the convex lens; see whole image, usually dimmer |
| Required capability | cover-lens |
| Visible control / surface | `lens-cover-lens` (“遮住透镜一部分”). Station hits off |
| Semantic learner action | `coverLens` → `applyLensCoverLens` → `applyLensTrialIntervention` |
| Authoritative owner | `prepareLensExperimentState(D)` → `lensPartiallyCovered: true` |
| Expected state consequence | Cover flag; brightness reduced; image complete |
| Expected visible consequence | `lens-partial-cover` on lens (`data-cover-on="lens"`), “遮挡”, `data-cover-brightness="reduced"`, optical image still complete |
| Blocked condition + visible reason | Move-object → “这次不要换物体位置，只要遮住透镜一部分。” |
| Progression condition | Cover action recorded |
| Evidence input / provenance | Same experiment evidence as other trials |
| IA-1 | PASS |
| IA-2 | PASS (known defect A closed) |
| IA-3 | N/A |
| IA-4 | PASS |
| IA-5 | PASS |
| IA-6 | PASS |

### 8. EXPERIMENT / record observation

| Field | Result |
|---|---|
| Stage / Subtask | EXPERIMENT / record observed result |
| Cognitive task | Name the actual screen / image result after the intervention |
| Required capability | record-observation |
| Visible control / surface | Observed radios + “记下我看见的结果” only if intervention done |
| Semantic learner action | `applyLensObservedSave` |
| Authoritative owner | Scene experiment evidence patch |
| Expected state consequence | `observedResult` on active evidence |
| Expected visible consequence | Compare surface unlocks |
| Blocked condition + visible reason | No intervention → form hidden + `observeNeedIntervention`; incomplete fields → missing |
| Progression condition | Intervention record exists + both observed fields |
| Evidence input / provenance | Requires prior intervention. Cannot save observe-only |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | PASS |
| IA-4 | PASS |
| IA-5 | PASS |
| IA-6 | PASS |

### 9. EXPERIMENT / compare

| Field | Result |
|---|---|
| Stage / Subtask | EXPERIMENT / compare prediction vs observation |
| Cognitive task | Judge same / different / partial against the locked prediction |
| Required capability | save-comparison |
| Visible control / surface | `lens-compare-surface` |
| Semantic learner action | `applyLensComparisonSave` |
| Authoritative owner | Scene experiment evidence |
| Expected state consequence | `comparison` stored |
| Expected visible consequence | Reflection unlocks |
| Blocked condition + visible reason | Empty → missing; UI hidden until observed saved |
| Progression condition | Comparison selected |
| Evidence input / provenance | Same trial evidence; not L4 |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | PASS |
| IA-4 | PASS |
| IA-5 | PASS |
| IA-6 | PASS |

### 10. EXPERIMENT / reflect

| Field | Result |
|---|---|
| Stage / Subtask | EXPERIMENT / reflect and close trial |
| Cognitive task | Author what this trial showed |
| Required capability | save-reflection |
| Visible control / surface | reflection textarea + “记下想法，完成本轮” |
| Semantic learner action | `applyLensReflectionSave` |
| Authoritative owner | `isLensExperimentClosed` / `sufficient` on evidence |
| Expected state consequence | Trial closed; after trial 4, EXPLAIN if adapter ready |
| Expected visible consequence | `lens-trial-complete` or EXPLAIN |
| Blocked condition + visible reason | Missing observed / compare / own words — not silent |
| Progression condition | Closed evidence for this experiment id |
| Evidence input / provenance | Closed experiment record. React reads `activeEvidence.sufficient`, does not re-grade |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | PASS |
| IA-4 | PASS |
| IA-5 | PASS |
| IA-6 | PASS |

### 11. EXPERIMENT / start next trial

| Field | Result |
|---|---|
| Stage / Subtask | EXPERIMENT / acknowledge next trial |
| Cognitive task | Leave the finished trial and start a new predict–act loop |
| Required capability | start-next-trial |
| Visible control / surface | `lens-start-next-trial` |
| Semantic learner action | `applyLensAcknowledgeNextTrial` |
| Authoritative owner | `lensTrialGate` |
| Expected state consequence | `awaitingNext: false`; next predict shown |
| Expected visible consequence | “第 N / 4”; predict-first; hits hidden until lock |
| Blocked condition + visible reason | No gate → “现在没有下一轮可以开始。” |
| Progression condition | Previous trial closed |
| Evidence input / provenance | Trace only |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | N/A |
| IA-4 | PASS |
| IA-5 | PASS |
| IA-6 | PASS |

### 12. EXPLAIN / commit fragment

| Field | Result |
|---|---|
| Stage / Subtask | EXPLAIN / meeting or screen fragment + own words |
| Cognitive task | Account for already-seen screen outcomes (L3 fragment, not full construction) |
| Required capability | submit-explanation |
| Visible control / surface | `LensExplainTask`; official rays hidden; bench visible |
| Semantic learner action | `applyLensExplanationSave` |
| Authoritative owner | `evaluateLensExplanation` |
| Expected state consequence | `explanations[]`; MODEL if sufficient |
| Expected visible consequence | MODEL step 1 |
| Blocked condition + visible reason | Slogan / missing bind → `explainNeedMore` |
| Progression condition | `(meetingOk \|\| screenOk)` ∧ meaningful authored ∧ not table-as-model |
| Evidence input / provenance | L3 `identifiedRelations`. Does not re-read experiment rows; stage gate already required 4 closed trials |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | PASS |
| IA-4 | PASS |
| IA-5 | PASS |
| IA-6 | PASS |

### 13. MODEL / select object station

| Field | Result |
|---|---|
| Stage / Subtask | MODEL step 1 |
| Cognitive task | Choose object station relative to F / 2F |
| Required capability | select-station |
| Visible control / surface | station radios + bench hits (step 1) |
| Semantic learner action | draft `objectStation` / `chooseModelStation` |
| Authoritative owner | `evaluateLensModelStep(..., 1)` completeness |
| Expected state consequence | Draft station |
| Expected visible consequence | Bench object follows draft station |
| Blocked condition + visible reason | Next disabled + “还需要先选出物体相对 F / 2F 在哪里。” |
| Progression condition | Station selected |
| Evidence input / provenance | Draft only until final submit |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | PASS (completeness matches this step’s claim) |
| IA-4 | PASS (`第 1 步 / 共 7 步`) |
| IA-5 | PASS |
| IA-6 | N/A |

### 14. MODEL / construct ray A

| Field | Result |
|---|---|
| Stage / Subtask | MODEL step 2 |
| Cognitive task | Fully specify one required ray, internally coherent |
| Required capability | construct-ray |
| Visible control / surface | `lens-ray-a` pickers; learner SVG via `projectLearnerRay` |
| Semantic learner action | draft `rayA` |
| Authoritative owner | `rayDraftComplete` + `isCanonicalRayGeometricallyCoherent` |
| Expected state consequence | Coherent ray A or blocked |
| Expected visible consequence | Learner segments; no official-ray correction |
| Blocked condition + visible reason | Missing fields or “名字…走法对不上” (does not fill the canonical after-path) |
| Progression condition | `status === ready` |
| Evidence input / provenance | Draft |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | PASS |
| IA-4 | PASS |
| IA-5 | PASS |
| IA-6 | N/A |

### 15. MODEL / construct ray B + required pair

| Field | Result |
|---|---|
| Stage / Subtask | MODEL step 3 |
| Cognitive task | Second required ray; pair = parallel-axis + through-center |
| Required capability | construct-ray |
| Visible control / surface | `lens-ray-b`; optional focal checkbox |
| Semantic learner action | draft `rayB` / optional focal |
| Authoritative owner | coherence + required-pair check |
| Expected state consequence | Ready only if pair structure holds |
| Expected visible consequence | Second learner ray |
| Blocked condition + visible reason | “还没有组成当前模型要求的两条必做光线” (does not name both answers as the key) |
| Progression condition | `status === ready` |
| Evidence input / provenance | Draft |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | PASS |
| IA-4 | PASS |
| IA-5 | PASS |
| IA-6 | N/A |

### 16. MODEL / classify meeting

| Field | Result |
|---|---|
| Stage / Subtask | MODEL step 4 |
| Cognitive task | Name how the constructed rays meet |
| Required capability | classify-meeting |
| Visible control / surface | meeting radios |
| Semantic learner action | draft `meetingMode` |
| Authoritative owner | `officialMeetingMode(station) === meetingMode` |
| Expected state consequence | Ready if meeting matches station (hence required-pair geometry) |
| Expected visible consequence | Official meeting mark stays off |
| Blocked condition + visible reason | Inconsistent → look back at bench (no hidden evaluator dump) |
| Progression condition | Compatible meeting |
| Evidence input / provenance | Draft |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | PASS |
| IA-4 | PASS |
| IA-5 | PASS |
| IA-6 | N/A |

### 17. MODEL / classify image consequence

| Field | Result |
|---|---|
| Stage / Subtask | MODEL step 5 |
| Cognitive task | Choose side / nature / orientation / size / receivable |
| Required capability | classify-image |
| Visible control / surface | five QuestionGroups |
| Semantic learner action | draft image fields |
| Authoritative owner | `imageCompatibleWithMeeting` (not official size) |
| Expected state consequence | Ready if image matches **meeting**; official size may wait |
| Expected visible consequence | Next enables; official image hidden |
| Blocked condition + visible reason | Conflict with meeting → visible; wrong official size not blocked here |
| Progression condition | Meeting-compatible image |
| Evidence input / provenance | Draft. Final `imageMatchesOfficial` may still reject (cross-step) |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | PASS (cross-step leftover allowed) |
| IA-4 | PASS |
| IA-5 | PASS |
| IA-6 | N/A |

### 18. MODEL / author causal bind

| Field | Result |
|---|---|
| Stage / Subtask | MODEL step 6 |
| Cognitive task | Author why meeting implies the image |
| Required capability | author-bind |
| Visible control / surface | `lens-model-reasoning` |
| Semantic learner action | draft `studentReasoning` then 下一步 as an explicit semantic check |
| Authoritative owner | Deterministic `evaluateLensAuthoredSemanticClaim`. Fast-path `classifyLensStep6FastPath` or Zod-validated LLM parse. LLM never returns ready/missing. |
| Expected state consequence | Ready only after a normalized claim aligns with the selected meeting/image |
| Expected visible consequence | Next to review, or a specific missing / inconsistent / unclear reason |
| Blocked condition + visible reason | Empty / sandwich / missing meeting / missing consequence / unbound pair / contradiction with own draft / parser unavailable. Never “先写出真正相交” after equivalent meeting language. |
| Progression condition | Deterministic claim check `ready` |
| Evidence input / provenance | Learner sentence is evidence. Parse is `system-derived` metadata. Not L4 by itself. |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | PASS |
| IA-4 | PASS |
| IA-5 | PASS |
| IA-6 | PASS |

### 19. MODEL / review + submit

| Field | Result |
|---|---|
| Stage / Subtask | MODEL step 7 / submit |
| Cognitive task | Inspect own construction; commit one spatial-ray model |
| Required capability | submit-model |
| Visible control / surface | Review of station, rays, meeting, image, bind; `lens-model-submit` |
| Semantic learner action | `saveModelAttempt` → `applyLensModelSubmit` |
| Authoritative owner | `evaluateConvexLensModelConstruction` |
| Expected state consequence | Attempt stored; TRANSFER iff `correctStructure` |
| Expected visible consequence | Success message + TRANSFER, or reject + repair. No silent no-op |
| Blocked condition + visible reason | Evaluator message via `lensFeedbackForFailureKind` |
| Progression condition | `hasCompletedLensModel` (`correctStructure`) |
| Evidence input / provenance | L4 `constructedValidCausalModel` only from accepted construction. React does not re-grade |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | PASS (step 7 `ready` is review, not a second local accept) |
| IA-4 | PASS |
| IA-5 | PASS (see unit 20) |
| IA-6 | PASS |

### 20. MODEL / repair rejected submit

| Field | Result |
|---|---|
| Stage / Subtask | MODEL / repair |
| Cognitive task | Revise the step that actually failed |
| Required capability | jump to repair step |
| Visible control / surface | `lens-model-repair-panel` + `回到第 N 步修改` |
| Semantic learner action | draft `constructionStep = repairStep` |
| Authoritative owner | `lensModelRepairStep(failureKind, draft)` |
| Expected state consequence | Still MODEL; draft preserved |
| Expected visible consequence | Returns to mapped step |
| Blocked condition + visible reason | Stay MODEL until a later accept |
| Progression condition | New submit through evaluator |
| Evidence input / provenance | Failed attempt kept; does not set L4 |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | N/A |
| IA-4 | PASS |
| IA-5 | PASS (known defect D closed) |
| IA-6 | PASS |

### 21. TRANSFER / structure + authored bind

| Field | Result |
|---|---|
| Stage / Subtask | TRANSFER / submit one target |
| Cognitive task | Apply meeting→image structure to a new apparatus; authored text owns only the bind |
| Required capability | submit-transfer / author-transfer-reason |
| Visible control / surface | `LensTransferTask`; bench hidden; `lens-transfer-progress` `第 N / 2 个新情境`; read-only `lens-transfer-recap` |
| Semantic learner action | `applyLensTransferSubmit` |
| Authoritative owner | `evaluateConvexLensTransfer` / `evaluateRequiredTransferPair` |
| Expected state consequence | Attempt `accepted` or rejected; stay until both required IDs pass |
| Expected visible consequence | 1/2 then 2/2 + “刚才那个新情境已经记下”; EXAM when pair complete |
| Blocked condition + visible reason | One `lens-transfer-repair` from `lensTransferRepairFeedback`; form stays editable |
| Progression condition | Both required targets accepted |
| Evidence input / provenance | L5 only after valid MODEL + both targets. `studentExplanation` is learner text only; `surfaceCueSelected` is separate |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | PASS |
| IA-4 | PASS |
| IA-5 | PASS |
| IA-6 | PASS |

### 21a. TRANSFER / authored explanation after structured construction (IA-07-05)

| Field | Result |
|---|---|
| Stage / Subtask | TRANSFER / authored bind after radios |
| Cognitive task | Meeting relation → why it leads to → image consequence |
| Required capability | author-transfer-reason |
| Visible control / surface | Textarea + `我的判断` recap |
| Semantic learner action | Type a causal sentence; `检查迁移` |
| Authoritative owner | `evaluateConvexLensTransfer` (accept) + `lensTransferRepairFeedback` (one repair message) |
| Expected state consequence | Fail keeps the draft; accept advances the required target |
| Expected visible consequence | Prompt does not re-ask station. One repair. Recap is draft, not official truth |
| Blocked condition + visible reason | Incomplete / inconsistent / authored missing-kind / slogan / table-row; first match only |
| Progression condition | Unchanged pair gate |
| Evidence input / provenance | Authored evidence is the typed sentence. Checkbox does not append slogan text |
| IA-1 | PASS |
| IA-2 | N/A |
| IA-3 | PASS |
| IA-4 | N/A |
| IA-5 | PASS |
| IA-6 | PASS |

### 22. EXAM / representation → model → answer

| Field | Result |
|---|---|
| Stage / Subtask | EXAM / one pattern (3 chrome steps) |
| Cognitive task | Exam World: what is asked, which relation, then answer + reason |
| Required capability | submit-exam |
| Visible control / surface | `LensExamTask`; bench hidden; options last |
| Semantic learner action | `applyLensExamSubmit` → `buildLensExamAttempt` |
| Authoritative owner | Pattern `correctAnswer`; attempt records `correct` |
| Expected state consequence | Attempt stored; next pattern or leave EXAM when every pattern has **an** attempt |
| Expected visible consequence | Feedback; retry chrome if attempts remain |
| Blocked condition + visible reason | Incomplete fields → missing; wrong answer → `summarizeLensExamAttempt` |
| Progression condition | `hasCompletedLensExam`: one attempt per pattern id, **not** all-correct |
| Evidence input / provenance | Exam mapping records only. Must not set L6 (`lens-adversarial-evidence`). UPLP Exam World ≠ mastery |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | PASS |
| IA-4 | PASS (pattern index chrome) |
| IA-5 | PASS |
| IA-6 | PASS (stage exit ≠ L6) |

### 23. AI_OFF / pre-commit

| Field | Result |
|---|---|
| Stage / Subtask | AI_OFF / structure + judgment + reasoning |
| Cognitive task | Independent use without tutor |
| Required capability | commit-ai-off |
| Visible control / surface | `LensAiOffTask` pre-commit; Help/Tutor hidden |
| Semantic learner action | `applyLensAiOffCommit` |
| Authoritative owner | Attempt stored `accepted: false` until post-check |
| Expected state consequence | Challenge attempt opened |
| Expected visible consequence | Post-check phase |
| Blocked condition + visible reason | Incomplete / tutor-used blocked by policy |
| Progression condition | Both challenges later accepted |
| Evidence input / provenance | Pre-commit structured + authored. Post-check cannot manufacture (`post-check-cannot-manufacture`) |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | PASS |
| IA-4 | PASS (challenge index) |
| IA-5 | PASS |
| IA-6 | PASS |

### 24. AI_OFF / post-check + COMPLETE

| Field | Result |
|---|---|
| Stage / Subtask | AI_OFF / post-check then COMPLETE |
| Cognitive task | Confirm which structure was used; then stop |
| Required capability | post-check commit |
| Visible control / surface | post-check boxes; then `LensCompleteView` |
| Semantic learner action | `applyLensAiOffPostCheckSave` |
| Authoritative owner | `evaluateLensAiOffAttempt` / `evaluateRequiredAiOffPair` |
| Expected state consequence | `accepted` only if official ok ∧ post-check ∧ !llm |
| Expected visible consequence | Next challenge or COMPLETE. COMPLETE copy: task done ≠ mastered |
| Blocked condition + visible reason | Failed post-check stays AI_OFF |
| Progression condition | `hasCompletedLensAiOff` |
| Evidence input / provenance | L6 flags only from accepted pair + LLM off |
| IA-1 | PASS |
| IA-2 | PASS |
| IA-3 | PASS |
| IA-4 | PASS |
| IA-5 | PASS |
| IA-6 | PASS |

---

## Cross-stage

| Boundary | Finding |
|---|---|
| OBSERVE → DESCRIBE | Aligned after repair. DESCRIBE context is true because OBSERVE now requires a bench action. |
| DESCRIBE → PREDICT | Aligned. Description is identification, not a prediction. |
| PREDICT → EXPERIMENT | Aligned. Trial 1 lock prepares official start state; learner still performs the intervention. |
| EXPERIMENT → EXPLAIN | Aligned by progression (4 closed trials). EXPLAIN evaluator does not re-read trial rows; it uses a new L3 fragment. Official rays stay hidden. |
| EXPLAIN → MODEL | Designed step-up (partial relation → full construction). Copy prepares it. |
| MODEL → TRANSFER | Designed: bench hidden; L5 is structure transfer, not ray replay. |
| TRANSFER → EXAM | Aligned Exam World (no bench). |
| EXAM → AI_OFF | Stage may open after any attempt per pattern (including all wrong). AI_OFF is strict. Exam World ≠ L6. Not counted as IA-6 FAIL. |

---

## E2E — what is proved vs not

Read: `tests/e2e/convex-lens-optical-bench-learner-flow.spec.ts`, `happy-path.spec.ts`, `tests/e2e/lens-helpers.ts`.

| TEST PROVES | TEST DOES NOT PROVE |
|---|---|
| Scripted visible path can reach COMPLETE | A first-time learner knows what to do unprompted |
| No `runExperiment` button | Pedagogical understanding of the observe items |
| OBSERVE checkboxes without bench action stay blocked | Cover is perceptually obvious at Grade-9 glance |
| Trial-1 wrong station blocked with reason | Trial-4 wrong action (move when cover required) |
| Cover testid / attrs after click | That leftover is a learner-clarity problem (it is an IA-allowed cross-step) |
| MODEL incoherent ray cannot Next | All `failureKind` → repair mappings in the browser |
| MODEL wrong official size → reject → step 5 | That leftover is a learner-clarity problem (it is an IA-allowed cross-step) |
| TRANSFER both targets via helpers; authored restatement gets one bind repair then accept | Learner discovers target 2 without oracle `officialImageConsequence` |
| EXAM / AI_OFF happy path; AI_OFF has no Help | Wrong EXAM still leaving the stage; EXAM is not L6 |
| Back/revisit does not mutate experiment progress | Pedagogical understanding |

The dedicated OBSERVE E2E now submits checkboxes before any bench action and asserts the interaction reason. Happy-path helpers still manipulate first.

---

## Adversarial answers (confirmed YES only)

| # | Question | YES where |
|---|---|---|
| 1 | Asked to do something they cannot do? | No confirmed |
| 2 | Act with no visible result? | No confirmed (cover now visible) |
| 3 | Locally invalid structure marked complete? | No for same-step rays. Cross-step size / authored-vs-mode can reach step 7 by design |
| 4 | Blocked without why? | No silent no-op confirmed. OBSERVE missing reasons now match the gate |
| 5 | Hidden progression work? | TRANSFER shows 第 N / 2 个新情境 |
| 6 | Evidence without intended action? | No after repair (OBSERVE requires interaction + record) |
| 7 | UI ≠ authoritative physics? | Cover: no. DESCRIBE frame is now gated by OBSERVE interaction |
| 8 | React infers success vs evaluator? | No confirmed on MODEL/TRANSFER/AI_OFF |
| 9 | System does the learner action? | Auto-run **removed**. Internal `applyLensRunExperiment` only after validated learner intervention |
| 10 | E2E pass while first-timer lost? | OBSERVE shortcut now has an anti-false-confidence E2E |

---

## Counts

| Metric | Count |
|---|---|
| Audit units | 25 |
| IA-1 FAIL | 0 |
| IA-2 FAIL | 0 |
| IA-3 FAIL | 0 |
| IA-4 FAIL | 0 |
| IA-5 FAIL | 0 |
| IA-6 FAIL | 0 |
| P0 | 0 |
| P1 | 0 |
| P2 | 0 |

---

## Verdict

```text
INTERACTION_ALIGNMENT_PASS
```

Re-audit of IA-07-01 / 02 / 03 / 04 / 05 after the Scene07-local repairs: all PASS. This is not a learner-validation claim.

This is not learner validation.
