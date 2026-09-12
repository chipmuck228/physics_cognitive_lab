# Learner Validation Session Review

> Fill after one observation.  
> Protocol: [`../learner-validation-prep.md`](../learner-validation-prep.md)  
> Do not change model `metadata.status`. Do not write `validated`.

Use the labels **OBSERVED** / **INFERRED** / **NOT YET SUPPORTED** from the prep protocol.  
If a section has no data, write `NO DATA` rather than inventing a finding.

---

## 1. Session Summary

- Session ID (anonymous only): `LV-`
- Date (optional):
- Observer:
- Adult present (Y/N):
- Think-aloud used (Y/N):
- Total duration (minutes):
- Reached COMPLETE? (Y/N):
- Rescue used? (Y/N; stage; procedural line or stop):
- One-sentence summary of what happened (facts only):

## 2. Selected Scene

- FIRST_VALIDATION_SCENE: SCENE_03
- SCENE_ID: `horizontal-force-cart`
- MODEL_ID: `force-changes-motion-state`
- Route: `/scenes/horizontal-force-cart`
- localStorage key: `physics-lab.session.horizontal-force-cart.v1`
- Product `sessionId` (UUID, not a person):
- Clean reset confirmed before start? (Y/N):

## 3. Completion Path

- Last official `stage`:
- `completed`:
- Stages entered (`events` where `type === "stage_entered"`):
- Approximate time per stage (derived from event timestamps):
- Abandoned / stopped at:
- Adult takeover? (Y/N):

## 4. Stage-by-Stage Observations

For each stage that occurred: what they did, what they said, help, hint, confusion.

| Stage | OBSERVED action | OBSERVED speech | Help? | Product hint? | Confusion / stop |
|---|---|---|---|---|---|
| ENTRY | | | | | |
| OBSERVE | | | | | |
| DESCRIBE | | | | | |
| PREDICT | | | | | |
| EXPERIMENT | | | | | |
| EXPLAIN | | | | | |
| MODEL | | | | | |
| TRANSFER | | | | | |
| EXAM | | | | | |
| AI_OFF | | | | | |
| COMPLETE | | | | | |

## 5. MODEL Evidence

Official product fields (do not treat as understanding):

- `modelAttempts.length`:
- Last `correctStructure`:
- `failureKinds`:
- Conditions selected:

Observer notes:

- OBSERVED:
- INFERRED (must cite an OBSERVED basis):
- Click-through warning? (fast correct board + cannot restate the three cases)

## 6. Transfer Evidence

- Bicycle `near-bicycle-speeding-up`: accepted / failed / not reached; `failureKinds`; short quote
- Ball `medium-ball-opposite-force`: accepted / failed / not reached; `failureKinds`; short quote
- Hover `far-hover-constant-velocity`: accepted / failed / not reached; `failureKinds`; short quote
- `surfaceCueSelected` anywhere? (Y/N)
- Did they treat transfer as the same problem or a new one? (post-session Q4 + speech)

Label each sentence OBSERVED or INFERRED.

## 7. AI_OFF Evidence

- Tutor visible? (should be no)
- `independentAssessment.llmUsed`:
- `completedWithoutAI`:
- Any `aiInteractions` on AI_OFF / COMPLETE? (incident if yes)
- Hover sled: `accepted`; pre-commit reasoning quote; post-check only?
- Tug / crate: `accepted`; pre-commit reasoning quote; post-check only?
- Waited for a hidden tutor or asked the observer to teach? (Y/N)

## 8. Hint / Tutor Use

- `aiInteractions.length`:
- Count by `action` (HINT / ASK / CHALLENGE / ENCOURAGE / EXPLAIN):
- Stages where tutor was used:
- Learner asked observer for help (count / quotes):
- Post-session: hint helped thinking vs pointed to the next click

## 9. Confusion / Friction

- Hardest stage (learner words + observer watch):
- Longest time gap between `stage_entered` events:
- Reading / UI / “what does this page want?” vs physics confusion:
- Boredom or rush-click:

## 10. Observed Misconceptions

Only if spoken or clearly enacted. Quote first.

- Force means motion:
- Zero net force must stop:
- Force direction must match motion:
- Other:
- Do **not** diagnose a misconception from a single wrong radio alone.

## 11. Engagement Signals

- Stayed / asked to stop / wanted another Scene:
- Affect notes (curious, tired, annoyed) — OBSERVED behavior, not a score:
- Would they voluntarily do another Scene? (post-session Q6)

## 12. What This Session Supports

List only claims that this **one** session can support, each tagged OBSERVED or carefully INFERRED.

Examples of allowed support:

- “This learner reached MODEL in about N minutes.”
- “This learner said ‘没有力就会停’ on the hover case.”
- “Official transfer `accepted` was true while the spoken reason was generic.”

## 13. What This Session Does NOT Support

Write explicitly. At minimum include:

- Not population evidence
- Not durable learning
- Not a `validated` model
- Not proof that UPLP works
- Not proof that Scene 04 / other Scenes would behave the same
- Not an exam-score claim

Add anything else this session cannot support.

## 14. Product Changes Suggested

Suggestions only. Do not implement in this review.

- Must-fix before another observation? (Y/N; what)
- Nice-to-have UI / copy:
- Instrumentation still unnecessary? (default: yes)
- Scene 04 as second observation? (only after this review)

## 15. Confidence / Unknowns

- Confidence that notes match what happened (low / medium / high):
- What we still do not know:
- Whether a second learner on Scene 03 is more informative than switching to Scene 04:
- Confirmation: `metadata.status` unchanged; no learner-validation claim written
