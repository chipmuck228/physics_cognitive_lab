import { describe, expect, it } from "vitest";

import { LENS_VOCAB } from "@/lib/content/convex-lens-optical-bench";

const LEAK = /实像|虚像|倒立|正立|u\s*>\s*2f|会聚|放大|缩小|接收不到|接收得/;

describe("Scene 07 just-in-time vocabulary", () => {
  it("grounds F, 光屏, and 像 without leaking imaging rules", () => {
    expect(LENS_VOCAB.F.term).toBe("F");
    expect(LENS_VOCAB.F.body).toMatch(/焦点/);
    expect(LENS_VOCAB.screen.term).toBe("光屏");
    expect(LENS_VOCAB.screen.body).toMatch(/白色板/);
    expect(LENS_VOCAB.image.term).toBe("像");
    expect(LENS_VOCAB.image.body).toMatch(/图样/);

    for (const item of Object.values(LENS_VOCAB)) {
      expect(item.body).not.toMatch(LEAK);
    }
  });
});
