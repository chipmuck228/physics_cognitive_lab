import { FORCE_CHANGES_MOTION_STATE_ID } from "@/lib/physics-models/canonical-ids";
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

export const MODEL_ID = FORCE_CHANGES_MOTION_STATE_ID;

export const MODEL_TITLE = "力改变物体的运动状态";

export const MODEL_CORE_IDEA =
  "物体受到的合力可以改变它的运动状态：使它从静止开始运动、加快、减慢，或改变运动方向。合力为零时，运动状态保持不变。力不是运动本身；有力不等于物体一定在运动；物体在运动也不等于一定受到向前的力。";

export const MODEL_QUANTITY_IDS = {
  motionState: "motion-state",
  netForce: "net-force",
  forceMotionDirectionRelation: "force-motion-direction-relation",
  speed: "speed",
  motionDirection: "motion-direction",
  motionStateChange: "motion-state-change",
} as const;

export const MODEL_CONDITION_IDS = {
  oneDimensionalMotion: "one-dimensional-motion",
  frictionOmitted: "friction-omitted",
  netForceNonzero: "net-force-nonzero",
  netForceZero: "net-force-zero",
  sameDirectionAsMotion: "same-direction-as-motion",
  oppositeDirectionToMotion: "opposite-direction-to-motion",
  qualitativeForceStates: "qualitative-force-states",
} as const;

export const MODEL_RELATION_IDS = {
  netForceChangesMotionState: "net-force-changes-motion-state",
  sameDirectionIncreasesSpeed: "same-direction-force-increases-speed",
  oppositeDirectionDecreasesSpeed: "opposite-direction-force-decreases-speed",
  zeroNetForceLeavesMotionUnchanged: "zero-net-force-leaves-motion-unchanged",
} as const;

export const ANCHOR_PHENOMENON_ID = "horizontal-cart-net-force";
export const ANCHOR_SCENE_ID = "horizontal-force-cart";

export const curriculum: CurriculumMapping = {
  grade: [9],
  units: ["机械运动", "力", "力与运动"],
  concepts: [
    "力",
    "合力",
    "运动状态",
    "速度大小",
    "运动方向",
    "平衡力",
  ],
  examFrequency: "high",
};

export const quantities: PhysicalQuantity[] = [
  {
    id: MODEL_QUANTITY_IDS.motionState,
    name: "物体当前的运动状态",
    role: "state",
    studentLanguage: [
      "小车现在是静止还是在运动",
      "它朝哪边走、走得快还是慢",
    ],
    misconceptions: ["fcms-M1", "fcms-M3", "fcms-M6"],
  },
  {
    id: MODEL_QUANTITY_IDS.netForce,
    name: "水平合力",
    role: "controlled",
    studentLanguage: [
      "沿轨道方向的合力",
      "有没有把小车往某一边推的力",
    ],
    misconceptions: ["fcms-M1", "fcms-M4"],
  },
  {
    id: MODEL_QUANTITY_IDS.forceMotionDirectionRelation,
    name: "合力方向与运动方向的关系",
    role: "derived",
    studentLanguage: [
      "力的方向和运动方向是不是同一边",
      "力是顺着走，还是顶着走",
    ],
    misconceptions: ["fcms-M5"],
  },
  {
    id: MODEL_QUANTITY_IDS.speed,
    name: "运动快慢",
    role: "observable",
    studentLanguage: ["小车走得更快了还是更慢了", "速度大小有没有变"],
    misconceptions: ["fcms-M6"],
  },
  {
    id: MODEL_QUANTITY_IDS.motionDirection,
    name: "运动方向",
    role: "observable",
    studentLanguage: ["小车朝哪边运动", "有没有掉转方向"],
    misconceptions: ["fcms-M5", "fcms-M6"],
  },
  {
    id: MODEL_QUANTITY_IDS.motionStateChange,
    name: "运动状态的变化",
    role: "derived",
    studentLanguage: [
      "开始运动、加快、减慢、改变方向，或者保持不变",
    ],
    misconceptions: ["fcms-M3", "fcms-M6"],
  },
];

export const causalRelations: CausalRelation[] = [
  {
    from: MODEL_QUANTITY_IDS.netForce,
    to: MODEL_QUANTITY_IDS.motionStateChange,
    relation: "causes",
    conditions: [
      MODEL_CONDITION_IDS.oneDimensionalMotion,
      MODEL_CONDITION_IDS.frictionOmitted,
      MODEL_CONDITION_IDS.netForceNonzero,
    ],
  },
  {
    from: MODEL_QUANTITY_IDS.netForce,
    to: MODEL_QUANTITY_IDS.speed,
    relation: "changes",
    direction: "increase",
    conditions: [
      MODEL_CONDITION_IDS.netForceNonzero,
      MODEL_CONDITION_IDS.sameDirectionAsMotion,
    ],
  },
  {
    from: MODEL_QUANTITY_IDS.netForce,
    to: MODEL_QUANTITY_IDS.speed,
    relation: "changes",
    direction: "decrease",
    conditions: [
      MODEL_CONDITION_IDS.netForceNonzero,
      MODEL_CONDITION_IDS.oppositeDirectionToMotion,
    ],
  },
  {
    from: MODEL_QUANTITY_IDS.netForce,
    to: MODEL_QUANTITY_IDS.motionDirection,
    relation: "changes",
    conditions: [
      MODEL_CONDITION_IDS.netForceNonzero,
      MODEL_CONDITION_IDS.oppositeDirectionToMotion,
    ],
  },
  {
    from: MODEL_QUANTITY_IDS.netForce,
    to: MODEL_QUANTITY_IDS.motionState,
    relation: "depends-on",
    conditions: [MODEL_CONDITION_IDS.netForceZero],
  },
];

export const conditions: Condition[] = [
  {
    id: MODEL_CONDITION_IDS.oneDimensionalMotion,
    description:
      "九年级这一模型先只看一条水平直线上的运动。不要求平面矢量分解。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.frictionOmitted,
    description:
      "轨道摩擦忽略不计，或已被明确控制为零。不能把“撤去推力就停下”当成这个近似下的必然结果。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.netForceNonzero,
    description: "水平合力不为零时，运动状态会发生变化。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.netForceZero,
    description:
      "水平合力为零时，运动状态保持不变：原来静止的继续静止，原来运动的继续做同样的运动。这不是“没有力”，也不是“一定静止”。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.sameDirectionAsMotion,
    description: "合力方向与当前运动方向相同（物体静止时，则沿合力方向开始运动）。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.oppositeDirectionToMotion,
    description: "合力方向与当前运动方向相反。速度会减小，持续作用后可能停下并反向。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.qualitativeForceStates,
    description:
      "力用离散的定性状态表示（向左、向右、为零），速度用有限档位表示。不要求 F=ma 数值计算。",
    importance: "important",
  },
];

export const counterexamples: Counterexample[] = [
  {
    scenario: "竖直方向抛出的球，同时还受重力和空气阻力，运动不在一条水平直线上。",
    whyModelFails:
      "这个一维水平近似不再够用。需要更完整的力的合成与二维运动描述。",
  },
  {
    scenario: "粗糙地面上推箱子，一松手箱子很快停下。",
    whyModelFails:
      "这里摩擦不能忽略。撤去推力后合力往往不为零，不能用“合力为零、运动状态不变”直接解释停下。",
    requiredNewModel: "friction-force",
  },
  {
    scenario: "要定量求出加速度大小：已知质量和合力，求 a = F/m。",
    whyModelFails:
      "本模型只要求定性判断运动状态是否改变、怎样改变，不承担牛顿第二定律计算。",
  },
];

export const phenomena: Phenomenon[] = [
  {
    id: ANCHOR_PHENOMENON_ID,
    title: "水平轨道上的小车",
    description:
      "一辆小车沿一条水平轨道运动。可以看见它静止或运动、力的方向、运动方向，以及加快、减慢、掉头。这是锚点现象，不是模型本身。",
    modelRole: "anchor",
    observableChanges: [
      "从静止开始运动",
      "越来越快",
      "越来越慢",
      "运动方向改变",
      "速度大小和方向保持不变",
    ],
    relatedVariables: [
      MODEL_QUANTITY_IDS.motionState,
      MODEL_QUANTITY_IDS.netForce,
      MODEL_QUANTITY_IDS.speed,
      MODEL_QUANTITY_IDS.motionDirection,
      MODEL_QUANTITY_IDS.motionStateChange,
    ],
  },
  {
    id: "bicycle-speeding-up",
    title: "自行车加速",
    description: "人蹬车，车子越来越快。表面有轮子，但深结构仍是合力与运动方向同向。",
    modelRole: "transfer",
    observableChanges: ["速度变大"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.netForce,
      MODEL_QUANTITY_IDS.speed,
      MODEL_QUANTITY_IDS.forceMotionDirectionRelation,
    ],
  },
  {
    id: "ball-slowed-by-opposite-force",
    title: "球被反向作用后变慢",
    description: "滚动的球受到与运动方向相反的作用，速度变小，有时会停住或掉头。",
    modelRole: "transfer",
    observableChanges: ["速度变小", "可能改变方向"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.netForce,
      MODEL_QUANTITY_IDS.speed,
      MODEL_QUANTITY_IDS.motionDirection,
    ],
  },
  {
    id: "constant-velocity-zero-net-force",
    title: "合力为零时匀速前进",
    description:
      "气垫导轨或悬浮装置上，物体几乎不受摩擦，合力接近零，已经运动的物体保持原来的运动状态。",
    modelRole: "transfer",
    observableChanges: ["速度大小几乎不变", "方向不变"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.netForce,
      MODEL_QUANTITY_IDS.motionState,
    ],
  },
];

export const scenes: SceneDefinition[] = [
  {
    id: ANCHOR_SCENE_ID,
    primaryModel: MODEL_ID,
    secondaryModels: ["force-equilibrium", "inertia-motion-state"],
    phenomenonId: ANCHOR_PHENOMENON_ID,
    visualType: "interactive",
    controllableVariables: ["netForce", "initialMotionState"],
    observableVariables: [
      MODEL_QUANTITY_IDS.motionState,
      MODEL_QUANTITY_IDS.netForce,
      MODEL_QUANTITY_IDS.speed,
      MODEL_QUANTITY_IDS.motionDirection,
      MODEL_QUANTITY_IDS.motionStateChange,
    ],
    experimentOperations: [
      {
        id: "set-net-force-same-as-motion",
        description: "给正在运动的小车施加与运动方向相同的水平合力。",
        variable: "netForce",
        values: ["same-as-motion"],
      },
      {
        id: "set-net-force-opposite-motion",
        description: "给正在运动的小车施加与运动方向相反的水平合力。",
        variable: "netForce",
        values: ["opposite-to-motion"],
      },
      {
        id: "set-net-force-zero",
        description: "让已经在运动的小车水平合力为零。",
        variable: "netForce",
        values: ["zero"],
      },
    ],
    physicsEngine: "deterministic-horizontal-force-cart",
    targetEvidence: [
      {
        id: "observation",
        description: "能说出开始运动、加快、减慢或改变方向等可见变化。",
      },
      {
        id: "force-motion-relation",
        description: "能区分力的方向和运动方向，并指出合力如何改变运动状态。",
      },
      {
        id: "zero-net-force-boundary",
        description: "能指出合力为零时运动状态不变，不等于一定静止。",
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
    "spec/scenes/horizontal-force-cart/",
  ],
  lastReviewedAt: "2026-09-11",
  notes: [
    "Canonical ID already existed in the Library as family C. This folder fills the previously empty model definition.",
    "Deep structure is net force and direction relation → motion-state change, not an energy-conversion chain.",
    "force-equilibrium and inertia-motion-state are supporting connections. They are not a second MODEL task in Scene 03.",
    "Friction is omitted as an explicit approximation. Do not secretly teach friction-force as the primary model.",
    "No F=ma numerical integration. Discrete qualitative force and speed states are the physics truth.",
    "Lifecycle stays draft until a production Scene implements the full UPLP loop.",
  ],
};
