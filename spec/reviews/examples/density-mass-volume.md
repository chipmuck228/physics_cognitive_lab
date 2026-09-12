# Worked example — density-mass-volume / Scene 04

> Status: quality-reviewed prototype example  
> Date: 2026-09-12  
> MODEL_ID: `density-mass-volume`  
> SCENE_ID: `equal-volume-material-samples`  
> Method: [`../../physics-model-quality-review.md`](../../physics-model-quality-review.md)

This file preserves the Scene 04 pedagogical review so a future reviewer does not need prior chat history.

It does **not** mark the canonical model `validated`.

---

## Why this example exists

Scene 04 shows the core quality principle in one model:

```text
Correct answer
  ≠ Correct reasoning
  ≠ Constructed model
  ≠ Successful transfer
  ≠ Independent model use
```

`ρ = m / V` can be a correct formula and still be insufficient evidence that the student constructed the density model.

---

## Deep structure

Reusable structure, independent of iron/wood blocks:

```text
density is the ratio mass / volume
        +
same V, larger m → larger ρ
        +
same m, larger V → smaller ρ
        +
for a uniform sample, changing amount changes m and V together
so m/V is unchanged
        +
volume must be the relevant positive volume
        +
mass change alone is insufficient (C13)
```

These results come from **one** ratio model, not several independent facts.

MODEL grammar: ratio-quantitative board.  
Not Scene 02's energy chain.  
Not Scene 03's force/motion relation board.

---

## Gate A summary

| Rubric | Verdict |
|---|---|
| A1 Physics Truth | PASS at Grade-9 abstraction. Density is unit volume mass. Official values remain `mass / volume` for `volume > 0`. |
| A2 Deep Structure | PASS. The ratio is reusable beyond the two samples. |
| A3 Boundaries | PASS. No buoyancy, microstructure, or advanced proportion math. Hollow is a volume-condition / boundary problem. |
| A4 Cognitive Target | PASS. Student must reason with m and V together (C8, C9, C13), not recite “密度公式”. |
| A5 Misconceptions | PASS. `dmv-M2` is “质量变大，所以密度一定变大.” Attractive because mass is visible. Discriminator: volume unknown ⇒ density unknown. |
| A6 Anchor | PASS. Same-size, different-weight samples create a need for a third quantity. Do not open with the formula. |
| A7 Experiments | PASS. Experiment C (`cut-uniform-sample`) is high-information: before `m/V` vs after smaller m, smaller V, same ratio. |
| A8 MODEL | PASS only if ratio + three comparisons + proportional invariance + conditions + C13. Formula alone is not L4. |
| A9 Transfer | PASS. Cups or stone = full-model. Hollow = boundary-contrast. Float/sink is available but not required; density alone does not explain floating. |
| A10 Exam | PASS. Same model; answer and reasoning are separate; cut item includes C13. |
| A11 AI_OFF | PASS. Strong evidence requires model-based proportional reasoning, not “same material, so unchanged.” |
| A12 Evidence ladder | PASS. L4/L5/L6 only through `accumulateSamplesSceneEvidence` → `deriveModelEvidenceLevel`. |

**Gate A result:** `MODEL_QUALITY_PASS`

This is **not** `IMPLEMENTATION_READY`. Readiness is a separate engineering-information gate and already passed for this model.

---

## Why formula alone is insufficient for L4

Weak MODEL behavior:

```text
numerator = mass
denominator = volume
result = density
```

and nothing else.

This can be a correct formula. It does **not** show that the student can use the ratio to explain:

- same-volume comparison
- same-mass comparison
- uniform-cut proportional invariance
- why mass increase alone does not determine density

Also insufficient:

```text
ρ = m / V
+ “体积相同，质量大密度大”
+ “质量相同，体积大密度小”
+ “切开密度不变”
```

Those can be three memorized slogans. They do not reconstruct **why** the cut leaves the ratio unchanged.

Minimum L4-supporting MODEL evidence in this Scene:

```text
core ratio ρ = m / V
+ same-volume comparison
+ same-mass comparison
+ uniform-cut: m smaller, V smaller, m/V unchanged, because same proportion
+ volume-positive and uniform-sample conditions
+ C13: mass change alone is insufficient; volume must also be considered
```

Implementation: `buildSamplesModelAttempt` / `hasRatioReasoningStructure` in `lib/learning/samples-model.ts`.  
Accumulator flag: `constructedValidCausalModel`.  
Derived level: L4 only after that flag. Scene files must not assign `"L4"`.

---

## Experiment C is model-critical

`cut-uniform-sample` must make the student compare:

```text
before:  m / V
after:   smaller m, smaller V
```

and notice that when both change in the same proportion, the ratio need not change.

Closing the experiment records that the student performed the comparison.  
It does **not** automatically mean the student understood.  
MODEL then requires reconstruction of that proportional invariance.

Showing the computed density on both sides would leak the conclusion. The implementation shows `m ÷ V` numbers and asks how the two quantities change together.

---

## AI_OFF: conclusion vs model reasoning

Authorship threshold (≥8 Han characters) is completeness evidence only. It never proves physics understanding.

**WEAK — must not satisfy the strongest independent evidence:**

> 因为是同一种物质，所以密度不变。

This can be a memorized conclusion. It does not show ratio reasoning.

**STRONGER — can satisfy the strongest independent evidence:**

> 切开后质量和体积都按相同比例变小，m/V 的比值不变，所以密度不变。

The distinction is **model reasoning**, not text length.

Answer-only still fails.  
Commit before post-check is required.  
`llmUsed === false` is required.

Implementation: `evaluateSamplesAiOffAttempt` in `lib/learning/samples-ai-off.ts`.  
Same-material-alone is a distractor post-check and a conclusion-only authored-text signal.

---

## Evidence claim audit

| CLAIM | REQUIRED STUDENT ACTION | RAW EVIDENCE | DETERMINISTIC EVALUATOR | DISTRACTOR CHECK | ACCUMULATED FLAG | DERIVED LEVEL | KNOWN SHORTCUTS | VERDICT |
|---|---|---|---|---|---|---|---|---|
| student constructed the model | Build one ratio that explains three comparisons, the cut, conditions, and C13 | `ModelAttempt` nodes/conditions | `evaluateSamplesModelStructure` | formula-only; slogan-only; same-material-without-proportion; mass-enough | `constructedValidCausalModel` | L4 | structured radios can still be clicked through | Supported for prototype; residual click-through risk |
| student transferred the model | Reuse ρ = m/V in cups or stone; treat hollow as volume-condition boundary | `TransferAttempt` judgments + explanation | `buildSamplesTransferAttempt` | surface “都是固体块” | `successfulTransfer` only after valid model | L5 | noun change without ratio | Supported |
| student independently used the model | Judge an unfamiliar cut/package case with authored model reasoning and no AI | `IndependentChallengeAttempt` | `evaluateSamplesAiOffAttempt` | answer-only; same-material conclusion; 8 Han chars | `independentAiOffSuccess` + `llmDisabledDuringIndependent` | L6 | keyword heuristics may miss unusual wording | Supported for prototype |

---

## Gate B summary

| Audit | Verdict |
|---|---|
| Weakest MODEL pass | Ratio + comparisons + cut construction + C13. Formula or isolated slogans fail. |
| Weakest AI_OFF pass | Correct judgment + authored proportional / mass-and-volume reasoning + required post-checks + no distractors + `llmUsed === false`. Conclusion-only fails. |
| EXAM → L6 | Cannot. EXAM does not set independent flags. |
| COMPLETE wording | Evidence-bounded; no mastery / score claims. |
| Engineering | TypeScript / Vitest / Playwright contracts pass. Context only. |

**Gate B result:** `LEARNING_EVIDENCE_PASS`

Quality-reviewed prototype only.

---

## Recorded review status

| Dimension | Status |
|---|---|
| Physics Model Quality | PASS |
| Pedagogical Structure | PASS |
| Model Evidence Quality | PASS |
| Transfer Design | PASS |
| AI_OFF Independence Design | PASS |
| Engineering Contract | PASS |
| Learner Validation | NOT YET |

After inventory alignment (D041), Library `metadata.status` is `prototype`.  
`validated` requires future learner evidence. This review must not confer it.

---

## Remaining pedagogical risks

- Structured radios can be completed without the student saying the ratio in their own words.
- Authored-text heuristics can miss unusual but valid wording, or over-accept overlapping keywords.
- Experiment C can close on any completed together-change; understanding is judged at MODEL.
- `79 ÷ 10` next to `39.5 ÷ 5` makes the arithmetic fairly visible.
- Hollow remains a boundary. Students may still want a floating/sinking rule this Scene must not teach as the primary model.
