# Scene 06 — Quantitative / physics-state contract

> Design contract for `deterministic-simple-resistor-circuit`.  
> Canonical functions: `content/physics-models/ohms-law/physics-boundary.ts`  
> Production runtime: **not implemented**

This file owns the intended numerical contract. It does not own UI labels. PRI owns whether a later display states these values as the right quantities.

Catalog numbers are **pedagogical engine values**. They must not be pasted into production components as literals.

## 1. Physics quantities

| Quantity | Symbol | Unit | Role in this Scene |
|---|---|---|---|
| Current through the resistor | I | A | DERIVED_QUANTITY |
| Voltage across the resistor | U | V | INPUT (closed circuit) |
| Resistance of that resistor | R | Ω | INPUT / PHYSICAL_CONSTANT for a chosen resistor |
| Circuit closed | — | — | RUNTIME_STATE |

Open-circuit source voltage, if ever shown, is a different quantity from U across the resistor. Do not bind both to one number.

## 2. Canonical equation

```text
closed ∧ R > 0 ∧ ohmic:
  I = U / R

open:
  I = 0
  U_resistor = 0
```

Equivalents `U = I R` and `R = U / I` are the same relation.

## 3. Classification

### Input

- `selectedResistorId` → catalog R
- `selectedSourceVoltageId` → catalog source voltage
- `comparisonMode`

### Constant / controlled

- one resistor in the learning target
- R treated constant during a comparison
- temperature treated constant
- DC, steady current
- ideal wires
- no short-circuit task

### Runtime state

- `circuitClosed`
- currently selected resistor and source voltage
- comparison mode

### Derived

- `I = officialCurrentA({ resistorId, sourceVoltageId, circuitClosed })`
- closed-circuit `U_resistor = officialVoltageAcrossResistorV(...)`

Do not author a second production table of currents.

## 4. Pedagogical catalog (engine only)

These values exist so later tests can check the official functions. They are not student-facing truth.

| resistorId | R / Ω |
|---|---|
| `R-5` | 5 |
| `R-10` | 10 |

| sourceVoltageId | source U / V |
|---|---|
| `U-3` | 3 |
| `U-6` | 6 |

Closed-circuit derived I (do not hardcode in UI):

| R / Ω | U / V | I / A |
|---|---|---|
| 5 | 3 | 0.6 |
| 5 | 6 | 1.2 |
| 10 | 3 | 0.3 |
| 10 | 6 | 0.6 |

Exam / AI_OFF stems should prefer **different** numbers (the model exam uses 12 V and 4 Ω) so a student cannot pass by recalling a screen.

## 5. Valid ranges

- R > 0
- U ≥ 0 (Grade-9 magnitudes)
- I ≥ 0
- No R = 0 short-circuit case in this Scene
- Comparisons used for teaching are closed-circuit

## 6. Invariants

```text
closed ∧ ohmic:
  I · R = U

same R:
  I2 / I1 = U2 / U1

same U:
  I2 / I1 = R1 / R2
```

R displayed for a chosen resistor is the catalog input, not a second derived rewrite.

## 7. What this contract does not decide

- How the circuit is drawn
- Whether meters appear
- Stage copy
- L-levels

Those belong to PRI, UPLP, and evidence design.
