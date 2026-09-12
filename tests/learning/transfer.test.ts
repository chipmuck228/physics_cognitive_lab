import { describe, expect, it } from "vitest";

import {
  classifyTransferAttempt,
  hasCompletedTransferScenarios,
  summarizeTransferAttempt,
} from "@/lib/learning/transfer";

describe("transfer evaluation", () => {
  it("recognizes shared-model signals in a transfer response", () => {
    expect(
      classifyTransferAttempt(
        "Energy moves into the hand, so its temperature becomes warmer.",
      ),
    ).toBe(true);
    expect(classifyTransferAttempt("能量传到手上，所以手会变暖。")).toBe(true);
    expect(classifyTransferAttempt("手变暖了。")).toBe(false);
  });

  it("requires all transfer scenarios before the stage is complete", () => {
    expect(
      hasCompletedTransferScenarios([
        {
          scenarioId: "hot-water-bag",
          response: "Energy warms the hand.",
          identifiedSharedModel: true,
          timestamp: "t",
        },
      ]),
    ).toBe(false);

    expect(
      hasCompletedTransferScenarios([
        {
          scenarioId: "hot-water-bag",
          response: "Energy warms the hand.",
          identifiedSharedModel: true,
          timestamp: "t",
        },
        {
          scenarioId: "rubbing-hands",
          response: "Energy and temperature change.",
          identifiedSharedModel: true,
          timestamp: "t",
        },
        {
          scenarioId: "electric-kettle",
          response: "Energy goes into the water so the temperature rises.",
          identifiedSharedModel: true,
          timestamp: "t",
        },
      ]),
    ).toBe(true);
  });

  it("returns stage-appropriate feedback", () => {
    expect(
      summarizeTransferAttempt({
        scenarioId: "hot-water-bag",
        response: "Energy warms the hand.",
        identifiedSharedModel: true,
        timestamp: "t",
      }),
    ).toContain("能量和温度");
  });
});
