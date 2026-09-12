# Five-Scene Prototype Milestone Synthesis

> Date: 2026-09-12  
> Kind: project-level decision support  
> Not: Scene implementation, model redesign, learner validation, or Scene 06 design  
> Authority used: implemented Scenes, canonical models, PRE/POST artifacts, Evidence Design Contract, UPLP, Schema, Library, D041–D048

Five quality-reviewed prototypes are **architecture, engineering, and evidence-design** evidence.  
They are **not** learner-outcome evidence.

---

## 1. Executive Finding

Scenes 01–05 demonstrate that one Universal Physics Learning Protocol can host five structurally different Physics Models, that MODEL UI must stay model-owned, and that Evidence Design / Gate B repeatedly caught the same false-evidence shortcuts.

They do **not** demonstrate that Grade-9 students learn, transfer, score better, or will use the product.

The highest-information unknown is now **learner behavior**, not “can we implement another model.”

A sixth Scene in a new category (circuit, optics, wave) would still have **medium** architecture value. It would not answer the product hypothesis.

**Recommendation:** do a **minimal learner-validation preparation pass**, then a small observation, then decide whether Scene 06 or a larger study is next.

```text
DIVERSITY_SUFFICIENT_FOR_ARCHITECTURE_MILESTONE
SCENE_06_INFORMATION_VALUE = MEDIUM
NEXT_STEP = LEARNER_VALIDATION_PREP
```

No new lifecycle state is created. All five remain `metadata.status = prototype`. Not learner-validated. Not production-ready.

---

## 2. Current Prototype Inventory

| Scene | ID | Primary model | PRE (in-repo) | POST | Status |
|---|---|---|---|---|---|
| 01 | `microwave-bread` | `energy-internal-energy-temperature` | `MODEL_QUALITY_PASS_WITH_REFINEMENTS` | `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS` | prototype |
| 02 | `four-stroke-engine` | `chemical-energy-internal-energy-mechanical-energy` | no standalone PRE file | `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS` | prototype |
| 03 | `horizontal-force-cart` | `force-changes-motion-state` | no standalone PRE file | `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS` | prototype |
| 04 | `equal-volume-material-samples` | `density-mass-volume` | Gate A in worked example: `MODEL_QUALITY_PASS` | `LEARNING_EVIDENCE_PASS` | prototype |
| 05 | `equal-mass-heated-samples` | `specific-heat-capacity` | `MODEL_QUALITY_PASS` | `LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS` | prototype |

All five: quality-reviewed prototype. **NOT learner-validated.**

Scene 01 used the legacy path: reconstruction → PRE → readiness → Evidence Claim Design → focused migration → engineering → POST → inventory write.  
Scenes 02–05 used the production path, with Scene 02/03 PRE artifacts incomplete in the repository.

---

## 3. Five-Scene Comparison

| | 01 Microwave | 02 Engine | 03 Cart | 04 Samples | 05 Heat |
|---|---|---|---|---|---|
| **PRIMARY MODEL** | energy-internal-energy-temperature | chemical-energy-internal-energy-mechanical-energy | force-changes-motion-state | density-mass-volume | specific-heat-capacity |
| **DEEP STRUCTURE TYPE** | energy / state relation | energy-conversion chain | force/motion conditional relation | ratio / invariant | comparative thermal product |
| **ANCHOR PHENOMENON** | bread heats in a microwave | four-stroke piston engine | horizontal force on a cart | equal-volume material samples | equal-mass heated samples |
| **CORE RELATION** | energy in/out → U changes → T may change | chemical → gas U/state → work → mechanical | current motion + net force → motion-state change | ρ = m / V | Q = c m ΔT |
| **MODEL BOUNDARY** | not microwave EM; not heat-vs-work; not c; not phase-change as primary | not four-stroke names as the model; not Scene 01 T-chain | not energy chain; not “force means motion” | not float/sink as density; not Scene 02/03 boards | not time-as-Q; not phase-change interval; not Scene 01 T-chain |
| **KEY MISCONCEPTION** | T = U; heat stored; energy in ⇒ T must rise | combustion jumps to motion; stroke names = energy | force means motion; zero net force ⇒ stop | heavier ⇒ denser; bigger ⇒ denser | heating time is Q; energy in ⇒ T must rise |
| **MODEL REPRESENTATION** | energy/state chain + conditions | energy/causal slots + relation kinds | three-case force/motion board | ratio-quantitative table | product/ratio board |
| **EXPERIMENT STYLE** | one ordinary within-boundary heating | two interventions (no combustion; locked mechanism) | case-based force/motion runs | controlled equal-V comparison | controlled equal-m heating comparison |
| **TRANSFER DESIGN** | kettle full-model + ice boundary | motorcycle/lab full-model + steam partial-structure | bicycle/ball full-model + hover boundary | cups/stone full-model + hollow boundary | pots/coast/car full-model + ice boundary |
| **BOUNDARY-CONTRAST** | energy can enter; T need not rise | (steam is partial-structure, not boundary-contrast) | zero net force; motion unchanged | outer size ≠ material volume / density | Q = c m ΔT does not cover melting |
| **AI_OFF DESIGN** | A ordinary spoon; B ice boundary | A unfamiliar combustion piston; B locked mechanism | A hover sled; B balanced tug | A sealed packages; plus condition challenge | A lunchboxes; B ice-pack boundary |
| **L4 EVIDENCE** | chain + T ≠ U + condition + authored distinction | slots + relation kinds + combustion-enables | three case triples + conditions | ratio that explains comparisons, not formula-only | product relation + no-phase-change / time ≠ Q |
| **L5 EVIDENCE** | valid MODEL + kettle + ice, `targetId`-bound | valid MODEL + motorcycle + steam split | valid MODEL + bicycle/ball + hover authorship | valid MODEL + required pair, ratio-bound | valid MODEL + pots + ice phase-change structure |
| **L6 EVIDENCE** | pre-commit ordinary + boundary; post-check confirm only | pre-commit work / locked-condition; `llmUsed === false` | pre-commit state + condition + relation; `llmUsed === false` | pre-commit ratio reasoning; `llmUsed === false` | pre-commit product + ice boundary; `llmUsed === false` |
| **PRE RESULT** | PASS_WITH_REFINEMENTS | not filed standalone | not filed standalone | PASS (example) | PASS |
| **POST RESULT** | PASS_WITH_REFINEMENTS | PASS_WITH_REFINEMENTS | PASS_WITH_REFINEMENTS | PASS | PASS_WITH_REFINEMENTS |
| **CURRENT STATUS** | prototype | prototype | prototype | prototype | prototype |
| **IMPORTANT RESIDUAL RISK** | structured click-through; token authored floors; same mega-sentence can satisfy both AI_OFF authored helpers | visible-card click-through; COMPLETE copy slightly strong | visible three-case click-through | structured radios can be clicked through | six-radio L4 lock; labeled ice probes |

Do not collapse these into one visual grammar.

---

## 4. Deep-Structure Diversity

Repository terminology, not a new taxonomy:

| Structure | Scene | MODEL grammar lock |
|---|---|---|
| energy / state relation | 01 | `energy-state-chain` |
| energy-conversion chain | 02 | chemical → work → mechanical slots |
| force/motion conditional relation | 03 | three-case condition/relation board |
| ratio / invariant | 04 | `ρ = m / V` table |
| comparative thermal product | 05 | `Q = c m ΔT` product board |

Also varied: qualitative (01, 03) vs quantitative (04, 05); one vs two experiments; `full-model` + `boundary-contrast` (01, 03, 04, 05) vs `full-model` + `partial-structure` (02).

**Result:** `DIVERSITY_SUFFICIENT_FOR_ARCHITECTURE_MILESTONE`

Why: five different MODEL representations, two mechanism families (energy vs force), qualitative and quantitative reasoning, and both boundary-contrast and partial-structure transfer. The architecture is not overfit to microwave energy-chain UI.

This does **not** mean Grade-9 curriculum coverage is sufficient. Untested Library categories include circuits (`ohms-law`), optics (`convex-lens-imaging`), waves (`sound-vibration-source`), pressure, and mechanical work/power.

---

## 5. UPLP Generalization Findings

The same stage sequence ran on all five Scenes:

```text
ENTRY → OBSERVE → DESCRIBE → PREDICT → EXPERIMENT → EXPLAIN → MODEL → TRANSFER → EXAM → AI_OFF → COMPLETE
```

| Stage | Semantics stable? | Model-specific implementation? |
|---|---|---|
| OBSERVE / DESCRIBE | YES — phenomenon / quantity language | Scene-owned options |
| PREDICT | YES — commit before result | Scene-owned outcomes |
| EXPERIMENT | YES — five-part closure | Scene-owned physics engines |
| EXPLAIN | YES — below full MODEL | Scene-owned partial-relation gates |
| MODEL | YES as *construction of this model* | **Five different boards** |
| TRANSFER | YES — reuse / refuse relations | Scene-owned targets + `transferMode` |
| EXAM | YES — Exam World, answer ≠ reasoning | Canonical `examPatterns` + overlay |
| AI_OFF | YES — no tutor; pre-commit reasoning | Scene-owned challenges |
| COMPLETE | YES — traces, not mastery | Scene-owned copy |

UPLP generalized well as **cognitive purpose**.  
Forcing one MODEL grammar would have been harmful. Scene 01 must not use Scene 02 work slots; Scene 03 must not use an energy chain; Scene 04/05 must not use either.

**Demonstrated:**

```text
same learning protocol
  ≠
same model representation
```

UPLP was not changed by this synthesis.

---

## 6. Physics Model Architecture Findings

Supported by the five prototypes:

| Separation | Evidence |
|---|---|
| Physics Model ≠ phenomenon | Microwave / engine / cart / samples / heat are environments, not model IDs |
| Physics Model ≠ Scene | One primary model per Scene; secondary models do not become learning targets |
| Physics Model ≠ exam item | Exam World maps representations of the same model |
| Schema generality | Energy chain, force board, and two ratio/product models all validate |
| Library usefulness | Canonical IDs existed before or with implementation; no Scene-invented IDs |
| `transferMode` | `full-model`, `boundary-contrast`, and `partial-structure` all used |
| AssessmentOverlay | Exam/AI_OFF intended answers live in overlay, not Schema |
| SceneAdapter | Universal progression looks up adapters; no new universal `sceneId` learning switch |
| Deterministic physics | Five app-owned engines; LLM does not own outcomes |

Not yet tested by these five:

- circuit / network relations
- geometric / optical constructions
- wave/sound representations
- multi-Scene reuse of one model as a *secondary* learning target
- a real multi-student / multi-session research store
- the future Learner Validation Protocol (named, not written)
- `validated` or `production` transitions

---

## 7. Evidence Design Findings

Recurring failures were real. They appeared in implementation, then in Gate B, then in the Evidence Design Contract (D044).

| FAILURE PATTERN | WHICH SCENES | CLAIM THREATENED | HOW FIXED | CONTRACT NOW | RESIDUAL? |
|---|---|---|---|---|---|
| Post-check recognition substituting for pre-commit reasoning | 02, 03, 05, then 01 by design | L6 independent use | Official flags from committed structure/text only | Evidence Design provenance; POST Gate B | Bookkeeping smells remain; manufacture blocked |
| Token / noun sandwich treated as relation | 01 legacy; 02 steam; 05 ice | L3–L5 relation | Reject sandwiches; require structured relations | Relation-over-token | Phrase-family / token floors remain |
| Text-length floor treated as understanding | 01 legacy (≥N chars); others | L2–L6 | Separate authorship from relation | Authorship floors ≠ understanding | ≥8 Han still used as a floor, not as the claim |
| Transfer not bound to actual target | 01 legacy; 03 bicycle | L5 | `targetId` + target-specific unit | Target-specific transfer | Residual labeled choices |
| Partial/boundary without transferable structure | 02 steam; 01/03/05 ice | L5 boundary/partial | Explicit transferable / non-transferable or boundary probes | `transferMode` semantics | Residual short sentences |
| Structured click-through overclaimed as construction | all five POST | L4 | Named residual; not treated as L5/L6 | Structured UI is claim-bounded | **Yes — main pedagogical leftover** |
| Stage completion confused with mastery | 01 legacy accumulator | L4–L6 | Flags → `deriveModelEvidenceLevel` only | Stage completion ≠ mastery | COMPLETE copy must stay bounded |
| Answer ≠ reasoning ≠ model ≠ transfer ≠ independent use | all five, historically | L4–L6 escalation | Accumulators require prior flags | Schema L-level derivation | Residual if UI copy overclaims |

Evidence Design Contract is solving a **repeated implementation problem**, not only adding documentation.

---

## 8. Production Pipeline Findings

```text
Model → PRE → Readiness → Evidence Claim Design → Implementation
  → adversarial tests → Engineering → POST → prototype
```

Scene 01 also proved a **legacy migration** path can join that pipeline without rewriting UPLP.

| Part | Repeatable now? | Human judgment required? | Cursor-automatable? | Review-required? |
|---|---|---|---|---|
| Fill Schema-shaped model files | YES | YES — boundaries | Drafting yes | PRE |
| PRE Gate A | YES as a request | YES — physics/pedagogy | Assist, not decide | YES |
| Readiness validator | YES | Low | YES | Spot-check |
| Evidence Claim Design | YES after D044 | YES — weakest pass | Drafting yes | YES |
| One-pass implementation | YES (02–05; 01 migration) | Medium | YES with stop conditions | Engineering + POST |
| Adversarial evaluator tests | YES | YES — invent attacks | Scaffold yes | YES |
| Engineering gates | YES | Low | YES | YES |
| POST Gate B | YES | YES — claim vs weakest pass | Assist, not decide | YES |
| Inventory write | YES after D041 | Low | Mechanical | Confirm POST first |

Useful stop conditions (already in prompts): do not invent physics; do not change UPLP/L-levels; do not add universal `sceneId` branches; do not let LLM decide correctness; do not self-promote `prototype`.

**Stable enough that Scene 06 should not require methodology invention.**  
It would still require PRE/POST human judgment. Not full automation.

Gap: Scene 02/03 have no standalone PRE files in `spec/reviews/pre/`. Future models should file PRE before implementation.

---

## 9. What We Now Know

- One UPLP can host structurally different Physics Models.
- MODEL UI cannot be universalized into one representation grammar.
- Physics Model ≠ phenomenon ≠ Scene ≠ exam question is implementable.
- Deterministic physics and evaluators can coexist with a secondary LLM tutor.
- AI_OFF can technically hide the tutor and require `llmUsed === false`.
- Official L1–L6 can be derived from flags without Scene code assigning `"L4"|"L5"|"L6"`.
- Evidence provenance matters: post-check must not manufacture L6.
- Transfer must be bound to `targetId` / the actual case.
- `boundary-contrast` and `partial-structure` are useful against overgeneralization.
- Engineering PASS is not evidence quality; POST can refuse shortcuts.
- A legacy Scene can be migrated onto the canonical architecture.
- Cursor can implement a model through the production protocol when sitting locks exist.
- The same evidence-design failures recurred until a shared contract owned them.

No learner-outcome claim is included.

---

## 10. What We Still Do Not Know

Ranked by product risk.

### P0 — existential product hypotheses

- Can a real Grade-9 student complete the loop without an adult driving the UI?
- Do they construct the intended mental model, or only click intended labels?
- After MODEL, can they transfer without the classroom surface?
- Does AI_OFF independent work predict later unprompted use?
- Will anyone finish, or do they quit at EXPLAIN/MODEL/TRANSFER?

These are the original product hypotheses (`PROJECT_BRAIN` §1; `OPEN_QUESTIONS` O001–O003, O007).

### P1 — important design / product uncertainties

- Are structured boards too leading (the shared POST residual)?
- Do AI hints reduce or improve thinking (O002)?
- Cognitive load and time-to-complete on a full loop?
- Exam-representation transfer after a delay (O003)?
- Teacher/parent trust without score-gain claims?

### P2 — optimization / refinement

- How realistic the simulation should be (O005)
- Transfer-distance mix (O006)
- How much formal language to introduce (O004)
- Curriculum coverage beyond five models
- Whether a sixth structure (circuit / optics / wave) strains Schema/UI

Do not manufacture answers.

---

## 11. Claim / Evidence / Unknown Matrix

| CLAIM | CURRENT EVIDENCE | TYPE | CONFIDENCE | WHAT WE CAN SAY | WHAT WE CANNOT SAY YET | NEXT EVIDENCE |
|---|---|---|---|---|---|---|
| UPLP can support multiple Physics Model structures | Five Scenes, five MODEL grammars, one stage sequence | A architecture | SUPPORTED | Protocol ≠ representation | Students experience it as one coherent course | Learner completion of one non-energy Scene |
| Schema is general enough for current prototypes | Five validating models | A | SUPPORTED | These five fit | Circuits/optics/waves fit | Only if a new category is implemented |
| Evidence Design Contract prevents known false-evidence patterns | Recurrence across 01–05; Gate B repairs; D044 | C quality-review | PARTIALLY SUPPORTED | Known shortcuts are now designed against | No new shortcut class will appear; students won’t game radios | First learner sessions + new POST attacks |
| Cursor can implement models through the protocol | 02–05 one-pass; 01 migration | B+C | PARTIALLY SUPPORTED | Repeatable with human PRE/POST | Full automation; zero judgment | Scene 06 would only reconfirm |
| AI remains secondary to deterministic state | Tutor policy, leak checks, AI_OFF hard block, physics in code | A+B | SUPPORTED technically | App owns outcomes and flags | Scaffolding helps students | Learner hint-use observation |
| AI_OFF can enforce no-tutor conditions | Hidden controls; `llmUsed === false`; tutor-event block | B | SUPPORTED technically | The gate can be hard | Students reason independently | AI_OFF attempt quality in the wild |
| Students form stronger physics models | None | D | NOT YET TESTED | — | Any learning gain | Small observation + MODEL/TRANSFER traces |
| Students transfer better | None from learners | D | NOT YET TESTED | Evaluators can *score* designed transfer | Transfer happened in a mind | Near + boundary tasks after MODEL |
| Students solve exams better | None | D | NOT YET TESTED | Exam World exists | Score improvement | Later, not first |
| Students need less drilling | None | D | NOT YET TESTED | Product intent forbids drill-as-goal | Drill reduction | Only after transfer evidence |
| Students will engage voluntarily | None | D | NOT YET TESTED | COMPLETE exists | They will start or finish | Quit / time / skip signals |
| Teachers/parents will perceive value | None | D | NOT YET TESTED | Copy avoids false mastery claims | Perceived value | Adult observation, later |

A/B/C evidence must not be restated as D.

---

## 12. Learner-Validation Gap

The future Learner Validation Protocol is **named** in Schema / Quality Review and **not written**.

### Already observable in a local session

`LearningSession` already stores, per Scene, in `localStorage`:

- stage and events (including timestamps)
- observations, descriptions, predictions
- experiment evidence (comparison / reflection)
- explanations, MODEL attempts, transfer attempts
- exam answers + reasoning
- AI_OFF committed attempts vs post-check
- `aiInteractions` (hint requests)
- completion flag

That is enough to inspect **one** completed or abandoned session without a vendor analytics stack.

### Not available

- a written observer protocol
- a researcher-facing export / redaction checklist
- multi-student aggregation
- consent copy for a school or family observation
- time-on-stage summaries (raw timestamps exist; no derived report)
- any `validated` criteria

### REQUIRED BEFORE LEARNER VALIDATION

1. Write a thin Learner Validation Protocol (questions, Scene choice, warning signals). Not a journal study.
2. Pick **one** first Scene. Do not run five Scenes as the first observation.
3. Define how an observer inspects a local session (browser storage or a later opt-in JSON export).
4. No accounts, no cloud PII, no unnecessary personal data.
5. Adult present for Grade-9 observation; product does not collect identity.

### NICE TO HAVE

- One-click local session export (no network)
- Time-on-stage derived from existing events
- Observer notes template
- Second Scene after the first observation

Do not add invasive analytics to “get ready.”

---

## 13. Scene 06 Information Value

```text
SCENE_06_INFORMATION_VALUE = MEDIUM
```

What Scene 06 **would** still teach, if it were a **new deep-structure category** from the Library (circuit/network, optical/geometric, wave/sound):

- whether Schema/UI/adapter assumptions break outside mechanics/thermal models

What Scene 06 **would not** teach if it is “another implementable model” in an already-covered family:

- only that the pipeline can be run again

Scenes 01–05 already include energy-state, energy-chain, force-condition, ratio, and thermal product. Density and force were the Library’s own “third implementation should be a different domain” examples. That architecture question is answered.

A missing category remains a **P2/P1 architecture** question, not the P0 product question.

Do not design Scene 06 in this document.

---

## 14. Next-Step Decision Matrix

| | A. Scene 06 now | B. Small learner validation now | C. Minimal prep, then observe, then decide |
|---|---|---|---|
| INFORMATION VALUE | MEDIUM if new category; LOW if more of the same | HIGH for P0, but messy without a protocol | HIGH — answers “can we even observe” then P0 |
| PRODUCT RISK REDUCTION | LOW | MEDIUM — may burn the first students on process | HIGH — cheap process risk first |
| ARCHITECTURE VALUE | MEDIUM (new category only) | LOW | LOW immediately; preserves later Scene 06 |
| ENGINEERING COST | HIGH (full pipeline) | LOW–MEDIUM if informal | LOW |
| PEDAGOGICAL VALUE | LOW until learners exist | HIGH if observation is disciplined | HIGH if questions stay small |
| DEPENDENCY ON UNKNOWN LEARNER BEHAVIOR | LOW (avoids it) | HIGH | MEDIUM — prep first |
| REVERSIBILITY | MEDIUM (sunk Scene) | MEDIUM (first impression) | HIGH |

---

## 15. Recommendation

```text
NEXT_STEP = LEARNER_VALIDATION_PREP
```

**WHY NOW**

The five prototypes have spent their architecture and evidence-design information. The product hypothesis is about Grade-9 thinking. That hypothesis is still `OPEN_QUESTIONS` O001–O003 / O007. Building Scene 06 now optimizes for implementation momentum, not information.

Prep is required because the Learner Validation Protocol does not exist, Scene 02/03 PRE filing is incomplete as a research packet, and the shared residual risk is “structured UI is too leading.” The first observation must know what a warning looks like.

**WHAT QUESTION IT ANSWERS**

Can we watch one student on one Scene, using data the app already stores, without claiming validation?

**First observation Scene (recommendation, not a design):**  
`horizontal-force-cart` (Scene 03) or `equal-volume-material-samples` (Scene 04).  
Reason: farthest from the original microwave energy loop, so completion/transfer is more informative about UPLP-with-learners than another thermal Scene.

**Smallest questions to retain**

| ID | Question | Why it matters | Observable evidence | Warning signal |
|---|---|---|---|---|
| Q1 | Can a Grade-9 student finish the loop without an adult clicking for them? | Existential usability | Stage events through COMPLETE or quit stage | Quit before EXPERIMENT, or adult takeover |
| Q2 | After MODEL, can they do the required near-transfer? | Model vs label-clicking | Transfer attempt `accepted` + what they wrote | Correct radios + empty/generic text, or cannot start |
| Q3 | Can they refuse the boundary case? | Overgeneralization | Boundary/partial attempt + explanation | Ordinary relation applied unchanged |
| Q4 | Can they do AI_OFF with tutor hidden? | Independent use | Pre-commit structure + authored text; `llmUsed === false` | Answer-only; wait for an adult; reopen tutor mentally |
| Q5 | Where do they stall, get bored, or ask “what do I click?” | Cognitive load / leading UI | Time gaps in events; repeated failed submits; hint count | Long stall on MODEL/TRANSFER; “just tell me” |
| Q6 | Delayed reuse / exam score | Later | Not first-pass | Do not run yet |

Q6 is a product goal. It is **not** the first observation.

**WHAT NOT TO DO YET**

- Do not implement Scene 06.
- Do not write `validated` or `production`.
- Do not claim learning gains.
- Do not instrument a data warehouse.
- Do not run all five Scenes as a “study.”
- Do not invent statistical pass marks.

**WHAT WOULD CAUSE US TO RECONSIDER**

- Prep shows we cannot inspect a session without building large new systems → stay in prep, do not fake a study.
- First observation shows students cannot operate the shell at all → product/UX before Scene 06 or validation.
- First observation shows they construct and transfer without radio-hunting → then either a second Scene observation or a high-information Scene 06 category.
- A Schema/UI blocker appears that only a new structure can expose → Scene 06 in that category, still not `validated`.

---

## 16. Explicit Non-Claims

Five quality-reviewed prototypes do **not** prove:

- real students learned;
- transfer improved;
- exam scores improved;
- repetitive practice can be reduced;
- AI tutoring improves reasoning;
- students will engage voluntarily;
- the product is learner-validated;
- the product is production-ready;
- the model library covers the full Grade-9 curriculum.

Those remain hypotheses until appropriate evidence exists.

This synthesis does not create `milestone-validated`, `architecture-validated`, or `learner-ready` as lifecycle states.
