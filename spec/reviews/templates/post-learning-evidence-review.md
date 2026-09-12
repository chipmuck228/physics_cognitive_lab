# POST Learning Evidence Review — Gate B

> Fill this template after inspecting the implementation.  
> Canonical method: [`../../physics-model-quality-review.md`](../../physics-model-quality-review.md)

## Identity

- Date:
- Reviewer:
- MODEL_ID:
- SCENE_ID:
- Implementation inspected (paths):
- Engineering status (context only): TypeScript / Vitest / Playwright
- Library `metadata.status`:
- Learner-validation status: NOT YET / in progress / validated under a separate protocol

## Implementation inspected

List the actual files read. Do not review from memory.

- UI / stage tasks:
- Evaluators:
- Evidence accumulator:
- Transfer / exam / AI_OFF:
- Overlay:
- COMPLETE copy:

## Stage-by-stage evidence trace

For each stage: UI asks → student action → stored attempt → evaluator → accumulator flag → derived level risk.

### OBSERVE / DESCRIBE

Weakest passing behavior:

Higher-level model knowledge accidentally credited? YES / NO

### PREDICT

Prediction committed before intervention? YES / NO

Can the student edit history after seeing the result? YES / NO

### EXPERIMENT

UPLP evidence loop closed? YES / NO

Completion means performed, not automatically understood? YES / NO

Result deterministic / app-owned? YES / NO

### EXPLAIN

Remains below model construction where appropriate? YES / NO

Keyword overlap can become L4? YES / NO

### MODEL

Exact behavior that earns valid model evidence:

Formula / slogan / drag-order memorization can pass? YES / NO

Representation tests deep structure? YES / NO

Conditions represented? YES / NO

### TRANSFER

Success based on structural transfer? YES / NO

Surface similarity can pass? YES / NO

Non-transferable relations handled? YES / NO

Required transfer justifies L5? YES / NO

### EXAM

Exam World sequencing preserved? YES / NO

Final answer separate from reasoning? YES / NO

EXAM alone can create L6? YES / NO (must be NO)

### AI_OFF

AI technically and pedagogically absent? YES / NO

Response committed before post-check? YES / NO

Answer-only can pass? YES / NO

Memorized conclusion can pass? YES / NO

Reasoning demonstrates independent model use? YES / NO

`llmUsed` remains false? YES / NO

Can post-check manufacture missing pre-commit reasoning? YES / NO (must be NO)

### COMPLETE

Wording evidence-bounded? YES / NO

Avoids mastery / score-improvement claims without evidence? YES / NO

## Weakest-passing-behavior analysis

| Gate | Weakest behavior that still passes | Acceptable? |
|---|---|---|
| MODEL | | |
| TRANSFER | | |
| EXAM | | |
| AI_OFF | | |

## MODEL shortcut audit

Tried:

- [ ] formula memorization
- [ ] isolated slogans / rules
- [ ] clicking structured radios without reconstructing the structure
- [ ] copying a visible relation

Result:

## TRANSFER shortcut audit

Tried:

- [ ] surface noun change only
- [ ] “looks like the classroom objects”
- [ ] applying a relation that should not transfer

Result:

## EXAM audit

Answer vs reasoning separable? YES / NO

Condition checking present where needed? YES / NO

## AI_OFF independence audit

| Challenge | Answer-only | Conclusion-only | Authorship-only (≥N characters) | Model-based reasoning |
|---|---|---|---|---|
| | fail / pass | fail / pass | fail / pass | fail / pass |

## Evidence claim table

| CLAIM | REQUIRED STUDENT ACTION | RAW EVIDENCE | PROVENANCE | DETERMINISTIC EVALUATOR | MISCONCEPTION / DISTRACTOR CHECK | ACCUMULATED FLAG | DERIVED LEVEL | WEAKEST PASS / KNOWN SHORTCUTS | REVIEW VERDICT |
|---|---|---|---|---|---|---|---|---|---|
| student constructed the model | | | | | | constructedValidCausalModel | L4 only if that flag is true | | |
| student transferred the model | | | | | | successfulTransfer | L5 only after valid model + transfer | | |
| student independently used the model | | | | | | independentAiOffSuccess + llmDisabledDuringIndependent | L6 only after L5 path + AI_OFF | | |

## Overclaim check

Does any copy, test name, or status language claim mastery, score gain, or validation? YES / NO

If YES, quote it:

## Remaining pedagogical risks

-

## Final Gate B result

- [ ] `LEARNING_EVIDENCE_PASS`
- [ ] `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`
- [ ] `LEARNING_EVIDENCE_BLOCKED`
- [ ] `LEARNING_EVIDENCE_OVERCLAIM`
- [ ] `LEARNING_EVIDENCE_SHORTCUT_FOUND`

A PASS or `PASS_WITH_REFINEMENTS` means quality-reviewed **prototype** only.  
It may authorize Library `metadata.status = "prototype"`.  
It does **not** mean learner-validated.
