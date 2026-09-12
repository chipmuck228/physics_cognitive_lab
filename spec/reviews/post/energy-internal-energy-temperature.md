# POST Learning Evidence Review — Gate B

> Independent evidence audit of the implemented running Scene.  
> Canonical method: [`../../physics-model-quality-review.md`](../../physics-model-quality-review.md)  
> Template: [`../templates/post-learning-evidence-review.md`](../templates/post-learning-evidence-review.md)  
> Request: [`../../prompts/review-physics-model-quality.md`](../../prompts/review-physics-model-quality.md)  
> Evidence-design rules: [`../../evidence-design-contract.md`](../../evidence-design-contract.md)

This review inspects the **running implementation**. It does not treat the engineering/migration report, Vitest, or Playwright as proof that the cognitive claims are justified.

It does **not** mark the canonical model `validated`.  
It does **not** write `metadata.status = prototype`. That inventory step is later and separate.

---

## Identity

- Date: 2026-09-12
- Reviewer: Cursor quality review (`MODE=POST`)
- MODEL_ID: `energy-internal-energy-temperature`
- SCENE_ID: `microwave-bread`
- Implementation inspected (paths): listed below
- Engineering status (context only): TypeScript / Vitest / Playwright were available as context. Not a quality result.
- Library `metadata.status`: `draft` (unchanged by this review)
- Learner-validation status: NOT YET

## Implementation inspected

- Canonical model / sitting / overlay:
  - `content/physics-models/energy-internal-energy-temperature/model.ts`
  - `content/physics-models/energy-internal-energy-temperature/implementation-contract.ts`
  - `content/physics-models/energy-internal-energy-temperature/assessment-overlay.ts`
  - `content/physics-models/energy-internal-energy-temperature/exam.ts`
  - `content/physics-models/energy-internal-energy-temperature/transfer.ts`
  - `content/physics-models/energy-internal-energy-temperature/independent-challenges.ts`
- Adapter / derivation:
  - `lib/runtime/adapters/microwave-bread.ts`
  - `lib/learning/microwave-evidence.ts`
  - `lib/physics-models/evidence.ts`
  - `lib/learning/advance.ts`
- Evaluators:
  - `lib/learning/microwave-observe.ts`
  - `lib/learning/microwave-describe.ts`
  - `lib/learning/microwave-predict.ts`
  - `lib/learning/microwave-experiment.ts`
  - `lib/learning/microwave-explain.ts`
  - `lib/learning/microwave-model.ts`
  - `lib/learning/microwave-transfer.ts`
  - `lib/learning/microwave-exam.ts`
  - `lib/learning/microwave-ai-off.ts`
  - `lib/learning/microwave-text.ts`
- Persistence / session:
  - `lib/learning/microwave-scene-data.ts`
  - `hooks/useLearningSession.ts`
- UI / stage tasks:
  - `components/learning/MicrowaveBreadLab.tsx`
  - `components/learning/MicrowaveDescribeTask.tsx`
  - `components/learning/MicrowaveExplainTask.tsx`
  - `components/learning/MicrowaveModelBoard.tsx`
  - `components/learning/MicrowaveTransferTask.tsx`
  - `components/learning/MicrowaveExamTask.tsx`
  - `components/learning/MicrowaveAiOffTask.tsx`
  - `components/learning/MicrowaveCompleteView.tsx`
  - `lib/content/microwave-bread.ts`
- Physics runtime:
  - `lib/physics/microwave.ts`
- Adversarial / E2E files inspected as implementation context only:
  - `tests/learning/microwave-adversarial.test.ts`
  - `tests/e2e/helpers.ts`

## Stage-by-stage evidence trace

```text
UI
  → student action
  → stored attempt
  → deterministic evaluator
  → accumulateMicrowaveSceneEvidence
  → deriveModelEvidenceLevel
```

The Scene never writes `"L4" | "L5" | "L6"`.

### OBSERVE / DESCRIBE

UI asks for a bread-warmer observation plus own words, then object / quantity / change radios plus a sentence.

Weakest passing behavior: observe `bread-warmer` + ≥2 Han; describe radios `bread` + `temperature` + `increases` + a non-everyday sentence such as “面包的温度升高了。”

Higher-level model knowledge accidentally credited? **NO**

“变热了” alone does not establish L2. Everyday-heat-only text fails even with correct radios.

### PREDICT

Prediction committed before intervention? **YES**

Can the student edit history after seeing the result? **NO**

`savePrediction` is PREDICT-only and refuses a second commit once `firstCommittedMicrowavePrediction` exists. EXPERIMENT stores that first committed timestamp as `committedAt`.

### EXPERIMENT

UPLP evidence loop closed? **YES**

Completion means performed, not automatically understood? **YES**

Result deterministic / app-owned? **YES**

`simulateHeating` remains a pedagogical heating approximation. `experimentClaimsAlwaysRaisesTemperature` is hard-false. Experiment evidence is not an accumulator input for L4.

Wrong prediction can still close after honest comparison + reflection. Missing prediction, comparison, or reflection cannot.

### EXPLAIN

Remains below model construction where appropriate? **YES**

Keyword overlap can become L4? **NO**

Sufficient EXPLAIN sets `identifiedRelations` / `identifiesPartialEnergyRelation` only. Noun sandwiches and “吸收热量所以升温” fail.

### MODEL

Exact behavior that earns valid model evidence:

- named system = bread
- energy enters the system
- internal energy changes
- temperature **may** change (not must-rise)
- T ≠ U
- at least one approved essential condition
- authored distinction matching a bounded relational pattern, not a sandwich / slogan / “好好”

Formula / slogan / drag-order memorization can pass? **NO** for slogan / sandwich / keyword-only. Structured radios are required; they are not a three-box keyword boolean.

Representation tests deep structure? **YES** — this model’s energy/state chain, not Scene 02 work slots.

Conditions represented? **YES**

Weakest pass is structured chain + T ≠ U + one condition + a short sentence such as “温度不是内能。” That is still one coherent model unit. Residual recognition/click-through remains.

### TRANSFER

Success based on structural transfer? **YES**

Surface similarity can pass? **NO**

Non-transferable relations handled? **YES**

Required transfer justifies L5? **YES**, after valid MODEL + both required targets.

`targetId` binds kettle vs ice. Ice relation used as a kettle substitute fails. Ordinary T-rise applied unchanged to ice fails. “也是加热” / “情况不一样” / “还在加热” fail.

Kettle authored floor is target-bound (水/壶, energy enters, T rises, not 冰). Internal-energy change for kettle is required in structured judgments, not in the authored tokens. That is residual, not a false L5.

### EXAM

Exam World sequencing preserved? **YES**

Final answer separate from reasoning? **YES**

EXAM alone can create L6? **NO**

Required items are the three reconstructed primary-model patterns. Neighbor heat-vs-work / specific-heat items are not on the required path. Wrong attempts may progress; they are not mastery evidence. Exam is not an accumulator input.

### AI_OFF

AI technically and pedagogically absent? **YES** — tutor panel hidden; `llmUsed === false` required on the assessment; tutor events during AI_OFF block completion.

Response committed before post-check? **YES**

Answer-only can pass? **NO**

Memorized conclusion can pass? **NO** for “变热了”, “好好”, sandwich, “吸收热量所以升温”, “因为是金属”.

Reasoning demonstrates independent model use? **YES** at the weakest pass: spoon requires pre-commit ordinary structure **and** authored energy-enter + U + T-rise + T≠U/heat-not-stored; ice requires pre-commit boundary structure **and** authored energy-can-enter + T-need-not-rise.

`llmUsed` remains false? **YES** for official success. Stored attempt objects always write `llmUsed: false`, but `accepted` still uses evaluate-time `llmUsed === false`, and L6 also requires `independentAssessment.llmUsed === false` plus no tutor-during-independent. Residual bookkeeping, not L6 manufacture.

Can post-check manufacture missing pre-commit reasoning? **NO**

Official `identifies*` / `identifiesConditionOrBoundary` are computed from pre-commit IDs and pre-commit authored text. Post-check writes only `postCheck*` fields. `applyMicrowaveAiOffPostCheck` cannot create a missing boundary flag.

### COMPLETE

Wording evidence-bounded? **YES**

Avoids mastery / score-improvement claims without evidence? **YES**

Copy: traces, not scores, “不表示你已经学会了物理.” A leftover `buildCognitiveProfile` still uses legacy `explanationLevel` internally; COMPLETE UI does not present those numbers as official L-levels.

## Weakest-passing-behavior analysis

| Gate | Weakest behavior that still passes | Acceptable? |
|---|---|---|
| MODEL | Intended radios/checkboxes for energy → U → T-may-change, T ≠ U, one approved condition, plus a short relational distinction such as “温度不是内能。” | YES, with residual structured-UI risk |
| TRANSFER | Kettle: water/ordinary probes + ordinary chain judgments + target sentence naming 水/壶, energy entering, T rise. Ice: energy/state/limit probes + boundary judgments + sentence with energy-in and 不一定. Both required after valid MODEL. | YES, with residual token-floor risk |
| EXAM | Representation → model → answer + ≥2 Han reasoning. Correctness not required for stage exit. | YES; not L6 |
| AI_OFF | Correct judgment + all required pre-commit radios + authored ordinary/boundary sentence + confirming post-check + `llmUsed === false`. | YES, with residual same-text / token-floor risk |

## MODEL shortcut audit

Tried:

- [x] formula memorization
- [x] isolated slogans / rules
- [x] clicking structured radios without reconstructing the structure
- [x] copying a visible relation

Result:

Keyword-only, noun sandwich, “吸收热量所以升温”, “好好”, T = U, energy-in-must-rise, and long meaningless text do not set `constructedValidCausalModel`. Radios without an approved authored distinction fail. A memorized “温度不是内能” sentence without the chain fails. The weakest success still contains the chain in structured relation evidence plus a real distinction/condition. Independent clicks can satisfy the chain only by choosing the intended relation among distractors; that is permitted structured UI, not a false L4.

## TRANSFER shortcut audit

Tried:

- [x] surface noun change only
- [x] “looks like the classroom objects”
- [x] applying a relation that should not transfer

Result:

“也是加热”, microwave surface cue, “水温升高” only, ice-boundary as kettle substitute, ice + “还在加热” / “情况不一样”, and ordinary T-rise copied onto ice all fail. `targetId` is evaluated. Kettle-only cannot create L5. Transfer without MODEL cannot create L5.

## EXAM audit

Answer vs reasoning separable? **YES**

Condition checking present where needed? **YES** on the energy-in and hotter-not-always-more-U items.

## AI_OFF independence audit

| Challenge | Answer-only | Conclusion-only | Authorship-only (≥N characters) | Model-based reasoning |
|---|---|---|---|---|
| `ai-off-unfamiliar-metal-spoon` | fail | fail | fail | pass only with pre-commit ordinary structure + authored energy/U/T + distinction |
| `ai-off-condition-ice-absorbs-energy` | fail | fail | fail | pass only with pre-commit boundary structure + authored energy-in + T-need-not-rise |

Post-check-only ordinary or boundary: fail. `llmUsed === true`: fail.

## Evidence claim table

| CLAIM | REQUIRED STUDENT ACTION | RAW EVIDENCE | PROVENANCE | DETERMINISTIC EVALUATOR | MISCONCEPTION / DISTRACTOR CHECK | ACCUMULATED FLAG | DERIVED LEVEL | WEAKEST PASS / KNOWN SHORTCUTS | REVIEW VERDICT |
|---|---|---|---|---|---|---|---|---|---|
| student constructed the model | Build energy transfer → U change → T may change, with T ≠ U and one essential condition | `ModelAttempt` nodes/conditions + authored distinction | `PRE_COMMIT_STRUCTURED` + `PRE_COMMIT_AUTHORED` | `evaluateMicrowaveModelStructure` / `hasCompletedMicrowaveModel` | must-rise; T = U; heat-stored; sandwich; slogan; “好好” | `constructedValidCausalModel` | L4 only if that flag is true | intended radios + “温度不是内能。” / rejected: keywords, slogan, clicks+好好 | Justified |
| student transferred the model | Apply ordinary chain to kettle/water and refuse unchanged T-rise on ice | `TransferAttempt` with `targetId`, judgments, probes, explanation | structured + authored, target-bound | `evaluateMicrowaveTransfer` / `hasCompletedMicrowaveTransfer` | surface heating; ice-on-kettle; ordinary-on-ice; generic boundary talk | `successfulTransfer` only after valid MODEL + both targets | L5 only after valid model + transfer | kettle sentence naming water/energy/T-rise + ice energy-in/不一定 / rejected: 也是加热, one target only | Justified |
| student independently used the model | Ordinary spoon application and ice boundary, AI off | committed `IndependentChallengeAttempt` + separate post-check ids | official flags from pre-commit only | `evaluateMicrowaveAiOffAttempt` / `hasCompletedMicrowaveAiOff` | metal surface; looks-cold; heat-stored; T = U; must-rise | `independentAiOffSuccess` + `llmDisabledDuringIndependent` | L6 only after L5 path + AI_OFF | pre-commit structure + short complete sentence + confirm post-check / rejected: answer-only, generic, post-check manufacture | Justified |

## Overclaim check

Does any copy, test name, or status language claim mastery, score gain, or validation? **NO**

COMPLETE caution is bounded. Library status remains `draft`. This review does not claim learner validation.

## Remaining pedagogical risks

- Structured MODEL/TRANSFER/AI_OFF can be completed by recognition of intended labels plus a short regex/token sentence. Permitted. Residual click-through.
- Kettle authored helper does not require an 内能 token; U is in structured judgments.
- Authored helpers are token/regex floors, not a semantic parser. A sentence that contains the required tokens while also containing a negation can still satisfy the authored helper if structured choices are correct.
- The same complete mega-sentence containing energy-in, 内能, 温度升高, 不一定, and 温度不是内能 can satisfy both AI_OFF authored helpers. Structured pre-commit and judgments still differ. Named refinement, not L6 manufacture.
- Spoon authored ordinary application is not required to name 勺.
- Attempt records always persist `llmUsed: false`; official L6 still requires evaluate-time and assessment-level `llmUsed === false` and no tutor-during-independent.
- `observedPhenomenon` also requires DESCRIBE, so isolated L1 does not appear. Underclaim, not overclaim.
- Leftover `buildCognitiveProfile` still reads legacy `explanationLevel`. COMPLETE UI does not treat it as official L-levels.

## Final Gate B result

- [ ] `LEARNING_EVIDENCE_PASS`
- [x] `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`
- [ ] `LEARNING_EVIDENCE_BLOCKED`
- [ ] `LEARNING_EVIDENCE_OVERCLAIM`
- [ ] `LEARNING_EVIDENCE_SHORTCUT_FOUND`

A PASS or `PASS_WITH_REFINEMENTS` means quality-reviewed **prototype** only.  
It may authorize a later Library write of `metadata.status = "prototype"`.  
This review does **not** perform that write.  
It does **not** mean learner-validated.

UPLP and L1–L6 semantics were not changed.
