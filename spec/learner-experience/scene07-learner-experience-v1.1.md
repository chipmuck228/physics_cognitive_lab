# Scene 07 Learner Experience Script v1.1

> Status: **EXPERIMENTAL DESIGN ARTIFACT** — not canonical  
> Scene: `convex-lens-optical-bench`  
> Primary model: `convex-lens-imaging`  
> Succeeds: `scene07-learner-experience-v1.md` (kept as historical evidence)  
> Constrained by: UPLP, Evidence Design, PRI, Interaction Runtime/State, Scene 07 specs  
> Concept ledger: `scene07-concept-ledger-v1.md`  
> If this Script conflicts with a canonical contract, the contract wins.

v1.1 repairs two structural defects found by inspecting the implemented v1 experience:

- **DEFECT A** — Concept Introduction Break (LV-S07-011)
- **DEFECT B** — MODEL control semantic mismatch and system priming (LV-S07-012, LV-S07-013)

Do not claim LEARNER_VALIDATED, CONCEPT_LEDGER_STANDARD, UNIVERSAL_LEARNER_EXPERIENCE_STANDARD, UNIVERSAL_MODEL_UI, or AI_GENERATED_UI_READY.

---

## What v1.1 does not change

- Canonical Physics Truth
- UPLP stage meanings
- Transfer target pair / transfer semantic architecture
- Exam World architecture
- L4 / L5 / L6 meanings
- Scene 02 / Scene 01, 03–06
- No universal MODEL renderer
- No Concept Runtime
- No AI compiler

---

## New candidate principles (Scene 07 only)

### Concept Introduction Integrity

No concept may appear as an explanatory premise before the learner has had a meaningful opportunity to ground it in physical experience.

A correct physics statement can still be pedagogically premature.

### Control Semantic Integrity

The interaction control must express the logical structure of the learner's possible answers.

- Radio / single-select → only genuinely mutually exclusive states
- Checkbox / multi-select → independently coexisting claims
- Construction → building a model / causal relation
- Free response → learner-authored expression

If two options can both be physically correct under the question as written, they must not be presented as single-select alternatives.

Do not automatically replace radio with checkbox. First ask what cognitive action the stage measures. If MODEL requires construction, recognition via checkbox is still insufficient.

### Voice continuity

The system remains an experiment partner / learning guide.

Misconception guardrails must not leak into learner copy.

Internal concern → observable contrast / meaningful question → learner notices the distinction.

Flag and remove evaluator voice such as: “不要把它说成又一种普通成像。”

### System priming / evidence honesty

```text
SYSTEM PROVIDED CLAIM
≠ LEARNER RECOGNIZED CLAIM
≠ LEARNER CONNECTED RELATION
≠ LEARNER AUTHORED RELATION
≠ INDEPENDENT MODEL CONSTRUCTION
```

Do not teach the answer and then count the learner's paraphrase as independent construction.

The final own-words statement is **not** automatically independent model construction evidence if earlier UI primed the relation.

---

## Special decision: 像在无限远

OPTIONAL / ADVANCED. Not in the required Grade-9 path.

u = f required cognition:

light does not meet at a place you can put the screen → no clear real image on the screen.

---

## Journey (unchanged deep structure)

```text
SEE → CHANGE POSITION → PREDICT → TEST → COMPARE
→ NOTICE RAY / SPATIAL RELATION → BUILD RELATION
→ APPLY TO NEW CONTEXT → RECOGNIZE EXAM REPRESENTATION
→ USE INDEPENDENTLY
```

Target deep structure remains canonical. Do **not** expose the complete chain before learner construction.

---

## Moments

Unchanged ENTRY–PREDICT moments keep v1 intention. v1.1 adds concept-state fields and forbids premature terms.

For moments without concept change, no new terms are added.

---

### S07-M01 — ENTER THE OPTICAL BENCH

**Stage:** ENTRY  
**Concept state before:** all UNSEEN except informal seeing  
**New concept:** 凸透镜, 光具座, 物体, 光屏; F referenced as a place  
**Why now:** orientation; learner needs names for things they can see  
**How grounded:** names sit beside visible referents  
**System language:** “这里有一个凸透镜实验。先不用背规律。我们会移动物体和光屏，看看会发生什么。”  
**Learner action:** enter the apparatus  
**Physical consequence:** OBSERVE becomes current  
**Evidence meaning:** none  
**Concept state after:** 凸透镜/光具座/物体/光屏 NAMED; F REFERENCED; 像 UNSEEN or minimally REFERENCED; 会聚/平行/虚像/反向延长/像在无限远 UNSEEN  

**Do not:** teach imaging cases; use 会聚, 平行光线, 像在无限远.

---

### S07-M02 — OBSERVE THE BENCH

**Stage:** OBSERVE  
**Concept state before:** apparatus NAMED  
**New concept:** 像, if a pattern appears; 光屏能接到 as ordinary finding/not finding  
**Why now:** learner must see that moving object/screen changes what appears  
**How grounded:** manipulate, then mark what was actually seen  
**System language:** “先看看这个装置。物体、透镜和光屏分别在哪里？”  
**Learner action:** look / move; record seen changes  
**Physical consequence:** apparatus changes; observation saved  
**Evidence meaning:** observation, not imaging rule  
**Concept state after:** 像 GROUNDED as a changing pattern; 光屏能接到 GROUNDED as a screen event  

**Do not:** introduce 会聚 / 反向延长 / 虚像.

---

### S07-M03 — DESCRIBE WHAT WAS SEEN

**Stage:** DESCRIBE  
**Concept state before:** apparatus and 像 as pattern GROUNDED  
**New concept:** none required  
**Why now:** separate object, F/2F, image, screen  
**How grounded:** looking at the same bench  
**System language:** “看着左边的实验，说说你实际看到了什么。”  
**Learner action:** structured follow-ups + own sentence  
**Physical consequence:** description saved  
**Evidence meaning:** observable relation; not token slogans  
**Concept state after:** 2F REFERENCED as a marked place  

**Do not:** force causal why; use ray-meeting vocabulary.

---

### S07-M04 — PREDICT BEFORE MOVING

**Stage:** PREDICT  
**Concept state before:** F/2F as places; 像 as pattern  
**New concept:** none  
**Why now:** commit a guess before the first intervention  
**How grounded:** question about a location they can see  
**System language:** “如果把物体移到 F 和 2F 之间，你觉得会发生什么？先猜就可以。”  
**Learner action:** outcome + stance, including “我现在还说不上来”  
**Physical consequence:** EXPERIMENT unlocks  
**Evidence meaning:** prediction commit, not correctness  
**Concept state after:** unchanged  

**Do not:** require 会聚; require 像在无限远.

---

### S07-M05 — TRIAL A: FIND A CLEAR IMAGE BETWEEN F AND 2F

**Stage:** EXPERIMENT  
**Concept state before:** 光屏能接到 GROUNDED; 光线 UNSEEN as explanation  
**New concept:** 放大 as seen size change; 实像 still unnamed is OK  
**Why now:** learner needs a successful screen-finding so later failure is an anomaly  
**How grounded:** move object, move screen, find a clear position  
**System language:** “把物体移到 F 和 2F 之间。移动光屏，看看哪里最清楚。”  
**Learner action:** move, inspect screen, record, compare, reflect  
**Physical consequence:** a clear screen image is found  
**Evidence meaning:** experiment record; not the reusable model  
**Concept state after:** 光屏能接到 USED; 放大 GROUNDED; 会聚 still UNSEEN as a term  

**Do not:** show the full ray model; ask whether rays 会聚.

---

### S07-M06 — TRIAL B / u = f: CREATE THE ANOMALY

**Stage:** EXPERIMENT  
**Concept state before:** learner has found clear images; 光线 UNSEEN as explanation  
**New concept:** none yet (phenomenon only)  
**Why now:** the previous success makes this failure meaningful  
**How grounded:** screen search fails  
**System language:**

“这次把物体放到 F。

再试试看——
移动光屏，还能找到一个清楚的位置吗？”

**Learner action:** move object to F; move screen  
**Physical consequence:** no clear finite real image on the screen  
**Evidence meaning:** observed screen failure. Not an explanation yet.  
**Concept state after:** 有限距离 GROUNDED as “光屏能放到的地方找不到”; 平行/会聚 still not NAMED  

**Do not:** mention 平行光线, 交点, 像在无限远, or “不要把它说成又一种普通成像.”

After they have looked:

“刚才几次都能找到。

这一次怎么移动光屏都找不到。
为什么会这样？”

Do not require the learner to know the answer.

---

### S07-M07 — TRIAL B: LIGHT PATH AS AN EXPLANATION NEED

**Stage:** EXPERIMENT  
**Concept state before:** screen failure GROUNDED; 光线 UNSEEN  
**New concept:** 光线 / 通过透镜以后的光 REFERENCED then GROUNDED  
**Why now:** screen language is exhausted; learner needs another view  
**How grounded:** show outgoing paths. Do not begin with “平行光线”.  
**System language:**

“刚才我们一直在看光屏。

这次换个角度，
看看光通过透镜以后是怎么走的。”

**Learner action:** look along the paths  
**Physical consequence:** outgoing paths visible  
**Evidence meaning:** not yet model construction  
**Concept state after:** 光线 GROUNDED  

**Do not:** name 平行 before the learner looks.

---

### S07-M08 — TRIAL B: NOTICE THE RELATION, THEN CONNECT TO SCREEN

**Stage:** EXPERIMENT  
**Concept state before:** 光线 GROUNDED  
**New concept:** 碰到一起 (ordinary); 近似平行 NAMED minimally if appropriate  
**Why now:** learner must notice no finite meeting before using any parallel language  
**How grounded:** ordinary-language question first  

**System language:**

“沿着这些光往前看，
它们会不会在前面碰到一起？”

Learner observes: no finite meeting.

Then, if naming is appropriate:

“你看到的这些光，方向保持一致，没有越来越靠近。
这种关系可以说是近似平行。”

Then connect:

“如果这些光没有在前面碰到一起，
为什么光屏怎么移动都接不到清晰的实像？”

**Learner action:** author a relation in ordinary language  
**Physical consequence:** reflection saved  
**Evidence meaning:** experiment reflection. Target cognition: no finite meeting → no clear screen image. Must not be scored as 像在无限远. Must not be scored as independent MODEL construction.  
**Concept state after:** 平行 NAMED (minimal); 会聚 still not required; 像在无限远 remains UNSEEN  

**Do not:** require 会聚 as a term; require 像在无限远; leak misconception guardrails.

---

### S07-M09 — TRIAL C / u < f: ACTUAL RAYS FIRST

**Stage:** EXPERIMENT  
**Concept state before:** at-F: paths do not meet in front; 反向延长 UNSEEN  
**New concept:** none at the opening  
**Why now:** another object place; another screen result  
**How grounded:** move inside F; search with the screen  

**System language:** “现在把物体放到 F 里面。再移动光屏，还能接到吗？”

**Learner action:** move, search  
**Physical consequence:** screen still cannot receive a clear real image  
**Evidence meaning:** another screen failure. Not yet 虚像.  
**Concept state after:** 光屏接不到 USED again  

**Do not:** start with “反向延长线相交，所以是虚像.”

---

### S07-M10 — TRIAL C: DIVERGENCE, THEN BACKWARD EXTENSION

**Stage:** EXPERIMENT  
**Concept state before:** outgoing paths GROUNDED; 反向延长 UNSEEN  
**New concept:** 反向延长 GROUNDED then NAMED; 虚像 NAMED only after visible-vs-screen  
**Why now:** actual-ray question creates the need for another drawing move  

Sequence:

1. Show outgoing rays diverging.
2. Ask whether they actually meet on the other side.
3. Observe: no.
4. Introduce backward extension visually (“把这些光往回画看看”).
5. Ask where the extended paths appear to meet.
6. Attach minimal concept language.
7. Connect: visible through the lens, but not receivable on the screen.

**System language (ordinary first):**

“这些光通过透镜以后，还会在另一边碰到一起吗？”

Then, after no:

“如果把它们往回画，看起来会在哪里碰到？”

Then connect:

“为什么透过透镜还能看见，光屏却接不到？”

**Learner action:** look, then optional backward-extension reveal, then author  
**Physical consequence:** diverging actual paths; then dashed extensions  
**Evidence meaning:** experiment reflection. Not independent MODEL construction.  
**Concept state after:** 反向延长 NAMED; 虚像 NAMED minimally; 会聚 still not required as a term  

**Do not:** name 虚像 before the physical distinction.

---

### S07-M11 — TRIAL D: COVER (unchanged intention)

**Stage:** EXPERIMENT  
**Concept state before:** screen image known from earlier success  
**New concept:** none required  
**Why now:** image is not assembled from half a lens  
**How grounded:** cover part of the lens; whole image remains, usually dimmer  
**System language:** “遮住透镜一部分，像会少掉一半吗？”  
**Learner action:** cover, look, record  
**Physical consequence:** whole image still there  
**Evidence meaning:** experiment record  
**Concept state after:** unchanged for ray-meeting concepts  

**Do not:** use this trial to introduce 会聚.

---

### S07-M12 — EXPLAIN FROM ALREADY-SEEN SCREEN RESULTS

**Stage:** EXPLAIN  
**Concept state before:** screen success and failure GROUNDED; 光线 GROUNDED; 反向延长 NAMED in trial C; 会聚 may still be unnamed  
**New concept:** none. Do not introduce the full meeting taxonomy here.  
**Why now:** D064: EXPLAIN is L3 of already-seen screen results, not ray construction  
**How grounded:** exclusive questions about what they already saw  

**System language:**

“前面几次实验，物体放的位置不一样，光屏上的结果也不一样。

光屏是不是每次都能接到清楚的像？”

And:

“透过透镜能看见，和光屏能接到，是同一回事吗？”

Then own words: what seemed to matter.

**Learner action:** exclusive observation questions + own sentence  
**Physical consequence:** explanation saved  
**Evidence meaning:** identified relation at L3. Not MODEL construction. Not independent construction.  
**Concept state after:** 光屏能接到 USED; see-vs-receive USED  

**Control:** each question must be mutually exclusive. Do not present “有的位置真正交在一起 / 有的位置只有反向延长 / 焦点上平行” as a single-select group. Those claims can all be true of the model as a whole.

**Do not:** reveal the complete object→ray→image chain; use 像在无限远; keep “真正起作用的是什么？” glued to system-provided model sentences.

---

### S07-M13 — MODEL MOMENT 1: PUT THE EXPERIMENTS TOGETHER

**Stage:** MODEL  
**Concept state before:** four trial records exist  
**New concept:** none  
**Why now:** construction needs the learner's own evidence in view  
**How grounded:** show prior experiment outcomes, not correct relation options  

**System language:**

“前面几次实验，物体放的位置不一样，
最后看到的结果也不一样。

把它们放在一起看看：

到底是哪一步开始变得不一样？”

**Learner action:** look at their records; choose which object-station case they will construct  
**Physical consequence:** station selected for construction  
**Evidence meaning:** not yet L4. Recap is not construction.  
**Concept state after:** unchanged  

**Do not:** give correct relation options immediately.

---

### S07-M14 — MODEL MOMENT 2: COMPARE LIGHT PATHS

**Stage:** MODEL  
**Concept state before:** 光线 GROUNDED; 平行 NAMED; 反向延长 NAMED; 会聚 may be named now if meeting is visible  
**New concept:** 会聚 NAMED if a converging path is now visible and was not named earlier  
**Why now:** distinguish how light goes, in ordinary language first  
**How grounded:** two or more previously grounded ray situations on the bench they are assembling  

**System language:**

“这些光通过透镜以后，
走法有什么不一样？”

Allow distinguishing:

- actually coming together
- not actually coming together
- boundary case (at F)

Use 会聚 only if the ledger says NAMED.

**Learner action:** assemble the two required rays for the chosen station (existing construction grammar)  
**Physical consequence:** student rays appear  
**Evidence meaning:** construction actions begin. Selecting a textbook ray name is recognition-plus-geometry, not yet the reusable idea.  
**Concept state after:** 会聚 NAMED if meeting is seen  

---

### S07-M15 — MODEL MOMENT 3–5: CONNECT CONDITION → LIGHT → IMAGE → SCREEN

**Stage:** MODEL  
**Concept state before:** rays assembled for one station  
**New concept:** 实像 / 虚像 USED if already NAMED; otherwise ordinary receive/not-receive  

**Moment 3 — condition to light**

Construct: 物体的位置 → 光通过透镜后的走法.

Control: for this chosen station, meeting modes are mutually exclusive. Radio is valid **only** because the question is about this one case, not about the whole model.

Ordinary options, for example:

- 会在前面碰到一起
- 方向差不多，前面碰不到一起
- 前面碰不到，只有往回画才碰到

**Moment 4 — light to image**

Construct: 光的关系 → 看到什么样的像 / whether a finite real image forms.

**Moment 5 — image to screen**

“什么时候光屏能接到清晰的像？什么时候不能？”

For this station, receivable vs not is exclusive.

**Learner action:** connect relations for the constructed case  
**Physical consequence:** meeting mode and image consequence stored  
**Evidence meaning:** LEARNER CONNECTED RELATION for this station. Still not independent construction of the hidden full chain.  
**Concept state after:** 实像/虚像/光屏能接到 USED  

**Do not:** present two simultaneously correct whole-model statements as radio options.

---

### S07-M16 — MODEL MOMENT 6: STATE THE REUSABLE IDEA

**Stage:** MODEL  
**Concept state before:** construction steps for one station exist  
**New concept:** none  

**System language:**

“现在不用背几种情况。

用自己的话说说：

你觉得真正决定最后成像结果的是什么？”

**Learner action:** author a concise relation  
**Physical consequence:** authored bind checked against the constructed meeting/image (existing deterministic evaluator)  
**Evidence meaning:** LEARNER AUTHORED RELATION bound to prior construction. Because earlier UI introduced some concepts, this is **not** automatically INDEPENDENT MODEL CONSTRUCTION. Weakest honest pass remains: required ray construction + coherent meeting/image + authored bind. Authored summary **alone** must not manufacture L4.  
**Concept state after:** relation USED  

**SYSTEM_PRIMING_RISK:** earlier option labels can still leak into this sentence. Do not collapse authored paraphrase into independent construction. See evidence note below.

---

### S07-M17 — TRANSFER / EXAM / AI_OFF / COMPLETE

TRANSFER, EXAM, AI_OFF, and COMPLETE keep v1 / existing Scene architecture.

- TRANSFER: existing projector + magnifier pair. Do not change transfer semantics. Concepts used here may already be NAMED.
- EXAM: existing Exam World. Do not change architecture. Do not require 像在无限远 as learner explanation.
- AI_OFF: `llmEnabled = false`, `tutorVisible = false`, `allowedActions = []`. **NO LLM CALLS.** Fast-path without LLM is the only legitimate interpretation. If implementation touches AI_OFF, repair the known parse fallthrough locally or report it as BLOCKING DEFECT.
- COMPLETE: cognitive trace, not mastery.

**Do not:** use Learner Experience changes to justify LLM semantic fallback in AI_OFF.

---

## Evidence note (MODEL)

Audit path:

UI → learner action → stored raw evidence → evaluator → evidence accumulator → `deriveModelEvidenceLevel`

Official L4 still requires `evaluateConvexLensModelConstruction` success (`constructedValidCausalModel`). That evaluator is not weakened in v1.1.

Honest distinction this Script requires:

| Learner behavior | Must not be treated as |
|---|---|
| Selecting a system-provided correct sentence | independent construction |
| Paraphrasing that sentence | independent construction |
| Authored summary with missing ray construction | L4 |
| Ray construction + meeting/image + authored bind | valid L4 **construction evidence**, still primed to some degree |

If the architecture cannot represent SYSTEM PROVIDED vs CONNECTED vs AUTHORED vs INDEPENDENT, record `EVIDENCE_IMPLEMENTATION_GAP`. Do not silently change L4/L5/L6 semantics.

Construction UI still offers named ray kinds. That is the existing model-owned L4 grammar. v1.1 does not replace it with a universal constructor. It forbids passing MODEL solely by recognizing whole-model sentences, and forbids authored-only L4.

---

## Voice / premature-concept audit (primary flow)

Removed from primary learner copy (replace or delay):

- 不要把它说成又一种普通成像
- 可以理解为像在无限远处
- 折射后的光线还彼此平行吗？
- 有限远处有没有交点？
- EXPLAIN radios that list simultaneously true meeting modes
- EXPLAIN radios that list simultaneously true screen facts

Ordinary-language replacements stay until the ledger says NAMED.
