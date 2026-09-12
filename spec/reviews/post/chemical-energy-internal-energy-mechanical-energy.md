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
- Reviewer: Cursor quality review (`MODE=POST`, after D042 repair)
- MODEL_ID: `chemical-energy-internal-energy-mechanical-energy`
- SCENE_ID: `four-stroke-engine`
- Implementation inspected (paths): listed below
- Engineering status (context only): TypeScript, Scene 02 Vitest (224 tests including the new adversarial file), other-scene evidence regressions, and Playwright Scene 02 happy-path / AI-failure contracts passed. Context only. Not a quality result.
- Library `metadata.status`: `prototype` (inventory write after this POST result; see D041 / D042)
- Learner-validation status: NOT YET

## Implementation inspected

- UI / stage tasks:
  - `components/learning/FourStrokeEngineLab.tsx`
  - `components/learning/EngineTransferTask.tsx`
  - `components/learning/EngineAiOffTask.tsx`
  - `components/learning/EngineModelBuilder.tsx`
  - `components/learning/EngineExamTask.tsx`
  - `components/learning/EngineCompleteView.tsx`
  - `hooks/useEngineLearningSession.ts`
  - `lib/content/four-stroke-engine.ts`
- Evaluators:
  - `lib/learning/engine-transfer.ts`
  - `lib/learning/engine-ai-off.ts`
  - `lib/learning/engine-model.ts`
  - `lib/learning/engine-exam.ts`
  - `lib/learning/engine-evidence.ts`
  - `content/physics-models/chemical-energy-internal-energy-mechanical-energy/evaluator.ts`
- Evidence accumulator:
  - `lib/learning/engine-evidence.ts`
  - `lib/physics-models/evidence.ts`
- Overlay / COMPLETE:
  - `content/physics-models/chemical-energy-internal-energy-mechanical-energy/assessment-overlay.ts`
  - `ENGINE_COMPLETE_COPY` in `lib/content/four-stroke-engine.ts`
- Adversarial tests:
  - `tests/learning/engine-gate-b-repair.test.ts`

## Stage-by-stage evidence trace

```text
UI
  → student action
  → stored attempt
  → deterministic evaluator
  → accumulateEngineSceneEvidence
  → deriveModelEvidenceLevel
```

The Scene never writes `"L4" | "L5" | "L6"`.

### OBSERVE / DESCRIBE

Weakest passing behavior: required structured observations / snapshots plus any two Chinese characters.

Higher-level model knowledge accidentally credited? NO

### PREDICT

Prediction committed before intervention? YES

Can the student edit history after seeing the result? NO

### EXPERIMENT

UPLP evidence loop closed? YES

Completion means performed, not automatically understood? YES

Result deterministic / app-owned? YES

### EXPLAIN

Remains below model construction where appropriate? YES

Keyword overlap can become L4? NO

### MODEL

Exact behavior that earns valid model evidence:

```text
fuel → gas → system → mechanical
+ conversion / work / gains
+ combustionEnablesConversion === true
```

Formula / slogan / drag-order memorization can pass? NO for formulas, slogans, or stroke-name sequences. YES for click-through of the visible intended cards.

Representation tests deep structure? YES relative to the approved chain.

Conditions represented? PARTIAL (combustion-enables checkbox). Residual, not an L5/L6 hole.

### TRANSFER

Required pair: one full-model combustion-piston target and steam `partial-structure`.

Steam now requires:

1. structured apply of internal/state → work → mechanical;
2. structured reject of the chemical-energy source;
3. not blind full-model;
4. authored transferable structure;
5. authored non-transferable source limit;
6. not an isolated token or noun sandwich.

Live weakest probes after repair:

- steam + “化学能” → **rejected** (`generic-boundary-talk`, `missing-boundary`)
- steam + “来源” → **rejected**
- steam + “不一定” → **rejected**
- steam + “好好” / “情况不一样” → **rejected**
- steam + “化学能内能做功机械能” → **rejected** (`keyword-sandwich`)
- steam blind full-model → **rejected**
- steam structured transferable + “气体变化后还能做功…” without source limit → **rejected** (`missing-boundary`)
- steam source-limit text without transferable structure → **rejected** (`missing-work`, `missing-transferable-authorship`)
- steam intended structure + “后面的关系还可以用，但前面的能量来源不一定相同。” → **accepted**
- motorcycle surface cue only → **rejected**
- motorcycle intended full-model structure → **accepted**

Success based on structural transfer? YES

Surface similarity can pass? NO

Non-transferable relations handled? YES on the required steam target

Required transfer justifies L5? YES, after valid MODEL plus both required targets

### EXAM

Exam World sequencing preserved? YES

Final answer separate from reasoning? YES

EXAM alone can create L6? NO

### AI_OFF

Tutor hidden. Commit freezes answer and reasoning before post-check. Official `identifiesWorkRelation` / `identifiesConditionOrBoundary` are copies of `preCommitWorkRelation` / `preCommitConditionOrBoundary`. Post-check IDs are stored as `postCheckWorkRelation` / `postCheckConditionOrBoundary` and cannot create the official flags.

Live weakest probes after repair:

- piston “我觉得这样不太对吧。” + required post-checks → **fail**; `identifiesWorkRelation` stays false
- locked “装置看起来和平时不太一样。” + required condition checkboxes → **fail**; `identifiesConditionOrBoundary` stays false
- answer-only → **fail**
- commit generic text, then apply required post-checks → **fail**; post-check work/condition stay confirmation-only
- intended piston work-relation text + post-checks + `llmUsed === false` → **pass**
- intended locked condition text + post-checks + `llmUsed === false` → **pass**
- `llmUsed === true` → **fail**

AI technically and pedagogically absent? YES

Response committed before post-check? YES

Answer-only can pass? NO

Memorized conclusion can pass? NO for generic 8-Han text

Reasoning demonstrates independent model use? YES at the pre-commit work / locked-condition floor

`llmUsed` remains false? YES, for a passing attempt

Can post-check manufacture missing pre-commit reasoning? NO

### COMPLETE

Wording evidence-bounded? MOSTLY. Caution and footer deny mastery.

Avoids mastery / score-improvement claims without evidence? YES for mastery/score-gain language. Residual: demonstrated list still says the student independently solved new problems.

## Weakest-passing-behavior analysis

| Gate | Weakest behavior that still passes | Acceptable? |
|---|---|---|
| MODEL | Place the four visible intended cards, label the three relation kinds, check combustion-enables. | Residual click-through. Named leftover. |
| TRANSFER | Motorcycle: full structured chain. Steam: structured transferable / non-transferable split plus a short distinction sentence. Isolated tokens fail. | Yes for the intended L5 claim; residual phrase-family risk remains |
| EXAM | Representation + model + answer + ≥2 Han. Wrong answers still exit. | Acceptable; EXAM is not L6 |
| AI_OFF | Correct judgment + committed work or locked-condition structure + required post-checks + `llmUsed === false`. Post-check cannot fill a missing pre-commit. | Yes for the intended L6 claim; residual phrase-family risk remains |

## MODEL shortcut audit

Tried:

- [x] formula memorization
- [x] isolated slogans / rules
- [x] clicking structured radios without reconstructing the structure
- [x] copying a visible relation

Result: Formulas and stroke-name slogans still fail. The weakest pass is still assembling the visible intended chain. This does not independently create L5/L6.

## TRANSFER shortcut audit

Tried:

- [x] surface noun change only
- [x] “looks like the classroom objects”
- [x] applying a relation that should not transfer
- [x] isolated tokens 化学能 / 来源 / 不一定 / 好好 / 情况不一样
- [x] noun sandwiches
- [x] transferable structure without source limit
- [x] source limit without transferable structure

Result: Those steam shortcuts now fail. Successful steam transfer requires both transferable and non-transferable structural understanding.

## EXAM audit

Answer vs reasoning separable? YES

Condition checking present where needed? PARTIAL. Exit does not require condition language. Exam cannot create L6.

## AI_OFF independence audit

| Challenge | Answer-only | Conclusion-only | Authorship-only (≥N characters) | Model-based reasoning |
|---|---|---|---|---|
| `ai-off-unfamiliar-combustion-piston` | fail | fail | fail (generic 8 Han, even with post-checks) | pass at committed gas→work→movable-part floor + required post-checks |
| `ai-off-condition-locked-mechanism` | fail | fail | fail (generic locked text, even with condition checkboxes) | pass only with committed heat-is-not-output + lock-blocks-work structure + post-check confirmation |

## Evidence claim table

| CLAIM | REQUIRED STUDENT ACTION | RAW EVIDENCE | DETERMINISTIC EVALUATOR | MISCONCEPTION / DISTRACTOR CHECK | ACCUMULATED FLAG | DERIVED LEVEL | KNOWN SHORTCUTS | REVIEW VERDICT |
|---|---|---|---|---|---|---|---|---|
| student constructed the model | Reconstruct chemical → gas state → work → mechanical, with combustion as enabling process | `ModelAttempt` slots, relation kinds, `combustionEnablesConversion` | `evaluateEngineModelStructure` → `hasCompletedEngineModel` | four-stroke names; combustion-as-quantity; direct combustion→motion | `constructedValidCausalModel` | L4 only if that flag is true | visible-card click-through | Supported with residual click-through |
| student transferred the model | Use the full chain on a combustion piston; keep only internal/state → work → mechanical on steam and refuse the chemical start | `TransferAttempt` judgments, order, explanation | `evaluateEngineTransfer` → `hasCompletedEngineTransfer` | surface cue; blind full-model; token-only boundary; noun sandwich | `successfulTransfer` | L5 only after valid model + transfer | short phrase-family distinction sentence | Supported |
| student independently used the model | Reconstruct work on an unfamiliar cutter; show that a locked mechanism blocks work/output | committed answer + reasoning; later `postCheckIds` | `evaluateEngineAiOffAttempt` / `applyEngineAiOffPostCheck` | answer-only; generic 8 Han; post-check-only work/condition; `llmUsed` | `independentAiOffSuccess` + `llmDisabledDuringIndependent` | L6 only after L5 path + AI_OFF | short committed work/lock sentence plus confirmation checks | Supported |

## Overclaim check

Does any copy, test name, or status language claim mastery, score gain, or validation? NO

COMPLETE caution and footer deny mastery. Scene code does not assign L-levels. This review does not write `validated`.

Residual copy: `ENGINE_COMPLETE_COPY.demonstrated` still says the student independently solved new problems.

## Remaining pedagogical risks

- MODEL can still be completed by placing the visible intended cards.
- Motorcycle full-model authorship remains a short own-words floor; L5 is closed by the steam pair, not by motorcycle prose.
- Steam authorship and AI_OFF pre-commit checks use phrase families. Unusual wording can be missed; a short but structurally complete sentence can still pass.
- EXAM exit remains structured-first, not all-correct.
- COMPLETE demonstrated list is slightly stronger than evidence language.
- A careful student path and the weakest acceptable phrase-family path are closer than a teacher interview would like. That is a named leftover, not the previous token / post-check holes.

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

The previous review found two critical-gate shortcuts: steam TRANSFER via isolated tokens, and AI_OFF authorship that post-check boxes could complete after the fact.

Those shortcuts no longer pass. L5 now requires genuine required structural transfer, including steam transferable / non-transferable distinction. L6 now requires pre-commit independent work or locked-condition reasoning plus `llmUsed === false`. EXAM still cannot create L6. Scene code still does not assign L-levels. `deriveModelEvidenceLevel` is unchanged.

Named leftovers remain: MODEL card click-through, motorcycle short authorship, phrase-family detection, and COMPLETE demonstrated wording. Those are refinements, not the previous critical-gate holes.

## Confirmation

Library `metadata.status` was **not** promoted to `validated`. Inventory alignment after this result wrote `prototype`.
