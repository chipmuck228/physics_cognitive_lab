# Learner Experience Script v1 — Contract Check

> Date: 2026-09-15  
> Scripts: `scene07-learner-experience-v1.md`, `scene02-learner-experience-v1.md`  
> Method: compare Scripts to UPLP, Physics Models, Evidence Design, Interaction Runtime/State, Interaction Alignment, PRI, AI policy, existing Scene 02 / Scene 07 specs.  
> Canonical contracts were **not** edited to make the Scripts look consistent.

Classification:

- `SCRIPT_ERROR` — Script asks for something a canonical contract forbids, or contradicts a Scene/model owner. Contract wins; do not implement the forbidden part.
- `IMPLEMENTATION_GAP` — Script and contract agree; current UI/copy/layout does not yet feel like the Script.
- `CANONICAL_AMBIGUITY` — owners disagree or are silent in a way that would require inventing product policy. **Stop that affected behavior. Do not invent policy.**

---

## Shared (both Scripts)

| ID | Finding | Class | Resolution in this pass |
|---|---|---|---|
| CX-01 | Scripts are not Sources of Truth. UPLP / Schema / Library / Evidence / Runtime / PRI / AI_OFF still own their domains. | (constraint) | Specs marked EXPERIMENTAL. No UPLP/Schema/Runtime edits. |
| CX-02 | Scripts forbid runtime LLM UI generation. | (constraint) | Compiler note is DESIGN_ONLY. |
| CX-03 | AI_OFF = zero LLM calls. UPLP wins over any Script convenience about “understanding natural language.” | SCRIPT would be error if it authorized LLM | Scripts already forbid LLM. Runtime must not hide remaining defects. |
| CX-04 | Interaction Shell freeze: do not extract a new domain shell because two Scenes now have Scripts. LearnerWorkspace is a slot primitive, not a domain shell. | IMPLEMENTATION_GAP if Scene 02 never uses World/Task/Support | Scene 02 may compose LearnerWorkspace for layout only. Do not force LensCurrentAction / ray UI / optical vocab onto Scene 02. |
| CX-05 | PRI: Scripts talk about visible apparatus and names beside objects. They must not invent new quantity identities or arrows that contradict PRI. | no conflict | No new physics labels beyond existing Scene vocab. |
| CX-06 | “Do not force reasoning” vs Scene evidence gates that require authored text. | see S02-C03, S07-C04 | Honest-unknown authored sentence may satisfy `hasOwnWords` without being scored as causal understanding. Do not delete Scene evidence gates. |

No `CANONICAL_AMBIGUITY` required a silent product-policy invention. Where Scene evidence and Script tone differ, Scene evidence gates stay; copy/stance UI adapts.

---

## Scene 07

| ID | Finding | Class | Resolution in this pass |
|---|---|---|---|
| S07-C01 | Script journey is spatial/optical. Existing model `convex-lens-imaging` and Scene 07 interaction-plan already use object station → ray meeting → image. | no conflict | Keep model-owned MODEL UI. |
| S07-C02 | Script: do not memorize five cases. Scene already forbids teaching `1/f = 1/u + v` and five-case recitation as the learning target. Four experimental trials still exist. | IMPLEMENTATION_GAP (chrome) | Keep four trials. Change learner-facing chrome from “第 N 次验证 / 第 3 张表” to a new physical question per round. |
| S07-C03 | DESCRIBE Script wants own-language description; Scene 07 still has structured radios + sentence. Evidence Design / Scene 07 DESCRIBE gate still owns structure. | IMPLEMENTATION_GAP (tone), not evaluator rewrite | Keep structure. Keep own-language prompt. Do not restore “不要只写变了 / 对着光具座分开说.” |
| S07-C04 | PREDICT Script allows “我还不知道为什么.” Scene 07 already stores that as honest-unknown; it is not converted into causal reasoning. | already aligned | Preserve. |
| S07-C05 | EXPLAIN Script asks “真正起作用的是什么？” D064 keeps EXPLAIN as L3 fragment of already-seen screen results, not ray construction. | IMPLEMENTATION_GAP (copy) | Change lead copy. Keep meeting/screen fragments and evaluator. Do not move rays into EXPLAIN. |
| S07-C06 | MODEL Script: do not refill a seven-field internal tuple. Scene 07 MODEL is model-owned ray construction + authored bind. | IMPLEMENTATION_GAP remaining | **Inspected, not rewritten.** Changing MODEL grammar would be a model-architecture change this pass does not own. |
| S07-C07 | TRANSFER Script uses projector + magnifying glass. That pair is already required. Preserve accepted TRANSFER semantic architecture. | no conflict | No TRANSFER evaluator change. Light copy only if it does not alter the architecture. |
| S07-C08 | EXAM Script: 题干 → physical situation → model → answer. Existing Exam World sequence already exists. | IMPLEMENTATION_GAP (tone) | Light copy; do not turn the whole Scene into exam mode. |
| S07-C09 | AI_OFF Script: zero LLM. Runtime `resolveLensAiOffCheck` still falls through to `/api/lens-step6-parse`, which may call a provider. This is a **known hard-boundary defect**, separately tracked. | IMPLEMENTATION_GAP (defect) | **Not hidden. Not repaired in this pass.** This Script does not authorize LLM and does not authorize completing that repair as a side effect. Fast-path without LLM remains the only legitimate AI_OFF interpretation. |
| S07-C10 | COMPLETE Script wants a cognitive trace, not “完成 / 掌握.” | IMPLEMENTATION_GAP | Update COMPLETE copy. Do not claim mastery. |
| S07-C11 | LearnerWorkspace currently ENTRY–EXPERIMENT. Script wants World-dominant ENTRY/OBSERVE/EXPERIMENT and a clear EXPLAIN question. | IMPLEMENTATION_GAP | Extend layout composition through EXPLAIN. MODEL–COMPLETE stay on existing shell split unless a later pass inspects them. |

No Scene 07 `SCRIPT_ERROR` that would require editing UPLP or evaluators.

No Scene 07 `CANONICAL_AMBIGUITY` that stopped implementation of ENTRY–EXPLAIN copy/layout.

---

## Scene 02

| ID | Finding | Class | Resolution in this pass |
|---|---|---|---|
| S02-C01 | Script: four strokes are environment; energy chain is the model. Scene 02 README / primary model already say this. | no conflict | Do not make stroke-name recall the target. |
| S02-C02 | Script OBSERVE/DESCRIBE: no stroke names as primary evidence. Existing copy already says 不必使用冲程名称. Checklist is physical features. | IMPLEMENTATION_GAP (tone) | Update prompts. Keep existing options/gates. |
| S02-C03 | Script PREDICT: allow “我现在还说不上来.” Scene 02 `evidence-contract.md` requires outcome + `hasOwnWords` reason. UPLP does not say the reason must be causal. | IMPLEMENTATION_GAP, **not** a license to delete the gate | Keep `evaluateEnginePrediction`. Add honest-unknown / guess-only stances whose stored sentences satisfy `hasOwnWords` without being treated as energy-chain understanding. |
| S02-C04 | Script EXPERIMENT: run and compare. Scene 02 already has two condition-change experiments, not four optical trials. | no conflict | Do **not** clone Scene 07 trial engine. |
| S02-C05 | Script EXPLAIN: energy source; do not require the textbook slogan as the only wording. Existing EXPLAIN already asks process, not slogan-only. | IMPLEMENTATION_GAP (lead copy) | Update lead. Keep evaluator. |
| S02-C06 | Script MODEL: process → meaning → name. Existing MODEL is energy cards, with stroke names as distractors. | inspected | **Do not rewrite MODEL UI** in this pass. Lead copy may clarify that four names are not the model. |
| S02-C07 | Script TRANSFER: use existing canonical target. | no conflict | No new target. Light conceptual copy only. |
| S02-C08 | Scene 02 `interaction-script.md` (S00–S12) and this Script are two student-experience artifacts. | CANONICAL_AMBIGUITY (scope) | **Do not delete** `interaction-script.md`. This Script is experimental overlay. Evidence-contract and UPLP still win for gates. Stop short of rewriting Scene 02 evidence-contract to match the Script. |
| S02-C09 | AI_OFF: existing Scene 02 AI_OFF is structured + authored; tutor is already off. Happy-path e2e asserts no `/api/tutor` in AI_OFF. | no new defect found for tutor | Do not add LLM interpretation. |
| S02-C10 | COMPLETE lists “demonstrated” capabilities that can overclaim. Script wants a trace. | IMPLEMENTATION_GAP | Replace overclaiming list with a cautious cognitive trace. |
| S02-C11 | LearnerWorkspace is Scene 07-first. Forcing Scene 02 into Lens* components would violate Interaction Shell freeze and the Script’s “do not copy Scene 07 UI.” | SCRIPT_ERROR if copied | Compose LearnerWorkspace slots only. Keep engine playback, Engine* tasks, energy MODEL. |

---

## Stopped behaviors (no invented policy)

1. Did **not** weaken Scene 02 PREDICT `hasOwnWords` gate.
2. Did **not** rewrite Scene 07 MODEL ray grammar into a “seven-field-free” new MODEL.
3. Did **not** repair Scene 07 AI_OFF LLM parse fallthrough in this pass.
4. Did **not** invent a new Scene 02 transfer target or Scene 07 fifth experiment.
5. Did **not** extract a universal experience shell.

---

## Cross-scene grammar (not a conflict)

| | Scene 07 | Scene 02 |
|---|---|---|
| Grammar | spatial / optical | temporal / causal / energy |
| Experiment rhythm | successive spatial trials on one bench | two condition interventions on one cycle |
| MODEL | ray construction | energy chain |
| Transfer | projector / magnifier | existing engine-like targets |

Shared method ≠ shared widgets.
