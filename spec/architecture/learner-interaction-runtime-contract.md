# Learner Interaction Runtime Contract v1

> Date: 2026-09-13  
> Kind: architecture contract  
> Status: DESIGN — Scene 07 is the first reference consumer; not a universal freeze  
> Does not own: UPLP stage meanings, Physics Model schema, Scene DSL, Evidence / L-levels, PRI quantity identity, Interaction Shell freeze  
> Related: `learner-interaction-state-contract.md`, `learner-interaction-design-template.md`, `learner-interaction-runtime-audit.md`  
> Scene 01–07 are not claimed runtime-v1 compliant as a set. Scene 07 may become a reference implementation without making the runtime universal.

This document defines **how** UPLP stages, Physics Models, and Evidence claims appear and behave in the learner UI.

It does not decide whether a construction is physically correct or whether a student has reached L4–L6.

---

## 1. Purpose

A Scene can be physically correct, evidence-correct, and still fail the student:

- back looks like review but destroys furthest progress;
- a control is enabled and nothing visible happens;
- help talks about a control that is not on screen;
- an unrelated session write wipes an uncommitted draft;
- two help systems compete;
- rejected work is only “不正确”.

The Learner Interaction Runtime exists so those failures have one ownership boundary.

```text
UPLP
  decides HOW students learn
    (stages, hint semantics, AI_OFF policy)

Physics Model
  decides WHAT physics is learned

Evidence Contract
  decides WHAT student behavior justifies a claim

Learner Interaction Runtime
  decides HOW those things appear and behave
    in the learner UI
```

---

## 2. Ownership boundary

| Owner | Owns | Does not own |
|---|---|---|
| UPLP | Stage meanings, universal evidence kinds, tutor permissions, AI_OFF | Pixels, form hydrate, back-button storage |
| Physics Model / physics-boundary | Official values, MODEL grammar, formulas | Button enablement, draft wipe policy |
| Evidence Design | Evaluator justification, provenance, weakest-pass | Student-visible feedback tone |
| PRI | Quantity identity, units, arrows, label truth | Task framing, help intents |
| Interaction Shell Contract | Whether reusable chrome may absorb domain | Progress / draft / review state |
| Student UI Interaction Contract | Student-facing clarity (UI-01–UI-15) | State storage layout |
| **This runtime** | Progress/view/draft/review **interaction** behavior; framing; visible capabilities; action→response; feedback lifecycle; help runtime; navigation; cognitive **trace**; loading/blocked/retry/error | Physics correctness, L-levels, Scene DSL, MODEL/Transfer/AI_OFF domain rules |

When documents disagree: the designated owner above still wins for its domain. This document wins only for learner-interaction behavior.

---

## 3. Runtime responsibilities

The runtime MAY own:

1. Distinguishing Progress / Draft / View / Review / Evidence / Physics at the interaction layer.  
2. Task framing: context, goal, focus, action, **student question**, and **expected response shape** (student language; no official answer).  
3. The current `VisibleInteractionContext` (operable capabilities **and** mentionable references). Every meaningful learner-facing element must be traceable:

```text
Physics Model
  → current cognitive objective
  → current evidence requirement
  → current learner task
  → current surface
```

4. The **vocabulary and presentation** of action→response classes — not the domain outcome.  
5. Feedback kinds: missing / inconsistent / think_again / blocked / loading / error — **mapped from** deterministic `failureKind` or Scene/evaluator/progression results.  
6. Help availability bound to stage + substep + `VisibleInteractionContext`.  
7. Navigation that reviews without regressing Progress.  
8. Review/replay physics that cannot write Evidence or Progress.  
9. Cognitive **trace** of process (what the student did in the UI), not L-level assignment.  
10. Loading, blocked, retry, and system-error chrome.  
11. One learner-facing help entry per Scene policy.

The runtime MAY call Scene/model callbacks. It MUST NOT interpret official physics, decide commit/reject/advance, or invent a second evaluator or progression system.

---

## 4. Forbidden responsibilities

The runtime MUST NOT:

- compute official physics or mutate authoritative `physicsState` except by calling Scene-owned updaters on the **working** (non-review) path;
- run evaluators or invent `failureKind`;
- call `deriveModelEvidenceLevel` or display L4/L5/L6 as student copy;
- own MODEL grammar, Transfer `transferMode`, or AI_OFF commit/post-check rules;
- contain `sceneId` / `modelId` / `transferMode` / `pattern.id` branches;
- become a Universal Scene Renderer or Universal MODEL board;
- widen `sceneDslV01Schema`;
- absorb Interaction Shell domain (do not grow `ChecklistObserveTask` to host review physics);
- let LLM decide correctness, stage unlock, or evidence;
- perform the student’s target cognitive action;
- claim learner validation.

---

## 5. Core data flow

```text
UPLP stage + Scene Interaction Plan
        ↓
Learner Interaction Runtime
  (frame, VisibleInteractionContext, help, navigation, response chrome)
        ↓
Presentation primitive / Scene task
        ↓
student action
        ↓
Scene handler
        ↓
physics / evaluator / progression result   ← Scene / model / Evidence own this
        ↓
Interaction Runtime maps / presents the result
        ↓
learner-visible response
```

The runtime never reverses this direction. It does not decide whether a draft was committed, an attempt was rejected, Progress advanced, physics changed, or Evidence was written.

**Presentation must not infer an authoritative action result** when the Scene / evaluator / progression already owns that result.

Forbidden split:

```text
React evaluates / guesses committed | missing | rejected | advanced
  while
hook / Scene action separately evaluates / writes Evidence / advances
```

For any action that can affect Evidence, Progress, accepted/rejected state, a domain attempt result, or Physics state, the Scene handler returns one authoritative result object. React only passes the current draft, receives the outcome, and presents it.

Do not create a generic UniversalActionEngine. Scene-local result types (Scene 07: `LensActionResult`) are enough.

Trivial local chrome (radio select, draft keystroke, exam step continue that only writes Draft) does not need that object.

---

## 6. Stage / substep model

UPLP owns the stage name (`OBSERVE` … `COMPLETE`).

A Scene MAY declare **substeps** inside a stage. Substep identifiers are Scene-owned opaque strings (or numbers) such as `ray-1` or `case:zero-net-force`. The runtime only knows:

```text
currentStage          // display stage (view or progress)
authoritativeStage    // progress
currentSubstep        // opaque
visibleContext        // capabilities + references (see §8)
```

Same UPLP stage does not imply the same substep machine.

MODEL in Scene 07 (seven construction steps) and MODEL in Scene 03 (case board) must not share a substep enum.

---

## 7. Task framing contract

Every student-visible stage from OBSERVE through EXAM SHOULD supply:

| Field | Student question | Must not |
|---|---|---|
| context | 现在是什么情况 | reveal the official result |
| goal | 这一步要解决什么 | use internal IDs (TRANSFER, L4) |
| focus | 先看 / 比较什么 | name a control that is not visible |
| action | 现在要做什么 | be a second copy of the footer |
| student question | 现在要回答哪一句 | be the official answer |
| expected response shape | 用什么形式答 | list the official choice or formula |

A framing field that cannot be traced to the current model objective and evidence requirement does not belong on the surface.

Presentation may fold these into natural sentences. Do not expose developer labels (`context:`) if unnatural.

ENTRY, AI_OFF, and COMPLETE use their own UPLP-facing copy. AI_OFF must not add help framing that implies Tutor.

---

## 8. Visible interaction context

Help and framing are bound to more than operable controls.

A **capability** is something the learner can operate or do now.  
A **reference** is something on the current learner-visible surface — not merely a domain concept that belongs to the stage.

```text
VisibleInteractionContext
  capabilities   what the learner can operate / do now
  references     { id, kind: rendered | textual | constructed }
```

A declared reference is not enough. The context must correspond to what the UI actually renders, what the task text shows, or what the learner has constructed onto the screen.

Reference kinds (visibility only — not Physics Truth):

- `rendered` — physically drawn on the current screen (bench object, screen, official image overlay)
- `textual` — present as task / question / scenario language, not as a drawn representation
- `constructed` — the learner’s own representation is now on screen (for example student rays)

Examples of capability *kinds* (neutral):

- `manipulate-scene`
- `record-observation`
- `commit-prediction`
- `run-intervention`
- `compare-outcome`
- `author-text`
- `construct-relation` (opaque; grammar is Scene-owned)
- `request-help`
- `return-to-progress`

Examples of reference *kinds* (visibility only — not Physics Truth):

- a screen, image, ray, meter reading
- a force arrow, cart motion, temperature display
- a station mark the student can currently see

`VisibleReference` describes **surface truth**. It must not store official values, formulas, or evaluator truth. Same UPLP stage does not authorize the same references.

Exact TypeScript shape is not mandated. A Scene-local context that preserves this split is enough.

### 8.1 Rules

1. If a control is enabled, it must produce a visible response (UI-04).  
2. If an action is illegal in the current mode (review vs work), hide it or show a blocked reason. Never silent no-op.  
3. A help hint must not refer to an action, control, object, representation, or physical cue that is unavailable or invisible in the current `VisibleInteractionContext`.  
4. Help may discuss a **textual** reference as a task concept.  
5. A help prompt that tells the learner to **look at** something (“看两条光线…”, “看交点…”) may only use a `rendered` or `constructed` reference. A question that merely mentions “光线” is not sufficient.  
6. Do not render official protected answers merely to make a look-at hint legal.  
7. AI_OFF: `request-help` is absent; the context still exists for framing, not for help.

---

## 9. Action → visible response contract

### 9.1 Vocabulary

Every primary student action maps to one of:

```text
applied           visible world or selection changed
committed         draft became evidence (Scene/evaluator decided)
advanced          Progress moved (progression / adapter decided)
missing           student-visible missing work
rejected          student-visible think-again / inconsistent
blocked           cannot do this now, with reason
loading           in-flight, duplicate submit guarded
system-error      retryable, no provider leak
review-applied    review/preview world changed; Progress/Evidence untouched
discarded         review/preview thrown away on return-to-progress
```

### 9.2 Ownership

The Interaction Runtime owns:

- this response vocabulary;
- presentation semantics (how the class is rendered);
- loading / blocked / error chrome;
- consistent learner-visible rendering.

The Interaction Runtime does **not** decide domain outcomes.

Scene / evaluator / progression remain authoritative for whether:

- a draft was committed;
- an attempt was rejected;
- Progress advanced;
- physics changed;
- Evidence was written.

```text
student action
  → Scene handler
  → physics / evaluator / progression result
  → Interaction Runtime maps / presents the result
  → learner-visible response
```

Do not introduce a second progression or evaluator system inside the Interaction Runtime. The runtime may only map a result the Scene already produced.

Missing construction labels may justify a `missing` presentation. Completing those labels does **not** imply the attempt was accepted. Acceptance, rejection, and Progress advance come only from the Scene / evaluator / progression result.

---

## 10. Feedback contract

### 10.1 Kinds

| Kind | Meaning | Source |
|---|---|---|
| `missing` | Required student work is absent | Scene missing-labels / gate |
| `inconsistent` | Two student claims conflict | deterministic `failureKind` |
| `think_again` | Structure present but not accepted | deterministic `failureKind` |
| `blocked` | Action not allowed now | runtime + Scene policy |
| `loading` | Request in flight | UI |
| `error` | System failure | UI; no raw provider text |

Do not collapse all evaluator failures to `incorrect` if a more precise kind exists.

### 10.2 Rules

- LLM must not choose the kind or the correctness bit.  
- Copy must not reveal the official choice or complete explanation.  
- Missing ≠ inconsistent ≠ think_again ≠ system error (UI-06).  
- Feedback is not an L-level.

Scene 07 `lens-feedback.ts` is a **candidate mapping function**, not the universal implementation.

---

## 11. Help runtime contract

### 11.1 One entry

Each Scene presents **one** learner-facing help entry.

Allowed policies:

- bounded help intents only (Scene 07 pilot);
- Tutor-as-hint only (must still bind to stage + leak table);
- later: Tutor **behind** the same intent (not a second button).

Forbidden: hint-ladder button **and** “给我一点提示” as two unexplained systems.

### 11.2 Binding

```text
availableHelp(stage, substep, VisibleInteractionContext) → HelpIntent[]
```

`visibleCapabilities` alone is too narrow. Help may refer to a currently visible physical representation, not only to an operable control.

An intent or hint layer is illegal if it names:

- an action or control that is not a current capability; or
- an object, representation, or physical cue that is not a current reference.

Invariant: a help hint must not refer to an action, control, object, representation, or physical cue that is unavailable or invisible in the current interaction context.

Ladders stay H1–H5 in spirit (UPLP): attention → comparison → intermediate question → expression structure. Never the final answer.

### 11.3 AI_OFF / COMPLETE

No help intents, no Tutor controls, no leftover hint chrome, no Tutor network (UI-13, UI-14, UPLP).

### 11.4 LLM relationship

LLM, when used, is an **optional language engine** inside a bound intent. It does not unlock stages, grade MODEL, or write Evidence.

Until a Scene can bind Tutor to stage + substep + intent + `VisibleInteractionContext`, that Scene MAY hide Tutor (Scene 07 current policy). This is Scene policy, not a global Tutor deletion.

---

## 12. Navigation / revisit contract

### 12.1 Required split

```text
authoritativeStage   Progress
displayedStage       View  (viewingStage ?? authoritativeStage)
```

Back:

- MAY set View to a previous stage;
- MUST NOT write Progress backward;
- MUST NOT delete Evidence;
- MUST NOT emit a new official `stage_entered` for the viewed stage as if it were first entry;
- MUST NOT require the student to redo EXPLAIN to return to MODEL.

Return-to-progress:

- clears View override;
- discards Review physics;
- restores the Progress-stage UI.

### 12.2 Review physics

If the viewed stage has manipulable physics:

- mutations go to Review / preview state;
- authoritative Physics is unchanged;
- Evidence is unchanged.

If the Scene cannot provide preview physics, those controls must be hidden or labeled blocked — not enabled no-ops.

### 12.3 Scene 01–06 current `goBack`

Production `goBack` that assigns `session.stage = previous` is **not** v1-compliant. It remains in those Scenes until a fit-tested migration. This contract does not silently change them.

---

## 13. Cognitive trace contract

The runtime may record **process traces**:

- stage displayed vs authoritative;
- help intent selected / layer revealed;
- review entered / returned;
- action response class (`missing`, `review-applied`, …);
- blocked reason codes.

Traces are not Evidence levels and not mastery claims.

Preferred sink: existing `events` with explicit `metadata.kind`, or Scene `sceneData` process keys. Do not invent a second learning-state machine.

Forbidden in traces shown to students: `L4`, `failureKind` raw ids, `sceneId`.

---

## 14. AI / LLM relationship

```text
APP  = track (progress, physics, evidence, AI_OFF)
LLM  = optional engine inside bound help
STUDENT = thinker
```

Runtime enforces the track’s visibility rules. It does not replace UPLP hint semantics.

---

## 15. Interaction Shell relationship

```text
Runtime behavior
≠
Interaction shell
```

Shells remain frozen (`SUFFICIENT_EVIDENCE_TO_FREEZE`).

The runtime may wrap a shell. It must not grow a shell’s props with review/help/progress domain.

Do not extract `UniversalDescribeTask` or `UniversalModelBoard` as part of runtime v1.

---

## 16. Scene DSL relationship

```text
Reusable runtime behavior
≠
Scene DSL
```

Repeated Labs do not justify `sceneDslV01Schema` growth. Runtime v1 is code+contract later, not a declarative scene file.

---

## 17. Evidence relationship

Evidence remains append-only and evaluator-governed.

Runtime may:

- show that work is missing or not accepted;
- keep drafts off the evidence arrays until commit.

Runtime must not:

- rewrite committed attempts to make the UI nicer;
- treat stage completion as mastery;
- display derived L-levels as student achievement.

---

## 18. PRI relationship

If a visible number, unit, or arrow is physics identity, PRI owns it.

Runtime may say “the meter changed” as an action response. It must not relabel `ΔT` as `T` or invent units.

---

## 19. Testing contract

A Scene that claims runtime v1 compliance MUST have tests for:

1. Back / revisit / return does not change Progress or Evidence.  
2. Review physics (if any) does not write authoritative Physics.  
3. Help intents and hint text ⊆ current `VisibleInteractionContext`. Context must match the rendered UI, not a stage-only declaration. Look-at language requires a rendered or constructed reference.  
4. AI_OFF has zero help / Tutor chrome and zero Tutor requests.  
5. Uncommitted draft survives help / review-preview session writes.  
6. Enabled control never silent-no-ops. Scene 07 tests must reproduce the prior EXPERIMENT reflection failure, not only the happy path.  
7. `failureKind` maps to a non-answer feedback kind.  
8. Existing physics, PRI, evidence, adapter, and E2E tests stay green.  
9. Presentation does not re-run Scene evaluators to decide committed / rejected / advanced. Scene 07 tests must show: MODEL complete-but-incorrect → `rejected` not `committed`; TRANSFER not accepted → not presented as `committed`; DESCRIBE / EXPLAIN / OBSERVE have one evaluation path.

Do not replace evaluator adversarial tests with UX tests.

---

## 20. Adoption / extraction rules

### 20.1 Not a rename

Scene 07 `LensTaskFrame`, `LensHelpPanel`, `lens-revisit`, `lens-feedback` stay Scene 07 names until a **second** real consumer fits without domain props.

Forbidden first step: `LensHelpPanel` → `UniversalHelpPanel`.

### 20.2 Reference implementation

1. Scene 07 is the first reference consumer. Keep `Lens*` names.  
2. Scene-local types may implement this contract. Do not extract `Universal*` modules from one Scene.  
3. Fit-test Scene 03, then Scene 06, only after Scene 07 is internally compliant.  
4. Freeze runtime v1 only after those three differ in MODEL grammar and still share behavior.  
5. Then optional 04 / 05 / 02 / 01.  
6. Do not claim Scene 01–07 are runtime-v1 compliant.

### 20.3 Extraction rule

A generic runtime module may be extracted only when:

- at least two production Scenes implement the same **behavior**;
- no `sceneId` / `modelId` branch is required;
- physics, evaluators, and MODEL grammar stay outside;
- Interaction Shell freeze is respected;
- expected net complexity is positive.

Duplication of Lab JSX is not sufficient.

### 20.4 Migration risks

- Scene 01–06 back currently mutates Progress; a naive drop-in would change learning-state tests.  
- Hint-ladder + Tutor removal is a product change, not a rename.  
- Review physics is only needed where the bench is manipulable.  
- Scene 02 energy chain and Scene 07 rays will break any “universal MODEL step enum.”  
- Hydrate-key policy must be specified per draft field or Scenes will reintroduce wipe bugs.

---

## 21. Candidate TypeScript API (not implemented this pass)

Neutral names. No lens/cart/ohms fields. Domain payloads are opaque.

```ts
type InteractionStage = string; // UPLP stage value; runtime does not redefine it

type OpaqueId = string;

interface CognitiveTaskFrame {
  context: string;
  goal: string;
  focus: string;
  action: string;
}

type CapabilityKind =
  | "manipulate-scene"
  | "record-observation"
  | "commit-prediction"
  | "run-intervention"
  | "compare-outcome"
  | "author-text"
  | "construct-relation"
  | "request-help"
  | "return-to-progress";

interface VisibleCapability {
  id: OpaqueId;
  kind: CapabilityKind;
  available: boolean;
  blockedReason?: string;
}

interface VisibleReference {
  id: OpaqueId;
  kind: "rendered" | "textual" | "constructed";
  // surface truth only — no official value, formula, or Physics Truth
}

interface VisibleInteractionContext {
  capabilities: VisibleCapability[];
  references: VisibleReference[];
}

type InteractionResponseClass =
  | "applied"
  | "committed"
  | "advanced"
  | "missing"
  | "rejected"
  | "blocked"
  | "loading"
  | "system-error"
  | "review-applied"
  | "discarded";

type InteractionFeedbackKind =
  | "missing"
  | "inconsistent"
  | "think_again"
  | "blocked"
  | "loading"
  | "error";

interface InteractionFeedback {
  kind: InteractionFeedbackKind;
  message: string;
  failureKind?: string; // deterministic id from Scene/evaluator; not shown raw
}

interface HelpIntent {
  id: OpaqueId;
  label: string;
}

interface HelpContext {
  stage: InteractionStage;
  substep?: OpaqueId;
  interaction: VisibleInteractionContext;
}

interface ReviewPolicy {
  allowPreviewPhysics: boolean;
  discardPreviewOnReturn: true;
  mutateAuthoritativePhysics: false;
  mutateEvidence: false;
  mutateProgress: false;
}

interface InteractionPlan {
  stage: InteractionStage;
  substep?: OpaqueId;
  frame: CognitiveTaskFrame;
  interaction: VisibleInteractionContext;
  helpIntents: HelpIntent[];
  review: ReviewPolicy;
}

interface LearnerInteractionState {
  progressStage: InteractionStage;
  viewStage: InteractionStage;
  substep?: OpaqueId;
  help?: { intentId: OpaqueId; revealed: number };
  // drafts, evidence, physics are referenced, not owned
}
```

These types are a design proposal. A Scene-local implementation may use equivalent names (`LensVisibleInteractionContext`, …). Do not add a generic `types/` runtime module until a second Scene fits without domain fields.

---

## 22. Current decision

**Contracts refined (help context + action-response ownership). Scene 07 is the authorized first reference consumer.**

Not a universal runtime. Not learner-validated. Scene 01–06 remain unchanged and are not claimed compliant.
