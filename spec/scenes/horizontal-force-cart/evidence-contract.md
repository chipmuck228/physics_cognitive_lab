# Scene 03 — Evidence Contract

> Scene-specific evidence mapping  
> Primary model: `force-changes-motion-state`

This file does **not** redefine the universal evidence ontology.

- UPLP owns stage evidence *kinds* and EXPERIMENT closure.
- `AccumulatedModelEvidence` and `deriveModelEvidenceLevel()` live in `lib/physics-models/evidence.ts`.
- Official L1–L6 meanings are owned by `spec/physics-model-schema.md`.
- The Scene **never** writes a mastery level. The application derives it.

Keyword extractors such as `extractForceMotionSignals()` are **signals only**. They must not assign L1–L6.

Scene-specific records live in `LearningSession.sceneData`. Do not add `scene03Answers` as a universal top-level field.

---

## 1. Scene evidence records

### OBSERVE

Structured observation is the gate. Watching/autoplay may be recorded, but it does **not** complete OBSERVE, DESCRIBE, PREDICT, or EXPERIMENT.

```ts
{
  kind: "rawObservation";
  selectedOptionIds: string[];
  watchedDemo?: boolean;
  sufficient: boolean;
  text: string;
}
```

Proposed OBSERVE pass condition:

1. Student selected `started-moving` **or** `sped-up`;
2. **AND** selected `initially-still` (or another true initial-state option if the demo starts at rest).

Distractors never satisfy the gate:

- `always-reverses`
- `has-wheels-so-must-speed-up`
- `cart-is-on-screen` alone

`selectedOptions.length > 0` is **not** sufficient. Autoplay alone is **not** sufficient.

This record must **never** be reused as EXPERIMENT `intervention` or `observedResult`.

Maps toward: `observedPhenomenon` (with DESCRIBE).

---

### DESCRIBE

Structured-first. Semantic gate. Not “any non-empty text.”

```ts
{
  objectIsCart: boolean;
  initialMotionState: "still" | "moving-left" | "moving-right" | "";
  forceDirection: "none" | "left" | "right" | "";
  observedChange: "started-moving" | "sped-up" | "slowed-down" | "reversed" | "unchanged" | "";
  text: string;
}
```

Pass when all of the following are true:

1. `objectIsCart`;
2. a non-empty `initialMotionState`;
3. a non-empty `forceDirection`;
4. `observedChange` is a real motion-state change from the demo (`started-moving` or `sped-up` for the opening demo);
5. own-word sentence contains at least two Han characters.

The sentence is required as student work, but it is **not** parsed for the textbook slogan and is **not** sufficient by itself. Structured answers are the authoritative gate. The LLM does not decide progression.

Maps toward:

- `observedPhenomenon` → can support **L1**
- identifying object / motion state / force direction as relevant quantities → can support **L2** (`identifiedQuantities`)

---

### PREDICT

Prediction is committed **before** the matching intervention. The gate is not `text.length > 0`.

```ts
{
  experimentId: "force-with-motion" | "force-against-motion" | "zero-net-force-while-moving";
  prediction: "sped-up" | "slowed-down" | "unchanged" | "reversed" | "unsure";
  reasoning: string;
  timestamp: string;
  committed: true;
}
```

UPLP PREDICT pass: Experiment A (`force-with-motion`) has an explicit outcome, own words, and `committedAt <= interventionAt`.

A wrong prediction is still valid PREDICT evidence. The LLM does not grade correctness.

Experiments B and C use the same shape during EXPERIMENT as experiment-local predictions. Tutor remains off.

Maps toward later EXPLAIN evidence, not mastery.

**Type note:** If production writes into universal `PredictionEvidence.experimentId`, that field is currently an engine-id union. Until it is widened to `string`, Scene 03 must keep these records in `sceneData`. That is the adapter extension bag, not a `sceneId` branch.

---

### EXPERIMENT

UPLP five-part closure. Required for each high-information experiment.

A record is closed only when all exist:

1. committed prediction
2. intervention + `physicsResult` from the deterministic cart rule
3. structured `observedResult` (speed change / direction change / unchanged)
4. explicit `comparison`: `same` | `different` | `partial`
5. student-authored `reflection`

Also required: `authoredBeforeIntervention === true`.

Clicking run, autoplay, or OBSERVE playback cannot close an experiment.

```ts
{
  experimentId:
    | "force-with-motion"
    | "force-against-motion"
    | "zero-net-force-while-moving";
  prediction: string;
  predictionReason: string;
  committedAt: string;
  interventionAt: string;
  intervention: { netForce: "left" | "right" | "zero" };
  observedResult: {
    speedChange: "up" | "down" | "none";
    directionChanged: "yes" | "no";
    motionStateChange: "started-moving" | "sped-up" | "slowed-down" | "reversed" | "unchanged";
  };
  comparison: "same" | "different" | "partial";
  reflection: string;
  physicsResult: CartState;
  authoredBeforeIntervention: true;
}
```

Expected conceptual outcomes:

| experimentId | motionStateChange |
|---|---|
| `force-with-motion` | `sped-up` |
| `force-against-motion` | `slowed-down` (reversal not required) |
| `zero-net-force-while-moving` | `unchanged` |

Partial relation recognition after experiments may support **L3** (`identifiedRelations`). That is still not L4. EXPERIMENT closure does not complete EXPLAIN.

Do **not** require microwave `actualResult.finalTemperatureC` or engine `combustionOccurred` fields. Those belong to other Scenes.

---

### EXPLAIN

Causal preparation for MODEL. Not a keyword exam. Not L4.

Pass when:

1. Force is distinguished from motion;
2. Nonzero net force is connected to a motion-state change;
3. Zero net force is **not** treated as “must be stationary”;
4. Own-word sentence with at least two Han characters.

Textbook slogan 力能改变物体运动状态 is **not** required and is **not** sufficient.

```ts
{
  text: string;
  distinguishesForceFromMotion: boolean;
  connectsNonzeroForceToChange: boolean;
  treatsZeroNetForceAsUnchanged: boolean;
  doesNotRequireForwardForceToKeepMoving: boolean;
  sufficient: boolean;
}
```

Does **not** set `constructedValidCausalModel`. EXPLAIN prepares MODEL.

---

### MODEL

Structured relation evidence. Suitable for **L4** only if the structure is valid.

```ts
{
  currentMotionState: "still" | "moving-left" | "moving-right";
  netForceCondition: "zero" | "same-as-motion" | "opposite-to-motion";
  resultingChange: "sped-up" | "slowed-down" | "reversed" | "unchanged" | "started-moving";
  conditions: Array<"one-dimensional-motion" | "friction-omitted" | "net-force-zero-unchanged">;
}
```

Valid L4-supporting structure (logical, not UI pixels):

```text
当前运动状态
    +  合力条件 / 与运动方向的关系
    →  运动状态变化
条件：一维、忽略摩擦；合力为零则运动状态不变
```

The student must show **both**:

- nonzero net force can change motion state (including direction relation);
- zero net force leaves motion state unchanged.

Invalid structures (must **not** count as L4):

- four energy-conversion slots with relabeled boxes;
- `有力 → 一定运动`;
- `合力为零 → 一定静止`;
- `力的方向必须等于运动方向` with no opposite-force path;
- keyword overlap in a free-text box with no relation board.

The Scene stores this structured record. `deriveModelEvidenceLevel` may then see `constructedValidCausalModel: true`.

---

### TRANSFER

Reference the model's `transferTargets`. Do not duplicate stories.

```ts
{
  targetId:
    | "near-bicycle-speeding-up"
    | "medium-ball-opposite-force"
    | "far-hover-constant-velocity";
  transferMode: "full-model" | "boundary-contrast";
  selectedRelations: string[];
  rejectedRelations: string[];
  conditionReasoning?: string;
  studentExplanation: string;
  accepted: boolean;
  failureKinds?: string[];
}
```

Acceptance:

- near / medium (`full-model`): the **target-appropriate** current-motion + net-force + consequence relation, not any core relation and not isolated vocabulary;
- far (`boundary-contrast`): currently moving + zero net force → unchanged, and **not** forcing “must stop” or “must still have a forward force”;
- “有轮子” / “也是小车” / “好好” / “情况不一样” / “合力” alone → `accepted: false`.

Production TRANSFER closes after one accepted full-model target **and** the accepted hover boundary-contrast. The medium ball target may be used as retry/scaffold.

A true accepted required pair may set `successfulTransfer`. That can support **L5** only after a valid MODEL. The Scene does not write `"L5"`.

---

### EXAM

```ts
{
  patternId: string;
  representationRecognition: string;
  modelRecognition: string;
  selectedAnswer?: string;
  reasoning: string;
}
```

`selectedAnswer` is not official model evidence by itself.

Production EXAM uses the representative subset in [`exam-mapping.md`](./exam-mapping.md). Completion must not set `independentAiOffSuccess` or support **L6**.

---

### AI_OFF

```ts
{
  challengeId:
    | "ai-off-unfamiliar-hover-sled"
    | "ai-off-condition-tug-moving-crate";
  selectedAnswer: string;
  studentReasoning: string;
  postCheckIds: string[];
  answerCorrect: boolean;
  accepted: boolean;
  llmUsed: false;
  completedWithoutAI: true;
}
```

The independent response is committed before any structured post-check. Post-check cannot rewrite the first answer or reasoning. Critical independent-model flags (`identifiesCurrentMotionState`, `identifiesNetForceCondition`, `identifiesConditionOrBoundary`) come from the committed response. Post-check may confirm or reject; it must not manufacture those flags. Official evaluation is deterministic. Successful independent reconstruction + condition awareness, with `llmUsed = false`, may set:

```ts
{
  independentAiOffSuccess: true;
  llmDisabledDuringIndependent: true;
}
```

That is required for **L6** via adapter `accumulateEvidence` → `deriveModelEvidenceLevel`. The Scene never writes `"L6"`.

---

## 2. Mapping onto AccumulatedModelEvidence

| Accumulated field | Typical Scene sources | May support |
|---|---|---|
| `observedPhenomenon` | OBSERVE + DESCRIBE | L1 |
| `identifiedQuantities` | DESCRIBE object, motion state, force direction | L2 |
| `identifiedRelations` | EXPERIMENT reflection / EXPLAIN partial relations | L3 |
| `constructedValidCausalModel` | MODEL structured relation (not keywords) | L4 |
| `successfulTransfer` | accepted TRANSFER, after valid model | L5 |
| `independentAiOffSuccess` | valid AI_OFF responses | L6 (with next flag) |
| `llmDisabledDuringIndependent` | application: zero tutor calls in AI_OFF | L6 |

The Scene writes **evidence flags**. It does not assign `"L4"` in UI or session state.

---

## 3. What must not happen

- OBSERVE autoplay satisfying EXPERIMENT.
- DESCRIBE gated only on `text.length > 0`.
- L4 from `extractForceMotionSignals().suggestsValidRelation` alone.
- L5 from recognizing wheels.
- L6 from MODEL or TRANSFER.
- Any LLM-written `CartState` stored as experimental result.
- Copying Scene 02 energy-chain slots as if they were this model.
