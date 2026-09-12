import { describe, expect, it } from "vitest";

import {
  applyOhmsAiOffPostCheck,
  evaluateOhmsAiOffAttempt,
  intendedOhmsAiOffAnswerId,
  intendedOhmsAiOffPostCheckIds,
  intendedOhmsAiOffPreCommitIds,
  OHMS_AI_OFF_A,
  OHMS_AI_OFF_B,
} from "@/lib/learning/ohms-ai-off";
import { completeOhmsModelInput, evaluateOhmsModelConstruction } from "@/lib/learning/ohms-model";
import {
  completeOhmsFilamentTransferInput,
  completeOhmsWireTransferInput,
  evaluateOhmsTransfer,
} from "@/lib/learning/ohms-transfer";

function l4(text: string) {
  return evaluateOhmsModelConstruction({
    ...completeOhmsModelInput("t1"),
    studentReasoning: text,
  }).correctStructure;
}

function l5Wire(text: string) {
  return evaluateOhmsTransfer({
    ...completeOhmsWireTransferInput("t1"),
    studentExplanation: text,
  }).accepted;
}

function l5Filament(text: string) {
  return evaluateOhmsTransfer({
    ...completeOhmsFilamentTransferInput("t1"),
    studentExplanation: text,
  }).accepted;
}

function l6A(text: string) {
  return evaluateOhmsAiOffAttempt({
    challengeId: OHMS_AI_OFF_A,
    selectedAnswer: intendedOhmsAiOffAnswerId(OHMS_AI_OFF_A),
    studentReasoning: text,
    postCheckIds: intendedOhmsAiOffPostCheckIds(OHMS_AI_OFF_A),
    preCommitEvidenceIds: intendedOhmsAiOffPreCommitIds(OHMS_AI_OFF_A),
    llmUsed: false,
  }).accepted;
}

function l6B(text: string) {
  return evaluateOhmsAiOffAttempt({
    challengeId: OHMS_AI_OFF_B,
    selectedAnswer: intendedOhmsAiOffAnswerId(OHMS_AI_OFF_B),
    studentReasoning: text,
    postCheckIds: intendedOhmsAiOffPostCheckIds(OHMS_AI_OFF_B),
    preCommitEvidenceIds: intendedOhmsAiOffPreCommitIds(OHMS_AI_OFF_B),
    llmUsed: false,
  }).accepted;
}

describe("authored evidence adversarial probe", () => {
  it("1. correct quantities, wrong direction must fail", () => {
    expect(l4("电阻不变，电压变大，所以电流变小。电压不变，电阻变大，电流更大。")).toBe(
      false,
    );
    expect(l5Wire("电阻不变，电压变大，所以电流变小。")).toBe(false);
    expect(l6A("换更高电压时电阻不变，电流更小；换更大电阻时电压不变，电流更大。")).toBe(
      false,
    );
    expect(
      l6B("R = U / I 只是同一个关系。电压变了并没有制造新的电阻，电阻仍可看成不变，电流会变小。"),
    ).toBe(false);
  });

  it("2. correct words, wrong consequence quantity must fail", () => {
    expect(l4("电压不变，电阻变大，所以电压变大。电阻不变，电压变大，所以电阻变大。")).toBe(
      false,
    );
    expect(l5Wire("电压不变，电阻变大，所以电压变大。")).toBe(false);
    expect(l6A("电压不变电阻变大所以电压变大；电阻不变电压变大所以电阻变大。")).toBe(false);
    expect(l6B("并没有制造新的电阻，所以电压会变大。")).toBe(false);
  });

  it("3. token sandwich / no relation must fail", () => {
    expect(l4("电阻不变 电压变大 电流")).toBe(false);
    expect(l5Wire("电阻不变电压变大电流")).toBe(false);
    expect(l5Filament("电阻 温度 电流 电压")).toBe(false);
    expect(l6A("电阻不变 电压变大 电流 电阻变大 电压不变 电流")).toBe(false);
    expect(l6B("电阻 电压 电流 同一个关系")).toBe(false);
  });

  it("4. negated required I increase must fail", () => {
    expect(
      l4("电阻不变时，电压变大并不会让电流变大。电压不变时电阻更大电流更小。"),
    ).toBe(false);
    expect(l5Wire("电阻不变时，电压变大并不会让电流变大。")).toBe(false);
    expect(
      l6A("换更高电压时电阻不变，并不会让电流变大；换更大电阻时电压不变，电流更小。"),
    ).toBe(false);
    expect(
      l6B("并没有制造新的电阻，电阻仍可看成不变，但电压变大并不会让电流变大。"),
    ).toBe(false);
  });

  it("5. reversed held/changed quantity must fail", () => {
    expect(
      l4("电压没变的时候，电阻更大，电流就更大。电阻没变时电压更大电流更小。"),
    ).toBe(false);
    expect(l5Wire("电压没变的时候，电阻更大，电流就更大。")).toBe(false);
    expect(
      l6A("换更高电压时电阻不变，电流更小；电压不变时电阻更大，电流更大。"),
    ).toBe(false);
  });

  it("6. generic physics language with I/U/R present must fail", () => {
    expect(l4("电流电压电阻都是物理量，都要看三个量。")).toBe(false);
    expect(l5Wire("电流电压电阻都是物理量，都是电路。")).toBe(false);
    expect(l5Filament("电流电压电阻都要看一看，灯丝也是电路。")).toBe(false);
    expect(l6A("电流电压电阻都是物理量，电阻不变电压没变。")).toBe(false);
    expect(l6B("电流电压电阻是三个量，同一个关系。")).toBe(false);
  });

  it("7. one correct control fails where both are required", () => {
    const oneControl = "电阻没变的时候，电压更大，电流就更大。";
    expect(l4(oneControl)).toBe(false);
    expect(l6A(oneControl)).toBe(false);
    expect(l5Wire(oneControl)).toBe(true);
  });

  it("8. correct relational paraphrase should pass", () => {
    const both =
      "同一个电阻时，电压增大，电流也会增大。同一个电压时，电阻增大，电流就会减小。";
    expect(l4(both)).toBe(true);
    expect(l5Wire(both)).toBe(true);
    expect(
      l5Filament("灯丝变热以后电阻会变，所以不能再用固定电阻去说电流一定跟着电压成正比。"),
    ).toBe(true);
    expect(
      l6A("换更高电压的电池时电阻可以看成不变，电流更大；换更大电阻时电压可以看成不变，电流更小。"),
    ).toBe(true);
    expect(
      l6B("R = U / I 只是同一个关系。电压变了并没有制造新的电阻，电阻仍可看成不变，电流会变大。"),
    ).toBe(true);
  });

  it("9. concise Grade 9 Chinese should pass", () => {
    const concise =
      "电阻没变，电压更大，电流更大。电压没变，电阻更大，电流更小。";
    expect(l4(concise)).toBe(true);
    expect(l5Wire("电阻没变，电压更大，电流更大。")).toBe(true);
    expect(l5Filament("灯丝发热时电阻可能会变，不能说电压加倍电流一定加倍。")).toBe(true);
    expect(l6B("电阻是这段导体的属性，电压变了并没有制造新的电阻。")).toBe(true);
  });

  it("10. punctuation and spacing variation should still pass", () => {
    expect(
      l4("电阻没变 的 时候 ， 电压更大 ， 电流就更大 。 换电阻时 电压不变 ， 电阻更大 电流更小"),
    ).toBe(true);
    expect(l5Wire("电阻没变的时候，电压更大，电流就更大。")).toBe(true);
    expect(
      l5Filament("灯丝发热时，电阻可能会变，所以不能再用固定电阻说电流一定跟着电压成正比。"),
    ).toBe(true);
  });

  it("L5 reasoning for one target cannot pass the other target", () => {
    const wireText = completeOhmsWireTransferInput("t").studentExplanation;
    const filamentText = completeOhmsFilamentTransferInput("t").studentExplanation;
    expect(l5Wire(wireText)).toBe(true);
    expect(l5Filament(wireText)).toBe(false);
    expect(l5Filament(filamentText)).toBe(true);
    expect(l5Wire(filamentText)).toBe(false);
  });

  it("L6 post-check cannot manufacture missing pre-commit authored evidence", () => {
    const weak = evaluateOhmsAiOffAttempt({
      challengeId: OHMS_AI_OFF_A,
      selectedAnswer: intendedOhmsAiOffAnswerId(OHMS_AI_OFF_A),
      studentReasoning: "电阻不变 电压变大 电流",
      postCheckIds: [],
      preCommitEvidenceIds: intendedOhmsAiOffPreCommitIds(OHMS_AI_OFF_A),
      llmUsed: false,
    });
    expect(weak.accepted).toBe(false);
    const manufactured = applyOhmsAiOffPostCheck(
      {
        challengeId: OHMS_AI_OFF_A,
        selectedAnswer: intendedOhmsAiOffAnswerId(OHMS_AI_OFF_A),
        studentReasoning: "电阻不变 电压变大 电流",
        answerCorrect: true,
        reasoningSignals: weak.reasoningSignals,
        postCheckIds: [],
        preCommitEvidenceIds: intendedOhmsAiOffPreCommitIds(OHMS_AI_OFF_A),
        timestamp: "t1",
        accepted: false,
        llmUsed: false,
        completedWithoutAI: true,
      },
      intendedOhmsAiOffPostCheckIds(OHMS_AI_OFF_A),
      false,
    );
    expect(manufactured.accepted).toBe(false);
  });
});
