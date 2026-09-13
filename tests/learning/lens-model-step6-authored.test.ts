import { describe, expect, it } from "vitest";

import {
  analyzeConvexLensAuthored,
  evaluateConvexLensModelConstruction,
  officialImageConsequence,
  twoStandardRays,
} from "@/content/physics-models/convex-lens-imaging/construction";
import {
  completeLensModelDraft,
  evaluateLensModelStep,
} from "@/lib/learning/lens-model";

const LEARNER_SENTENCE = "我改变了物体位置，看见光线在光屏上真正汇聚，成实像。";

function step6(text: string) {
  return evaluateLensModelStep(
    { ...completeLensModelDraft("beyond-2f"), studentReasoning: text },
    6,
  );
}

function finalFor(text: string, station: "beyond-2f" | "inside-f" | "at-f" = "beyond-2f") {
  const draft = completeLensModelDraft(station);
  return evaluateConvexLensModelConstruction({
    objectStation: station,
    rays: twoStandardRays(),
    meetingMode: draft.meetingMode as "actual-convergence" | "backward-extension" | "no-finite-meeting",
    image: officialImageConsequence(station),
    modelReasoning: text,
    constructionSource: "student-constructed",
  });
}

describe("Scene 07 MODEL step 6 authored relation", () => {
  it("accepts the learner-authored 汇聚 / 成实像 sentence", () => {
    const flags = analyzeConvexLensAuthored(LEARNER_SENTENCE);
    expect(flags).toMatchObject({
      generic: false,
      nounSandwich: false,
      tableRowOnly: false,
      hasMeetingLanguage: true,
      hasConsequenceLanguage: true,
      hasConsequenceBind: true,
      contradictory: false,
      meetingKind: "actual-convergence",
      missingKind: null,
    });
    expect(step6(LEARNER_SENTENCE).status).toBe("ready");
    expect(finalFor(LEARNER_SENTENCE).ok).toBe(true);
  });

  it.each([
    ["折射后的光线会聚在一起，所以形成实像。"],
    ["这些光线最后聚到一起，光屏上就能接到实像。"],
    ["光线真正汇聚，成实像。"],
    ["光线反向延长后才交在一起，所以这是虚像，光屏接不到。"],
    ["折射后的光线彼此平行，因此在有限距离的光屏上接不到清晰像。"],
  ])("accepts semantic bind %# %s", (text) => {
    const flags = analyzeConvexLensAuthored(text);
    expect(flags.hasConsequenceBind).toBe(true);
    expect(flags.generic).toBe(false);
    expect(flags.nounSandwich).toBe(false);
    const station = flags.meetingKind === "backward-extension"
      ? "inside-f"
      : flags.meetingKind === "no-finite-meeting"
        ? "at-f"
        : "beyond-2f";
    expect(step6(text).status).toBe("ready");
    expect(finalFor(text, station).ok).toBe(true);
  });

  it.each([
    ["会聚 实像 光屏。"],
    ["倒立 缩小 实像。"],
    ["光线 实像 会聚。"],
  ])("rejects token sandwich %# %s", (text) => {
    const flags = analyzeConvexLensAuthored(text);
    expect(flags.hasConsequenceBind).toBe(false);
    expect(flags.nounSandwich || flags.tableRowOnly || flags.generic).toBe(true);
    const blocked = step6(text);
    expect(blocked.status).toBe("inconsistent");
    expect(blocked.status === "inconsistent" && blocked.message).toMatch(/背表或堆名词/);
    expect(blocked.status === "inconsistent" && blocked.message).not.toMatch(/真正相交/);
    expect(finalFor(text).ok).toBe(false);
  });

  it.each([
    ["这是实像。"],
    ["光屏可以接到。"],
  ])("rejects consequence without meeting %# %s", (text) => {
    const flags = analyzeConvexLensAuthored(text);
    expect(flags.hasMeetingLanguage).toBe(false);
    expect(flags.hasConsequenceBind).toBe(false);
    const blocked = step6(text);
    expect(blocked.status).toBe("inconsistent");
    expect(blocked.status === "inconsistent" && blocked.message).toMatch(/怎样相遇/);
    expect(blocked.status === "inconsistent" && blocked.message).not.toMatch(/真正相交/);
  });

  it("names a missing consequence when meeting language is already present", () => {
    const text = "光线在另一侧真正汇聚。";
    const flags = analyzeConvexLensAuthored(text);
    expect(flags.hasMeetingLanguage).toBe(true);
    expect(flags.hasConsequenceLanguage).toBe(false);
    const blocked = step6(text);
    expect(blocked.status).toBe("inconsistent");
    expect(blocked.status === "inconsistent" && blocked.message).toMatch(/像会怎样|成实像|接不到/);
    expect(blocked.status === "inconsistent" && blocked.message).not.toMatch(/真正相交/);
  });

  it("names a missing relation when both ideas are present but not bound", () => {
    const text = "成实像。另外我看见光线真正汇聚。";
    const flags = analyzeConvexLensAuthored(text);
    expect(flags.hasMeetingLanguage).toBe(true);
    expect(flags.hasConsequenceLanguage).toBe(true);
    expect(flags.hasConsequenceBind).toBe(false);
    expect(flags.missingKind).toBe("relation");
    const blocked = step6(text);
    expect(blocked.status).toBe("inconsistent");
    expect(blocked.status === "inconsistent" && blocked.message).toMatch(/连起来/);
  });

  it.each([
    ["光线真正汇聚，所以是虚像。"],
    ["光线反向延长后相交，所以成实像。"],
    ["折射后光线彼此平行，所以成实像。"],
  ])("rejects a locally contradictory bind %# %s", (text) => {
    const flags = analyzeConvexLensAuthored(text);
    expect(flags.contradictory).toBe(true);
    expect(flags.hasConsequenceBind).toBe(false);
    const blocked = step6(text);
    expect(blocked.status).toBe("inconsistent");
    expect(blocked.status === "inconsistent" && blocked.message).toMatch(/对不上/);
    expect(finalFor(text).ok).toBe(false);
  });

  it("keeps step 6 and the final evaluator on the same authored analysis", () => {
    const accepted = LEARNER_SENTENCE;
    expect(step6(accepted).status).toBe("ready");
    expect(finalFor(accepted).ok).toBe(true);
    const rejected = "倒立缩小实像。";
    expect(step6(rejected).status).not.toBe("ready");
    expect(finalFor(rejected).ok).toBe(false);
  });
});
