import { ENERGY_INTERNAL_ENERGY_TEMPERATURE_ID } from "@/lib/physics-models/canonical-ids";
import type {
  CausalRelation,
  Condition,
  Counterexample,
  CurriculumMapping,
  EnergyRelation,
  Phenomenon,
  PhysicalQuantity,
  PhysicsModelMetadata,
  SceneDefinition,
} from "@/types/physics-model";

export const MODEL_ID = ENERGY_INTERNAL_ENERGY_TEMPERATURE_ID;

export const MODEL_TITLE = "能量传递、内能与温度";

export const MODEL_CORE_IDEA =
  "能量进入或离开一个系统时，系统的内能会改变。在适当条件下，温度可能随之改变。温度不是内能，热不是储存在物体里的东西，能量进入也不等于温度一定升高。";

export const MODEL_QUANTITY_IDS = {
  energyTransfer: "energy-transfer",
  internalEnergy: "internal-energy",
  temperature: "temperature",
  temperatureChange: "temperature-change",
} as const;

export const MODEL_CONDITION_IDS = {
  noPhaseChange: "no-phase-change",
  sameSystemCompared: "same-system-compared",
  heatIsProcessNotStore: "heat-is-process-not-store",
  temperatureNotInternalEnergy: "temperature-not-internal-energy",
  energyInDoesNotRequireTemperatureRise: "energy-in-does-not-require-temperature-rise",
  microwaveMechanismNotRequired: "microwave-mechanism-not-required",
} as const;

export const MODEL_RELATION_IDS = {
  energyTransferChangesInternalEnergy: "energy-transfer-changes-internal-energy",
  internalEnergyMayChangeTemperature: "internal-energy-may-change-temperature",
  temperatureDoesNotEqualInternalEnergy: "temperature-does-not-equal-internal-energy",
  heatIsNotStoredSubstance: "heat-is-not-stored-substance",
  energyInDoesNotAlwaysRaiseTemperature:
    "energy-in-does-not-always-raise-temperature",
} as const;

export const ANCHOR_PHENOMENON_ID = "microwave-heated-bread";
export const ANCHOR_SCENE_ID = "microwave-bread";

/**
 * Intended MODEL grammar: this model's energy/state causal chain
 * plus conditions. Not Scene 02's chemical → work → mechanical chain.
 */
export const MODEL_REPRESENTATION_KIND = "energy-state-chain" as const;

export const curriculum: CurriculumMapping = {
  grade: [9],
  units: ["内能", "温度"],
  concepts: [
    "温度",
    "内能",
    "能量传递",
    "热是过程不是储存物",
    "温度变化的条件",
  ],
  examFrequency: "high",
};

export const quantities: PhysicalQuantity[] = [
  {
    id: MODEL_QUANTITY_IDS.energyTransfer,
    name: "能量传递（进入或离开系统）",
    role: "input",
    studentLanguage: ["能量进来了", "能量离开了", "吸收能量", "放出能量"],
    misconceptions: ["eiet-M1", "eiet-M5"],
  },
  {
    id: MODEL_QUANTITY_IDS.internalEnergy,
    name: "内能",
    symbol: "U",
    role: "state",
    studentLanguage: ["内能", "系统的能量状态", "里面的能量状态变了"],
    misconceptions: ["eiet-M3", "eiet-M4"],
  },
  {
    id: MODEL_QUANTITY_IDS.temperature,
    name: "温度",
    symbol: "T",
    unit: "℃",
    role: "observable",
    studentLanguage: ["温度", "有多热", "温度计读数"],
    misconceptions: ["eiet-M3", "eiet-M4"],
  },
  {
    id: MODEL_QUANTITY_IDS.temperatureChange,
    name: "温度变化",
    symbol: "ΔT",
    unit: "℃",
    role: "derived",
    studentLanguage: ["升高了", "降低了", "温度差不多不变"],
    misconceptions: ["eiet-M2"],
  },
];

export const causalRelations: CausalRelation[] = [
  {
    from: MODEL_QUANTITY_IDS.energyTransfer,
    to: MODEL_QUANTITY_IDS.internalEnergy,
    relation: "changes",
    conditions: [MODEL_CONDITION_IDS.heatIsProcessNotStore],
  },
  {
    from: MODEL_QUANTITY_IDS.internalEnergy,
    to: MODEL_QUANTITY_IDS.temperatureChange,
    relation: "changes",
    conditions: [
      MODEL_CONDITION_IDS.noPhaseChange,
      MODEL_CONDITION_IDS.energyInDoesNotRequireTemperatureRise,
    ],
  },
  {
    from: MODEL_QUANTITY_IDS.temperature,
    to: MODEL_QUANTITY_IDS.internalEnergy,
    relation: "depends-on",
    conditions: [
      MODEL_CONDITION_IDS.sameSystemCompared,
      MODEL_CONDITION_IDS.temperatureNotInternalEnergy,
    ],
  },
];

export const energyRelations: EnergyRelation[] = [
  {
    source: MODEL_QUANTITY_IDS.energyTransfer,
    destination: MODEL_QUANTITY_IDS.internalEnergy,
    mechanism: "mixed",
    description:
      "能量进入或离开系统时，系统的内能改变。这是过程，不是把“热”装进物体。具体是热传递还是做功，属于邻近模型 internal-energy-change-mechanisms。",
    conditions: [MODEL_CONDITION_IDS.heatIsProcessNotStore],
  },
];

export const conditions: Condition[] = [
  {
    id: MODEL_CONDITION_IDS.noPhaseChange,
    description:
      "在没有物态变化时，系统吸收或放出能量，温度通常会改变。物态变化时不能直接推出温度一定变。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.sameSystemCompared,
    description:
      "比较内能大小时，必须是同一个系统，或同时知道质量、材料和状态。不能只凭温度比较总内能。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.heatIsProcessNotStore,
    description: "热描述能量怎样传递，不是储存在物体里的一种东西。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.temperatureNotInternalEnergy,
    description: "温度是可观察的状态量。内能是系统的能量状态。二者相关，但不是同一件事。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.energyInDoesNotRequireTemperatureRise,
    description: "能量进入系统，内能可以改变，温度不一定升高。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.microwaveMechanismNotRequired,
    description:
      "微波炉电磁机制、极化损耗不是本模型的学习目标。面包只是锚点现象。",
    importance: "important",
  },
];

export const counterexamples: Counterexample[] = [
  {
    scenario: "冰水混合物继续吸热，温度可以保持在 0℃ 附近。",
    whyModelFails:
      "能量进入了系统，但不能推出温度一定升高。需要 phase-change-energy。",
    requiredNewModel: "phase-change-energy",
  },
  {
    scenario: "同样温度的一大盆水和一小杯水，不能只凭温度比较谁的总内能更大。",
    whyModelFails:
      "温度不是总内能。质量和材料未知时，温度信息不够。定量比较属于 specific-heat-capacity。",
    requiredNewModel: "specific-heat-capacity",
  },
  {
    scenario: "两只手来回搓会变暖。",
    whyModelFails:
      "结果仍可能是内能和温度变化，但能量改变的方式是做功，不是本模型要新建的机制。",
    requiredNewModel: "internal-energy-change-mechanisms",
  },
  {
    scenario: "手摸热水袋变暖，要判断能量从哪边传到哪边。",
    whyModelFails:
      "本模型可以解释手的内能和温度可能怎样变，但不承担“由高温到低温”的方向规则。",
    requiredNewModel: "heat-transfer-direction",
  },
  {
    scenario: "比较水和沙子谁升得更快，或计算 Q = c m ΔT。",
    whyModelFails: "那是材料如何定量影响升温，不是本模型。",
    requiredNewModel: "specific-heat-capacity",
  },
];

export const phenomena: Phenomenon[] = [
  {
    id: ANCHOR_PHENOMENON_ID,
    title: "微波炉里的面包变热",
    description:
      "一片面包放进微波炉加热后摸起来更热。这是锚点现象，不是模型本身。模型是可迁移的能量—内能—温度关系。",
    modelRole: "anchor",
    observableChanges: ["面包变热", "温度读数升高"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.temperature,
      MODEL_QUANTITY_IDS.temperatureChange,
      MODEL_QUANTITY_IDS.energyTransfer,
    ],
  },
  {
    id: "kettle-heating-water",
    title: "电热水壶加热水",
    description: "水被加热后温度升高。表面装置不同，深结构仍是能量进入、内能改变、温度在适当条件下升高。",
    modelRole: "transfer",
    observableChanges: ["水温升高"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.energyTransfer,
      MODEL_QUANTITY_IDS.internalEnergy,
      MODEL_QUANTITY_IDS.temperatureChange,
    ],
  },
  {
    id: "ice-absorbing-energy",
    title: "冰吸热但温度可以几乎不变",
    description: "冰或冰水混合物吸收能量时，温度可以暂时几乎不变。用来对照“能量进入就一定升温”。",
    modelRole: "transfer",
    observableChanges: ["可能熔化", "温度可以几乎不变"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.energyTransfer,
      MODEL_QUANTITY_IDS.internalEnergy,
      MODEL_QUANTITY_IDS.temperatureChange,
    ],
  },
];

export const scenes: SceneDefinition[] = [
  {
    id: ANCHOR_SCENE_ID,
    primaryModel: MODEL_ID,
    secondaryModels: [
      "internal-energy-change-mechanisms",
      "heat-transfer-direction",
    ],
    phenomenonId: ANCHOR_PHENOMENON_ID,
    visualType: "interactive",
    controllableVariables: ["powerW", "heatingTimeSec"],
    observableVariables: [
      MODEL_QUANTITY_IDS.temperature,
      MODEL_QUANTITY_IDS.temperatureChange,
    ],
    experimentOperations: [
      {
        id: "change-heating-time",
        description: "改变加热时间，观察温度变化。",
        variable: "heatingTimeSec",
      },
      {
        id: "change-power",
        description: "改变功率，观察温度变化。",
        variable: "powerW",
      },
    ],
    physicsEngine: "deterministic-microwave-pedagogical-approximation",
    targetEvidence: [
      {
        id: "observation",
        description:
          "能识别面包这个系统，并把可观察变化说成对象 + 温度 + 升高。单独写“变热了”不够。",
      },
      {
        id: "energy-internal-temperature-relation",
        description: "能建立能量传递 → 内能变化 → 温度在适当条件下可能改变。",
      },
      {
        id: "condition-boundary",
        description: "能指出温度不是内能，能量进入不等于温度一定升高。",
      },
    ],
  },
];

export const metadata: PhysicsModelMetadata = {
  version: "0.1.0",
  status: "prototype",
  sourceReferences: [
    "spec/physics-model-schema.md",
    "spec/physics-model-library.md",
    "spec/universal-physics-learning-protocol.md",
    "spec/evidence-design-contract.md",
    "spec/learning-spec.md",
    "spec/reviews/pre/energy-internal-energy-temperature.md",
    "spec/scenes/microwave-bread/evidence-claim-design.md",
  ],
  lastReviewedAt: "2026-09-12",
  notes: [
    "Canonical Library ID already existed. This folder fills the previously empty definition.",
    "Microwave bread is the anchor phenomenon, not the model.",
    "Scene 01 focused legacy migration implements the Evidence Claim Design. Do not treat leftover explanationLevel 0–4 as official evidence.",
    "energyRelations describe energy transfer into the system. They do not authorize Scene 02's work/mechanical-output MODEL slots.",
    "Secondary models are supporting connections only.",
    "PRE does not authorize prototype or Scene migration.",
    "Required production transfer pair is kettle full-model + ice boundary-contrast. Rubbing hands is available, not required.",
    "AI_OFF A is ordinary application. AI_OFF B is the energy-in boundary check. They are not the same claim.",
    "Readiness + Evidence Claim Design completed 2026-09-12. Focused legacy migration implemented 2026-09-12. POST 2026-09-12 is LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS. metadata.status = prototype. Quality-reviewed prototype. Not learner-validated.",
  ],
};
