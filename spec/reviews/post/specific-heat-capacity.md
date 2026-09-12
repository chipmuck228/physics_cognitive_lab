# POST Learning Evidence Review — Gate B

> Re-review after the focused Gate B evidence repair.  
> Canonical method: [`../../physics-model-quality-review.md`](../../physics-model-quality-review.md)  
> Template: [`../templates/post-learning-evidence-review.md`](../templates/post-learning-evidence-review.md)

## Identity

- Date: 2026-09-12
- Reviewer: Cursor quality review (`MODE=POST`, after D040 repair)
- MODEL_ID: `specific-heat-capacity`
- SCENE_ID: `equal-mass-heated-samples`
- Implementation inspected (paths): listed below
- Engineering status (context only): TypeScript, 570 Vitest tests, and Playwright Scene 01–05 / AI-failure / persistence contracts passed. Context only. Not a quality result.
- Library `metadata.status`: `prototype` (inventory write after this POST result; see D041)
- Learner-validation status: NOT YET

## Implementation inspected

- UI / stage tasks:
  - `components/learning/EqualMassHeatedSamplesLab.tsx`
  - `components/learning/HeatTransferTask.tsx`
  - `components/learning/HeatAiOffTask.tsx`
  - `components/learning/HeatProductBoard.tsx`
  - `components/learning/HeatCompleteView.tsx`
  - `lib/content/equal-mass-heated-samples.ts`
  - `hooks/useHeatSamplesLearningSession.ts`
- Evaluators:
  - `content/physics-models/specific-heat-capacity/evaluator.ts`
  - `lib/learning/heat-model.ts`
  - `lib/learning/heat-transfer.ts`
  - `lib/learning/heat-ai-off.ts`
  - `lib/learning/heat-exam.ts`
- Evidence accumulator:
  - `lib/learning/heat-evidence.ts`
  - `lib/physics-models/evidence.ts`
- Overlay / COMPLETE:
  - `content/physics-models/specific-heat-capacity/assessment-overlay.ts`
  - `HEAT_COMPLETE_COPY` in `lib/content/equal-mass-heated-samples.ts`

Weakest-passing probes were executed against the live evaluators after the repair.

## Stage-by-stage evidence trace

### OBSERVE / DESCRIBE

Structured same-mass / different-rise facts plus ≥2 Han characters. Accumulator: `observedPhenomenon` / `identifiedQuantities` → L1 / L2.

Weakest passing behavior: required boxes plus any two Chinese characters.

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
c, m, ΔT, Q slots correct
+ same m / same ΔT → larger c, larger Q
+ same m / same Q → larger c, smaller ΔT
+ same c / same Q → larger m, smaller ΔT
+ no-phase-change and time-is-not-Q
+ C13: temperature rise alone is insufficient
```

Formula / slogan / drag-order memorization can pass? NO for formula or isolated slogans. YES for clicking the six correct structured choices.

Representation tests deep structure? YES, relative to the PRE six-part lock.

Conditions represented? YES

### TRANSFER

Required pair: pots (`full-model`) then ice (`boundary-contrast`). Ice now requires:

1. core relation selected;
2. structured condition probes: melting / energy may enter without required rise / ordinary `Q = c m ΔT` cannot finish the interval;
3. `temperature-alone-does-not-give-q` and `phase-change-needs-another-model` selected;
4. authored text with a boundary signal, not a noun sandwich or “还在加热 / 情况不一样”.

Live weakest probes after repair:

- Ice + core + “质量温度能量都有。” + probes → **rejected** (`keyword-sandwich`)
- Ice + core + “两边都还在加热。” → **rejected** (`missing-phase-change-boundary`, `generic-boundary-talk`)
- Ice surface cue + “看起来像课堂上见过” → **rejected** (`surface-similarity-only`)
- Ice intended structure + “还可能有能量进入，但冰在熔化…” → **accepted**
- Pots + “质量温度能量都有。” → **rejected** (`keyword-sandwich`)

Success based on structural transfer? YES

Surface similarity can pass? NO

Non-transferable relations handled? YES on the required ice target

Required transfer justifies L5? YES, after valid MODEL plus both required targets

### EXAM

Exam World sequencing preserved? YES

Final answer separate from reasoning? YES

EXAM alone can create L6? NO

### AI_OFF

Tutor hidden. Commit freezes answer, reasoning, and ice pre-commit probes before post-check. Ice `identifiesConditionOrBoundary` / `preCommitBoundaryReasoning` are computed from that committed material only. Post-check can confirm or reject; it cannot create missing boundary reasoning.

Live weakest probes after repair:

- Ice “我觉得这样不太对吧。” + probes + post-checks → **fail**
- Ice “我觉得冰袋还是冷的所以很奇怪。” + post-checks, no probes → **fail**
- Ice post-checks applied to a committed generic response → **fail**; `preCommitBoundaryReasoning` stays false
- Ice / lunchboxes “质量温度能量都有。” → **fail**
- Ice genuine pre-commit boundary text + probes + post-checks + `llmUsed === false` → **pass**
- Answer-only → **fail**
- `llmUsed === true` → **fail**

AI technically and pedagogically absent? YES

Response committed before post-check? YES

Answer-only can pass? NO

Memorized conclusion can pass? NO for material-name-alone and generic ice authorship

Reasoning demonstrates independent model use? YES at the structured pre-commit floor

`llmUsed` remains false? YES, for a passing attempt

Can post-check manufacture missing pre-commit reasoning? NO

### COMPLETE

Wording evidence-bounded? YES

Avoids mastery / score-improvement claims without evidence? YES

## Weakest-passing-behavior analysis

| Gate | Weakest behavior that still passes | Acceptable? |
|---|---|---|
| MODEL | Click the six correct product-board choices. Formula-only and three slogans fail. | Residual radio risk; matches the PRE L4 lock |
| TRANSFER | Ice: intended relation judgments + three condition probes + a short boundary-aware sentence. Noun sandwiches and “还在加热” fail. | Yes for the intended L5 claim; residual labeled-choice risk remains |
| EXAM | Complete the four Exam World fields. Correctness is scored but not required to leave the stage. | Acceptable; EXAM is not L6 |
| AI_OFF | Ice: correct judgment + three pre-commit probes + authored boundary signal + required post-checks + `llmUsed === false`. Post-check cannot fill a missing pre-commit. | Yes for the intended L6 claim; residual labeled-choice risk remains |

## MODEL shortcut audit

Tried:

- [x] formula memorization
- [x] isolated slogans / rules
- [x] clicking structured radios without reconstructing the structure
- [x] copying a visible relation

Result: Formula-only and slogan-only still fail. The weakest pass is still structured click-through of the six-part board.

## TRANSFER shortcut audit

Tried:

- [x] surface noun change only
- [x] “looks like the classroom objects”
- [x] applying a relation that should not transfer
- [x] generic physics nouns
- [x] “still heating” without phase-change structure

Result: Those shortcuts now fail. Successful ice transfer requires structured condition-aware boundary evidence plus authored boundary signal.

## EXAM audit

Answer vs reasoning separable? YES

Condition checking present where needed? YES

## AI_OFF independence audit

| Challenge | Answer-only | Conclusion-only | Authorship-only (≥N characters) | Model-based reasoning |
|---|---|---|---|---|
| `ai-off-unfamiliar-two-lunchboxes` | fail | fail (material-name-alone or noun sandwich) | fail unless a comparison relation is present in the committed text | pass at comparison-relation floor + required post-checks |
| `ai-off-condition-ice-pack-stays-cold` | fail | fail | fail (generic 8 Han or “还是冷的所以很奇怪”, even with post-checks) | pass only with pre-commit probes + authored boundary signal + post-check confirmation |

## Evidence claim table

| CLAIM | REQUIRED STUDENT ACTION | RAW EVIDENCE | DETERMINISTIC EVALUATOR | MISCONCEPTION / DISTRACTOR CHECK | ACCUMULATED FLAG | DERIVED LEVEL | KNOWN SHORTCUTS | REVIEW VERDICT |
|---|---|---|---|---|---|---|---|---|
| student constructed the model | Use one product relation to explain three controlled comparisons, name the no-phase-change / time≠Q conditions, and reject temperature-alone sufficiency | `ModelAttempt` nodes and conditions | `evaluateHeatModelStructure` | formula-only; slogan-only; energy-chain / force / density shapes; time-as-Q | `constructedValidCausalModel` | L4 only if that flag is true | six correct radios with no authored why | Supported for the PRE lock; residual click-through |
| student transferred the model | Reuse Q = c m ΔT on pots; treat ice-water as a phase-change boundary | `TransferAttempt` judgments, condition checks, explanation | `evaluateHeatTransfer` → `evaluateTransferAttempt` | noun sandwich; still-heating; surface cue; heating always raises T | `successfulTransfer` only after valid model + both required targets | L5 only after valid model + transfer | labeled ice probes plus a short boundary sentence | Supported |
| student independently used the model | Judge lunchboxes and ice-pack cases with pre-commit model/boundary reasoning and no AI | `IndependentChallengeAttempt` including frozen `preCommitEvidenceIds` | `evaluateHeatAiOffAttempt` | answer-only; material-name-alone; noun sandwich; generic ice text; post-check-only boundary; tutor during AI_OFF | `independentAiOffSuccess` + `llmDisabledDuringIndependent` | L6 only after L5 path + AI_OFF | labeled ice probes plus a short boundary sentence | Supported |

## Overclaim check

Does any copy, test name, or status language claim mastery, score gain, or validation? NO

COMPLETE remains evidence-bounded. `metadata.status` may be `prototype` after inventory alignment. Scene code does not assign L-levels. It is not `validated`.

## Remaining pedagogical risks

- MODEL can still be completed by clicking the visible correct radios.
- Ice TRANSFER and ice AI_OFF still use labeled structured choices; a student can pass by selecting the intended probes and writing a short boundary-aware sentence.
- Authored-boundary detection uses phrase families, not one exact sentence. Unusual wording can be missed; generic phrases can be over-rejected if they also contain a boundary marker.
- EXPLAIN / TRANSFER own-words floors are still 2 Han characters; AI_OFF authorship is still 8 Han characters. Length is not physics.
- Experiment observation fields close when filled, even if the chosen comparison is physically wrong.
- Same-heater / same-time remains an approximation of Q.
- `inferModelRepresentationKind` still reports `relation-condition`. The implemented board is a product/ratio board.

## Final Gate B result

- [ ] `LEARNING_EVIDENCE_PASS`
- [x] `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`
- [ ] `LEARNING_EVIDENCE_BLOCKED`
- [ ] `LEARNING_EVIDENCE_OVERCLAIM`
- [ ] `LEARNING_EVIDENCE_SHORTCUT_FOUND`

A PASS means quality-reviewed **prototype** only.  
This result allows a quality-reviewed prototype with named leftovers.  
It authorizes Library `metadata.status = "prototype"`.  
It does **not** mean learner-validated.  
It does **not** authorize promoting Library `metadata.status` to `validated`.

### Why this result

The previous review found two critical-gate shortcuts: ice TRANSFER without phase-change structure, and ice AI_OFF authorship that post-check boxes could complete after the fact.

Those shortcuts no longer pass. L5 now requires genuine required structural transfer, including ice boundary evidence. L6 now requires pre-commit independent boundary reasoning plus `llmUsed === false`. EXAM still cannot create L6. Scene code still does not assign L-levels. `deriveModelEvidenceLevel` is unchanged.

Named leftovers remain: MODEL radio click-through, labeled ice probes, and keyword-family detection. Those are refinements, not the previous critical-gate holes.

## Confirmation

Library `metadata.status` was **not** promoted to `validated`. Inventory alignment may write `prototype`.
