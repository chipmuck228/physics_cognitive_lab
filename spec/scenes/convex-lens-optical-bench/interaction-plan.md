# Scene 07 Interaction Plan

> Date: 2026-09-13  
> Scene id: `convex-lens-optical-bench`  
> Primary model id: `convex-lens-imaging`  
> Reference Interaction Plan version: v1  
> First reference consumer of Learner Interaction Runtime / State contracts  
> Not a universal runtime. Not learner-validated.

LearnerWorkspace layout pilot (D068): ENTRY → EXPERIMENT uses World / Task / Support
slots. Later stages keep the existing shell split. The layout does not own physics,
evaluators, or progression.

Do not reopen: UPLP stage meanings, official physics, evaluators / L-claim design, AI_OFF evidence rules, Scene DSL freeze, Interaction Shell freeze.

Do not paste Physics Truth or evaluator predicates here.

Surface audit (Scene-local, not an owner): `model-aligned-surface-audit.md`.

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

Authoritative action results: student action → Scene-owned `LensActionResult` → presentation. React must not re-evaluate OBSERVE / DESCRIBE / EXPLAIN / MODEL / TRANSFER / EXAM / AI_OFF submits.

---

### Stage: ENTRY

Cognitive objective  
  Start the phenomenon, not the imaging table.

Student question  
  要不要先看这个光具座？

Expected response shape  
  start the lesson

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

Surface justification  
  Landing copy only starts the phenomenon. No bench, rays, or table belong before the first look.

Protected future structure  
  Official imaging cases, rays, MODEL editor, exam options.

Student action  
  开始观察

Primary CTA meaning  
  Enter OBSERVE. No evidence write.

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

Student question  
  动过之后，你确实看见了什么？

Expected response shape  
  select observed states (not every visible option is required)

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

Surface justification  
  Bench manipulate is the phenomenon. Checklist records what was seen. F / 2F marks belong so later DESCRIBE can name them. Rays do not belong: this is attend-and-record, not construction.

Protected future structure  
  Official rays, meeting marks, imaging table, MODEL editor.

Student action  
  先动手，再勾选确实看见的。

Primary CTA meaning  
  Scene action evaluates the selection, writes observation evidence, and may advance.

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

Student question  
  物体、透镜、F / 2F、像和光屏是不是同一件东西？刚才动的是哪一样？

Expected response shape  
  object + quantity set + change + own sentence

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

Surface justification  
  The same bench the learner just moved is the referent for the three questions and the sentence. Structured picks force separation; the sentence is student-owned. Rays and a finished table do not belong.

Protected future structure  
  Official rays, meeting language as the task, imaging table, MODEL editor.

Student action  
  回答三个装置问题，再用自己的话写一句。

Primary CTA meaning  
  One Scene action evaluates, writes description evidence, and may advance. Presentation does not evaluate again.

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

Student question  
  物体换位置以后，你预计会看见什么？

Expected response shape  
  choose one predicted state + own-words reason

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

Surface justification  
  Bench is the situation being guessed about. Outcome choices + reason are the commit. Official result and experiment comparison do not belong yet.

Protected future structure  
  Official outcome, experiment comparison chrome, rays.

Student action  
  选出一个可能发生的情况。理由可以是“我还不知道为什么”或“我只是先猜的”；有想法时才写一句。现在不用答对。

Primary CTA meaning  
  Scene action evaluates sufficiency, writes the committed prediction, and may advance from PREDICT.

Response type  
  committed / missing / advanced

Draft ownership  
  persisted-key `predictDraft`

Evaluator  
  `evaluateLensPrediction`  
  Honest no-reason labels (`我还不知道为什么` / `我只是先猜的`) are sufficient with an outcome. They are not causal evidence and do not weaken later EXPLAIN / MODEL.

Feedback mapping  
  empty outcome → missing  
  has-idea without authored sentence → missing  
  honest unknown / guess-only → may commit

Help intents  
  what-now, what-compare, how-reason

Revisit behavior  
  Show committed prediction. No re-commit.

Cognitive trace output  
  我的预测

Progression rule  
  first committed prediction for experiment A → existing advance  
  A wrong prediction remains a valid learning state.

Protected answer / leak boundary  
  Do not reveal the official outcome.

---

### Stage: EXPERIMENT

Cognitive objective  
  Run the five-part loop: predict → do → see → compare → think.

Student question  
  这一次改了什么？看见的和刚才猜的一样吗？

Expected response shape  
  do → record observed pair → choose comparison → own-words reflection

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

Surface justification  
  Bench is the intervention. Committed prediction must stay visible for compare. Observed / comparison / reflection are the five-part loop. Rays still do not belong: this is evidence of what happened, not construction.

Protected future structure  
  Official rewritten observation, EXPLAIN meeting options as the task, MODEL editor.

Student action  
  按 预测 → 动手 → 看见 → 对照 → 想法 走完这一轮。

Primary CTA meaning  
  Each loop control is a Scene action: run writes physics; observed / comparison / reflection write evidence; last close may advance. Enabled “记下这次想法” never silent-no-ops.

Response type  
  applied / committed / missing / blocked / advanced

Draft ownership  
  persisted-key `experimentFormDraft`  
  Hydrate when experiment id or evidence count changes.  
  Reflection submit reads the same visible form (observed + comparison + reflection).

Evaluator  
  experiment closure / `hasClosedLensExperiment` (existing)

Feedback mapping  
  incomplete observed result → missing  
  empty / non-own-words reflection → missing  
  visible form missing observed or comparison → missing  
  already-closed trial → disabled + blocked reason  
  review → save hidden; fields disabled

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
  Author whether rays actually meet or only their backward extensions meet, as an account of already-seen screen results.

Student question  
  你已经看见过：有的位置光屏能接到像，有的位置接不到。该用真正相交、反向延长，还是有限远处不相交来说明这些结果？

Expected response shape  
  select meeting fragment + select screen / image fragment + own words  
  (not a table slogan)

Context  
  你已经看见过几种不同的光屏结果：有的位置屏接得到，有的接不到。

Goal  
  用自己的话说明：这些结果该用真正相交、反向延长，还是有限远处不相交来解释。

Focus  
  先对着已经看见的光屏结果想，不要去找还没画出来的光线。

Visible capabilities  
  - author-explanation (working-path; hidden-in-review)  
  - request-help (working-path)

Visible references  
  rendered: object, lens, screen, f-marks, visible-image-state  
  textual: ray, meeting-point (question language only)  
  constructed: none — official rays stay hidden; do not draw them to satisfy Help

Surface justification  
  Bench remains as memory of screen receive / not-receive. Meeting and screen/image radios are the L3 fragments. The sentence is student-owned. Official rays stay off because this is a fragment account, not L4 construction.

Protected future structure  
  Official rays, student ray editor, finished diagram, imaging table, MODEL bind as a construction.

Student action  
  选会聚碎片，再写一段说明。

Primary CTA meaning  
  One Scene action evaluates, writes explanation evidence, and may advance. Presentation does not evaluate again.

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

Boundary decision  
  A — current EXPLAIN is justified; scaffolding only. L3 fragment ≠ L4 construction. Do not move ray assembly here. Changing that boundary needs architecture / pedagogy review.

---

### Stage: MODEL

Grammar (by reference only): student-constructed spatial rays. One evaluator on final submit: `evaluateConvexLensModelConstruction`.

Cognitive objective  
  Assemble object station, two required rays, meeting mode, image consequence, and an authored bind.

Student question  
  物距、两条光线、相遇方式和像，怎样收成一条你自己装的关系？

Expected response shape  
  construct one relation (station + two rays + meeting + image + own-words bind)

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

Surface justification  
  Construction editor is the L4 grammar. Official image overlay stays off so the learner cannot click a finished diagram. Student rays appear only after the learner assembles them.

Protected future structure  
  Official finished diagram, official case table, official rays, TRANSFER new-situation form.

Student action  
  Progressive disclose seven steps; submit once.

Primary CTA meaning  
  Step continue only writes Draft. Submit is one Scene action: `buildLensModelAttempt` owns acceptance. Missing labels may yield `missing`. Complete-but-not-accepted is `rejected`, never `committed`.

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

##### MODEL 1 — station

Student question  
  物体相对 F / 2F 在哪里？

Expected response shape  
  choose one station

Surface justification  
  Bench marks are the F / 2F referent. No rays yet.

Protected future structure  
  Ray editor result as a look-at object; official image overlay.

Primary CTA meaning  
  Save station into Draft and open the next step.

##### MODEL 2 — ray A

Student question  
  第一条必做光线到达透镜前、过透镜后怎么走？

Expected response shape  
  construct one ray (kind + before + after + incident)

Surface justification  
  Ray editor is the first construction act. A look-at ray exists only after this ray is drawn.

Protected future structure  
  Second required ray, official rays, finished diagram.

Primary CTA meaning  
  Save ray A into Draft and open the next step.

##### MODEL 3 — ray B

Student question  
  第二条必做光线怎么走？

Expected response shape  
  construct a second different required ray

Surface justification  
  Two required rays are the L4 pair. Optional focal ray must not replace them.

Protected future structure  
  Official third-ray diagram; meeting mark before the learner names it.

Primary CTA meaning  
  Save ray B into Draft and open the next step.

##### MODEL 4 — meeting

Student question  
  这两条你装的光线是真正相交、反向延长，还是有限远处不相交？

Expected response shape  
  choose one meeting mode

Surface justification  
  Meeting is named from the learner’s own two rays, not from an official overlay.

Protected future structure  
  Official meeting mark; image table row.

Primary CTA meaning  
  Save meeting mode into Draft and open the next step.

##### MODEL 5 — image

Student question  
  这样相遇以后，像在哪一侧、是什么性质、屏能不能接到？

Expected response shape  
  select side / nature / orientation / size / receivable

Surface justification  
  Image pickers bind consequence to the meeting just named. Official image overlay stays off.

Protected future structure  
  Official image drawn on the bench; TRANSFER targets.

Primary CTA meaning  
  Save image fields into Draft and open the next step.

##### MODEL 6 — bind

Student question  
  为什么这种会聚方式会带来这样的像？

Expected response shape  
  when meeting changes, image consequence follows (own sentence)

Surface justification  
  Authored bind is the L4 student sentence. Table-row slogans are not enough.

Protected future structure  
  Official bind sentence; TRANSFER / EXAM stems.

Primary CTA meaning  
  Save the sentence into Draft and open review.

##### MODEL 7 — review + submit

Student question  
  这一条自己装的关系能不能交出去？

Expected response shape  
  submit the constructed relation

Surface justification  
  Review shows the learner’s own construction. Submit is the only acceptance action.

Protected future structure  
  TRANSFER new-situation form; exam options.

Primary CTA meaning  
  `buildLensModelAttempt` writes the attempt. Incomplete → missing. Complete but not accepted → rejected. Accepted → committed and maybe advance.

---

### Stage: TRANSFER

Cognitive objective  
  Establish the new situation, then apply the same meeting→image structure.

Student question  
  这个新情境里，物体相对焦点在哪里？会聚和像怎样跟着变？

Expected response shape  
  select station + meeting + image + own words  
  (not “都有凸透镜”)

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

Surface justification  
  New-situation text establishes the target before application. Structured picks + reason reuse the MODEL relation. The bench would invite copying the last construction instead of reading the new surface.

Protected future structure  
  Official target structure as a hint; exam options; AI_OFF stems.

Student action  
  选出物距 / 会聚 / 像的后果，再写理由。

Primary CTA meaning  
  One Scene action: incomplete → missing; `accepted` → committed / maybe advance; otherwise rejected. Presentation does not assume committed.

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

Student question  
  这题在考哪一段成像关系？你选哪一个答案？

Expected response shape  
  representation + model recognition + choice + own-words reason

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

Surface justification  
  Stem first is Exam World. Representation / model steps delay options. The bench would turn the item into a construction copy.

Protected future structure  
  Options until the reveal step; AI_OFF help of any kind.

Student action  
  表征 → 模型 → 选项 + 理由

Primary CTA meaning  
  Step continue only writes Draft. Submit is one Scene action (`canCommit` + `buildLensExamAttempt`). Incomplete steps → missing. A written answer is recorded; incorrect is rejected, not presented as accepted.

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

Student question  
  没有提示时，这一题的物距和会聚该怎么判断？

Expected response shape  
  structured judgment + own-words reason; then post-check

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

Surface justification  
  Stem + independent form only. Help / Tutor / leftover hints would break AI_OFF.

Protected future structure  
  Any help chrome, Tutor, prior hint text.

Student action  
  提交判断，再做对照。

Primary CTA meaning  
  Commit and post-check are Scene actions. Incomplete → missing. Presentation does not assume committed.

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

Student question  
  你刚才留下了哪些自己的说法？

Expected response shape  
  read only

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

Surface justification  
  Learner-owned traces only. No score, no mastery badge, no Tutor.

Protected future structure  
  Mastery / score claims; a new Scene.

Student action  
  阅读小结

Primary CTA meaning  
  Terminal. Start-over resets the Scene session if used.

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
- [x] Every stage / MODEL substep names student question and expected response shape.  
- [x] Surface justification and protected future structure are named.  
- [x] Primary CTA meaning is named.  
- [x] EXPLAIN → MODEL boundary recorded as decision A (scaffold only).
