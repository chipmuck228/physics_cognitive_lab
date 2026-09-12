# Scene 03 — Test Plan

> Future implementation tests  
> Scene ID: `horizontal-force-cart`  
> Primary model: `force-changes-motion-state`

Do not implement production Scene UI or `lib/physics/` cart code in this specification pass.

Model definition tests should exist now:

- `tests/physics-models/force-changes-motion-state.test.ts`

Production Scene tests are **future** work.

---

## 1. Physics unit tests

Proposed module: `lib/physics/horizontal-force-cart/`

| Case | Expect |
|---|---|
| Rest + zero force | stays `speedTick = 0`, `lastChange = "unchanged"` |
| Rest + right force | `started-moving`, direction right, speed 1 |
| Moving right + right force | `sped-up` by one tick |
| Moving right + left force | `slowed-down` by one tick |
| Moving right speed 1 + continued left force | may `reverse` on a following tick |
| Moving + zero force | speed and direction unchanged |
| Same inputs | same `CartState` |
| Animation interpolation | must not change committed physics truth |
| LLM isolation | no function in this module accepts tutor text as physics input |

Deterministic: same config → same `CartState`.

Do not assert F=ma numerical values.

---

## 2. Learning / evidence tests

Use the universal progression engine with a Scene 03 adapter. No `if (sceneId === "horizontal-force-cart")` in `progression.ts`.

| Case | Expect |
|---|---|
| OBSERVE autoplay | writes observation evidence; `canAdvance` EXPERIMENT remains false |
| DESCRIBE empty / “小车动了” only | gate fails |
| DESCRIBE object + initial state + force direction + change | gate passes without the textbook slogan |
| PREDICT missing reason | cannot run experiment |
| PREDICT after intervention | rejected; must be authored before intervention |
| EXPERIMENT missing any of the five parts | incomplete |
| All three experiments | A, B, and C each need full closure |
| EXPLAIN “它动了” only | does not pass causal-attempt gate |
| EXPLAIN “有力就一定运动” | insufficient / misconception signal |
| MODEL keywords only | does not set `constructedValidCausalModel` |
| MODEL four energy slots relabeled | invalid |
| MODEL valid relation board | may set `constructedValidCausalModel` → evaluator can derive L4 |
| TRANSFER “有轮子” | not accepted; no L5 |
| Far hover forced “must stop” | not accepted under `boundary-contrast` |
| Valid near/medium + hover boundary | may set `successfulTransfer` → L5 only if model already valid |
| AI_OFF with tutor call | fail; `llmUsed` must be false |
| L6 | only if valid AI_OFF **and** `llmDisabledDuringIndependent` |
| Scene does not write `"L4"` | session stores evidence flags; level comes from `deriveModelEvidenceLevel` |

Reuse `tests/physics-models/force-changes-motion-state.test.ts` for evaluator / transfer / L-level derivation. Do not fork a second mastery function.

---

## 3. Tutor tests

| Case | Expect |
|---|---|
| OBSERVE / DESCRIBE / PREDICT / MODEL / TRANSFER | protected; complete-relation leakage rejected |
| PREDICT | must not include Experiment A/B/C tick results |
| EXPERIMENT | `canCallTutor === false` |
| AI_OFF | `isTutorHardBlocked`; zero `/api/tutor` requests |
| COMPLETE | no tutor call |
| Invalid Zod tutor payload | safe fallback; cart state unchanged; stage unchanged |
| Forbidden physics claims | 有力就一定运动 / 没有力就会停 → reject |
| Adapter tutor context | `getTutorContext` supplies cart summary; universal tutor has no `sceneId` switch |

---

## 4. Runtime contract tests (when adapter exists)

| Case | Expect |
|---|---|
| `getSceneAdapter("horizontal-force-cart")` | returns Scene 03 adapter |
| `physicsState.sceneId` | `horizontal-force-cart`, not engine/microwave |
| `sceneData` | holds describe / experiment / model records |
| AssessmentOverlay | non-engine judgments for hover sled / tug crate |
| Progression | ENTRY→COMPLETE with no universal `sceneId` branch |
| Persistence | restore cart `sceneData` without migrating into `EngineState` |

Until the adapter exists, the density fixture already proves a non-engine adapter can progress without universal branches. Scene 03 production must follow that pattern.

---

## 5. Playwright (future)

Happy path: ENTRY → COMPLETE with structured evidence, wrong prediction still allowed, AI_OFF with tutor hidden.

Do not implement these tests in this specification pass.
