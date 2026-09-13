export type LensFeedbackKind =
  | "missing"
  | "inconsistent"
  | "think_again"
  | "blocked"
  | "error";

export function lensBlockedFeedback(message: string): LensFeedback {
  return { kind: "blocked", message };
}

export function lensErrorFeedback(message: string): LensFeedback {
  return { kind: "error", message };
}

export interface LensFeedback {
  kind: LensFeedbackKind;
  message: string;
}

const INCONSISTENT = new Set([
  "image-conflicts-meeting-mode",
  "meeting-mode-conflicts-station",
  "geometrically-incoherent-rays",
  "station-impossible-ray",
]);

export function lensFeedbackForFailureKind(
  failureKind: string | undefined,
  missingLabels: string[],
): LensFeedback {
  if (missingLabels.length > 0) {
    return {
      kind: "missing",
      message: `还有没写完的：${missingLabels.join("；")}。`,
    };
  }
  if (failureKind && INCONSISTENT.has(failureKind)) {
    if (failureKind === "geometrically-incoherent-rays") {
      return {
        kind: "inconsistent",
        message:
          "这条光线的名字和它的走法对不上。先回到这一条：到达透镜前怎么走，过透镜后该怎么走。",
      };
    }
    if (failureKind === "station-impossible-ray") {
      return {
        kind: "inconsistent",
        message:
          "你选的第三条光线，和现在的物体位置放在一起走不通。先回到两条必做的光线。",
      };
    }
    return {
      kind: "inconsistent",
      message:
        "你对光线怎样相遇和像的判断放在一起有冲突。先回到两条光线，看它们是真的相交，还是只有延长线相交。",
    };
  }
  if (failureKind === "table-row-only" || failureKind === "properties-without-relation") {
    return {
      kind: "think_again",
      message: "性质选出来了还不够。用一句话说明：会聚方式怎样带来这样的像。",
    };
  }
  if (failureKind === "authored-missing-meeting-bind") {
    return {
      kind: "think_again",
      message: "还要用自己的话把光线怎样相遇和像的后果连起来。不要只堆性质词。",
    };
  }
  if (failureKind === "u-equals-f-as-ordinary-image") {
    return {
      kind: "think_again",
      message:
        "物体正好在焦点上时，先看折射后的光线是不是彼此平行、会不会在有限位置会聚，再谈像。不要把它说成普通的清晰成像。",
    };
  }
  if (
    failureKind === "recognized-finished-diagram" ||
    failureKind === "copied-visible-diagram"
  ) {
    return {
      kind: "think_again",
      message: "这里没有已经画好的标准图可以点选。要自己决定两条光线怎么走。",
    };
  }
  return {
    kind: "think_again",
    message: "先自己组装两条光线，再说明交点怎样决定像。不要只背表。",
  };
}

export function lensTransferFeedback(failureKind: string | undefined): LensFeedback {
  if (failureKind === "surface-convex-lens-slogan") {
    return {
      kind: "think_again",
      message: "“都有凸透镜”不够。先说这个新情境里物体相对焦点在哪里。",
    };
  }
  if (failureKind === "wrong-target-structure") {
    return {
      kind: "inconsistent",
      message: "这个新情境的物距、会聚方式和像还对不上。先回到物体相对焦点的位置。",
    };
  }
  return {
    kind: "think_again",
    message: "先选出物距、会聚方式和像的后果，再用自己的话连起来。",
  };
}
