import { expect, test } from "@playwright/test";
import path from "node:path";

import { HEAT_COPY } from "../../lib/content/equal-mass-heated-samples";
import { openHeatLab, startHeatLesson } from "./heat-helpers";

test("Scene 05 PRI-05-01 temperature identity after observe demo", async ({
  page,
}) => {
  await openHeatLab(page);
  await startHeatLesson(page);
  await page.getByRole("button", { name: HEAT_COPY.playDemo }).click();
  await expect(page.getByTestId("heat-sample-left-temperature-state")).toBeVisible({
    timeout: 5_000,
  });

  const waterState = page.getByTestId("heat-sample-left-temperature-state");
  const waterRise = page.getByTestId("heat-sample-left-temperature-change");
  const sandState = page.getByTestId("heat-sample-right-temperature-state");
  const sandRise = page.getByTestId("heat-sample-right-temperature-change");

  await expect(waterState).toHaveText("温度：20℃ → 30℃");
  await expect(waterRise).toHaveText("升温：10℃");
  await expect(sandState).toHaveText("温度：20℃ → 70℃");
  await expect(sandRise).toHaveText("升温：50℃");
  await expect(page.getByText("ΔT 10℃ → 30℃")).toHaveCount(0);
  await expect(page.getByText("ΔT 50℃ → 70℃")).toHaveCount(0);

  await page.screenshot({
    path: path.join(
      "spec",
      "student-ui",
      "screenshots",
      "scene-05-pri-05-01-repaired.png",
    ),
    fullPage: true,
  });
});
