# Scene 02 — AI Guardrails

> Scene-specific tutor constraints  
> Primary model: `chemical-energy-internal-energy-mechanical-energy`

Universal semantics are owned by UPLP. Stage-allowed actions are owned by `STAGE_TUTOR_POLICY`. Model copy lives in `tutor-policy.ts`.

This file only adds **Scene 02** constraints. It does not redefine H1–H5.

---

## 1. Universal references

- Stages, hint ladder, AI_OFF: [`../../universal-physics-learning-protocol.md`](../../universal-physics-learning-protocol.md)
- Allowed actions: `lib/learning/stage-policy.ts`
- Model leakage rules and H1–H5 prompts: `content/physics-models/chemical-energy-internal-energy-mechanical-energy/tutor-policy.ts`

If this file conflicts with UPLP, UPLP wins.

---

## 2. Per-stage Scene behavior

| Stage | Allowed (UPLP) | Scene must | Scene must not |
|---|---|---|---|
| ENTRY | none | Open with a question | Display 化学能 → 内能 → 机械能 |
| OBSERVE | ASK, ENCOURAGE | Ask what changed, when | Inject full energy vocabulary; name all four strokes as the goal |
| DESCRIBE | ASK, HINT, ENCOURAGE | Focus on piston, valves, combustion event, which step seems to push | Require textbook names; complete the energy chain |
| PREDICT | ASK, HINT, CHALLENGE | Keep the student authoring prediction + reason | Reveal experiment A/B results |
| EXPERIMENT | none | Application owns `EngineState` | LLM deciding stroke, valves, combustion, output |
| EXPLAIN | ASK, HINT, CHALLENGE, ENCOURAGE, EXPLAIN | Progressive H1–H5 | Dump the complete causal chain as the student's answer |
| MODEL | ASK, HINT, CHALLENGE | Point at a missing link | Place nodes/relations for the student |
| TRANSFER | ASK, HINT, CHALLENGE | Wait for an attempt | Say “这和刚才是同一条能量链” first |
| EXAM | ASK, HINT, CHALLENGE, EXPLAIN | Preserve Exam World sequence | Skip to four choices; grade by LLM as official score |
| AI_OFF | **no call** | Hide tutor; `llmUsed = false` | Hidden clues from earlier hints; LLM grading |
| COMPLETE | none | Evidence-oriented reflection | “你已经完全掌握内燃机” |

EXPLAIN action, when UPLP allows it, must stay short (`maxExplanationLength` on the model policy) and come **after** student speech.

---

## 3. Physics the tutor must never assert

Reject / fall back if the tutor output claims:

- 燃烧直接推动曲轴 / 燃烧直接变成转动;
- 气体内能增加后压强永远增加;
- 全部化学能最终都变成了机械能;
- 做功冲程制造/产生了能量;
- 四个冲程都会把内能变成机械能;
- 压缩冲程就是对外输出机械能的主要过程;
- 只要温度升高就一定输出机械能;
- 记住四个冲程名字就等于理解了模型.

These match model misconceptions `ceime-M1`–`ceime-M6`. They are not new architecture.

On PREDICT / EXPERIMENT, also reject any output that states the deterministic result before or instead of the physics engine, for example:

- “关掉燃烧以后，曲轴一定完全停住” as an LLM-invented kinematic claim;
- “卡住活塞以后，燃烧也不会发生”.

The application already knows: Experiment A skips combustion-driven output; Experiment B may still combust.

---

## 4. Answer-leakage rejection

Treat as leakage (reject, use safe fallback, keep the task alive):

1. Complete chain given as the student answer:

   `化学能 → 内能 → 做功 → 机械能`

2. MODEL graph narrated node-by-node for the student to copy.

3. TRANSFER: naming the shared model before an attempt.

4. EXAM: revealing `correctAnswer` from `examPatterns`.

5. PREDICT: stating `mainOutputOccurred` for the upcoming run.

Fallback copy (student-facing, Grade 9):

> 这一步还是请你先自己想。我只能问你看到了什么。

Never expose provider errors.

---

## 5. Protected student actions

The tutor must not perform the student's current cognitive action:

| Stage | Student must do | Tutor must not do |
|---|---|---|
| PREDICT | Author prediction + reason | Give the result |
| EXPERIMENT | Intervene and compare | Invent `EngineState` |
| EXPLAIN | Write a causal attempt | Replace it with the official chain |
| MODEL | Build the chain | Auto-complete the graph |
| TRANSFER | Notice what transfers | Announce the shared model |
| EXAM | Represent, choose model, answer, reason | Collapse to click-the-key |
| AI_OFF | Reconstruct independently | Exist |

---

## 6. AI_OFF hard boundary

When the application enters `AI_OFF`:

- do not call the tutor API;
- hide tutor controls;
- do not show prior hints as hidden clues;
- do not automatically grade with an LLM.

Enforcement is application-level (`canCallTutor` / `isTutorHardBlocked`). Scene UI must not add a hidden “问一句”.

---

## 7. Malformed tutor output

If Zod validation fails:

- reject the payload;
- show the safe fallback;
- do not change `EngineState`;
- do not advance the stage;
- do not write MODEL nodes.

AI failure must not break the learning path. The engine visualization and experiment controls remain usable.
