# POST Learning Evidence Review — Gate B

> First POST for `convex-lens-imaging` / Scene 07.  
> Template: [`../templates/post-learning-evidence-review.md`](../templates/post-learning-evidence-review.md)  
> Method: [`../../physics-model-quality-review.md`](../../physics-model-quality-review.md)

## Identity

- Date: 2026-09-12
- Reviewer: Cursor quality review (`MODE=POST`)
- MODEL_ID: `convex-lens-imaging`
- SCENE_ID: `convex-lens-optical-bench`
- Implementation inspected (paths): listed below
- Engineering status (context only): `tsc --noEmit` PASS; Vitest 818 PASS including Scene 07 physics / PRI / adapter / adversarial evidence / model package; Playwright Scene 07 happy path + tutor-failure PASS; persistence + `ai-failure` E2E PASS. Context only. Not a quality result.
- Library `metadata.status`: `prototype` (inventory write after this POST result; see D063)
- Learner-validation status: NOT YET

## Implementation inspected

- UI / stage tasks:
  - `components/learning/ConvexLensOpticalBenchLab.tsx`
  - `components/learning/LensRayConstruction.tsx`
  - `components/learning/LensObserveTask.tsx`
  - `components/learning/LensDescribeTask.tsx`
  - `components/learning/LensPredictTask.tsx`
  - `components/learning/LensExperimentTask.tsx`
  - `components/learning/LensExplainTask.tsx`
  - `components/learning/LensTransferTask.tsx`
  - `components/learning/LensExamTask.tsx`
  - `components/learning/LensAiOffTask.tsx`
  - `components/learning/LensCompleteView.tsx`
  - `components/physics/convex-lens/ConvexLensOpticalBench.tsx`
  - `hooks/useConvexLensLearningSession.ts`
- Evaluators:
  - `content/physics-models/convex-lens-imaging/construction.ts`
  - `lib/learning/lens-model.ts`
  - `lib/learning/lens-transfer.ts`
  - `lib/learning/lens-ai-off.ts`
  - `lib/learning/lens-exam.ts`
  - `lib/learning/lens-explain.ts`
  - `lib/learning/lens-observe.ts`
  - `lib/learning/lens-describe.ts`
- Evidence accumulator:
  - `lib/learning/lens-evidence.ts`
  - `lib/physics-models/evidence.ts` (`deriveModelEvidenceLevel` only)
- Overlay / COMPLETE:
  - `content/physics-models/convex-lens-imaging/assessment-overlay.ts`
  - `LENS_COMPLETE_COPY`

Weakest-pass probes executed against the production Scene evaluators (`tests/learning/lens-adversarial-evidence.test.ts`) and the package contract (`tests/physics-models/convex-lens-imaging-evidence.test.ts`).

## Stage-by-stage evidence trace

### OBSERVE / DESCRIBE

UI asks: notice screen/image changes; name object, lens, F/2F, image, screen as distinct.

Student action: watch official demo stations, move the screen, check three observe facts; structured DESCRIBE plus one authored sentence.

Stored raw attempt: `ObservationEvidence.selectedOptionIds`; `DescriptionEvidence` + `describeDraft`.

Deterministic evaluator: `evaluateLensObservation`; `evaluateLensDescription`. Vague “变了” / “像不一样” fail.

Accumulator: `observedPhenomenon` only after sufficient Observe **and** Describe; `identifiedQuantities` from Describe.

Derived level risk: L1 / L2 only. OBSERVE cannot set `constructedValidCausalModel`.

Higher-level model knowledge accidentally credited? NO

### PREDICT

Prediction committed before intervention? YES (`authoredBeforeIntervention`)

Can the student edit history after seeing the result? NO (locked after commit)

Tutor must not give the imaging row. Leak detector rejects “倒立缩小实像” / thin-lens formula.

### EXPERIMENT

UPLP evidence loop closed? YES (predict → run → observe screen/size-or-cover → compare → reflect)

Completion means performed, not automatically understood? YES (`sufficient` is loop-closed, not L4)

Result deterministic / app-owned? YES (`officialImagingState`, `officialScreenReceive`, `officialPartialCoverEffect`)

Partial cover keeps the whole image and reduces brightness. Moving the screen does not move official `imageX`.

### EXPLAIN

Remains below model construction where appropriate? YES (one meeting or receivability fragment + own words)

Keyword overlap can become L4? NO. Slogan-only “2F 外倒立缩小实像” is rejected. Table-row text without meeting language is rejected.

### MODEL

Exact behavior that earns valid model evidence:

```text
one construction
+ objectStation
+ required pair: parallel-axis + through-center,
  each geometrically coherent for that station
+ meetingMode
+ image consequence matching that meeting
+ authored meeting → image bind
+ constructionSource = student-constructed
```

Official evaluator: `evaluateConvexLensModelConstruction`.  
Only `result.ok` may set `ModelAttempt.correctStructure`.  
Accumulator sets `constructedValidCausalModel` only from that flag.

Formula / slogan / drag-order memorization can pass? NO (`1/f = 1/u + 1/v` is not a path; table row fails; properties-only fails)

Representation tests deep structure? YES (ray kind must match before/after/incident path; station-impossible focal ray fails)

Conditions represented? YES (`u = f` is no-finite-meeting, not an ordinary image)

UI is a Scene-owned ray-construction form, not a finished-diagram multiple choice and not a five-row table. Official rays stay hidden. Live preview appears only after the student has assembled a complete draft.

### TRANSFER

Success based on structural transfer? YES (`targetId`-bound)

Surface similarity can pass? NO (“都有凸透镜” is rejected)

Non-transferable relations handled? YES (magnifier is virtual / not screen-receivable)

Required transfer justifies L5? YES after valid MODEL **and** both `near-projector-real-enlarged` and `far-magnifying-glass-virtual`

Camera cannot substitute.

### EXAM

Exam World sequencing preserved? YES (题干 → 这题在考什么 → 选用关系 → 最后选项 / 理由)

Final answer separate from reasoning? YES

EXAM alone can create L6? NO

Thin-lens formula is not an exam success path.

### AI_OFF

AI technically and pedagogically absent? YES (Tutor UI unmounted; `isTutorHardBlocked`; no `/api/tutor` calls)

Response committed before post-check? YES

Answer-only can pass? NO

Memorized conclusion can pass? NO (surface / table / “这也有凸透镜” fail)

Reasoning demonstrates independent model use? YES when both required challenges pass from pre-commit structure

`llmUsed` remains false? Required for the L6 flags

Can post-check manufacture missing pre-commit reasoning? NO

Required pair:

- `ai-off-unfamiliar-window-card-projection`
- `ai-off-boundary-magnifier-cannot-catch-virtual`

### COMPLETE

Wording evidence-bounded? YES

Avoids mastery / score-improvement claims without evidence? YES

COMPLETE does not write evidence flags.

## Weakest-passing-behavior analysis

| Gate | Weakest behavior that still passes | Acceptable? |
|---|---|---|
| MODEL | Assemble the required ray pair for one station, choose matching meeting + image fields, write a sentence with meeting language and a consequence bind | YES, residual regex / radio-pattern risk |
| TRANSFER | Correct station + meeting + official image fields + target-bound sentence for both required targets | YES |
| EXAM | Intended representation / model / answer + own-words reason | YES; EXAM ≠ L6 |
| AI_OFF | Correct judgment + official structure + meeting-bind authored text + required post-check + `llmUsed` false, on both challenges | YES |

## MODEL shortcut audit

Tried:

- [x] formula memorization — fail
- [x] isolated slogans / F/2F table row — fail
- [x] properties-only without meeting bind — fail
- [x] finished-diagram recognition — fail (`constructionSource` is hardcoded `student-constructed`; recognized source would fail the official evaluator)
- [x] incoherent ray pairing — fail
- [x] station-impossible actual-through-F ray at `u < f` — fail
- [x] clicking a completed overlay — not offered

Result: no L4 shortcut found that skips the required pair and authored meeting→image bind.

## TRANSFER shortcut audit

Tried:

- [x] “都有凸透镜” — fail
- [x] one required target only — L4, not L5
- [x] camera as substitute — fail
- [x] projector language on the magnifier target — fail

Result: required pair is target-specific.

## EXAM audit

Answer vs reasoning separable? YES

Condition checking present where needed? YES (`u = f`, virtual + screen, partial cover, object moving toward F)

## AI_OFF independence audit

| Challenge | Answer-only | Conclusion-only | Authorship-only (≥N characters) | Model-based reasoning |
|---|---|---|---|---|
| window-card projection | fail | fail | fail | pass |
| magnifier cannot catch virtual | fail | fail | fail | pass |

## Evidence claim table

| CLAIM | REQUIRED STUDENT ACTION | RAW EVIDENCE | PROVENANCE | DETERMINISTIC EVALUATOR | ACCUMULATED FLAG | DERIVED LEVEL | WEAKEST PASS | REVIEW VERDICT |
|---|---|---|---|---|---|---|---|---|
| student constructed the model | one spatial-ray construction + authored meeting→image bind | ModelAttempt nodes / reasoning | student MODEL submit | `evaluateConvexLensModelConstruction` | constructedValidCausalModel | L4 only if that flag is true | required pair + bind sentence | HOLD |
| student transferred the model | required projector + magnifier, target-bound | TransferAttempt | student TRANSFER submit | `evaluateRequiredTransferPair` | successfulTransfer | L5 only after valid model + pair | station + meeting + bind | HOLD |
| student independently used the model | both AI_OFF challenges, no LLM | IndependentChallengeAttempt | pre-commit then post-check | `evaluateRequiredAiOffPair` | independentAiOffSuccess + llmDisabledDuringIndependent | L6 only after L5 path + AI_OFF | structure + bind + required post-check | HOLD |

HOLD = implementation can credit the flag; not learner-validated.

## Overclaim check

Does any copy, test name, or status language claim mastery, score gain, or validation? NO

COMPLETE: “这只能说明这次任务做完了，不能说明已经掌握凸透镜成像。”

## Remaining pedagogical risks

- Authored L4/L5/L6 gates are deterministic regex, so a memorized sentence pattern can still pass.
- MODEL is a structured construction form, not freehand drawing on the bench. That is stronger than finished-diagram recognition and weaker than unconstrained spatial drawing.
- A complete draft can preview student rays before submit. Official completed diagrams stay hidden.
- EXPLAIN one-fragment exit is intentional L3, not L4.

## Final Gate B result

- [ ] `LEARNING_EVIDENCE_PASS`
- [x] `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`
- [ ] `LEARNING_EVIDENCE_BLOCKED`
- [ ] `LEARNING_EVIDENCE_OVERCLAIM`
- [ ] `LEARNING_EVIDENCE_SHORTCUT_FOUND`

A PASS or `PASS_WITH_REFINEMENTS` means quality-reviewed **prototype** only.  
This review authorizes inventory promotion to `metadata.status = prototype`.  
It does **not** mean learner-validated.
