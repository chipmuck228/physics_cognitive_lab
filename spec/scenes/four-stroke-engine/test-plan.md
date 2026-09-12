# Scene 02 — Test Plan

> Future implementation tests  
> Scene ID: `four-stroke-engine`  
> Primary model: `chemical-energy-internal-energy-mechanical-energy`

Phase 4 production tests live in:

- `tests/learning/engine-predict.test.ts`
- `tests/learning/engine-experiment.test.ts`
- `tests/components/four-stroke-engine-lab.test.tsx`
- `tests/learning/progression.test.ts`

Do not implement these tests in this specification pass except where they already exist for the Physics Model.

Production Scene UI is **not** in scope yet.

---

## 1. Physics unit tests

Proposed module: `lib/physics/engine/`

| Case | Expect |
|---|---|
| Intake | piston `down`; intake open; exhaust closed; no combustion; `mechanicalOutput: "none"` |
| Compression | piston `up`; both valves closed; no combustion; `mechanicalOutput: "input-required"`; `workTransfer: "mechanical-to-gas"` |
| Power (normal) | piston `down`; both valves closed; combustion event; working gas `combusted-hot` then `expanding`; `workTransfer: "gas-to-mechanical"`; `mechanicalOutput: "main-output"` |
| Exhaust | piston `up`; intake closed; exhaust open; no new combustion; `mechanicalOutput: "none"` |
| Cycle wrap | `advanceStroke` four times returns to intake; `combustionOccurred` resets on new intake |
| No valve overlap | never `intakeValveOpen && exhaustValveOpen` in the pedagogical cycle |
| Experiment A | `combustionEnabled = false` → power stroke `combustionOccurred: false`, `workingGasState: "compressed-unburned"`, `mechanicalOutput: "none"` |
| Experiment B | `pistonCanMove = false` → combustion may occur, `pistonDirection: "held"`, `workTransfer: "blocked"`, `mechanicalOutput: "blocked"`, `crankshaftMoving: false` |
| Flywheel animation ≠ output | stepping after a failed power stroke must not set `main-output` |
| LLM isolation | no function in this module accepts tutor text as physics input |

Deterministic: same config → same `EngineState[]`.

---

## 2. Learning / evidence tests

Use the universal progression engine with Scene 02 evidence policy.

| Case | Expect |
|---|---|
| OBSERVE autoplay | writes observation evidence; `canAdvance` EXPERIMENT remains false |
| DESCRIBE empty / irrelevant | gate fails |
| DESCRIBE piston + event + power distinction | gate passes without requiring 吸气/压缩/做功/排气 |
| PREDICT missing reason | cannot run experiment |
| PREDICT after intervention | rejected; must be `authoredBeforeIntervention` |
| EXPERIMENT missing any of the five parts | incomplete |
| Both experiments | A and B each need full closure |
| EXPLAIN “它转了” only | does not pass causal-attempt gate |
| MODEL keywords only | does not set `constructedValidCausalModel` |
| MODEL valid structured chain | may set `constructedValidCausalModel` → evaluator can derive L4 |
| MODEL combustion as quantity node | invalid |
| TRANSFER “有活塞” | not accepted; no L5 |
| Far steam full chemical chain forced | not accepted under `partial-structure` |
| Valid near/medium + partial far | may set `successfulTransfer` → L5 only if model already valid |
| AI_OFF with tutor call | fail; `llmUsed` must be false |
| L6 | only if valid AI_OFF **and** `llmDisabledDuringIndependent` |
| Scene does not write `"L4"` | session stores evidence flags; level comes from `deriveModelEvidenceLevel` |

Reuse existing tests in `tests/physics-models/chemical-energy-internal-energy-mechanical-energy.test.ts` for evaluator / transfer / L-level derivation. Do not fork a second mastery function.

---

## 3. Tutor tests

| Case | Expect |
|---|---|
| OBSERVE / DESCRIBE / PREDICT / MODEL / TRANSFER | protected; complete-chain leakage rejected |
| PREDICT | must not include Experiment A/B results |
| EXPERIMENT | `canCallTutor === false` |
| AI_OFF | `isTutorHardBlocked`; zero `/api/tutor` (or equivalent) requests |
| COMPLETE | no tutor call |
| Invalid Zod tutor payload | safe fallback; engine state unchanged; stage unchanged |
| Forbidden physics claims | 燃烧直接推动曲轴 / 全部变成机械能 / 压强永远增加 → reject |

---

## 4. Future Playwright

When the Scene UI exists:

1. **Happy path**  
   ENTRY → … → COMPLETE with both experiments, structured MODEL, three transfers, Exam World sequence, both AI_OFF challenges.

2. **Refresh / persistence**  
   Mid-PREDICT refresh restores prediction draft and does not skip to EXPERIMENT result.

3. **Tutor API unavailable**  
   Student can still step the engine, run deterministic experiments, and continue the core path.

4. **AI_OFF network**  
   Entering AI_OFF makes **zero** tutor network requests.

Also check:

- Exam World does not show engine + four choices in one dump;
- AI_OFF hides 问一句;
- COMPLETE copy does not claim mastery of 内燃机.

---

## 5. Visualization tests (Phase 2)

Render known `EngineState` values. Do not duplicate physics-engine tests.

| Case | Expect |
|---|---|
| Intake | intake valve open, exhaust closed |
| Compression | both valves closed |
| Power | combustion effect when `combustionEventActive` |
| Exhaust | exhaust valve open |
| Experiment A power | no combustion visual |
| Experiment B power | piston held; not a normal power stroke motion |
| Motion vs output | `crankshaftMoving` does not imply main-output in the UI |
| 下一冲程 | follows `advanceStroke` |
| 重置 | returns to canonical intake snapshot |

---

## 6. What not to test as physics

Do not add tests that lock in:

- realistic *p*–*V* numbers;
- thermal efficiency;
- torque;
- valve overlap;
- ignition advance.

Those are outside the Grade 9 pedagogical model.
