# Microwave Bread — Scene State & Evidence Configuration

> Version: 0.2 — Scene-specific configuration
> Primary model: `energy-internal-energy-temperature`

## 1. Ownership Boundary

This file is **not** the canonical learning state machine.

The universal stage sequence, legal stage semantics, AI permissions, universal evidence flow, and AI_OFF rules are owned exclusively by [`universal-physics-learning-protocol.md`](./universal-physics-learning-protocol.md).

This file only defines **Microwave Bread-specific evidence requirements and progression configuration** for those canonical stages.

Related sources:

- Physics Model contract: [`physics-model-schema.md`](./physics-model-schema.md)
- Canonical model ID/inventory: [`physics-model-library.md`](./physics-model-library.md)
- Scene interaction copy and UX: [`interaction-script.md`](./interaction-script.md)
- Learning goals: [`learning-spec.md`](./learning-spec.md)

If any stage or AI rule here appears to conflict with UPLP, UPLP wins.

## 2. Scene Identity

```ts
const microwaveBreadScene = {
  id: "microwave-bread",
  primaryModel: "energy-internal-energy-temperature",
  secondaryModels: [
    "internal-energy-change-mechanisms",
    "heat-transfer-direction"
  ]
} as const;
```

Secondary models are supporting/transfer connections. The Scene's required newly constructed model is the `primaryModel`.

## 3. Stage-specific Evidence Configuration

The keys below refer to canonical UPLP stages; this file does not redefine their order.

### ENTRY

Scene evidence: student explicitly starts the investigation.

### OBSERVE

Required evidence:

```ts
{
  rawDescription: string;
  observedChanges: string[];
}
```

Minimum gate: observation must refer to the current bread-heating event. The first deterministic demonstration may create observation evidence, but it MUST NOT count as the later controlled EXPERIMENT run.

### DESCRIBE

Required semantic evidence:

```ts
{
  object: "bread";
  quantity: "temperature";
  change: "increase";
}
```

The student's wording need not match these strings verbatim. The application evaluator must verify the semantic elements rather than accept any non-empty description.

### PREDICT

Required evidence:

```ts
{
  changedVariable: "heatingTimeSec" | "powerW";
  prediction: string;
  reason: string;
}
```

Gate requires both a prediction and student-authored reason recorded **before** the controlled experiment.

### EXPERIMENT

Microwave-specific evidence must satisfy the canonical UPLP EXPERIMENT contract. At minimum record:

```ts
{
  predictionId: string;
  intervention: { powerW: number; heatingTimeSec: number };
  result: {
    initialTemperatureC: number;
    finalTemperatureC: number;
    deltaTemperatureC: number;
    energyInputJ: number;
  };
  predictionMatch: "matched" | "partly-matched" | "did-not-match";
  reflection: string;
}
```

Critical rule: the OBSERVE demonstration/auto-play cannot satisfy this gate. A distinct post-prediction run is required.

### EXPLAIN

Required evidence: a student explanation that attempts a causal account.

Recommended deterministic progression tags for analytics/evaluation only:

```text
E0 — result description only
E1 — names heating/process only
E2 — identifies energy entering/transferred
E3 — connects energy → internal state/internal energy → temperature
E4 — expresses a reusable/transferable model
```

These tags do not authorize the LLM to advance the stage.

### MODEL

Target structural evidence:

```text
energy enters
    ↓
internal energy/state changes
    ↓
temperature increases
```

Gate should be deterministic/structural. Semantic LLM similarity alone must not mark the model correct.

### TRANSFER

Required Scene transfer attempts should include more than one surface context, such as:

- hot-water bag warming a hand;
- rubbing hands;
- electric kettle heating water.

Evidence stores the student's explanation/model selection for each required target. Transfer level and canonical target model IDs should conform to `physics-model-schema.md`.

### EXAM

Required evidence stores **answer and reasoning separately**. The Scene's exam representation is specified in [`exam-mapping.md`](./exam-mapping.md).

At minimum:

```ts
{
  questionId: string;
  selectedAnswer?: string;
  reasoning: string;
  identifiedModelId?: string;
}
```

### AI_OFF

Required evidence:

```ts
{
  completedWithoutAI: true;
  independentExplanation: string;
  independentExamResponse: string;
}
```

Enforcement is application-level: no tutor component, no tutor request, no hidden AI hint, and no LLM-based progression decision. Universal AI_OFF semantics remain owned by UPLP.

### COMPLETE

Scene completion may occur only when UPLP completion requirements and the required Microwave Bread evidence are satisfied. Completion must not be presented as proof of durable mastery.

## 4. Navigation / Persistence Configuration

- Forward progression must satisfy UPLP plus the Scene-specific evidence gate above.
- Review/back navigation may preserve existing evidence.
- Refresh must restore the active session and evidence.
- Reset must be explicit.
- Developer/test-only stage jumps must never be enabled in production learning flow.

## 5. Implementation Contract

The implementation should expose one universal progression engine and pass Scene-specific evidence/evaluator configuration into it. Do not hard-code a second Microwave-only global state machine.

Conceptually:

```ts
canAdvance({
  stage,
  universalPolicy,     // UPLP-derived
  sceneEvidencePolicy, // this file / concrete model definition
  session
})
```

The application, not the LLM, owns the final `canAdvance` decision.
