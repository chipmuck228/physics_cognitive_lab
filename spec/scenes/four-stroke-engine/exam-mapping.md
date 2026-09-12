# Scene 02 — Exam Mapping

> Scene-specific Exam World  
> Primary model: `chemical-energy-internal-energy-mechanical-energy`

This file does **not** invent a parallel question bank.

Exam patterns already live on the concrete model:

`content/physics-models/chemical-energy-internal-energy-mechanical-energy/exam.ts`

Universal Exam World sequence is owned by [`../../universal-physics-learning-protocol.md`](../../universal-physics-learning-protocol.md).

Canonical model ID and C1–C14 come from the Library and [`../../cognitive-action-taxonomy.md`](../../cognitive-action-taxonomy.md).

The product-wide exam philosophy remains in [`../../exam-mapping.md`](../../exam-mapping.md). This file only says how **this Scene** uses the model's patterns.

---

## 1. Visual and cognitive separation

When entering EXAM:

- hide the engine visualization;
- hide experiment controls;
- show an “考试题” representation;
- do not look like the lab bench with choices pasted on top.

Student chrome:

> 现在先不看发动机。先把题目想清楚，再选答案。

Stage label: 试试看考试题.

---

## 2. Required sequence

Do **not** immediately present: 题干 + 四个选项 + 点击作答.

```text
出示题干
    ↓
这道题主要在考什么？
    ↓
你准备用哪个物理关系/模型？
    ↓
再出示 / 开放选项（如有）
    ↓
作答
    ↓
写一句理由
```

Store separately:

```ts
{
  patternId: string;
  representationRecognition: string;
  modelRecognition: string;
  selectedAnswer?: string;
  reasoning: string;
}
```

`selectedAnswer` is not official model evidence by itself.

Each pattern already provides `representationOptions`, `modelOptions`, `options`, `correctAnswer`, and `reasoningPrompt`. Use those fields. Do not rewrite them in this spec.

---

## 3. Patterns to use

| patternId | Format | What it probes | Cognitive actions |
|---|---|---|---|
| `exam-power-stroke-energy-conversion` | multiple-choice | Main conversion on the power event | C4, C5, C6, C9 |
| `exam-distinguish-power-stroke` | multiple-choice | Main mechanical output is the work step, not every stroke | C4, C5, C7, C10 |
| `exam-why-power-stroke-works` | short-answer | Causal order: combustion → state change → work → mechanical energy | C5, C6, C7, C10 |
| `exam-stroke-diagram-energy-flow` | diagram | Read a stroke diagram as energy flow, not as a name list | C1, C5, C6, C9, C14 |
| `exam-engine-does-not-create-energy` | multiple-choice | Conversion, not creation; do not require “no losses” | C4, C6, C7, C13 |

Future implementation should require at least the three energy-structure items:

1. `exam-power-stroke-energy-conversion`
2. `exam-why-power-stroke-works`
3. `exam-engine-does-not-create-energy`

plus one discrimination item:

4. `exam-distinguish-power-stroke` **or** `exam-stroke-diagram-energy-flow`

Exact required subset is an implementation choice. Do not add new `ExamPattern` IDs in the Scene.

Production Phase 7 uses three items that together cover model recognition, causal/condition reasoning, and representation variation:

1. `exam-power-stroke-energy-conversion`
2. `exam-why-power-stroke-works`
3. `exam-stroke-diagram-energy-flow`

The remaining library patterns stay in the model and are not required in one session.

---

## 4. Distractors this Scene must keep available

These are already in the model. The Scene must not “helpfully” remove them:

- 做功冲程制造出了新的能量;
- 四个冲程都会把内能变成机械能;
- 压缩冲程就是对外做功的主要冲程;
- 燃烧直接让曲轴转起来;
- 只要温度升高就一定能输出机械能;
- 排气/吸气带来了机械能.

---

## 5. Tutor during EXAM

Allowed: ASK, HINT, CHALLENGE, EXPLAIN (UPLP).

Must preserve the sequence. Must not reveal `correctAnswer`.

Must not skip “这道题主要在考什么？” or “用哪个物理关系/模型？”.

---

## 6. After EXAM

AI_OFF uses the model's independent challenges, not these exam stems copied with tutor still visible.

Completion must not treat a correct exam click as L6 or as “掌握内燃机”.
