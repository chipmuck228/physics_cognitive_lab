/**
 * Production sitting and MODEL grammar locks for the PRE-approved model.
 * This is not a SceneAdapter, physics engine, or UI.
 * Scene 01 focused legacy migration implements these sitting locks.
 * POST is LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS.
 * metadata.status = prototype. Quality-reviewed prototype. Not learner-validated.
 */
export const PRODUCTION_SCENE_ID = "microwave-bread" as const;
export const PRODUCTION_PHYSICS_ENGINE =
  "deterministic-microwave-pedagogical-approximation" as const;

export const PRODUCTION_TRANSFER_REQUIRED_IDS = [
  "near-kettle-heating-water",
  "far-ice-absorbs-energy",
] as const;

export const PRODUCTION_TRANSFER_AVAILABLE_NOT_REQUIRED_IDS = [
  "medium-hot-water-bag",
  "partial-rubbing-hands",
] as const;

export const PRODUCTION_EXAM_PATTERN_IDS = [
  "exam-temperature-is-not-internal-energy",
  "exam-energy-in-need-not-raise-temperature",
  "exam-hotter-not-always-more-internal-energy",
] as const;

export const PRODUCTION_AI_OFF_IDS = [
  "ai-off-unfamiliar-metal-spoon",
  "ai-off-condition-ice-absorbs-energy",
] as const;

export const PRODUCTION_AI_OFF_PURPOSE = {
  "ai-off-unfamiliar-metal-spoon":
    "NORMAL APPLICATION: independently apply energy transfer → internal-energy change → temperature may rise under ordinary conditions.",
  "ai-off-condition-ice-absorbs-energy":
    "BOUNDARY CHECK: independently recognize that energy entering does not justify temperature-must-rise when the relevant condition is absent.",
} as const;

/**
 * Official MODEL grammar. Readiness inference reports energy-chain because
 * energyRelations exist. Implementation must use this model's energy/state
 * chain plus conditions, not Scene 02's work/mechanical-output slots.
 */
export const PRODUCTION_MODEL_REPRESENTATION = {
  kind: "energy-state-chain",
  board:
    "energy transfer → internal-energy change → temperature may change, plus T ≠ U and at least one essential condition",
  forbiddenCopies: [
    "Scene 02 chemical → work → mechanical slots",
    "Scene 03 three-case force/motion board",
    "Scene 04 mass/volume/density table",
    "Scene 05 Q = c m ΔT product board",
    "legacy three visible boxes without conditions",
  ],
} as const;

export const PRODUCTION_EXPERIMENT_SCOPE = {
  microwaveWithinBoundary: "more-energy-in-no-phase-change",
  microwaveDoesNotProve: "energy input ALWAYS raises temperature",
  boundaryEstablishedBy: "far-ice-absorbs-energy transfer plus AI_OFF B",
} as const;
