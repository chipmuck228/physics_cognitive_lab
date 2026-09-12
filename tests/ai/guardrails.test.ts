import { applyTutorGuardrails, looksLikeAnswerLeak } from "@/lib/ai/guardrails";
import { SAFE_TUTOR_FALLBACK } from "@/lib/ai/tutor-schema";
import { LearningStage } from "@/types/learning";
import { describe, expect, it } from "vitest";

describe("tutor guardrails", () => {
  it("blocks tutor output during AI_OFF", () => {
    const result = applyTutorGuardrails(
      {
        action: "HINT",
        message: "Think about energy entering the spoon.",
        cognitiveGoal: "independent",
        revealsAnswer: false,
        misconceptionDetected: null,
        confidence: "high",
        suggestedNextStage: null,
      },
      LearningStage.AI_OFF,
    );

    expect(result).toEqual(SAFE_TUTOR_FALLBACK);
  });

  it("detects model construction leaks", () => {
    expect(
      looksLikeAnswerLeak(
        LearningStage.MODEL,
        "Put internal energy changes in the middle box.",
        "microwave-bread",
      ),
    ).toBe(true);
  });

  it("detects Scene 02 PREDICT answer leaks without blocking microwave PREDICT copy", () => {
    expect(
      looksLikeAnswerLeak(
        LearningStage.PREDICT,
        "没有燃烧就不会有内能增加，所以不会有机械能输出。",
        "four-stroke-engine",
      ),
    ).toBe(true);
    expect(
      looksLikeAnswerLeak(
        LearningStage.PREDICT,
        "你可以想一想：刚才哪个变化只在那个特别的阶段出现？",
        "four-stroke-engine",
      ),
    ).toBe(false);
    expect(
      looksLikeAnswerLeak(LearningStage.PREDICT, "温度会升高", "microwave-bread"),
    ).toBe(true);
  });

  it("detects Scene 02 energy-chain leaks during OBSERVE and DESCRIBE", () => {
    expect(
      looksLikeAnswerLeak(
        LearningStage.OBSERVE,
        "这是做功冲程，化学能转化为内能再转化为机械能。",
        "four-stroke-engine",
      ),
    ).toBe(true);
    expect(
      looksLikeAnswerLeak(
        LearningStage.DESCRIBE,
        "你可以说活塞向下。",
        "four-stroke-engine",
      ),
    ).toBe(false);
  });

  it("detects Scene 02 EXPLAIN and MODEL chain leaks without blocking microwave MODEL copy", () => {
    expect(
      looksLikeAnswerLeak(
        LearningStage.EXPLAIN,
        "燃料的化学能转化成工作气体的内能，再对机械系统做功，得到机械能。",
        "four-stroke-engine",
      ),
    ).toBe(true);
    expect(
      looksLikeAnswerLeak(
        LearningStage.EXPLAIN,
        "再看看第二个实验：燃烧已经发生了，但哪一步被卡住了？",
        "four-stroke-engine",
      ),
    ).toBe(false);
    expect(
      looksLikeAnswerLeak(
        LearningStage.MODEL,
        "化学能 → 内能 → 做功 → 机械能",
        "four-stroke-engine",
      ),
    ).toBe(true);
    expect(
      looksLikeAnswerLeak(
        LearningStage.MODEL,
        "中间应该选内能",
        "microwave-bread",
      ),
    ).toBe(true);
  });

  it("detects Scene 02 TRANSFER leaks without blocking microwave TRANSFER copy", () => {
    expect(
      looksLikeAnswerLeak(
        LearningStage.TRANSFER,
        "这个情境也使用 chemical-energy-internal-energy-mechanical-energy",
        "four-stroke-engine",
      ),
    ).toBe(true);
    expect(
      looksLikeAnswerLeak(
        LearningStage.TRANSFER,
        "只有后半段可以迁移",
        "four-stroke-engine",
      ),
    ).toBe(true);
    expect(
      looksLikeAnswerLeak(
        LearningStage.TRANSFER,
        "和微波炉是同一个模型",
        "microwave-bread",
      ),
    ).toBe(true);
    expect(
      looksLikeAnswerLeak(
        LearningStage.TRANSFER,
        "先别看装置名字。看看什么变了？",
        "four-stroke-engine",
      ),
    ).toBe(false);
  });

  it("detects Scene 03 EXPLAIN/MODEL/TRANSFER leaks without revealing the relation board", () => {
    expect(
      looksLikeAnswerLeak(
        LearningStage.EXPLAIN,
        "当前运动状态 + 合力 → 运动状态变化",
        "horizontal-force-cart",
      ),
    ).toBe(true);
    expect(
      looksLikeAnswerLeak(
        LearningStage.MODEL,
        "把关系板替你摆好：第一格填正在向右，第二格填合力与运动同一边。",
        "horizontal-force-cart",
      ),
    ).toBe(true);
    expect(
      looksLikeAnswerLeak(
        LearningStage.TRANSFER,
        "应该选还能用，这和刚才是同一个力与运动的关系。",
        "horizontal-force-cart",
      ),
    ).toBe(true);
    expect(
      looksLikeAnswerLeak(
        LearningStage.EXPLAIN,
        "力和运动是同一件事吗？先对着三次实验看。",
        "horizontal-force-cart",
      ),
    ).toBe(false);
  });

  it("coerces a forbidden action to an allowed one", () => {
    const result = applyTutorGuardrails(
      {
        action: "EXPLAIN",
        message: "What changed that you can measure?",
        cognitiveGoal: "description",
        revealsAnswer: false,
        misconceptionDetected: null,
        confidence: "medium",
        suggestedNextStage: null,
      },
      LearningStage.DESCRIBE,
    );

    expect(result.action).toBe("ASK");
  });
});
