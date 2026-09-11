# Microwave Bread — Learning State Machine

> Version: 0.1

## 1. States

```ts
enum LearningStage {
  ENTRY = "ENTRY",
  OBSERVE = "OBSERVE",
  DESCRIBE = "DESCRIBE",
  PREDICT = "PREDICT",
  EXPERIMENT = "EXPERIMENT",
  EXPLAIN = "EXPLAIN",
  MODEL = "MODEL",
  TRANSFER = "TRANSFER",
  EXAM = "EXAM",
  AI_OFF = "AI_OFF",
  COMPLETE = "COMPLETE",
}
```

## 2. Canonical Transition Graph

```text
ENTRY
  ↓
OBSERVE
  ↓
DESCRIBE
  ↓
PREDICT
  ↓
EXPERIMENT
  ↓
EXPLAIN
  ↓
MODEL
  ↓
TRANSFER
  ↓
EXAM
  ↓
AI_OFF
  ↓
COMPLETE
```

## 3. Stage Definitions

### ENTRY

**Purpose:** Create curiosity and orient the student.

**Student action:** Start the investigation.

**AI:** Not required.

**Exit condition:** Student starts.

---

### OBSERVE

**Purpose:** Notice a physical change before receiving explanation.

**Student action:** Run the first heating event and describe what was observed.

**Key evidence:** Raw observation.

**AI:** May ask the student to separate observation from explanation.

**Exit condition:** Student records an observation.

---

### DESCRIBE

**Purpose:** Translate everyday language into physics language.

**Student action:** Identify object, relevant physical quantity, and direction of change.

**Key evidence:** e.g.

```text
object = bread
quantity = temperature
change = increase
```

**AI:** May prompt attention toward a physical quantity.

**Exit condition:** Minimum valid physical description.

---

### PREDICT

**Purpose:** Make an explicit prediction before experimentation.

**Student action:** Choose or state a prediction and explain why.

**AI:** May challenge the student's reason but cannot reveal the result.

**Exit condition:** Prediction recorded.

---

### EXPERIMENT

**Purpose:** Manipulate the physical environment and compare prediction with evidence.

**Student action:** Change time/power, run experiment, inspect result.

**AI:** Mostly silent.

**Exit condition:** Experiment completed and result recorded.

---

### EXPLAIN

**Purpose:** Build a causal explanation.

**Student action:** Explain why temperature changed.

**Target progression:**

E0: result description
E1: “microwave heated it”
E2: energy enters
E3: causal energy/state/temperature relationship
E4: transferable model

**AI:** Ask, hint, challenge, encourage, or explain only when appropriate.

**Exit condition:** Explanation evidence exists.

---

### MODEL

**Purpose:** Explicitly construct the physical relationship.

**Student action:** Arrange/connect model components.

**Target model:**

```text
energy enters
    ↓
internal energy/state changes
    ↓
temperature increases
```

**AI:** May guide attention but should not build the model.

**Exit condition:** Model submitted.

---

### TRANSFER

**Purpose:** Determine whether the model can survive a change in surface context.

**Student action:** Explain new scenarios.

Suggested scenarios:
- hot-water bag warming a hand;
- rubbing hands;
- electric kettle heating water.

**AI:** May ask for shared structure but should not reveal it prematurely.

**Exit condition:** Transfer responses recorded.

---

### EXAM

**Purpose:** Translate model into school-exam representation.

**Student action:** Identify the model, reason, and answer curated exam questions.

**AI:** Limited scaffolding before final answer.

**Exit condition:** Required exam tasks completed.

---

### AI_OFF

**Purpose:** Test independent performance.

**Student action:** Solve a new situation and an exam-style question without AI.

**AI:** Completely disabled.

**Exit condition:** Independent tasks completed.

---

### COMPLETE

**Purpose:** Reflection and qualitative feedback.

**AI:** Optional only for future versions; MVP can remain deterministic.

## 4. Guardrails

### Illegal transitions

The application must prevent direct jumps such as:

OBSERVE → EXAM

PREDICT → MODEL

EXPLAIN → AI_OFF

unless an explicit test/developer mode is enabled.

### Back navigation

Back navigation may be supported for review, but returning backward must not erase evidence unless the user explicitly resets the session.

## 5. AI Permission Matrix

| Stage | ASK | HINT | CHALLENGE | ENCOURAGE | EXPLAIN |
|---|---:|---:|---:|---:|---:|
| OBSERVE | yes | limited | no | yes | no |
| DESCRIBE | yes | yes | limited | yes | no |
| PREDICT | yes | yes | yes | yes | no |
| EXPERIMENT | limited | no | no | yes | no |
| EXPLAIN | yes | yes | yes | yes | limited |
| MODEL | yes | yes | yes | yes | no |
| TRANSFER | yes | yes | yes | yes | limited |
| EXAM | yes | limited | yes | yes | limited |
| AI_OFF | no | no | no | no | no |

## 6. Completion Rule

The application reaches `COMPLETE` only after `AI_OFF` requirements are satisfied.

Suggested internal rule:

```ts
canComplete =
  hasIndependentExplanation &&
  hasIndependentExamResponse
```
