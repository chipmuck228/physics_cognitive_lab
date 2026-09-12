import { SPECIFIC_HEAT_CAPACITY_ID } from "@/lib/physics-models/canonical-ids";
import type {
  CausalRelation,
  Condition,
  Counterexample,
  CurriculumMapping,
  Phenomenon,
  PhysicalQuantity,
  PhysicsModelMetadata,
  SceneDefinition,
} from "@/types/physics-model";

export const MODEL_ID = SPECIFIC_HEAT_CAPACITY_ID;

export const MODEL_TITLE = "比热容、质量与温度变化";

export const MODEL_CORE_IDEA =
  "在没有物态变化时，物体吸收或放出的能量满足 Q = c m ΔT。比热容 c 是材料的属性：它表示单位质量升高单位温度需要的能量。比较谁更烫、谁吸热更多，必须同时看 Q、m、c 和 ΔT，不能只看温度或只看加热时间。";

export const MODEL_QUANTITY_IDS = {
  heatEnergy: "heat-energy",
  mass: "mass",
  temperatureChange: "temperature-change",
  specificHeatCapacity: "specific-heat-capacity",
  material: "material",
  temperature: "temperature",
} as const;

export const MODEL_CONDITION_IDS = {
  noPhaseChange: "no-phase-change",
  massPositive: "mass-positive",
  sameMassComparison: "same-mass-comparison",
  sameEnergyComparison: "same-energy-comparison",
  sameMaterialComparison: "same-material-comparison",
  sameDeltaTComparison: "same-delta-t-comparison",
  relevantEnergyNotClock: "relevant-energy-not-clock",
  cTreatedConstant: "c-treated-constant",
} as const;

export const MODEL_RELATION_IDS = {
  heatEqualsCTimesMassTimesDeltaT: "heat-equals-c-m-delta-t",
  sameMassSameDeltaTLargerCLargerQ: "same-mass-same-delta-t-larger-c-larger-q",
  sameMassSameQLargerCSmallerDeltaT: "same-mass-same-q-larger-c-smaller-delta-t",
  sameCSameQLargerMassSmallerDeltaT: "same-c-same-q-larger-mass-smaller-delta-t",
  temperatureAloneDoesNotGiveQ: "temperature-alone-does-not-give-q",
  phaseChangeNeedsAnotherModel: "phase-change-needs-another-model",
} as const;

export const ANCHOR_PHENOMENON_ID = "equal-mass-water-and-sand";
export const ANCHOR_SCENE_ID = "equal-mass-heated-samples";

/**
 * Intended MODEL grammar. Official readiness inference currently
 * classifies this as relation-condition because it is not an energy
 * chain and does not reuse density's component IDs. Implementation
 * must still use a quantitative product/ratio board, not Scene 02/03.
 */
export const MODEL_REPRESENTATION_KIND = "ratio-quantitative" as const;

export const curriculum: CurriculumMapping = {
  grade: [9],
  units: ["内能", "比热容"],
  concepts: [
    "比热容",
    "质量",
    "温度变化",
    "吸收或放出的能量",
    "Q = c m ΔT",
    "控制变量比较",
  ],
  formulas: ["Q = c m ΔT", "c = Q / (m ΔT)"],
  examFrequency: "high",
};

export const quantities: PhysicalQuantity[] = [
  {
    id: MODEL_QUANTITY_IDS.heatEnergy,
    name: "吸收或放出的能量",
    symbol: "Q",
    unit: "J",
    role: "derived",
    studentLanguage: ["吸收了多少能量", "放出了多少热", "加热需要的能量"],
    misconceptions: ["shc-M1", "shc-M2", "shc-M5"],
  },
  {
    id: MODEL_QUANTITY_IDS.mass,
    name: "质量",
    symbol: "m",
    unit: "kg",
    role: "observable",
    studentLanguage: ["有多重", "同样多", "质量"],
    misconceptions: ["shc-M3"],
  },
  {
    id: MODEL_QUANTITY_IDS.temperatureChange,
    name: "温度变化",
    symbol: "ΔT",
    unit: "℃",
    role: "observable",
    studentLanguage: ["升了几度", "降了几度", "温度变化"],
    misconceptions: ["shc-M1", "shc-M4", "shc-M6"],
  },
  {
    id: MODEL_QUANTITY_IDS.specificHeatCapacity,
    name: "比热容",
    symbol: "c",
    unit: "J/(kg·℃)",
    role: "derived",
    studentLanguage: ["同样质量升高1℃需要多少能量", "比热容", "容不容易热起来"],
    misconceptions: ["shc-M4", "shc-M5"],
  },
  {
    id: MODEL_QUANTITY_IDS.material,
    name: "材料 / 物质种类",
    role: "state",
    studentLanguage: ["水、沙子还是别的材料"],
    misconceptions: ["shc-M2", "shc-M4"],
  },
  {
    id: MODEL_QUANTITY_IDS.temperature,
    name: "温度",
    symbol: "T",
    unit: "℃",
    role: "state",
    studentLanguage: ["现在有多热", "温度计读数"],
    misconceptions: ["shc-M1", "shc-M4"],
  },
];

export const causalRelations: CausalRelation[] = [
  {
    from: MODEL_QUANTITY_IDS.specificHeatCapacity,
    to: MODEL_QUANTITY_IDS.heatEnergy,
    relation: "depends-on",
    direction: "increase",
    conditions: [
      MODEL_CONDITION_IDS.noPhaseChange,
      MODEL_CONDITION_IDS.sameMassComparison,
      MODEL_CONDITION_IDS.sameDeltaTComparison,
    ],
  },
  {
    from: MODEL_QUANTITY_IDS.mass,
    to: MODEL_QUANTITY_IDS.heatEnergy,
    relation: "depends-on",
    direction: "increase",
    conditions: [
      MODEL_CONDITION_IDS.noPhaseChange,
      MODEL_CONDITION_IDS.sameMaterialComparison,
      MODEL_CONDITION_IDS.sameDeltaTComparison,
    ],
  },
  {
    from: MODEL_QUANTITY_IDS.temperatureChange,
    to: MODEL_QUANTITY_IDS.heatEnergy,
    relation: "depends-on",
    direction: "increase",
    conditions: [
      MODEL_CONDITION_IDS.noPhaseChange,
      MODEL_CONDITION_IDS.sameMassComparison,
      MODEL_CONDITION_IDS.sameMaterialComparison,
    ],
  },
  {
    from: MODEL_QUANTITY_IDS.specificHeatCapacity,
    to: MODEL_QUANTITY_IDS.temperatureChange,
    relation: "depends-on",
    direction: "decrease",
    conditions: [
      MODEL_CONDITION_IDS.noPhaseChange,
      MODEL_CONDITION_IDS.sameMassComparison,
      MODEL_CONDITION_IDS.sameEnergyComparison,
    ],
  },
  {
    from: MODEL_QUANTITY_IDS.material,
    to: MODEL_QUANTITY_IDS.specificHeatCapacity,
    relation: "depends-on",
    conditions: [MODEL_CONDITION_IDS.cTreatedConstant],
  },
];

export const conditions: Condition[] = [
  {
    id: MODEL_CONDITION_IDS.noPhaseChange,
    description:
      "这段过程中没有熔化、沸腾等物态变化。有物态变化时，吸收能量也可以不升温，不能直接用 Q = c m ΔT 写完整个过程。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.massPositive,
    description: "质量必须大于零。比热容是对一定质量的物质说的。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.sameMassComparison,
    description: "比较不同材料时，先让质量相同，再看温度变化或所需能量。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.sameEnergyComparison,
    description:
      "比较温度升多少时，要先说明吸收的能量是否可以看成相同。加热时间相同只是近似，不是能量本身。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.sameMaterialComparison,
    description: "比较质量或能量时，同一种材料的比热容可以看成不变。",
    importance: "important",
  },
  {
    id: MODEL_CONDITION_IDS.sameDeltaTComparison,
    description:
      "比较谁吸收的能量更多时，要先说明温度变化是否相同。只知道谁更烫，还不能断定 Q 更大。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.relevantEnergyNotClock,
    description:
      "Q 是物体吸收或放出的能量，不是钟走了多久，也不是旋钮转到了哪一档。同样加热时间只在控制比较时当作近似相同的能量输入。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.cTreatedConstant,
    description:
      "九年级把同一种物质在这段温度范围内的比热容看成常数。不引入 Cp/Cv，也不把 c 随温度细微变化当作学习目标。",
    importance: "important",
  },
];

export const counterexamples: Counterexample[] = [
  {
    scenario: "一袋冰水混合物一直在加热，温度停在 0℃。有人说模型失效，因为吸了热却没升温。",
    whyModelFails:
      "这时能量主要用来熔化，不是用来升高温度。需要 phase-change-energy，不能由 Q = c m ΔT 单独解释整段过程。",
    requiredNewModel: "phase-change-energy",
  },
  {
    scenario: "冬天摸金属栏杆比摸木头更凉。有人说金属比热容更小，所以温度更低。",
    whyModelFails:
      "手感到凉，常常是因为导热快慢，不一定是物体原来的温度或比热容不同。那更靠近 heat-transfer-direction，不是本模型的结论。",
    requiredNewModel: "heat-transfer-direction",
  },
  {
    scenario: "微波炉里的面包变热了。有人说：这就是 Q = c m ΔT，所以 Scene 01 可以删掉。",
    whyModelFails:
      "面包变热首先是能量进入系统、内能变化、温度在适当条件下升高。那是 energy-internal-energy-temperature。本模型只在已经能谈 Q、m、ΔT 时，再说明材料怎样定量影响升温。",
    requiredNewModel: "energy-internal-energy-temperature",
  },
];

export const phenomena: Phenomenon[] = [
  {
    id: ANCHOR_PHENOMENON_ID,
    title: "同样质量的水和沙子",
    description:
      "两份质量几乎相同的水和沙子，用同样的加热方式加热同样长时间。沙子明显更烫，水升得慢。这是锚点现象，不是模型本身。不要一开始就写出 Q = c m ΔT。",
    modelRole: "anchor",
    observableChanges: [
      "同样加热后，沙子温度升得更多",
      "两份样品质量几乎相同",
      "加热方式看起来一样",
    ],
    relatedVariables: [
      MODEL_QUANTITY_IDS.mass,
      MODEL_QUANTITY_IDS.temperatureChange,
      MODEL_QUANTITY_IDS.material,
      MODEL_QUANTITY_IDS.heatEnergy,
    ],
  },
  {
    id: "two-pots-water-and-oil",
    title: "同样的锅里加热水和油",
    description: "两口一样的锅，质量和加热方式尽量相同，水和食用油升温不同。",
    modelRole: "transfer",
    observableChanges: ["同样加热后温度变化不同"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.mass,
      MODEL_QUANTITY_IDS.temperatureChange,
      MODEL_QUANTITY_IDS.specificHeatCapacity,
    ],
  },
  {
    id: "coastal-vs-inland-day-night",
    title: "海边和内陆地温差",
    description: "海边昼夜温差往往更小。水面多，水和沙石的比热容不同。",
    modelRole: "transfer",
    observableChanges: ["昼夜温度变化不同"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.specificHeatCapacity,
      MODEL_QUANTITY_IDS.temperatureChange,
      MODEL_QUANTITY_IDS.mass,
    ],
  },
  {
    id: "ice-water-stays-at-zero",
    title: "冰水混合物继续加热",
    description: "冰还没化完时，继续加热，温度可以停在 0℃。",
    modelRole: "transfer",
    observableChanges: ["吸收能量", "温度暂时不变"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.heatEnergy,
      MODEL_QUANTITY_IDS.temperature,
    ],
  },
];

export const scenes: SceneDefinition[] = [
  {
    id: ANCHOR_SCENE_ID,
    primaryModel: MODEL_ID,
    secondaryModels: ["measurement-mass", "measurement-temperature"],
    phenomenonId: ANCHOR_PHENOMENON_ID,
    visualType: "interactive",
    controllableVariables: [
      "selectedSampleId",
      "comparisonMode",
      "heatingEnergy",
      "sampleMass",
    ],
    observableVariables: [
      MODEL_QUANTITY_IDS.mass,
      MODEL_QUANTITY_IDS.temperature,
      MODEL_QUANTITY_IDS.temperatureChange,
      MODEL_QUANTITY_IDS.material,
      MODEL_QUANTITY_IDS.heatEnergy,
    ],
    experimentOperations: [
      {
        id: "compare-same-mass-same-heating",
        description: "比较质量相同、加热能量可以看成相同的两种材料的温度变化。",
        variable: "comparisonMode",
        values: ["same-mass-same-heating"],
      },
      {
        id: "compare-same-material-different-mass",
        description: "比较同一种材料、加热能量相同、质量不同时的温度变化。",
        variable: "comparisonMode",
        values: ["same-material-different-mass"],
      },
      {
        id: "compare-same-sample-different-energy",
        description: "比较同一种材料、质量相同、吸收能量不同时的温度变化。",
        variable: "comparisonMode",
        values: ["same-sample-different-energy"],
      },
    ],
    physicsEngine: "deterministic-equal-mass-heat-samples",
    targetEvidence: [
      {
        id: "observation",
        description: "能说出同样加热后，有的样品更烫，有的升得慢。",
      },
      {
        id: "controlled-comparison",
        description: "能指出比较时要控制质量或吸收的能量。",
      },
      {
        id: "heat-mass-temp-relation",
        description: "能用 Q、m、c、ΔT 一起说明，而不是只谈温度或时间。",
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
    "spec/physics-model-quality-review.md",
    "spec/exam-mapping.md",
    "spec/scenes/equal-mass-heated-samples/scene-spec.md",
    "spec/scenes/equal-mass-heated-samples/physics-state.md",
  ],
  lastReviewedAt: "2026-09-12",
  notes: [
    "Canonical ID already existed in the Library as family G4. This folder fills the previously empty model definition.",
    "Deep structure is the quantitative relation Q = c m ΔT / c = Q / (m ΔT), not Scene 01's energy→internal-energy→temperature chain and not a force board.",
    "Intended MODEL presentation is a quantitative product/ratio board. L4 requires the locked six-part ratio evidence, not formula assembly alone.",
    "Production anchor Scene is equal-mass-heated-samples. Named engine is deterministic-equal-mass-heat-samples.",
    "PRE refinements applied 2026-09-12: causal-relation controls, L4 lock, heating-time approximation copy, coastal/car non-transfer, AI_OFF conclusion-only rejection.",
    "measurement-mass and measurement-temperature are supporting only.",
    "Phase change, heat-transfer direction, and Scene 01's qualitative energy chain are boundaries, not this model's conclusions.",
    "Scene 05 equal-mass-heated-samples is a quality-reviewed prototype after POST LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS.",
    "Library metadata.status is prototype. This is not learner validation.",
  ],
};
