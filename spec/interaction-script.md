# Microwave Bread — Interaction Script

> Version: 0.1
> Target session duration: approximately 10–15 minutes

## Interaction Philosophy

Each stage should create a **cognitive action**, not simply display information.

The student should leave traces of thinking:

- observation;
- description;
- prediction;
- experiment;
- explanation;
- model;
- transfer;
- exam reasoning;
- independent response.

## S00 — ENTRY

### Student sees

A simple microwave oven with a slice of bread.

Headline:

> Why does bread become hot in a microwave?

CTA:

> Start investigating

### Student action

Start.

### System responsibility

Introduce curiosity without explaining the concept.

### AI

Not required.

---

## S01 — OBSERVE

### Student sees

Microwave + bread + timer.

### Interaction

Student presses Start.

The deterministic simulation runs.

Example result:

20°C → 32°C after 30 seconds.

### Prompt

> What did you observe?

### Evidence

Raw observation text.

### Possible responses

- “It became hot.”
- “The temperature went up.”
- “The microwave heated the bread.”

Do not immediately label wrong.

### AI behavior

If a student gives an explanation instead of observation, ask them to separate:

“What did you actually observe?”

---

## S02 — DESCRIBE

### Prompt

> Now describe what happened using physics language.

### Support

Free text plus optional vocabulary chips:

- temperature
- increase
- energy
- internal energy

### Target evidence

```text
object = bread
quantity = temperature
change = increase
```

### Success

A standard answer is not required word-for-word.

The student must identify the relevant physical quantity and direction of change.

---

## S03 — PREDICT

### Prompt

> If we heat the bread for longer, what do you predict will happen to its temperature?

### Interaction

Prediction options:

- temperature increases;
- approximately unchanged;
- temperature decreases;
- not sure.

Then:

> Why?

### Important

Prediction must occur before the next experiment.

### AI

May challenge reasoning but may not reveal the result.

---

## S04 — EXPERIMENT

### Controls

- power;
- heating time.

### Student action

Modify the conditions and run the experiment.

### System shows

- initial temperature;
- final temperature;
- delta temperature;
- time;
- power.

### Prompt after experiment

> Was the result the same as your prediction?

Then:

> What does the result make you think?

### Evidence

Prediction/evidence comparison.

---

## S05 — EXPLAIN

### Prompt

> Why did the bread's temperature increase?

### Student action

Write a short explanation.

### AI role

Determine where the student is in the conceptual progression and ask one useful next question.

### Example interaction

Student:

> Because the microwave heated it.

AI:

> You described the process, but not yet what changed inside the bread. What changed that you can measure?

Student:

> Its temperature.

AI:

> Good. What could make the temperature of an object increase? Think about where energy might go.

Do not provide the final model unless the allowed hint level has escalated.

---

## S06 — MODEL

### Model canvas

Show:

```text
[energy enters]
        ↓
[      ?      ]
        ↓
[temperature increases]
```

Available cards:

- internal energy changes;
- mass changes;
- speed changes;

Student drags or selects the card.

Then connects the arrows.

### Correct conceptual model

```text
energy enters
    ↓
internal energy/state changes
    ↓
temperature increases
```

### Feedback

Avoid “wrong!” when possible.

Use:

> “The first and last parts match what we observed. What kind of change could connect energy entering the bread with the temperature increase?”

---

## S07 — TRANSFER A

### Scenario

A hot-water bag warms a hand.

### Prompt

> Can the model you just built help explain why the hand becomes warmer?

### Student action

Explain in own words.

### Target

Student recognizes:

energy enters system → internal state changes → temperature rises.

The detailed mechanism may be different from microwave heating.

---

## S08 — TRANSFER B

### Scenario

Two hands are rubbed together.

### Prompt

> Why do the hands become warm?

### Teaching goal

Separate the common outcome:

“temperature increases”

from the mechanism that caused it.

This is intentionally a more distant transfer.

---

## S09 — TRANSFER C

### Scenario

An electric kettle heats water.

### Prompt

> What is similar to the microwave-bread situation?

### Goal

Student identifies the abstract shared structure instead of the surface story.

---

## S10 — EXAM REPRESENTATION

Switch visual language from physical lab to school-test style.

### Step 1 — Problem representation

Before showing options, ask:

> What is this question mainly about?

Options:

- temperature;
- heat;
- internal energy;
- energy transfer;
- relationships between quantities.

### Step 2 — Model selection

Ask:

> What physical relationship should you think about?

### Step 3 — Solve

Show a curated exam-style question.

### Step 4 — Reason

Ask for a short explanation.

The product stores both:

- final answer;
- reasoning evidence.

---

## S11 — AI OFF

### Visual

Display:

> AI is now turned off. Solve this one yourself.

Hide tutor controls.

### Independent Scenario

> A metal spoon is placed in hot water. After a while, the spoon's temperature increases. Explain why.

### Second task

An exam-style conceptual judgment question.

### Rule

No LLM call.

No hint.

No answer reveal.

---

## S12 — COMPLETE

Show qualitative reflection:

- physical description;
- explanation;
- model construction;
- transfer;
- independent problem solving.

Use cautious language.

Example:

> You were able to describe temperature change and use an energy-based model in several new situations.

Do not claim mastery.

## Hint Ladder

### H1 — Reframe

Repeat the task in simpler language.

### H2 — Focus

Point attention toward a relevant physical quantity.

### H3 — Counterexample

Ask whether the student's current claim always holds.

### H4 — Partial relationship

Expose one part of the physical relationship.

### H5 — Explanation

Only if explicitly permitted by the current stage/policy.

## Timing Guidance

Prefer:

- 20–60 seconds of student action;
- short prompts;
- one cognitive question at a time.

Avoid:

- paragraphs of explanation;
- more than one major question simultaneously;
- long tutor monologues.
