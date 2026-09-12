# Scene 05 Physical Representation Integrity Audit

> Date: 2026-09-12  
> Scene: `equal-mass-heated-samples`  
> Primary model: `specific-heat-capacity`  
> Prior audit: [`physics-truth-audit.md`](./physics-truth-audit.md) — Physics Truth = PASS  
> This audit: student-visible representation vs runtime physics meaning  
> Not: visual polish, evidence review, PRE/POST rewrite, product change

```text
Product UI changed: NO
Physics code changed: NO
Evaluator changed: NO
Evidence semantics changed: NO
UPLP changed: NO
Historical PRE/POST changed: NO
metadata.status changed: NO
```

Correct runtime numbers do **not** imply correct representation.

---

## A. Canonical physics truth summary

Owner: `content/physics-models/specific-heat-capacity/physics-boundary.ts`.

| Quantity | Role | Canonical value (same-mass same-heating) |
|---|---|---|
| m | catalog input | water `0.1` kg; sand `0.1` kg |
| c | catalog constant | water `4200`; sand `840` J/(kg·℃) |
| T₀ | catalog input | both `20` ℃ |
| Q | heating-id table | `Q-same` → `4200` J |
| ΔT | derived `Q / (c · m)` | water `10` ℃; sand `50` ℃ |
| T | derived `T₀ + ΔT` | water `30` ℃; sand `70` ℃ |

Official Q is not `P × t`. Same clock time is a student cue only.

---

## B. Runtime → UI trace

```text
HEATED_SAMPLE_CATALOG / OFFICIAL_HEATING_ENERGY_J
  → HeatSampleState { massKg, specificHeatJPerKgC, initialTemperatureC, absorbedEnergyJ, heated }
  → temperatureChangeC(sample) / finalTemperatureC(sample)
  → EqualMassHeatedSamples
  → student-visible lines
```

Lab binding (`EqualMassHeatedSamplesLab`):

- OBSERVE: `demoState` from `runHeatObserveDemo`
- PREDICT / EXPERIMENT / EXPLAIN / MODEL / TRANSFER: `session.physicsState.state`
- EXAM / AI_OFF / COMPLETE: scene graphic **unmounted**

Template (`components/physics/heat/EqualMassHeatedSamples.tsx`):

```text
{massKg} kg
heated ?  Q {absorbedEnergyJ} J  :  还没加热
temperaturesRevealed
  ?  ΔT {temperatureChangeC} ℃ → {finalTemperatureC} ℃
  :  温度还没读出来
+ unitsNote caption
```

c and T₀ are in runtime state. They are **not** printed on the dishes.

---

## 4. Required trace table

| UI element | Student-visible text | Physical quantity | Runtime source | Derivation | Unit | Integrity verdict | Risk |
|---|---|---|---|---|---|---|---|
| Water mass | `0.1 kg` | m | `sample.massKg` ← catalog `water-100g` | INPUT copy | kg | PASS | none |
| Sand mass | `0.1 kg` | m | `sample.massKg` ← catalog `sand-100g` | INPUT copy | kg | PASS | none |
| Water Q (after heat) | `Q 4200 J` | absorbed energy Q | `sample.absorbedEnergyJ` ← `officialAbsorbedEnergyJ("Q-same")` | RUNTIME_STATE from table | J | PASS | none |
| Sand Q (after heat) | `Q 4200 J` | absorbed energy Q | same | RUNTIME_STATE from table | J | PASS | none |
| Water Q (before heat) | `还没加热` | Q not yet assigned | `heated === false` | state flag | — | PASS | Q hidden, as designed |
| Water ΔT (after) | `10` in `ΔT 10℃ → 30℃` | ΔT | `temperatureChangeC` → `officialTemperatureChangeC` | DERIVED `Q/(c m)` | ℃ | numeric PASS; identity FAIL with neighbor | see PRI-05-01 |
| Sand ΔT (after) | `50` in `ΔT 50℃ → 70℃` | ΔT | same | DERIVED | ℃ | same | same |
| Water T₀ | **NOT DISPLAYED** | T₀ | `initialTemperatureC` = 20 | INPUT / PHYSICAL_CONSTANT | ℃ | missing | PRI-05-01 |
| Sand T₀ | **NOT DISPLAYED** | T₀ | `initialTemperatureC` = 20 | INPUT / PHYSICAL_CONSTANT | ℃ | missing | PRI-05-01 |
| Water T | `30` after the arrow | T_final | `finalTemperatureC` | DERIVED `T₀+ΔT` | ℃ | numeric PASS; unlabeled as T | PRI-01 / PRI-04 |
| Sand T | `70` after the arrow | T_final | same | DERIVED | ℃ | same | same |
| c (both) | **NOT DISPLAYED** on dishes | c | catalog `specificHeatJPerKgC` | PHYSICAL_CONSTANT | J/(kg·℃) | N/A on scene; MODEL uses symbol only | pedagogical hide, not a numeric leak |
| Caption | `质量用千克，温度用℃，能量用焦耳。官方数值由规则算出。加热时间不是能量本身。` | units + Q≠time | `HEAT_COPY.unitsNote` | authored copy | — | physically true; time not shown as a quantity | PRI-05-02 |
| Temperature line (combined) | `ΔT 10℃ → 30℃` | ΔT **and** T glued by `→` | two different functions | two derived values | both ℃ | **AMBIGUOUS** | PRI-05-01 |

---

## C. Quantity identity (PRI-01)

| Display | Intended quantity | What the label actually scopes |
|---|---|---|
| `0.1 kg` | m | clear |
| `Q 4200 J` | Q | clear (`Q` prefixes the number) |
| `ΔT 10℃ → 30℃` | intended: ΔT then T | `ΔT` prefixes the **whole line**; `30` has no `T` / `末温` label |

**PRI-01 finding:** the second number is T, but it sits inside a line that begins with `ΔT`. One visual group, two quantities, one symbol.

---

## D. Unit integrity (PRI-03)

| Quantity | Shown unit | Required | Verdict |
|---|---|---|---|
| m | `kg` | kg | PASS |
| Q | `J` | J | PASS |
| ΔT | `℃` | ℃ (change) | unit token OK |
| T | `℃` | ℃ (state) | unit token OK |
| c | not shown on dishes | J/(kg·℃) | N/A |

No kg/J swap. Both temperature tokens use `℃`, which is conventional, but the **same unit on both sides of `→`** makes “10℃ becomes 30℃” the natural parse. That is a unit-presentation risk, not a wrong unit string.

Caption says 千克 / ℃ / 焦耳 and the card uses kg / ℃ / J. Same quantities; mixed Chinese/SI spelling. P3 only.

---

## E. Relationship semantics (PRI-04)

Inspected relations:

| Visual | What it claims | Physically valid? |
|---|---|---|
| two dishes side by side | comparison of two samples | yes |
| `Q` prefix | this number is absorbed energy | yes |
| `×` `=` on MODEL board | product `c · m · ΔT = Q` | yes (student-built) |
| `ΔT 10℃ → 30℃` | arrow from 10℃ to 30℃ under a ΔT label | **no valid single relation** |

Arrow `→` in this product elsewhere means process / before-after (exam stem: “温度从 20℃ 升到 30℃”). On the dish it connects **ΔT to T**. Those are not the same quantity and not T₀ → T.

**Temperature-line classification: AMBIGUOUS** (relationship itself is invalid even though each number is true).

---

## F. State / derived-value provenance (PRI-05)

| Quantity | Classification | Shown? |
|---|---|---|
| m | INPUT (catalog) copied to RUNTIME_STATE | yes |
| c | PHYSICAL_CONSTANT | dishes: no; MODEL: symbol only |
| T₀ | INPUT / RUNTIME_STATE field | **no** |
| Q | RUNTIME_STATE from heating-id table (not derived from P×t) | after heat only |
| ΔT | DERIVED_QUANTITY | after reveal, glued to T |
| T | DERIVED_QUANTITY | after reveal, unlabeled |

No second authored 10/30/50/70 in the dish component. EXAM calculation stem uses a **different** authored set (2 kg, 4.2×10³, 20℃→30℃, 8.4×10⁴ J). Same formula, not the live catalog. Allowed for exam transfer; not a dish duplicate.

Drift note (from Physics Truth audit): ΔT is catalog-keyed by `sampleId`; displayed m is live `massKg`. Safe today.

---

## G. Scene 05 temperature-line analysis

Implementation:

```tsx
ΔT {temperatureChangeC(sample)} {tempUnit} → {finalTemperatureC(sample)} {tempUnit}
```

| # | Question | Answer |
|---|---|---|
| 1 | What does `ΔT 10℃ → 30℃` mean in code? | Left token = derived ΔT (`10`). Right token = derived T (`30`). Arrow is only JSX punctuation. |
| 2 | Is 10℃ ΔT, T₀, or both? | **ΔT only.** T₀ is 20 and is not printed. |
| 3 | Is 30℃ final temperature? | **Yes.** |
| 4 | What does the arrow connect? | A change (ΔT) to a state (T). Not T₀→T. Not ΔT→ΔT. |
| 5 | Same physical quantity on both sides? | **No.** |
| 6 | Could Grade 9 read “10℃ rises to 30℃”? | **Yes.** That is the ordinary reading of `10℃ → 30℃`. |
| 7 | Does that reading contradict runtime? | **Yes.** Runtime is T₀=20, ΔT=10, T=30. “Started at 10” is false. |
| 8 | Is T₀=20 visible here? | **No.** |
| 9 | Does omitting T₀ add ambiguity? | **Yes.** The missing start state is filled by the left number. |
| 10 | Defect class? | **Representation Integrity defect only.** Physics Truth remains PASS. |

Do **not** treat this as a wrong-engine-number bug.

---

## H. Explanatory copy analysis

Caption (`HEAT_COPY.unitsNote`):

> 质量用千克，温度用℃，能量用焦耳。官方数值由规则算出。加热时间不是能量本身。

| Check | Result |
|---|---|
| Units physically correct? | Yes |
| Matches what is shown? | m, T/ΔT, Q units match. “温度” does not split T vs ΔT. |
| Introduces unrepresented concepts? | “加热时间” never appears as a number or clock on the dishes |
| Time≠Q meaningful here? | Yes as a Scene 05 pedagogical guard (observe/predict copy also says same-time ≈ similar Q) |
| Implies a distinction without UI support? | Mild: student is told time is not Q, but the card never shows a time value to contrast |

“官方数值由规则算出” is accurate and slightly institutional. Not a false physics claim.

Before heating, the same caption still says time is not energy while the card shows `还没加热` / `温度还没读出来`. The warning is context, not a readout.

---

## I. Cross-stage representation consistency

| Stage | Dish graphic | Quantitative pattern | Notes |
|---|---|---|---|
| OBSERVE before demo | yes | m only; Q/T hidden | T₀ still hidden |
| OBSERVE after demo | yes | `Q` + `ΔT n℃ → T℃` | same ambiguous line |
| PREDICT | yes, usually unheated | m; `还没加热`; `温度还没读出来` | consistent with “not yet” |
| EXPERIMENT after run | yes | same `ΔT → T` line | same defect |
| MODEL | leftover last experiment (often Exp C: two waters, 4200 vs 8400 J, `ΔT 10℃ → 30℃` / `ΔT 20℃ → 40℃`) | same line | MODEL board itself uses **symbols** (`比热容 c`, `温度变化 ΔT`), which are identity-correct |
| TRANSFER | **same leftover physics state**, not the kitchen-pot story | same line | Graphic is still two water dishes; task text is 水/油锅. Numbers are true for leftover state, not for the transfer story |
| EXAM | graphic unmounted | stem e.g. “温度从 20℃ 升到 30℃” | Exam **does** name T₀→T correctly, and asks ΔT=10. Notation is **more** intact than the dish line |
| AI_OFF | graphic unmounted | qualitative | no dish numbers |

MODEL board ΔT label = “温度变化 ΔT”. Dish line ΔT = “change glued to final T”. **Same symbol, two representations.**

---

## J. Findings table

| Issue ID | PRI category | UI location | Description | Severity | Physics Truth impact | Evidence impact | Suggested future repair | Status |
|---|---|---|---|---|---|---|---|---|
| PRI-05-01 | PRI-A, PRI-D, PRI-E | `EqualMassHeatedSamples` temperature line | Was `ΔT 10℃ → 30℃`; now `温度：T₀℃ → T℃` plus `升温：ΔT℃` | **P1** | NONE | NONE | Split T₀→T from ΔT | **CLOSED** 2026-09-12 |
| PRI-05-02 | PRI-E | `unitsNote` on every dish view | Copy warns that heating time is not Q, but time is never a displayed quantity | P2 | NONE | NONE | Keep the sentence in observe/predict copy; on the card, either show a non-Q time cue or shorten the caption to units only | Report only |
| PRI-05-03 | PRI-E | MODEL / TRANSFER left pane | Leftover experiment state (often two waters) remains while the task is the product board or a new kitchen scenario | P2 | NONE | NONE | Stage-specific scene state, or hide numbers that are not about the current task | Report only |
| PRI-05-04 | PRI-G | `physics-state.md` header | Still says production physics is not implemented | P3 | NONE | NONE | Update header to match `scene-spec.md` | Report only |

No PRI-B (numeric mismatch). No P0 false engine value.

---

## K. Missing automated coverage

Existing tests lock **computed** ΔT / Q (`tests/physics/equal-mass-heated-samples.test.ts`, `tests/physics-models/specific-heat-capacity.test.ts`).

PRI-05-01 representation is now asserted by:

- `tests/components/equal-mass-heated-samples-representation.test.tsx`
- `tests/e2e/scene-05-pri-temperature.spec.ts`

Candidate tests (do **not** implement in this audit):

1. After heat, the ΔT node’s accessible name / text contains only the temperature-change value (not T).
2. T and T₀ use separate labels from ΔT.
3. If an arrow is used, both ends are the same quantity (T₀ → T), or there is no arrow between ΔT and T.
4. Displayed `massKg` and `absorbedEnergyJ` equal `HeatSampleState`.
5. Displayed units are kg / J / ℃ for m / Q / temperature tokens.
6. Before heat: Q and temperatures are the hidden strings, not `0` or `20`.
7. T₀ is either shown as `20℃` or not presented as the left side of `→`.

---

## L. Final verdicts

```text
Physics Truth: PASS
Numerical Consistency: PASS
Runtime Calculation Integrity: PASS
Physical Representation Integrity: PASS_WITH_REFINEMENTS
```

PRI-05-01 temperature line: **CLOSED** (arrow is now T₀ → T).  
PRI-05-02 / 03 / 04 remain open.

---

## PRI-05-01 Targeted Recheck (2026-09-12)

Repair only. No physics / evaluator / evidence change.

Displayed after heat:

```text
温度：{T₀}℃ → {T}℃
升温：{ΔT}℃
```

Sources: `sample.initialTemperatureC`, `finalTemperatureC(sample)`, `temperatureChangeC(sample)`.

| # | Question | Answer |
|---|---|---|
| 1 | T₀ visible? | **Yes** |
| 2 | ΔT is temperature change? | **Yes** — `升温：` |
| 3 | Tfinal is final temperature? | **Yes** — right of the state arrow |
| 4 | Arrow endpoints same quantity? | **Yes** — temperature state |
| 5 | Can Grade 9 still take ΔT as T₀? | **No** |
| 6 | Values from canonical runtime? | **Yes** |
| 7 | Physics Truth PASS? | **Yes** |
| 8 | Numerical Consistency PASS? | **Yes** |
| 9 | Runtime Calculation Integrity PASS? | **Yes** |

Screenshot: `spec/student-ui/screenshots/scene-05-pri-05-01-repaired.png`

---

## M. Confirmations

```text
Product UI changed: NO
Physics code changed: NO
Evaluator changed: NO
Evidence semantics changed: NO
UPLP changed: NO
Historical PRE/POST changed: NO
metadata.status changed: NO
```
