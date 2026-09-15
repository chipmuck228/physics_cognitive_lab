# Scene 07 — Reasoning Sufficiency Audit v1

> Kind: **EXPERIMENTAL DESIGN / EVALUATOR AUDIT**  
> Date: 2026-09-15  
> Scene: `convex-lens-optical-bench`  
> Primary model: `convex-lens-imaging`  
> Decision: D071  
> Status: not canonical

```text
EXPERIMENTAL SCENE07 EVALUATOR AUDIT
≠ UNIVERSAL_SEMANTIC_EVALUATOR
≠ UNIVERSAL_REASONING_SUFFICIENCY_STANDARD
≠ LEARNER_VALIDATED
≠ MODEL_VALIDATED
```

This document records a measurement defect found in a manual learner-flow
inspection after Learner Experience v1.1, and the Scene 07 repair that
separates **local reasoning sufficiency** from **whole-model coverage**.

It is not an architecture owner. UPLP, Physics Model Schema/Library,
Evidence Design, PRI, and AI_OFF win on conflict.

---

## Observed failures (manual inspection)

### Failure A — physically sufficient u=f reasoning rejected

Learner-facing task: current u=f judgment / boundary reasoning.

Raw learner action:

> 物体在F上，光线透过透镜后，光线平行无法相交，在白屏上无法成像，白屏上接不到像。

Semantic content (not judged by textbook elegance):

- condition: object at F
- mechanism: outgoing rays do not meet at a finite position
- consequence: screen cannot receive a clear finite real image

This is physically sufficient for the current u=f claim.

### Failure B — local relation screen required an unrelated branch

Learner-facing question:

> 刚才判断时，哪些关系真正起作用？

The learner selected the u=f relation. The system responded approximately:

> 还有一条关键关系没有对照到。再看看哪一项还没有核对？

That is wrong if the missing item is the u<f virtual-image branch.

---

## Part 1 — traced code paths (not guessed)

### Failure A

```text
learner-facing task: AI_OFF / MODEL authored bind for u = f
        ↓
raw text: observed sentence
        ↓
analyzeConvexLensAuthored
        ↓
meetingKind = no-finite-meeting   (“光线平行”)
consequenceKind = virtual         (“屏…接不到”)
hasConsequenceBind = false
contradictory = true
        ↓
classifyLensStep6FastPath → insufficient
        ↓
hasLocallyContradictoryBind:
  no-finite-meeting + virtual without none
        ↓
claimPhysicallyInconsistent:
  parallel-no-finite-meeting + virtual
        ↓
progression blocked
        ↓
feedback: 相遇方式和像的后果对不上 / 还要用一句话连起来
```

Exact rejection reason:

1. `(光屏|幕布|屏).{0,6}接不到` mapped **screen cannot receive** to **virtual image**.
2. `无法成像` was not recognized as nature `none`.
3. `no-finite-meeting + virtual` is treated as a local contradiction.
4. Optional: `treatsFAsLimit` required `焦点上|u=f|有限远`, so `物体在F上` could fail a second token gate on challenge B.
5. Compound judgment `virtual-not-on-screen-and-f-is-limit` implied **only** backward-extension / virtual, so a correct u=f parse could `judgmentDisagree`.

The sentence was not rejected because the physics was wrong. It was rejected because the evaluator demanded canonical slots (`有限远`, `实像`/`虚像`, `所以`, extra model branches).

### Failure B

```text
learner-facing task: AI_OFF post-check
  “刚才判断时，哪些关系真正起作用？”
        ↓
raw action: select f-is-not-ordinary only
        ↓
postCheckMatchesRequired / classifyLensAiOffPostCheck
        ↓
overlay required:true on BOTH
  virtual-cannot-project (u<f)
  f-is-not-ordinary (u=f)
        ↓
failureKind: missing required post-check
        ↓
LENS_AI_OFF_COPY.postCheckMissingRequired
```

The visible question is **this judgment**. The evaluator required **complete-model coverage**.

---

## Part 2 — evaluator audit

| Stage | Current task claim | Minimum physics | Optional | Whole-model only | Token demand? | False negative? | False positive? |
|---|---|---|---|---|---|---|---|
| DESCRIBE | distinguish object / F / image / screen + a seen change | structured picks + own words | richer description | imaging branches | vagueness floor, not textbook tokens | short ordinary Chinese can pass | slogan “变了” fails |
| PREDICT | guess what happens in this trial | outcome pick + own words **or** honest unknown | causal reason | later branches | no | honest-unknown is allowed | guessing still commits |
| EXPERIMENT reflection | say what this trial showed | own words | mechanism | other trials | no semantic slots | weak | weak |
| EXPLAIN | not every trial receives; seeing ≠ receiving | exclusive observation picks + own words | authored mechanism | MODEL construction | fragment IDs, not tokens | slogan-only blocked | table-row blocked |
| MODEL | construct **this station's** rays + bind | official rays + meeting + image + authored bind | extra rays | other stations | bind, not one textbook word | Failure A hit step 6 | sandwich / table fail |
| TRANSFER | same relation in a new setting | target station structure + authored bind | paraphrase | other targets | same authored parser | 碰到一起 previously needed LLM | surface slogan fail |
| EXAM | this exam item | intended representation / model pick + answer + own words | item-specific mechanism | entire convex-lens model | `addressesRequiredReasoning = hasOwnWords` only | does **not** secretly require whole model | does **not** semantically check item reasoning |
| AI_OFF | this independent challenge, **this** judgment | local condition + mechanism + consequence | extra branch | other branch / other challenge | was token+slot; now local sufficiency | Failure A/B | slogan / contradiction still fail |

EXAM does not smuggle whole-model coverage into one item. It also does not yet evaluate item-specific mechanism. This repair does not invent a universal exam semantic engine.

MODEL construction evidence remains `evaluateConvexLensModelConstruction`. Authored summary still cannot manufacture L4.

---

## Part 3 — task-specific minimum structures

### TASK: u=f boundary reasoning

Required:

- condition: object at F
- mechanism: outgoing rays do not converge / meet at a finite position
- consequence: screen cannot receive a clear finite real image

Accepted equivalent mechanism language includes:

- 光线平行，碰不到一起
- 光通过透镜以后没有交到一起
- 光线一直没有会聚到一个位置
- 往前走也没有碰到一起

Do not require the tokens `有限远` / `会聚` / `实像` / `交点` if the physical meaning is present.

### TASK: u<f virtual / cannot project

Required:

- condition: object inside F (learner-owned station or authored)
- mechanism: outgoing rays still diverge; only backward extension meets
- consequence: virtual / screen cannot receive

Do not require the learner to also state the u=f branch.

### TASK: actual-convergence real image

Required: actual meeting + receivable real image.

---

## Part 4 — physics precision preserved

Not sufficient:

- `光屏上没有，所以没有像` (no-screen-means-no-image)
- `焦点上就是普通成像，只是屏不好找`
- `光屏决定像在哪里`
- `物体在F，光线会聚，光屏接到实像`

Wording variation ≠ physics error.

---

## Part 5 — local vs coverage

```ts
LocalReasoningResult {
  sufficient: boolean
  status: sufficient | insufficient | contradictory | incorrect | unparseable
  supportedRelations
  missingRequiredRelations
  contradictions
  feedback
}

ModelCoverageResult {
  coveredBranches
  missingBranches
}
```

Local progression does not depend on `missingBranches`.

Implementation: `lib/learning/lens-local-reasoning.ts`.

AI_OFF challenge B official station may be `inside-f` **or** `at-f`, matching the local claim. Overlay `required` still lists both relations as belonging to the challenge; `localScope` decides which ones this judgment must check.

---

## Part 6 — relation screen repair

Question: “刚才判断时，哪些关系真正起作用？”

Required set follows **this judgment**:

- local task `u-equals-f` → `f-is-not-ordinary` only
- local task `u-less-than-f` → `virtual-cannot-project` only
- compound authored coverage → both

Selecting the extra true model sentence is allowed. It is not required.

Broader MODEL coverage is not hidden inside this screen.

---

## Candidate principle (Scene 07 experimental; not universal)

**REASONING SUFFICIENCY INTEGRITY**

If a learner has already expressed enough physically valid reasoning to
support the **current** task conclusion, the system must not block
progression merely because the response lacks canonical wording,
unnecessary relation slots, unrelated model branches, preferred textbook
terminology, or redundant restatement.

The evaluator asks: “Is this reasoning sufficient for THIS claim?”
not: “Did the learner reproduce everything we know about this model?”

Do not promote this to a universal canonical contract yet.

---

## Failure taxonomy used

| Kind | Meaning | Learner-visible |
|---|---|---|
| MISSING / INSUFFICIENT | a required relation for **this** claim is absent | names the missing **dimension** (mechanism / consequence / condition), not the missing word |
| CONTRADICTORY | stated relations physically conflict | 光线走法和结果对不上 |
| INCORRECT | reasoning supports a wrong physics conclusion | not “再试一次” |
| UNPARSEABLE | system cannot confidently interpret | 还没看清； not marked physically wrong |
| SYSTEM_ERROR | parser/evaluator failed | recoverable; not incorrect |

AI_OFF: `llmEnabled = false`; `resolveLensAiOffCheck` makes zero `/api/lens-step6-parse` calls.

---

## Interaction Alignment (IA)

New Scene 07 question: does the evaluator require more physics than the visible task asks the learner to demonstrate?

- Failure A: yes → FAIL before repair
- Failure B: yes → FAIL before repair
- After repair: local task physics only; coverage recorded separately

IA-1 Task ↔ Capability: local u=f asks for u=f causal structure.  
IA-5 Blocked State ↔ Reason: missing mechanism / local relation, not “还有一条关键关系”.  
IA-6 Evidence ↔ Interaction: MODEL coverage stays on MODEL construction; not smuggled into this post-check.

---

## Explicit non-claims

- not LEARNER_VALIDATED
- not UNIVERSAL_SEMANTIC_EVALUATOR
- not UNIVERSAL_REASONING_SUFFICIENCY_STANDARD
- not MODEL_VALIDATED
- Physics Truth unchanged
- UPLP unchanged
