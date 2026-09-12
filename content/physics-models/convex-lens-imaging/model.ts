import { CONVEX_LENS_IMAGING_ID } from "@/lib/physics-models/canonical-ids";
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

export const MODEL_ID = CONVEX_LENS_IMAGING_ID;

export const MODEL_TITLE = "凸透镜成像：物距相对焦点几何如何决定像";

export const MODEL_CORE_IDEA =
  "对一块可以看成薄凸透镜的透镜，物体相对焦点 F 和二倍焦距处 2F 的位置，决定透镜后的光线是真正会聚、只是反向延长线相交，还是在有限远处不相交。真正会聚时，另一侧成倒立实像，光屏放在像的位置才能接到；反向延长线相交时，与物体同侧成正立、放大的虚像，光屏接不到。物在 F 上时，出射光线平行，不成有限远的像。五种情形是这条结构的结果，不是一张要背的表。1/f = 1/u + 1/v 不是本模型要教的原因。";

export const MODEL_QUANTITY_IDS = {
  objectDistance: "object-distance",
  focalLength: "focal-length",
  twiceFocalLength: "twice-focal-length",
  imageDistance: "image-distance",
  opticalCenter: "optical-center",
  focalPoint: "focal-point",
  rayMeetingMode: "ray-meeting-mode",
  imageNature: "image-nature",
  imageOrientation: "image-orientation",
  imageSizeRelation: "image-size-relation",
  imageSide: "image-side",
  screenReceivable: "screen-receivable",
} as const;

export const MODEL_CONDITION_IDS = {
  thinSingleConvexLens: "thin-single-convex-lens",
  paraxialGrade9Ideal: "paraxial-grade9-ideal",
  noAdvancedSignConvention: "no-advanced-sign-convention",
  finiteImageExists: "finite-image-exists",
  objectOutsideFocalPoint: "object-outside-focal-point",
  objectAtFocalPoint: "object-at-focal-point",
  objectInsideFocalPoint: "object-inside-focal-point",
  screenAtImagePlaneToReceive: "screen-at-image-plane-to-receive",
  screenPositionIsNotImagePosition: "screen-position-is-not-image-position",
  coveringDoesNotRemovePart: "covering-does-not-remove-part",
  fAnd2fAreFocalGeometry: "f-and-2f-are-focal-geometry",
  thinLensEquationNotTaught: "thin-lens-equation-not-taught",
  twoCanonicalRaysForConstruction: "two-canonical-rays-for-construction",
} as const;

export const MODEL_RELATION_IDS = {
  objectPositionSelectsRayMeeting: "object-position-selects-ray-meeting",
  actualConvergenceMakesRealImage: "actual-convergence-makes-real-image",
  backwardExtensionMakesVirtualImage: "backward-extension-makes-virtual-image",
  noFiniteMeetingMakesNoFiniteImage: "no-finite-meeting-makes-no-finite-image",
  realImageCanBeReceivedOnScreen: "real-image-can-be-received-on-screen",
  virtualImageCannotBeReceivedOnScreen:
    "virtual-image-cannot-be-received-on-screen",
  realImageInvertedOtherSide: "real-image-inverted-other-side",
  virtualImageUprightSameSide: "virtual-image-upright-same-side",
  objectCloserTowardFMakesFartherLargerRealImage:
    "object-closer-toward-f-makes-farther-larger-real-image",
  fAnd2fMarkRegimesNotMnemonics: "f-and-2f-mark-regimes-not-mnemonics",
} as const;

export const ANCHOR_PHENOMENON_ID = "convex-lens-optical-bench";
export const ANCHOR_SCENE_ID = "convex-lens-optical-bench";

/**
 * Intended MODEL grammar: student-constructed spatial-ray relation.
 * Official readiness inference will likely report relation-condition
 * because no energyRelations and no density-ratio keys exist.
 * Implementation must not copy Scene 02–06 boards, and must not
 * extract a new generic shell merely because the diagram is new.
 */
export const MODEL_REPRESENTATION_KIND = "spatial-ray-relation" as const;

export const curriculum: CurriculumMapping = {
  grade: [9],
  units: ["光现象", "凸透镜成像"],
  concepts: [
    "凸透镜",
    "主光轴",
    "光心",
    "焦点 F",
    "焦距 f",
    "二倍焦距 2F / 2f",
    "物距 u",
    "像距 v",
    "实像",
    "虚像",
    "倒立",
    "正立",
    "光屏能否接到",
  ],
  requiredExperiments: ["探究凸透镜成像的规律"],
  examFrequency: "high",
};

export const quantities: PhysicalQuantity[] = [
  {
    id: MODEL_QUANTITY_IDS.objectDistance,
    name: "物距",
    symbol: "u",
    unit: "cm",
    role: "controlled",
    studentLanguage: ["物体到透镜光心有多远", "蜡烛离透镜近还是远"],
    misconceptions: ["cli-M4", "cli-M5", "cli-M6", "cli-M9"],
  },
  {
    id: MODEL_QUANTITY_IDS.focalLength,
    name: "焦距",
    symbol: "f",
    unit: "cm",
    role: "input",
    studentLanguage: ["这块凸透镜的焦距", "F 到光心的距离"],
    misconceptions: ["cli-M6"],
  },
  {
    id: MODEL_QUANTITY_IDS.twiceFocalLength,
    name: "二倍焦距",
    symbol: "2f",
    unit: "cm",
    role: "derived",
    studentLanguage: ["2F 在哪里", "二倍焦距处"],
    misconceptions: ["cli-M6"],
  },
  {
    id: MODEL_QUANTITY_IDS.imageDistance,
    name: "像距",
    symbol: "v",
    unit: "cm",
    role: "derived",
    studentLanguage: ["像到光心有多远", "光屏要放到哪里才清晰"],
    misconceptions: ["cli-M1", "cli-M2", "cli-M4", "cli-M9"],
  },
  {
    id: MODEL_QUANTITY_IDS.opticalCenter,
    name: "光心",
    symbol: "O",
    role: "state",
    studentLanguage: ["透镜正中那个点", "穿过这里的光线方向不变"],
    misconceptions: ["cli-M1", "cli-M7"],
  },
  {
    id: MODEL_QUANTITY_IDS.focalPoint,
    name: "焦点",
    symbol: "F",
    role: "state",
    studentLanguage: ["焦点 F", "平行主光轴的光会聚到哪里"],
    misconceptions: ["cli-M6", "cli-M9"],
  },
  {
    id: MODEL_QUANTITY_IDS.rayMeetingMode,
    name: "光线会聚方式",
    role: "observable",
    studentLanguage: [
      "透镜后的光线是真的交在一起",
      "还是只有反向延长线相交",
      "还是有限远处根本不相交",
    ],
    misconceptions: ["cli-M3", "cli-M8", "cli-M9"],
  },
  {
    id: MODEL_QUANTITY_IDS.imageNature,
    name: "实像或虚像",
    role: "observable",
    studentLanguage: ["这是实像还是虚像", "光线是不是真的会聚在那里"],
    misconceptions: ["cli-M2", "cli-M3", "cli-M8", "cli-M10"],
  },
  {
    id: MODEL_QUANTITY_IDS.imageOrientation,
    name: "正立或倒立",
    role: "observable",
    studentLanguage: ["像是正的还是倒的"],
    misconceptions: ["cli-M10"],
  },
  {
    id: MODEL_QUANTITY_IDS.imageSizeRelation,
    name: "放大、等大或缩小",
    role: "observable",
    studentLanguage: ["像比物体大、一样大，还是更小"],
    misconceptions: ["cli-M5"],
  },
  {
    id: MODEL_QUANTITY_IDS.imageSide,
    name: "像在哪一侧",
    role: "observable",
    studentLanguage: ["像和物体在透镜的同一侧，还是另一侧"],
    misconceptions: ["cli-M1", "cli-M3"],
  },
  {
    id: MODEL_QUANTITY_IDS.screenReceivable,
    name: "光屏能否接到清晰的像",
    role: "observable",
    studentLanguage: ["白屏上能不能接到清晰的像", "像是不是长在光屏里面"],
    misconceptions: ["cli-M2", "cli-M3", "cli-M8"],
  },
];

export const causalRelations: CausalRelation[] = [
  {
    from: MODEL_QUANTITY_IDS.objectDistance,
    to: MODEL_QUANTITY_IDS.rayMeetingMode,
    relation: "depends-on",
    conditions: [
      MODEL_CONDITION_IDS.thinSingleConvexLens,
      MODEL_CONDITION_IDS.fAnd2fAreFocalGeometry,
    ],
  },
  {
    from: MODEL_QUANTITY_IDS.rayMeetingMode,
    to: MODEL_QUANTITY_IDS.imageNature,
    relation: "depends-on",
    conditions: [MODEL_CONDITION_IDS.thinSingleConvexLens],
  },
  {
    from: MODEL_QUANTITY_IDS.rayMeetingMode,
    to: MODEL_QUANTITY_IDS.imageSide,
    relation: "depends-on",
    conditions: [MODEL_CONDITION_IDS.thinSingleConvexLens],
  },
  {
    from: MODEL_QUANTITY_IDS.imageNature,
    to: MODEL_QUANTITY_IDS.screenReceivable,
    relation: "depends-on",
    conditions: [
      MODEL_CONDITION_IDS.screenAtImagePlaneToReceive,
      MODEL_CONDITION_IDS.screenPositionIsNotImagePosition,
    ],
  },
  {
    from: MODEL_QUANTITY_IDS.rayMeetingMode,
    to: MODEL_QUANTITY_IDS.imageOrientation,
    relation: "depends-on",
    conditions: [MODEL_CONDITION_IDS.thinSingleConvexLens],
  },
  {
    from: MODEL_QUANTITY_IDS.objectDistance,
    to: MODEL_QUANTITY_IDS.imageSizeRelation,
    relation: "depends-on",
    conditions: [
      MODEL_CONDITION_IDS.finiteImageExists,
      MODEL_CONDITION_IDS.fAnd2fAreFocalGeometry,
    ],
  },
  {
    from: MODEL_QUANTITY_IDS.objectDistance,
    to: MODEL_QUANTITY_IDS.imageDistance,
    relation: "depends-on",
    conditions: [
      MODEL_CONDITION_IDS.finiteImageExists,
      MODEL_CONDITION_IDS.objectOutsideFocalPoint,
    ],
  },
];

export const conditions: Condition[] = [
  {
    id: MODEL_CONDITION_IDS.thinSingleConvexLens,
    description:
      "本模型只讨论一块可以看成薄凸透镜的透镜。凹透镜、厚透镜、多透镜系统不是完成本模型所必需的结论。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.paraxialGrade9Ideal,
    description:
      "九年级把近轴、无球差、无色差当作理想情况。不把像差、透镜制造公式当作学习目标。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.noAdvancedSignConvention,
    description:
      "物距、像距、焦距按九年级距离大小和左右侧来谈。不引入大学几何光学符号约定。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.finiteImageExists,
    description:
      "只有光线真正会聚，或反向延长线在有限远处相交时，才有有限远的像。物在 F 上时这个条件不成立。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.objectOutsideFocalPoint,
    description: "u > f 时，出射光线会聚，另一侧成实像。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.objectAtFocalPoint,
    description:
      "u = f 是极限情形：出射光线平行，有限远处既没有实像也没有虚像。不要把它说成普通的有限远成像。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.objectInsideFocalPoint,
    description: "u < f 时，出射光线发散，反向延长线相交，与物体同侧成虚像。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.screenAtImagePlaneToReceive,
    description:
      "实像只有在光屏放到像的位置时才清晰。光屏位置不等于像的位置；移动光屏不会把光学像搬走。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.screenPositionIsNotImagePosition,
    description:
      "光屏是接收器。像的位置由物距和焦点几何决定，不由光屏决定。虚像不能被光屏接到。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.coveringDoesNotRemovePart,
    description:
      "遮住透镜一部分，完整的像仍在，通常只是变暗。不能把透镜表面当成像的拼图。",
    importance: "important",
  },
  {
    id: MODEL_CONDITION_IDS.fAnd2fAreFocalGeometry,
    description:
      "F 和 2F 是焦点几何的标志位置，用来判断光线会聚方式和放大缩小，不是无意义的记忆符号。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.thinLensEquationNotTaught,
    description:
      "1/f = 1/u + 1/v 不是本 Grade-9 模型的学习目标，也不能当成成像的原因。官方情形由离散物距站点给出，不由该式算出。",
    importance: "essential",
  },
  {
    id: MODEL_CONDITION_IDS.twoCanonicalRaysForConstruction,
    description:
      "模型建构必须使用两条对应当前物距站点的光线：过光心方向不变；平行主光轴的光线过另一侧焦点。过近侧焦点的第三条光线只在该站点几何允许时作为可选参考，不能代替这两条。交点或反向延长线交点才是像点。",
    importance: "essential",
  },
];

export const counterexamples: Counterexample[] = [
  {
    scenario: "平面镜前的人看见自己正立的像，有人说这也是凸透镜成像。",
    whyModelFails:
      "平面镜成像属于 plane-mirror-imaging。反射成像不是本模型的会聚/反向延长结构。",
    requiredNewModel: "plane-mirror-imaging",
  },
  {
    scenario: "有人问这块玻璃为什么把光线折弯，并要求推导透镜制造公式。",
    whyModelFails:
      "折射机制属于 light-refraction。本模型从凸透镜后的光线行为开始，不把折射率推导当作教学目标。",
    requiredNewModel: "light-refraction",
  },
  {
    scenario: "有人用 1/f = 1/u + 1/v 算出一个数，并说已经建立了凸透镜成像模型。",
    whyModelFails:
      "本模型的可复用结构是物距相对焦点几何如何选择光线会聚方式。公式计算不是本模型的原因，也不能代替空间建构。",
  },
  {
    scenario: "显微镜或望远镜里有两组透镜。有人说 Scene 07 要推出放大率公式。",
    whyModelFails:
      "多透镜系统超出一块薄凸透镜的边界。不得把显微镜或望远镜推导升级成另一个 primary。",
  },
];

export const phenomena: Phenomenon[] = [
  {
    id: ANCHOR_PHENOMENON_ID,
    title: "凸透镜光具座：物体、透镜与可移动光屏",
    description:
      "光具座上有发光物体或蜡烛、一块凸透镜、一块可移动白屏。学生可以改变物距，也可以移动光屏。这是锚点现象，不是模型本身。不要一开始就报出五种成像情况。",
    modelRole: "anchor",
    observableChanges: [
      "物距不同时，光屏上有时能接到清晰的像，有时不能",
      "接到的实像可能缩小、等大或放大，并且是倒立的",
      "物在焦点以内时，光屏接不到像，透过透镜可以看到正立放大的像",
      "物正好在焦点上时，怎么移动光屏都接不到有限远的清晰像",
    ],
    relatedVariables: [
      MODEL_QUANTITY_IDS.objectDistance,
      MODEL_QUANTITY_IDS.focalLength,
      MODEL_QUANTITY_IDS.rayMeetingMode,
      MODEL_QUANTITY_IDS.imageNature,
      MODEL_QUANTITY_IDS.screenReceivable,
    ],
  },
  {
    id: "classroom-projector-slide",
    title: "投影仪把幻灯片投到远处幕布上",
    description:
      "幻灯片在焦点以外、二倍焦距以内，远处幕布接到倒立、放大的实像。表面换成了教室设备，仍是同一块凸透镜的会聚成像。",
    modelRole: "transfer",
    observableChanges: ["幕布上出现倒立放大的画面"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.objectDistance,
      MODEL_QUANTITY_IDS.imageNature,
      MODEL_QUANTITY_IDS.imageSizeRelation,
      MODEL_QUANTITY_IDS.screenReceivable,
    ],
  },
  {
    id: "simple-camera-sensor",
    title: "照相机把远处景物缩到感光面上",
    description: "远处物体物距大于 2f，感光面接到倒立、缩小的实像。",
    modelRole: "transfer",
    observableChanges: ["感光面上出现倒立缩小的画面"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.objectDistance,
      MODEL_QUANTITY_IDS.imageNature,
      MODEL_QUANTITY_IDS.imageSizeRelation,
      MODEL_QUANTITY_IDS.screenReceivable,
    ],
  },
  {
    id: "hand-magnifier-stamp",
    title: "放大镜看邮票",
    description:
      "邮票在焦点以内。透过透镜看到正立、放大的虚像。白纸接不到这个像。",
    modelRole: "transfer",
    observableChanges: ["透过透镜看到更大的正立邮票", "白纸接不到像"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.objectDistance,
      MODEL_QUANTITY_IDS.imageNature,
      MODEL_QUANTITY_IDS.imageOrientation,
      MODEL_QUANTITY_IDS.screenReceivable,
    ],
  },
  {
    id: "eye-retina-as-receiver",
    title: "眼睛视网膜接到实像",
    description:
      "晶状体可以看成凸透镜，视网膜可以看成接收实像的屏。调节焦距、两眼光学和大脑如何“看正”不是本模型要迁移的完整结构。",
    modelRole: "transfer",
    observableChanges: ["视网膜上需要清晰的实像才能看清"],
    relatedVariables: [
      MODEL_QUANTITY_IDS.imageNature,
      MODEL_QUANTITY_IDS.screenReceivable,
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
      "objectStation",
      "screenAtImagePlane",
      "lensPartiallyCovered",
    ],
    observableVariables: [
      MODEL_QUANTITY_IDS.objectDistance,
      MODEL_QUANTITY_IDS.rayMeetingMode,
      MODEL_QUANTITY_IDS.imageNature,
      MODEL_QUANTITY_IDS.imageOrientation,
      MODEL_QUANTITY_IDS.imageSizeRelation,
      MODEL_QUANTITY_IDS.imageSide,
      MODEL_QUANTITY_IDS.screenReceivable,
    ],
    experimentOperations: [
      {
        id: "compare-real-image-across-2f",
        description: "保持同一块透镜，把物体放在 2F 以外、2F 上、F 与 2F 之间，比较像。",
        variable: "objectStation",
        values: ["beyond-2f", "at-2f", "between-f-and-2f"],
      },
      {
        id: "probe-object-at-f",
        description: "把物体放到焦点上，移动光屏，看能不能接到有限远的清晰像。",
        variable: "objectStation",
        values: ["at-f"],
      },
      {
        id: "probe-object-inside-f",
        description: "把物体放到焦点以内，比较光屏和透过透镜看到的像。",
        variable: "objectStation",
        values: ["inside-f"],
      },
      {
        id: "cover-part-of-lens",
        description: "在能接到实像时遮住透镜一部分，看像是缺一块还是仍完整。",
        variable: "lensPartiallyCovered",
        values: [true],
      },
    ],
    physicsEngine: "deterministic-convex-lens-imaging",
    targetEvidence: [
      {
        id: "observation",
        description: "能说出物距不同时，光屏上是否出现清晰的像，像是大是小、正还是倒。",
      },
      {
        id: "ray-meeting",
        description: "能指出这次是光线真正会聚、反向延长线相交，还是有限远处不相交。",
      },
      {
        id: "image-as-consequence",
        description: "能把实像/虚像、光屏能否接到说成会聚方式的结果，而不是背表。",
      },
    ],
  },
];

export const metadata: PhysicsModelMetadata = {
  version: "0.1.0",
  status: "draft",
  sourceReferences: [
    "spec/physics-model-schema.md",
    "spec/physics-model-library.md",
    "spec/universal-physics-learning-protocol.md",
    "spec/physics-model-quality-review.md",
    "spec/evidence-design-contract.md",
    "spec/physics-representation-integrity-contract.md",
    "spec/architecture/interaction-shell-contract.md",
    "spec/reviews/pre/convex-lens-imaging.md",
    "spec/scenes/convex-lens-optical-bench/evidence-claim-design.md",
    "spec/scenes/convex-lens-optical-bench/readiness.md",
    "spec/scenes/convex-lens-optical-bench/physical-representation-plan.md",
  ],
  lastReviewedAt: "2026-09-12",
  notes: [
    "Canonical ID already existed in the Library. This folder fills the previously empty definition. It does not invent a new model ID.",
    "Intended Scene 07 primary is convex-lens-imaging only. No production Scene, Scene spec, DSL, or new generic shell is created in this pass.",
    "secondaryModels is empty on purpose. light-rectilinear-propagation, light-refraction, and plane-mirror-imaging are nearby Library IDs, not Scene 07 teaching targets.",
    "Deep structure is object position relative to focal geometry → ray meeting mode → image properties. It is not a five-row mnemonic table.",
    "1/f = 1/u + 1/v is excluded from the Grade-9 primary model.",
    "u = f is a no-finite-image limiting case, not an ordinary finite image.",
    "Official stations live in physics-boundary.ts. They are engine truth, not MODEL evidence.",
    "Intended MODEL presentation is a spatial-ray relation construction. Readiness inference may still say relation-condition.",
    "Library metadata.status stays draft. PRE does not promote lifecycle. Evidence Claim Design and readiness exist. Not learner-validated.",
    "L4 construction evidence is evaluateConvexLensModelConstruction. Completeness rows remain TOO_WEAK_FOR_L4.",
  ],
};
