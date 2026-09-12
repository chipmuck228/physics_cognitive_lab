# Scene 03 — Exam Mapping

> Scene-specific Exam World  
> Primary model: `force-changes-motion-state`

This file does **not** invent a parallel question bank.

Exam patterns already live on the concrete model:

`content/physics-models/force-changes-motion-state/exam.ts`

Universal Exam World sequence is owned by [`../../universal-physics-learning-protocol.md`](../../universal-physics-learning-protocol.md).

Canonical model ID and C1–C14 come from the Library and [`../../cognitive-action-taxonomy.md`](../../cognitive-action-taxonomy.md).

The product-wide exam philosophy remains in [`../../exam-mapping.md`](../../exam-mapping.md). This file only says how **this Scene** uses the model's patterns.

Intended representation / intended model for production rendering live in:

`content/physics-models/force-changes-motion-state/assessment-overlay.ts`

That overlay is not a second bank.

---

## 1. Visual and cognitive separation

When entering EXAM:

- hide the cart visualization;
- hide experiment controls;
- show an “考试题” representation;
- do not look like the lab bench with choices pasted on top.

Student chrome:

> 现在先不看小车。先把题目想清楚，再选答案。

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
| `exam-force-does-not-mean-motion` | multiple-choice | Force ≠ motion; 有力 ≠ 一定运动 | C4, C5, C9 |
| `exam-zero-net-force-not-must-stop` | multiple-choice | Zero net force ≠ must be stationary | C4, C7, C10, C13 |
| `exam-opposite-force-slows-down` | short-answer | Opposite force; speed vs direction | C4, C5, C10, C11 |
| `exam-force-motion-arrow-diagram` | diagram | Read force vs motion arrows | C1, C4, C5, C9, C14 |
| `exam-balanced-forces-not-no-forces` | multiple-choice | Balanced forces ≠ no forces | C4, C7, C9, C13 |

Future implementation should require at least:

1. `exam-force-does-not-mean-motion`
2. `exam-zero-net-force-not-must-stop`
3. `exam-opposite-force-slows-down` **or** `exam-force-motion-arrow-diagram`

plus one discrimination item:

4. `exam-balanced-forces-not-no-forces`

Exact required subset is an implementation choice. Do not add new `ExamPattern` IDs in the Scene.

Recommended production set for one session:

1. `exam-force-does-not-mean-motion`
2. `exam-zero-net-force-not-must-stop`
3. `exam-force-motion-arrow-diagram`

The remaining library patterns stay in the model and are not all required in one session.

These are Grade 9 力与运动 representations of **this** model, not a generic mechanics bank and not Scene 02 energy items.

---

## 4. Distractors this Scene must keep available

These are already in the model. The Scene must not “helpfully” remove them:

- 物体只要受到力，就一定在运动;
- 物体在运动，就一定受到向前的力;
- 没有向前的力，小车一定会立刻停下来;
- 合力为零就是没有力，所以一定静止;
- 力必须和运动方向相同;
- 快慢变了就是方向已经改变;
- 平衡就是没有力.

---

## 5. Tutor during EXAM

Allowed: ASK, HINT, CHALLENGE, EXPLAIN (UPLP).

Must preserve the sequence. Must not reveal `correctAnswer`.

Must not skip “这道题主要在考什么？” or “用哪个物理关系/模型？”.

---

## 6. After EXAM

AI_OFF uses the model's independent challenges, not these exam stems copied with tutor still visible.

Completion must not treat a correct exam click as L6 or as “掌握力与运动”.
