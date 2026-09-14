import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LabHome } from "@/components/home/LabHome";
import {
  HOME_COPY,
  HOME_PATH_STEPS,
  HOME_ROLES,
  LAB_SCENES,
  sceneEnterAria,
} from "@/lib/content/home";

describe("lab homepage", () => {
  it("names the product stance and lists seven scene entries", () => {
    render(<LabHome />);

    expect(
      screen.getByRole("heading", { level: 1, name: HOME_COPY.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(HOME_COPY.lead)).toBeInTheDocument();
    expect(screen.getByText(HOME_COPY.contrast)).toBeInTheDocument();

    for (const role of HOME_ROLES) {
      expect(screen.getByRole("heading", { name: role.title })).toBeInTheDocument();
    }

    expect(screen.getByText(HOME_PATH_STEPS.join(" → "))).toBeInTheDocument();

    expect(LAB_SCENES).toHaveLength(7);
    for (const scene of LAB_SCENES) {
      const link = screen.getByRole("link", { name: sceneEnterAria(scene) });
      expect(link).toHaveAttribute("href", scene.href);
      expect(screen.getByText(scene.question)).toBeInTheDocument();
    }
  });

  it("does not claim mastery or guaranteed scores", () => {
    render(<LabHome />);
    const page = document.body.textContent ?? "";
    expect(page).not.toMatch(/保证提分|科学证明|已经掌握|AI 完全理解/);
    expect(page).toContain("不表示已经学会了物理");
  });
});
