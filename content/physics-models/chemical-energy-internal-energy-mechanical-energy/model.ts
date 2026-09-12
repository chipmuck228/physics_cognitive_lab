import { CHEMICAL_ENERGY_INTERNAL_ENERGY_MECHANICAL_ENERGY_ID } from "@/lib/physics-models/canonical-ids";
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

export const MODEL_ID = CHEMICAL_ENERGY_INTERNAL_ENERGY_MECHANICAL_ENERGY_ID;

export const MODEL_TITLE = "化学能—内能—机械能转化";

export const MODEL_CORE_IDEA =
  "燃料燃烧时，燃料的化学能发生转化，使工作物质的内能和状态发生变化；工作物质可以通过做功把能量传递给机械系统，最终表现为机械能。实际装置还会有损耗，九年级先抓住这条主能量链。";

export const MODEL_QUANTITY_IDS = {
  fuelChemicalEnergy: "fuel-chemical-energy",
  workingGasInternalEnergy: "working-gas-internal-energy",
  workingGasState: "working-gas-state",
  pistonMotion: "piston-mechanical-motion",
  mechanicalEnergy: "mechanical-energy",
} as const;

export const MODEL_CONDITION_IDS = {
  combustionOccurs: "combustion-occurs",
  workingGasCanChange: "working-gas-can-change",
  movableMechanicalSystem: "movable-mechanical-system",
  gasDoesWork: "gas-does-work",
  mainPathApproximation: "main-path-approximation",
} as const;

export const MODEL_RELATION_IDS = {
  chemicalConvertsToInternal:
    "fuel-chemical-energy-converts-to-working-gas-internal-energy",
  internalEnergyChangesState: "working-gas-internal-energy-changes-state",
  workingGasDoesWork: "working-gas-does-work-on-mechanical-system",
  mechanicalEnergyOutput: "mechanical-energy-output",
} as const;

export const SCENE_EVENT_IDS = {
  combustion: "combustion-event",
} as const;

export const ANCHOR_PHENOMENON_ID = "four-stroke-internal-combustion-engine";
export const ANCHOR_SCENE_ID = "four-stroke-engine";

export const curriculum: CurriculumMapping = {
  grade: [9],
  units: ["机械能", "内能", "能量转化与守恒"],
  concepts: [
    "化学能",
    "内能",
    "做功",
    "机械能",
    "能量转化",
    "能量转移",
  ],
  examFrequency: "high",
};

export const quantities: PhysicalQuantity[] = [
  {
    id: MODEL_QUANTITY_IDS.fuelChemicalEnergy,
    name: "燃料的化学能",
    role: "input",
    studentLanguage: [
      "燃料里储存的化学能",
      "汽油、柴油等燃料带有的能量",
    ],
    misconceptions: ["ceime-M1"],
  },
  {
    id: MODEL_QUANTITY_IDS.workingGasInternalEnergy,
    name: "工作物质的内能",
    role: "state",
    studentLanguage: ["气体的内能", "燃烧后气体里的能量"],
    misconceptions: ["ceime-M1", "ceime-M5"],
  },
  {
    id: MODEL_QUANTITY_IDS.workingGasState,
    name: "工作物质的状态",
    role: "state",
    studentLanguage: ["气体变热、膨胀", "气体的状态发生了变化"],
    misconceptions: ["ceime-M5"],
  },
  {
    id: MODEL_QUANTITY_IDS.pistonMotion,
    name: "活塞/机械部件的运动",
    role: "observable",
    studentLanguage: ["活塞被推着动", "机械部件开始运动"],
    misconceptions: ["ceime-M2", "ceime-M4"],
  },
  {
    id: MODEL_QUANTITY_IDS.mechanicalEnergy,
    name: "机械能",
    role: "derived",
    studentLanguage: ["机械运动对应的能量", "曲轴转动、车子能走"],
    misconceptions: ["ceime-M1", "ceime-M6"],
  },
];

export const causalRelations: CausalRelation[] = [
  {
    from: MODEL_QUANTITY_IDS.fuelChemicalEnergy,
    to: MODEL_QUANTITY_IDS.workingGasInternalEnergy,
    relation: "converts",
    direction: "increase",
    conditions: [MODEL_CONDITION_IDS.combustionOccurs],
  },
  {
    from: MODEL_QUANTITY_IDS.workingGasInternalEnergy,
    to: MODEL_QUANTITY_IDS.workingGasState,
    relation: "changes",
    conditions: [MODEL_CONDITION_IDS.workingGasCanChange],
  },
  {
    from: MODEL_QUANTITY_IDS.workingGasState,
    to: MODEL_QUANTITY_IDS.pistonMotion,
    relation: "causes",
    conditions: [
      MODEL_CONDITION_IDS.movableMechanicalSystem,
      MODEL_CONDITION_IDS.gasDoesWork,
    ],
  },
  {
    from: MODEL_QUANTITY_IDS.pistonMotion,
    to: MODEL_QUANTITY_IDS.mechanicalEnergy,
    relation: "changes",
    direction: "increase",
    conditions: [MODEL_CONDITION_IDS.gasDoesWork],
  },
];

export const energyRelations: EnergyRelation[] = [
  {
    source: MODEL_QUANTITY_IDS.fuelChemicalEnergy,
    destination: MODEL_QUANTITY_IDS.workingGasInternalEnergy,
    mechanism: "conversion",
    description:
      "燃料燃烧时，燃料的化学能发生转化，使燃烧产物（工作气体）的内能增加、状态改变。这是能量转化，不是气体直接把曲轴转起来。",
    conditions: [MODEL_CONDITION_IDS.combustionOccurs],
  },
  {
    source: MODEL_QUANTITY_IDS.workingGasInternalEnergy,
    destination: MODEL_QUANTITY_IDS.mechanicalEnergy,
    mechanism: "work",
    description:
      "工作气体通过对活塞等可运动机械部件做功，把能量传递给机械系统，最终表现为机械能。化学能不能跳过做功这一步，直接变成曲轴转动。",
    conditions: [
      MODEL_CONDITION_IDS.movableMechanicalSystem,
      MODEL_CONDITION_IDS.gasDoesWork,
    ],
  },
];

export const conditions: Condition[] = [
  {
    id: MODEL_CONDITION_IDS.combustionOccurs,
    description: "燃料发生燃烧，化学能才可能按这条主链释放出来。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.workingGasCanChange,
    description: "工作物质能够发生相应的内能变化和状态变化。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.movableMechanicalSystem,
    description: "工作物质能够作用在可以运动的机械部件上。部件如果被卡住，就做不成有用的机械功。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.gasDoesWork,
    description: "气体确实对机械系统做了功。只燃烧、只升温，不等于已经输出机械能。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.mainPathApproximation,
    description:
      "真实装置还有摩擦、散热等损耗。九年级模型先抓住主能量链，不假装“化学能全部变成了机械能”。",
    importance: "important",
  },
];

export const counterexamples: Counterexample[] = [
  {
    scenario: "燃料在开阔空气中燃烧，旁边没有可以推动的活塞或机械系统。",
    whyModelFails:
      "化学能可以转化，工作物质的内能也可能变化，但缺少“气体对机械系统做功”这一步，主链不能完整走到机械能输出。",
  },
  {
    scenario: "电动机带动转轴转动。",
    whyModelFails:
      "这里确实有机械能输出，但起始能量来自电能，不是燃料的化学能，不能套用化学能这一段。",
    requiredNewModel: "electrical-energy-conversion",
  },
];

export const phenomena: Phenomenon[] = [
  {
    id: ANCHOR_PHENOMENON_ID,
    title: "四冲程内燃机",
    description:
      "用汽油机等四冲程内燃机作为锚点现象：可以看见活塞运动、气门开闭、点火燃烧、气体膨胀和曲轴转动。四个冲程属于这个现象的表示，不是模型本身。",
    modelRole: "anchor",
    observableChanges: [
      "活塞上下运动",
      "进气门、排气门开闭",
      "点火/燃烧发生",
      "气体状态变化、膨胀",
      "曲轴转动",
    ],
    relatedVariables: [
      MODEL_QUANTITY_IDS.workingGasState,
      MODEL_QUANTITY_IDS.pistonMotion,
      MODEL_QUANTITY_IDS.mechanicalEnergy,
    ],
  },
  {
    id: "motorcycle-piston-engine",
    title: "摩托车活塞发动机",
    description: "同样是燃料燃烧推动活塞，但外观和场景与教学用四冲程图不同。",
    modelRole: "transfer",
    observableChanges: ["活塞运动", "车辆获得动力"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.fuelChemicalEnergy,
      MODEL_QUANTITY_IDS.pistonMotion,
      MODEL_QUANTITY_IDS.mechanicalEnergy,
    ],
  },
  {
    id: "steam-expanding-fluid-piston",
    title: "蒸汽推动活塞",
    description:
      "高温蒸汽膨胀推动活塞。后半段“内能/状态变化 → 做功 → 机械能”可能仍适用，起始的化学能一段不一定适用。",
    modelRole: "transfer",
    observableChanges: ["蒸汽膨胀", "活塞运动"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.workingGasInternalEnergy,
      MODEL_QUANTITY_IDS.pistonMotion,
      MODEL_QUANTITY_IDS.mechanicalEnergy,
    ],
  },
];

export const scenes: SceneDefinition[] = [
  {
    id: ANCHOR_SCENE_ID,
    primaryModel: MODEL_ID,
    secondaryModels: [
      "mechanical-work-energy-transfer",
      "force-changes-motion-state",
    ],
    phenomenonId: ANCHOR_PHENOMENON_ID,
    visualType: "interactive",
    controllableVariables: ["combustionEnabled", "pistonCanMove"],
    observableVariables: [
      SCENE_EVENT_IDS.combustion,
      MODEL_QUANTITY_IDS.workingGasState,
      MODEL_QUANTITY_IDS.pistonMotion,
      MODEL_QUANTITY_IDS.mechanicalEnergy,
    ],
    experimentOperations: [
      {
        id: "set-combustion-enabled",
        description: "压缩完成后是否发生正常燃烧。",
        variable: "combustionEnabled",
        values: [true, false],
      },
      {
        id: "set-piston-can-move",
        description: "活塞或机械部件是否可以运动。",
        variable: "pistonCanMove",
        values: [true, false],
      },
    ],
    physicsEngine: "deterministic-four-stroke-engine",
    targetEvidence: [
      { id: "observation", description: "能说出活塞、燃烧、曲轴等可观察变化。" },
      { id: "energy-source", description: "能指出起始能量来自燃料的化学能。" },
      { id: "work-process", description: "能指出气体对机械系统做功这一步。" },
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
  ],
  lastReviewedAt: "2026-09-12",
  notes: [
    "Four-stroke names belong to the anchor Scene representation, not to this Physics Model.",
    "Library metadata.status is prototype after POST LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS. Not learner-validated.",
    "Combustion is a process/condition that enables chemical-to-internal conversion; it is not a PhysicalQuantity.",
    "Pressure is not part of the reusable causal chain. Expansion work does not require claiming that gas pressure always increases.",
  ],
};
