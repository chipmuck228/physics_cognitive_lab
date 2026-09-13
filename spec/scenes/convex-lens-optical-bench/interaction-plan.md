# Scene 07 Interaction Plan

> Date: 2026-09-13  
> Scene id: `convex-lens-optical-bench`  
> Primary model id: `convex-lens-imaging`  
> Reference Interaction Plan version: v1  
> First reference consumer of Learner Interaction Runtime / State contracts  
> Not a universal runtime. Not learner-validated.

Do not reopen: UPLP stage meanings, official physics, evaluators / L-claim design, AI_OFF evidence rules, Scene DSL freeze, Interaction Shell freeze.

Do not paste Physics Truth or evaluator predicates here.

---

## Cross-cutting

| Contract state | Scene 07 storage |
|---|---|
| Progress | `session.stage` |
| Draft | `sceneData.*Draft` / `observeDraft` / `experimentFormDraft` |
| View | `sceneData.viewingStage` |
| Review | `sceneData.reviewPhysics` |
| Evidence | existing arrays; evaluators unchanged |
| Physics | `session.physicsState` |

Help: one entry (`LensHelpPanel`). TutorPanel stays hidden. AI_OFF / COMPLETE / ENTRY: no help.

Hydrate drafts only when `sessionId`, Progress stage, `viewingStage`, experiment id, or committed counts change — never on help or preview writes.

Shell adoption: no. Bench + ray construction need Scene-owned tasks.

---

### Stage: ENTRY

Cognitive objective  
  Start the phenomenon, not the imaging table.

Context  
  光具座上，物体和光屏都可以移动。

Goal  
  开始看这个装置，先不要背五种情况。

Focus  
  物体可以换位置，光屏也可以左右移。

Visible capabilities  
  - start-lesson (working-path)

Visible references  
  none on the landing page

Student action  
  开始观察

Response type  
  advanced

Draft ownership  
  none

Evaluator  
  none

Feedback mapping  
  none

Help intents  
  none

Revisit behavior  
  N/A

Cognitive trace output  
  none yet

Progression rule  
  `startLesson` → OBSERVE via existing advance

Protected answer / leak boundary  
  Do not list official imaging cases.

---

### Stage: OBSERVE

Cognitive objective  
  Manipulate the bench, attend to what changes, record what was actually seen.

Context  
  光具座上，物体可以换位置，光屏也可以左右移。

Goal  
  先看见变化，不解释五种成像。

Focus  
  先看光屏上有没有变化，再看透过透镜能不能看见像。

Visible capabilities  
  - change-object-station (working-path; review-preview)  
  - move-screen (working-path; review-preview)  
  - record-observation (working-path; hidden-in-review)  
  - request-help (working-path; hidden-in-review)

Visible references  
  object, lens, screen, f-marks, visible-image-state

Student action  
  先动手，再勾选确实看见的。

Response type  
  applied (demo / screen) · committed / missing / advanced (submit) · review-applied (preview manipulate)

Draft ownership  
  persisted-key `observeDraft`  
  Hydrate when progress / committed observation count changes — never on help.

Evaluator  
  `evaluateLensObservation`

Feedback mapping  
  insufficient selection → missing  
  (required IDs unchanged; do not tell the student every visible option is required)

Help intents  
  what-now, where-look  
  Illegal: how-rays, how-meeting, how-image (rays are not a visible reference)

Revisit behavior  
  Preview physics allowed for object station and screen. Recording / submit hidden. Preview discarded on return.

Cognitive trace output  
  我的观察 (learner-owned selected labels)

Progression rule  
  sufficient observation → existing `advanceIfReady`

Protected answer / leak boundary  
  Do not say which three options are required. Do not name official image cases or ray paths.

---

### Stage: DESCRIBE

Cognitive objective  
  Separate object, lens, F/2F, image, and screen in student language.

Context  
  你刚在光具座上动过物体或光屏。

Goal  
  把装置上的几样东西分开说清楚。

Focus  
  对着图，把物体、透镜、F / 2F、像和光屏分开指认。

Visible capabilities  
  - author-description (working-path; hidden-in-review)  
  - request-help (working-path)

Visible references  
  object, lens, screen, f-marks, visible-image-state

Student action  
  回答三个装置问题，再用自己的话写一句。

Response type  
  committed / missing / advanced

Draft ownership  
  persisted-key `describeDraft`

Evaluator  
  `evaluateLensDescription`

Feedback mapping  
  missing structure → missing

Help intents  
  what-now, how-distinguish, how-say

Revisit behavior  
  Inspect last description. No commit. No preview physics required.

Cognitive trace output  
  我的说法

Progression rule  
  sufficient description → existing advance

Protected answer / leak boundary  
  Do not supply the finished sentence. Do not collapse image into screen.

---

### Stage: PREDICT

Cognitive objective  
  Commit an outcome and reason before the intervention.

Context  
  动手之前，先留下你的猜测。

Goal  
  先猜物体换位置以后会看见什么。

Focus  
  想的是物体相对 F / 2F 换了位置以后，像或光屏会怎样。

Visible capabilities  
  - commit-prediction (working-path; locked after commit)  
  - request-help (working-path)

Visible references  
  object, lens, screen, f-marks, visible-image-state

Student action  
  选出预计结果，写理由，锁定。

Response type  
  committed / missing / advanced

Draft ownership  
  persisted-key `predictDraft`

Evaluator  
  `evaluateLensPrediction`

Feedback mapping  
  empty outcome or reason → missing

Help intents  
  what-now, what-compare, how-reason

Revisit behavior  
  Show locked prediction. No re-commit.

Cognitive trace output  
  我的预测

Progression rule  
  first committed prediction for experiment A → existing advance

Protected answer / leak boundary  
  Do not reveal the official outcome.

---

### Stage: EXPERIMENT

Cognitive objective  
  Run the five-part loop: predict → do → see → compare → think.

Context  
  你已经有一个锁定的预测。

Goal  
  用一次真实改变，对照你刚才的猜测。

Focus  
  看清楚这次改的是物体位置、光屏，还是透镜被遮住。

Visible capabilities  
  - commit-prediction (later experiments only; working-path)  
  - run-intervention (working-path; hidden-in-review)  
  - record-observed-result (working-path; hidden-in-review)  
  - compare-outcome (working-path; hidden-in-review)  
  - author-reflection (working-path; hidden-in-review)  
  - request-help (working-path)

Visible references  
  object, lens, screen, f-marks, visible-image-state, committed-prediction

Student action  
  按 预测 → 动手 → 看见 → 对照 → 想法 走完这一轮。

Response type  
  applied / committed / missing / advanced  
  empty reflection must surface missing, not silent no-op

Draft ownership  
  persisted-key `experimentFormDraft`  
  Hydrate when experiment id or evidence count changes.

Evaluator  
  experiment closure / `hasClosedLensExperiment` (existing)

Feedback mapping  
  incomplete observed result → missing  
  empty reflection → missing

Help intents  
  what-now, where-look, what-compare

Revisit behavior  
  Inspect last closed loop. Run / save hidden. Preview physics not required for this stage’s forms.

Cognitive trace output  
  实验结果 (learner reflection / comparison, not official snapshot)

Progression rule  
  existing experiment completion → EXPLAIN

Protected answer / leak boundary  
  Do not rewrite the official result as the student’s observation.

---

### Stage: EXPLAIN

Cognitive objective  
  Author whether rays actually meet or only their backward extensions meet.

Context  
  你已经看见过几种不同的光屏结果。

Goal  
  用自己的话说明光线怎样相遇。

Focus  
  先问光线是真的相交，还是只有延长线相交。

Visible capabilities  
  - author-explanation (working-path; hidden-in-review)  
  - request-help (working-path)

Visible references  
  rendered: object, lens, screen, f-marks, visible-image-state  
  textual: ray, meeting-point (question language only)  
  constructed: none — official rays stay hidden; do not draw them to satisfy Help

Student action  
  选会聚碎片，再写一段说明。

Response type  
  committed / missing / advanced

Draft ownership  
  persisted-key `explainDraft`

Evaluator  
  `evaluateLensExplanation`

Feedback mapping  
  missing fragments / text → missing

Help intents  
  what-now, how-meeting (textual ladder), how-say  
  Must not say “先看两条光线” — no rays are rendered.

Revisit behavior  
  Inspect last explanation. No commit.

Cognitive trace output  
  我的解释

Progression rule  
  sufficient explanation → existing advance

Protected answer / leak boundary  
  No complete official explanation. No imaging table.

---

### Stage: MODEL

Grammar (by reference only): student-constructed spatial rays. One evaluator on final submit: `evaluateConvexLensModelConstruction`.

Cognitive objective  
  Assemble object station, two required rays, meeting mode, image consequence, and an authored bind.

Context  
  现在要把物距、光线和像收成一条自己建构的关系。

Goal  
  自己组装光线关系，不要点一张标准图。

Focus  
  一次只做眼前这一步。

Visible capabilities (stage)  
  - construct-relation (working-path; hidden-in-review)  
  - request-help (working-path)

Shared visible references  
  object, lens, f-marks

Student action  
  Progressive disclose seven steps; submit once.

Response type  
  applied (step advance) · missing / rejected / committed / advanced (submit)

Draft ownership  
  persisted-key `modelDraft`  
  Hydrate when modelAttempts count changes — never on help.

Evaluator  
  `evaluateConvexLensModelConstruction` via `buildLensModelAttempt`

Feedback mapping  
  missing labels → missing  
  image-conflicts-meeting-mode / meeting-mode-conflicts-station / geometrically-incoherent-rays / station-impossible-ray → inconsistent  
  table-row-only / properties-without-relation / authored-missing-meeting-bind / u-equals-f-as-ordinary-image / recognized-finished-diagram / copied-visible-diagram → think_again

Help intents  
  filtered by substep + VisibleInteractionContext (below)

Revisit behavior  
  Inspect construction; submit hidden. No authoritative physics write.

Cognitive trace output  
  我的模型 (learner-owned bind sentence, not L4)

Progression rule  
  existing MODEL completion / `hasCompletedLensModel`

Protected answer / leak boundary  
  Do not show a finished official diagram to click. Do not print the official case table.

#### MODEL substeps

| Step | Focus | Extra capabilities | Extra references | Help intents |
|---|---|---|---|---|
| 1 station | 物体相对 F / 2F | construct-relation | rendered bench marks | what-now |
| 2 ray A | 第一条必做光线 | construct-relation | ray textual (editor); constructed only if that ray is drawn | what-now, how-rays |
| 3 ray B | 第二条必做光线 | construct-relation | same | what-now, how-rays |
| 4 meeting | 光线怎样相遇 | construct-relation | look-at meeting only if ≥2 student rays are on the bench | how-meeting |
| 5 image | 像会怎样 | construct-relation | look-at rays only if student rays are on the bench | how-image |
| 6 bind | 用一句话连起来 | author-text | textual / constructed as actually shown | how-say |
| 7 review | 检查后再提交 | construct-relation | constructed rays if present | what-now |

Official image overlay stays off during MODEL. Official rays stay hidden. Student rays appear only after the learner has assembled them. Look-at help requires those constructed rays.

---

### Stage: TRANSFER

Cognitive objective  
  Establish the new situation, then apply the same meeting→image structure.

Context  
  器材换了，但还是一块凸透镜。

Goal  
  先看新情境，再用刚才的会聚结构说明。

Focus  
  先看这个新情境里，物体相对焦点在哪里。

Visible capabilities  
  - apply-transfer (working-path; hidden-in-review)  
  - request-help (working-path)

Visible references  
  textual: new-situation, ray, meeting-point, image-consequence  
  rendered/constructed: none — no optical bench on TRANSFER

Student action  
  选出物距 / 会聚 / 像的后果，再写理由。

Response type  
  committed / missing / rejected / advanced

Draft ownership  
  persisted-key `transferDraft`

Evaluator  
  existing transfer builders / `wrong-target-structure` / `surface-convex-lens-slogan`

Feedback mapping  
  surface slogan → think_again  
  wrong-target-structure → inconsistent  
  incomplete → missing / think_again

Help intents  
  what-now, how-image (textual ladder), how-say  
  Must not say “看这些光线” — no rays render.

Revisit behavior  
  Inspect last attempt. No commit.

Cognitive trace output  
  新情境

Progression rule  
  existing required targets complete → EXAM

Protected answer / leak boundary  
  Do not hint “都有凸透镜所以一样”. Do not list official target structure as the hint.

---

### Stage: EXAM

Cognitive objective  
  Exam World: 题干 → 考什么 → 表征 → 模型 → 作答.

Context  
  现在先不看光具座，只看题目。

Goal  
  先判断这题在考什么，再选用关系。

Focus  
  先读题干，选项最后才出现。

Visible capabilities  
  - answer-exam (working-path)  
  - request-help (working-path; LensHelpPanel only — no second exam hint ladder)

Visible references  
  exam-stem

Student action  
  表征 → 模型 → 选项 + 理由

Response type  
  applied (step) · committed / missing / rejected / advanced

Draft ownership  
  persisted-key `examDraft`

Evaluator  
  `buildLensExamAttempt` / `canCommitLensExamAttempt`

Feedback mapping  
  missing steps → missing

Help intents  
  what-now, how-reason  
  No “给我一个台阶” second entry.

Revisit behavior  
  Inspect last item. No commit.

Cognitive trace output  
  考试 (learner reasoning only; no correctness badge as mastery)

Progression rule  
  `hasCompletedLensExam` → AI_OFF

Protected answer / leak boundary  
  Options stay hidden until the plan’s reveal step. Do not leak the official choice in help.

---

### Stage: AI_OFF

Cognitive objective  
  Independent judgment with zero help.

Context  
  没有提示。自己用刚才的会聚结构说明。

Goal  
  独立判断，不回看提示。

Focus  
  眼前这一题的物距和会聚。

Visible capabilities  
  - independent-commit (working-path)

Visible references  
  challenge stem only (not help-mentionable)

Student action  
  提交判断，再做对照。

Response type  
  committed / missing / advanced

Draft ownership  
  persisted-key `aiOffDraft`

Evaluator  
  `canCommitLensAiOffResponse` / `applyLensAiOffPostCheck` / `hasCompletedLensAiOff`

Feedback mapping  
  existing AI_OFF module — named only

Help intents  
  none. No Tutor. No leftover hints. No `/api/tutor`.

Revisit behavior  
  Do not open help. Review of earlier stages still has no help.

Cognitive trace output  
  独立

Progression rule  
  `hasCompletedLensAiOff` → COMPLETE

Protected answer / leak boundary  
  No help text of any kind.

---

### Stage: COMPLETE

Cognitive objective  
  Stop. Look back at learner-owned traces. No mastery claim.

Context  
  这条光具座先到这里。

Goal  
  看见自己留下的思考痕迹。

Focus  
  这些不是“已经学会了”。

Visible capabilities  
  none (start-over is chrome)

Visible references  
  none for help

Student action  
  阅读小结

Response type  
  none

Draft ownership  
  none

Evaluator  
  none

Feedback mapping  
  none

Help intents  
  none

Revisit behavior  
  N/A

Cognitive trace output  
  terminal lookback (existing complete view)

Progression rule  
  terminal

Protected answer / leak boundary  
  No “掌握了 / 提高成绩”.

---

## Cross-cutting checks

- [x] Progress and View are named separately.  
- [x] No enabled control is a silent no-op.  
- [x] One help entry, bound to VisibleInteractionContext.  
- [x] Draft hydrate will not run on help/preview writes.  
- [x] Feedback kinds come from deterministic gates.  
- [x] PRI-sensitive numbers are not redescribed here.  
- [x] No new Scene DSL fields.  
- [x] No UniversalModelBoard.  
- [x] Leak boundary reviewed against UPLP stage permissions.
