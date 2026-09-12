# Scene 02 — Learning Flow

> Scene-specific mapping onto UPLP  
> Primary model: `chemical-energy-internal-energy-mechanical-energy`

Production Phase 8 implements the full UPLP loop through COMPLETE:

ENTRY → OBSERVE → DESCRIBE → PREDICT → EXPERIMENT → EXPLAIN → MODEL → TRANSFER → EXAM → AI_OFF → COMPLETE

Universal sequence (owned by UPLP, not redefined here):

```text
ENTRY → OBSERVE → DESCRIBE → PREDICT → EXPERIMENT
→ EXPLAIN → MODEL → TRANSFER → EXAM → AI_OFF → COMPLETE
```

This file only says what *this Scene* shows, asks, records, and forbids.

Allowed AI actions are the UPLP / `STAGE_TUTOR_POLICY` set. Details: [`ai-guardrails.md`](./ai-guardrails.md).

---

## ENTRY · 开始探索

| | |
|---|---|
| Student sees | Simplified engine. No energy-chain caption. |
| Student can do | Start. |
| Question | 燃料为什么能让发动机转起来？（Phase 3 production copy; spec long form also allows 持续转起来） |
| Required action | Explicit start. |
| Evidence | Session entered this Scene. |
| Pass | Student starts. |
| AI | None. |
| Forbidden | Displaying `化学能 → 内能 → 机械能`. Teaching stroke names as the goal. |

---

## OBSERVE · 先观察

| | |
|---|---|
| Student sees | One complete four-stroke cycle. Piston, valves, ignition event, crankshaft. |
| Student can do | Play, pause, step stroke-by-stroke, replay. |
| Question | 先不背名称。仔细看看：哪些东西在变化？ |
| Required action | Watch the cycle. Complete a structured observation task (correct + distractor options). |
| Evidence | Selected observation options. `watchedFullCycle` may be recorded. |
| Pass | Piston motion **and** at least one valve/combustion observation. See [`evidence-contract.md`](./evidence-contract.md). Autoplay alone does not pass. |
| AI | ASK, ENCOURAGE. |
| Forbidden | Injecting the energy vocabulary. Counting this autoplay as EXPERIMENT. |

Initial autoplay / demonstration is **OBSERVE evidence only**.

---

## DESCRIBE · 用物理语言描述

| | |
|---|---|
| Student sees | Engine still available. Observation kept. |
| Student can do | Answer focused questions; may step the cycle again. |
| Questions | 活塞在哪些阶段向上、哪些向下？什么时候气门打开？什么时候出现燃烧？哪个阶段看起来最可能在推动机械系统？ |
| Required action | Semantic description, not any non-empty text. |
| Evidence | See [`evidence-contract.md`](./evidence-contract.md) DESCRIBE. |
| Pass | Distinguishes piston direction; notes a valve or combustion event; distinguishes the power event from other strokes. Textbook names 吸气/压缩/做功/排气 are **not** required. |
| AI | ASK, HINT, ENCOURAGE. |
| Forbidden | Requiring the full energy model. Gating only on text length. |

---

## PREDICT · 先预测

The UPLP **PREDICT** stage is the first pre-intervention prediction (Experiment A).

During **EXPERIMENT**, every additional intervention still needs its own committed prediction before it runs. Those are **experiment-local predictions**. They do **not** create extra UPLP PREDICT stages. Tutor permissions follow the enclosing UPLP stage, so a prediction authored inside EXPERIMENT does not get tutor help.

This does **not** change UPLP.

Use the model's experiments:

1. `ignition-energy-release`
2. `immovable-mechanical-system`

| | |
|---|---|
| Student sees | The question for the next intervention. Engine idle; no result yet. |
| Student can do | Choose/confirm the condition to change; write prediction + reason. |
| Questions | 如果压缩之后没有发生燃烧，发动机还会像刚才一样产生主要动力吗？ / 如果燃烧正常发生，但活塞不能运动，还能像正常情况一样输出机械动力吗？ |
| Required action | Explicit outcome + own-word reason, committed before the matching run. |
| Evidence | Outcome, reason, `committedAt` before `interventionAt`. Wrong predictions are valid. |
| Pass | Experiment A prediction committed to leave the UPLP PREDICT stage. Experiment B prediction is experiment-local, authored during EXPERIMENT after A closes. |
| AI | ASK, HINT, CHALLENGE on the UPLP PREDICT stage only. |
| Forbidden | Revealing the deterministic result. Grading prediction correctness. |

Each experiment needs its own prediction-before-run pair.

---

## EXPERIMENT · 动手验证

| | |
|---|---|
| Student sees | Controls for `combustionEnabled` and/or `pistonCanMove`. Deterministic result after they run. |
| Student can do | Apply one intervention, watch the cycle, compare, reflect. |
| Question | 改一个条件，看看是不是和你想的一样。 |
| Required action | UPLP closure: prediction → intervention → result → comparison → reflection. |
| Evidence | All five parts. Distinct from OBSERVE autoplay. |
| Pass | Both high-information experiments completed with full five-part closure. Then the student may leave for EXPLAIN. |
| AI | None. App owns the physical result. Experiment-local predictions (including Experiment B) are still student-authored here; UPLP keeps tutor off. |
| Forbidden | LLM-invented outcomes. Completing with missing evidence. Collapsing motion and main output into one observation. |

Expected conceptual results are in [`physics-state.md`](./physics-state.md).

---

## EXPLAIN · 解释为什么

| | |
|---|---|
| Student sees | Both experiment outcomes from their own evidence. Engine optional. |
| Student can do | Progressive causal construction, then own words. |
| Questions | 把两次实验放在一起看：为什么燃烧发生了，也不一定就能得到机械动力？燃料中的能量要经过哪些过程，才能最后让机械系统运动起来？ |
| Required action | Distinguishes combustion from direct crank output; notes working-gas change; recognizes mechanical interaction. |
| Evidence | See [`evidence-contract.md`](./evidence-contract.md) EXPLAIN. Not L4. |
| Pass | Sufficient causal structure to attempt MODEL. Exact phrases 化学能 / 内能 / 机械能 are not required. |
| AI | ASK, HINT, CHALLENGE, ENCOURAGE; EXPLAIN only if UPLP allows, short, after student speech. App-side H1–H5 uses the Physics Model `hintLadder`. |
| Forbidden | Dumping `化学能 → 内能 → 做功 → 机械能` as the student's answer. |

EXPLAIN prepares MODEL. It does not replace MODEL.

---

## MODEL · 建立物理模型

| | |
|---|---|
| Student sees | Causal-chain workspace plus a small experiment-evidence drawer. Combustion is an enabling event, not a quantity chip. |
| Student can do | Place quantity nodes and relation connectors. |
| Question | 把能量从燃料到机械运动的过程连起来。 |
| Required action | Structured chain, not only a long paragraph, and not 吸气 → 压缩 → 做功 → 排气. |
| Evidence | Structured MODEL evidence suitable for **L4**. Keyword match is not enough. The Scene does not write `"L4"`. |
| Pass | See [`evidence-contract.md`](./evidence-contract.md) MODEL. Production then opens TRANSFER. |
| AI | ASK, HINT, CHALLENGE. May point at a missing link. |
| Forbidden | AI building the complete student model. |

---

## TRANSFER · 换个情境试试

Do **not** duplicate transfer stories here. Use the model targets:

- `near-motorcycle-piston-engine` — `full-model`
- `medium-lab-combustion-piston` — `full-model`
- `far-steam-piston` — `partial-structure`

| | |
|---|---|
| Student sees | New situation copy from the model. Not the same teaching diagram. |
| Student can do | Explain each case. |
| Question | From each `TransferTarget.scenario`. |
| Required action | Production requires one successful `full-model` transfer (motorcycle, or the lab device as retry/scaffold) **and** one successful `partial-structure` steam transfer. The library still contains three targets; the medium target is not required in one session. Steam must separate transferable vs non-transferable structure. |
| Evidence | Successful required pair may support **L5**. “有活塞” is not enough. |
| Pass | Near or medium: full chain. Far: internal-energy/state → work → mechanical energy, without forcing chemical-energy start. Production then opens EXAM. |
| AI | ASK, HINT, CHALLENGE after an attempt. |
| Forbidden | Naming the shared model before the student tries. |

---

## EXAM · 试试看考试题

Use exam patterns already on the model. Sequence owned by UPLP Exam World.

| | |
|---|---|
| Student sees | Exam World. Engine hidden. |
| Student can do | Stem → 在考什么 → 用哪条关系 → then options → answer → reason. |
| Question | Model `examPatterns[].stem`. |
| Required action | Representation, model/relationship, answer, reasoning — stored separately. |
| Evidence | `selectedAnswer` and `reasoning` for each required pattern. |
| Pass | Required set completed with the Exam World sequence. Correct click alone is not model evidence. Production then opens AI_OFF. |
| AI | ASK, HINT, CHALLENGE; EXPLAIN only if UPLP allows. Must not skip the sequence. |
| Forbidden | Immediate four-choice click as the whole task. |

---

## AI_OFF · 独立挑战

Hard application boundary (UPLP).

Use model challenges:

- `ai-off-unfamiliar-combustion-piston`
- `ai-off-condition-locked-mechanism`

| | |
|---|---|
| Student sees | New situation. No tutor. No prior hints as clues. |
| Student can do | Write independently. |
| Question | From each independent challenge. |
| Required action | Reconstruct the chain; check conditions. |
| Evidence | Structured independent record: committed answer, own reasoning, optional post-check facts, `llmUsed = false`. Required for **L6**. |
| Pass | Both canonical challenges accepted with required reasoning structure and zero tutor calls. |
| AI | **No call.** |
| Forbidden | Hidden grading by LLM. Setting L6 from MODEL or TRANSFER alone. |

---

## COMPLETE · 回头看看

Reflection, not a mastery certificate.

Student-facing close:

> 今天真正要抓住的，不是四个冲程的名字，而是燃料中的能量怎样经过物理过程变成机械运动。

Do not say “你已经完全掌握内燃机。”

Completion means the UPLP loop and Scene evidence gates finished. Official L1–L6 still come from `deriveModelEvidenceLevel`, not from this screen.
