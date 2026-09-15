import { describe, expect, it } from "vitest";

import { evaluateLensDescription } from "@/lib/learning/lens-describe";

const structure = {
  object: "optical-bench" as const,
  quantities: "object-f-image-screen" as const,
  change: "object-or-screen-changes-view" as const,
};

describe("Scene 07 DESCRIBE lexical vs physics", () => {
  it("still rejects a vague token that does not describe the situation", () => {
    expect(
      evaluateLensDescription({ ...structure, studentDescription: "变了" }).sufficient,
    ).toBe(false);
  });

  it("accepts a short ordinary Grade-9 sentence with the same observable meaning", () => {
    expect(
      evaluateLensDescription({
        ...structure,
        studentDescription: "物体和屏不是一个",
      }).sufficient,
    ).toBe(true);
  });

  it("does not require the textbook token 像 when the visible situation is described", () => {
    expect(
      evaluateLensDescription({
        ...structure,
        studentDescription: "屏上图样会跟着变",
      }).sufficient,
    ).toBe(true);
  });
});
