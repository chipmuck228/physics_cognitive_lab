# Physics Cognitive Lab — AI Development Rules

> This file contains project-level engineering instructions for Cursor and other coding agents.

## 1. Source of Truth

Before making a meaningful architecture or learning change, read:

- `PROJECT_BRAIN.md`
- relevant files in `spec/`
- `DECISION_LOG.md`

Do not infer the product strategy from UI code alone.

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
