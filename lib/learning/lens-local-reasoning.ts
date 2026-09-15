import {
  analyzeConvexLensAuthored,
  classifyLensStep6FastPath,
  lensAuthoredBindMissingMessage,
} from "@/content/physics-models/convex-lens-imaging/construction";
import type { ObjectStation } from "@/content/physics-models/convex-lens-imaging/physics-boundary";

/**
 * Scene 07 experimental split:
 * LocalReasoningResult = enough physics for THIS task
 * ModelCoverageResult = which complete-model branches appeared
 *
 * Local progression must not depend on unrelated missing branches.
 * Not a universal semantic engine.
 */

export type LensLocalReasoningTaskId =
  | "u-equals-f"
  | "u-less-than-f"
  | "actual-convergence-real";

export type LensReasoningRelationId =
  | "object-at-f"
  | "no-finite-meeting"
  | "screen-no-finite-real-image"
  | "object-inside-f"
  | "backward-extension"
  | "virtual-not-on-screen"
  | "actual-convergence"
  | "real-on-screen";

export type LocalReasoningStatus =
  | "sufficient"
  | "insufficient"
  | "contradictory"
  | "incorrect"
  | "unparseable";

export interface LocalReasoningResult {
  sufficient: boolean;
  status: LocalReasoningStatus;
  supportedRelations: LensReasoningRelationId[];
  missingRequiredRelations: LensReasoningRelationId[];
  contradictions: string[];
  feedback: string;
}

export interface ModelCoverageResult {
  coveredBranches: LensReasoningRelationId[];
  missingBranches: LensReasoningRelationId[];
}

export interface LensLocalReasoningContext {
  station?: ObjectStation | "";
}

const U_EQUALS_F_REQUIRED: readonly LensReasoningRelationId[] = [
  "object-at-f",
  "no-finite-meeting",
  "screen-no-finite-real-image",
];

const U_LESS_THAN_F_REQUIRED: readonly LensReasoningRelationId[] = [
  "object-inside-f",
  "backward-extension",
  "virtual-not-on-screen",
];

const ACTUAL_REAL_REQUIRED: readonly LensReasoningRelationId[] = [
  "actual-convergence",
  "real-on-screen",
];

const MODEL_BRANCHES: readonly LensReasoningRelationId[] = [
  "actual-convergence",
  "real-on-screen",
  "backward-extension",
  "virtual-not-on-screen",
  "object-at-f",
  "no-finite-meeting",
  "screen-no-finite-real-image",
];

const OBJECT_AT_F =
  /在焦点上|物体在[Ff]|在[Ff]上|正好在[Ff]|u\s*=\s*f|物距等于焦距/;
const OBJECT_INSIDE_F = /焦点以内|f以内|[Ff]里面|邮票|放大镜/;
const ORDINARY_REAL_AT_F = /正常形成实像|也会.{0,8}实像|普通的像|光屏位置不好找/;
const NO_IMAGE_IF_NO_SCREEN = /屏上?看不到.{0,8}没有像|看不到.{0,6}所以.{0,8}没有像|根本没有像/;
const SCREEN_CREATES_IMAGE = /光屏决定像|屏决定像在哪里|卡片自己造/;

function compact(text: string): string {
  return text.replace(/\s+/g, "");
}

function requiredForTask(task: LensLocalReasoningTaskId): readonly LensReasoningRelationId[] {
  if (task === "u-equals-f") {
    return U_EQUALS_F_REQUIRED;
  }
  if (task === "u-less-than-f") {
    return U_LESS_THAN_F_REQUIRED;
  }
  return ACTUAL_REAL_REQUIRED;
}

function detectSupportedRelations(
  text: string,
  context: LensLocalReasoningContext = {},
): LensReasoningRelationId[] {
  const compactText = compact(text);
  const authored = analyzeConvexLensAuthored(text);
  const supported: LensReasoningRelationId[] = [];

  if (context.station === "at-f" || OBJECT_AT_F.test(compactText)) {
    supported.push("object-at-f");
  }
  if (context.station === "inside-f" || OBJECT_INSIDE_F.test(compactText)) {
    supported.push("object-inside-f");
  }
  if (authored.meetingKind === "no-finite-meeting" || authored.meetingKind === "mixed") {
    if (authored.meetingKind === "no-finite-meeting" || /平行|无法相交|没有聚|碰不到/.test(compactText)) {
      supported.push("no-finite-meeting");
    }
  }
  if (authored.meetingKind === "backward-extension" || authored.meetingKind === "mixed") {
    if (authored.meetingKind === "backward-extension" || /反向|往回|散开/.test(compactText)) {
      supported.push("backward-extension");
    }
  }
  if (authored.meetingKind === "actual-convergence" || authored.meetingKind === "mixed") {
    if (authored.meetingKind === "actual-convergence" || /会聚|汇聚|聚到|碰到一起/.test(compactText)) {
      supported.push("actual-convergence");
    }
  }
  if (
    authored.consequenceKind === "none" ||
    /无法成像|不能成像|接不到像|接不到清楚|接不到清晰/.test(compactText)
  ) {
    supported.push("screen-no-finite-real-image");
  }
  if (authored.consequenceKind === "virtual" || /虚像/.test(compactText)) {
    supported.push("virtual-not-on-screen");
  }
  if (authored.consequenceKind === "real") {
    supported.push("real-on-screen");
  }
  if (authored.consequenceKind === "none" && authored.meetingKind === "no-finite-meeting") {
    if (!supported.includes("screen-no-finite-real-image")) {
      supported.push("screen-no-finite-real-image");
    }
  }
  return [...new Set(supported)];
}

function feedbackForMissing(
  task: LensLocalReasoningTaskId,
  missing: readonly LensReasoningRelationId[],
  supported: readonly LensReasoningRelationId[],
): string {
  if (missing.includes("no-finite-meeting") || missing.includes("backward-extension") || missing.includes("actual-convergence")) {
    if (supported.includes("screen-no-finite-real-image") || supported.includes("virtual-not-on-screen") || supported.includes("real-on-screen")) {
      return "你已经说了最后的结果。还差中间一步：光通过透镜以后是怎么走的？为什么这会让光屏接不到？";
    }
    return "先写出光通过透镜以后是怎么走的，再接到最后的结果。";
  }
  if (missing.includes("screen-no-finite-real-image") || missing.includes("virtual-not-on-screen") || missing.includes("real-on-screen")) {
    return "你已经说了光线怎么走。还要接到最后的结果：这样走了以后，光屏上会怎样？";
  }
  if (missing.includes("object-at-f") && task === "u-equals-f") {
    return "先点明这次物体相对焦点在哪里，再说明光怎样走、光屏上会怎样。";
  }
  if (missing.includes("object-inside-f") && task === "u-less-than-f") {
    return "先点明这次物体相对焦点在哪里，再说明光怎样走、光屏上会怎样。";
  }
  return "这次理由还不能说明当前这个判断。再补上缺的那一层关系，不必把整个模型都写一遍。";
}

export function evaluateLensLocalReasoning(
  text: string,
  task: LensLocalReasoningTaskId,
  context: LensLocalReasoningContext = {},
): LocalReasoningResult {
  const compactText = compact(text);
  const fast = classifyLensStep6FastPath(text);
  const supported = detectSupportedRelations(text, context);
  const required = requiredForTask(task);
  const authored = analyzeConvexLensAuthored(text);

  if (fast.kind === "needs-llm") {
    return {
      sufficient: false,
      status: "unparseable",
      supportedRelations: supported,
      missingRequiredRelations: required.filter((item) => !supported.includes(item)),
      contradictions: [],
      feedback: "这句话我还没看清你想表达的光线关系。可以再说具体一点：光线最后在哪里相遇？这会形成什么结果？",
    };
  }

  if (SCREEN_CREATES_IMAGE.test(compactText)) {
    return {
      sufficient: false,
      status: "incorrect",
      supportedRelations: supported,
      missingRequiredRelations: [],
      contradictions: ["screen-creates-image"],
      feedback: "光屏是接收用的，它不能决定像在哪里。再从光线怎样走来看。",
    };
  }

  if (task === "u-equals-f" && (ORDINARY_REAL_AT_F.test(compactText) || supported.includes("real-on-screen"))) {
    if (supported.includes("object-at-f") || OBJECT_AT_F.test(compactText)) {
      return {
        sufficient: false,
        status: "incorrect",
        supportedRelations: supported,
        missingRequiredRelations: [],
        contradictions: ["finite-real-image-at-f"],
        feedback: "你写的结果和物体在这个位置时的光线走法对不上。再看光通过透镜以后有没有交到一个地方。",
      };
    }
  }

  if (task === "u-equals-f" && NO_IMAGE_IF_NO_SCREEN.test(compactText) && !supported.includes("no-finite-meeting")) {
    return {
      sufficient: false,
      status: "incorrect",
      supportedRelations: supported,
      missingRequiredRelations: ["no-finite-meeting"],
      contradictions: ["no-screen-means-no-image"],
      feedback: "光屏上接不到，不等于这里一定没有像。还要说明光通过透镜以后是怎么走的。",
    };
  }

  if (!authored.hasMeetingLanguage && !authored.hasConsequenceLanguage && compactText.length >= 8) {
    return {
      sufficient: false,
      status: "unparseable",
      supportedRelations: supported,
      missingRequiredRelations: required.filter((item) => !supported.includes(item)),
      contradictions: [],
      feedback: "这句话我还没看清你想表达的光线关系。可以再说具体一点：光线最后在哪里相遇？这会形成什么结果？",
    };
  }

  if (authored.contradictory) {
    return {
      sufficient: false,
      status: "contradictory",
      supportedRelations: supported,
      missingRequiredRelations: required.filter((item) => !supported.includes(item)),
      contradictions: ["meeting-consequence-mismatch"],
      feedback: lensAuthoredBindMissingMessage(authored),
    };
  }

  const missing = required.filter((item) => !supported.includes(item));
  if (missing.length === 0 && (fast.kind === "sufficient" || authored.hasConsequenceBind)) {
    return {
      sufficient: true,
      status: "sufficient",
      supportedRelations: supported,
      missingRequiredRelations: [],
      contradictions: [],
      feedback: "",
    };
  }

  if (
    task === "u-equals-f" &&
    supported.includes("object-at-f") &&
    supported.includes("no-finite-meeting") &&
    supported.includes("screen-no-finite-real-image") &&
    !authored.contradictory
  ) {
    return {
      sufficient: true,
      status: "sufficient",
      supportedRelations: supported,
      missingRequiredRelations: [],
      contradictions: [],
      feedback: "",
    };
  }

  return {
    sufficient: false,
    status: "insufficient",
    supportedRelations: supported,
    missingRequiredRelations: missing,
    contradictions: [],
    feedback: feedbackForMissing(task, missing, supported),
  };
}

export function evaluateLensModelCoverage(text: string): ModelCoverageResult {
  const coveredBranches = detectSupportedRelations(text).filter((item) =>
    MODEL_BRANCHES.includes(item),
  );
  return {
    coveredBranches,
    missingBranches: MODEL_BRANCHES.filter((item) => !coveredBranches.includes(item)),
  };
}

export function inferLensAiOffLocalTask(input: {
  challengeId: string;
  objectStation?: string;
  reasoning: string;
}): "window-real" | "u-equals-f" | "u-less-than-f" | "compound" {
  if (input.challengeId !== "ai-off-boundary-magnifier-cannot-catch-virtual") {
    return "window-real";
  }
  const authored = analyzeConvexLensAuthored(input.reasoning);
  const compactText = compact(input.reasoning);
  const namesF =
    input.objectStation === "at-f" ||
    OBJECT_AT_F.test(compactText) ||
    authored.meetingKind === "no-finite-meeting";
  const namesVirtual =
    input.objectStation === "inside-f" ||
    authored.meetingKind === "backward-extension" ||
    authored.consequenceKind === "virtual" ||
    /虚像|往回|散开/.test(compactText);
  const fMechanism = authored.meetingKind === "no-finite-meeting" || /平行|无法相交|没有聚/.test(compactText);
  if (fMechanism && namesVirtual && /虚像|往回|散开/.test(compactText) && namesF) {
    return "compound";
  }
  if (authored.meetingKind === "no-finite-meeting" || input.objectStation === "at-f") {
    return "u-equals-f";
  }
  if (authored.meetingKind === "backward-extension" || input.objectStation === "inside-f") {
    return "u-less-than-f";
  }
  if (namesF && !namesVirtual) {
    return "u-equals-f";
  }
  return "compound";
}
