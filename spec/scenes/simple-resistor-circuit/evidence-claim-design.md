# Scene 06 — Evidence Claim Design

> Implementation activity, not a lifecycle status and not a Gate result.  
> Owner of evidence semantics: [`../../evidence-design-contract.md`](../../evidence-design-contract.md)  
> Model: `ohms-law`  
> Scene: `simple-resistor-circuit`  
> PRE: `MODEL_QUALITY_PASS_WITH_REFINEMENTS`  
> Production locks: `content/physics-models/ohms-law/implementation-contract.ts`

This file designs evidence claims **before** React, runtime, or evaluator functions.  
It does **not** change UPLP, L1–L6 meanings, or Scene 01–05.

Official L1–L6 remain Schema-owned and are derived only by `deriveModelEvidenceLevel`.

```text
correct answer
  ≠ reasoning
  ≠ model construction
  ≠ transfer
  ≠ independent model use
```

---

## 1. PRE refinements resolved here

### 1.1 L4 — completeness ≠ construction

`MINIMUM_L4_MODEL_COMPLETENESS` lists what a complete model contains. That is a **designer checklist**.

`MINIMUM_L4_CONSTRUCTION_EVIDENCE` is the **student action** that may set `constructedValidCausalModel`.

A student who memorizes `I = U / R` and clicks six correct structured options has shown **recognition of completeness items**, not construction. That attempt must fail L4.

Do **not** implement MODEL as six independent labeled-correct radios.

### 1.2 L6 — rearrangement misconception

The diagnostic target is ohm-M2: treating `R = U / I` as evidence that changing U or I **manufactures a new resistance**.

“分子变大所以电阻变大” is kept only as an **algebraic slogan variant** of that same distractor. It is not a separate microscopic or resistivity lesson.

Do not require, teach, or credit resistivity / material microstructure.

---

## 2. One coherent L4 student action

The student constructs **one** I–U–R relation on one board, then uses that same relation under both controls.

```text
ONE BOARD
  place I, U, R as distinct quantities
  bind them with I = U / R (or an equivalent form)
  same R: larger U → larger I
  same U: larger R → smaller I
  (both comparisons are uses of the same relation, not two slogans)

ONE AUTHORED SENTENCE, committed with the board
  names a held quantity
  + a changed quantity
  + the consequence for I

ONE REARRANGEMENT REJECT
  changing U or I does not manufacture a new R
```

Completeness may be **inferred** from that one construction. It must not be scored as six answers.

Authorship is bounded, not an essay. It is required for L4.

---

## 3. Evidence Claim Matrix

| Level | Cognitive claim | Required student action | Raw evidence | Provenance | Deterministic evaluator (future) | Accumulated flag | Derived level | Invalid shortcuts |
|---|---|---|---|---|---|---|---|---|
| L1 | Noticed this circuit changed | Record that current readings differ when U or R changes | observation + sufficient DESCRIBE | `PRE_COMMIT_STRUCTURED` and/or authored | future Scene OBSERVE/DESCRIBE gate | `observedPhenomenon` | L1 | watching only; empty text |
| L2 | Named I, U, R as distinct | Identify current, voltage, resistance, closed/open | description triple | structured + authored ≥ authorship floor | future DESCRIBE gate | `identifiedQuantities` | L2 | “变了” only; any non-empty text |
| L3 | Used a partial relation | State **one** controlled comparison, not the complete model | explanation pick + fragment | structured + authored | future EXPLAIN gate | `identifiedRelations` | L3 | formula as complete model; EXPLAIN → L4 |
| L4 | Constructed the model | One-board same-relation both controls + authored control→I bind + rearrangement reject | `ModelAttempt` board + `modelReasoning` | `PRE_COMMIT_STRUCTURED` **and** `PRE_COMMIT_AUTHORED` | future `evaluateOhmsLawModelConstruction` | `constructedValidCausalModel` | L4 | six ticks; I=U/R only; “好好”; slogan without control |
| L5 | Transferred the model | Accept required heating-wire full-model **and** filament boundary, each `targetId`-bound | `TransferAttempt` | structured + authored | future `evaluateOhmsLawTransfer` | `successfulTransfer` only after valid MODEL | L5 | “也是电路”; MODEL alone; wrong-target relation |
| L6 | Used the model independently | Accept both AI_OFF challenges with pre-commit critical structure and LLM off | `IndependentChallengeAttempt` | pre-commit authored/structured; post-check confirmation only | future `evaluateOhmsLawAiOff` | `independentAiOffSuccess` + `llmDisabledDuringIndependent` | L6 | answer-only; post-check manufacture; EXAM; “分子” slogan as the only reason |

`SYSTEM_DERIVED` is only the accumulator → `deriveModelEvidenceLevel`.  
`LLM_GENERATED` must never set a flag.

---

## 4. Evidence Claim Audit — L4

**CLAIM**  
The student constructed the I–U–R relation under its control conditions.

This is **model construction**, not a correct formula, not six completeness ticks, and not EXPLAIN.

**REQUIRED STUDENT ACTION**  
Commit one relation board that uses the same `I = U / R` for both controls, plus one authored sentence that binds a held quantity to an I consequence, plus reject “changing U or I manufactures R.”

**RAW EVIDENCE**

```text
modelBoard.quantities          I, U, R distinct
modelBoard.relation            I = U / R or equivalent
modelBoard.sameRConsequence    larger U → larger I
modelBoard.sameUConsequence    larger R → smaller I
modelBoard.condition           closed; R treated constant
modelBoard.rearrangementReject changing U/I does not make a new R
modelReasoning                 authored string committed with the board
```

**PROVENANCE**  
`PRE_COMMIT_STRUCTURED` (one board) **and** `PRE_COMMIT_AUTHORED` (`modelReasoning`).  
Post-check may confirm. Post-check must not create `constructedValidCausalModel`.

**DETERMINISTIC EVALUATOR** (design only; not implemented)

```text
completenessInferredFromBoard
  AND authoredHasControlAndIConsequence
  AND authoredNotFormulaOnlyOrGenericOrNounSandwich
  AND rearrangementManufacturingRejected
→ constructedValidCausalModel
```

Six independent correct options, even if they enumerate `MINIMUM_L4_MODEL_COMPLETENESS`, stop at recognition. They may support `identifiedRelations` at most.

**MISCONCEPTION / DISTRACTOR CHECK**

| ID | Fail L4 if affirmed |
|---|---|
| ohm-M1 | formula is enough |
| ohm-M2 | U/I manufacture R |
| ohm-M3 | current determines voltage / voltage flows |
| ohm-M4 | larger R ⇒ larger I |
| ohm-M5 | larger U ⇒ larger I with no R control |
| ohm-M6 | battery means current; open lumps U and I |

**ACCUMULATED FLAG**  
`constructedValidCausalModel`

**DERIVED LEVEL**  
May support L4. Must not be inferred from L3.

**WEAKEST PASS / KNOWN SHORTCUTS**

| Probe | Must |
|---|---|
| memorize I=U/R + six correct structured options + empty/generic/formula authored | FAIL |
| correct board + “好好” / “我觉得这样” | FAIL |
| “电流电压电阻” noun sandwich | FAIL |
| “电流等于电压除以电阻” with no held quantity | FAIL |
| “电压大电流就大” with no R control | FAIL |
| only one control on the board | FAIL (partial → L3 at most) |
| one coherent board + authored “电阻没变时，电压更大电流更大” + rearrangement reject | PASS |

**REVIEW VERDICT**  
`BOUNDED` if implemented as one construction + authorship.  
`OVERCLAIM` if implemented as six correct options.

---

## 5. Evidence Claim Audit — L5

**CLAIM**  
The student transferred the same I–U–R relation to a new surface and noticed where the ordinary constant-R application does not transfer unchanged.

This is **transfer**, not MODEL reuse and not “also a circuit.”

**REQUIRED STUDENT ACTION**  
Succeed on the required pair, each bound to `targetId`:

1. `near-heating-wire-one-resistor` (`full-model`)
2. `far-filament-lamp-not-constant-r` (`boundary-contrast`)

**RAW EVIDENCE**

```text
TransferAttempt.targetId
TransferAttempt.heldQuantity
TransferAttempt.relation
TransferAttempt.consequence
TransferAttempt.nonTransfer   (filament only)
TransferAttempt.explanation   authored
```

**PROVENANCE**  
`PRE_COMMIT_STRUCTURED` + `PRE_COMMIT_AUTHORED`, target-specific.  
Wrong-target correct relation does not pass.

**DETERMINISTIC EVALUATOR** (design only)

```text
constructedValidCausalModel
  AND heating-wire: one resistor + named control + I consequence
      (not “也是电路 / 也是 I=U/R”)
  AND filament: I,U,R still distinct AND R may not stay constant
      so I ∝ U with fixed R does not transfer unchanged
      AND not generic “情况不一样”
→ successfulTransfer
```

**MISCONCEPTION / DISTRACTOR CHECK**

- heating-wire: formula-only; voltage-alone; treating heating as a new primary
- filament: “电压加倍电流一定加倍”; “要改学串联”; “要改学电功率”; generic “不一样”
- partial ammeter item is **not** required; using it as success must not create L5

**ACCUMULATED FLAG**  
`successfulTransfer` only after valid MODEL.

**DERIVED LEVEL**  
May support L5.

**WEAKEST PASS / KNOWN SHORTCUTS**

| Probe | Must |
|---|---|
| valid MODEL only | stay L4 |
| “也是电路，所以 I = U / R” on either target | FAIL |
| correct filament boundary written on the heating-wire target | FAIL |
| filament + “情况不一样” | FAIL |
| filament + unrestricted I ∝ U | FAIL |
| heating-wire control+consequence **and** filament constant-R boundary | PASS |

**REVIEW VERDICT**  
`BOUNDED` if both targets are required and surface-only fails.

---

## 6. Evidence Claim Audit — L6

**CLAIM**  
The student used the model independently with the tutor off: ordinary two-control application, and rejection of rearrangement-as-manufacture.

This is **independent model use**, not EXAM, not TRANSFER, not post-check recognition.

### 6.1 Challenge A — `ai-off-unfamiliar-toy-motor-resistor`

Ordinary application on an unfamiliar one-resistor object.

**REQUIRED STUDENT ACTION**  
Pre-commit: name both controls (change U at same R; change R at same U) and the I consequences. Do not only write `I = U / R`.

### 6.2 Challenge B — `ai-off-condition-r-not-made-by-division`

Rearrangement misconception.

**REQUIRED STUDENT ACTION**  
Pre-commit: `R = U / I` computes the same property; changing U does not manufacture a new R; under the model boundary R may still be treated constant, so I increases.

“分子变大所以电阻变大” is a **fail slogan** for the same misconception. It is not the preferred stem wording. Resistivity / microstructure is a distractor, not a required idea.

**RAW EVIDENCE**

```text
IndependentChallengeAttempt.challengeId
preCommitTwoControls / preCommitIConsequence     (A)
preCommitRIsProperty / preCommitRearrangementSameRelation  (B)
judgmentId
postCheck*   confirmation only
llmUsed === false
```

**PROVENANCE**  
Official `independentAiOffSuccess` copies **pre-commit** fields.  
`POST_COMMIT_CONFIRMATION` may reject or confirm. It must not manufacture A’s two-control flags or B’s property/rearrangement flags.

**DETERMINISTIC EVALUATOR** (design only)

```text
A pre-commit two controls + I consequences
  AND B pre-commit R-is-property + rearrangement is not manufacture
  AND both judgments correct
  AND llmUsed === false
  AND post-check does not create missing flags
→ independentAiOffSuccess + llmDisabledDuringIndependent
```

**MISCONCEPTION / DISTRACTOR CHECK**

| Challenge | Fail if |
|---|---|
| A | formula-only; voltage-alone; one control only |
| B | changing U manufactures R; “分子变大所以电阻变大” as the reason; “必须先讲电阻率” |

**ACCUMULATED FLAG**  
`independentAiOffSuccess` and `llmDisabledDuringIndependent`

**DERIVED LEVEL**  
May support L6 only with valid MODEL and TRANSFER already present (Schema derivation). EXAM must not set these flags.

**WEAKEST PASS / KNOWN SHORTCUTS**

| Probe | Must |
|---|---|
| EXAM complete | not L6 |
| answer-only / judgment click | FAIL |
| generic ≥8 Han + correct post-checks | FAIL |
| A: only I=U/R, then tick both controls after commit | FAIL; flags stay false |
| B: only “分子变大不对” without R-as-property / same-relation | FAIL |
| B: resistivity essay | FAIL (out of boundary; not required) |
| `llmUsed !== false` | FAIL |
| genuine A two-control bind + genuine B rearrangement reject + LLM off | PASS |

**REVIEW VERDICT**  
`BOUNDED` if pre-commit authorship/structure carries the flags.  
`OVERCLAIM` if post-check or “分子” slogan-rejection alone creates L6.

---

## 7. EXAM boundary

Ship `PRODUCTION_EXAM_PATTERN_IDS`.  
Store answer and reasoning separately.  
EXAM completion must not set `independentAiOffSuccess` or create L6.

Calculation uses 12 V and 4 Ω, not the lab catalog.

---

## 8. Accumulator contract

Future `accumulateOhmsLawSceneEvidence(session)` writes flags only.

| Flag | Set when | May support | Must not |
|---|---|---|---|
| `observedPhenomenon` | sufficient OBSERVE + DESCRIBE | L1 | later stages |
| `identifiedQuantities` | I, U, R distinct | L2 | become L4 |
| `identifiedRelations` | one partial comparison (EXPLAIN or incomplete board) | L3 | become L4 |
| `constructedValidCausalModel` | L4 construction contract | L4 | six ticks; EXPLAIN; formula only |
| `successfulTransfer` | valid MODEL **and** required pair | L5 | MODEL alone; one target |
| `independentAiOffSuccess` | both AI_OFF accepted from pre-commit | L6 with next flag | EXAM; post-check-only |
| `llmDisabledDuringIndependent` | `llmUsed === false` and no tutor in AI_OFF | L6 | be inferred from COMPLETE |

Never write `"L4" | "L5" | "L6"` in Scene code.

---

## 9. Weakest-pass adversarial plan

These are **test designs** for a later implementation pass. They are not implemented here.

**MODEL**

- six correct completeness options + formula authored → fail
- six correct options + “好好” → fail
- I=U/R only → fail
- one control only → fail L4 (L3 possible)
- noun sandwich → fail
- rearrangement accepted as new cause → fail
- one-board both controls + authored control→I + reject manufacture → pass

**TRANSFER**

- “也是电路” → fail
- MODEL only → stay L4
- filament relation on heating-wire target → fail
- filament + unrestricted proportion → fail
- required pair, target-bound → pass

**AI_OFF**

- answer-only → fail
- post-check manufacture → fail
- A formula-only → fail
- B “分子” slogan without property/same-relation → fail
- B resistivity lecture → fail
- both pre-commit structures + LLM off → pass

---

## 10. What this design forbids in a later UI

- Six independent L4 radios labeled as the six completeness parts
- Hardcoded catalog currents as UI truth
- EXAM creating L6
- Promoting `series-circuit` because an ammeter is in series
- Teaching resistivity to “fix” L6 B

No physics invention is required to implement.
