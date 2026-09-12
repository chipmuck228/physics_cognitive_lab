# Microwave Bread — Misconception Map

> Version: 0.2 — Model/Scene-specific misconception configuration
> Primary model: `energy-internal-energy-temperature`
> Purpose: Identify likely incomplete physical models and provide diagnostic signals plus minimal interventions.

## Architecture Alignment

The canonical `Misconception` field contract is owned by [`physics-model-schema.md`](./physics-model-schema.md). This file supplies concrete misconception content for the Microwave Bread learning experience and its primary model. Universal tutoring behavior and hint escalation are owned by [`universal-physics-learning-protocol.md`](./universal-physics-learning-protocol.md).

Each entry below provides the model-specific equivalents of `statement`, `diagnosticSignals`, `severity`, and `recommendedInterventions`. Detection does not advance the learning stage.

## M01 — Heat as a Substance Stored in an Object

**Statement:** “Bread has more heat inside it after microwaving.”

**Diagnostic signals:** uses “heat” as a stored material/substance; treats heat amount as an object state analogous to mass.

**Severity:** high

**Target direction:** Use energy-transfer language carefully. Avoid treating heat as a material substance.

**Recommended interventions:** Ask “What changed in the bread, and how do you know?” Redirect toward measurable state quantities before introducing formal terminology.

---

## M02 — Absorbing Energy Always Means Temperature Must Increase

**Statement:** “If an object absorbs energy, its temperature must rise.”

**Diagnostic signals:** uses an unconditional `energy in → temperature up` rule; rejects possible non-temperature state changes.

**Severity:** high

**Target direction:** Make the relationship conditional rather than universal.

**Recommended interventions:** Introduce a phase-change counterexample only when pedagogically appropriate; ask whether energy can produce another kind of state change.

---

## M03 — Higher Temperature Always Means Greater Internal Energy

**Statement:** “A 100°C object always has more internal energy than a 50°C object.”

**Diagnostic signals:** infers total internal energy from temperature alone; ignores mass, material, or system definition.

**Severity:** high

**Target direction:** Teach that one quantity cannot determine another without relevant conditions.

**Recommended interventions:** Compare objects with different masses/materials and ask what additional information is needed.

---

## M04 — All Heating Is the Same Process

**Statement:** “Everything that makes something hot is just heat transfer in the same way.”

**Diagnostic signals:** classifies microwave heating, contact warming, and rubbing as identical mechanisms because the outcome is temperature increase.

**Severity:** medium

**Target direction:** Separate observed outcome from energy-transfer/change mechanism.

**Recommended interventions:** Contrast microwave bread, hot-water contact, and rubbing hands; ask “What is different about how energy reaches or changes the object?”

---

## M05 — Naming a Concept Means Understanding It

**Statement:** Student says “This is internal energy” but cannot state what changed, why, or predict a new case.

**Diagnostic signals:** correct vocabulary without causal explanation or transfer.

**Severity:** medium

**Target direction:** Treat terminology as vocabulary evidence, not proof of model formation.

**Recommended interventions:** Follow terminology with “Why?”, “What changed?”, or “How would you know?” and collect new evidence.

---

## M06 — Temperature, Heat, and Internal Energy Are Interchangeable

**Statement:** “Temperature increased because heat increased.”

**Diagnostic signals:** swaps temperature, heat/energy transfer, and internal energy as synonyms.

**Severity:** high

**Target direction:** Explicitly distinguish state quantity, transfer process, and system energy.

**Recommended interventions:** Use comparison questions, representation sorting, and carefully chosen exam distractors.

---

## M07 — A Correct Answer Means the Model Is Correct

**Statement:** Student selects the correct option but cannot explain why.

**Diagnostic signals:** correct answer with contradictory, absent, or irrelevant reasoning.

**Severity:** medium

**Target direction:** Separate answer correctness, reasoning quality, and model evidence.

**Recommended interventions:** Require a short explanation and score/store answer and reasoning independently.

---

## M08 — A Familiar Surface Context Means the Same Solution Method

**Statement:** Student succeeds on microwave bread but fails to recognize the model in a changed surface context.

**Diagnostic signals:** copies scene-specific wording/features; cannot identify shared deep structure.

**Severity:** medium

**Target direction:** Train structural transfer rather than surface imitation.

**Recommended interventions:** Use near → medium → far transfer targets while asking what remains physically the same.

---

## M09 — Temperature Change Identifies the Energy Transfer Mechanism Automatically

**Statement:** “If temperature increased, heat transfer must have occurred.”

**Diagnostic signals:** infers transfer mechanism from outcome alone; cannot distinguish warming by contact from warming by work.

**Severity:** high

**Target direction:** Separate outcome from the process that caused it.

**Recommended interventions:** Compare warming by contact with warming caused by doing work and ask which evidence identifies the mechanism.

---

## M10 — Advanced Microphysics Is Required to Explain the Basic Phenomenon

**Statement:** Student believes the Grade 9 explanation is impossible without detailed molecular/electromagnetic microwave theory.

**Diagnostic signals:** refuses or overcomplicates a macroscopic energy/state explanation; introduces unnecessary advanced mechanism as required evidence.

**Severity:** low

**Target direction:** Use the simplest adequate model for the learning target.

**Recommended interventions:** Return to the Grade 9 model boundary: `energy transfer → internal state/internal energy change → temperature change`, while clearly labeling it as a pedagogical-level model rather than a complete microwave engineering explanation.
