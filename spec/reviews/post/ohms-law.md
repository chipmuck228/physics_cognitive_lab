# POST Learning Evidence Review — Gate B

> First POST for `ohms-law` / Scene 06.  
> Template: [`../templates/post-learning-evidence-review.md`](../templates/post-learning-evidence-review.md)  
> Method: [`../../physics-model-quality-review.md`](../../physics-model-quality-review.md)

## Identity

- Date: 2026-09-12
- Reviewer: Cursor quality review (`MODE=POST`)
- MODEL_ID: `ohms-law`
- SCENE_ID: `simple-resistor-circuit`
- Implementation inspected (paths): listed below
- Engineering status (context only): `tsc --noEmit` PASS; Scene 06 Vitest PASS; related learning/runtime/physics/component suite 676 PASS; Playwright happy path + tutor-failure + Scene 06 screenshots PASS. Context only. Not a quality result.
- Library `metadata.status`: `prototype` (inventory write after this POST result plus the authored-evidence adversarial probe; see D057)
- Learner-validation status: NOT YET

## Implementation inspected

- UI / stage tasks:
  - `components/learning/SimpleResistorCircuitLab.tsx`
  - `components/learning/OhmsRelationBoard.tsx`
  - `components/learning/OhmsTransferTask.tsx`
  - `components/learning/OhmsAiOffTask.tsx`
  - `components/learning/OhmsExamTask.tsx`
  - `components/physics/ohms/SimpleResistorCircuit.tsx`
  - `hooks/useOhmsLearningSession.ts`
- Evaluators:
  - `lib/learning/ohms-model.ts`
  - `lib/learning/ohms-transfer.ts`
  - `lib/learning/ohms-ai-off.ts`
  - `lib/learning/ohms-exam.ts`
  - `lib/learning/ohms-explain.ts`
- Evidence accumulator:
  - `lib/learning/ohms-evidence.ts`
  - `lib/physics-models/evidence.ts` (`deriveModelEvidenceLevel` only)
- Overlay / COMPLETE:
  - `content/physics-models/ohms-law/assessment-overlay.ts`
  - `OHMS_COMPLETE_COPY`

Weakest-pass probes executed against the live evaluators (`tests/learning/ohms-adversarial-evidence.test.ts`).

## Stage-by-stage evidence trace

### OBSERVE / DESCRIBE

Weakest passing behavior: three observe facts plus structured describe fields and ≥2 Han characters.

Higher-level model knowledge accidentally credited? NO

### PREDICT

Prediction committed before intervention? YES

Can the student edit history after seeing the result? NO

### EXPERIMENT

UPLP evidence loop closed? YES (predict → run → observe held/current → compare → reflect)

Completion means performed, not automatically understood? YES

Result deterministic / app-owned? YES (`officialCurrentA`)

### EXPLAIN

Remains below model construction where appropriate? YES (one control can leave EXPLAIN)

Keyword overlap can become L4? NO

### MODEL

Exact behavior that earns valid model evidence:

```text
one board: I, U, R distinct
+ relation I = U / R
+ same R: larger U → larger I
+ same U: larger R → smaller I
+ rearrangement reject (R = U/I does not manufacture R)
+ closed + R treated constant
+ authored: held quantity + changed quantity + consequence for I
```

Formula / slogan / six-click memorization can pass? NO

Representation tests deep structure? YES (one board, not six independent radios)

Conditions represented? YES

### TRANSFER

Success based on structural transfer? YES (targetId-bound pair)

Surface similarity can pass? NO (“也是电路，所以 I = U / R” fails)

Non-transferable relations handled? YES (filament: R may change)

Required transfer justifies L5? YES after valid model

### EXAM

Exam World sequencing preserved? YES (题干 → 考什么 → 关系 → 作答)

Final answer separate from reasoning? YES

EXAM alone can create L6? NO

### AI_OFF

AI technically and pedagogically absent? YES

Response committed before post-check? YES

Answer-only can pass? NO

Memorized conclusion can pass? NO (formula-only / 好好 fail)

Reasoning demonstrates independent model use? YES when both challenges accepted

`llmUsed` remains false? Required for the flag

Can post-check manufacture missing pre-commit reasoning? NO

### COMPLETE

Wording evidence-bounded? YES

Avoids mastery / score-improvement claims without evidence? YES

## Weakest-passing-behavior analysis

| Gate | Weakest behavior that still passes | Acceptable? |
|---|---|---|
| MODEL | Complete board + one authored sentence that names a held quantity and an I consequence for both comparisons | YES, residual regex risk |
| TRANSFER | Wire: relation judgments + control→I sentence. Filament: two boundary checks + “R may change” sentence | YES |
| EXAM | Intended representation/model/answer + own-words reason. Calc answer from official 12 V / 4 Ω | YES; EXAM ≠ L6 |
| AI_OFF | Correct judgment + required pre-commit ids + two-control / rearrangement authored text + required post-check + no LLM | YES |

## MODEL shortcut audit

Tried:

- [x] formula memorization — fail
- [x] isolated slogans / “好好” — fail
- [x] clicking structured radios without reconstructing the structure — fail
- [x] one-control only — fail
- [x] copying a visible relation (`I = U / R` alone) — fail

Result: no L4 shortcut found that skips authored control→I bind.

## TRANSFER shortcut audit

Tried:

- [x] “也是电路，所以 I = U / R” — fail
- [x] wire reasoning offered for filament — fail
- [x] filament reasoning offered for wire — fail
- [x] fixed-proportion slogan on filament — fail

Result: required pair is target-specific.

## EXAM audit

Answer vs reasoning separable? YES

Condition checking present where needed? YES (filament / rearrangement items)

## AI_OFF independence audit

| Challenge | Answer-only | Conclusion-only | Authorship-only (≥N characters) | Model-based reasoning |
|---|---|---|---|---|
| toy-motor two controls | fail | fail | fail | pass |
| R not made by division | fail | fail | fail | pass |

## Evidence claim table

| CLAIM | REQUIRED STUDENT ACTION | RAW EVIDENCE | PROVENANCE | DETERMINISTIC EVALUATOR | ACCUMULATED FLAG | DERIVED LEVEL | WEAKEST PASS | REVIEW VERDICT |
|---|---|---|---|---|---|---|---|---|
| student constructed the model | one board + authored both controls + rearrangement reject | ModelAttempt | student MODEL submit | `evaluateOhmsModelConstruction` | constructedValidCausalModel | L4 only if that flag is true | authored sentence with held + I | HOLD |
| student transferred the model | required pair, target-bound | TransferAttempt | student TRANSFER submit | `evaluateOhmsTransfer` | successfulTransfer | L5 only after valid model + pair | control sentence + filament boundary | HOLD |
| student independently used the model | both AI_OFF challenges, no LLM | IndependentChallengeAttempt | pre-commit then post-check | `evaluateOhmsAiOffAttempt` | independentAiOffSuccess + llmDisabledDuringIndependent | L6 only after L5 path + AI_OFF | two-control + rearrangement reject | HOLD |

HOLD = implementation can credit the flag; not learner-validated.

## Overclaim check

Does any copy, test name, or status language claim mastery, score gain, or validation? NO

COMPLETE: “这只能说明这次任务做完了，不能说明已经掌握电学。”

## Remaining pedagogical risks

- Authored L4/L5/L6 gates are deterministic regex, so a memorized sentence pattern can still pass.
- MODEL frozen figure still shows official I and U; caption mitigates, TRANSFER/EXAM/AI_OFF unmount the circuit.
- EXPLAIN one-control exit is intentional L3, not L4.

## Final Gate B result

- [ ] `LEARNING_EVIDENCE_PASS`
- [x] `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`
- [ ] `LEARNING_EVIDENCE_BLOCKED`
- [ ] `LEARNING_EVIDENCE_OVERCLAIM`
- [ ] `LEARNING_EVIDENCE_SHORTCUT_FOUND`

A PASS or `PASS_WITH_REFINEMENTS` means quality-reviewed **prototype** only.  
This review authorized later inventory promotion. The residual regex risk was accepted after the authored-evidence adversarial probe. Inventory write `metadata.status = prototype` is D057. Not learner-validated. New Scene development is stopped after that write (D058 is analysis only).

It does **not** mean learner-validated.
