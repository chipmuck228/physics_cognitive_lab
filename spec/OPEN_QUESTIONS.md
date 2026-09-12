# Physics Cognitive Lab — Open Questions

> Version: 0.2 — Governance aligned; research questions preserved
> Purpose: Keep hypotheses separate from settled decisions.

> Authority: Hypothesis/research backlog only. Items here do not override decisions or contracts in `universal-physics-learning-protocol.md`, `physics-model-schema.md`, or `physics-model-library.md`. When a question becomes settled, record the decision in the appropriate authoritative document and update/close the item here.

## O001 — Does One Physical Environment Produce Transfer?

**Question:** After completing the microwave-bread environment, can students apply the model to genuinely new contexts?

**Current hypothesis:** Yes, if the environment includes explicit prediction, explanation, model construction, and multiple transfer scenarios.

**What would count as evidence:** Students independently identify the same structural relationship in novel situations.

**Status:** Unvalidated

---

## O002 — How Much AI Scaffolding Is Optimal?

**Question:** How many tutor interactions are useful before the student becomes passive?

**Current hypothesis:** One meaningful question at a time, with progressive hints, is safer than continuous dialogue.

**Status:** Unvalidated

---

## O003 — Does Model Construction Improve Exam Performance?

**Question:** Does requiring students to explicitly build a causal/model diagram improve their ability to analyze exam questions?

**Current hypothesis:** It should improve problem representation and model recognition.

**Status:** Unvalidated

---

## O004 — How Much Physics Language Should Be Introduced Explicitly?

**Question:** What is the right balance between everyday language and formal Grade 9 physics terminology?

**Current hypothesis:** Begin from the student's language, then progressively move toward accepted physics terms.

**Status:** Needs teacher/PER review and student testing

---

## O005 — How Realistic Should the Physical Simulation Be?

**Question:** Does greater physical realism improve learning enough to justify additional complexity?

**Current hypothesis:** For early MVP testing, deterministic conceptual realism matters more than visual or numerical fidelity.

**Status:** Unvalidated

---

## O006 — Which Transfer Distance Is Most Productive?

**Question:** How much should surface context change between the original environment and transfer tasks?

**Current hypothesis:** Use a progression from near → medium → far transfer.

**Status:** Unvalidated

---

## O007 — How Should “Understanding” Be Assessed?

**Question:** Is explanation + transfer + independent exam performance enough to constitute meaningful evidence of model formation?

**Current hypothesis:** It is a useful MVP criterion, but not a validated psychometric measure.

**Status:** Unvalidated

---

## O008 — Can Students Distinguish “Heat”, “Temperature”, and “Internal Energy” Through Interaction?

**Question:** Can the environment reduce the common tendency to treat these terms as interchangeable?

**Current hypothesis:** Contrasting examples and counterexamples should help.

**Status:** Unvalidated

---

## O009 — What Makes Students Want to Return?

**Question:** Does curiosity about the physical phenomenon create stronger engagement than points, badges, or streaks?

**Current hypothesis:** Curiosity + agency + mastery is more aligned with the product philosophy than reward mechanics.

**Status:** Unvalidated

---

## O010 — Can a Single Prompt System Remain Reliable?

**Question:** At what complexity point should tutor responsibilities be split into multiple agents?

**Current hypothesis:** Keep one constrained tutor until actual failures justify decomposition.

**Status:** Unvalidated

---

## O011 — How Well Do Environmental Models Generalize Across Textbook Curricula?

**Question:** Will the same environment and language work across different Chinese Grade 9 physics curricula and exam styles?

**Current hypothesis:** Core physical models should generalize, but terminology and assessment mappings may require curriculum-specific adaptation.

**Status:** Needs curriculum research

---

## O012 — How Should the Product Handle a Student Who Refuses to Explain?

**Question:** What is the best alternative when a student repeatedly chooses answers but avoids explanation?

**Current hypothesis:** Use lightweight structured prompts, prediction choices, and visual model construction rather than forcing long text input.

**Status:** Unvalidated

---

## O013 — Should Scene Student Labels Stay Shared or Scene-Local?

**Question:** Scene 02 spec uses slightly different Chinese stage labels than Scene 01's shared `STUDENT_STAGE_LABELS` (for example DESCRIBE 用物理语言描述 vs 说说你看到的; PREDICT 先预测 vs 猜一猜). Should implementation keep one global language table, or allow Scene-local copy that still maps onto the same UPLP IDs?

**Current hypothesis:** Internal stage IDs stay universal. Canonical student-facing labels live in `STUDENT_STAGE_LABELS`. Scene 02 uses that shared registry. Scene 01 keeps local `STAGE_LABELS` in `lib/content/microwave-bread.ts` until a dedicated migration.

**Status:** Partially implemented. Scene 02 uses the shared registry. Scene 01 UI migration is follow-up work; do not silently rewrite Scene 01 copy.

---

## O014 — Scene 03 Opposite-Force Reversal and Shared Evidence Types

**Question:** For Scene 03 Experiment B (`force-against-motion`), should the required observation stop at “slowed down”, or must the student also see reversal? Separately, should production Scene 03 wait for `PredictionEvidence.experimentId` / `ExperimentEvidence.experimentId` to be widened from Scene 02 engine IDs to `string`, or keep all Scene 03 experiment records in `sceneData` only?

**Current hypothesis:** Required EXPERIMENT evidence is `slowed-down`. Reversal is optional if the force remains applied. Experiment IDs belong on the shared prediction/experiment evidence records as `string`. Do not add `scene03Answers`.

**Status:** Phase 1 implemented. Experiment B required observation is `slowed-down`. Reversal occurs only if opposite force continues after the cart reaches rest; it is not required to close EXPERIMENT. `experimentId` is a generic string. Scene drafts (watched demo, describe draft) stay in `sceneData`.

