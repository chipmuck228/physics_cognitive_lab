# PRE Model Quality Review — Gate A

> First PRE review of the reconstructed canonical model.  
> Template: [`../templates/pre-model-quality-review.md`](../templates/pre-model-quality-review.md)  
> Method: [`../../physics-model-quality-review.md`](../../physics-model-quality-review.md)  
> Evidence rules: [`../../evidence-design-contract.md`](../../evidence-design-contract.md)

This review inspects the **reconstructed Physics Model**, not the legacy Scene 01 application.

It does **not** treat the running microwave-bread implementation as authoritative physics.  
It does **not** mark the model `validated` or `prototype`.  
It does **not** authorize Scene migration.

---

## Identity

- Date: 2026-09-12
- Reviewer: Cursor quality review (`MODE=PRE`, after Scene 01 reconstruction)
- MODEL_ID: `energy-internal-energy-temperature`
- Intended Scene ID (if known): `microwave-bread` (existing Scene is a **legacy compatibility adapter**)
- Intended grade / scope: Grade 9 thermal/energy; no microwave EM; no Q = c m ΔT as primary; no heat-vs-work as primary; no heat-transfer-direction as primary
- Canonical model path: `content/physics-models/energy-internal-energy-temperature/`
- Scene spec path (if any): historical Scene 01 files remain flat under `spec/` (`learning-spec.md`, `state-machine.md`, `misconceptions.md`, `exam-mapping.md`, `interaction-script.md`)

## Primary cognitive target

What must the student learn to THINK or DO?

Distinguish temperature from internal energy, treat energy transfer as a process, and construct the conditional relation:

energy transfer into/out of a system → internal energy changes → temperature may change.

Target C1–C14 actions:

- C1 Identify Phenomenon
- C2 Translate to Physics Language
- C3 Identify Physical Quantities (temperature, internal energy, energy transfer)
- C4 Distinguish Related Concepts (temperature ≠ internal energy ≠ heat-as-stuff)
- C5 Identify Causal Relationship
- C7 Identify Conditions / Constraints
- C9 Select / Construct Model
- C10 Apply Model
- C11 Qualitative Prediction
- C13 Check Sufficiency (temperature alone does not give total internal energy; energy in does not prove temperature must rise)
- C14 Transfer

Not selected as required for this primary model:

- C6 as “identify heat vs work” — neighboring model `internal-energy-change-mechanisms`
- C8 / C12 — neighboring model `specific-heat-capacity`

Vocabulary the student may learn, but that must not be mistaken for the cognitive target:

- 内能, 温度, 能量进入
- Saying “变热了” or “吸收热量所以升温” without the conditional structure

## Deep structure

Reusable structure, independent of the anchor objects:

```text
energy transfer into / out of a system
        ↓
internal energy of the system changes
        ↓
temperature may change
        +
heat is a process, not a stored substance
temperature ≠ internal energy
energy in ≠ temperature must rise
hotter ≠ always greater total internal energy
```

Is this a model rather than a fact / formula / procedure / slogan? YES

Why: Removing the microwave and the bread still leaves a reusable energy-state relation. “Microwave heats bread” is the phenomenon, not the model.

## A1. Physics truth

- Scientifically correct at Grade-9 abstraction? YES
- Quantities, relations, mechanisms correct? YES
- Mathematical relation incorrectly taught as physical causation? NO
- Important conditions hidden? NO

Notes:

The reconstructed causal chain is **conditional**. Internal energy change does not automatically become temperature change. Heat is not stored as a substance. Microwave mechanism is labeled out of scope. `energyRelations.mechanism = mixed` so the model does not secretly teach heat-vs-work.

## A2. Deep structure

Covered above. The structure is reusable across kettle, contact warming, and other thermal situations. Rubbing hands shares the energy-state outcome but not the mechanism; that is encoded as `partial-structure`, not full-model.

## A3. Conditions and boundaries

Valid when:

- a system can be identified;
- energy enters or leaves that system;
- the student is asked about internal energy and/or temperature under stated conditions.

Intentional assumptions:

- Grade-9 macroscopic language;
- no required electromagnetic microwave theory;
- no required Q = c m ΔT calculation.

The model stops at:

- the energy-transfer / internal-energy / temperature relation and its conditions.

Nearby phenomena that require another model:

| Nearby case | Required other model |
|---|---|
| heat vs work | `internal-energy-change-mechanisms` |
| hot → cold direction | `heat-transfer-direction` |
| Q = c m ΔT, mass/material comparison | `specific-heat-capacity` |
| melting / boiling energy | `phase-change-energy` |
| temperature as particle motion | `temperature-microscopic-motion` |
| energy-form inventory | `energy-form-system-description` |

## A5. Misconceptions

| ID | Incorrect mental model | Observable signal | Why attractive | Discriminating evidence | Target corrected structure |
|---|---|---|---|---|---|
| eiet-M1 | Heat is stored stuff | “热量装在里面” | Everyday “热” sounds like a substance | Ask what was actually observed/measured | Heat is a transfer process |
| eiet-M2 | Energy in ⇒ T must rise | Unconditional 升温 rule | Microwave bread always heats in the current sim | Ice / phase-change contrast | Energy in changes U; T may stay |
| eiet-M3 | Hotter ⇒ greater total U | Infer U from T alone | Temperature is the visible number | Same T, different systems | T is not total U |
| eiet-M4 | T, heat, U interchangeable | Synonym swap | School words cluster | Sort state vs process vs energy | Three distinct roles |
| eiet-M5 | Microwave creates heat as the model | Mechanism talk as explanation | The device is salient | Same structure without a microwave | Device is phenomenon, not model |

Legacy M04/M09 (all heating is the same mechanism) are neighboring-model misconceptions. They are not this model's primary list.

## A6. Anchor phenomenon

Anchor: microwave-heated bread.

Creates a need for the model without front-loading the answer? YES, if OBSERVE stays at “what changed.” The legacy Scene headline already asks “为什么会变热？”, which risks front-loading explanation. That is a future Scene-copy refinement, not a model physics error.

Irrelevant complexity that could dominate: microwave engineering, standing waves, dielectric details.

## A7. Experiment information-value table

| Experiment ID | Uncertainty resolved | Prediction required first? | New evidence | Distinguishes competing models? | Redundant? | Completable mechanically? |
|---|---|---|---|---|---|---|
| `more-energy-in-no-phase-change` | Does more energy in change T for the same system? | YES | Larger energy input, larger ΔT under no phase change | Separates “nothing happened” from energy-linked T change | Partial overlap with power vs time | YES if only sliders are moved |
| `energy-in-without-required-temperature-rise` | Must T rise whenever energy enters? | YES | Energy can enter while T stays | Distinguishes M02 from the target model | No | No if the student must name the condition |

High-information experiments: `energy-in-without-required-temperature-rise`

Low-information / drop or merge: a second microwave-only “longer time / higher power” pair would be redundant. Legacy Scene 01 currently only supports the happy-path heating approximation.

## A8. MODEL representation

Chosen grammar:

- [x] energy / causal chain
- [ ] relation / condition board
- [ ] ratio / quantitative
- [x] other model-owned grammar: **this model's energy/state chain plus conditions**, not Scene 02's chemical → work → mechanical slots

Why this grammar matches the deep structure: the reusable object is an ordered energy-state relation with explicit conditions.

Minimum evidence before MODEL can support L4:

```text
energy transfer into/out of the system
+ internal energy of the system changes
+ temperature may change
+ temperature ≠ internal energy
+ heat is not stored stuff
+ at least one essential condition (energy in need not raise T, or same-system for U comparison)
```

Does formula / slogan construction alone count? NO

Three visible boxes “能量进入 → 内能变化 → 温度升高” without conditions would be slogan construction. That is exactly the legacy MODEL risk.

## A9. Transfer audit

| Target ID | Mode | Deep structure that transfers | Surface that changes | What does NOT transfer | Surface similarity could pass? |
|---|---|---|---|---|---|
| `near-kettle-heating-water` | full-model | energy in → U changes → T may rise | kettle, water | microwave / bread nouns | if evaluator accepts “也是加热” |
| `medium-hot-water-bag` | full-model | same energy-state relation | contact, hand | heat-direction rule | if evaluator accepts “也是热的” |
| `far-ice-absorbs-energy` | boundary-contrast | energy can enter and U can change | ice, looks cold | “energy in always raises T” | if generic “情况不一样” passes |
| `partial-rubbing-hands` | partial-structure | U and T may still change | no heater | “must be microwave / heat transfer” | if treated as full-model |

Required future production pair: one full-model target **and** ice `boundary-contrast`. Rubbing is optional supporting / neighboring, not the L5 closer.

## A10. Exam audit

Same Physics Model? YES for the three reconstructed patterns.

Tests representation / model selection / reasoning, not only final answer? YES in the design.

Answer and reasoning separable? YES

Condition checking where appropriate? YES (`energy-in-need-not-raise-temperature`, `hotter-not-always-more-internal-energy`)

Accidentally introduces an untaught primary model? NO in the reconstructed set. Legacy exam-q3 / exam-q5 do introduce neighboring models.

Notes: reconstructed exams stay on T / heat / U distinctions. They do not require Q = c m ΔT or heat-vs-work as the tested model.

## A11. AI_OFF audit

What independent performance would be strong evidence:

Pre-commit identification of energy transfer, internal-energy change, and the relevant temperature/condition relation. Post-check may confirm. Post-check may not manufacture those flags.

| Challenge ID | Unfamiliar? | Model reasoning required | Conditions / boundaries | Memorized conclusion could pass? |
|---|---|---|---|---|
| `ai-off-unfamiliar-metal-spoon` | medium | energy in + U change + T as observable, not stored heat | T ≠ U | if “变热了” or 8 Han + post-check were enough |
| `ai-off-condition-ice-absorbs-energy` | high | energy can enter while T need not rise | energy-in boundary | if “还是冷的所以很奇怪” + post-check were enough |

## A12. Evidence ladder

```text
student action → raw attempt → deterministic evaluation → evidence flag → accumulator → deriveModelEvidenceLevel
```

Does the proposed evidence justify Schema L1–L6 semantics? YES as a **design**. The legacy Scene does not implement this ladder (`accumulateEvidence` is empty).

Risk of assigning L-levels in Scene code: NO in the reconstructed model. Legacy COMPLETE uses a parallel 0–4 `StudentCognitiveProfile`, which is not official L1–L6 but can be misread as mastery.

### Proposed evidence claims (Evidence Design Contract)

| Level | Claim | Minimum conceptual evidence | Must not count |
|---|---|---|---|
| L1 | recognized the phenomenon | observed warming / temperature change | autoplay alone |
| L2 | physics-language representation | object + temperature + increase | “变热了” only |
| L3 | partial causal talk | energy in or U change as a relation fragment | noun sandwich |
| L4 | constructed the model | full chain + T ≠ U + at least one essential condition | three visible boxes; slogan “吸收热量所以升温” |
| L5 | transferred the model | target-appropriate full-model **and** ice boundary | kettle nouns; “好好”; rubbing as full-model |
| L6 | independent use | pre-commit energy + U + condition/T relation; `llmUsed === false` | answer-only; generic 8 Han + post-check |

## Legacy Scene 01 map (inspection only)

The running Scene teaches a weaker, microwave-centered version of the same intended idea.

| Stage | Student does | Implicit physics | Evidence / gate | Official L-level? | UPLP vs legacy |
|---|---|---|---|---|---|
| ENTRY | Start | Driving question | none | no | UPLP start |
| OBSERVE | Heat once, write ≥3 chars | Bread gets warmer | any text | no | weaker than later Scenes |
| DESCRIBE | Regex for bread/temperature/increase | “变热了” → 温度升高 | keyword semantics | no | UPLP-shaped, regex-gated |
| PREDICT | Any radio + any reason | longer heating → T? | non-empty | no | missing commit-to-experiment binding quality |
| EXPERIMENT | Change power/time, 8-char compare/reflect | more energy → higher T always | post-prediction run + length | no | UPLP five-part shape; physics cannot show the boundary |
| EXPLAIN | ≥12 chars; `explanationLevel` 0–4 cosmetic | energy / 内能 / 温度 keywords | any text advances | no | keyword heuristic, not L3 gate |
| MODEL | Pick middle node + two links | energy enters → U changes → T increases | correct triple | no | slogan chain; no condition |
| TRANSFER | 8 chars on kettle, bag, rubbing | same story in new nouns | IDs present, not accepted structure | no | rubbing treated like full-model |
| EXAM | 5 items, wrong answers OK | mixed this model + neighbors | fields filled | no | exam-q3 mechanism, exam-q5 specific heat |
| AI_OFF | Spoon essay + any MCQ | often heat-vs-work | non-empty + any choice | no | no post-check; no provenance |
| COMPLETE | 0–4 dots | traces, not mastery | entered from AI_OFF | no official L | parallel profile, not `deriveModelEvidenceLevel` |

What the Scene is actually trying to teach: **energy enters → internal energy/state changes → temperature increases**, using microwave bread as if that chain were unconditional.

## Legacy migration gap table

| AREA | CANONICAL REQUIREMENT | CURRENT LEGACY BEHAVIOR | MATCH | SEVERITY | FUTURE MIGRATION ACTION |
|---|---|---|---|---|---|
| Phenomenon vs model | Bread/microwave are the anchor only | Copy and MODEL treat microwave heating as the idea | PARTIAL | P1 | Rewrite driving copy; keep device as phenomenon |
| DESCRIBE | Temperature as observable quantity | Regex; “变热了” fails; object can be implied | PARTIAL | P2 | Prefer structured fields |
| PREDICT | Committed prediction before intervention | Any choice + any reason | PARTIAL | P1 | Bind prediction to the experiment; keep wrong predictions valid |
| EXPERIMENT | Happy-path + a boundary-capable contrast | Deterministic heating always raises T | CONFLICT | P0 | Do not let the only physics rule teach M02; add or point to a boundary experiment |
| EXPLAIN | Partial relation, not L4 | Any 12 chars; keyword `explanationLevel` | CONFLICT | P1 | Gate on structured relation fragments; stop using 0–4 as if official |
| MODEL | Chain + conditions; T ≠ U | Three-box click-through | CONFLICT | P0 | Require condition evidence; do not copy Scene 02 work/mechanical slots |
| TRANSFER | targetId + full-model and ice boundary | 8 chars × 3 IDs; rubbing required | CONFLICT | P0 | Bind targets; demote rubbing from required full-model |
| EXAM | This model only; answer ≠ reasoning | Mixed neighbor items; wrong answers exit | CONFLICT | P1 | Ship reconstructed patterns; keep exit ≠ L6 |
| AI_OFF | Pre-commit energy/U/condition | Length + any radio; no post-check provenance | CONFLICT | P0 | New challenges; provenance rule |
| Accumulator | flags → `deriveModelEvidenceLevel` | `accumulateEvidence: () => ({})` | MISSING | P0 | Scene-owned accumulator; never write L-levels in UI |
| Evaluators | relation over tokens | keyword / length floors | CONFLICT | P0 | Redesign against Evidence Design Contract |
| Overlay | intended exam / AI_OFF | `{}` | MISSING | P1 | Wire reconstructed overlay |
| Tutor context | no leak of the chain | Scene-owned leak list exists | PARTIAL | P2 | Keep adapter-owned; update leak patterns |
| Persistence | sceneData only | `experimentHistory` already in sceneData | MATCH | P2 | Keep; do not add `scene01Answers` |
| COMPLETE | evidence-bounded traces | Caution is good; 0–4 dots can be misread | PARTIAL | P2 | Do not present dots as L-levels |
| Tests / E2E | adversarial weakest-pass | happy-path keyword strings | PARTIAL | P1 | Add adversarial tests during migration |

## Prospective weakest-pass risks

If a future Scene were implemented from this model without the contract:

- “温度” only as L2/L4
- “能量内能温度” noun sandwich as L3/L4
- “变热了” as description or transfer
- “吸收热量所以升温” as MODEL
- generic long text as AI_OFF
- three correct radios + “好好”
- T/U conflation accepted because both words appear
- energy-in → T-must-rise overgeneralization taught by the only working simulation
- post-check manufacture of ice-boundary flags
- surface microwave matching (“都是加热装置”)
- answer-only exam/AI_OFF

These are design warnings. They are not a POST result.

## Risks

- Current microwave physics cannot exhibit the essential boundary. A migration that only tightens text gates would still teach M02.
- `inferModelRepresentationKind` will report `energy-chain` because `energyRelations` exist. Implementers must use **this** chain plus conditions, not Scene 02's work/mechanical slots.
- Phrase-family detection will remain a residual after any deterministic authored check.
- Historical Scene 01 specs under `spec/` are not a second Physics Model.

## Final Gate A result

- [ ] `MODEL_QUALITY_PASS`
- [x] `MODEL_QUALITY_PASS_WITH_REFINEMENTS`
- [ ] `MODEL_QUALITY_BLOCKED_PHYSICS`
- [ ] `MODEL_QUALITY_BLOCKED_PEDAGOGY`
- [ ] `MODEL_QUALITY_BLOCKED_BOUNDARY`
- [ ] `MODEL_QUALITY_INSUFFICIENT_EVIDENCE_DESIGN`

This result does **not** mean `IMPLEMENTATION_READY`.  
This result does **not** mean learner-validated.  
This result does **not** authorize `metadata.status = "prototype"`.  
This result does **not** authorize repairing Scene 01 in the same pass.

### Why this result

The reconstructed model is physically correct at Grade 9, pedagogically a real model, and bounded against neighboring thermal models. L4/L5/L6 claims are specified at the contract level.

Named refinements remain: the existing Scene is a conflicting legacy adapter; the current microwave approximation cannot evidence the energy-in boundary; MODEL grammar must not be mistaken for Scene 02; some historical exam/transfer items belong to neighbors.

This is not blocked: the missing work is migration of a now-defined model, not invention of missing physics.

Smallest human decision needed if blocked: none. Next authorized step is a later Readiness Gate / migration request, not an implicit Scene rewrite.

---

## Subsequent readiness note (not a Gate A rewrite)

Date: 2026-09-12. Decision: D046.

PRE refinements A and B were resolved at design time before implementation:

- Required production transfer pair is `near-kettle-heating-water` + `far-ice-absorbs-energy`. Rubbing hands remains available, not required.
- AI_OFF A is ordinary application. AI_OFF B is the energy-in boundary check. They are not the same claim.
- Microwave EXPERIMENT remains an ordinary within-boundary case. It must not prove “energy always raises T.” The boundary is evidenced later by ice TRANSFER and AI_OFF B, not by adding phase-change physics to the microwave engine.

Gate A result above is unchanged. `metadata.status` remains `draft`. The running Scene was not migrated.
