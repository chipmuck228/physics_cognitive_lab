import { DENSITY_MASS_VOLUME_ID } from "@/lib/physics-models/canonical-ids";
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

export const MODEL_ID = DENSITY_MASS_VOLUME_ID;

export const MODEL_TITLE = "密度、质量与体积";

export const MODEL_CORE_IDEA =
  "密度是单位体积的质量：ρ = m / V。它描述的是在给定条件下物质（或作为整体的均匀样品）的属性，不是物体“看起来有多大”或“有多重”。比较密度必须同时看质量和体积。";

export const MODEL_QUANTITY_IDS = {
  mass: "mass",
  volume: "volume",
  density: "density",
  material: "material",
} as const;

export const MODEL_CONDITION_IDS = {
  volumePositive: "volume-positive",
  uniformSample: "uniform-sample",
  sameTemperaturePressure: "same-temperature-pressure",
  sameVolumeComparison: "same-volume-comparison",
  sameMassComparison: "same-mass-comparison",
  averageDensityIfComposite: "average-density-if-composite",
} as const;

export const MODEL_RELATION_IDS = {
  densityIsMassPerVolume: "density-is-mass-per-volume",
  sameVolumeLargerMassLargerDensity: "same-volume-larger-mass-larger-density",
  sameMassLargerVolumeSmallerDensity: "same-mass-larger-volume-smaller-density",
  uniformCutLeavesDensityUnchanged: "uniform-cut-leaves-density-unchanged",
  densityAloneDoesNotExplainFloating: "density-alone-does-not-explain-floating",
} as const;

export const ANCHOR_PHENOMENON_ID = "equal-volume-material-samples";
export const ANCHOR_SCENE_ID = "equal-volume-material-samples";

export const MODEL_REPRESENTATION_KIND = "ratio-quantitative" as const;

export const curriculum: CurriculumMapping = {
  grade: [9],
  units: ["质量和密度"],
  concepts: ["质量", "体积", "密度", "ρ = m / V", "物质的属性"],
  formulas: ["ρ = m / V"],
  examFrequency: "high",
};

export const quantities: PhysicalQuantity[] = [
  {
    id: MODEL_QUANTITY_IDS.mass,
    name: "质量",
    symbol: "m",
    unit: "g",
    role: "observable",
    studentLanguage: ["有多重", "天平读数", "质量"],
    misconceptions: ["dmv-M1", "dmv-M2"],
  },
  {
    id: MODEL_QUANTITY_IDS.volume,
    name: "体积",
    symbol: "V",
    unit: "cm³",
    role: "observable",
    studentLanguage: ["占多少空间", "看起来多大", "体积"],
    misconceptions: ["dmv-M1", "dmv-M3"],
  },
  {
    id: MODEL_QUANTITY_IDS.density,
    name: "密度",
    symbol: "ρ",
    unit: "g/cm³",
    role: "derived",
    studentLanguage: ["单位体积有多重", "疏还是密", "密度"],
    misconceptions: ["dmv-M1", "dmv-M2", "dmv-M4", "dmv-M5"],
  },
  {
    id: MODEL_QUANTITY_IDS.material,
    name: "材料 / 物质种类",
    role: "state",
    studentLanguage: ["这是什么材料", "铁、木头还是别的"],
    misconceptions: ["dmv-M4", "dmv-M6"],
  },
];

export const causalRelations: CausalRelation[] = [
  {
    from: MODEL_QUANTITY_IDS.mass,
    to: MODEL_QUANTITY_IDS.density,
    relation: "depends-on",
    direction: "increase",
    conditions: [
      MODEL_CONDITION_IDS.volumePositive,
      MODEL_CONDITION_IDS.sameVolumeComparison,
    ],
  },
  {
    from: MODEL_QUANTITY_IDS.volume,
    to: MODEL_QUANTITY_IDS.density,
    relation: "depends-on",
    direction: "decrease",
    conditions: [
      MODEL_CONDITION_IDS.volumePositive,
      MODEL_CONDITION_IDS.sameMassComparison,
    ],
  },
  {
    from: MODEL_QUANTITY_IDS.material,
    to: MODEL_QUANTITY_IDS.density,
    relation: "depends-on",
    conditions: [
      MODEL_CONDITION_IDS.uniformSample,
      MODEL_CONDITION_IDS.sameTemperaturePressure,
    ],
  },
];

export const conditions: Condition[] = [
  {
    id: MODEL_CONDITION_IDS.volumePositive,
    description:
      "体积必须大于零。密度定义为 ρ = m / V，不能用“看起来很大”代替体积。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.uniformSample,
    description:
      "默认样品内部材料均匀。均匀切开时，质量和体积按同样比例变，密度不变。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.sameTemperaturePressure,
    description:
      "比较密度时，温度和压强可以看成相同。本模型不把热胀冷缩当作学习目标。",
    importance: "important",
  },
  {
    id: MODEL_CONDITION_IDS.sameVolumeComparison,
    description: "体积相同时，质量更大则密度更大。不能只比谁更沉。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.sameMassComparison,
    description: "质量相同时，体积更大则密度更小。不能只比谁看起来更大。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.averageDensityIfComposite,
    description:
      "空心、带空洞或混合物：m / V_外形 是物体的平均密度，不一定等于材料本身的密度。两者不能悄悄当成同一件事。",
    importance: "essential",
  },
];

export const counterexamples: Counterexample[] = [
  {
    scenario: "木块能浮在水面，铁块沉下去。有人说：这就是密度模型，密度大的一定沉。",
    whyModelFails:
      "浮沉还取决于物体平均密度与液体密度以及排开液体。那是 buoyancy-displaced-fluid，不能由 ρ = m / V 单独下结论。",
    requiredNewModel: "buoyancy-displaced-fluid",
  },
  {
    scenario: "一个空心铁球外形很大、质量却不大。有人用外形大小直接当铁的密度。",
    whyModelFails:
      "外形体积不是铁材料占据的体积。平均密度和材料密度被混在一起。",
  },
  {
    scenario: "同一块金属加热后稍微膨胀。有人说密度模型失效，因为质量没变。",
    whyModelFails:
      "密度仍是 m / V，只是体积随温度变了。热膨胀不是本模型的学习目标，也不需要新的密度定义。",
  },
];

export const phenomena: Phenomenon[] = [
  {
    id: ANCHOR_PHENOMENON_ID,
    title: "同样大小的两块样品",
    description:
      "两块外形几乎一样大的固体样品，一块明显更沉。学生可以比较质量、体积，再比较密度。这是锚点现象，不是模型本身。",
    modelRole: "anchor",
    observableChanges: [
      "同样大小时，一块更沉",
      "天平读数不同",
      "体积几乎相同",
    ],
    relatedVariables: [
      MODEL_QUANTITY_IDS.mass,
      MODEL_QUANTITY_IDS.volume,
      MODEL_QUANTITY_IDS.density,
      MODEL_QUANTITY_IDS.material,
    ],
  },
  {
    id: "equal-cups-of-liquids",
    title: "同样多的两种液体",
    description: "两只相同杯子里分别倒满水和食用油，质量不同。",
    modelRole: "transfer",
    observableChanges: ["同样体积下质量不同"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.mass,
      MODEL_QUANTITY_IDS.volume,
      MODEL_QUANTITY_IDS.density,
    ],
  },
  {
    id: "irregular-stone-overflow",
    title: "不规则石块",
    description: "石块形状不规则，体积要用排水法得到，再和质量一起求密度。",
    modelRole: "transfer",
    observableChanges: ["排水体积", "天平质量"],
    relatedVariables: [MODEL_QUANTITY_IDS.mass, MODEL_QUANTITY_IDS.volume],
  },
  {
    id: "hollow-ball-vs-solid-ball",
    title: "空心大球和实心小球",
    description: "外形大小差很多，不能直接用“谁更大”判断密度。",
    modelRole: "transfer",
    observableChanges: ["外形大小不同", "质量不同"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.mass,
      MODEL_QUANTITY_IDS.volume,
      MODEL_QUANTITY_IDS.density,
    ],
  },
];

export const scenes: SceneDefinition[] = [
  {
    id: ANCHOR_SCENE_ID,
    primaryModel: MODEL_ID,
    secondaryModels: ["measurement-mass", "measurement-volume"],
    phenomenonId: ANCHOR_PHENOMENON_ID,
    visualType: "interactive",
    controllableVariables: ["selectedSampleId", "comparisonMode", "cutUniformSample"],
    observableVariables: [
      MODEL_QUANTITY_IDS.mass,
      MODEL_QUANTITY_IDS.volume,
      MODEL_QUANTITY_IDS.material,
    ],
    experimentOperations: [
      {
        id: "compare-same-volume-samples",
        description: "比较两块体积相同、材料不同的样品的质量。",
        variable: "comparisonMode",
        values: ["same-volume"],
      },
      {
        id: "compare-same-mass-samples",
        description: "比较两块质量相同、体积不同的样品。",
        variable: "comparisonMode",
        values: ["same-mass"],
      },
      {
        id: "cut-uniform-sample",
        description: "把一块均匀样品切成一半，再测这一半的质量和体积。",
        variable: "cutUniformSample",
        values: [true],
      },
    ],
    physicsEngine: "deterministic-equal-volume-samples",
    targetEvidence: [
      {
        id: "observation",
        description: "能说出同样大小时质量不同，或同样质量时体积不同。",
      },
      {
        id: "mass-volume-ratio",
        description: "能用质量和体积的比来谈密度，而不是只谈轻重或大小。",
      },
      {
        id: "uniform-cut-boundary",
        description: "能指出均匀切开后密度不变。",
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
    "spec/scenes/equal-volume-material-samples/",
  ],
  lastReviewedAt: "2026-09-12",
  notes: [
    "Canonical ID already existed in the Library as family B. This folder fills the previously empty model definition.",
    "Deep structure is the ratio ρ = m / V, not an energy-conversion chain and not a force/motion relation board.",
    "MODEL presentation kind is ratio-quantitative: a comparison table / ratio board of mass, volume, and density.",
    "measurement-mass and measurement-volume are supporting only. They are not a second MODEL task.",
    "Buoyancy / floating is a boundary, not this model's conclusion.",
    "Hollow or composite objects require distinguishing material density from average density.",
    "Quality-reviewed prototype after Scene 04 POST LEARNING_EVIDENCE_PASS. Not learner-validated.",
  ],
};
