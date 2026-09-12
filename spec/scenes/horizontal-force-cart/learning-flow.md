# Scene 03 — Learning Flow

> Scene-specific mapping onto UPLP  
> Primary model: `force-changes-motion-state`

This file only says what *this Scene* shows, asks, records, and forbids.

Universal sequence (owned by UPLP, not redefined here):

```text
ENTRY → OBSERVE → DESCRIBE → PREDICT → EXPERIMENT
→ EXPLAIN → MODEL → TRANSFER → EXAM → AI_OFF → COMPLETE
```

Allowed AI actions are the UPLP / `STAGE_TUTOR_POLICY` set. Details: [`ai-guardrails.md`](./ai-guardrails.md).

Scene-specific work persists in `LearningSession.sceneData`. Official L1–L6 still come from `deriveModelEvidenceLevel`.

---

## ENTRY · 开始探索

| | |
|---|---|
| Student sees | A cart on a straight horizontal track. No caption “力能改变物体运动状态。” |
| Student can do | Start. |
| Question | 这个小车什么时候会走得更快、更慢，或者改变方向？ |
| Required action | Explicit start. |
| Evidence | Session entered this Scene. |
| Pass | Student starts. |
| AI | None. |
| Persistence | New session; initial `CartState` from the adapter. |
| Common failure | N/A at this stage. |
| Forbidden | Displaying the textbook rule. Teaching F=ma as the goal. |

---

## OBSERVE · 先观察

| | |
|---|---|
| Student sees | App-owned demo: cart starts at rest, a force arrow appears, cart starts moving and speeds up. |
| Student can do | Play, pause, replay. No experiment controls yet. |
| Question | 先不要下结论。仔细看看：小车先是怎样的？后来哪些东西变了？ |
| Required action | Watch the demo. Complete a structured observation task (correct + distractor options). |
| Evidence | Selected observation options. Replay may be recorded, but playback is not EXPERIMENT. |
| Pass | Notices a motion-state change: 开始运动 **or** 越来越快, and does not pass on “小车在画面里” alone. See [`evidence-contract.md`](./evidence-contract.md). |
| AI | ASK, ENCOURAGE. |
| Persistence | Observation record in session / `sceneData`. |
| Common failure | Treating playback as the later experiment; selecting “它有轮子” as the observation. |
| Forbidden | Injecting “力能改变物体运动状态。” Counting autoplay as EXPERIMENT. |

---

## DESCRIBE · 用物理语言描述

| | |
|---|---|
| Student sees | Cart still available. Observation kept. |
| Student can do | Structured fields, then optional own words. |
| Questions | 你看到的物体是什么？它一开始是静止还是已经在动？力的箭头朝哪边？后来是开始运动、加快、减慢，还是方向变了？ |
| Required action | Physics-language description. Structured-first. |
| Evidence | See [`evidence-contract.md`](./evidence-contract.md) DESCRIBE. |
| Pass | Object + initial motion state + force direction + observed change. Own-words text is secondary and is **not** gated on length alone. |
| AI | ASK, HINT, ENCOURAGE. |
| Persistence | Structured describe record in `sceneData`. |
| Common failure | “小车动了” with no force/motion distinction; empty structured fields with a long paragraph. |
| Forbidden | Requiring the full model. Gating only on text length. |

---

## PREDICT · 先预测

The UPLP **PREDICT** stage is the first pre-intervention prediction (Experiment A: `force-with-motion`).

During **EXPERIMENT**, Experiments B and C still need committed predictions before they run. Those are **experiment-local predictions**. They do **not** create extra UPLP PREDICT stages. Tutor permissions follow the enclosing UPLP stage, so a prediction authored inside EXPERIMENT does not get tutor help.

This does **not** change UPLP.

Use the model's experiments:

1. `force-with-motion`
2. `force-against-motion`
3. `zero-net-force-while-moving`

| | |
|---|---|
| Student sees | Cart already moving right. No result yet. Question for Experiment A. |
| Student can do | Commit an outcome + reason before the run. |
| Question | 小车已经在向右运动。如果再给它一个向右的水平力，它的运动快慢会怎样变？ |
| Required action | Explicit outcome (`sped-up` / `slowed-down` / `unchanged` / `reversed` / `unsure`) + own-word reason, committed before the matching run. |
| Evidence | Outcome, reason, `committedAt` before `interventionAt`. Wrong predictions are valid. |
| Pass | Experiment A prediction committed to leave the UPLP PREDICT stage. |
| AI | ASK, HINT, CHALLENGE on the UPLP PREDICT stage only. |
| Persistence | Prediction record in `sceneData`. |
| Common failure | Clicking run first; empty reason; tutor revealing the tick result. |
| Forbidden | Revealing the deterministic result. Grading prediction correctness. |

---

## EXPERIMENT · 动手验证

| | |
|---|---|
| Student sees | Controls to set same-direction force, opposite force, or zero net force. Deterministic result after they run. |
| Student can do | Apply one intervention, watch, compare, reflect. Then the next complementary intervention. |
| Question | 改一个条件，看看是不是和你想的一样。 |
| Required action | UPLP closure for **each** required experiment: prediction → intervention → result → comparison → reflection. |
| Evidence | All five parts. Distinct from OBSERVE autoplay. |
| Pass | All three high-information experiments completed with full five-part closure. Then the student may leave for EXPLAIN. |
| AI | None. App owns `CartState`. Experiment-local predictions for B and C are student-authored here; UPLP keeps tutor off. |
| Persistence | Closed experiment records in `sceneData`. |
| Common failure | Playback counted as intervention; missing comparison/reflection; repeating the same cut three times. |
| Forbidden | LLM-invented outcomes. Completing with missing evidence. Turning the Scene into repetitive drilling of one cut. |

Why three, not one:

| Cut | Information |
|---|---|
| A same direction | Nonzero net force can increase speed |
| B opposite direction | Force need not match motion direction; speed can decrease |
| C zero net force while moving | Zero net force ≠ must stop |

That is the smallest set with high information value. Do not add extra “push again” drills.

---

## EXPLAIN · 解释为什么

| | |
|---|---|
| Student sees | Their own three experiment outcomes. Cart optional. |
| Student can do | Structured causal choices, then own words. |
| Question | 把三次实验放在一起看：合力怎样改变运动状态？合力为零时呢？力和运动是同一件事吗？ |
| Required action | Explain the causal relation between force condition and motion-state change. One sentence is not enough. |
| Evidence | See [`evidence-contract.md`](./evidence-contract.md) EXPLAIN. Not L4. |
| Pass | Distinguishes force from motion; connects nonzero net force to a change; treats zero net force as unchanged, not “must stop”. |
| AI | ASK, HINT, CHALLENGE, ENCOURAGE; EXPLAIN only if UPLP allows, short, after student speech. |
| Persistence | Structured explain record in `sceneData`. |
| Common failure | “有力就一定运动”; “没有力就会停”; “力只能向前”. |
| Forbidden | Dumping the complete relation as the student's answer. Awarding full MODEL evidence here. |

EXPLAIN prepares MODEL. It does not replace MODEL.

---

## MODEL · 建立物理模型

| | |
|---|---|
| Student sees | Relation board (not a four-node energy chain) plus a small experiment-evidence drawer. |
| Student can do | Place current motion state, net-force / direction relation, resulting change, and the zero-net-force condition. |
| Question | 把“现在怎么运动、合力怎样、运动状态怎样变”连起来。 |
| Required action | Structured relation, not only a long paragraph, and not Scene 02's energy conveyor. |
| Evidence | Structured MODEL evidence suitable for **L4**. Keyword match is not enough. The Scene does not write `"L4"`. |
| Pass | See [`evidence-contract.md`](./evidence-contract.md) MODEL. |
| AI | ASK, HINT, CHALLENGE. May point at a missing slot. |
| Persistence | Structured model graph in `sceneData`. |
| Common failure | Relabeling four energy boxes; 有力→一定运动; 合力为零→一定静止. |
| Forbidden | AI building the complete student model. |

---

## TRANSFER · 换个情境试试

Do **not** duplicate transfer stories here. Use the model targets:

- `near-bicycle-speeding-up` — `full-model`
- `medium-ball-opposite-force` — `full-model`
- `far-hover-constant-velocity` — `boundary-contrast`

| | |
|---|---|
| Student sees | New situation copy from the model. Not the same teaching cart. |
| Student can do | Explain each case. |
| Question | From each `TransferTarget.scenario`. |
| Required action | Production requires one successful `full-model` transfer **and** the `boundary-contrast` hover/air-track case. The medium ball target may be used as retry/scaffold. |
| Evidence | Successful required pair may support **L5**. “也有轮子” is not enough. |
| Pass | Near or medium: force/motion-state relation. Far: zero net force → unchanged, without forcing “must stop” or “must still have a forward force”. |
| AI | ASK, HINT, CHALLENGE after an attempt. |
| Persistence | Transfer attempts in `sceneData`. |
| Common failure | Surface similarity; applying same-direction speed-up to the zero-net-force case. |
| Forbidden | Naming the shared model before the student tries. |

---

## EXAM · 试试看考试题

Use exam patterns already on the model. Sequence owned by UPLP Exam World.

| | |
|---|---|
| Student sees | Exam World. Cart hidden. |
| Student can do | Stem → 在考什么 → 用哪条关系 → then options → answer → reason. |
| Question | Model `examPatterns[].stem`. |
| Required action | Representation, model/relationship, answer, reasoning — stored separately. |
| Evidence | `selectedAnswer` and `reasoning` for each required pattern. |
| Pass | Required set completed with the Exam World sequence. Correct click alone is not model evidence. |
| AI | ASK, HINT, CHALLENGE; EXPLAIN only if UPLP allows. Must not skip the sequence. |
| Persistence | Exam World records; overlay supplies intended representation/model. |
| Common failure | Immediate four-choice click; treating EXAM as L6. |
| Forbidden | Immediate four-choice click as the whole task. |

---

## AI_OFF · 独立挑战

Hard application boundary (UPLP).

Use model challenges:

- `ai-off-unfamiliar-hover-sled`
- `ai-off-condition-tug-moving-crate`

| | |
|---|---|
| Student sees | New situation. No tutor. No model reminder. No step-by-step relation scaffolding. |
| Student can do | Independent response first, structured verification second. |
| Question | From each independent challenge. |
| Required action | Apply the model without AI. |
| Evidence | Structured independent record: committed answer, own reasoning, optional post-check facts, `llmUsed = false`. Required for **L6**. |
| Pass | Both canonical challenges accepted with required reasoning structure and zero tutor calls. |
| AI | **No call.** |
| Persistence | Independent records in `sceneData` / session evidence. |
| Common failure | Hidden clues from earlier hints; LLM grading. |
| Forbidden | Hidden grading by LLM. Setting L6 from MODEL or TRANSFER alone. |

---

## COMPLETE · 回头看看

Reflection, not a mastery certificate.

Student-facing close:

> 今天真正要抓住的，不是这辆小车的样子，而是合力怎样改变运动状态，以及合力为零时运动状态为什么可以不变。

Do not say “你已经完全掌握力与运动。”

Completion means the UPLP loop and Scene evidence gates finished. Official L1–L6 still come from `deriveModelEvidenceLevel`, not from this screen.
