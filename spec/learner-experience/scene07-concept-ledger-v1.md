# Scene 07 Concept Ledger v1

> Kind: **EXPERIMENTAL / SCENE-SCOPED**  
> Status: candidate, not a standard  
> Scene: `convex-lens-optical-bench`  
> Script: Learner Experience v1.1  
> Date: 2026-09-15

These are **design-time sequencing states**. They are not runtime mastery, not L4/L5/L6, and not learning evidence.

Do not promote this ledger to a universal Concept Runtime. Do not apply it to Scene 01–06 or Scene 02 in this pass.

```text
UNSEEN → REFERENCED → GROUNDED → NAMED → USED
```

| State | Meaning |
|---|---|
| UNSEEN | Concept has not appeared |
| REFERENCED | Learner has seen the physical object / phenomenon; the term is not yet explained |
| GROUNDED | Learner has had a physical/visual experience sufficient to attach minimal meaning |
| NAMED | System has attached the physics term to the grounded meaning |
| USED | Learner has had an opportunity to use the concept in reasoning |

Canonical Physics Truth still determines what the product is allowed to say. A scientifically valid statement can still be pedagogically premature.

---

## Concept Introduction Integrity (candidate)

No concept may appear as an explanatory premise before the learner has had a meaningful opportunity to ground it in physical experience.

Normal path:

```text
PHENOMENON
    ↓
COGNITIVE NEED
    ↓
VISIBLE / MANIPULABLE RELATION
    ↓
LEARNER NOTICES RELATION
    ↓
MINIMAL NAME
    ↓
LEARNER USES CONCEPT
```

Forbidden path:

```text
TERM → DEFINITION → SYSTEM EXPLANATION → LEARNER REPEATS TERM
```

---

## Special decision: 像在无限远

**v1.1 default:** OPTIONAL / ADVANCED. Not required for the Scene 07 primary Grade-9 learner model.

Required u = f relation:

```text
物体在 F
    ↓
透镜后的光在有限距离内不真正碰到一起
    ↓
移动光屏也找不到清晰实像
```

If the more precise statement is retained anywhere (Canonical Physics Truth, EXAM/AI_OFF internals, optional enrichment):

- it must not be required for progression
- it must not be required evidence
- it must not be used as an unexplained premise
- it must not appear in the normal learner flow unless explicitly opened as optional enrichment

This is learner-experience filtering, not physics rewriting.

---

## Ledger

### S07-C-LENS — 凸透镜

- **Term:** 凸透镜
- **Required prior:** none
- **First physical referent:** middle glass on the bench
- **First referenced:** ENTRY / S07-M01
- **Grounding:** learner sees the lens as the thing light goes through
- **Naming:** ENTRY, beside the object
- **First use:** OBSERVE
- **Primary Grade-9:** yes
- **Optional/advanced:** no
- **Forbidden before:** —
- **Notes:** Apparatus name. Not an imaging rule.

### S07-C-BENCH — 光具座

- **Term:** 光具座
- **Required prior:** 凸透镜
- **First physical referent:** the whole apparatus
- **First referenced:** ENTRY
- **Grounding:** seeing object, lens, and screen together
- **Naming:** ENTRY
- **First use:** OBSERVE
- **Primary Grade-9:** yes
- **Optional/advanced:** no
- **Forbidden before:** treating it as an exam diagram

### S07-C-OBJECT — 物体

- **Term:** 物体
- **Required prior:** none
- **First physical referent:** left-hand object
- **First referenced:** ENTRY
- **Grounding:** learner can move it
- **Naming:** ENTRY
- **First use:** OBSERVE / DESCRIBE
- **Primary Grade-9:** yes
- **Optional/advanced:** no
- **Forbidden before:** —

### S07-C-SCREEN — 光屏

- **Term:** 光屏
- **Required prior:** 物体, 凸透镜
- **First physical referent:** movable white board
- **First referenced:** ENTRY
- **Grounding:** moving it to look for a clear pattern
- **Naming:** ENTRY, beside the board
- **First use:** OBSERVE
- **Primary Grade-9:** yes
- **Optional/advanced:** no
- **Forbidden before:** “像就是光屏”

### S07-C-IMAGE — 像

- **Term:** 像
- **Required prior:** 光屏 (as a receiver), 凸透镜
- **First physical referent:** pattern on the screen or through the lens
- **First referenced:** ENTRY (minimal), OBSERVE
- **Grounding:** a visible pattern that can change when object/screen move
- **Naming:** when a pattern becomes relevant: “通过透镜看到的物体图样，物理里叫‘像’。”
- **First use:** DESCRIBE / EXPERIMENT A
- **Primary Grade-9:** yes
- **Optional/advanced:** no
- **Forbidden before:** real/virtual distinction; 像在无限远

### S07-C-F — F / 焦点

- **Term:** F / 焦点
- **Required prior:** 凸透镜, 光具座
- **First physical referent:** marked F on the bench
- **First referenced:** ENTRY
- **Grounding:** a place the object can be put; later, a special place where screen-finding fails
- **Naming:** ENTRY: “这个位置叫焦点 F。现在先认得它就可以。”
- **First use:** PREDICT / EXPERIMENT as a location, not as a ray rule
- **Primary Grade-9:** yes
- **Optional/advanced:** no
- **Forbidden before:** using F as “the place rays become parallel”

### S07-C-2F — 2F

- **Term:** 2F
- **Required prior:** F
- **First physical referent:** marked 2F
- **First referenced:** ENTRY / DESCRIBE
- **Grounding:** another marked place relative to F
- **Naming:** when stations are used
- **First use:** EXPERIMENT A (F 和 2F 之间)
- **Primary Grade-9:** yes
- **Optional/advanced:** no
- **Forbidden before:** five-case table recitation

### S07-C-RAY — 光线

- **Term:** 光线
- **Required prior:** 凸透镜
- **First physical referent:** visible path after the learner needs to know why the screen failed
- **First referenced:** EXPERIMENT B Step B (not as a premise in ENTRY)
- **Grounding:** seeing outgoing paths after u = f screen failure, and later u < f divergence
- **Naming:** EXPERIMENT B: “看看光通过透镜以后是怎么走的。”
- **First use:** EXPERIMENT B Step C (ordinary language: 碰到一起)
- **Primary Grade-9:** yes
- **Optional/advanced:** no
- **Forbidden before:** EXPERIMENT A screen-finding; do not open EXPLAIN with ray vocabulary

### S07-C-OUTGOING — 折射后的光线

- **Term:** 折射后的光线
- **Required prior:** 光线
- **First physical referent:** paths on the transmitted side of the lens
- **First referenced:** EXPERIMENT B after screen failure
- **Grounding:** same as 光线; prefer ordinary “透镜后面的光 / 通过透镜以后的光”
- **Naming:** optional; ordinary language preferred in primary flow
- **First use:** MODEL after construction rays exist
- **Primary Grade-9:** the relation yes; the textbook phrase optional
- **Optional/advanced:** the exact phrase 折射后的光线
- **Forbidden before:** grounding outgoing paths; never as an unexplained premise in trial B reflection

### S07-C-MEET — 相交

- **Term:** 相交 / 碰到一起
- **Required prior:** outgoing light paths visible
- **First physical referent:** two outgoing paths approaching
- **First referenced:** EXPERIMENT B Step C in ordinary language
- **Grounding:** learner looks along the paths and notices meeting or not-meeting
- **Naming:** ordinary “碰到一起” first; 相交 later if needed
- **First use:** EXPERIMENT B / C; MODEL meeting step
- **Primary Grade-9:** yes (ordinary language)
- **Optional/advanced:** formal 相交
- **Forbidden before:** asking “有限远处有没有交点” as if 交点 were already a known object

### S07-C-CONVERGE — 会聚

- **Term:** 会聚
- **Required prior:** visible outgoing paths; learner understands 光线碰到一起
- **First physical referent:** outgoing rays that actually meet (trial A image-finding is screen-first; visual meeting is shown when light paths are revealed for a converging case, or in MODEL comparison)
- **First referenced:** not before a meeting has been seen or contrasted
- **Grounding:** learner sees multiple outgoing rays approach and actually meet
- **Naming:** only after that relation: “这些光真的在前面碰到了一起。物理里把这种情况叫做‘会聚’。”
- **First use:** MODEL moment 2–4, after naming
- **Primary Grade-9:** yes, after grounding
- **Optional/advanced:** no
- **Forbidden before:** do not ask “光线是否会聚？” before grounding; do not require the term in EXPERIMENT B

### S07-C-PARALLEL — 平行

- **Term:** 平行 / 近似平行
- **Required prior:** outgoing paths visible; learner has looked along them
- **First physical referent:** u = f outgoing paths that stay apart / do not approach
- **First referenced:** EXPERIMENT B Step C after “会不会碰到一起？”
- **Grounding:** learner notices the paths do not get closer
- **Naming:** minimal: “你看到的这些光，方向保持一致，没有越来越靠近。这种关系可以说是近似平行。”
- **First use:** EXPERIMENT B connection to screen; MODEL for the at-F case
- **Primary Grade-9:** yes, after grounding
- **Optional/advanced:** no
- **Forbidden before:** do not use 平行光线 as an unexplained premise; do not start trial B with “折射后的光线还彼此平行吗？”

### S07-C-REAL — 实像

- **Term:** 实像
- **Required prior:** 像, 光屏能接到
- **First physical referent:** a clear image received on the screen
- **First referenced:** EXPERIMENT A screen success (phenomenon)
- **Grounding:** screen can receive a clear image
- **Naming:** after contrast with a case the screen cannot receive, or at MODEL image step
- **First use:** MODEL image consequence; EXPLAIN may use 光屏接到 without forcing the term
- **Primary Grade-9:** yes
- **Optional/advanced:** no
- **Forbidden before:** defining 实像 as a slogan before screen success

### S07-C-VIRTUAL — 虚像

- **Term:** 虚像
- **Required prior:** outgoing rays do not actually meet; 光屏接不到; visible through lens
- **First physical referent:** u < f — can see through the lens, screen cannot receive
- **First referenced:** EXPERIMENT C after actual-ray distinction
- **Grounding:** not receivable on screen, still visible through the lens, after backward extension is seen
- **Naming:** after that distinction, minimal
- **First use:** MODEL image step; not as the opening of trial C
- **Primary Grade-9:** yes, after grounding
- **Optional/advanced:** no
- **Forbidden before:** “反向延长线相交，所以是虚像”

### S07-C-BACKWARD — 反向延长

- **Term:** 反向延长
- **Required prior:** outgoing rays visible; learner has seen they do not actually meet
- **First physical referent:** dashed continuation of diverging outgoing paths (u < f)
- **First referenced:** EXPERIMENT C after “实际光线会不会碰到？” → no
- **Grounding:** visual backward extension
- **Naming:** after the visual: “把这些光往回画”
- **First use:** EXPERIMENT C then MODEL meeting for inside-F
- **Primary Grade-9:** yes, after grounding
- **Optional/advanced:** no
- **Forbidden before:** starting trial C or EXPLAIN with 反向延长线相交

### S07-C-BACKWARD-MEET — 反向延长线相交

- **Term:** 反向延长线相交
- **Required prior:** 反向延长, 相交
- **First physical referent:** where extended paths appear to meet
- **First referenced:** EXPERIMENT C after extension is drawn
- **Grounding:** learner locates the apparent meeting
- **Naming:** after locating it
- **First use:** MODEL for inside-F
- **Primary Grade-9:** yes, after grounding
- **Optional/advanced:** no
- **Forbidden before:** EXPLAIN radios; trial C opening copy

### S07-C-RECEIVE — 光屏能接到

- **Term:** 光屏能接到 / 接不到
- **Required prior:** 光屏, 像
- **First physical referent:** whether a clear pattern appears on the board
- **First referenced:** OBSERVE / EXPERIMENT A
- **Grounding:** finding vs not finding a clear screen position
- **Naming:** OBSERVE / EXPERIMENT in ordinary language
- **First use:** EXPERIMENT record; EXPLAIN exclusive question; MODEL screen step
- **Primary Grade-9:** yes
- **Optional/advanced:** no
- **Forbidden before:** —

### S07-C-FINITE — 有限距离 / 有限远

- **Term:** 有限距离
- **Required prior:** 光屏能接到 as a search along the bench
- **First physical referent:** a place on the bench you can actually put the screen
- **First referenced:** EXPERIMENT B after failing to find a screen position
- **Grounding:** “怎么移动光屏都找不到” = there is no usable place on this bench
- **Naming:** prefer “在光屏能放到的地方 / 在前面”; 有限远 is textbook-adjacent
- **First use:** EXPERIMENT B connection step in ordinary language
- **Primary Grade-9:** the relation yes; the phrase 有限远 optional
- **Optional/advanced:** 有限远 as a term
- **Forbidden before:** “有限远处有没有交点” before 交点 is grounded

### S07-C-INFINITY — 像在无限远

- **Term:** 像在无限远
- **Required prior:** 会聚, 平行, 有限距离, 实像
- **First physical referent:** none required for the primary Grade-9 model
- **First referenced:** not in normal learner flow
- **Grounding:** not required
- **Naming:** OPTIONAL / ADVANCED enrichment only
- **First use:** never required
- **Primary Grade-9:** **no**
- **Optional/advanced:** **yes**
- **Forbidden before:** entire primary flow; must not be a premise, progression gate, or required evidence
- **Notes:** Canonical Physics Truth may still contain the precise statement.

### S07-C-SIZE — 放大 / 缩小

- **Term:** 放大 / 缩小
- **Required prior:** 像
- **First physical referent:** image larger/smaller than the object on screen or through the lens
- **First referenced:** OBSERVE / EXPERIMENT A
- **Grounding:** seeing size change when object station changes
- **Naming:** EXPERIMENT A record
- **First use:** EXPERIMENT A; MODEL size field
- **Primary Grade-9:** yes
- **Optional/advanced:** no
- **Forbidden before:** —

### S07-C-ORIENT — 正立 / 倒立

- **Term:** 正立 / 倒立
- **Required prior:** 像
- **First physical referent:** orientation of the received or seen image
- **First referenced:** when a clear image exists (EXPERIMENT A / D)
- **Grounding:** seeing upside-down vs upright
- **Naming:** MODEL image step; do not force in trial B where no complete image is found
- **First use:** MODEL
- **Primary Grade-9:** yes
- **Optional/advanced:** no
- **Forbidden before:** asking 正立倒立 for u = f as if a complete ordinary image existed

---

## Authoring checks

For every learner-facing string:

1. Is each physics concept AVAILABLE (NAMED, or ordinary language for GROUNDED)?
2. If NO → `PREMATURE_CONCEPT_USE`. Then move grounding earlier, replace with ordinary language, or remove because it is unnecessary.
3. Do not solve by adding a glossary dump.
4. Misconception guardrails must not leak into learner copy. Convert internal concern → observable contrast → learner notices distinction.
