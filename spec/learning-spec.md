# Microwave Bread — Learning Specification

> Version: 0.2 — Aligned with UPLP / Physics Model Architecture
> Target: Grade 9
> Experience length: approximately 10–15 minutes

## Architecture Alignment

This is a **Scene-specific learning specification** for Microwave Bread. It is not a source of truth for the universal learning protocol or the Physics Model contract.

- `primaryModel`: `energy-internal-energy-temperature`
- Canonical model definition: `content/physics-models/energy-internal-energy-temperature/`
- PRE review: `spec/reviews/pre/energy-internal-energy-temperature.md`
- Evidence Claim Design (implemented by the focused legacy migration): `spec/scenes/microwave-bread/evidence-claim-design.md`
- The production Scene now implements those contracts. POST is `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS`. `metadata.status` is `prototype`. Quality-reviewed prototype. Not learner-validated. Do not treat leftover `explanationLevel` 0–4 as official evidence.
- Universal stage sequence, stage semantics, evidence flow, and AI permissions: `[universal-physics-learning-protocol.md](./universal-physics-learning-protocol.md)`
- Canonical model structure and completeness rules: `[physics-model-schema.md](./physics-model-schema.md)`
- Canonical model IDs and model graph: `[physics-model-library.md](./physics-model-library.md)`
- Scene-specific interaction details: `[interaction-script.md](./interaction-script.md)`
- Scene-specific evidence gates/configuration: `[state-machine.md](./state-machine.md)`

If this file conflicts with one of the three architecture-contract documents, the designated source-of-truth document wins.

## 1. Learning Driving Question

> Why does bread become hot after being heated in a microwave?

The student begins with a familiar everyday phenomenon and progressively constructs a physical explanation.

## 2. Primary Learning Goals

### Goal A — Physical Description

The student can translate:

> “The bread became hot.”

to:

> “The temperature of the bread increased.”

### Goal B — Physical Explanation

The student can construct a basic causal chain:

> energy enters → internal energy/state changes → temperature changes

### Goal C — Transfer

The student can use the same general reasoning structure in new situations.

## 3. Learning Actions

This Scene follows the canonical learning loop defined by UPLP. This document does not redefine the global stage sequence.

For Microwave Bread, the student-specific actions include observation, physical description, prediction, controlled manipulation, explanation, model construction, transfer, exam representation, and independent problem solving.

## 4. Core Conceptual Boundary

The MVP is about:

- temperature;
- temperature change;
- energy transfer;
- internal energy/state change;
- relationships between physical quantities.

The MVP is not a complete lesson on:

- microwave engineering;
- electromagnetic field equations;
- dielectric loss;
- molecular polarization details;
- all of thermal physics.

## 5. Learning Definition

A student is not considered to have formed a usable model based on one correct response.

Candidate evidence includes:

- accurate physical description;
- coherent causal explanation;
- prediction under changed conditions;
- model construction;
- transfer;
- independent exam-style reasoning.

## 6. Learning Environment

The core interaction contains:

- microwave visual scene;
- bread;
- heating time;
- power;
- temperature display;
- experiment history;
- model-building canvas;
- transfer scenarios;
- exam mode;
- AI-Off mode.

## 7. Physics Simulation Philosophy

Use a simple deterministic teaching model.

The simulation should be:

- predictable;
- internally consistent;
- testable;
- visually understandable;
- explicitly labeled as a pedagogical approximation.

## 8. Success Criteria

The MVP should allow us to investigate whether students can:

1. move from everyday description to physics description;
2. recognize an energy/state relationship;
3. explain that relationship;
4. apply it to another situation;
5. recognize related exam tasks;
6. solve an independent final task.

