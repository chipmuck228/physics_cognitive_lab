# Request: Physical Representation Integrity review (one Scene)

Use this only when the user names **one** Scene (or one observed defect).

Do **not** open a Scene 01–05 full audit unless the user explicitly asks for one.

Read:

1. `PROJECT_BRAIN.md`
2. `spec/SPEC_ALIGNMENT_MANIFEST.md`
3. `spec/physics-representation-integrity-contract.md`
4. the named Scene spec and physics-state
5. the Scene's physics-boundary / runtime physics
6. the student-facing physics component(s)

Worked example (do not re-audit unless asked): Scene 05 PRI-05-01 in the contract §8.

Return separate verdicts:

```text
Physics Truth
Numerical Consistency
Runtime Calculation Integrity
Physical Representation Integrity
```

Do not change physics, evaluators, evidence semantics, UPLP, or `metadata.status` unless the user asks for a targeted repair after the review.

If the user later asks to repair, keep the repair scoped to named PRI issues. A PRI-only repair does not require PRE/POST rerun.
