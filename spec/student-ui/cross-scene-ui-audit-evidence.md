# Cross-Scene UI Audit — Evidence Completion

> Date: 2026-09-12  
> Completes evidence for [`cross-scene-ui-audit.md`](./cross-scene-ui-audit.md) (D052).  
> Contract: [`../student-ui-interaction-contract.md`](../student-ui-interaction-contract.md)  
> Evidence rules: [`../evidence-design-contract.md`](../evidence-design-contract.md)

This file is **audit evidence**, not a PRE/POST rewrite and not learner validation.

```text
Physics Model semantics changed: NO
UPLP semantics changed: NO
Evaluator semantics changed: NO
L1-L6 semantics changed: NO
Historical PRE/POST rewritten: NO
metadata.status changed: NO
```

Happy-path E2E is cited only where it asserts a specific contract cell (heading after advance, AI_OFF Tutor absent). It is **not** a substitute for screenshot review.

---

## Legend

| Mark | Meaning |
|---|---|
| `AUTO` | A named automated assertion covers this cell |
| `HUMAN_REVIEW_REQUIRED` | No dedicated contract assertion exists today |
| `N/A` | Control does not exist at this stage (no group / no blocked-primary path / Tutor expected absent) |

Test IDs used below:

| ID | File | What it actually asserts |
|---|---|---|
| `SS` | `tests/e2e/student-ui-screenshots.spec.ts` `captureStage` | Stage **heading** visible; Tutor button count `1` or `0` |
| `HP-01` | `tests/e2e/happy-path.spec.ts` + `tests/e2e/helpers.ts` | After accepted action, **next stage heading** appears; COMPLETE no Tutor |
| `HP-02` | `tests/e2e/four-stroke-engine-happy-path.spec.ts` + `engine-helpers.ts` | Same progression; `expectNoTutorChrome` on AI_OFF / COMPLETE |
| `HP-03` | `tests/e2e/horizontal-force-cart-happy-path.spec.ts` + `cart-helpers.ts` | Same |
| `HP-04` | `tests/e2e/equal-volume-material-samples-happy-path.spec.ts` + `samples-helpers.ts` | Same |
| `HP-05` | `tests/e2e/equal-mass-heated-samples-happy-path.spec.ts` + `heat-helpers.ts` | Same |
| `C-04M` | `tests/components/samples-ratio-board-ui-contract.test.tsx` | Scene 04 MODEL: cut-compare **questions**; CTA text; missing vs incorrect; accepted → `已进入下一步` |
| `C-FB` | `tests/learning/student-ui-feedback.test.ts` | Shared missing-vs-incorrect helper; Scene 04 empty/wrong MODEL copy |
| `C-TUTOR` | `tests/components/tutor-affordance.test.tsx` | Tutor CTA text `给我一点提示`; loading status |
| `C-01A` | `tests/components/microwave-bread-lab.test.tsx` | Scene 01 AI_OFF / COMPLETE: Tutor button absent |
| `C-02A` | `tests/components/four-stroke-engine-lab-phase7.test.tsx`, `phase8.test.tsx` | Scene 02 AI_OFF / COMPLETE: Tutor absent |
| `C-03A` | `tests/components/horizontal-force-cart-lab-phase3.test.tsx` | Scene 03 AI_OFF / COMPLETE: Tutor absent |

Tutor expectation used by `SS` (matches `canCallTutor` / empty EXPERIMENT policy):

| Stage | Tutor |
|---|---|
| OBSERVE, PREDICT, MODEL, TRANSFER, EXAM | present |
| EXPERIMENT, AI_OFF | absent |

---

## A. Automated coverage table

Cells are **assertion coverage**, not visual pass/fail. Visual verdicts are in section C.

### Scene 01 — `microwave-bread`

| Stage | Heading | Group prompt/label | Primary CTA semantics | Missing/invalid feedback | Accepted visible change | Tutor present/absent | AI_OFF Tutor absent |
|---|---|---|---|---|---|---|---|
| OBSERVE | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` (no option group at capture; heat-first) | `HUMAN_REVIEW_REQUIRED` | `N/A` (no blocked submit at capture) | `AUTO` `HP-01` (next heading) | `AUTO` `SS` present | `N/A` |
| PREDICT | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-01` | `AUTO` `SS` present | `N/A` |
| EXPERIMENT | `AUTO` `SS` | `N/A` (sliders + run, no radio/checkbox group) | `HUMAN_REVIEW_REQUIRED` | `N/A` | `AUTO` `HP-01` | `AUTO` `SS` absent | `N/A` |
| MODEL | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-01` | `AUTO` `SS` present | `N/A` |
| TRANSFER | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-01` | `AUTO` `SS` present | `N/A` |
| EXAM | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-01` | `AUTO` `SS` present | `N/A` |
| AI_OFF | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-01` | `AUTO` `SS` absent | `AUTO` `SS` + `C-01A` + `HP-01` COMPLETE |

### Scene 02 — `four-stroke-engine`

| Stage | Heading | Group prompt/label | Primary CTA semantics | Missing/invalid feedback | Accepted visible change | Tutor present/absent | AI_OFF Tutor absent |
|---|---|---|---|---|---|---|---|
| OBSERVE | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-02` | `AUTO` `SS` present | `N/A` |
| PREDICT | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-02` | `AUTO` `SS` present | `N/A` |
| EXPERIMENT | `AUTO` `SS` | `N/A` (run contrast; no option group at capture) | `HUMAN_REVIEW_REQUIRED` | `N/A` | `AUTO` `HP-02` | `AUTO` `SS` absent | `N/A` |
| MODEL | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-02` | `AUTO` `SS` present | `N/A` |
| TRANSFER | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-02` | `AUTO` `SS` present | `N/A` |
| EXAM | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-02` | `AUTO` `SS` present | `N/A` |
| AI_OFF | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-02` | `AUTO` `SS` absent | `AUTO` `SS` + `C-02A` + `HP-02` |

### Scene 03 — `horizontal-force-cart`

| Stage | Heading | Group prompt/label | Primary CTA semantics | Missing/invalid feedback | Accepted visible change | Tutor present/absent | AI_OFF Tutor absent |
|---|---|---|---|---|---|---|---|
| OBSERVE | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-03` | `AUTO` `SS` present | `N/A` |
| PREDICT | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-03` | `AUTO` `SS` present | `N/A` |
| EXPERIMENT | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-03` | `AUTO` `SS` absent | `N/A` |
| MODEL | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-03` | `AUTO` `SS` present | `N/A` |
| TRANSFER | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-03` | `AUTO` `SS` present | `N/A` |
| EXAM | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-03` | `AUTO` `SS` present | `N/A` |
| AI_OFF | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-03` | `AUTO` `SS` absent | `AUTO` `SS` + `C-03A` + `HP-03` |

### Scene 04 — `equal-volume-material-samples`

| Stage | Heading | Group prompt/label | Primary CTA semantics | Missing/invalid feedback | Accepted visible change | Tutor present/absent | AI_OFF Tutor absent |
|---|---|---|---|---|---|---|---|
| OBSERVE | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-04` | `AUTO` `SS` present | `N/A` |
| PREDICT | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-04` | `AUTO` `SS` present | `N/A` |
| EXPERIMENT | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-04` | `AUTO` `SS` absent | `N/A` |
| MODEL | `AUTO` `SS` | `AUTO` `C-04M` (cut-compare questions) | `AUTO` `C-04M` (`记下关系`) | `AUTO` `C-04M` + `C-FB` | `AUTO` `C-04M` + `HP-04` | `AUTO` `SS` present | `N/A` |
| TRANSFER | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-04` | `AUTO` `SS` present | `N/A` |
| EXAM | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-04` | `AUTO` `SS` present | `N/A` |
| AI_OFF | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-04` | `AUTO` `SS` absent | `AUTO` `SS` + `HP-04` |

Scene 03 / 05 MODEL have `cartModelStudentFeedback` / `heatModelStudentFeedback` helpers. Those are **not** UI-contract component tests. They stay `HUMAN_REVIEW_REQUIRED` for student-visible feedback.

### Scene 05 — `equal-mass-heated-samples`

| Stage | Heading | Group prompt/label | Primary CTA semantics | Missing/invalid feedback | Accepted visible change | Tutor present/absent | AI_OFF Tutor absent |
|---|---|---|---|---|---|---|---|
| OBSERVE | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-05` | `AUTO` `SS` present | `N/A` |
| PREDICT | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-05` | `AUTO` `SS` present | `N/A` |
| EXPERIMENT | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-05` | `AUTO` `SS` absent | `N/A` |
| MODEL | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-05` | `AUTO` `SS` present | `N/A` |
| TRANSFER | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-05` | `AUTO` `SS` present | `N/A` |
| EXAM | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-05` | `AUTO` `SS` present | `N/A` |
| AI_OFF | `AUTO` `SS` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `HUMAN_REVIEW_REQUIRED` | `AUTO` `HP-05` | `AUTO` `SS` absent | `AUTO` `SS` + `HP-05` |

### Shared Tutor CTA (not a Scene/stage cell)

`C-TUTOR` asserts the Tutor primary control says `给我一点提示` and shows a pending status. It does **not** prove the button is mounted on every tutor-allowed stage. Mount/absence is `SS`.

### Coverage summary (do not treat as a pass)

| Assertion | Automated Scene/stage cells | Remainder |
|---|---|---|
| Task heading | All 5 × 7 via `SS` | — |
| Group visible prompt | Scene 04 MODEL via `C-04M` | All other groups: `HUMAN_REVIEW_REQUIRED` |
| Primary CTA semantics | Scene 04 MODEL via `C-04M`; Tutor chrome via `C-TUTOR` | Other stage CTAs: `HUMAN_REVIEW_REQUIRED` |
| Missing/invalid feedback | Scene 04 MODEL via `C-04M` + `C-FB` | Other gated submits: `HUMAN_REVIEW_REQUIRED` |
| Accepted visible change | Scene 04 MODEL same-screen via `C-04M`; all listed stages next-heading via `HP-0n` | Same-screen confirmation elsewhere: `HUMAN_REVIEW_REQUIRED` |
| Tutor present/absent | All 5 × 7 via `SS` | — |
| AI_OFF Tutor absent | All 5 via `SS`; extra 01/02/03 component + all five happy-path | — |

---

## B. Screenshot baseline

Generator: `tests/e2e/student-ui-screenshots.spec.ts`.  
Directory: `spec/student-ui/screenshots/`.  
Capture rule: **before** completing the listed stage. Not happy-path completion screenshots.

All 35 required files exist. No listed stage was skipped for architecture reasons.

| Scene | OBSERVE | PREDICT | EXPERIMENT | MODEL | TRANSFER | EXAM | AI_OFF |
|---|---|---|---|---|---|---|---|
| 01 | `scene-01-observe.png` | `scene-01-predict.png` | `scene-01-experiment.png` | `scene-01-model.png` | `scene-01-transfer.png` | `scene-01-exam.png` | `scene-01-ai-off.png` |
| 02 | `scene-02-observe.png` | `scene-02-predict.png` | `scene-02-experiment.png` | `scene-02-model.png` | `scene-02-transfer.png` | `scene-02-exam.png` | `scene-02-ai-off.png` |
| 03 | `scene-03-observe.png` | `scene-03-predict.png` | `scene-03-experiment.png` | `scene-03-model.png` | `scene-03-transfer.png` | `scene-03-exam.png` | `scene-03-ai-off.png` |
| 04 | `scene-04-observe.png` | `scene-04-predict.png` | `scene-04-experiment.png` | `scene-04-model.png` | `scene-04-transfer.png` | `scene-04-exam.png` | `scene-04-ai-off.png` |
| 05 | `scene-05-observe.png` | `scene-05-predict.png` | `scene-05-experiment.png` | `scene-05-model.png` | `scene-05-transfer.png` | `scene-05-exam.png` | `scene-05-ai-off.png` |

Extra leftover (not part of the 35-baseline): `scene-04-model-missing-feedback.png`.

Notes for reviewers:

- Scene 01 OBSERVE is heat-first: heading + `开始加热` + Tutor; option groups appear after heating.
- Scene 01 / 02 EXPERIMENT are action-first (sliders / 关掉燃烧). Scene 03 / 04 / 05 EXPERIMENT screenshots show the intra-stage prediction form because that is the first EXPERIMENT surface after PREDICT A.
- Scene 01 / 05 EXAM first step hides answer options (representation first). Scene 02 / 03 / 04 EXAM also hide answer options; their first-step CTA is `继续`.

---

## C. Human visual review matrix

Questions:

1. Is it clear what the student must do?
2. Does every option group have a visible question?
3. Is the primary CTA understandable?
4. If blocked, is the reason understandable? (`N/A` = no blocked submit on this screenshot)
5. Is Tutor purpose clear where present?
6. Is protected physics/model structure leaked?
7. Is internal/developer vocabulary exposed?

Overall verdict is the worst of the seven answers.

### Scene 01

| Shot | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|
| observe | Y | N/A | Y (`开始加热`) | N/A | Y | N | N | **PASS** | Heat-first; no option group yet |
| predict | Y | Y | Y (`记下我的猜测`) | N/A | Y | N | N | **PASS** | |
| experiment | Y | N/A | Y (`再加热一次`) | N/A | N/A (absent, policy) | N | N | **PASS** | Tutor absent is expected |
| model | Y | Y | Y (`记下这条因果链`) | N/A | Y | N | N | **PASS** | |
| transfer | Y | Y | Y (`记下这个情况`) | N/A | Y | N | N | **PASS** | Groups have visible prompts |
| exam | Y | Y | Y (`下一步：想想该用什么关系`) | N/A | Y | N | N | **PASS** | Options hidden until representation |
| ai-off | Y | Y | Y (`记下我的解释`) | N/A | N/A (absent) | N | N | **PASS** | No Tutor chrome |

### Scene 02

| Shot | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|
| observe | Y | Y | Y (`记下看到的`) | N/A | Y | N | N | **PASS** | |
| predict | Y | Y | Y (`记下我的猜测`) | N/A | Y | N | N | **PASS** | |
| experiment | Y | N/A | Y (`关掉燃烧，看一看`) | N/A | N/A | N | N | **PASS** | |
| model | Y | Y | Y (`记下这条关系`) | N/A | Y | N | N | **PASS** | Relation-slot questions visible; dual hints = I08 |
| transfer | Y | Y | Y (`记下这次判断`) | N/A | Y | N | N | **PASS** | Dual hints = I08 |
| exam | Y | Y | Partial (`继续`) | N/A | Y | N | N | **PASS_WITH_ISSUE** | P2 UI-03: `继续` on first EXAM step |
| ai-off | Y | Y | Y (`记下这次判断`) | N/A | N/A | N | N | **PASS** | |

### Scene 03

| Shot | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|
| observe | Y | Y | Y (`记下看到的`) | N/A | Y | N | N | **PASS** | |
| predict | Y | Y | Y (`记下预测`) | N/A | Y | N | N | **PASS** | |
| experiment | Y | Y | Y (`记下预测` / `动手看结果`) | N/A | N/A | N | N | **PASS** | Intra-stage predict form |
| model | Y | Y | Y (`记下关系`) | N/A | Y | N | N | **PASS** | Per-case legends visible; dual hints = I08 |
| transfer | Y | Y | Y (`记下迁移`) | N/A | Y | N | N | **PASS** | Each relation has a header |
| exam | Y | Y | Partial (`继续`) | N/A | Y | N | N | **PASS_WITH_ISSUE** | P2 UI-03: `继续` |
| ai-off | Y | Y | Y (`记下这次判断`) | N/A | N/A | N | N | **PASS** | |

### Scene 04

| Shot | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|
| observe | Y | Y | Y (`记下看到的`) | N/A | Y | N | N | **PASS** | |
| predict | Y | Y | Y (`记下预测`) | N/A | Y | N | N | **PASS** | |
| experiment | Y | Y | Y (`记下预测` / `动手看结果`) | N/A | N/A | N | N | **PASS** | |
| model | Y | Y | Y (`记下关系`) | N/A on this shot | Y | N | N | **PASS** | Cut questions visible; dual hints = I08 |
| transfer | Y | Y | Y (`记下迁移`) | N/A | Y | N | N | **PASS** | |
| exam | Y | Y | Partial (`继续`) | N/A | Y | N | N | **PASS_WITH_ISSUE** | P2 UI-03: `继续` |
| ai-off | Y | Y | Y (`记下这次判断`) | N/A | N/A | N | N | **PASS** | |

### Scene 05

| Shot | 1 | 2 | 3 | 4 | 5 | 6 | 7 | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|
| observe | Y | Y | Y (`记下看到的`) | N/A | Y | N | N | **PASS** | |
| predict | Y | Y | Y (`记下预测`) | N/A | Y | N | N | **PASS** | |
| experiment | Y | Y | Y (`记下预测` / `动手看结果`) | N/A | N/A | N | N | **PASS** | |
| model | Y | Y | Y (`记下关系`) | N/A | Y | N | N | **PASS** | Per-group legends; dual hints = I08 |
| transfer | Y | Y | Y (`记下迁移`) | N/A | Y | N | N | **PASS** | |
| exam | Y | Y | Y (`下一步：选用到的关系`) | N/A | Y | N | N | **PASS** | Better CTA than 02/03/04 |
| ai-off | Y | Y | Y (`先记下判断和理由`) | N/A | N/A | N | N | **PASS** | |

Blocked-reason (Q4) was not exercised on the baseline shots (empty/wrong submit). Scene 04 MODEL missing/incorrect feedback is covered by `C-04M` / `C-FB`, not by the baseline PNG.

---

## D. New P0/P1 issues

**None discovered in this evidence pass.**

Already-known, not new, not fixed here:

| ID | Sev | What | Action |
|---|---|---|---|
| I08 | P1 | Tutor + hint-ladder coexistence | Report only (U9). See section F |
| — | P2 | Scene 02 / 03 / 04 EXAM first-step CTA `继续` (UI-03 avoid list). Scene 01 / 05 already use an explicit next-step label | Do **not** auto-fix in this task |

No newly discovered P0/P1 UI-contract bug with Evidence impact = NONE. No code change in this pass.

---

## E. Scene 04 feedback wording

Student response under review: **「因为是同一种物质，所以密度不变」**  
Mapped draft value: `cutWhy === "same-material-alone"`  
Evaluator failure kind (unchanged): `same-material-without-proportion`

Visible student copy (`lib/learning/samples-model.ts`):

> “同一种物质”还不够。要看出切开后质量和体积按同样比例变，比值才不变。

| Reading | Verdict |
|---|---|
| A. The physics statement is false | **No** |
| B. The statement is insufficient evidence for the required mass–volume proportional relation | **Yes** |

**Wording verdict: B.**  
Desired semantics match the current MODEL claim. **No copy repair.** Evaluator not touched.

---

## F. U9 evidence trace

Two student-facing hint paths coexist after D052 (copy only on Tutor; write paths unchanged).

### Path 1 — Tutor panel / 「给我一点提示」

```text
TutorPanel click
  → useTutor.askTutor
  → /api/tutor (blocked if !canCallTutor or isTutorHardBlocked)
  → recordTutorInteraction
       aiInteractions[] += { stage, action, message }
       events += type "ai_interaction" { action }
  → Labs hide TutorPanel when !tutor.allowed || isAiOff || isComplete
```

`isTutorHardBlocked` includes AI_OFF / COMPLETE. No API call, no history write, on those stages.

### Path 2 — Stage hint ladder / 「再看一步提示」

```text
revealHint (Scene hooks, e.g. useSamplesLearningSession)
  → allowed only on EXPLAIN / MODEL / TRANSFER / EXAM
  → events += type "ai_interaction" { source: "hint-ladder", hintId }
  → does NOT append aiInteractions[]
```

### Into evidence

```text
aiInteractions / events
  → *TutorUsedDuringIndependent
       true only if independentAssessment.llmUsed === true
       OR aiInteractions.stage ∈ {AI_OFF, COMPLETE}
       OR events type ai_interaction with stage ∈ {AI_OFF, COMPLETE}
  → accumulate*SceneEvidence.tutorUsed / llmDisabled
  → deriveModelEvidenceLevel
       L4 = constructedValidCausalModel (MODEL evaluator)
       L5 = L4 + successfulTransfer
       L6 = L5 + independentAiOffSuccess + llmDisabledDuringIndependent
```

Same `*TutorUsedDuringIndependent` shape on Scenes 01–05 (`microwave-ai-off`, `engine-ai-off`, `cart-ai-off`, `samples-ai-off`, `heat-ai-off`).

### Answers

1. **Does either path alter evidence provenance?**  
   They write different records (Tutor: `aiInteractions` + event; ladder: event only, `source: "hint-ladder"`). Provenance **fields and consumers are unchanged** by the D052 UI copy. Pre-AI_OFF writes do not enter `*TutorUsedDuringIndependent`.

2. **Can either path produce L4 / L5 directly?**  
   **No.** L4 / L5 come only from MODEL / TRANSFER evaluator flags. Hint / Tutor writes do not set `constructedValidCausalModel` or `successfulTransfer`.

3. **Can use before AI_OFF invalidate or alter L6 eligibility?**  
   **No.** L6 `tutorUsed` looks only at AI_OFF / COMPLETE (or `independentAssessment.llmUsed`). Pre-AI_OFF Tutor or ladder use does not set that flag.

4. **Does AI_OFF remain technically and evidentially independent?**  
   **Yes.** Tutor API is hard-blocked; Tutor chrome is hidden; ladder is not offered on AI_OFF; L6 still requires accepted independent challenges + `llmUsed === false` + no AI_OFF/COMPLETE tutor provenance.

5. **Did this UI change alter any of those semantics?**  
   **No.** D052 changed Tutor title/CTA copy and Scene 04 visible questions / feedback presentation. It did not change `recordTutorInteraction`, `revealHint` writes, accumulators, or `deriveModelEvidenceLevel`.

---

## G. U9 final verdict

**NO_EVIDENCE_REGRESSION** — historical POST remains valid.

I08 stays report-only / POSSIBLE. Dual controls were not merged.

---

## H. Formal POST rerun

**NO.**

---

## I. Tests run (this evidence pass)

| Command | Result |
|---|---|
| `npx playwright test tests/e2e/student-ui-screenshots.spec.ts` | 5/5 — generated the 35 baseline PNGs |
| `npx vitest run tests/components/samples-ratio-board-ui-contract.test.tsx tests/components/tutor-affordance.test.tsx tests/learning/student-ui-feedback.test.ts` | 3 files / 9 tests passed |

Do not treat total Vitest / Playwright counts as this table.

---

## J. Confirmations

```text
Physics Model semantics changed: NO
UPLP semantics changed: NO
Evaluator semantics changed: NO
L1-L6 semantics changed: NO
Historical PRE/POST rewritten: NO
metadata.status changed: NO
```
