import { describe, expect, it } from "vitest";

import {
  evaluateEngineDescription,
  hasOwnWords,
  hasSufficientEngineDescription,
  type EngineSnapshotAnswer,
} from "@/lib/learning/engine-describe";

const correctSnapshots: EngineSnapshotAnswer[] = [
  {
    stroke: "intake",
    piston: "down",
    intake: "open",
    exhaust: "closed",
    combustion: "absent",
  },
  {
    stroke: "power",
    piston: "down",
    intake: "closed",
    exhaust: "closed",
    combustion: "present",
  },
];

describe("engine DESCRIBE evidence", () => {
  it("does not pass from a non-empty sentence alone", () => {
    expect(
      evaluateEngineDescription({
        snapshots: [
          {
            stroke: "intake",
            piston: "",
            intake: "",
            exhaust: "",
            combustion: "",
          },
          {
            stroke: "power",
            piston: "",
            intake: "",
            exhaust: "",
            combustion: "",
          },
        ],
        studentDescription: "活塞向下运动，进气门打开，有气体进入。",
      }).sufficient,
    ).toBe(false);
  });

  it("counts correct piston evidence on both snapshots", () => {
    const evaluation = evaluateEngineDescription({
      snapshots: correctSnapshots,
      studentDescription: "活塞向下运动，这里出现了燃烧。",
    });
    expect(evaluation.pistonMotionCorrect).toBe(true);
  });

  it("counts correct valve or combustion evidence", () => {
    const evaluation = evaluateEngineDescription({
      snapshots: correctSnapshots,
      studentDescription: "活塞向下运动，这里出现了燃烧。",
    });
    expect(evaluation.intakeValveStateCorrect).toBe(true);
    expect(evaluation.combustionStateCorrect).toBe(true);
  });

  it("does not require a textbook stroke name", () => {
    const text = "活塞向下运动，两个气门关着，这里出现了燃烧。";
    const evaluation = evaluateEngineDescription({
      snapshots: correctSnapshots,
      studentDescription: text,
    });
    expect(text).not.toMatch(/吸气冲程|压缩冲程|做功冲程|排气冲程/);
    expect(evaluation.sufficient).toBe(true);
  });

  it("can pass with structured evidence and valid own-word description", () => {
    const evaluation = evaluateEngineDescription({
      snapshots: correctSnapshots,
      studentDescription: "活塞向下运动，进气门打开，有气体进入。",
    });
    expect(hasOwnWords("活塞向下运动，进气门打开，有气体进入。")).toBe(true);
    expect(evaluation.distinguishesPowerEvent).toBe(true);
    expect(evaluation.sufficient).toBe(true);
    expect(
      hasSufficientEngineDescription([
        {
          text: "活塞向下运动，进气门打开，有气体进入。",
          timestamp: "t",
          sufficient: true,
          engineAnswers: correctSnapshots,
        },
      ]),
    ).toBe(true);
  });

  it("rejects a sentence without two Han characters even if structure is correct", () => {
    expect(
      evaluateEngineDescription({
        snapshots: correctSnapshots,
        studentDescription: "ok",
      }).sufficient,
    ).toBe(false);
  });
});
