# Scene 05 — Equal-mass heated samples

> Version: 0.1 — Scene-specific specification  
> Scene ID: `equal-mass-heated-samples`  
> Primary model: `specific-heat-capacity`  
> Production UI: implemented (`/scenes/equal-mass-heated-samples`); quality-reviewed prototype

## Architecture alignment

This file is **not** a source of truth for UPLP, the Physics Model schema, or the model library.

- Universal stages: [`../../universal-physics-learning-protocol.md`](../../universal-physics-learning-protocol.md)
- Model contract: [`../../physics-model-schema.md`](../../physics-model-schema.md)
- Canonical IDs: [`../../physics-model-library.md`](../../physics-model-library.md)
- Concrete model: [`../../../content/physics-models/specific-heat-capacity/`](../../../content/physics-models/specific-heat-capacity/)
- Implementation protocol: [`../../physics-model-implementation-protocol.md`](../../physics-model-implementation-protocol.md)
- Quality review: [`../../physics-model-quality-review.md`](../../physics-model-quality-review.md)
- PRE record: [`../../reviews/pre/specific-heat-capacity.md`](../../reviews/pre/specific-heat-capacity.md)

If this file conflicts with those documents, they win.

Do not weaken the PRE-approved relation, L4 lock, or heating-time approximation to make implementation easier.

---

## 1. Scene identity

```ts
const equalMassHeatedSamplesScene = {
  id: "equal-mass-heated-samples",
  primaryModel: "specific-heat-capacity",
  secondaryModels: ["measurement-mass", "measurement-temperature"],
  phenomenonId: "equal-mass-water-and-sand",
  visualType: "interactive",
  physicsEngine: "deterministic-equal-mass-heat-samples",
} as const;
```

This is the **production anchor Scene**. There is no second candidate.

Secondary IDs are already registered. They may later help students read a balance or a thermometer. They must not become a second MODEL task in this loop.

---

## 2. Purpose

Help a Grade 9 student construct and use:

```text
Q = c · m · ΔT
        ↓ equivalently
c = Q / (m ΔT)
```

from one relation, not from slogans or from Scene 01's energy chain.

Do not open the Scene with the sentence “热量等于比热容乘质量乘温度变化”.

---

## 3. Pedagogical boundaries

This Scene must **not** conclude:

- heating time is Q
- hotter always means more heat
- more mass always means hotter
- heating always raises temperature
- this formula replaces `energy-internal-energy-temperature`
- metal feeling colder is this model's job (`heat-transfer-direction`)
- ice remaining at 0℃ is covered by `Q = c m ΔT` (`phase-change-energy`)

Same heater / same clock time is only an **approximation** that absorbed energy can be treated as similar. Official Q is a table lookup on the named engine, not `P × t` as physical truth.

---

## 4. MODEL builder — runtime validation point

Do **not** reuse Scene 02’s four-slot energy chain.  
Do **not** reuse Scene 03’s three-case force/motion board.  
Do **not** reuse Scene 04’s mass / volume / density table.

The builder must express a **product / ratio** board:

```text
[比热容 c]  ×  [质量 m]  ×  [温度变化 ΔT]  =  [吸收或放出的能量 Q]
```

plus controlled comparisons that come from **one** relation:

- same m, same ΔT, larger c → larger Q
- same m, same Q, larger c → smaller ΔT
- same c, same Q, larger m → smaller ΔT
- same c, same m, larger Q → larger ΔT

Assembling `Q = c m ΔT` alone is not valid MODEL evidence.  
Three isolated slogans are not valid MODEL evidence.

Minimum L4 evidence (all required):

1. `core-relation-q-equals-c-m-delta-t`
2. `same-mass-same-delta-t-larger-c-larger-q`
3. `same-mass-same-q-larger-c-smaller-delta-t`
4. `same-c-same-q-larger-mass-smaller-delta-t`
5. `no-phase-change-and-time-is-not-q`
6. `c13-temperature-alone-is-insufficient`

Readiness inference may report `relation-condition` because it only maps density keys to `ratio-quantitative`. That inference must **not** change the builder. Implementation still uses this board.

---

## 5. Deterministic physics

Named engine: `deterministic-equal-mass-heat-samples`.

Official values are computed as `ΔT = Q / (c · m)` when there is no phase change on the interval. The LLM must not invent masses, temperatures, energies, or results.

See [`physics-state.md`](./physics-state.md). Production physics code is **not** in this change.

---

## 6. Deterministic experiments

All three are high-information and require the UPLP five-part evidence kinds. Q-as-outcome comparison stays in MODEL, not as a fourth experiment.

| id | What is controlled | Official pair |
|---|---|---|
| `same-mass-same-heating-different-material` | same m, same official Q, different material | water-100g vs sand-100g, `Q-same` |
| `same-material-same-heating-different-mass` | same material, same official Q, different m | water-100g vs water-200g, `Q-same` |
| `same-material-same-mass-different-energy` | same material, same m, different official Q | water-100g, `Q-same` vs `Q-double` |

Clock time may appear as a student cue. It is not the observed result for Q.

---

## 7. Evaluator requirements

Stage completion is Scene-owned and deterministic. Keyword extractors in `evaluator.ts` are diagnostic signals only. They must not assign L1–L6.

`modelEvaluator.requiredComponents` stays model-owned. Do not add Scene 02 energy-chain keys or Scene 04 density keys.

MODEL completion must require `MINIMUM_L4_MODEL_EVIDENCE` in full.

Transfer evaluator:

- `full-model` requires the core relation and rejects heat/temperature conflation and surface-only wording
- `medium-coastal-vs-inland` and `far-car-cooling-water` fail with `missing-non-transfer-limit` if the student does not state what does **not** transfer
- `boundary-contrast` requires the core relation and rejects “heating always raises temperature”
- `partial-structure` may keep the Q relation without replacing Scene 01's chain

---

## 8. AssessmentOverlay requirements

`specificHeatCapacityAssessmentOverlay` is the production answer overlay. Do not duplicate official keys in React. Do not use `options[0]` as “the intended choice.”

Overlay already covers every canonical exam pattern and every AI_OFF challenge. Judgments use `correct: true` on the option, never array index.

---

## 9. Transfer / exam / AI_OFF sitting

TRANSFER required pair (implementation choice, locked here):

- `near-two-pots-water-and-oil` — `full-model`
- `far-ice-water-heated` — `boundary-contrast`

Available but not required in one sitting:

- `medium-coastal-vs-inland` — if shipped, non-transfer limit is mandatory
- `far-car-cooling-water` — if shipped, non-transfer limit is mandatory
- `partial-microwave-bread-already-hot` — `partial-structure`; expected model `energy-internal-energy-temperature`

EXAM ships all five overlay-covered patterns.

AI_OFF ships both challenges. `llmAllowed` is false. Reject:

- same time ⇒ same ΔT
- conclusion-only “材料不同所以升温不同”
- no temperature rise ⇒ no energy

Authorship length is not physics.

---

## 10. Implementation status

Production Scene now exists on the Universal Runtime. UPLP, L-level semantics, and Scene 01–04 student-visible behavior remain unchanged. Library `metadata.status` is `prototype` after POST `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. This is not learner validation.
