# Scene 07 — Experience → Interaction Mapping v1

> Engineering bridge only. The Script is **not** executable runtime logic.  
> Physics / evaluators / progression stay with existing Scene 07 owners.  
> Layout: LearnerWorkspace World / Task / Support (D068), extended through EXPLAIN in this pass.

Legend: **Owner** is who is allowed to decide the official result.

Help policy: Scene 07 help remains `LensHelpPanel`. TutorPanel stays hidden. AI_OFF / COMPLETE / ENTRY: no help.

---

## S07-M01 ENTRY

| Field | Mapping |
|---|---|
| Moment | S07-M01 |
| UPLP stage | ENTRY |
| Physical world state | Default bench: object, lens, screen, F / 2F visible |
| Learner-visible task | Orient; start observing. No five-case lecture |
| Learner action | Start the lesson |
| Authoritative owner | Progress (session stage) |
| Visible consequence | OBSERVE becomes current |
| Progression condition | Existing ENTRY start action |
| Evidence input | none |
| Provenance | n/a |
| Help policy | none |
| AI permission | none |

---

## S07-M02 OBSERVE

| Field | Mapping |
|---|---|
| Moment | S07-M02 |
| UPLP stage | OBSERVE |
| Physical world state | Bench dominant; object/screen movable |
| Learner-visible task | 先看看这个装置。物体、透镜和光屏分别在哪里？ Then mark what was actually seen |
| Learner action | Inspect / move; submit observation record |
| Authoritative owner | Scene OBSERVE evaluator / existing observation gate |
| Visible consequence | Apparatus changes; observation saved |
| Progression condition | Existing OBSERVE sufficient |
| Evidence input | observation record (not imaging rule) |
| Provenance | learner-authored structured observation |
| Help policy | LensHelpPanel; no answer leakage |
| AI permission | no TutorPanel; existing help intents only |

---

## S07-M03 DESCRIBE

| Field | Mapping |
|---|---|
| Moment | S07-M03 |
| UPLP stage | DESCRIBE |
| Physical world state | Same bench as referent |
| Learner-visible task | 看着左边的实验，用自己的话说说看到了什么 |
| Learner action | Answer existing physical follow-ups + own-language sentence |
| Authoritative owner | existing DESCRIBE evaluator |
| Visible consequence | description saved |
| Progression condition | existing structure + own words |
| Evidence input | observable relation; not token slogans |
| Provenance | learner-authored |
| Help policy | LensHelpPanel |
| AI permission | no TutorPanel |

---

## S07-M04 PREDICT

| Field | Mapping |
|---|---|
| Moment | S07-M04 |
| UPLP stage | PREDICT |
| Physical world state | Bench visible; trial A not yet the committed intervention |
| Learner-visible task | 如果把物体移到 F 和 2F 之间，你觉得会发生什么？ 先猜就可以 |
| Learner action | Commit outcome + stance (idea / guess / unknown) |
| Authoritative owner | existing PREDICT commit; not correctness |
| Visible consequence | EXPERIMENT unlocks |
| Progression condition | existing prediction sufficient (honest-unknown allowed) |
| Evidence input | precommit prediction; reason only if actually given |
| Provenance | learner-authored; honest-unknown is not causal evidence |
| Help policy | LensHelpPanel; must not reveal result |
| AI permission | no TutorPanel |

---

## S07-M05 / S07-M06 EXPERIMENT

| Field | Mapping |
|---|---|
| Moment | S07-M05 first trial; S07-M06 later trials |
| UPLP stage | EXPERIMENT |
| Physical world state | Trial start state from `lens-trial-intervention` (unchanged physics) |
| Learner-visible task | One current physical action: move object / move screen / cover / record / compare / next physical question |
| Learner action | Existing five-part closure per trial |
| Authoritative owner | deterministic bench physics + existing experiment gate |
| Visible consequence | image/screen result; comparison is learner judgment, not official grade |
| Progression condition | four closed trials as already required |
| Evidence input | prediction, intervention, observation, comparison, reflection |
| Provenance | learner + system-derived physics result |
| Help policy | LensHelpPanel; no rule dump |
| AI permission | UPLP: tutor off in EXPERIMENT |

Chrome mapping: trial kicker / next-CTA use a **physical question**, not “第 N 张表.” Trial IDs stay A–D.

---

## S07-M07 EXPLAIN

| Field | Mapping |
|---|---|
| Moment | S07-M07 |
| UPLP stage | EXPLAIN |
| Physical world state | Bench + prior trial results as referents; no ray construction |
| Learner-visible task | 物体位置变了，结果也变了。真正起作用的是什么？ |
| Learner action | existing meeting/screen fragments + own words |
| Authoritative owner | existing EXPLAIN evaluator (D064 L3 fragments) |
| Visible consequence | explanation saved |
| Progression condition | existing EXPLAIN sufficient |
| Evidence input | fragment account of seen results |
| Provenance | learner-authored |
| Help policy | existing EXPLAIN AI/help policy; do not reveal MODEL |
| AI permission | tutor still hidden in Scene 07; help panel only |

---

## S07-M08 MODEL — inspected, not rewritten

| Field | Mapping |
|---|---|
| Moment | S07-M08 |
| UPLP stage | MODEL |
| Physical world state | model-owned ray construction workspace |
| Learner-visible task | existing construction steps (unchanged architecture) |
| Learner action | existing MODEL steps + authored bind |
| Authoritative owner | existing MODEL evaluator |
| Visible consequence | accepted / missing from Scene action result |
| Progression condition | existing MODEL accept |
| Evidence input | construction + authored meeting→image bind |
| Provenance | existing Scene 07 MODEL provenance |
| Help policy | existing |
| AI permission | existing MODEL parse path (not AI_OFF) |

This mapping does **not** make the Script a new MODEL grammar.

---

## S07-M09 TRANSFER — architecture preserved

Existing projector + magnifying glass targets, target-bound deterministic evaluator, authored causal link. No new fields. Copy may say the bench is set aside; evaluator unchanged.

---

## S07-M10 EXAM

Existing Exam World sequence. Owner: existing exam evaluator. AI: existing EXAM help policy; no answer before commit.

---

## S07-M11 AI_OFF

| Field | Mapping |
|---|---|
| AI permission | **ZERO LLM CALLS** (UPLP) |
| Authoritative owner | existing AI_OFF challenges + deterministic/system-derived interpretation |
| Known defect | `resolveLensAiOffCheck` may still request `/api/lens-step6-parse` when fast-path does not handle the text. **Do not hide. Do not treat this mapping as a repair authorization.** |

---

## S07-M12 COMPLETE

Cognitive trace of prediction / experiment / relation / independent use. Owner: presentation only. Not L-level evidence. No mastery claim.
