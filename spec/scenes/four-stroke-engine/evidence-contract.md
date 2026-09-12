# Scene 02 — Evidence Contract

> Scene-specific evidence mapping  
> Primary model: `chemical-energy-internal-energy-mechanical-energy`

This file does **not** redefine the universal evidence ontology.

- UPLP owns stage evidence *kinds* and EXPERIMENT closure.
- `AccumulatedModelEvidence` and `deriveModelEvidenceLevel()` live in `lib/physics-models/evidence.ts`.
- Official L1–L6 meanings are owned by `spec/physics-model-schema.md`.
- The Scene **never** writes a mastery level. The application derives it.

Keyword extractors such as `extractCausalSignals()` are **signals only**. They must not assign L1–L6.

---

## 1. Scene evidence records

### OBSERVE

Structured observation is the Phase 3 gate. Watching/autoplay may be recorded as `watchedFullCycle`, but it does **not** complete OBSERVE, DESCRIBE, PREDICT, or EXPERIMENT.

```ts
{
  kind: "rawObservation";
  selectedOptionIds: string[];
  watchedFullCycle?: boolean;
  sufficient: boolean;
  text: string; // labels of selected options
}
```

Exact OBSERVE pass condition (`lib/learning/engine-observe.ts`):

1. Student selected `piston-up-down` (活塞会上下运动);
2. **AND** at least one of:
   - `intake-opens` (有时进气门打开)
   - `exhaust-opens` (有时排气门打开)
   - `combustion-one-stage` (有一个阶段出现燃烧)

Distractors never satisfy the gate:

- `combustion-every-stage` (每个阶段都会发生燃烧)
- `piston-only-down` (活塞始终只向下运动)

`selectedOptions.length > 0` is **not** sufficient. Autoplay alone is **not** sufficient.

This record must **never** be reused as EXPERIMENT `intervention` or `observedResult`.

Maps toward: `observedPhenomenon` (with DESCRIBE).

---

### DESCRIBE

Structured-first. Semantic gate. Not “any non-empty text.”

```ts
{
  pistonMotionCorrect: boolean;
  intakeValveStateCorrect: boolean;
  exhaustValveStateCorrect: boolean;
  combustionStateCorrect: boolean;
  distinguishesPowerEvent: boolean;
  text: string;
}
```

Exact DESCRIBE pass condition (`lib/learning/engine-describe.ts`):

1. Piston motion correct on **both** unlabeled snapshots (画面 1 = intake, 画面 2 = power);
2. Intake valve correct **or** power-stroke combustion correct;
3. `distinguishesPowerEvent`: intake snapshot combustion = absent **and** power snapshot combustion = present;
4. Own-word sentence contains at least two Han characters.

The sentence is required as student work, but it is **not** parsed for textbook stroke names and is **not** sufficient by itself. Structured answers are the authoritative gate. The LLM does not decide progression.

Textbook names 吸气/压缩/做功/排气 are **not** required.

Maps toward:

- `observedPhenomenon` → can support **L1**
- identifying fuel / gas / piston / motion as relevant objects → can support **L2** (`identifiedQuantities`)

---

### PREDICT

Prediction is committed **before** the matching intervention. The gate is not `text.length > 0`.

Exact PREDICT pass condition for Experiment A (`lib/learning/engine-predict.ts`):

1. An explicit outcome from `main-output` | `no-main-output` | `unsure`;
2. A student-authored reason with at least two Han characters (`hasOwnWords`);
3. The record is committed, with `timestamp` at or before `interventionAt`.

A wrong prediction is still valid PREDICT evidence. The LLM does not grade correctness.

```ts
{
  experimentId: "ignition-energy-release" | "immovable-mechanical-system";
  prediction: "main-output" | "no-main-output" | "unsure";
  reasoning: string;
  timestamp: string;
  committed: true;
}
```

Experiment B uses the same prediction record shape during the EXPERIMENT stage, after Experiment A has closed. That record is an **experiment-local prediction**, not a second UPLP PREDICT stage. Tutor remains off in EXPERIMENT (UPLP).

Maps toward later EXPLAIN evidence, not mastery.

---

### EXPERIMENT

UPLP five-part closure. Required for each high-information experiment.

Exact EXPERIMENT pass condition (`lib/learning/engine-experiment.ts`):

Both of these experiment IDs have a closed record:

- `ignition-energy-release`
- `immovable-mechanical-system`

A record is closed only when all exist:

1. committed prediction (`prediction` + `predictionReason` + `committedAt`)
2. intervention (`interventionAt` + configuration + `physicsResult` from the deterministic engine)
3. structured `observedResult` (combustion / mechanism motion / main output, each yes or no)
4. explicit `comparison`: `same` | `different` | `partial`
5. student-authored `reflection` (`hasOwnWords`)

Also required: `authoredBeforeIntervention === true` (`committedAt <= interventionAt`).

Clicking run, autoplay, or OBSERVE playback cannot close an experiment. Missing comparison or missing reflection blocks closure.

Physics IDs and Scene/model IDs stay distinct. The learning layer maps:

- `ignition-energy-release` → `runCombustionDisabledExperiment()`
- `immovable-mechanical-system` → `runLockedMechanicalSystemExperiment()`

The student observation is stored separately from `physicsResult`. The LLM is not the correctness authority.

```ts
{
  experimentId: "ignition-energy-release" | "immovable-mechanical-system";
  prediction: string;
  predictionReason: string;
  committedAt: string;
  interventionAt: string;
  intervention: {
    combustionEnabled?: boolean;
    pistonCanMove?: boolean;
  };
  observedResult: {
    combustionOccurred: "yes" | "no";
    mechanismMoving: "yes" | "no";
    mainOutputOccurred: "yes" | "no";
  };
  comparison: "same" | "different" | "partial";
  reflection: string;
  physicsResult: EnginePhysicsSnapshot; // from deterministic physics, never from LLM
  authoredBeforeIntervention: true;
}
```

Expected conceptual outcomes:

| experimentId | combustionOccurred | mainOutputOccurred |
|---|---|---|
| `ignition-energy-release` with `combustionEnabled = false` | false | false |
| `immovable-mechanical-system` with `pistonCanMove = false` | true (if combustion still enabled) | false |

On Experiment A, `crankshaftMoving` may still be true while `mechanicalOutput != main-output`.

Partial relation recognition after experiments may support **L3** (`identifiedRelations`). That is still not L4. EXPERIMENT closure does not complete EXPLAIN.

---

### EXPLAIN

Causal preparation for MODEL. Not a keyword exam. Not L4.

Exact EXPLAIN pass condition (`lib/learning/engine-explain.ts`):

1. Working-gas change is identified;
2. Mechanical interaction is identified;
3. Combustion / energy release is **not** treated as direct crank output;
4. Own-word sentence with at least two Han characters.

Textbook phrases 化学能 / 内能 / 机械能 are **not** required.

```ts
{
  text: string;
  referencesCombustionOrEnergyRelease: boolean;
  identifiesWorkingGasChange: boolean;
  identifiesMechanicalInteraction: boolean;
  identifiesWorkLikeCausalLink: boolean;
  distinguishesCombustionFromDirectMechanicalOutput: boolean;
  sufficient: boolean;
}
```

Does **not** set `constructedValidCausalModel`. EXPLAIN prepares MODEL.

---

### MODEL

Structured causal-model evidence. Suitable for **L4** only if the structure is valid.

```ts
{
  nodes: Array<{
    id: "fuel-chemical-energy"
      | "working-gas-internal-energy-or-state"
      | "mechanical-system"
      | "mechanical-energy";
    placed: boolean;
  }>;
  relations: Array<{
    from: string;
    to: string;
    kind: "conversion" | "changes-state" | "work";
  }>;
  enablingProcesses: Array<"combustion-occurs">;
  conditions: Array<"movable-mechanical-system" | "gas-does-work">;
}
```

Valid L4-supporting structure (logical, not UI pixels):

```text
燃料的化学能
    --conversion (enabled by combustion-occurs)-->
工作气体的内能/状态
    --work (requires movable-mechanical-system)-->
机械能
```

Invalid structures (must **not** count as L4):

- combustion placed as a `PhysicalQuantity` node that *is* the energy;
- `化学能 → 机械能` with no work relation;
- `燃烧 → 曲轴` with no working-gas / work step;
- keyword overlap in a free-text box with no graph/chain.

The Scene stores this structured record. `deriveModelEvidenceLevel` may then see `constructedValidCausalModel: true`.

---

### TRANSFER

Reference the model's `transferTargets`. Do not duplicate stories.

```ts
{
  targetId:
    | "near-motorcycle-piston-engine"
    | "medium-lab-combustion-piston"
    | "far-steam-piston";
  transferMode: "full-model" | "partial-structure";
  selectedRelations: string[];
  rejectedRelations: string[];
  conditionReasoning?: string;
  studentExplanation: string;
  accepted: boolean;
  failureKinds?: string[];
}
```

Acceptance rules (owned by the model evaluator / Schema transfer semantics, summarized here):

- near / medium (`full-model`): reusable full chain as structured relations plus order;
- far (`partial-structure`): structured 内能/状态变化 → 做功 → 机械能, **and not** forcing 化学能 → 内能, **plus** authored distinction of that transferable / non-transferable split;
- isolated tokens such as “化学能 / 来源 / 不一定” or “情况不一样” are not authored structural evidence;
- `expectedModelId` is not required for partial-structure;
- “有活塞” alone → `accepted: false`.

Production TRANSFER closes after one accepted full-model target **and** the accepted steam partial-structure target. The medium lab target may be used as retry/scaffold.

A true accepted required pair may set `successfulTransfer`. That can support **L5** only after a valid MODEL (`constructedValidCausalModel`). The Scene does not write `"L5"`.

---

### EXAM

```ts
{
  patternId: string; // from the model's examPatterns
  representationRecognition: string;
  modelRecognition: string;
  selectedAnswer?: string;
  reasoning: string;
}
```

`selectedAnswer` and `reasoning` stored separately.

Correct click without reasoning / without Exam World sequence is **not** model evidence.

Production EXAM uses three representative `examPatterns` (see [`exam-mapping.md`](./exam-mapping.md)). Completion requires structured attempts on that subset, not a perfect score, and must not set `independentAiOffSuccess` or support **L6**.

Exam World sequence is owned by UPLP. See [`exam-mapping.md`](./exam-mapping.md).

---

### AI_OFF

```ts
{
  challengeId:
    | "ai-off-unfamiliar-combustion-piston"
    | "ai-off-condition-locked-mechanism";
  selectedAnswer: string;
  studentReasoning: string;
  postCheckIds: string[];
  answerCorrect: boolean;
  reasoningSignals: { ... };
  accepted: boolean;
  llmUsed: false;
  completedWithoutAI: true;
}
```

The independent response is committed before any structured post-check. Post-check cannot rewrite the first answer or reasoning. Critical independent-model flags (`identifiesWorkRelation`, `identifiesConditionOrBoundary`) come from the committed response (`preCommitWorkRelation` / `preCommitConditionOrBoundary`). Post-check may confirm or reject; it must not manufacture those flags. Official evaluation is deterministic. Successful independent reconstruction + condition awareness, with `llmUsed = false`, may set:

```ts
{
  independentAiOffSuccess: true;
  llmDisabledDuringIndependent: true;
}
```

That is required for **L6** via `accumulateEngineSceneEvidence` → `deriveModelEvidenceLevel`. The Scene never writes `"L6"`. EXAM completion alone must not mark L6.

---

## 2. Mapping onto AccumulatedModelEvidence

| Accumulated field | Typical Scene sources | May support |
|---|---|---|
| `observedPhenomenon` | OBSERVE + DESCRIBE | L1 |
| `identifiedQuantities` | DESCRIBE objects/quantities (fuel, gas, piston, motion) | L2 |
| `identifiedRelations` | EXPERIMENT reflection / EXPLAIN partial relations | L3 |
| `constructedValidCausalModel` | MODEL structured chain (not keywords) | L4 |
| `successfulTransfer` | accepted TRANSFER, after valid model | L5 |
| `independentAiOffSuccess` | valid AI_OFF responses | L6 (with next flag) |
| `llmDisabledDuringIndependent` | application: zero tutor calls in AI_OFF | L6 |

The Scene writes **evidence flags**. It does not assign `"L4"` in UI or session state.

---

## 3. What must not happen

- OBSERVE autoplay satisfying EXPERIMENT.
- DESCRIBE gated only on `text.length > 0`.
- L4 from `extractCausalSignals().suggestsCompleteChain` alone.
- L5 from recognizing a piston.
- L6 from MODEL or TRANSFER.
- Any LLM-written `EngineState` stored as experimental result.
