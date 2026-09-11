# Physics Cognitive Lab — Decision Log

> Version: 0.1
> Purpose: Record important product, pedagogy, and architecture decisions and why they were made.

## D001 — APP is the Track, LLM is the Engine

**Date:** 2026-09-11

**Decision:** The Web/App controls the world and learning path. The LLM is a constrained language/reasoning engine inside it.

**Why:** A free-form LLM can hallucinate physical facts, skip learning steps, or do the student's thinking. The product needs deterministic control over state and pedagogy.

**Consequence:** Physics state and learning progression must not be owned by the LLM.

---

## D002 — First MVP is “Microwave + Bread”

**Decision:** Use a microwave-heated slice of bread as the first physical environment.

**Why:** It is familiar, visual, experimentally controllable, connected to thermal physics, and capable of bridging real-world phenomena to exam concepts.

**Consequence:** MVP focuses on energy transfer, internal energy/state change, temperature, and transfer.

---

## D003 — MVP is a Vertical Slice, Not a Platform

**Decision:** Build one complete learning experience before building user accounts, curriculum management, dashboards, payments, or a question bank.

**Why:** The main uncertainty is educational effectiveness, not infrastructure.

**Consequence:** No auth/database/admin in MVP.

---

## D004 — Student Must Perform the Target Cognitive Action

**Decision:** The student must perform the key cognitive action for the current stage.

**Why:** If AI performs the key reasoning, the product may improve task completion without improving independent ability.

**Consequence:** The tutor has stage-specific permissions and answer-leak prevention.

---

## D005 — Physics State Must Be Deterministic

**Decision:** The physics environment is controlled by code, not by LLM-generated narrative.

**Why:** The LLM may hallucinate outcomes or generate physically inconsistent results.

**Consequence:** `simulateHeating()` and related rules are pure/deterministic functions.

---

## D006 — AI Off is Mandatory

**Decision:** The final assessment is completed with AI turned off.

**Why:** AI-assisted performance is not equivalent to independent learning.

**Consequence:** The learning environment must remain usable without an LLM, and independent assessment must not call the tutor API.

---

## D007 — Exam Questions Are Another Representation of the Model

**Decision:** Exam tasks are integrated after the model-building and transfer stages.

**Why:** School assessment must remain a product outcome. However, it should be connected to the same underlying physical model rather than treated as unrelated drilling.

**Consequence:** Exam questions are mapped to cognitive actions and physical models.

---

## D008 — Replace Low-Value Repetition With Structured Variation

**Decision:** Do not optimize for large quantities of similar questions.

**Why:** The product hypothesis is that model recognition and transfer are more informative than repeated surface-level practice.

**Consequence:** Use near, medium, and far transfer tasks.

---

## D009 — Reality → Model → Exam

**Decision:** Learning should move from real-world phenomena to physical models and then to exam representation.

**Why:** Students need both conceptual understanding and the ability to operate in school assessment formats.

**Consequence:** Physics World and Exam World can look different but must share the same underlying model.

---

## D010 — Do Not Over-Simulate Microwave Physics in MVP

**Decision:** The microwave environment uses a deterministic pedagogical approximation instead of a complete electromagnetic simulation.

**Why:** The MVP is validating the learning mechanism, not microwave engineering fidelity.

**Consequence:** The physical model must be explicitly documented as a teaching approximation.

---

## D011 — Evidence Before Mastery Labels

**Decision:** Store student evidence first; do not claim validated mastery scores.

**Why:** The product has not yet been psychometrically validated.

**Consequence:** Keep internal evidence and qualitative signals rather than pseudo-precise scores.

---

## D012 — Do Not Start With a Full Agent Swarm

**Decision:** MVP can begin with one constrained tutor model behind a schema-validated API.

**Why:** The educational workflow is still being validated; multiple agents add complexity before their value is known.

**Consequence:** Add specialized agents only when a demonstrated need appears.

---

## D013 — Build the Foundation Before Tutor Integration

**Date:** 2026-09-11

**Decision:** Implement the first coding checkpoint as a deterministic learning-environment foundation before adding `/api/tutor`.

**Why:** The highest-risk constraints are that physics remains application-controlled, stage transitions remain explicit, and the product remains usable without AI. Those can be validated earlier through the scene, session store, and progression rules than through model integration.

**Consequence:** The repository may temporarily contain the full learning-stage model while only the early `ENTRY -> OBSERVE` interaction is user-complete. This does not change the target MVP.

---

## D014 — Define Evidence Channels Before All Stage UI Exists

**Date:** 2026-09-11

**Decision:** Keep typed storage for observations, predictions, explanations, model attempts, transfer attempts, exam attempts, and independent assessment in the session shape before every corresponding UI has been implemented.

**Why:** The product is evidence-first. Fixing the state shape early reduces the risk that later UI work drifts away from the learning specification.

**Consequence:** Some session fields are currently reserved and usually empty. They represent planned evidence channels, not completed learning features.
