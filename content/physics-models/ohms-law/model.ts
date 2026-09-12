import { OHMS_LAW_ID } from "@/lib/physics-models/canonical-ids";
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

export const MODEL_ID = OHMS_LAW_ID;

export const MODEL_TITLE = "欧姆定律：电流、电压与电阻的关系";

export const MODEL_CORE_IDEA =
  "对一段可以看成电阻不变的导体，通过它的电流、它两端的电压和它的电阻满足 I = U / R。这是三个物理量之间的关系，不是一句要背的口号。电阻不变时，电压越大电流越大；电压不变时，电阻越大电流越小。把式子改写成 U = I R 或 R = U / I，只是同一种关系的数学变形，不能说成“电流决定电压”或“电压和电流制造了电阻”。";

export const MODEL_QUANTITY_IDS = {
  current: "current",
  voltage: "voltage",
  resistance: "resistance",
  circuitClosed: "circuit-closed",
} as const;

export const MODEL_CONDITION_IDS = {
  closedCircuit: "closed-circuit",
  ohmicResistanceTreatedConstant: "ohmic-resistance-treated-constant",
  resistancePositive: "resistance-positive",
  sameResistanceComparison: "same-resistance-comparison",
  sameVoltageComparison: "same-voltage-comparison",
  voltageAcrossSameComponent: "voltage-across-same-component",
  currentThroughSameComponent: "current-through-same-component",
  rearrangementIsNotNewCause: "rearrangement-is-not-new-cause",
  singleResistorScope: "single-resistor-scope",
} as const;

export const MODEL_RELATION_IDS = {
  currentEqualsVoltageOverResistance: "current-equals-voltage-over-resistance",
  sameRLargerULargerI: "same-r-larger-u-larger-i",
  sameULargerRSmallerI: "same-u-larger-r-smaller-i",
  resistanceIsPropertyNotProductOfUI: "resistance-is-property-not-product-of-u-i",
  rearrangementIsSameRelation: "rearrangement-is-same-relation",
  nonOhmicNeedsAnotherCondition: "non-ohmic-needs-another-condition",
} as const;

export const ANCHOR_PHENOMENON_ID = "one-resistor-variable-source";
export const ANCHOR_SCENE_ID = "simple-resistor-circuit";

/**
 * Intended MODEL grammar: one quantitative relation plus two
 * controlled comparisons. Official readiness inference may still
 * classify this as relation-condition until component IDs are taught
 * to the readiness helper. Implementation must not copy Scene 02's
 * energy chain or Scene 03's force board.
 */
export const MODEL_REPRESENTATION_KIND = "ratio-quantitative" as const;

export const curriculum: CurriculumMapping = {
  grade: [9],
  units: ["欧姆定律", "电流、电压和电阻"],
  concepts: [
    "电流",
    "电压",
    "电阻",
    "I = U / R",
    "控制变量比较",
    "闭合电路",
  ],
  formulas: ["I = U / R", "U = I R", "R = U / I"],
  examFrequency: "high",
};

export const quantities: PhysicalQuantity[] = [
  {
    id: MODEL_QUANTITY_IDS.current,
    name: "电流",
    symbol: "I",
    unit: "A",
    role: "derived",
    studentLanguage: ["电流有多大", "电流表读数", "电路里流得快不快（口语，不是速度）"],
    misconceptions: ["ohm-M1", "ohm-M2", "ohm-M5"],
  },
  {
    id: MODEL_QUANTITY_IDS.voltage,
    name: "电压",
    symbol: "U",
    unit: "V",
    role: "input",
    studentLanguage: ["两端电压", "电压表读数", "电源提供的电压"],
    misconceptions: ["ohm-M1", "ohm-M3", "ohm-M6"],
  },
  {
    id: MODEL_QUANTITY_IDS.resistance,
    name: "电阻",
    symbol: "R",
    unit: "Ω",
    role: "input",
    studentLanguage: ["电阻有多大", "这段导体容不容易让电流通过"],
    misconceptions: ["ohm-M2", "ohm-M3", "ohm-M4"],
  },
  {
    id: MODEL_QUANTITY_IDS.circuitClosed,
    name: "电路是否闭合",
    role: "state",
    studentLanguage: ["开关有没有接通", "电路通不通"],
    misconceptions: ["ohm-M6"],
  },
];

export const causalRelations: CausalRelation[] = [
  {
    from: MODEL_QUANTITY_IDS.voltage,
    to: MODEL_QUANTITY_IDS.current,
    relation: "depends-on",
    direction: "increase",
    conditions: [
      MODEL_CONDITION_IDS.closedCircuit,
      MODEL_CONDITION_IDS.ohmicResistanceTreatedConstant,
      MODEL_CONDITION_IDS.sameResistanceComparison,
      MODEL_CONDITION_IDS.voltageAcrossSameComponent,
      MODEL_CONDITION_IDS.currentThroughSameComponent,
    ],
  },
  {
    from: MODEL_QUANTITY_IDS.resistance,
    to: MODEL_QUANTITY_IDS.current,
    relation: "depends-on",
    direction: "decrease",
    conditions: [
      MODEL_CONDITION_IDS.closedCircuit,
      MODEL_CONDITION_IDS.ohmicResistanceTreatedConstant,
      MODEL_CONDITION_IDS.sameVoltageComparison,
      MODEL_CONDITION_IDS.voltageAcrossSameComponent,
      MODEL_CONDITION_IDS.currentThroughSameComponent,
    ],
  },
];

export const conditions: Condition[] = [
  {
    id: MODEL_CONDITION_IDS.closedCircuit,
    description:
      "电路闭合时才有持续电流。断开时 I = 0。断开时电源两端仍可能有电压，不能和一个数字 U 同时代表“电源电压”和“电阻两端电压”。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.ohmicResistanceTreatedConstant,
    description:
      "九年级把这段比较中的电阻看成不变。金属电阻、温度变化不大时可以用本模型。灯丝明显变亮变热、二极管等，不能假定 R 不变。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.resistancePositive,
    description: "电阻必须大于零。本 Scene 不讨论短路把 R 当成零的情况。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.sameResistanceComparison,
    description: "比较电压和电流时，必须先说明用的是同一段电阻（R 不变）。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.sameVoltageComparison,
    description: "比较电阻和电流时，必须先说明这段电阻两端的电压可以看成相同。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.voltageAcrossSameComponent,
    description:
      "U 是这段电阻两端的电压，不是电路图上随便一个数字，也不是“电压沿着导线流过去”。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.currentThroughSameComponent,
    description:
      "I 是通过这段电阻的电流。若出现电流表，它必须和这段电阻串联，读数才是这个 I。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.rearrangementIsNotNewCause,
    description:
      "I = U / R、U = I R、R = U / I 是同一个关系的变形。R = U / I 是计算或测量电阻的方法，不是“电压和电流制造了电阻”。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.singleResistorScope,
    description:
      "本模型的学习目标停在一个电阻元件上的 I、U、R。串联、并联、电功率、电能、电阻率都不是完成本模型所必需的结论。",
    importance: "essential",
  },
];

export const counterexamples: Counterexample[] = [
  {
    scenario: "小灯泡逐渐变亮，有人用同一个不变的 R 套 I = U / R，并说电压加倍电流一定加倍。",
    whyModelFails:
      "灯丝温度升高时电阻会变大，不能再把 R 当作这次比较里的不变量。需要先检查“电阻是否可以看成不变”，不能把本模型写成对一切用电器都成立。",
    requiredNewModel: "electrical-resistance",
  },
  {
    scenario: "电路里有两个电阻串联。有人说 Scene 06 的任务是求出每个电阻上的分压和总电阻。",
    whyModelFails:
      "那是 series-circuit 的结构关系。本模型只要求学生在一个电阻上使用 I、U、R。串联不得升级成另一个 primary。",
    requiredNewModel: "series-circuit",
  },
  {
    scenario: "有人算出电流后立刻问“电功率是多少”，并说这也是欧姆定律。",
    whyModelFails:
      "P = U I 属于 electric-power。会算 I 不等于已经在学电功率。本 Scene 不把功率当作教学目标。",
    requiredNewModel: "electric-power",
  },
];

export const phenomena: Phenomenon[] = [
  {
    id: ANCHOR_PHENOMENON_ID,
    title: "一个电阻，换电压或换电阻",
    description:
      "一条只含一个定值电阻的闭合电路。先保持电阻不变、改变两端电压，看电流怎样变；再保持电压不变、换一个电阻，再看电流怎样变。这是锚点现象，不是模型本身。不要一开始就写出 I = U / R。",
    modelRole: "anchor",
    observableChanges: [
      "同一电阻上，电压更大时电流表读数更大",
      "同一电压下，电阻更大时电流表读数更小",
      "开关断开时电流表读数为零",
    ],
    relatedVariables: [
      MODEL_QUANTITY_IDS.current,
      MODEL_QUANTITY_IDS.voltage,
      MODEL_QUANTITY_IDS.resistance,
      MODEL_QUANTITY_IDS.circuitClosed,
    ],
  },
  {
    id: "heating-wire-one-resistor",
    title: "电热丝可以看成一个电阻",
    description: "一段电热丝接在电池两端。表面换成了加热元件，仍是一个电阻上的 I、U、R。",
    modelRole: "transfer",
    observableChanges: ["电压或电阻不同时，电流不同"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.current,
      MODEL_QUANTITY_IDS.voltage,
      MODEL_QUANTITY_IDS.resistance,
    ],
  },
  {
    id: "exam-diagram-one-resistor",
    title: "试卷上的单电阻电路图",
    description: "电路图画法不同，仍只有一个待研究的电阻。",
    modelRole: "transfer",
    observableChanges: ["图上的电压、电阻、电流标在不同位置"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.current,
      MODEL_QUANTITY_IDS.voltage,
      MODEL_QUANTITY_IDS.resistance,
    ],
  },
  {
    id: "filament-lamp-heats-up",
    title: "灯丝变亮时电阻不再固定",
    description: "小灯泡两端电压增大，灯丝明显更亮更热。电流不再按固定 R 与电压成正比。",
    modelRole: "transfer",
    observableChanges: ["变亮", "电流增大但不成正比"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.current,
      MODEL_QUANTITY_IDS.voltage,
      MODEL_QUANTITY_IDS.resistance,
    ],
  },
];

export const scenes: SceneDefinition[] = [
  {
    id: ANCHOR_SCENE_ID,
    primaryModel: MODEL_ID,
    secondaryModels: [],
    phenomenonId: ANCHOR_PHENOMENON_ID,
    visualType: "interactive",
    controllableVariables: [
      "comparisonMode",
      "selectedResistorId",
      "selectedSourceVoltageId",
      "circuitClosed",
    ],
    observableVariables: [
      MODEL_QUANTITY_IDS.current,
      MODEL_QUANTITY_IDS.voltage,
      MODEL_QUANTITY_IDS.resistance,
      MODEL_QUANTITY_IDS.circuitClosed,
    ],
    experimentOperations: [
      {
        id: "compare-same-resistance-different-voltage",
        description: "保持同一个电阻，改变它两端的电压，观察电流。",
        variable: "comparisonMode",
        values: ["same-resistance-different-voltage"],
      },
      {
        id: "compare-same-voltage-different-resistance",
        description: "保持两端电压可以看成相同，换一个电阻，观察电流。",
        variable: "comparisonMode",
        values: ["same-voltage-different-resistance"],
      },
    ],
    physicsEngine: "deterministic-simple-resistor-circuit",
    targetEvidence: [
      {
        id: "observation",
        description: "能说出电压变了或电阻变了之后，电流读数是否不同。",
      },
      {
        id: "controlled-comparison",
        description: "能指出比较时要先说清是 R 不变还是 U 不变。",
      },
      {
        id: "current-voltage-resistance-relation",
        description: "能用 I、U、R 的关系说明，而不是只背 I = U / R。",
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
    "spec/evidence-design-contract.md",
    "spec/physics-representation-integrity-contract.md",
    "spec/scenes/simple-resistor-circuit/scene-spec.md",
    "spec/scenes/simple-resistor-circuit/physics-state.md",
    "spec/scenes/simple-resistor-circuit/physical-representation-plan.md",
    "spec/scenes/simple-resistor-circuit/evidence-claim-design.md",
    "spec/reviews/pre/ohms-law.md",
  ],
  lastReviewedAt: "2026-09-12",
  notes: [
    "Canonical ID already existed in the Library. This folder fills the previously empty definition. It does not invent a new model ID.",
    "Scene 06 primary is ohms-law only. series-circuit and parallel-circuit must not be promoted to another primary.",
    "secondaryModels is empty on purpose. electric-current, voltage-potential-difference, and electrical-resistance are nearby Library quantity models, not Scene 06 teaching targets.",
    "Deep structure is the controlled I–U–R relation, not formula recitation and not an electricity survey.",
    "MODEL completeness (six parts) is not student construction evidence. L4 requires one coherent relation construction plus authored control→I bind. Six correct structured options must fail.",
    "Intended MODEL presentation is a quantitative I–U–R relation board, not six independent radios.",
    "Anchor Scene is simple-resistor-circuit. Named engine is deterministic-simple-resistor-circuit.",
    "Library metadata.status is prototype after POST LEARNING_EVIDENCE_PASS_WITH_REFINEMENTS plus the authored-evidence adversarial probe. Quality-reviewed prototype. Not learner-validated.",
    "Catalog numbers in physics-boundary.ts are pedagogical engine values, not future UI literals.",
  ],
};
