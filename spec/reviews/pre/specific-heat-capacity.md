# PRE Model Quality Review — Gate A

> Re-run after applying the 2026-09-12 refinements.  
> Template: [`../templates/pre-model-quality-review.md`](../templates/pre-model-quality-review.md)  
> Method: [`../../physics-model-quality-review.md`](../../physics-model-quality-review.md)

## Identity

- Date: 2026-09-12 (re-run)
- Reviewer: Cursor quality review (`MODE=PRE`)
- MODEL_ID: `specific-heat-capacity`
- Intended Scene ID (if known): `equal-mass-heated-samples` (candidate only; no Scene spec, no production Scene)
- Intended grade / scope: Grade 9; no phase change; c treated as constant; no Cp/Cv, microstructure, or heat-transfer-direction course
- Canonical model path: `content/physics-models/specific-heat-capacity/`
- Scene spec path (if any): none

## Primary cognitive target

What must the student learn to THINK or DO?

Use one quantitative relation to decide, under controlled conditions, how absorbed/released energy, mass, specific heat capacity, and temperature change go together — and to notice when temperature or heating time alone is not enough.

Target C1–C14 actions:

- C3 Identify Physical Quantities (Q, m, c, ΔT, T)
- C4 Distinguish Related Concepts (temperature ≠ energy; time ≠ Q; c ≠ “how hot”)
- C7 Identify Conditions / Constraints (no phase change; which quantity is held the same)
- C8 Compare Variables (controlled comparisons from one relation)
- C9 Select / Construct Model
- C10 Apply Model
- C11 Qualitative Prediction
- C12 Quantitative Reasoning
- C13 Check Sufficiency (temperature rose ≠ enough to know Q or c)
- C14 Transfer

Vocabulary the student may learn, but that must not be mistaken for the cognitive target:

- 比热容, Q = c m ΔT, 单位 J/(kg·℃)
- Saying the water “不容易热” without controlling m and Q

## Deep structure

Reusable structure, independent of the anchor objects:

```text
Q = c · m · ΔT
        ↓ equivalently
c = Q / (m ΔT)

same m, same ΔT, larger c → larger Q
same m, same Q, larger c → smaller ΔT
same c, same Q, larger m → smaller ΔT
same c, same m, larger Q → larger ΔT

C13: ΔT or “it got hotter” alone does not determine Q or c
```

Is this a model rather than a fact / formula / procedure / slogan? YES

Why: Removing water and sand still leaves a reusable controlled-variable relation. The formula is the compact form of that relation, not the whole model.

## A1. Physics truth

- Scientifically correct at Grade-9 abstraction? YES
- Quantities, relations, mechanisms correct? YES
- Mathematical relation incorrectly taught as physical causation? NO
- Important conditions hidden? NO

Notes:

`causalRelations` now carry the controls the claimed direction needs:

- c → Q: no phase change + same m + same ΔT
- m → Q: no phase change + same material/c + same ΔT
- ΔT → Q: no phase change + same m + same material/c
- c → ΔT: no phase change + same m + same Q

`depends-on` remains the relation family. Larger c does not “cause heat” without those controls.

Previous defect is closed.

## A3. Conditions and boundaries

Valid when:

- no melting/boiling takeover
- m > 0
- a stated common quantity (m, Q, ΔT, or material)
- Q is energy absorbed/released, not clock time
- c treated as constant in the Grade-9 range

Intentional assumptions:

- heat loss neglected in the laboratory comparison
- same heating process may approximate equal energy input
- no Cp vs Cv

The model stops at the quantitative temperature-change energy relation.

Nearby models: `phase-change-energy`, `heat-transfer-direction`, `energy-internal-energy-temperature`.

Boundary judgment: PASS.

## A5. Misconceptions

| ID | Incorrect mental model | Observable signal | Why attractive | Discriminating evidence | Target corrected structure |
|---|---|---|---|---|---|
| shc-M1 | Hotter means more energy absorbed | “谁烫谁吸热多” | Temperature is visible | Same Q, different c or m | Q needs m, c, and ΔT |
| shc-M2 | Same heating time ⇒ same ΔT | “加热一样久温度就一样” | Time is an easy control | Same time, water vs sand | Time is not Q |
| shc-M3 | More mass ⇒ higher ΔT | “质量大升温一定多” | Everyday “bigger holds more” | Same Q, larger m, smaller ΔT | Energy shared over more mass |
| shc-M4 | c is temperature | “比热容就是温度” | New word mapped to a reading | Same ΔT, different Q | c is energy per mass per degree |
| shc-M5 | Formula without controls | “套公式就行” | Exam drilling | Uncontrolled comparison rejected | One relation + stated sameness |
| shc-M6 | Heating always raises T | “加热温度一定升高” | Common labs | Ice-water, T stays | No-phase-change condition |

## A6. Anchor phenomenon

Anchor: `equal-mass-water-and-sand`

Creates a need for the model without front-loading the answer? YES

Irrelevant complexity: evaporation, heat loss, heater coupling. OBSERVE must still not say “they absorbed exactly the same energy.” Experiment copy now states the time≈Q approximation explicitly.

## A7. Experiment information-value table

| Experiment ID | Uncertainty resolved | Prediction first? | New evidence | Distinguishes competing models? | Redundant? | Mechanical risk? |
|---|---|---|---|---|---|---|
| same-mass-same-heating-different-material | Why ΔT differs under the same visible heating | YES | Different ΔT at same m | Rejects M2 | No | Later radios |
| same-material-same-heating-different-mass | Does more mass get hotter? | YES | Larger m, smaller ΔT | Rejects M3 | No | Later radios |
| same-material-same-mass-different-energy | Does more energy raise ΔT? | YES | Larger Q, larger ΔT | Supports the product | No | Later radios |

The Q-as-outcome comparison is now locked in MODEL L4, not added as a fourth activity. That matches the earlier refinement.

## A8. MODEL representation

Chosen grammar:

- [x] ratio / quantitative

Minimum L4 evidence is now locked as `MINIMUM_L4_MODEL_EVIDENCE`:

1. core relation
2. same m + same ΔT + larger c → larger Q
3. same m + same Q + larger c → smaller ΔT
4. same c + same Q + larger m → smaller ΔT
5. no phase change, and time is not Q
6. C13: temperature alone is insufficient

Does formula / slogan construction alone count? NO

Evaluator L4 text now says formula or three slogans do not count. `checksTemperatureSufficiency` is a required component.

## A9. Transfer audit

| Target ID | Mode | Deep structure that transfers | Surface that changes | What does NOT transfer | Surface similarity could pass? |
|---|---|---|---|---|---|
| near-two-pots-water-and-oil | full-model | same m, approx same Q, different c | kitchen / oil | “also heating” | No if surface-only rejected |
| medium-coastal-vs-inland | full-model | large-c matter, smaller ΔT | weather | wind, season, climate system | No without a non-transfer limit |
| far-car-cooling-water | full-model | larger c ⇒ more Q for same m, ΔT | engine | flow, radiator geometry | No without a non-transfer limit |
| far-ice-water-heated | boundary-contrast | energy can enter without ΔT | ice mixture | writing the whole melt with Q = c m ΔT | Low |
| partial-microwave-bread-already-hot | partial-structure | ΔT can still involve Q, m, c | Scene 01 bread | replacing the energy chain | Low |

`evaluateTransferAttempt` now fails coastal/car explanations that omit a non-transfer limit.

## A10. Exam audit

Same Physics Model? YES  
Tests representation / model / reasoning, not only the final answer? YES  
Answer and reasoning separable? YES  
Condition checking where appropriate? YES  
Accidentally introduces an untaught primary model? NO

## A11. AI_OFF audit

Strong evidence: names the relevant sameness, uses Q–m–c–ΔT, and rejects hotter⇒more heat, same-time⇒same rise, no-rise⇒no energy, and material-name-only.

| Challenge ID | Unfamiliar? | Model reasoning required | Conditions / boundaries | Memorized conclusion could pass? |
|---|---|---|---|---|
| ai-off-unfamiliar-two-lunchboxes | medium | YES | time ≠ Q | “材料不同所以升温不同” is now a distractor / conclusion-only signal |
| ai-off-condition-ice-pack-stays-cold | high | YES | phase-change boundary | “没升温就是没吸热” must fail |

`llmAllowed: false`. Authorship length is not physics.

## A12. Evidence ladder

```text
student action → raw attempt → deterministic evaluation → evidence flag → accumulator → deriveModelEvidenceLevel
```

Does the proposed evidence justify Schema L1–L6 semantics? YES

Risk of assigning L-levels in Scene code: NO in this package (no Scene).

Engineering tests and a possible `IMPLEMENTATION_READY` status remain context only.

## Risks

- A later Scene can still accept radio click-through unless the six-part L4 lock is implemented in the MODEL evaluator.
- Keyword heuristics for non-transfer and material-alone can miss unusual wording; structured post-checks must stay in place.
- `inferModelRepresentationKind` will still not say `ratio-quantitative`. Do not copy Scene 03’s board.
- Same-time ≈ same Q remains an idealization. OBSERVE copy must not collapse it.

These are implementation / Gate B risks, not remaining Gate A blockers.

## Final Gate A result

- [x] `MODEL_QUALITY_PASS`
- [ ] `MODEL_QUALITY_PASS_WITH_REFINEMENTS`
- [ ] `MODEL_QUALITY_BLOCKED_PHYSICS`
- [ ] `MODEL_QUALITY_BLOCKED_PEDAGOGY`
- [ ] `MODEL_QUALITY_BLOCKED_BOUNDARY`
- [ ] `MODEL_QUALITY_INSUFFICIENT_EVIDENCE_DESIGN`

This result does **not** mean `IMPLEMENTATION_READY`.  
This result does **not** mean learner-validated.

Smallest human decision needed if blocked: n/a

The five named refinements from the previous PRE review are now in the canonical model. Library `metadata.status` was not promoted to `validated`.
