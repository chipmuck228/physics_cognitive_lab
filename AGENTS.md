# Physics Cognitive Lab — AI Development Rules

> This file contains project-level engineering instructions for Cursor and other coding agents.

## 1. Source of Truth and Required Reading Order

Before making any meaningful architecture, learning, Physics Model,
Scene, AI tutor, assessment, or exam-mapping change, read:

1. `PROJECT_BRAIN.md`
2. `spec/SPEC_ALIGNMENT_MANIFEST.md`
3. `spec/physics-model-quality-review.md` when Physics Model quality,
   pedagogy, or learning-evidence claims are involved
4. `spec/evidence-design-contract.md` when designing or reviewing
   evaluators, evidence flags, transfer, AI_OFF provenance, or L4–L6
   justification
5. `spec/physics-representation-integrity-contract.md` when student-visible
   physics values, units, arrows, or quantity labels are involved
6. `spec/universal-physics-learning-protocol.md`
7. `spec/physics-model-schema.md`
8. `spec/physics-model-library.md`
9. `spec/cognitive-action-taxonomy.md` when cognitive actions or assessment are involved
10. `spec/physics-model-implementation-protocol.md` when implementing a Physics Model or Scene
11. the relevant model-specific or scene-specific specification
12. `DECISION_LOG.md`

These documents form an architecture contract.

Canonical ownership:

- `universal-physics-learning-protocol.md`
  owns HOW students learn:
  universal stages, stage semantics, universal evidence flow,
  tutor permissions, hint progression, AI_OFF semantics.

- `physics-model-schema.md`
  owns WHAT a valid Physics Model contains:
  fields, types, model-specific configuration and completeness requirements.

- `physics-model-library.md`
  owns WHICH Physics Models exist:
  canonical model IDs, model families, model graph,
  curriculum coverage and model lifecycle.

- `cognitive-action-taxonomy.md`
  owns canonical cognitive action IDs such as C1–C14.

- `physics-model-quality-review.md`
  owns WHETHER physics, pedagogy, and learning-evidence claims
  are justified. Gate A is PRE-implementation model quality.
  Gate B is POST-implementation learning-evidence review.
  Quality review is not optional for a new production model.

- `evidence-design-contract.md`
  owns HOW implementation evidence must justify a cognitive claim:
  provenance, relation-over-token, target-specific transfer evidence,
  transfer-mode evidence semantics, weakest-pass design, and
  Evidence Claim Design. It does not own stage meanings or L-level
  meanings.

- `physics-representation-integrity-contract.md`
  owns whether student-visible physics labels, units, and relations
  preserve canonical quantity identity. Correct runtime numbers do
  not imply correct representation. Scene 05 PRI-05-01 is the worked
  example. This contract does not authorize a bulk Scene 01–05 audit.

- Scene-specific specs instantiate the canonical protocol and models.
  They must not redefine universal stages, hint semantics,
  model contracts or canonical model IDs.

When documents disagree, follow the designated source-of-truth owner.
Do not infer product strategy or educational architecture from UI code alone.

## 2. Never Change Educational Principles Silently

Never silently modify:

- the learning loop;
- the role of the student;
- the role of the LLM;
- the deterministic-physics requirement;
- the AI-Off requirement;
- exam mapping philosophy.

If a requested change conflicts with these rules, identify the conflict explicitly.

## 3. Physics Rules Belong to Code

Never use an LLM to decide:

- physical outcomes;
- numerical simulation state;
- experimental measurements;
- correctness of deterministic calculations.

Use typed deterministic functions instead.

## 4. Learning Progression Belongs to the Application

Never allow the LLM to:

- skip stages;
- unlock later stages by itself;
- decide that the student has mastered a model;
- modify the official learning state.

The LLM may provide advisory signals only.

## 5. Protect the Student's Target Cognitive Action

At every stage ask:

> What is the student supposed to think or do right now?

The LLM must not perform that action for the student.

Examples:

- Prediction → AI must not reveal the result.
- Explanation → AI must not write the complete explanation.
- Model → AI must not build the student's model.
- Transfer → AI must not immediately identify the shared model.

## 6. Prefer Structured Data Over Hidden Logic

Put educational content in data/spec files rather than giant React components.

Use types for:

- LearningStage
- StudentEvidence
- PhysicsState
- Misconception
- TutorResponse
- ExamQuestion

## 7. Validate All LLM Outputs

Use Zod.

Never trust free-form model output as application state.

If the output is malformed:

- reject it;
- use a safe fallback;
- keep the learning experience alive.

## 8. Keep AI Server-Side

Never expose API keys to the browser.

The browser should call the project's server route, not the model provider directly.

## 9. AI Failure Must Not Break Learning

The core learning path must work without AI.

If the model API fails:

- the student can continue with deterministic interactions;
- use a safe minimal fallback prompt where appropriate;
- never expose provider errors.

## 10. AI_OFF Is a Hard Boundary

When the application enters `AI_OFF`:

- do not call the tutor API;
- hide tutor controls;
- do not show prior hints as hidden clues;
- do not automatically grade with an LLM.

## 11. Do Not Add Unrequested Product Complexity

Do not add:

- auth;
- database;
- admin UI;
- analytics vendors;
- reward systems;
- social features;
- large libraries;

unless explicitly requested and justified.

## 12. Prefer the Simplest Architecture That Supports Learning Experiments

The MVP is a research prototype.

Optimize for:

- clarity;
- deterministic behavior;
- fast iteration;
- inspectability;
- easy experimentation.

Do not optimize for speculative scale.

## 13. Tests Are Part of the Educational System

Every learning-state transition must have tests.

Every physics rule must have deterministic tests.

The AI route must have schema and failure tests.

There must be at least one end-to-end test covering:

ENTRY → OBSERVE → DESCRIBE → PREDICT → EXPERIMENT → EXPLAIN → MODEL → TRANSFER → EXAM → AI_OFF → COMPLETE

## 14. Do Not Turn the Product Into a Chatbot

The main UI must prioritize:

- physical scene;
- student action;
- model construction;
- evidence;
- task progression.

A tutor chat panel is secondary.

## 15. Educational Copy Must Be Age Appropriate

Use clear Grade 9 language.

Avoid unnecessarily technical terminology.

Introduce formal language progressively.

Do not oversimplify into scientifically misleading statements.

## 16. Physics Accuracy Has Priority Over Conversational Fluency

If an engaging AI response conflicts with the approved physical model:

choose physical accuracy.

## 17. Do Not Claim Validated Learning Outcomes Without Evidence

Do not display or write claims such as:

- “This method is proven to raise scores.”
- “The student has mastered physics.”
- “This scientifically guarantees transfer.”

Unless the project has actual supporting evidence.

## 18. When Requirements Are Ambiguous

Prefer the smallest implementation consistent with the existing specification.

If ambiguity affects educational behavior, do not invent a new learning principle.

Document the ambiguity and identify it as an open question.

## 19. Physics Model Implementation Rule

Never begin a new learning unit by building a page.

How a ready Physics Model becomes a production Scene is owned by
`spec/physics-model-implementation-protocol.md`.
The default Cursor request is `spec/prompts/implement-physics-model.md`
(one pass: ENTRY → COMPLETE). Do not write a custom prompt per UPLP
stage unless that protocol's stop/fallback conditions apply.

The implementation order is:

canonical model design
→ PRE Model Quality Review
→ fix quality blockers
→ readiness validation
→ Evidence Claim Design
→ one-pass implementation
→ Physical Representation Integrity check for new-Scene quantitative UI
  (`spec/physics-representation-integrity-contract.md`; not a Scene 01–05 audit)
→ adversarial evaluator tests
→ engineering gates
→ POST Learning Evidence Review
→ quality-reviewed prototype
→ metadata.status = prototype
→ future learner validation
→ VALIDATED

Default quality-review request: `spec/prompts/review-physics-model-quality.md`.

`IMPLEMENTATION_READY` does not mean `MODEL_QUALITY_PASS`.
A quality-reviewed prototype does not mean learner-validated.
Engineering tests do not confer `validated`.
`metadata.status` semantics are owned by `spec/physics-model-schema.md`.
Engineering PASS stays `draft`. POST `PASS` / `PASS_WITH_REFINEMENTS` may promote to `prototype`.

Every Scene MUST declare exactly one `primaryModel`.
It MAY declare `secondaryModels`.

A secondary model does not automatically become a learning target.

Never create a new model ID inside a Scene.
Canonical model IDs must exist in `spec/physics-model-library.md`.

MODEL UI is model-owned. Do not copy Scene 02's energy chain or
Scene 03's relation board onto a model whose structure differs.
