# Scene 02 — Experience → Interaction Mapping v1

> Engineering bridge only. The Script is **not** executable runtime logic.  
> Physics / evaluators / progression stay with existing Scene 02 owners.  
> Layout: LearnerWorkspace World / Task / Support **composition only** for ENTRY–EXPLAIN.  
> Do **not** reuse LensCurrentAction, LensVocabRow, optical-bench trials, or ray MODEL.

Legend: **Owner** is who is allowed to decide the official result.

Help / tutor: existing Scene 02 `TutorPanel` remains allowed where UPLP already allows it. EXPERIMENT tutor off. AI_OFF tutor off. Do not add LLM interpretation.

---

## S02-M01 ENTRY

| Field | Mapping |
|---|---|
| Moment | S02-M01 |
| UPLP stage | ENTRY |
| Physical world state | Engine visible; stroke labels off |
| Learner-visible task | 先看它动一遍。不用记名字 |
| Learner action | Start exploring |
| Authoritative owner | Progress |
| Visible consequence | OBSERVE |
| Progression condition | existing start |
| Evidence input | none |
| Provenance | n/a |
| Help policy | none |
| AI permission | none |

World may ground 活塞 / 气缸 beside the drawing.

---

## S02-M02 OBSERVE

| Field | Mapping |
|---|---|
| Moment | S02-M02 |
| UPLP stage | OBSERVE |
| Physical world state | Cycle playback dominant |
| Learner-visible task | 先别管每一步叫什么。你注意到了哪些变化？ |
| Learner action | Select observed physical features (existing options) |
| Authoritative owner | existing OBSERVE gate |
| Visible consequence | observation saved |
| Progression condition | existing sufficient |
| Evidence input | physical features, not stroke names |
| Provenance | learner-authored |
| Help policy | existing OBSERVE tutor goal (no energy terms) |
| AI permission | tutor allowed; must not reveal energy chain |

---

## S02-M03 DESCRIBE

| Field | Mapping |
|---|---|
| Moment | S02-M03 |
| UPLP stage | DESCRIBE |
| Physical world state | Snapshot states as already designed |
| Learner-visible task | 活塞在怎么动？气体发生了什么？哪边开着？ |
| Learner action | existing snapshots + own-language sentence |
| Authoritative owner | existing DESCRIBE evaluator |
| Visible consequence | description saved |
| Progression condition | existing structure + own words |
| Evidence input | observed relations |
| Provenance | learner-authored |
| Help policy | existing; no 化学能/内能/机械能 |
| AI permission | tutor allowed within Scene 02 guardrails |

---

## S02-M04 PREDICT

| Field | Mapping |
|---|---|
| Moment | S02-M04 |
| UPLP stage | PREDICT |
| Physical world state | Engine visible; no intervention yet |
| Learner-visible task | Existing experiment-A physical question, framed as a guess: 先猜就可以 |
| Learner action | Commit outcome + stance (idea / guess / unknown) |
| Authoritative owner | `evaluateEnginePrediction` **unchanged** |
| Visible consequence | EXPERIMENT |
| Progression condition | outcome + authored text (`hasOwnWords`) |
| Evidence input | precommit prediction; honest-unknown sentence is authored text, not causal understanding |
| Provenance | learner-authored |
| Help policy | must not reveal result |
| AI permission | tutor allowed; no result leak |

Experiment-B local prediction during EXPERIMENT remains experiment-local, not a second UPLP PREDICT stage.

---

## S02-M05 EXPERIMENT

| Field | Mapping |
|---|---|
| Moment | S02-M05 |
| UPLP stage | EXPERIMENT |
| Physical world state | Deterministic `runCombustionDisabledExperiment` / `runLockedMechanicalSystemExperiment` |
| Learner-visible task | 让它按这个条件运行，对照刚才的猜想 |
| Learner action | existing five-part closure × two experiments |
| Authoritative owner | deterministic engine physics + existing experiment gate |
| Visible consequence | scripted cycle result |
| Progression condition | both experiments closed |
| Evidence input | prediction, intervention, observedResult, comparison, reflection |
| Provenance | learner + system-derived physicsResult |
| Help policy | tutor off (UPLP) |
| AI permission | none |

Do not map this moment onto Scene 07’s four optical trials.

---

## S02-M06 EXPLAIN

| Field | Mapping |
|---|---|
| Moment | S02-M06 |
| UPLP stage | EXPLAIN |
| Physical world state | Two closed experiment records as referents |
| Learner-visible task | 活塞自己动起来了吗？能量从哪里来？ |
| Learner action | existing three process steps + own words |
| Authoritative owner | existing EXPLAIN evaluator |
| Visible consequence | explanation saved |
| Progression condition | existing sufficient |
| Evidence input | causal/energy fragments |
| Provenance | learner-authored |
| Help policy | existing EXPLAIN tutor; no full slogan dump |
| AI permission | tutor allowed; LLM must not decide physics |

---

## S02-M07 MODEL — inspected, not rewritten

Existing energy-chain builder remains. Stroke-name cards stay distractors. Owner: existing MODEL evaluator. This mapping does not copy Scene 07 rays.

---

## S02-M08 TRANSFER — existing targets only

Existing motorcycle / laboratory (or whatever the canonical Scene 02 pair already is) remain. Owner: existing transfer evaluator. Do not invent a new target.

---

## S02-M09 EXAM

Existing Exam World. Owner: existing exam evaluator.

---

## S02-M10 AI_OFF

| Field | Mapping |
|---|---|
| AI permission | **ZERO LLM CALLS** |
| Authoritative owner | existing AI_OFF challenges + deterministic acceptance |
| Visible task | 能量从哪里来，经过了什么变化，最后表现在哪里？ |

---

## S02-M11 COMPLETE

Cognitive trace. Presentation only. Replace overclaiming “demonstrated mastery” bullets.
