# Scene 06 Physical Representation Integrity Audit

> Date: 2026-09-12  
> Scene: `simple-resistor-circuit`  
> Primary model: `ohms-law`  
> Plan: [`physical-representation-plan.md`](./physical-representation-plan.md)  
> Contract: [`../../physics-representation-integrity-contract.md`](../../physics-representation-integrity-contract.md)  
> Screenshots: `spec/student-ui/screenshots/scene-06-*.png`

```text
Product UI changed: YES (first production Scene)
Physics code: officialCurrentA / officialVoltageAcrossResistorV / officialResistanceOhm
Evaluator changed: Scene-owned ohms evaluators added
Evidence semantics: unchanged (deriveModelEvidenceLevel only)
UPLP changed: NO
Historical PRE changed: NO
metadata.status changed: NO (remains draft)
```

Correct runtime numbers do **not** imply correct representation.

---

## A. Canonical physics truth summary

Owner: `content/physics-models/ohms-law/physics-boundary.ts`.

| Quantity | Role | Closed-circuit catalog pair (observe / same R) |
|---|---|---|
| R | catalog input | left `R-5` → 5 Ω; right `R-5` → 5 Ω |
| U_source | catalog input | left `U-3` → 3 V; right `U-6` → 6 V |
| U_resistor | derived | closed: same as source; open: 0 V |
| I | derived `U / R` | left 0.6 A; right 1.2 A |

Open circuit: `I = 0` and `U_resistor = 0` do **not** mean source voltage is 0.

Exam sitting: 12 V, 4 Ω → `officialCurrentFromVoltageAndResistanceA` → 3 A.

---

## B. Runtime → UI trace

```text
RESISTOR_CATALOG / SOURCE_VOLTAGE_CATALOG
  → SimpleResistorInputs { resistorId, sourceVoltageId, circuitClosed }
  → officialResistanceOhm / officialVoltageAcrossResistorV / officialCurrentA
  → ohmsVisibleReadings
  → SimpleResistorCircuit
  → student-visible labels + units
```

Lab binding (`SimpleResistorCircuitLab`):

- OBSERVE: local demo; I and U_resistor hidden until “看一次读数”
- DESCRIBE: closed observe demo with readings
- PREDICT / EXPERIMENT: prepared pair; readings only after run
- MODEL: frozen observe pair with readings; caption says not the live experiment
- TRANSFER / EXAM / AI_OFF / COMPLETE: circuit graphic unmounted

Meters omitted. Official readings are bound on the cards.

---

## C. Required trace table

| UI element | Student-visible text | Physical quantity | Runtime source | Unit | Integrity verdict |
|---|---|---|---|---|---|
| Resistance | `电阻 R` + Ω | R | `officialResistanceOhm` | Ω | PASS |
| Source voltage | `电源电压` + V | source U | catalog `voltageV` | V | PASS |
| Resistor voltage | `电阻两端电压 U` + V | U across this resistor | `officialVoltageAcrossResistorV` | V | PASS |
| Current | `电流 I` + A | I through this resistor | `officialCurrentA` | A | PASS |
| Open I / U_resistor | `0 A` / `0 V` | open-circuit derived | official functions | A / V | PASS |
| Open source | remains non-zero | source voltage | catalog | V | PASS |
| Cross-quantity arrow | none | — | — | — | PASS (no `6V → 1.2A`) |

---

## D. Verdicts

| Check | Result |
|---|---|
| Physics Truth | PASS |
| Numerical Consistency | PASS |
| Runtime Calculation Integrity | PASS |
| Physical Representation Integrity | PASS_WITH_REFINEMENTS |

### Refinements (non-blocking)

1. MODEL still shows a two-card comparison with official numbers. Caption states it is a static figure, not the current experiment. A student could still treat those numbers as “the last experiment.” TRANSFER/EXAM/AI_OFF unmount the circuit, which is the stronger protection.
2. Cards are labeled readings, not series ammeters / parallel voltmeters. That follows the approved plan: omit meters if connection integrity cannot be guaranteed.

### Not found

- Hardcoded production current literals in UI
- Unit attached to the wrong quantity
- Stale experiment-B pair shown as the current MODEL/TRANSFER/EXAM/AI_OFF task

---

## E. Confirmation

Scene 01–05 representations were not re-audited or rewritten.
