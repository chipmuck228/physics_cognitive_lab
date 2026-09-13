import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ConvexLensOpticalBench } from "@/components/physics/convex-lens/ConvexLensOpticalBench";
import { backwardExtensionThroughNearFocusRay, twoStandardRays } from "@/content/physics-models/convex-lens-imaging/construction";
import {
  createInitialConvexLensState,
  officialBenchDisplay,
} from "@/lib/physics/convex-lens-optical-bench";

describe("Scene 07 PRI", () => {
  it("shows no finite image at u = f", () => {
    render(
      <ConvexLensOpticalBench
        state={{ ...createInitialConvexLensState(), objectStation: "at-f" }}
      />,
    );
    expect(screen.getByTestId("convex-lens-optical-bench")).toHaveAttribute(
      "data-finite-image",
      "false",
    );
    expect(screen.queryByTestId("optical-image")).not.toBeInTheDocument();
  });

  it("does not put a virtual image on the screen", () => {
    render(
      <ConvexLensOpticalBench
        state={{
          ...createInitialConvexLensState(),
          objectStation: "inside-f",
          screenAtImagePlane: true,
        }}
      />,
    );
    const bench = screen.getByTestId("convex-lens-optical-bench");
    expect(bench).toHaveAttribute("data-image-nature", "virtual");
    expect(bench).toHaveAttribute("data-image-side", "same-side");
    expect(bench).toHaveAttribute("data-screen-receive", "never");
    expect(bench.getAttribute("data-image-x")).not.toBe(bench.getAttribute("data-screen-x"));
  });

  it("moving the screen does not move the official image", () => {
    const at = officialBenchDisplay({
      ...createInitialConvexLensState(),
      objectStation: "beyond-2f",
      screenAtImagePlane: true,
    });
    const off = officialBenchDisplay({
      ...createInitialConvexLensState(),
      objectStation: "beyond-2f",
      screenAtImagePlane: false,
    });
    expect(at.geometry.imageX).toBe(off.geometry.imageX);
    expect(at.geometry.screenX).not.toBe(off.geometry.screenX);
    const { rerender } = render(
      <ConvexLensOpticalBench
        state={{ ...createInitialConvexLensState(), screenAtImagePlane: true }}
      />,
    );
    const first = screen.getByTestId("convex-lens-optical-bench").getAttribute("data-image-x");
    rerender(
      <ConvexLensOpticalBench
        state={{ ...createInitialConvexLensState(), screenAtImagePlane: false }}
      />,
    );
    expect(screen.getByTestId("convex-lens-optical-bench")).toHaveAttribute(
      "data-image-x",
      first,
    );
  });

  it("uses solid actual rays and dashed backward extensions", () => {
    render(
      <ConvexLensOpticalBench
        state={createInitialConvexLensState()}
        hideOfficialRays
        studentRays={[...twoStandardRays(), backwardExtensionThroughNearFocusRay()]}
      />,
    );
    expect(screen.getByTestId("ray-parallel-axis")).toHaveAttribute("data-ray-style", "solid");
    expect(screen.getByTestId("ray-through-center")).toHaveAttribute("data-ray-style", "solid");
    expect(screen.getByTestId("ray-through-near-focus")).toHaveAttribute(
      "data-ray-style",
      "dashed",
    );
  });

  it("keeps virtual-image outgoing rays solid and only dashes backward extensions", () => {
    render(
      <ConvexLensOpticalBench
        state={{
          ...createInitialConvexLensState(),
          objectStation: "inside-f",
          screenAtImagePlane: false,
        }}
        hideOfficialRays
        studentRays={[...twoStandardRays()]}
      />,
    );
    const parallel = screen.getByTestId("ray-parallel-axis");
    expect(parallel).toHaveAttribute("data-outgoing-style", "solid");
    expect(parallel).toHaveAttribute("data-backward-style", "dashed");
    expect(parallel.querySelector('[data-ray-segment="outgoing-actual"]')).toBeTruthy();
    expect(parallel.querySelector('[data-ray-segment="backward-extension"]')).toBeTruthy();
  });

  it("shows beyond-2f reduced and between-f-and-2f enlarged on correct sides", () => {
    const { rerender } = render(
      <ConvexLensOpticalBench
        state={{ ...createInitialConvexLensState(), objectStation: "beyond-2f" }}
      />,
    );
    const reduced = screen.getByTestId("convex-lens-optical-bench");
    expect(reduced).toHaveAttribute("data-image-size", "reduced");
    expect(reduced).toHaveAttribute("data-image-side", "other-side");
    rerender(
      <ConvexLensOpticalBench
        state={{ ...createInitialConvexLensState(), objectStation: "between-f-and-2f" }}
      />,
    );
    const enlarged = screen.getByTestId("convex-lens-optical-bench");
    expect(enlarged).toHaveAttribute("data-image-size", "enlarged");
    expect(enlarged).toHaveAttribute("data-image-side", "other-side");
  });

  it("does not silently redraw an invalid learner pairing as the official parallel ray", () => {
    render(
      <ConvexLensOpticalBench
        state={createInitialConvexLensState()}
        hideOfficialRays
        studentRays={[
          {
            kind: "parallel-axis",
            beforeLens: "parallel-to-principal-axis",
            afterLens: "undeviated",
            incidentPath: "actual",
          },
        ]}
      />,
    );
    const outgoing = screen
      .getByTestId("ray-parallel-axis")
      .querySelector('[data-ray-segment="outgoing-actual"]');
    expect(outgoing).toBeTruthy();
    expect(outgoing).toHaveAttribute("data-bench-y1", outgoing!.getAttribute("data-bench-y2"));
    const y1 = Number(outgoing!.getAttribute("data-bench-y1"));
    expect(y1).not.toBeCloseTo(0);
  });

  it("keeps official rays hidden while learner rays are on the bench", () => {
    render(
      <ConvexLensOpticalBench
        state={createInitialConvexLensState()}
        hideOfficialRays
        studentRays={[...twoStandardRays()]}
      />,
    );
    const bench = screen.getByTestId("convex-lens-optical-bench");
    expect(bench).toHaveAttribute("data-official-rays", "hidden");
    expect(screen.getByTestId("ray-parallel-axis")).toHaveAttribute("data-owner", "learner");
    expect(screen.getByTestId("ray-through-center")).toHaveAttribute("data-owner", "learner");
    expect(screen.queryByTestId("official-ray-parallel-axis")).not.toBeInTheDocument();
    expect(screen.queryByTestId("official-ray-through-center")).not.toBeInTheDocument();
  });

  it("shows no lens cover until the lens is partially covered", () => {
    const { rerender } = render(
      <ConvexLensOpticalBench state={createInitialConvexLensState()} />,
    );
    const bench = screen.getByTestId("convex-lens-optical-bench");
    expect(bench).toHaveAttribute("data-lens-partially-covered", "false");
    expect(screen.queryByTestId("lens-partial-cover")).not.toBeInTheDocument();
    expect(screen.getByTestId("optical-image")).toBeInTheDocument();
    expect(bench).toHaveAttribute("data-cover-brightness", "normal");
    rerender(
      <ConvexLensOpticalBench
        state={{ ...createInitialConvexLensState(), lensPartiallyCovered: true }}
      />,
    );
    const covered = screen.getByTestId("convex-lens-optical-bench");
    expect(covered).toHaveAttribute("data-lens-partially-covered", "true");
    expect(screen.getByTestId("lens-partial-cover")).toBeInTheDocument();
    expect(screen.getByTestId("lens-partial-cover")).toHaveAttribute("data-cover-on", "lens");
    const shape = screen.getByTestId("lens-partial-cover-shape");
    const coverX = Number(shape.getAttribute("data-cover-x"));
    const lensX = Number(shape.getAttribute("data-lens-x"));
    const screenNode = screen.getByTestId("screen");
    expect(Math.abs(coverX - lensX)).toBeLessThan(20);
    expect(screen.getByTestId("convex-lens")).toBeInTheDocument();
    expect(screen.getByTestId("optical-image")).toBeInTheDocument();
    expect(covered).toHaveAttribute("data-cover-complete", "true");
    expect(covered).toHaveAttribute("data-cover-brightness", "reduced");
    expect(screen.getByTestId("optical-image")).toHaveAttribute("data-testid", "optical-image");
    expect(screen.queryByTestId("optical-image-half")).not.toBeInTheDocument();
    expect(screenNode).not.toHaveAttribute("data-cover-on");
    rerender(<ConvexLensOpticalBench state={createInitialConvexLensState()} />);
    expect(screen.queryByTestId("lens-partial-cover")).not.toBeInTheDocument();
    expect(screen.getByTestId("convex-lens-optical-bench")).toHaveAttribute(
      "data-lens-partially-covered",
      "false",
    );
  });

  it("keeps F and 2F as distinct landmarks", () => {
    render(<ConvexLensOpticalBench state={createInitialConvexLensState()} />);
    expect(screen.getByTestId("near-f")).toHaveAttribute("data-quantity-id", "focal-point");
    expect(screen.getByTestId("near-2f")).toHaveAttribute(
      "data-quantity-id",
      "twice-focal-length",
    );
    expect(screen.getByTestId("physical-object")).toHaveAttribute(
      "data-quantity-id",
      "object-distance",
    );
    expect(screen.getByTestId("optical-image")).toHaveAttribute(
      "data-quantity-id",
      "image-distance",
    );
    expect(screen.getByTestId("screen")).toHaveAttribute(
      "data-quantity-id",
      "screen-receivable",
    );
  });
});
