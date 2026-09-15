# Scene 07 — Experience → Interaction Mapping v1.1

> Engineering bridge only. The Script is **not** executable runtime logic.  
> Physics / evaluators / progression stay with existing Scene 07 owners.  
> Script: `scene07-learner-experience-v1.1.md`  
> Ledger: `scene07-concept-ledger-v1.md`  
> v1 mapping is kept as history.

Legend: **Owner** is who is allowed to decide the official result.

Audit columns:

- **CONCEPT_AVAILABLE** — every physics term in learner copy is GROUNDED/NAMED or replaced with ordinary language
- **CONTROL_SEMANTICS_VALID** — control matches answer logic; no single-select of simultaneously true claims
- **SYSTEM_PRIMING_RISK** — whether the UI first provides the relation later counted as construction

Help policy: Scene 07 help remains `LensHelpPanel`. TutorPanel stays hidden. AI_OFF / COMPLETE / ENTRY: no help.

---

## S07-M01 ENTRY

| Field | Mapping |
|---|---|
| Moment | S07-M01 |
| UPLP stage | ENTRY |
| Concept availability | 凸透镜/光具座/物体/光屏 NAMED beside referents. Ray-meeting UNSEEN |
| Physical world | Default bench |
| Learner task | Orient; start observing |
| Semantic action | Start lesson |
| Control semantics | primary CTA |
| Authoritative consequence | Progress: OBSERVE |
| Visible consequence | OBSERVE current |
| Progression | existing ENTRY start |
| Evidence input | none |
| Provenance | n/a |
| CONCEPT_AVAILABLE | YES |
| CONTROL_SEMANTICS_VALID | YES |
| SYSTEM_PRIMING_RISK | none |

---

## S07-M02 OBSERVE

| Field | Mapping |
|---|---|
| Moment | S07-M02 |
| UPLP stage | OBSERVE |
| Concept availability | 像 as pattern; 光屏能接到 as screen event. No 会聚/平行/虚像 |
| Physical world | Bench dominant |
| Learner task | Look at object, lens, screen; mark what was seen |
| Semantic action | Observe / record |
| Control semantics | multi-select of seen changes (independent) |
| Authoritative owner | existing OBSERVE gate |
| Visible consequence | observation saved |
| Progression | existing sufficient |
| Evidence input | observation record |
| Provenance | learner-authored structured observation |
| CONCEPT_AVAILABLE | YES |
| CONTROL_SEMANTICS_VALID | YES |
| SYSTEM_PRIMING_RISK | low |

---

## S07-M03 DESCRIBE

| Field | Mapping |
|---|---|
| Moment | S07-M03 |
| UPLP stage | DESCRIBE |
| Concept availability | apparatus + 像; no ray taxonomy |
| Physical world | same bench |
| Learner task | say what was actually seen |
| Semantic action | describe |
| Control semantics | exclusive radios for object/quantities/change (those questions are exclusive) + free response |
| Authoritative owner | existing DESCRIBE evaluator |
| Visible consequence | description saved |
| Progression | structure + own words |
| Evidence input | observable relation |
| Provenance | learner-authored |
| CONCEPT_AVAILABLE | YES |
| CONTROL_SEMANTICS_VALID | YES |
| SYSTEM_PRIMING_RISK | low |

---

## S07-M04 PREDICT

| Field | Mapping |
|---|---|
| Moment | S07-M04 |
| UPLP stage | PREDICT |
| Concept availability | F/2F as places; no 会聚 premise |
| Physical world | bench visible |
| Learner task | guess what happens between F and 2F |
| Semantic action | predict |
| Control semantics | exclusive outcome radio + stance radio + optional reason |
| Authoritative owner | PREDICT commit; not correctness |
| Visible consequence | EXPERIMENT unlocks |
| Progression | existing commit |
| Evidence input | prediction record |
| Provenance | learner-authored |
| CONCEPT_AVAILABLE | YES |
| CONTROL_SEMANTICS_VALID | YES |
| SYSTEM_PRIMING_RISK | none |

---

## S07-M05 EXPERIMENT A

| Field | Mapping |
|---|---|
| Moment | S07-M05 |
| UPLP stage | EXPERIMENT |
| Concept availability | 光屏能接到 USED; 光线 UNSEEN as explanation |
| Physical world | object to F–2F; screen movable; **no pedagogical ray overlay yet** |
| Learner task | find a clear screen position |
| Semantic action | intervene / inspect / record / compare / reflect |
| Control semantics | exclusive observed-screen radio; exclusive size radio filtered to this trial; free-response reflection |
| Authoritative owner | existing experiment gates + physics bench |
| Visible consequence | clear image found |
| Progression | closed trial A |
| Evidence input | experiment evidence |
| Provenance | learner observation + physics result |
| CONCEPT_AVAILABLE | YES |
| CONTROL_SEMANTICS_VALID | YES |
| SYSTEM_PRIMING_RISK | low |

---

## S07-M06 EXPERIMENT B — anomaly (screen first)

| Field | Mapping |
|---|---|
| Moment | S07-M06 |
| UPLP stage | EXPERIMENT |
| Concept availability | 平行/会聚/像在无限远 NOT AVAILABLE. Use ordinary screen language |
| Physical world | object at F; screen movable; **rays hidden until after screen failure is recorded** |
| Learner task | move to F; search for a clear screen position |
| Semantic action | intervene / inspect / record screen |
| Control semantics | exclusive screen result; size/cover options filtered (no “折射后光线平行…”) |
| Authoritative owner | physics: no clear finite real image |
| Visible consequence | no clear screen image |
| Progression | observed saved |
| Evidence input | screen failure record |
| Provenance | learner observation |
| CONCEPT_AVAILABLE | YES (ordinary language) |
| CONTROL_SEMANTICS_VALID | YES |
| SYSTEM_PRIMING_RISK | none |

---

## S07-M07–M08 EXPERIMENT B — rays then connect

| Field | Mapping |
|---|---|
| Moment | S07-M07 / S07-M08 |
| UPLP stage | EXPERIMENT |
| Concept availability | 光线 GROUNDED by showing outgoing paths after record; 近似平行 NAMED only after notice |
| Physical world | pedagogical outgoing paths (`twoStandardRays` as visible light, not a completed MODEL grade) |
| Learner task | look along paths; say whether they meet; connect to screen failure |
| Semantic action | inspect light / reflect |
| Control semantics | free response. Do not radio “平行 / 会聚 / 无限远” |
| Authoritative owner | existing reflection `hasOwnWords` gate; physics already shown |
| Visible consequence | trial B closed |
| Progression | existing closed-trial rule |
| Evidence input | reflection text |
| Provenance | learner-authored. Not MODEL L4 |
| CONCEPT_AVAILABLE | YES after reveal |
| CONTROL_SEMANTICS_VALID | YES |
| SYSTEM_PRIMING_RISK | medium (visible paths can suggest the later model). Do not score as construction |

---

## S07-M09–M10 EXPERIMENT C — actual rays then backward extension

| Field | Mapping |
|---|---|
| Moment | S07-M09 / S07-M10 |
| UPLP stage | EXPERIMENT |
| Concept availability | 反向延长 UNAVAILABLE until after actual-ray “no meeting”; then GROUNDED visually |
| Physical world | object inside F; screen search first; then actual outgoing paths; **backward extension only after learner reveals it** |
| Learner task | confirm screen failure; see divergence; then extend backward; connect see vs receive |
| Semantic action | intervene / record / reveal extension / reflect |
| Control semantics | exclusive screen record; optional reveal control; free response |
| Authoritative owner | physics bench + existing reflection gate |
| Visible consequence | trial C closed |
| Progression | existing |
| Evidence input | reflection |
| Provenance | learner-authored. Not L4 |
| CONCEPT_AVAILABLE | YES by end of trial |
| CONTROL_SEMANTICS_VALID | YES |
| SYSTEM_PRIMING_RISK | medium after reveal |

---

## S07-M11 EXPERIMENT D

| Field | Mapping |
|---|---|
| Moment | S07-M11 |
| UPLP stage | EXPERIMENT |
| Concept availability | 像 already GROUNDED; no new ray terms |
| Physical world | cover part of lens |
| Learner task | see whether half the image vanishes |
| Semantic action | cover / record |
| Control semantics | exclusive cover-result options |
| Authoritative owner | existing experiment |
| Visible consequence | whole image remains |
| Progression | all trials closed → EXPLAIN |
| Evidence input | experiment evidence |
| Provenance | learner observation |
| CONCEPT_AVAILABLE | YES |
| CONTROL_SEMANTICS_VALID | YES |
| SYSTEM_PRIMING_RISK | low |

---

## S07-M12 EXPLAIN

| Field | Mapping |
|---|---|
| Moment | S07-M12 |
| UPLP stage | EXPLAIN |
| Concept availability | screen results AVAILABLE; do not require 会聚/反向延长/平行 as the question stem |
| Physical world | bench still visible as referent; no MODEL ray editor |
| Learner task | exclusive questions about already-seen screen results + own words |
| Semantic action | explain (L3 fragment) |
| Control semantics | **single-select only where options are mutually exclusive.** Q1: always / sometimes / never receive. Q2: see-vs-receive same / not the same / no-image-if-no-screen. Free response |
| Authoritative owner | `evaluateLensExplanation` (Scene EXPLAIN, not Physics Truth rewrite) |
| Visible consequence | EXPLAIN saved; MODEL unlocks |
| Progression | existing EXPLAIN sufficient |
| Evidence input | `meetingFragment` / `screenFragment` reused as exclusive observation ids + text |
| Provenance | learner-selected observation + authored text. Not construction |
| CONCEPT_AVAILABLE | YES |
| CONTROL_SEMANTICS_VALID | YES after repair (v1 FAIL) |
| SYSTEM_PRIMING_RISK | low–medium (own words still follow two observations). Must not be L4 |

v1 invalid controls (repaired):

- `LENS_EXPLAIN_MEETING` radios listing three simultaneously true model claims
- `LENS_EXPLAIN_SCREEN` radios listing two simultaneously true receive claims

---

## S07-M13–M16 MODEL

| Field | Mapping |
|---|---|
| Moment | S07-M13 … S07-M16 |
| UPLP stage | MODEL |
| Concept availability | use only NAMED terms; ordinary language otherwise |
| Physical world | frozen bench; student-constructed rays; recap of prior trial outcomes |
| Learner task | recap → assemble two required rays → connect meeting for **this station** → image/screen → authored reusable idea |
| Semantic action | construct spatial-ray relation |
| Control semantics | station radio (exclusive stations); ray kind/after-lens construction (existing model grammar); meeting radio **for this station only**; image radios exclusive for this station; authored textarea |
| Authoritative owner | `evaluateConvexLensModelConstruction` unchanged |
| Visible consequence | student rays; MODEL accepted or repair |
| Progression | `correctStructure` |
| Evidence input | full construction attempt + authored bind |
| Provenance | `constructionSource` remains `student-constructed` for the official evaluator. **EVIDENCE_IMPLEMENTATION_GAP:** named ray-kind menus are still system-provided recognition plus geometry. Do not silently retag L4. Authored-only must fail |
| CONCEPT_AVAILABLE | YES if copy follows ledger |
| CONTROL_SEMANTICS_VALID | YES if meeting/image radios are station-scoped. Whole-model multi-true radios forbidden |
| SYSTEM_PRIMING_RISK | **REMAINS (reduced).** Option labels and visible rays can prime the final sentence. Final authored text is not independent construction. Evaluator still requires construction actions |

---

## S07-M17 TRANSFER

| Field | Mapping |
|---|---|
| Moment | S07-M17 TRANSFER |
| UPLP stage | TRANSFER |
| Concept availability | after MODEL; meeting language may be USED |
| Physical world | Exam-like situation cards; no optical-bench World |
| Learner task | existing projector then magnifier |
| Semantic action | transfer |
| Control semantics | existing transfer architecture (unchanged) |
| Authoritative owner | existing transfer evaluator |
| Visible consequence | L5 flags only via accumulator |
| Progression | existing pair |
| Evidence input | transfer attempts |
| Provenance | existing |
| CONCEPT_AVAILABLE | YES (post-MODEL) |
| CONTROL_SEMANTICS_VALID | YES (architecture unchanged this pass) |
| SYSTEM_PRIMING_RISK | existing transfer recap language; do not strengthen to independent construction |

---

## EXAM / AI_OFF / COMPLETE

| Moment | CONCEPT_AVAILABLE | CONTROL_SEMANTICS_VALID | SYSTEM_PRIMING_RISK |
|---|---|---|---|
| EXAM | post-MODEL; do not require 像在无限远 | existing exclusive exam radios | exam options are recognition; not L4 |
| AI_OFF | independent use; **zero LLM** | existing | n/a for LLM. Fast-path only |
| COMPLETE | trace of what was thought | none | do not display mastery |

AI_OFF mapping (hard boundary):

```text
llmEnabled = false
tutorVisible = false
allowedActions = []
NO LLM CALLS
```

`resolveLensAiOffCheck` must not fall through to `/api/lens-step6-parse`.

---

## Invalid single-select inventory (v1 → v1.1)

| Location | v1 control | Why invalid | v1.1 |
|---|---|---|---|
| EXPLAIN meeting | radio of three true model claims | all can be true together | exclusive observation: screen always/sometimes/never |
| EXPLAIN screen | radio of two true receive claims + distractor | first two can both be true | exclusive: see vs receive |
| MODEL meeting | radio of three meeting modes | **valid if** question is this station; invalid if read as whole-model | keep radio; ordinary station-scoped labels |
| MODEL image nature/side/receive | radios | valid for one constructed station | keep; ordinary labels; no “普通成像” guardrail voice |
