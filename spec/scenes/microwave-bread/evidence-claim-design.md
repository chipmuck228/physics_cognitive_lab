# Scene 01 — Evidence Claim Design

> Implementation activity, not a lifecycle status and not a Gate result.  
> Owner of evidence semantics: [`../../evidence-design-contract.md`](../../evidence-design-contract.md)  
> Model: `energy-internal-energy-temperature`  
> Scene: `microwave-bread`  
> PRE: `MODEL_QUALITY_PASS_WITH_REFINEMENTS`  
> Production locks: `content/physics-models/energy-internal-energy-temperature/implementation-contract.ts`

This file is the implemented Scene 01 evidence contract.  
It does **not** change UPLP, L1–L6 meanings, or the canonical Physics Model.  
POST is `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. Inventory `metadata.status` is `prototype`. Quality-reviewed prototype. Not learner-validated.

Official L1–L6 remain Schema-owned and are derived only by `deriveModelEvidenceLevel`.

---

## 1. PRE refinements resolved

**A. Transfer pair.** Required production pair is `near-kettle-heating-water` (`full-model`) plus `far-ice-absorbs-energy` (`boundary-contrast`). `partial-rubbing-hands` stays available, not required, so `internal-energy-change-mechanisms` is not a Scene 01 learning target.

**B. AI_OFF purposes.**  
`ai-off-unfamiliar-metal-spoon` = ordinary application of energy → internal energy → temperature-under-conditions.  
`ai-off-condition-ice-absorbs-energy` = boundary check that energy-in does not justify temperature-must-rise.  
They must not accept the same evidence as success.

---

## 2. Evidence Claim Matrix

| Level | Cognitive claim | Required student action | Raw evidence | Provenance | Deterministic evaluator (future) | Accumulated flag | Derived level | Invalid shortcuts |
|---|---|---|---|---|---|---|---|---|
| L1 | Identified the relevant phenomenon/system | Observe the bread-heating event and record that this system changed | `ObservationEvidence` plus sufficient DESCRIBE | `PRE_COMMIT_STRUCTURED` and/or authored observation | `hasSufficientMicrowaveObservation` | `observedPhenomenon` | L1 | autoplay only; empty text |
| L2 | Described the observable change in physics language | Name object/system, quantity, and change | `DescriptionEvidence` `{ object, quantity, change }` | `PRE_COMMIT_STRUCTURED` + authored ≥2 Han | `hasSufficientMicrowaveDescription` | `identifiedQuantities` | L2 | “变热了” only; any non-empty text |
| L3 | Used a causal relation below full model construction | Connect energy transfer **or** internal-energy change to the observed temperature change, without claiming the complete conditional model | `ExplanationEvidence` structured picks + authored fragment | `PRE_COMMIT_STRUCTURED` + authored | `hasSufficientMicrowaveExplanation` | `identifiedRelations` | L3 | noun sandwich; slogan as complete model; EXPLAIN → L4 |
| L4 | Constructed the model | Build energy transfer → U change → T may change, with T ≠ U and one essential condition | `ModelAttempt` nodes/conditions + bounded authored distinction | `PRE_COMMIT_STRUCTURED` + `PRE_COMMIT_AUTHORED` | `hasCompletedMicrowaveModel` | `constructedValidCausalModel` | L4 | three boxes; “吸收热量所以升温”; keyword sandwich; “好好” |
| L5 | Transferred the model | Accept kettle full-model **and** ice boundary-contrast, each target-specific | `TransferAttempt` with `targetId`, relations, explanation | structured + authored | `hasCompletedMicrowaveTransfer` | `successfulTransfer` only after valid MODEL | L5 | “也是加热”; wrong-target relation; ice + “还在加热”; generic “情况不一样” |
| L6 | Used the model independently | Accept both AI_OFF challenges with pre-commit critical structure and `llmUsed === false` | `IndependentChallengeAttempt` + separate post-check fields | pre-commit authored/structured; post-check confirmation only | `hasCompletedMicrowaveAiOff` | `independentAiOffSuccess` + `llmDisabledDuringIndependent` | L6 | answer-only; generic 8 Han; post-check manufacture; EXAM |

`SYSTEM_DERIVED` is only the accumulator → `deriveModelEvidenceLevel`.  
`LLM_GENERATED` must never set a flag.

---

## 3. L1–L3 contracts

### L1

Required: the student treats **this bread / this heating event** as the system under study.

Invalid: watching autoplay with no record; later experiment run reused as OBSERVE.

### L2

Required structured triple:

```text
object/system = bread (or implied only if quantity + change are explicit)
quantity     = temperature
change       = increases
```

plus a short own-word sentence. “变热了” is everyday language, not the full L2 claim.

### L3

May claim a **partial** relation, for example:

- energy entered the bread, and temperature increased; or
- the bread’s internal energy changed, and temperature increased.

Must **not** claim the complete conditional model. Must **not** set `constructedValidCausalModel`. EXPLAIN completion can remain easier than MODEL.

---

## 4. L4 MODEL contract

Minimum combination:

**PRE_COMMIT_STRUCTURED**

```text
energy transfer into/out of a named system
→ internal energy changes
→ temperature may change
+ temperature ≠ internal energy
+ at least one essential condition:
    no-phase-change for the ordinary T-rise claim
    OR energy-in does not require T rise
    OR heat is a process, not stored stuff
```

**PRE_COMMIT_AUTHORED** (bounded, not an essay)

Must express a relation, not a noun list. Accept families such as:

- 温度不是内能
- 热不是装在里面的东西
- 能量进来，温度不一定升高

Reject:

- three visible boxes with no condition
- “吸收热量所以升温”
- “能量内能温度”
- “好好”
- temperature keyword only
- energy-in must always raise T as the constructed model
- Scene 02 work/mechanical slots
- Q = c m ΔT

Future evaluator: `evaluateMicrowaveModelStructure` → `hasCompletedMicrowaveModel`.

---

## 5. L5 TRANSFER contract

Required pair from `PRODUCTION_TRANSFER_REQUIRED_IDS`.

### Full-model (`near-kettle-heating-water`)

One coherent unit:

```text
target = kettle / water
system = water (or the heated water)
energy transfer = energy enters that system
internal-energy change = water's internal energy increases
temperature relation = T rises
condition = no phase-change / ordinary heating
consequence = temperature increases
```

`targetId` must bind the relation. A correct ice-boundary relation must not pass the kettle target. “也是加热” / “也会变热” / microwave surface match fail.

Hot-water bag may be a retry/scaffold. It is not required for `successfulTransfer`.

### Ice boundary (`far-ice-absorbs-energy`)

Minimum:

```text
energy can enter
+ internal energy / state can change
+ temperature need not rise
+ ordinary T-rise application does not transfer unchanged
```

Do not require latent-heat calculation or a new phase-change MODEL.  
“还在加热”, “情况不一样”, and applying the kettle T-rise relation as if it were sufficient all fail.

Rubbing hands is **not** on the required path.

---

## 6. L6 AI_OFF contract

`llmUsed === false` is required for both. Official independent flags come from **pre-commit** material.

| Challenge | Purpose | Must exist PRE-COMMIT | Post-check may | Must not |
|---|---|---|---|---|
| `ai-off-unfamiliar-metal-spoon` | Ordinary application | energy transfer into the spoon; U change; T rose as observable, not another name for U; heat not stored | confirm those IDs; reject “因为是金属” | create missing energy/U/T-application flags; require the ice boundary as success |
| `ai-off-condition-ice-absorbs-energy` | Boundary check | energy can enter; T need not rise; T unchanged ≠ U unchanged | confirm boundary IDs; reject “看起来还是冷的” | create missing `identifiesConditionOrBoundary`; accept ordinary-application text that never names the boundary |

Suggested Scene-owned fields (no universal schema migration required):

```text
preCommitEnergyTransfer
preCommitInternalEnergyChange
preCommitTemperatureRelation
preCommitConditionOrBoundary
postCheckEnergyTransfer
postCheckInternalEnergyChange
postCheckConditionOrBoundary
```

Official `identifies*` flags copy the pre-commit fields.

---

## 7. EXPERIMENT closure

UPLP five-part loop remains required:

```text
committed prediction
→ intervention
→ observed result
→ comparison (matches / does not match)
→ reflection
```

The microwave run may evidence an **ordinary within-boundary case**: more energy in, same system, no phase change → larger ΔT.

It must **not** be stored or copy-claimed as:

> energy input ALWAYS raises temperature.

Do not add phase-change physics to the microwave engine unless a later Scene request requires it. The boundary is evidenced later by ice TRANSFER and AI_OFF B.

Invalid experiment evidence: no prediction; no comparison; no reflection; OBSERVE autoplay reused as EXPERIMENT; one successful heating run used as universal proof.

---

## 8. AssessmentOverlay and misconceptions

Overlay design already lives on the model and is **not wired** to the legacy adapter.

| Misconception | Diagnostic stages | Required mastery gate? | Overlay / evaluator use |
|---|---|---|---|
| eiet-M1 heat stored | EXPLAIN, MODEL, EXAM, AI_OFF A | Yes for L4/L6 A | reject stored-heat slogans; exam distractor |
| eiet-M2 energy in must raise T | MODEL condition, ice TRANSFER, EXAM, AI_OFF B | Yes for L5 ice / L6 B | not a gate on the microwave experiment itself |
| eiet-M3 hotter ⇒ greater total U | EXAM | Exam item only | not required for L4 |
| eiet-M4 T / heat / U swap | MODEL authored distinction, EXAM, AI_OFF A | Yes for L4 | structured T ≠ U |
| eiet-M5 microwave = the model | TRANSFER surface, AI_OFF A distractor | Diagnostic | “都是加热装置” / “因为是金属” fail |

Diagnostic signal ≠ required mastery evidence. M3 is tested in exam representation; it need not block MODEL.

---

## 9. EXAM boundary

Ship only `PRODUCTION_EXAM_PATTERN_IDS`.

Remove from the required Scene 01 path:

- legacy `exam-q3` heat-vs-work (`internal-energy-change-mechanisms`)
- legacy `exam-q5` specific heat (`specific-heat-capacity`)

Exam World:

```text
stem → what is being asked → representation → model → options
```

Store answer and reasoning separately. Wrong answers may still exit. EXAM must not set `independentAiOffSuccess` or create L6.

---

## 10. Accumulator contract

Future `accumulateMicrowaveSceneEvidence(session)` writes flags only.

| Flag | Set when | May support | Must not |
|---|---|---|---|
| `observedPhenomenon` | sufficient OBSERVE + DESCRIBE | L1 | complete later stages |
| `identifiedQuantities` | sufficient DESCRIBE triple | L2 | become L4 |
| `identifiedRelations` | sufficient EXPLAIN partial relation | L3 | become L4 |
| `constructedValidCausalModel` | completed MODEL contract | L4 | be set by EXPLAIN keywords |
| `successfulTransfer` | valid MODEL **and** required transfer pair | L5 | MODEL alone; one target only |
| `independentAiOffSuccess` | both AI_OFF accepted and LLM off | L6 with next flag | EXAM; post-check-only |
| `llmDisabledDuringIndependent` | `llmUsed === false` and no tutor in AI_OFF | L6 | be inferred from COMPLETE |

Never write `"L4" | "L5" | "L6"` in Scene code.

---

## 11. Weakest-pass adversarial plan

These are **test designs** for the migration pass.

**MODEL**

- temperature keyword only → fail
- 能量内能温度 noun sandwich → fail
- “吸收热量所以升温” → fail
- correct structured chain + “好好” → fail
- temperature = internal energy → fail
- energy in must always raise T as the model → fail
- intended structure + T ≠ U / condition authorship → pass

**TRANSFER**

- “也是加热” → fail
- surface microwave similarity → fail
- correct ice relation on the kettle target → fail
- ice + “还在加热” → fail
- ice + “情况不一样” → fail
- full-model T-rise applied to ice without boundary → fail
- kettle target-appropriate relation → pass
- ice energy-in + T need not rise → pass

**AI_OFF**

- answer-only → fail
- generic ≥8 Han + correct post-checks → fail
- noun sandwich + post-checks → fail
- memorized slogan + post-checks → fail
- weak commit then correct post-checks → fail; official flags stay false
- `llmUsed !== false` → fail
- genuine pre-commit ordinary application + confirmation → pass A
- genuine pre-commit boundary + confirmation → pass B

**EXPERIMENT**

- no prediction comparison → incomplete
- observation without reflection → incomplete
- one successful heating run treated as universal proof → must not set a “always raises T” flag

---

## 12. Minimum legacy migration scope

| Area | Status | Note |
|---|---|---|
| DESCRIBE | MUST CHANGE | Require object + quantity + change; “变热了” insufficient for L2 |
| PREDICT | MUST CHANGE | Keep wrong predictions valid; bind commit before the experiment run |
| EXPERIMENT | MUST CHANGE (evidence claim only) | Keep microwave physics; stop treating it as always-raises-T proof |
| EXPLAIN | MUST CHANGE | Partial relation gate; cannot create L4 |
| MODEL | MUST CHANGE | Chain + condition + authored distinction |
| TRANSFER | MUST CHANGE | Required kettle + ice; remove rubbing from required path |
| EXAM | MUST CHANGE | Reconstructed three patterns; drop neighbor items from required path |
| AI_OFF | MUST CHANGE | Two purposes; pre-commit provenance |
| Accumulator | MUST CHANGE | Replace no-op |
| AssessmentOverlay | MUST CHANGE | Wire model overlay into the adapter |
| Tutor context | KEEP AS-IS | Adapter-owned; update leak list only if MODEL copy changes |
| Persistence | KEEP AS-IS | `sceneData.experimentHistory`; no `scene01Answers` |
| Physics runtime | KEEP AS-IS | Pedagogical heating approximation; no required phase-change sim |
| Adapter registration | KEEP AS-IS | Same `sceneId`; replace completion / accumulateEvidence / overlay |
| COMPLETE copy | OPTIONAL | Keep caution; do not present 0–4 dots as L-levels |
| E2E | MUST CHANGE | Walk new gates; add adversarial cases |
| Rubbing transfer | REMOVE FROM REQUIRED PATH | Available only |
| `explanationLevel` 0–4 | REMOVE FROM REQUIRED PATH | Diagnostic at most |

Smallest safe migration: one evidence-first pass that replaces Scene-owned evaluators, accumulator, overlay wiring, and the MODEL/TRANSFER/EXAM/AI_OFF tasks. Do not rebuild the microwave renderer or Universal Runtime.

---

## 13. Ordered implementation plan

Evidence dependency, not frontend/backend split.

| Order | File / component area | Why required | Evidence claim | Expected test |
|---|---|---|---|---|
| 1 | `implementation-contract.ts` (done) | Locks required IDs | L5/L6 sitting | contract unit test |
| 2 | `lib/learning/microwave-describe.ts` (new Scene-owned) | L2 triple | L2 | reject “变热了” |
| 3 | `lib/learning/microwave-explain.ts` | L3 below MODEL | L3 | EXPLAIN cannot set L4 |
| 4 | `lib/learning/microwave-model.ts` | L4 structure + authored distinction | L4 | slogan / sandwich / three-box fail |
| 5 | `lib/learning/microwave-transfer.ts` | target-specific pair | L5 | wrong-target and ice generic fail |
| 6 | `lib/learning/microwave-ai-off.ts` | provenance | L6 | post-check cannot manufacture |
| 7 | `lib/learning/microwave-exam.ts` | reconstructed patterns | exam ≠ L6 | neighbor items not required |
| 8 | `lib/learning/microwave-evidence.ts` | flags only | L1–L6 derivation | MODEL-only stays L4 |
| 9 | `lib/runtime/adapters/microwave-bread.ts` | wire completion, accumulator, overlay | all | adapter tests; no universal `sceneId` branch |
| 10 | Stage UI tasks (`MicrowaveBreadLab` and MODEL/TRANSFER/AI_OFF panels) | collect the designed evidence | L2–L6 | component tests |
| 11 | Adversarial Vitest file | Evidence Design Contract | L4–L6 | weakest-pass list above |
| 12 | Playwright happy path + AI failure | ENTRY → COMPLETE on new gates | loop | do not mutate session state |

If the pass is too large, split after step 8 (evaluators + accumulator + adapter) then UI + E2E. Do not split by “frontend first.”

---

## 14. Remaining ambiguities

- Whether hot-water bag stays as a visible retry after kettle success is a UX choice. It must not replace ice on the required pair.
- Whether DESCRIBE uses radios or constrained parse is open (`spec/OPEN_QUESTIONS.md` style). The evidence triple is not open.
- Scene 01 student labels may stay local until a later shared-registry migration (O013). That does not block readiness.

No physics invention is required to implement.
