import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { OhmsRelationBoard } from "@/components/learning/OhmsRelationBoard";
import { OHMS_COPY } from "@/lib/content/simple-resistor-circuit";
import {
  buildOhmsModelAttempt,
  emptyOhmsModelDraft,
  ohmsModelStudentFeedback,
  type OhmsModelDraft,
} from "@/lib/learning/ohms-model";
import type { StudentUiFeedback } from "@/lib/learning/student-ui-feedback";

function BoardHarness({
  initial = emptyOhmsModelDraft(),
}: {
  initial?: OhmsModelDraft;
}) {
  const [draft, setDraft] = useState(initial);
  const [gateFeedback, setGateFeedback] = useState<StudentUiFeedback | null>(null);
  const [accepted, setAccepted] = useState(false);

  return (
    <div>
      {accepted ? <p>已进入下一步</p> : null}
      <OhmsRelationBoard
        draft={draft}
        gateFeedback={gateFeedback}
        needStructure={false}
        hints={[]}
        canRevealHint={false}
        onChange={setDraft}
        onSubmit={() => {
          const attempt = buildOhmsModelAttempt({
            ...draft,
            timestamp: "2026-09-12T00:00:00.000Z",
          });
          if (attempt.correctStructure) {
            setAccepted(true);
            setGateFeedback(null);
            return;
          }
          setGateFeedback(ohmsModelStudentFeedback(draft, attempt));
        }}
        onRevealHint={() => undefined}
      />
    </div>
  );
}

describe("Scene 06 MODEL UI contract", () => {
  it("shows an explicit question for each board group", () => {
    render(<BoardHarness />);
    expect(screen.getByText("通过这段电阻的量是什么？")).toBeInTheDocument();
    expect(screen.getByText("这段电阻两端的量是什么？")).toBeInTheDocument();
    expect(screen.getByText("这段导体本身的属性是什么？")).toBeInTheDocument();
    expect(screen.getByText("这三个量用哪一句关系连在一起？")).toBeInTheDocument();
    expect(screen.getByText("电阻不变时，电压更大，电流怎样？")).toBeInTheDocument();
    expect(screen.getByText("电压不变时，电阻更大，电流怎样？")).toBeInTheDocument();
    expect(
      screen.getByText("有人说 R = U / I，所以改变电压就制造了新的电阻。你怎么看？"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: OHMS_COPY.modelSubmit })).toBeInTheDocument();
  });

  it("empty submit shows visible missing feedback", async () => {
    const user = userEvent.setup();
    render(<BoardHarness />);
    await user.click(screen.getByRole("button", { name: OHMS_COPY.modelSubmit }));
    expect(await screen.findByRole("status")).toHaveTextContent("还有没选完的问题");
  });

  it("six correct clicks plus formula text stay rejected", async () => {
    const user = userEvent.setup();
    render(<BoardHarness />);
    await user.click(screen.getByRole("radio", { name: /通过这段电阻的量是什么？ 电流 I/ }));
    await user.click(screen.getByRole("radio", { name: /这段电阻两端的量是什么？ 电压 U/ }));
    await user.click(screen.getByRole("radio", { name: /这段导体本身的属性是什么？ 电阻 R/ }));
    await user.click(screen.getByRole("radio", { name: /I = U \/ R/ }));
    await user.click(screen.getByRole("radio", { name: /电阻不变时，电压更大，电流怎样？ 电流更大/ }));
    await user.click(screen.getByRole("radio", { name: /电压不变时，电阻更大，电流怎样？ 电流更小/ }));
    await user.click(screen.getByRole("radio", { name: /这只是同一个关系/ }));
    await user.click(screen.getByRole("radio", { name: /电路闭合，并且电阻可以看成不变/ }));
    await user.type(screen.getByTestId("ohms-model-reasoning"), "电流等于电压除以电阻");
    await user.click(screen.getByRole("button", { name: OHMS_COPY.modelSubmit }));
    expect(screen.queryByText("已进入下一步")).not.toBeInTheDocument();
    expect(await screen.findByRole("status")).toHaveTextContent("只背公式不行");
  });
});
