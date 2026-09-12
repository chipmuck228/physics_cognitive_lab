import type { PhysicsModel } from "@/types/physics-model";

import { examPatterns } from "./exam";
import { experiments } from "./experiments";
import { independentChallenges } from "./independent-challenges";
import { misconceptions } from "./misconceptions";
import {
  causalRelations,
  conditions,
  counterexamples,
  curriculum,
  metadata,
  MODEL_CORE_IDEA,
  MODEL_ID,
  MODEL_TITLE,
  phenomena,
  quantities,
  scenes,
} from "./model";
import { modelEvaluatorSpec } from "./evaluator";
import { transferTargets } from "./transfer";
import { tutorPolicy } from "./tutor-policy";

export const convexLensImagingModel: PhysicsModel = {
  id: MODEL_ID,
  title: MODEL_TITLE,
  coreIdea: MODEL_CORE_IDEA,
  domain: ["optics"],
  curriculum,
  quantities,
  causalRelations,
  conditions,
  counterexamples,
  misconceptions,
  phenomena,
  scenes,
  experiments,
  transferTargets,
  examPatterns,
  tutorPolicy,
  independentChallenges,
  modelEvaluator: modelEvaluatorSpec,
  metadata,
};

export {
  ANCHOR_PHENOMENON_ID,
  ANCHOR_SCENE_ID,
  MODEL_CONDITION_IDS,
  MODEL_CORE_IDEA,
  MODEL_ID,
  MODEL_QUANTITY_IDS,
  MODEL_RELATION_IDS,
  MODEL_REPRESENTATION_KIND,
  MODEL_TITLE,
} from "./model";
export {
  EVALUATOR_COMPONENT_IDS,
  MINIMUM_L4_CONSTRUCTION_EVIDENCE,
  MINIMUM_L4_MODEL_COMPLETENESS,
  MINIMUM_L4_MODEL_EVIDENCE,
  WEAKEST_PASS_PROBES,
} from "./evaluator";
export { convexLensImagingAssessmentOverlay } from "./assessment-overlay";
export {
  PRODUCTION_AI_OFF_IDS,
  PRODUCTION_EXAM_PATTERN_IDS,
  PRODUCTION_MODEL_REPRESENTATION,
  PRODUCTION_PHYSICS_ENGINE,
  PRODUCTION_SCENE_ID,
  PRODUCTION_TRANSFER_AVAILABLE_NOT_REQUIRED_IDS,
  PRODUCTION_TRANSFER_REQUIRED_IDS,
} from "./implementation-contract";
export { examPatterns } from "./exam";
export { experiments } from "./experiments";
export { independentChallenges } from "./independent-challenges";
export { misconceptions } from "./misconceptions";
export { transferTargets } from "./transfer";
export {
  officialImagingState,
  officialPartialCoverEffect,
  officialRealImageTrendTowardF,
  officialScreenReceive,
  OBJECT_STATIONS,
} from "./physics-boundary";
