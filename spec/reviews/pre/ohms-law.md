# PRE Model Quality Review — Gate A

> First PRE for `ohms-law` as Scene 06 primary.  
> Template: [`../templates/pre-model-quality-review.md`](../templates/pre-model-quality-review.md)  
> Method: [`../../physics-model-quality-review.md`](../../physics-model-quality-review.md)

## Identity

- Date: 2026-09-12
- Reviewer: Cursor quality review (`MODE=PRE`)
- MODEL_ID: `ohms-law`
- Intended Scene ID (if known): `simple-resistor-circuit` (design only; no production Scene)
- Intended grade / scope: Grade 9; one ohmic resistor; closed-circuit teaching comparisons; no series/parallel, power, energy, or resistivity course
- Canonical model path: `content/physics-models/ohms-law/`
- Scene spec path (if any): `spec/scenes/simple-resistor-circuit/`

## Primary cognitive target

What must the student learn to THINK or DO?

Use one quantitative relation to decide, under stated controls, how current, voltage, and resistance go together — and to notice that writing `I = U / R` is not the same as using the model.

Target C1–C14 actions:

- C3 Identify Physical Quantities (I, U, R)
- C4 Distinguish Related Concepts (current ≠ voltage ≠ resistance; rearrangement ≠ new cause)
- C7 Identify Conditions / Constraints (closed circuit; R treated constant; which quantity is held the same)
- C8 Compare Variables (same R vs same U)
- C9 Select / Construct Model
- C10 Apply Model
- C11 Qualitative Prediction
- C12 Quantitative Reasoning
- C13 Check Sufficiency (formula alone is not enough; voltage alone is not enough)
- C14 Transfer

Vocabulary the student may learn, but that must not be mistaken for the cognitive target:

- 欧姆定律, I = U / R, 安培 / 伏特 / 欧姆
- Saying “电流等于电压除以电阻” without controls

## Deep structure

Reusable structure, independent of the anchor objects:

```text
I = U / R
        ↓ equivalently, not a new cause
U = I R
R = U / I

same R, larger U → larger I      (I ∝ U)
same U, larger R → smaller I     (I ∝ 1/R)

R is a property under stated conditions.
R = U / I computes R; it does not manufacture R.

C13: reciting the formula is not enough
```

Is this a model rather than a fact / formula / procedure / slogan? YES

Why: Removing the classroom resistor still leaves a reusable controlled-variable relation on any one ohmic component. The formula is the compact form of that relation, not the whole model.

## A1. Physics truth

- Scientifically correct at Grade-9 abstraction? YES
- Quantities, relations, and mechanisms correct? YES
- Mathematical relation incorrectly taught as physical causation? NO
- Important conditions hidden? NO

Notes:

**What the quantities are**

- I: current through the component. Charge passing a cross-section per unit time. Unit A.
- U: potential difference across that same component. Unit V.
- R: resistance of that component under stated conditions. Unit Ω. A property, not a flow.

**Canonical equation**

```text
I = U / R
```

when the circuit is closed, R > 0, and R may be treated as constant (ohmic for the comparison).

**Which relations are proportional**

- R held constant: I ∝ U
- U held constant: I ∝ 1/R

**Which statements are only rearrangements**

`U = I R` and `R = U / I` are the same relation. They must not be taught as “current determines voltage” or “voltage and current create resistance.” `depends-on` in `causalRelations` is used only with those controls. There is no `causes` edge from I to U or from U,I to R.

**Grade-9 boundary kept**

- DC, steady current, one resistor
- no short-circuit R = 0 playground
- no AC, Kirchhoff, semiconductors as conclusions
- filament lamp / heating filament: R may change; model does not claim unrestricted I ∝ U

`causalRelations` carry the controls the claimed direction needs:

- U → I: closed + ohmic + same R + U and I on the same component
- R → I: closed + ohmic + same U + U and I on the same component

## A3. Conditions and boundaries

Valid when:

- circuit closed for a sustained current
- R > 0
- R treated constant for that comparison
- U is across the same component that I passes through
- a stated common quantity (R or U)

Intentional assumptions:

- ideal wires
- DC
- temperature change neglected for the catalog resistors
- one-resistor learning target

The model stops at the I–U–R relation on one ohmic component.

Nearby phenomena that require another model:

- `series-circuit` / `parallel-circuit` — topology
- `electric-power` / `electrical-energy` — energy delivery
- `electrical-resistance` as a material/temperature course beyond “R may not stay constant”
- diodes / non-ohmic devices

Boundary judgment: PASS. The Scene is not an electricity survey.

## A5. Misconceptions

| ID | Incorrect mental model | Observable signal | Why attractive | Discriminating evidence | Target corrected structure |
|---|---|---|---|---|---|
| ohm-M1 | Formula recitation is the model | “套公式就行” / only I=U/R | Exam drilling | Uncontrolled comparison rejected | One relation + stated sameness |
| ohm-M2 | U and I manufacture R | “电阻是算出来的” | R = U/I looks generative | Same conductor, new U, R stays | R is a property; division computes it |
| ohm-M3 | Current determines voltage, or voltage flows | “电流决定电压” / “电压流过去” | Everyday flow talk | Marks U across, I through | Distinct quantities, same relation |
| ohm-M4 | Larger R means larger I, or R is I | “电阻大电流就大” | Bigger word → bigger effect | Same U, larger R, smaller I | Inverse when U is held |
| ohm-M5 | Larger U always means larger I | “电压大电流一定大” | One-variable slogan | U and R both change | Need the control |
| ohm-M6 | Battery means current; open = no U and no I | “有电源就有电流” | One “没电” lump | Open: I = 0, source U may remain | Separate quantities |

## A6. Anchor phenomenon

Anchor: `one-resistor-variable-source`

Creates a need for the model without front-loading the answer? YES

Irrelevant complexity that could dominate: meter wiring, extra circuit elements, brightness of a bulb, “who determines whom” metaphysics.

OBSERVE must still not say “电流等于电压除以电阻”.

## A7. Experiment information-value table

| Experiment ID | Uncertainty resolved | Prediction required first? | New evidence | Distinguishes competing models? | Redundant? | Completable mechanically? |
|---|---|---|---|---|---|---|
| same-resistance-different-voltage | Does I change with U when R is held? | YES | Larger U, larger I at same R | Rejects M5-without-control and “R is I” | No | Later radios |
| same-voltage-different-resistance | Does I change with R when U is held? | YES | Larger R, smaller I at same U | Rejects M4 | No | Later radios |

High-information experiments: both.

Low-information / drop or merge: a third “just compute I = U/R” lab would be mechanical. Calculation stays in EXAM with a reasoning prompt, using numbers **different** from the catalog.

A formula-check activity is locked in MODEL L4, not added as a third experiment.

## A8. MODEL representation

Chosen grammar:

- [x] ratio / quantitative
- other model-owned grammar: one relation plus two controlled comparisons

Why this grammar matches the deep structure: the reusable object is I = U / R and the two controls, not an energy chain and not a force board.

Minimum evidence before MODEL can support L4:

1. identify I, U, R as distinct
2. core relation
3. same R: larger U → larger I
4. same U: larger R → smaller I
5. rearrangement is not a new cause; R is a property
6. closed circuit and R treated constant

Does formula / slogan construction alone count? NO

If a student only selects `I = U / R`, L4 must fail. That is written in `MINIMUM_L4_MODEL_EVIDENCE` and `WEAKEST_PASS_PROBES`. Grading functions are **not** implemented in this pass.

## A9. Transfer audit

| Target ID | Mode | Deep structure that transfers | Surface that changes | What does NOT transfer | Surface similarity could pass? |
|---|---|---|---|---|---|
| near-heating-wire-one-resistor | full-model | one resistor, two controls | 电热丝 | heating as a new model | No if formula-only rejected |
| medium-exam-diagram-one-resistor | full-model | U across / I through the marked resistor | 试卷画法 | “也是电路图” | No if surface-only rejected |
| far-flashlight-cell-and-resistor | full-model | same relation | 手电筒 | brightness, power, multi-lamp | No without a non-transfer limit |
| far-filament-lamp-not-constant-r | boundary-contrast | check whether R stays constant | 小灯泡变亮 | unrestricted I ∝ U | Low |
| partial-ammeter-is-not-series-circuit-course | partial-structure | meter series is measurement | 电流表 | promoting `series-circuit` | Low |

## A10. Exam audit

Same Physics Model? YES

Tests representation / model selection / reasoning, not only final answer? YES

Answer and reasoning separable? YES

Condition checking where appropriate? YES

Accidentally introduces an untaught primary model? NO

Notes: calculation uses 12 V and 4 Ω, not the lab catalog. Filament item tests the boundary, not power or series.

## A11. AI_OFF audit

What independent performance would be strong evidence:

Names the relevant sameness, uses I–U–R, rejects formula-only, and rejects “R is made by U and I”.

| Challenge ID | Unfamiliar? | Model reasoning required | Conditions / boundaries | Memorized conclusion could pass? |
|---|---|---|---|---|
| ai-off-unfamiliar-toy-motor-resistor | medium | YES | two separate controls | “I=U/R” or one slogan is a listed fail |
| ai-off-condition-r-not-made-by-division | high | YES | R is a property | “分子变大电阻变大” must fail |

`llmAllowed: false`.

## A12. Evidence ladder

```text
student action → raw attempt → deterministic evaluation → evidence flag → accumulator → deriveModelEvidenceLevel
```

Does the proposed evidence justify Schema L1–L6 semantics? YES as a **preview**. L4 is relation construction, L5 is new-surface transfer with non-transfer limits, L6 is AI_OFF independent use. Official derivation remains `deriveModelEvidenceLevel`. This package does not assign L-levels in Scene code because there is no Scene.

Risk of assigning L-levels in Scene code: NO in this package.

Weakest-pass attack required by this request:

> A student who only recites I = U / R must not receive L4 / L5 / L6.

The lock and probes say that student fails. Because no evaluator is implemented yet, this is a design claim, not an implementation proof. That is expected at Gate A. It is recorded as a refinement: Evidence Claim Design and the MODEL evaluator must keep this lock or Gate B will fail.

## Risks

- A later Scene can still accept radio click-through unless the six-part L4 lock is implemented.
- Showing meters can silently teach wrong topology if PRI is ignored.
- Chinese copy can still say “电压决定电流” as metaphysics; tutor and UI copy must follow `depends-on` + controls.
- `inferModelRepresentationKind` may not say `ratio-quantitative`. Do not copy Scene 02/03 UIs.
- Catalog 3 V / 6 V / 5 Ω / 10 Ω can become fake UI truth if someone hardcodes 0.6 A.

These are implementation / Gate B / PRI risks, not remaining physics blockers.

## Final Gate A result

- [ ] `MODEL_QUALITY_PASS`
- [x] `MODEL_QUALITY_PASS_WITH_REFINEMENTS`
- [ ] `MODEL_QUALITY_BLOCKED_PHYSICS`
- [ ] `MODEL_QUALITY_BLOCKED_PEDAGOGY`
- [ ] `MODEL_QUALITY_BLOCKED_BOUNDARY`
- [ ] `MODEL_QUALITY_INSUFFICIENT_EVIDENCE_DESIGN`

This result does **not** mean `IMPLEMENTATION_READY`.  
This result does **not** mean learner-validated.

Smallest human decision needed if blocked: n/a

Refinements that remain before a later Readiness / implementation request:

1. Keep `secondaryModels = []`. Do not add series/parallel or power.
2. Implement L4 as the six-part lock; formula-only must fail.
3. Bind every visible I to `officialCurrentA`. Never hardcode catalog currents.
4. If meters appear, PRI-review connections before POST. Prefer omitting meters if connection integrity is uncertain.
5. Do not run Readiness until Evidence Claim Design exists. This PRE does not run that gate.

Library `metadata.status` stays `draft`. This review does not promote lifecycle.

---

## Phase 2 note (not a PRE re-run)

2026-09-12 human review accepted this PRE. Two refinements were resolved in Evidence Claim Design, not by changing Gate A:

1. L4 completeness ≠ construction. Six structured options must fail L4.
2. L6 diagnostic is rearrangement-as-manufacture (`R = U / I` does not create a new R). “分子变大所以电阻变大” is only a slogan variant. No resistivity course.

See `spec/scenes/simple-resistor-circuit/evidence-claim-design.md`.
