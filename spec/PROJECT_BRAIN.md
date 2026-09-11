# Physics Cognitive Lab — Project Brain

> Version: 0.1
> Status: Working source of truth
> Last updated: 2026-09-11

## 1. Product Mission

Physics Cognitive Lab is an interactive learning environment designed to help Grade 9 students learn to **think with physics**, not merely memorize formulas or consume AI explanations.

The product should help a student move from:

**real-world phenomenon → physics language → causal relationship → physical model → transfer → independent problem solving**.

The first product hypothesis is that a carefully designed interactive physical environment can help students build a reusable physical model, and that this model can improve performance on unfamiliar real-world situations and exam-style problems.

## 2. Product Is Not

It is not primarily:

- an AI answer machine;
- a photo-solving or answer-search product;
- a chatbot wrapped in a physics UI;
- a traditional question bank;
- a video course;
- a game whose main objective is points, badges, streaks, or speed;
- a full digital textbook;
- a realistic physics simulator for its own sake.

## 3. Core Product Metaphor

> **APP = TRACK**
>
> **LLM = ENGINE**
>
> **STUDENT = DRIVER / THINKER**

The application owns:

- the physical world;
- the learning progression;
- the allowed cognitive actions;
- evidence collection;
- assessment;
- safety and educational guardrails.

The LLM owns:

- language;
- adaptive questioning;
- hints;
- reflection prompts;
- diagnosis of student reasoning;
- conversational scaffolding.

The student owns:

- observation;
- prediction;
- explanation;
- model construction;
- transfer;
- final problem solving.

## 4. Core Learning Loop

The default learning loop is:

1. Observe
2. Describe in physics language
3. Predict
4. Experiment / manipulate
5. Explain
6. Build or revise a physical model
7. Transfer the model to a new situation
8. Translate the model into exam/problem representation
9. Solve independently
10. Reflect

## 5. Core Educational Principle

The product should train **cognitive actions**, not just deliver information.

A student is not considered to have learned a model merely because the student:

- repeated a definition;
- selected the correct answer once;
- used the correct terminology;
- followed an AI solution;
- completed a guided activity.

Stronger evidence includes:

- accurate physical description;
- causal explanation;
- prediction under changed conditions;
- explicit model construction;
- application to a different surface context;
- correct reasoning in exam representation;
- independent performance with AI removed.

## 6. AI Principle

The LLM is a **constrained Socratic scaffold**, not a substitute thinker.

The LLM should generally prefer:

- one useful question;
- a small hint;
- a counterexample;
- a request for explanation;
- a request to compare outcomes;
- a reflection prompt.

The LLM should generally avoid:

- answer dumping;
- long lectures;
- premature formulas;
- performing the current target cognitive action;
- inventing physical outcomes;
- changing the learning sequence.

## 7. Physics Principle

The physical state must be deterministic and application-controlled.

The LLM must never be the source of physical truth.

For any simulation:

**physics rules → deterministic code → observable result → student interpretation → optional LLM scaffolding**.

## 8. Exam Principle

Exam questions are not a separate universe.

They are another representation of physical models.

The product should create a bridge:

**REALITY → MODEL → EXAM REPRESENTATION**

Exam questions should therefore be analyzed by the cognitive actions they require, such as:

- physical description;
- variable identification;
- concept distinction;
- causal reasoning;
- model recognition;
- condition checking;
- qualitative prediction;
- quantitative reasoning;
- transfer.

## 9. Practice Principle

The product does not aim to eliminate practice.

It aims to reduce low-information repetition and replace it with **high-information, structured variation**.

Preferred progression:

**one core model → near transfer → medium transfer → far transfer → exam representation → independent problem solving**.

## 10. MVP

First physical environment:

> **Microwave + bread**

Core question:

> **Why does bread become hot after being heated in a microwave?**

Core learning target:

> energy enters the system → internal energy/state changes → temperature changes

The MVP deliberately does not attempt to teach all microwave physics or all thermal physics.

## 11. MVP Success Hypothesis

The MVP is successful only if there is evidence that students can:

1. describe the phenomenon in physics language;
2. explain the core causal relationship;
3. construct a basic model;
4. use that model in new situations;
5. connect the model to exam-style problems;
6. solve a final problem without AI assistance.

## 12. Non-Goals for MVP

Do not prematurely build:

- authentication;
- parent dashboard;
- teacher dashboard;
- cloud database;
- payments;
- full curriculum;
- full question bank;
- social features;
- leaderboard;
- reward economy;
- native app;
- highly realistic microwave electromagnetic simulation.

## 13. Product Language

Preferred:

- physical model;
- physical reasoning;
- transfer;
- student evidence;
- cognitive action;
- learning environment;
- scaffold;
- independent problem solving.

Avoid overclaiming:

- “mastered physics”;
- “guaranteed score increase”;
- “AI understands the student completely”;
- “scientifically proven” unless supported by actual evidence.

## 14. Source-of-Truth Hierarchy

When documents conflict, use this order:

1. `PROJECT_BRAIN.md` — mission and non-negotiable principles
2. `DECISION_LOG.md` — historical decisions and rationale
3. `/spec/*` — current feature/learning specifications
4. `OPEN_QUESTIONS.md` — unresolved hypotheses
5. `EXPERIMENT_LOG.md` — evidence from real users
6. implementation code — current implementation, not automatically the intended design

If implementation conflicts with the learning specification, fix the implementation rather than silently changing the learning specification.

## 15. Core Research Question

The product ultimately exists to investigate:

> **Can a constrained, interactive physics environment help a student form a transferable physical model that remains usable after AI assistance is removed?**
