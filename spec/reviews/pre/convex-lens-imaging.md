# PRE Model Quality Review — Gate A

> First PRE for `convex-lens-imaging` as intended Scene 07 primary.  
> Template: [`../templates/pre-model-quality-review.md`](../templates/pre-model-quality-review.md)  
> Method: [`../../physics-model-quality-review.md`](../../physics-model-quality-review.md)

## Identity

- Date: 2026-09-12
- Reviewer: Cursor quality review (`MODE=PRE`)
- MODEL_ID: `convex-lens-imaging`
- Intended Scene ID (if known): `convex-lens-optical-bench` (design only; no Scene spec, no production Scene)
- Intended grade / scope: Grade 9; one thin convex lens; qualitative/spatial imaging; no thin-lens equation, aberrations, or multi-lens instruments as a course
- Canonical model path: `content/physics-models/convex-lens-imaging/`
- Scene spec path (if any): none

## Primary cognitive target

What must the student learn to THINK or DO?

Use object position relative to focal geometry to decide how rays behave after a convex lens, and therefore where the image is and what kind of image it is — including when there is no finite image.

Target C1–C14 actions:

- C3 Identify Physical Quantities (u, f, 2f, v, F, optical center)
- C4 Distinguish Related Concepts (object ≠ image; real ≠ virtual; upright/inverted ≠ real/virtual; screen ≠ image)
- C5 Identify Causal Relationship (object position → ray-meeting mode → image)
- C7 Identify Conditions / Constraints (u = f; screen at image plane; thin single lens)
- C8 Compare Variables (across 2F; toward F; inside F)
- C9 Select / Construct Model
- C10 Apply Model
- C11 Qualitative Prediction
- C13 Check Sufficiency (no screen picture is not enough to say “no image”)
- C14 Transfer

C12 is **not** a primary target. `1/f = 1/u + 1/v` is out of this Grade-9 primary.

Vocabulary the student may learn, but that must not be mistaken for the cognitive target:

- 实像, 虚像, 倒立, 正立, 光屏, F, 2F
- Reciting the five imaging rows

## Deep structure

Reusable structure, independent of the anchor objects:

```text
object position relative to F / 2F
        ↓
emergent rays after the convex lens
        ↓
actual convergence
  or backward-extension intersection
  or no finite meeting
        ↓
image position
        ↓
image properties
```

Is this a model rather than a fact / formula / procedure / slogan? YES

Why: Removing the classroom candle and bench still leaves a reusable spatial structure: object vs focal geometry chooses a ray-meeting regime, and image properties follow. A five-row table is a compact report of that structure, not the structure.

A2: The candidate deep structure in the Scene 07 start request is physically and pedagogically correct at Grade-9 scope. Cases differ because outgoing rays either converge, only meet when extended backward, or do not meet at a finite point. That is why `u = f` must stay visible as a limit.

## A1. Physics truth

- Scientifically correct at Grade-9 abstraction? YES
- Quantities, relations, and mechanisms correct? YES
- Mathematical relation incorrectly taught as physical causation? NO
- Important conditions hidden? NO

Notes:

**Quantities kept**

- u, f, 2f, v, optical center, F
- ray-meeting mode
- image nature, orientation, size relation, side
- whether a screen can receive the image

**Canonical imaging cases**

| Station | Ray meeting | Image | Screen |
|---|---|---|---|
| u > 2f | actual convergence | other side; real, inverted, reduced; f < v < 2f | receivable at image plane |
| u = 2f | actual convergence | other side; real, inverted, same-size; v = 2f | receivable at image plane |
| f < u < 2f | actual convergence | other side; real, inverted, enlarged; v > 2f | receivable at image plane |
| u = f | no finite meeting | no finite image | never |
| u < f | backward extension | same side; virtual, upright, enlarged | never |

`u = 2f` is a finite image. `u = f` is not. “Image at infinity” may be mentioned as a limiting phrase. It must not become a sixth ordinary clear-image row.

**Formula judgment**

`1/f = 1/u + 1/v` is excluded. Official stations are discrete engine truth in `physics-boundary.ts`. They are not computed from the thin-lens equation and are not the student MODEL.

**Trend kept without the formula**

While the object stays outside F and moves closer to the lens, the real image moves farther from the lens and becomes larger.

## A3. Conditions and boundaries

Valid when:

- one thin convex lens
- Grade-9 ideal / paraxial, no aberration course
- distances talked about as Grade-9 magnitudes and sides
- a stated object station relative to F / 2F

Intentional assumptions:

- no lens-maker equation
- no advanced sign convention
- screen is a receiver, not the image
- discrete official stations, not a full optical simulator

The model stops at one thin convex lens and the imaging relation above.

Nearby phenomena that require another model:

- `plane-mirror-imaging` — reflection imaging
- `light-refraction` — why the glass bends rays
- microscope / telescope derivation — multi-lens, not in Library as a primary
- thin-lens equation course — not a Library ID; excluded here

Boundary judgment: PASS. Intended Scene 07 is not an optics survey.

## A5. Misconceptions

| ID | Incorrect mental model | Observable signal | Why attractive | Discriminating evidence | Target corrected structure |
|---|---|---|---|---|---|
| cli-M1 | Image lives on the lens | “像在透镜上” | The glass is the visible object | Screen at the lens is not the image plane | Image is an intersection location |
| cli-M2 | Real image is physically inside the screen | “实像长在屏里” | The picture appears on the card | Move screen → blur; image location unchanged | Screen receives; it does not contain the image |
| cli-M3 | Virtual image can be projected | “虚像也能接到” | Both are called 像 | u < f: paper never receives | Backward extensions are not a receivable meeting |
| cli-M4 | Closer object always closer image | “近就近” | Everyday tracking | Move toward F while u > f → image farther | Real-image trend is opposite that slogan |
| cli-M5 | Closer object always smaller image | “近就小” | Distant objects look small | Across 2F, closer → larger real image | Size follows the 2F regime |
| cli-M6 | F / 2F are memorization tags | “背五种情况” | Exam tables | Ask why u = f fails | Landmarks select ray-meeting regimes |
| cli-M7 | Covering the lens cuts the image | “遮上面少上面” | Pinhole / collage intuition | Cover half → complete, dimmer image | Whole lens contributes to the whole image |
| cli-M8 | No screen picture means no image | “屏上没有就没有” | Lab habit of hunting the screen | Magnifier: image seen through lens | Receivability ≠ existence |
| cli-M9 | u = f is an ordinary finite image | “在 F 上也有像” | Completing the five-row table | Parallel outgoing rays | Limiting case, not a finite image |
| cli-M10 | Upright/inverted = real/virtual | “倒立就是实像” | They travel together here | Ask the two meanings separately | Meeting vs orientation are different properties |

All ten are in scope. None were invented only to fill the schema.

## A6. Anchor phenomenon

Anchor: `convex-lens-optical-bench`

Creates a need for the model without front-loading the answer? YES

Irrelevant complexity that could dominate: realistic ray-trace, room lights, candle smoke, continuous slider-as-simulator, showing a completed ray diagram in OBSERVE.

OBSERVE must still not say the five-row table or `1/f = 1/u + 1/v`.

A full optical simulator is rejected. Discrete object stations plus a movable screen are enough for OBSERVE through AI_OFF.

## A7. Experiment information-value table

| Experiment ID | Uncertainty resolved | Prediction required first? | New evidence | Distinguishes competing models? | Redundant? | Completable mechanically? |
|---|---|---|---|---|---|---|
| compare-real-image-across-2f | Do size and v trend with u across 2F? | YES | Reduced / same / enlarged; image farther as object approaches F | Rejects M4, M5, M6 | No | Later table radios |
| probe-object-at-f | Is u = f an ordinary finite image? | YES | No finite meeting; screen never clear | Rejects M8-as-table-row and M9 | No | If treated as “fifth row” |
| probe-object-inside-f | Can a missing screen picture still be an image? | YES | Virtual, upright, enlarged; paper fails; through-lens succeeds | Rejects M3, M8 | No | If student only clicks “虚像” |
| cover-part-of-lens | Does the lens tile the image? | YES | Complete dimmer image | Rejects M7 | No | If the UI already shows the answer |

High-information experiments: all four. They are comparisons and probes of one structure, not five disconnected table lookups.

Low-information / drop or merge: a fifth “read the table” lab. Camera is not a required experiment; it is an available transfer.

Moving the screen is folded into the real-image and u = f probes. It is not a fifth mnemonic experiment.

## A8. MODEL representation

Chosen grammar:

- [ ] energy / causal chain
- [ ] relation / condition board
- [ ] ratio / quantitative
- [x] other model-owned grammar: spatial-ray relation construction

Why this grammar matches the deep structure: the reusable object is object-vs-F, two canonical rays, and meeting mode. An energy chain, force board, density board, specific-heat board, or Ohm board would fake the wrong structure.

Minimum evidence before MODEL can support L4:

1. place the object relative to F / 2F
2. construct or decide two canonical rays
3. decide actual convergence vs backward extension vs no finite meeting
4. assign image properties as consequences, not as a lookup

Does formula / slogan construction alone count? NO

If a student only recites the five rows, or only recognizes a finished diagram, L4 must fail. That is written in `MINIMUM_L4_CONSTRUCTION_EVIDENCE` and `WEAKEST_PASS_PROBES`. Grading functions are **not** implemented in this pass.

`inferModelRepresentationKind` will likely return `relation-condition`. Do not copy Scene 02–06 UIs. Do not extract a new generic shell.

## A9. Transfer audit

| Target ID | Mode | Deep structure that transfers | Surface that changes | What does NOT transfer | Surface similarity could pass? |
|---|---|---|---|---|---|
| near-projector-real-enlarged | full-model | f < u < 2f, actual convergence, enlarged real image on a receiver | 投影仪 / 幕布 | “也有凸透镜” | No if slogan rejected |
| far-magnifying-glass-virtual | full-model | u < f, backward extension, virtual, not on a screen | 放大镜 / 邮票 | 光屏接收 | No if “也有凸透镜” rejected |
| medium-camera-real-reduced | full-model | u > 2f, reduced real image | 照相机 | projector row | Yes if only “也有屏” — therefore available, not required |
| partial-eye-retina-receives-real-image | partial-structure | retina can receive a real image | 眼睛 | accommodation / binocular / brain-upright | Low if non-transfer listed |
| boundary-plane-mirror-is-not-convex-lens | boundary-contrast | imaging ≠ this ray-meeting model | 平面镜 | F / 2F table | Low |

Required later pair: projector + magnifying glass. That pair forces both meeting modes. Camera is available-not-required because it shares a screen surface with the projector.

## A10. Exam audit

Same Physics Model? YES

Tests representation / model selection / reasoning, not only final answer? YES

Answer and reasoning separable? YES

Condition checking where appropriate? YES

Accidentally introduces an untaught primary model? NO

Notes: items cover a position diagram, real-image motion/size, virtual vs screen, u = f, and partial cover. No calculation item. No thin-lens equation. EXAM must not merely repeat the four experiments with the same stations and the same wording.

## A11. AI_OFF audit

What independent performance would be strong evidence:

Names the object-vs-F regime, names the ray-meeting mode, treats the card/paper as a receiver or non-receiver, and rejects both “also a convex lens” and “u = f is an ordinary row”.

| Challenge ID | Unfamiliar? | Model reasoning required | Conditions / boundaries | Memorized conclusion could pass? |
|---|---|---|---|---|
| ai-off-unfamiliar-window-card-projection | medium | YES | distant object, real reduced, card is receiver | “这也有凸透镜” or one table row is a listed fail |
| ai-off-boundary-magnifier-cannot-catch-virtual | high | YES | virtual not on paper; u = f is a limit | “背五种情况” or post-check-only meeting mode must fail |

`llmAllowed: false`.

A correct final option alone must not establish L6. Post-check must not manufacture missing pre-commit spatial reasoning.

## A12. Evidence ladder

```text
student action → raw attempt → deterministic evaluation → evidence flag → accumulator → deriveModelEvidenceLevel
```

Does the proposed evidence justify Schema L1–L6 semantics? YES as a **preview**. L4 is spatial-ray construction, L5 is new-surface transfer with non-transfer limits, L6 is AI_OFF independent use. Official derivation remains `deriveModelEvidenceLevel`. This package does not assign L-levels in Scene code because there is no Scene.

Risk of assigning L-levels in Scene code: NO in this package.

Weakest-pass attack required by this request:

> A student who only recites the F/2F table, recognizes a finished ray diagram, or clicks image properties without a meeting-mode relation must not receive L4 / L5 / L6.

The lock and probes say that student fails. Because no evaluator is implemented yet, this is a design claim, not an implementation proof. That is expected at Gate A. It is recorded as a refinement: Evidence Claim Design and the MODEL evaluator must keep this lock or Gate B will fail.

### Evidence Claim Design draft (not ECD, not a Scene file)

| CLAIM | REQUIRED STUDENT ACTION | RAW EVIDENCE | PROVENANCE | DETERMINISTIC EVALUATOR | MISCONCEPTION / DISTRACTOR | WEAKEST PASS | KNOWN SHORTCUT |
|---|---|---|---|---|---|---|---|
| L4 constructed the imaging model | One spatial-ray construction: object vs F/2F, two rays, meeting mode, properties as consequences | Committed board / authored bind | `PRE_COMMIT_STRUCTURED` + authored relation | future MODEL evaluator; not implemented | five-row table; finished-diagram recognition | six correct property clicks | copy visible rays |
| L5 transferred the model | Target-bound meeting mode + what does not transfer | Transfer attempt bound to `targetId` | `PRE_COMMIT_AUTHORED` / structured | future transfer evaluator | “也有凸透镜” | correct projector relation on the magnifier target | surface screen match |
| L6 used the model independently | Pre-commit spatial reason on an unfamiliar or boundary case | AI_OFF commit before post-check | `PRE_COMMIT_AUTHORED` | future AI_OFF evaluator; `llmUsed` false | virtual-on-screen; u = f as ordinary row | correct option only | post-check manufactures meeting mode |

## Risks

- A later Scene can still accept table click-through unless the construction lock is implemented.
- Showing a completed ray diagram can silently give away L4.
- Solid rays vs dashed backward extensions are a PRI risk, not a Physics Truth risk.
- Camera and projector can collapse into “has a screen” unless camera stays non-required or is scored target-specifically.
- Discrete stations can be re-skinned as the five-row table in the UI.
- `inferModelRepresentationKind` will not say `spatial-ray-relation`. Do not “fix” that by copying another board.
- Interaction-shell freeze still holds. Do not extract an optics shell because the diagram is new.

These are implementation / Gate B / PRI risks, not remaining physics blockers.

## Final Gate A result

- [ ] `MODEL_QUALITY_PASS`
- [x] `MODEL_QUALITY_PASS_WITH_REFINEMENTS`
- [ ] `MODEL_QUALITY_BLOCKED_PHYSICS`
- [ ] `MODEL_QUALITY_BLOCKED_PEDAGOGY`
- [ ] `MODEL_QUALITY_BLOCKED_BOUNDARY`
- [ ] `MODEL_QUALITY_INSUFFICIENT_EVIDENCE_DESIGN`

This result does **not** mean `IMPLEMENTATION_READY`.  
This result does **not** mean learner-validated.

Smallest human decision needed if blocked: n/a

Refinements that remain before a later Readiness / implementation request:

1. Keep `secondaryModels = []`. Do not add refraction, plane-mirror, or instrument derivation as another primary.
2. Implement L4 as one spatial-ray construction; table-only, property-clicks, and finished-diagram recognition must fail.
3. Keep `1/f = 1/u + 1/v` out of student-facing MODEL / EXAM / AI_OFF success.
4. Do not extract a new generic shell. Do not widen Scene DSL because optics is visual.
5. PRI-review rays, backward extensions, F vs 2F, and screen-vs-image before POST.
6. Do not run Readiness until Evidence Claim Design exists. This PRE does not run that gate.
7. Do not implement Scene 07 from this PRE alone.

Library `metadata.status` stays `draft`. This review does not promote lifecycle.
