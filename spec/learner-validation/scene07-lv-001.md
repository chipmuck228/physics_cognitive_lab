# Scene 07 — Learner Validation Observation LV-001

> Kind: **FORMATIVE LEARNER OBSERVATION**  
> Date: 2026-09-15  
> Scene: `convex-lens-optical-bench`  
> Primary model: `convex-lens-imaging`  
> Repair: Scene07 learner-validation repair #1

```text
FORMATIVE LEARNER OBSERVATION
≠ LEARNER_VALIDATED
≠ PRODUCT_VALIDATED
≠ MODEL_VALIDATED
```

These are observations from one Grade 9 learner who had **not** previously
studied convex-lens imaging. They are not universal truths, not a claim that
the Scene is learner-validated, and not a change to Physics Truth, UPLP
stage semantics, Evidence levels, or L4–L6.

No identifying personal information is stored.

---

## Participant context

- Grade 9 learner
- No prior instruction in convex-lens imaging
- First real learner-validation evidence for Scene 07

---

## Observations

### LV-S07-001 — Prerequisite vocabulary unknown

The learner did not know:

- F
- 光屏
- 像

The interface had been treating these as already-known labels.

### LV-S07-002 — Task-model ambiguity

The learner asked:

> “是要我做选择题吗？”

The experience was interpreted as answering questions rather than
investigating a physical phenomenon.

### LV-S07-003 — Premature reasoning demand

When asked:

> “你为什么这么想？”

the learner answered:

> “我不知道”

The system was demanding causal reasoning before the learner possessed a
causal model. For a novice this may be an authentic cognitive state.

### LV-S07-004 — Correctness anxiety

The learner asked:

> “要让我填对答案吗？”

Progression was believed to depend on guessing the correct answer.

### LV-S07-005 — Semantic false negative

The learner could describe the physical situation in natural Grade 9
language, but some semantic gates still rejected the response. This created
a “猜字游戏” experience: a physics requirement was mixed with a lexical
requirement.

### LV-S07-006 — Action discoverability (P0)

During the four-round EXPERIMENT, the learner repeatedly had to scan large
amounts of text to determine:

> “现在到底要让我做什么？”

The required learner action was not visually obvious enough.

### LV-S07-007 — Instruction duplication

The same current task is explained multiple times using slightly different
wording on the same screen.

Risk: the learner cannot distinguish the actual task from supporting copy.

### LV-S07-008 — Page information hierarchy

Current action, explanation, physical context, vocabulary, prompt, and
response controls compete at similar visual priority.

Risk: the learner must read the whole page before acting.

### LV-S07-009 — Developer language

Some learner-facing copy is written from the system / evaluator / designer
point of view rather than in natural Grade-9 Chinese. The pattern includes
telling the learner what token not to type, or using compressed designer
phrasing whose meaning itself must be decoded.

Risk: the learner spends effort interpreting the interface instead of
answering a physical question.

### LV-S07-010 — Physics vocabulary context

Physics vocabulary and concept explanations currently compete with task
instructions. Terms such as F, 焦点, 光屏, and 像 should preferably be
grounded in the Physical World, near the visible referent.

Risk: vocabulary becomes a theory card the learner must read before acting.

---

## Provisional Scene 07 repair rule (not a universal contract)

**3-SECOND ACTION TEST**

For every active task screen in the repaired stages, a first-time Grade 9
learner should be able to answer within roughly 3 seconds:

> “现在这个页面要我做什么？”

without reading a long paragraph.

This remains a Scene 07 learner-validation repair rule. It is **not** a new
universal canonical contract.

Continuation of that repair: `spec/architecture/learner-workspace-layout.md`
(PILOT / NOT YET UNIVERSALIZED). Decision D068. Still not LEARNER_VALIDATED.

---

## Status

FORMATIVE LEARNER OBSERVATION only.

Do not promote `convex-lens-imaging` or Scene 07 to LEARNER_VALIDATED,
PRODUCT_VALIDATED, or MODEL_VALIDATED on the basis of this session.

---

## Design inspection findings (not learner observation)

These three items come from inspecting the implemented Scene 07 v1 learner
experience. They are **formative design observations**. They are not
learner-validation results unless a learner was directly observed doing them.

### LV-S07-011 — CONCEPT_INTRODUCTION_BREAK

Learner-facing interaction used ray convergence / parallel / finite
intersection concepts before those concepts had been grounded.

Example style (trial B reflection):

> 折射后的光线还彼此平行吗？有限远处有没有交点？
> 不要把它说成又一种普通成像。
> 可以理解为像在无限远处，但光屏接不到清晰像。

Repair owner: Scene 07 Learner Experience Script v1.1 + Concept Ledger.

### LV-S07-012 — MODEL_CONTROL_SEMANTIC_MISMATCH

EXPLAIN (and any whole-model question using the same claims) presented
simultaneously valid physical relations as mutually exclusive radio options,
for example:

- 有的位置上，光线会真正交在一起
- 有的位置上，只有反向延长线相交
- 物体正好在焦点上时，折射后光线平行……

and

- 真正会聚时，光屏放到交点才能接到
- 虚像可以看见，但光屏接不到

Radio → checkbox is not a sufficient repair if the stage requires construction.

### LV-S07-013 — MODEL_SYSTEM_PRIMING_RISK

System-provided correct relationship language could prime the final
“own words” response, weakening its interpretation as independent
model construction.

```text
SYSTEM PROVIDED CLAIM
≠ LEARNER RECOGNIZED CLAIM
≠ LEARNER CONNECTED RELATION
≠ LEARNER AUTHORED RELATION
≠ INDEPENDENT MODEL CONSTRUCTION
```

v1.1 records an `EVIDENCE_IMPLEMENTATION_GAP`: Scene 07 still stores
`constructionSource = student-constructed` for the official ray-construction
evaluator. Do not silently change L4/L5/L6. Authored summary alone must not
manufacture MODEL construction evidence.

### LV-S07-014 — REASONABLE_REASONING_REJECTED

Source: manual learner-flow inspection after Learner Experience v1.1.
Not a learner-validation result.

A physically sufficient learner explanation for the current u=f task was
rejected by the implementation.

Observed sentence:

> 物体在F上，光线透过透镜后，光线平行无法相交，在白屏上无法成像，白屏上接不到像。

The implementation treated screen-cannot-receive as virtual-image and then
rejected no-finite-meeting + virtual as contradictory. It also demanded
canonical slots (`有限远`, `实像`, expected connective) that this task does
not require.

### LV-S07-015 — WHOLE_MODEL_GATE_ON_LOCAL_TASK

Source: manual learner-flow inspection after Learner Experience v1.1.
Not a learner-validation result.

A local u=f reasoning task appeared to require an unrelated u<f model
relationship. The screen asked “刚才判断时，哪些关系真正起作用？” The learner
selected the u=f relation. The evaluator still required the u<f virtual-image
checkbox because both overlay items were `required: true`.

---

## Candidate principle (Scene 07 experimental; not universal)

**REASONING SUFFICIENCY INTEGRITY**

If a learner has already expressed enough physically valid reasoning to
support the current task conclusion, the system must not block progression
merely because the response lacks canonical wording, unnecessary relation
slots, unrelated model branches, preferred textbook terminology, or
redundant restatement.

Do not promote this to a universal canonical contract. Audit:
`spec/learner-experience/scene07-reasoning-sufficiency-audit-v1.md`. Decision D071.
