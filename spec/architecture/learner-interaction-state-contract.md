# Learner Interaction State Contract v1

> Date: 2026-09-13  
> Kind: architecture contract  
> Status: DESIGN — Scene 07 is the first reference consumer; not a universal freeze  
> Companion to: `learner-interaction-runtime-contract.md`  
> Does not own: evaluator truth, L-levels, official physics, Scene DSL

```text
Progress ≠ Draft ≠ View ≠ Review ≠ Evidence ≠ Physics
```

A bug report that says “the stage is wrong” must name **which** of these six moved.

---

## 1. The six states

### A. Progress State

Authoritative learning position.

| Field (conceptual) | Meaning |
|---|---|
| `authoritativeStage` | Furthest official UPLP stage the loop has opened under progression rules |
| `authoritativeSubprogress` | Optional Scene-owned opaque cursor (which experiment is open, which transfer target). Not a second UPLP. |

**Owner:** learning session + Scene adapter completion / `advanceIfReady`.  
**Runtime role:** display progress chrome; never invent unlocks.

**May be written by:** start-lesson, successful stage-leave, adapter-owned advance.  
**Must not be written by:** Back, help, Tutor, review preview, LLM, draft keystrokes.

Production today: `LearningSession.stage` in all Scenes. Scene 01–06 `goBack` illegally writes it. Scene 07 does not.

### B. Draft State

Uncommitted learner input. Refresh-resumable where the Scene declared it meaningful.

Examples: checkbox set, predict reason, ray-1 fields, exam representation step.

**Owner:** Scene `sceneData` keys (preferred) or an explicit “ephemeral, discard on leave” flag.  
**Runtime role:** hydrate only when Progress / View-identity / committed-count / experiment-id changes — not on help or preview writes.

**May be written by:** the student on the working path.  
**Must not be written by:** evaluators, L-derivation, review-only UI (unless the Scene stores a separate review-scratch that is discarded).

**Must not be treated as Evidence.**

### C. Evidence State

Committed attempts and observations.

**Owner:** Evidence Design + Scene evaluators + accumulators.  
**Runtime role:** none beyond “committed vs not.”

**Writes:** append-only (or otherwise governed by Evidence Design).  
**Must not be written by:** the Interaction Runtime, help, review preview, or Back.

Runtime must not delete MODEL attempts to “clean up” a revisit.

### D. View State

What page the student is looking at.

| Field | Meaning |
|---|---|
| `displayedStage` | `viewingStage ?? authoritativeStage` |
| `currentSubstep` | Scene-opaque |
| `expandedPanels` | chrome only |
| `helpState` | current intent + revealed layer |

**Owner:** runtime / Scene interaction layer (`sceneData.viewingStage` in Scene 07).  
**Must not** be used by completion predicates as if it were Progress.

### E. Review State

Looking at a previous stage without being officially there.

| Field | Meaning |
|---|---|
| `viewingStage` | earlier than Progress, or absent |
| `previewPhysics` | optional clone for replay |

**Invariants:**

- `viewingStage` exists ⇒ Progress is strictly later.  
- Preview physics writes never hit authoritative Physics, Evidence, or Progress.  
- Return-to-progress discards preview and clears `viewingStage`.  
- Enabled review controls are `review-applied`, never silent no-ops.

If a Scene cannot implement preview physics, it must not show those manipulate controls as enabled.

### F. Physics State

Authoritative deterministic world.

**Owner:** Scene / model physics modules and `physicsState`.  
**Runtime role:** bind the working-path bench; optionally copy into Review preview.

LLM must not write it. Review must not write it.

PRI applies to what the student **sees** of this state. Runtime does not relabel quantities.

---

## 2. Allowed transitions

| From → To | Allowed when | Forbidden when |
|---|---|---|
| Progress advances | Adapter / `canLeaveStage` / completion true | Help, Back, LLM, preview |
| Progress stays, View moves back | Student Back; target earlier than Progress | Target ≥ Progress; AI_OFF help |
| View returns to Progress | Return CTA | Student must redo an earlier stage to “get back” |
| Draft updates | Working path, matching Progress stage (or Scene-declared working subprogress) | Review-only path (except discarded scratch) |
| Draft → Evidence | Scene commit + evaluator | Runtime guessing sufficiency |
| Evidence grows | Commit / run / official save | Revisit, help, refresh |
| Authoritative Physics updates | Working-path Scene updater | Review, help, Back |
| Preview Physics updates | Review + `allowPreviewPhysics` | Working path (use authoritative) |
| Help state updates | Help allowed; intent in available set | AI_OFF, COMPLETE; illegal intent |
| `stage_entered` (official) | First official entry to a Progress stage | Each Back into a viewed stage |

---

## 3. Forbidden mutations

```text
Back
  ↛ Progress
  ↛ Evidence
  ↛ official stage_entered for the viewed stage
  ↛ authoritative Physics

Help / Tutor
  ↛ Progress
  ↛ Evidence
  ↛ Draft wipe
  ↛ Physics Truth

Review preview
  ↛ Progress
  ↛ Evidence
  ↛ authoritative Physics

LLM
  ↛ Progress
  ↛ Evidence
  ↛ Physics
  ↛ evaluator result
```

---

## 4. Hydration rule

```text
hydrate Draft
  only when
    sessionId changes
    OR Progress stage changes
    OR displayed working identity changes (e.g. experiment id)
    OR committed Evidence count for that slot increases
```

Do **not** hydrate Draft because:

- help intent changed;
- help layer revealed;
- preview physics moved;
- Tutor returned a message;
- View entered or left review (except to load the **viewed** stage’s last committed + its own draft, without touching Progress drafts).

Scene 07 `hydrateKey` is the first Scene-local implementation of this rule, not a mandated generic code shape.

---

## 5. Dual-truth rule

If a field is resume-meaningful, **one** persisted Draft key is the source of truth. React `useState` is a cache.

If a field is ephemeral (e.g. demo frame index with no pedagogical resume), it may stay local and must be documented in the Interaction Plan as `draft: ephemeral`.

Forbidden: two writers (local state and `sceneData`) that silently diverge, then a `useEffect([session])` that prefers last Evidence and kills the Draft.

---

## 6. Mapping onto today’s `LearningSession`

This contract does **not** require a new session schema in this pass.

Suggested conceptual mapping (Scene 07 uses this layout; generic `LearningSession` must not grow these as first-class columns):

| Contract state | Current typical storage |
|---|---|
| Progress | `session.stage` |
| Evidence | `observations`, `descriptions`, `predictions`, `experimentEvidence`, `explanations`, `modelAttempts`, `transferAttempts`, `examAttempts`, `independentAssessment` |
| Physics | `session.physicsState` |
| Draft | `session.sceneData.*Draft` |
| View | `session.sceneData.viewingStage` (Scene 07 only) |
| Review physics | `session.sceneData.reviewPhysics` (Scene 07 only) |
| Help view | `session.sceneData.helpByStage` (Scene 07) or hint events (02–06) |
| Trace | `session.events` |

Generic `LearningSession` must not grow Scene-07 field names as first-class universal columns. Opaque `sceneData` is the extension point.

---

## 7. Invariant checklist (for tests)

A Scene claiming v1 state compliance:

1. After Back, `session.stage` (Progress) is unchanged.  
2. After preview manipulate, `physicsState` is unchanged and Evidence arrays are unchanged.  
3. After Return, preview keys are gone and View equals Progress.  
4. After help, Draft fields the student was editing are unchanged.  
5. After commit, Evidence grows once (no duplicate from revisit).  
6. AI_OFF: no help state writes, no Tutor events.

---

## 8. Non-goals

- Do not merge Review into Physics “to keep one state.”  
- Do not store L-levels in View.  
- Do not put official image position into Draft.  
- Do not let View drive `canLeaveStage`.
