# Learner Experience AI Compilation (future)

> Kind: architecture design note  
> Status: **DESIGN_ONLY**  
> Date: 2026-09-15  
> Decision: D069  
> Does **not** authorize implementation of a compiler, runtime LLM UI, or Scene DSL growth.

```text
AI_EXPERIENCE_COMPILATION = DESIGN_ONLY
≠ AI_GENERATED_UI_READY
```

---

## Forbidden now

```text
Learner Experience Markdown
        ↓
runtime LLM
        ↓
arbitrary UI generation
```

Do **not** implement runtime AI-generated UI.

The learner-facing runtime must remain deterministic: Physics Truth, progression, evidence, and AI_OFF permission are never decided by an LLM at run time.

---

## Future architecture (build time, after human review)

```text
Canonical Sources
        ↓
Learner Experience Script          (experimental design artifact)
        ↓
AI Authoring Compiler              (proposes, does not authorize)
        ↓
Structured Interaction Plan
        ↓
Schema / Contract Validators
        ↓
Human Review
        ↓
Build-time artifact
        ↓
Deterministic Runtime
```

Canonical sources still win: UPLP, Physics Model Schema/Library, Evidence Design, Interaction Runtime/State, PRI, AI_OFF, Scene/model specs.

The compiler sits **after** the Script and **before** the Interaction Plan. It does not replace UPLP or evaluators.

---

## What the compiler MAY propose

- task framing for a moment
- moment decomposition within an existing UPLP stage
- which **already existing** interaction primitive fits (choose, compare, inspect, construct, …)
- where to place contextual vocabulary next to a visible referent
- Grade-9 Chinese copy
- responsive presentation suggestion (World vs Task emphasis)

Every proposal is a draft. Validators + human review are mandatory before any build-time artifact is used.

---

## What the compiler must NOT authoritatively decide

- Physics Truth
- correctness of a student response
- official experimental result
- evidence level / L1–L6
- mastery
- progression semantics / stage unlocking
- AI_OFF permission
- transfer validity
- exam answer
- whether a hint may be revealed
- new canonical model IDs, transfer targets, exam patterns, or independent challenges

If a proposal would change those, validators must reject it.

---

## Validator sketch (not implemented)

Reject a compiled plan if it:

- calls an LLM in AI_OFF
- infers an official result in presentation
- maps two Scenes onto one domain widget because they share a UPLP stage
- treats structured-UI completion as MODEL construction
- converts “I don’t know why yet” into reasoning evidence
- invents Physics Model fields the Schema does not contain
- leaks evaluator language into learner copy
- extracts a new Interaction Shell merely because copy is duplicated

---

## Relationship to LearnerWorkspace

LearnerWorkspace is a **layout slot primitive** (World / Task / Support). An AI compiler may suggest emphasis (`world` vs `task`). It must not generate a UniversalPhysicsWorkspace, UniversalSceneRenderer, or UniversalModelRenderer.

---

## Implementation freeze

Until this note is explicitly unfrozen by a later decision:

- no compiler code
- no markdown-to-UI runtime
- no storing of LLM-authored interaction plans as Progress, Evidence, or Physics
