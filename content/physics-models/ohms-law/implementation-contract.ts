/**
 * Production sitting and MODEL grammar locks for the PRE-approved model.
 * This is not a SceneAdapter, physics engine, or UI.
 * POST is LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS.
 * metadata.status = prototype. Quality-reviewed prototype. Not learner-validated.
 */
export const PRODUCTION_SCENE_ID = "simple-resistor-circuit" as const;
export const PRODUCTION_PHYSICS_ENGINE = "deterministic-simple-resistor-circuit" as const;

export const PRODUCTION_TRANSFER_REQUIRED_IDS = [
  "near-heating-wire-one-resistor",
  "far-filament-lamp-not-constant-r",
] as const;

export const PRODUCTION_TRANSFER_AVAILABLE_NOT_REQUIRED_IDS = [
  "medium-exam-diagram-one-resistor",
  "far-flashlight-cell-and-resistor",
  "partial-ammeter-is-not-series-circuit-course",
] as const;

export const PRODUCTION_EXAM_PATTERN_IDS = [
  "exam-same-r-larger-u-larger-i",
  "exam-same-u-larger-r-smaller-i",
  "exam-r-is-not-made-by-u-and-i",
  "exam-calculate-i-from-u-and-r",
  "exam-filament-not-constant-r",
] as const;

export const PRODUCTION_AI_OFF_IDS = [
  "ai-off-unfamiliar-toy-motor-resistor",
  "ai-off-condition-r-not-made-by-division",
] as const;

/**
 * Official MODEL grammar. Readiness inference will likely report
 * relation-condition because density ratio keys are absent. Implementation
 * must still use this I–U–R relation board, not Scene 02/03/04/05 copies
 * and not six independent completeness radios.
 */
export const PRODUCTION_MODEL_REPRESENTATION = {
  kind: "ratio-quantitative",
  board: "I = U / R controlled-relation board",
  forbiddenCopies: [
    "Scene 02 energy chain",
    "Scene 03 force/motion board",
    "Scene 04 mass/volume/density table",
    "Scene 05 Q = c m ΔT product board",
    "six independent L4 completeness radios",
  ],
} as const;
