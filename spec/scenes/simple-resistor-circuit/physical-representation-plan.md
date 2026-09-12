# Scene 06 — Physical Representation Plan

> First new Scene designed under [`../../physics-representation-integrity-contract.md`](../../physics-representation-integrity-contract.md).  
> This is a plan, not a PRI audit of a running UI.  
> Do not design visual polish here.

## 1. Provenance chain

```text
ohms-law definition
  → physics-boundary.ts
  → future runtime state
  → officialCurrentA / officialVoltageAcrossResistorV / officialResistanceOhm
  → UI binding
  → student-visible circuit, meters, and labels
```

Forbidden later: `const current = 0.6` in a production component.

## 2. Quantity identity (PRI-01)

| Display | Must mean | Must not mean |
|---|---|---|
| I / 电流 / A | current through this resistor | voltage, “how fast electricity runs” as speed, brightness |
| U / 电压 / V | potential difference across this resistor | current, voltage flowing along a wire |
| R / 电阻 / Ω | resistance of this resistor | current, “blocking force” as a second current |
| 电源电压 | source voltage, only if labeled as source | U across the resistor when the switch is open |

Never use one symbol for two of these in the same visual group.

## 3. Units (PRI-03)

- Current: A
- Voltage: V
- Resistance: Ω

Do not write `V/A` as a student-facing stand-in for Ω unless the task is explicitly about computing R, and even then the result must still be labeled Ω.

Do not concatenate `6V → 1.2A` as if voltage becomes current. If a before/after arrow is used, both ends must be the same quantity (`U₁ → U₂` or `I₁ → I₂`).

## 4. Meters, if they appear

If an ammeter is shown:

- it is in **series** with the resistor
- its reading is the I of that resistor
- it is not a lesson on `series-circuit`

If a voltmeter is shown:

- it is in **parallel** across the **same** resistor
- its reading is the U of that resistor
- it is not a lesson on `parallel-circuit`

Forbidden connections:

- ammeter across the resistor (parallel ammeter)
- voltmeter in series as if it carried the circuit current
- one meter labeled with the wrong unit
- a floating number with no quantity name

If meters are too easy to misconnect in the first implementation, omit them and show bound official readings next to the resistor, still with quantity + unit.

## 5. Arrows, wires, comparison (PRI-04, PRI-06)

Allowed:

- one current direction around a closed loop
- voltage marks **across** the resistor
- two side-by-side states that state the controlled variable

Forbidden:

- an arrow from U to I drawn as “voltage turns into current”
- an arrow from I to R drawn as “current makes resistance”
- wires drawn so it looks like voltage is a fluid in the wire
- grouping U and I as if they were the same reading
- a comparison that changes U and R at the same time while the caption says “only voltage changed”

## 6. Stage context vs visible circuit (PRI-06)

The visible circuit must match the current task.

- OBSERVE / EXPERIMENT: the circuit may change with the student’s comparison.
- MODEL / TRANSFER / EXAM / AI_OFF: do not leave a live leftover experiment graphic that still implies the last run is the current task (Scene 05 PRI-05-03 lesson).
- If MODEL needs a still diagram, it is a frozen representation of the relation, not a second hidden experiment.

## 7. Open circuit (PRI-01, PRI-05)

If the switch can open:

```text
I = 0                 DERIVED
U_resistor = 0        DERIVED
source voltage        INPUT / different quantity
```

Do not display a single “U = 0” that also means the battery has no voltage.

Recommended for the first implementation: keep teaching comparisons closed. Treat open circuit as a spoken/written condition, not a third lab control, unless PRI can show both voltages separately.

## 8. Runtime → visible provenance (PRI-02, PRI-05)

| Visible value | Class | Source |
|---|---|---|
| chosen R | INPUT | `officialResistanceOhm` |
| closed-circuit U across resistor | INPUT mapped | `officialVoltageAcrossResistorV` |
| I | DERIVED_QUANTITY | `officialCurrentA` |
| circuit open/closed | RUNTIME_STATE | session physics state |

No second authored production copy of I.

## 9. What this plan does not do

- It does not choose colors, layout, or animation.
- It does not implement the Scene.
- It is not a Gate A or Gate B result.
- A later PRI review must be Scene-scoped after UI exists.
