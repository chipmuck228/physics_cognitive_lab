# Scene 07 — Evidence Claim Design

> Implementation activity, not a lifecycle status and not a Gate result.  
> Owner of evidence semantics: [`../../evidence-design-contract.md`](../../evidence-design-contract.md)  
> Model: `convex-lens-imaging`  
> Scene: `convex-lens-optical-bench`  
> PRE: `MODEL_QUALITY_PASS_WITH_REFINEMENTS`  
> Production locks: `content/physics-models/convex-lens-imaging/implementation-contract.ts`  
> Construction evaluators: `content/physics-models/convex-lens-imaging/construction.ts`

This file designs evidence claims **before** React, runtime adapter, or Scene DSL.  
It does **not** change UPLP, L1–L6 meanings, Scene 01–06, or `metadata.status`.

Official L1–L6 remain Schema-owned and are derived only by `deriveModelEvidenceLevel`.

```text
correct answer
  ≠ reasoning
  ≠ model construction
  ≠ transfer
  ≠ independent model use
```

```text
student task
  → student action
  → raw committed attempt
  → deterministic evaluator
  → accumulated evidence
  → deriveModelEvidenceLevel
```

---

## 1. PRE refinements resolved here

### 1.1 L4 — completeness ≠ construction ≠ table row

`MINIMUM_L4_MODEL_COMPLETENESS` is a **designer checklist**. Selecting those rows is `TOO_WEAK_FOR_L4`.

`evaluateConvexLensModelConstruction` is the **student action** that may later set `constructedValidCausalModel`.

A student who recites `u>2f，所以倒立缩小实像`, clicks all correct properties, or recognizes a finished ray diagram has not constructed the model.

### 1.2 Canonical rays are geometry, not names

Two ray tokens without matching before/after segments fail. The optional focal-point → emerge-parallel ray is valid, not required.

### 1.3 Thin-lens equation stays out

`1/f = 1/u + 1/v` must not become a success path for L4, L5, or L6.

---

## 2. One coherent L4 student action

The student commits **one** spatial-ray construction.

```text
ONE CONSTRUCTION
  A. objectStation relative to F / 2F
  B. required pair: parallel-axis + through-center,
     each geometrically coherent for this objectStation
  C. meetingMode:
       actual-convergence
       OR backward-extension
       OR no-finite-meeting
  D. image consequence matching that meeting mode
       side / nature / orientation / size / screenReceivable
  E. authored bind: why D follows from C

constructionSource MUST be student-constructed
```

Structured fields carry A–D. Authored text carries E. Completeness may be inferred from that one act. It must not be scored as five table rows.

---

## 3. Evidence Claim Matrix

| Level | Cognitive claim | Required student action | Raw evidence | Provenance | Deterministic evaluator | Accumulated flag | Derived level | Invalid shortcuts |
|---|---|---|---|---|---|---|---|---|
| L1 | Noticed the bench changed | Record that screen picture or through-lens view changes with object station | observation + sufficient DESCRIBE | `PRE_COMMIT_STRUCTURED` and/or authored | future OBSERVE/DESCRIBE gate | `observedPhenomenon` | L1 | watching only |
| L2 | Named object, F, image, screen as distinct | Identify u, F/2F, image, screen | description | structured + authored | future DESCRIBE gate | `identifiedQuantities` | L2 | “变了” only |
| L3 | Used a partial relation | State one meeting or receivability fragment, not the complete construction | explanation pick + fragment | structured + authored | future EXPLAIN gate | `identifiedRelations` | L3 | table row as complete model |
| L4 | Constructed the model | One spatial-ray construction + authored meeting→image bind | `ConvexLensModelAttempt` | `PRE_COMMIT_STRUCTURED` **and** `PRE_COMMIT_AUTHORED` | `evaluateConvexLensModelConstruction` | `constructedValidCausalModel` | L4 | properties only; table row; finished diagram; incoherent rays |
| L5 | Transferred the model | Accept required projector **and** magnifier, each `targetId`-bound | `ConvexLensTransferAttempt[]` | structured + authored | `evaluateRequiredTransferPair` | `successfulTransfer` only after valid MODEL | L5 | “都有凸透镜”; camera substitute; wrong target |
| L6 | Used the model independently | Accept both AI_OFF challenges from pre-commit structure, LLM off | `ConvexLensAiOffAttempt[]` | pre-commit authored/structured; post-check confirmation only | `evaluateRequiredAiOffPair` | `independentAiOffSuccess` + `llmDisabledDuringIndependent` | L6 | answer-only; post-check manufacture; EXAM |

`SYSTEM_DERIVED` is only the accumulator → `deriveModelEvidenceLevel`.  
`LLM_GENERATED` must never set a flag.

---

## 4. Evidence Claim Audit — L4

**CLAIM**  
The student constructed the convex-lens imaging relation: object position relative to focal geometry selects a ray-meeting mode, and image properties follow.

This is **model construction**, not a correct property set, not a memorized F/2F table, and not EXPLAIN.

**REQUIRED STUDENT ACTION**  
Commit one student-built spatial-ray construction that binds A–E above.

**RAW EVIDENCE**

```text
objectStation
rays[2].kind / beforeLens / afterLens
meetingMode
image.{side,nature,orientation,size,screenReceivable}
modelReasoning
constructionSource
```

**PROVENANCE**  
`PRE_COMMIT_STRUCTURED` (station, rays, meeting, image) **and** `PRE_COMMIT_AUTHORED` (`modelReasoning`).  
Post-check may confirm. Post-check must not create `constructedValidCausalModel`.

**DETERMINISTIC EVALUATOR**  
`evaluateConvexLensModelConstruction`

```text
student-constructed
  AND required parallel-axis + through-center pair, coherent for this objectStation
  AND meetingMode matches officialImagingState(station)
  AND image matches that meeting mode and official station
  AND authored has meeting-mode language + consequence bind
→ may set constructedValidCausalModel
```

**MISCONCEPTION / DISTRACTOR CHECK**

| ID | Fail L4 if affirmed |
|---|---|
| cli-M1 | image on the lens |
| cli-M2 | real image lives inside the screen |
| cli-M3 | virtual image receivable |
| cli-M6 | F/2F are only mnemonic tags |
| cli-M8 | no screen picture means no image in every case |
| cli-M9 | u = f is an ordinary finite image |
| cli-M10 | upright/inverted is the same property as real/virtual |

**ACCUMULATED FLAG**  
`constructedValidCausalModel`

**DERIVED LEVEL**  
May support L4. Must not be inferred from L3.

**WEAKEST PASS / KNOWN SHORTCUTS**

| Probe | Must |
|---|---|
| all image properties correct, no ray relation | FAIL |
| correct station + memorized table row | FAIL |
| correct completed diagram selected from options | FAIL |
| `u>2f，所以倒立缩小实像` with no meeting construction | FAIL |
| two ray names, geometrically incoherent | FAIL |
| actual-convergence + virtual image | FAIL |
| backward-extension + real screen-receivable image | FAIL |
| u = f treated as ordinary finite image | FAIL |
| copied visible completed rays | FAIL |
| long vocabulary dump, no coherent relation | FAIL |
| concise Grade-9 bind, including equivalent 会聚/反向延长/不相交 wording | PASS |

**REVIEW VERDICT**  
`BOUNDED` if implemented as one construction + authorship.  
`OVERCLAIM` if implemented as a five-row table or property clicks.

---

## 5. Evidence Claim Audit — L5

**CLAIM**  
The student transferred the same ray-meeting structure to a new surface and did not let “also a convex lens” or a camera/screen resemblance manufacture transfer.

This is **transfer**, not MODEL reuse.

**REQUIRED STUDENT ACTION**  
Succeed on **both** required targets. One target is not enough for `successfulTransfer`.

1. `near-projector-real-enlarged` (`full-model`)  
   f < u < 2f → actual convergence → inverted enlarged real image → screen at image plane
2. `far-magnifying-glass-virtual` (`full-model`)  
   u < f → outgoing rays diverge → backward extensions meet → upright enlarged virtual image → cannot be received on a screen

Each attempt is bound to its actual `targetId`. Projector evidence cannot substitute for magnifier evidence.

Camera (`medium-camera-real-reduced`) is available, not required. Using it must not create L5.

**RAW EVIDENCE**

```text
TransferAttempt.targetId
objectStation
meetingMode
image
explanation
```

**PROVENANCE**  
`PRE_COMMIT_STRUCTURED` + `PRE_COMMIT_AUTHORED`, target-specific.

**DETERMINISTIC EVALUATOR**  
`evaluateConvexLensTransfer` per attempt; `evaluateRequiredTransferPair` for the flag.

**MISCONCEPTION / DISTRACTOR CHECK**

- “都有凸透镜” / “投影仪能放大” / “放大镜也是凸透镜”
- correct properties with no meeting-mode reasoning
- projector structure on magnifier `targetId` and the reverse
- generic F/2F mnemonic
- camera answer as the required pair

**ACCUMULATED FLAG**  
`successfulTransfer` only after valid MODEL **and** both required targets.

**DERIVED LEVEL**  
May support L5.

**WEAKEST PASS / KNOWN SHORTCUTS**

| Probe | Must |
|---|---|
| valid MODEL only | stay L4 |
| surface convex-lens slogan | FAIL |
| projector reasoning on magnifier target | FAIL |
| magnifier reasoning on projector target | FAIL |
| camera instead of required pair | FAIL |
| both target-bound coherent transfers | PASS |

**REVIEW VERDICT**  
`BOUNDED` if both targets are required and surface-only fails.

---

## 6. Evidence Claim Audit — L6

**CLAIM**  
The student used the model independently with the tutor off: one unfamiliar real-image application, and one virtual/boundary check.

This is **independent model use**, not EXAM, not TRANSFER, not post-check recognition.

### 6.1 Challenge A — `ai-off-unfamiliar-window-card-projection`

Pre-commit must establish: distant object (u > 2f), actual convergence, inverted reduced real image, card is a receiver at the image plane. Not “这也有凸透镜.”

### 6.2 Challenge B — `ai-off-boundary-magnifier-cannot-catch-virtual`

Pre-commit must establish: u < f → backward extension → virtual image cannot be caught on paper; **and** u = f is not an ordinary finite image. Light on a screen is not the same as “no image exists.”

**RAW EVIDENCE**

```text
challengeId
objectStation / meetingMode / image
preCommitReasoning
judgmentId
postCheckIds     confirmation only
llmUsed === false
```

**PROVENANCE**  
Official `independentAiOffSuccess` copies **pre-commit** fields.  
`POST_COMMIT_CONFIRMATION` may reject or confirm. It must not manufacture A’s receiver bind or B’s virtual/limit bind.

**DETERMINISTIC EVALUATOR**  
`evaluateConvexLensAiOff` / `evaluateRequiredAiOffPair`

```text
A pre-commit distant-object + actual convergence + card-as-receiver
  AND B pre-commit virtual-not-on-screen + u=f limit
  AND both judgments correct
  AND llmUsed === false
  AND failed precommit + correct post-check still fails
→ independentAiOffSuccess + llmDisabledDuringIndependent
```

**ACCUMULATED FLAG**  
`independentAiOffSuccess` and `llmDisabledDuringIndependent`

**DERIVED LEVEL**  
May support L6 only with valid MODEL and TRANSFER already present. EXAM must not set these flags.

**WEAKEST PASS / KNOWN SHORTCUTS**

| Probe | Must |
|---|---|
| correct option / judgment only | FAIL |
| `llmUsed !== false` | FAIL |
| failed precommit → correct post-check | FAIL; flags stay false |
| EXAM complete | not L6 |
| both pre-commit structures + LLM off | PASS |

**REVIEW VERDICT**  
`BOUNDED` if pre-commit carries the flags.  
`OVERCLAIM` if overlay judgment or post-check alone creates L6.

---

## 7. Canonical-ray contract

L4 requires this pair at every station. Geometry is **station-aware**. A matching kind/before/after token table is not enough.

| Kind | Incident path | Before lens | After lens | Role |
|---|---|---|---|---|
| `parallel-axis` | actual | parallel to principal axis | through far focal point | **required** |
| `through-center` | actual | toward optical center | undeviated | **required** |
| `through-near-focus` | see station table | through near focal point | emerge parallel | `VALID_OPTIONAL_REFERENCE` only |

Focal-ray station table:

| ObjectStation | Focal-ray status | What may be drawn |
|---|---|---|
| `beyond-2f`, `at-2f`, `f < u < 2f` | `actual-optional-reference` | A solid incident ray may actually pass through near F, then emerge parallel |
| `inside-f` (`u < f`) | `backward-extension-optional-reference` | The actual incident segment does **not** pass through near F. Only the backward extension may align with near F. A solid “through-F” incoming segment fails |
| `at-f` (`u = f`) | `not-applicable` | Do not accept a generic through-near-focus token. Do not draw a misleading through-F construction from the object top |

Substituting the optional focal ray for either required ray fails.  
“Two ray names” without station-true geometry fail.

Image location:

- actual-convergence → intersection of the two outgoing rays, other side
- backward-extension → intersection of backward extensions, same side
- no-finite-meeting → no finite image marker

---

## 8. EXAM boundary

Ship `PRODUCTION_EXAM_PATTERN_IDS`.  
Store answer and reasoning separately.  
EXAM completion must not set `independentAiOffSuccess` or create L6.

No thin-lens calculation item.

---

## 9. Accumulator contract

Future `accumulateConvexLensSceneEvidence(session)` writes flags only.

| Flag | Set when | May support | Must not |
|---|---|---|---|
| `observedPhenomenon` | sufficient OBSERVE + DESCRIBE | L1 | later stages |
| `identifiedQuantities` | object / F / image / screen distinct | L2 | become L4 |
| `identifiedRelations` | one partial meeting or receivability claim | L3 | become L4 |
| `constructedValidCausalModel` | L4 construction contract | L4 | table; property clicks; finished diagram |
| `successfulTransfer` | valid MODEL **and** required pair | L5 | MODEL alone; one target; camera |
| `independentAiOffSuccess` | both AI_OFF accepted from pre-commit | L6 with next flag | EXAM; post-check-only |
| `llmDisabledDuringIndependent` | `llmUsed === false` and no tutor in AI_OFF | L6 | be inferred from COMPLETE |

Never write `"L4" | "L5" | "L6"` in Scene code.

---

## 10. Provenance map

| Evidence | Provenance | May support | Must not support |
|---|---|---|---|
| objectStation, rays, meetingMode, image | `PRE_COMMIT_STRUCTURED` | constrained construction / transfer | independent use by itself |
| modelReasoning / transfer explanation / AI_OFF preCommitReasoning | `PRE_COMMIT_AUTHORED` | meeting→image bind; L6 precommit | length alone |
| overlay judgment / post-check | `POST_COMMIT_CONFIRMATION` | confirm or reject | missing pre-commit flags |
| accumulator flags / `deriveModelEvidenceLevel` | `SYSTEM_DERIVED` | official L1–L6 after valid flags | a new L-level in Scene code |
| tutor text | `LLM_GENERATED` | none | any flag |

---

## 11. What this design forbids in a later UI

- Five-row F/2F lookup as MODEL
- Showing a completed ray diagram before the student constructs
- Solid and dashed rays used interchangeably
- Screen position driving official image position
- A new generic optics shell
- Scene DSL growth to absorb ray geometry
- LLM deciding rays or correctness
- Thin-lens equation as a success path
- Promoting `metadata.status` out of `draft` in this pass

No physics invention is required to implement. Scene 07 React is not authorized by this file.
