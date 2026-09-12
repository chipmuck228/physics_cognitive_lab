# POST Learning Evidence Review — Gate B

> Re-review after the focused Gate B evidence repair.  
> Canonical method: [`../../physics-model-quality-review.md`](../../physics-model-quality-review.md)  
> Template: [`../templates/post-learning-evidence-review.md`](../templates/post-learning-evidence-review.md)  
> Request: [`../../prompts/review-physics-model-quality.md`](../../prompts/review-physics-model-quality.md)

This review inspects the **repaired implementation**. It does not rely on the first POST report as evidence.

It does **not** mark the canonical model `validated`.

---

## Identity

- Date: 2026-09-12
- Reviewer: Cursor quality review (`MODE=POST`, after D043 repair)
- MODEL_ID: `force-changes-motion-state`
- SCENE_ID: `horizontal-force-cart`
- Implementation inspected (paths): listed below
- Engineering status (context only): TypeScript, Scene 03 Vitest (including `tests/learning/cart-gate-b-repair.test.ts`), engine/heat evidence regressions, and Playwright Scene 03 happy-path / AI-failure contracts passed. Context only. Not a quality result.
- Library `metadata.status`: `prototype` (inventory write after this POST result; see D041 / D043)
- Learner-validation status: NOT YET

## Implementation inspected

- UI / stage tasks:
  - `components/learning/HorizontalForceCartLab.tsx`
  - `components/learning/CartModelBoard.tsx`
  - `components/learning/CartTransferTask.tsx`
  - `components/learning/CartAiOffTask.tsx`
  - `components/learning/CartExamTask.tsx`
  - `components/learning/CartCompleteView.tsx`
  - `hooks/useCartLearningSession.ts`
  - `lib/content/horizontal-force-cart.ts`
- Evaluators:
  - `lib/learning/cart-observe.ts`
  - `lib/learning/cart-describe.ts`
  - `lib/learning/cart-predict.ts`
  - `lib/learning/cart-experiment.ts`
  - `lib/learning/cart-explain.ts`
  - `lib/learning/cart-model.ts`
  - `lib/learning/cart-transfer.ts`
  - `lib/learning/cart-exam.ts`
  - `lib/learning/cart-ai-off.ts`
  - `content/physics-models/force-changes-motion-state/evaluator.ts`
- Evidence accumulator:
  - `lib/learning/cart-evidence.ts`
  - `lib/physics-models/evidence.ts`
- Transfer / exam / AI_OFF:
  - `content/physics-models/force-changes-motion-state/transfer.ts`
  - `content/physics-models/force-changes-motion-state/exam.ts`
  - `content/physics-models/force-changes-motion-state/independent-challenges.ts`
- Overlay:
  - `content/physics-models/force-changes-motion-state/assessment-overlay.ts`
- COMPLETE copy:
  - `CART_COMPLETE_COPY` in `lib/content/horizontal-force-cart.ts`
- Adversarial tests:
  - `tests/learning/cart-gate-b-repair.test.ts`
- Spec / inventory context:
  - `spec/physics-model-quality-review.md`
  - `spec/scenes/horizontal-force-cart/` (README, evidence-contract)
  - `content/physics-models/force-changes-motion-state/model.ts`

Live weakest-passing probes were executed against the production functions after the D043 repair. The probe file was not left in the repository.

## Stage-by-stage evidence trace

```text
UI
  → student action
  → stored attempt
  → deterministic evaluator
  → accumulateCartSceneEvidence
  → deriveModelEvidenceLevel
```

The Scene never writes `"L4" | "L5" | "L6"`. Official levels come only from `deriveModelEvidenceLevel`.

### OBSERVE / DESCRIBE

UI asks for structured observations and structured describe fields plus ≥2 Han characters.

Weakest passing behavior: required observation boxes; object / initial motion / force direction / observed change; any two Chinese characters.

Higher-level model knowledge accidentally credited? NO

### PREDICT

Prediction committed before intervention? YES. `committed: true` is stored; experiment run requires that committed prediction.

Can the student edit history after seeing the result? NO

### EXPERIMENT

Three model experiments. Closure requires committed prediction, intervention, observed facts, comparison, and ≥2 Han reflection. Physics comes from `runCartExperiment`.

UPLP evidence loop closed? YES

Completion means performed, not automatically understood? YES

Result deterministic / app-owned? YES

### EXPLAIN

Four structured picks (force ≠ motion, same-direction speeds up, opposite slows, zero unchanged) plus ≥2 Han. Accumulator sets `identifiedRelations` only. That can become L3. It cannot become L4.

Remains below model construction where appropriate? YES

Keyword overlap can become L4? NO

### MODEL

UI is a model-owned relation / condition board: three cases (same, opposite, zero), each with current motion, net-force condition, and resulting change, plus required conditions `friction-omitted` and `net-force-zero-unchanged`.

Exact behavior that earns valid model evidence:

```text
same: moving + same-as-motion → sped-up
+ opposite: moving + opposite-to-motion → slowed-down
+ zero: moving + zero → unchanged
+ friction-omitted
+ net-force-zero-unchanged
```

Formula / slogan / drag-order memorization can pass? NO for the listed slogans if they are selected as options. YES for click-through of the visible intended radios. There is no authored “why” slot.

Representation tests deep structure? YES relative to the three-case lock. Residual: the accepted structure can be assembled from visible correct choices without reconstructing why those three cases belong together.

Conditions represented? YES (`friction-omitted`, `net-force-zero-unchanged`).

This residual structured click-through does not independently create L5/L6. It is a named leftover, not the repaired blocker.

### TRANSFER

Required pair for `hasCompletedCartTransfer`: one accepted full-model target (`near-bicycle-speeding-up` or `medium-ball-opposite-force`) **and** hover `far-hover-constant-velocity` (`boundary-contrast`).

Production path is `evaluateCartTransfer` → canonical `evaluateTransferAttempt`, then Scene-owned `evaluateCartTargetSpecificEvidence` keyed by `targetId`.

Full-model acceptance now requires:

```text
bicycle: apply same-direction-force-increases-speed
         + authored same-direction / with-motion cue
         + authored speed-up
ball:    apply opposite-direction-force-decreases-speed
         + authored opposite / against-motion cue
         + authored slow-down
+ ≥2 Han
+ not surface-wheels-only
+ not isolated tokens / noun sandwiches / generic “好好” / “情况不一样”
+ not the exact misconception slogans
```

Hover / boundary acceptance now requires:

```text
apply zero-net-force-leaves-motion-unchanged
+ do not apply same-direction or opposite-direction speed-change
+ authored zero / near-zero net force
+ authored currently-moving + unchanged / need-not-stop
+ not “合力为零就一定静止” / “没力就停” / generic tokens
```

Live weakest probes after repair:

- bicycle + “合力” → **rejected** (`generic-boundary-talk`, `missing-authored-relation`)
- bicycle + “合力 运动 速度 方向” → **rejected** (`keyword-sandwich`)
- bicycle + “好好” / “情况不一样” → **rejected**
- bicycle + only opposite-force card + correct opposite-case prose → **rejected** (`wrong-target-relation`)
- bicycle surface “都有轮子…” → **rejected** (`surface-similarity-only`)
- bicycle + “有力就一定运动。” → **rejected** (`force-motion-conflation`)
- bicycle + apply same-direction + “同一边加快” → **accepted**
- ball + apply opposite + “顶着减慢” → **accepted**
- ball + bicycle same-direction text/card → **rejected** (`wrong-target-relation`)
- hover + apply zero + “好好” / “情况不一样” / “合力” → **rejected**
- hover + “这时水平合力接近零。” → **rejected** (`missing-authored-consequence`)
- hover + unchanged-while-moving without zero-net-force authorship → **rejected** (`missing-authored-relation`)
- hover + “没力就停” / “合力为零就一定静止” → **rejected** (`zero-net-force-misread`)
- hover + apply same-direction onto zero case → **rejected** (`forced-nonzero-force-onto-zero-net-force`)
- hover + “合力为零原来保持” → **accepted**
- hover intended sentence → **accepted**

Success based on structural transfer? YES. `targetId` now binds the required relation. A correct physics relation about a different case does not prove this case.

Surface similarity can pass? NO

Non-transferable relations handled? YES on the required hover target

Required transfer justifies L5? YES, after valid MODEL plus one case-appropriate full-model target and the hover boundary

### EXAM

Exam World uses five overlay-mapped patterns. Options stay behind representation and model-recognition steps. Exit is structured (representation + model + answer + ≥2 Han), not all-correct. `accumulateCartSceneEvidence` does not read exam attempts.

Exam World sequencing preserved? YES

Final answer separate from reasoning? YES

EXAM alone can create L6? NO

### AI_OFF

Tutor is hidden when `isAiOff` or `isComplete`. Commit requires a judgment plus ≥8 Han. Commit stores the attempt, then unlocks post-check.

Official independent flags are copies of pre-commit detectors:

- `identifiesCurrentMotionState` ← `preCommitCurrentMotionState`
- `identifiesNetForceCondition` ← `preCommitNetForceCondition`
- `identifiesMotionStateChange` / `checksZeroNetForceUnchangedCondition` ← `preCommitRelation`
- `identifiesConditionOrBoundary` ← `preCommitConditionOrBoundary`

Post-check IDs are stored as `postCheckCurrentMotionState` / `postCheckNetForceCondition` / `postCheckConditionOrBoundary`. They may confirm. They cannot create the official flags.

`accepted` requires correct answer + ≥8 Han + required post-checks + no slogans/sandwich + all pre-commit critical flags + `llmUsed === false`.

Live weakest probes after repair:

- hover “我觉得这样不太对吧。” + required post-checks → **fail**; official motion / force / boundary stay false; post-check confirmation flags may be true
- crate “装置看起来和平时不太一样。” + required post-checks → **fail**; `identifiesConditionOrBoundary` stays false
- generic ≥8 Han + correct post-checks → **fail**
- noun sandwich + post-checks → **fail**
- answer-only → **fail**
- commit generic text, then apply required post-checks → **fail**; post-check cannot manufacture missing independent reasoning
- hover “原来合力看成零保持。” + required post-checks + `llmUsed === false` → **pass**
- crate “受力平衡不是没有力原来保持。” + required post-checks + `llmUsed === false` → **pass**
- genuine pre-commit without required post-checks → **fail** (confirmation still required)
- `llmUsed === true` → **fail**

AI technically and pedagogically absent? YES

Response committed before post-check? YES for the text and for the official reasoning signals

Answer-only can pass? NO

Memorized conclusion can pass? NO for generic 8-Han text

Reasoning demonstrates independent model use? YES at the pre-commit state + condition + relation / boundary floor

`llmUsed` remains false? YES, for a passing attempt

Can post-check manufacture missing pre-commit reasoning? NO

### COMPLETE

Caution: “这只说明你完成了这次要做的事，不表示已经掌握所有力和运动问题，也不保证考试一定会更好。”

The demonstrated list still says the student “能把这个关系用到新情境和考试题” and “能在没有 AI 提示时独立判断新问题.”

Wording evidence-bounded? MOSTLY. Caution denies mastery. The demonstrated lines remain slightly stronger than evidence language.

Avoids mastery / score-improvement claims without evidence? YES for mastery/score-gain language.

## Weakest-passing-behavior analysis

| Gate | Weakest behavior that still passes | Acceptable? |
|---|---|---|
| MODEL | Click the three intended case triples and the two required condition boxes. Slogans selected as options fail. | Residual click-through. Named leftover. |
| TRANSFER | Bicycle: apply same-direction + “同一边加快”. Ball: apply opposite + “顶着减慢”. Hover: apply zero-unchanged + “合力为零原来保持”. Isolated tokens, wrong-target relations, and generic hover text fail. | Yes for the intended L5 claim; residual phrase-family risk remains |
| EXAM | Representation + model recognition + any answer + “好好”. Wrong answers still exit. | Acceptable for stage exit. Not L6. |
| AI_OFF | Correct radio + committed state + condition + relation/boundary phrase + required post-checks + `llmUsed === false`. Post-check cannot fill a missing pre-commit. | Yes for the intended L6 claim; residual phrase-family risk remains |

## MODEL shortcut audit

Tried:

- [x] formula memorization
- [x] isolated slogans / rules
- [x] clicking structured radios without reconstructing the structure
- [x] copying a visible relation

Result:

Force-means-motion, zero-must-stop, force-equals-motion, and energy-chain options still fail. The remaining MODEL shortcut is assembling the visible intended three-case board. That is residual structured click-through. It does not independently create L5/L6.

## TRANSFER shortcut audit

Tried:

- [x] surface noun change only
- [x] “looks like the classroom objects”
- [x] applying a relation that should not transfer
- [x] isolated vocabulary “合力”
- [x] noun sandwich “合力运动速度方向”
- [x] generic “好好” / “情况不一样”
- [x] “有力就一定运动” / “没力就停” / “合力为零就一定静止”
- [x] correct opposite-force relation on the bicycle target
- [x] hover condition without consequence

Result:

Those previous L5 shortcuts now fail. Successful full-model transfer is `targetId`-specific. Successful hover transfer requires currently-moving + zero net force → unchanged, not merely a zero-net-force option or isolated vocabulary.

## EXAM audit

Answer vs reasoning separable? YES

Condition checking present where needed? PARTIAL. Items exist for zero-net-force and balanced-vs-absent force, but exit does not require that reasoning. Exam cannot create L6.

## AI_OFF independence audit

| Challenge | Answer-only | Conclusion-only | Authorship-only (≥N characters) | Model-based reasoning |
|---|---|---|---|---|
| `ai-off-unfamiliar-hover-sled` | fail | fail | fail (generic 8 Han, even with post-checks) | pass at committed current-motion + zero-net-force + unchanged floor + required post-checks |
| `ai-off-condition-tug-moving-crate` | fail | fail | fail (generic locked-looking text, even with post-checks) | pass only with committed balanced-is-not-absent + motion + unchanged structure + post-check confirmation |

## Evidence claim table

| CLAIM | REQUIRED STUDENT ACTION | RAW EVIDENCE | DETERMINISTIC EVALUATOR | MISCONCEPTION / DISTRACTOR CHECK | ACCUMULATED FLAG | DERIVED LEVEL | KNOWN SHORTCUTS | REVIEW VERDICT |
|---|---|---|---|---|---|---|---|---|
| student constructed the force-motion model | Reconstruct current motion + net-force condition → motion-state change, including zero → unchanged | `ModelAttempt` three-case nodes and conditions | `evaluateCartModelStructure` → `hasCompletedCartModel` | force-means-motion; zero-must-stop; force-equals-motion; energy chain | `constructedValidCausalModel` | L4 only if that flag is true | visible-radio click-through; no authored why | Supported with residual click-through |
| student transferred the force-motion model | Use the case-appropriate motion + net-force + consequence relation on bicycle or ball; keep only moving + zero → unchanged on hover | `TransferAttempt` judgments, `targetId`, explanation | `evaluateCartTransfer` → `evaluateCartTargetSpecificEvidence` → `hasCompletedCartTransfer` | surface wheels; force-means-motion; zero-must-stop; wrong-target relation; isolated tokens; generic hover text | `successfulTransfer` | L5 only after valid model + transfer | short phrase-family same-direction / opposite / zero-unchanged sentences | Supported |
| student independently used the force-motion model | Reconstruct hover zero-net-force unchanged; distinguish tug balance from “no force” | committed answer + reasoning; later `postCheckIds` | `evaluateCartAiOffAttempt` / `applyCartAiOffPostCheck` | answer-only; `llmUsed`; exact slogans; generic 8 Han; post-check-only motion/force/boundary | `independentAiOffSuccess` + `llmDisabledDuringIndependent` | L6 only after L5 path + AI_OFF | short committed state + condition + relation/boundary sentence plus confirmation checks | Supported |

## Overclaim check

Does any copy, test name, or status language claim mastery, score gain, or validation? NO as the primary status claim.

COMPLETE caution denies mastery. Scene code does not assign L-levels. This review does not write `validated`.

Residual copy:

- `CART_COMPLETE_COPY.demonstrated`: “能把这个关系用到新情境和考试题；” / “能在没有 AI 提示时独立判断新问题。”

Those lines describe the intended L5/L6 claims. They are a named leftover, not a deciding hole.

## Remaining pedagogical risks

- MODEL remains a visible-radio reconstruction with no authored necessity check.
- Full-model and AI_OFF authorship use phrase families. Unusual wording can be missed; a short but structurally complete sentence can still pass. Example false negative: hover “合力接近零正在运动不必停” is currently treated as a noun sandwich because `不必停` is not a transfer relation marker.
- EXAM exit remains structured-first, not all-correct.
- COMPLETE demonstrated list is slightly stronger than evidence language.
- A careful student path and the weakest acceptable phrase-family path are closer than a teacher interview would like. That is a named leftover, not the previous token / wrong-target / post-check holes.

## Final Gate B result

- [ ] `LEARNING_EVIDENCE_PASS`
- [x] `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`
- [ ] `LEARNING_EVIDENCE_BLOCKED`
- [ ] `LEARNING_EVIDENCE_OVERCLAIM`
- [ ] `LEARNING_EVIDENCE_SHORTCUT_FOUND`

A PASS or `PASS_WITH_REFINEMENTS` means quality-reviewed **prototype** only.  
It may authorize Library `metadata.status = "prototype"`.  
It does **not** mean learner-validated.

### Why this result

The previous review found two critical-gate shortcuts: TRANSFER via any one core relation plus “好好” / “合力”, including a mismatched opposite-force card on the bicycle, plus hover boundary via generic text; and AI_OFF authorship that post-check boxes could complete after the fact.

Those shortcuts no longer pass. L5 now requires genuine required structural transfer, including the `targetId`-appropriate state + condition + consequence relation and hover currently-moving + zero → unchanged. L6 now requires pre-commit independent motion / net-force / relation or boundary reasoning plus `llmUsed === false`. EXAM still cannot create L6. Scene code still does not assign L-levels. `deriveModelEvidenceLevel` is unchanged.

Named leftovers remain: MODEL radio click-through, phrase-family detection, EXAM structured-first exit, and COMPLETE demonstrated wording. Those are refinements, not the previous critical-gate holes.

## Confirmation

Library `metadata.status` was **not** promoted to `validated`. Inventory alignment after this result wrote `prototype`.
