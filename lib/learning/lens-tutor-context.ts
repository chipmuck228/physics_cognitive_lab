import { LENS_TUTOR_GOALS } from "@/lib/content/convex-lens-optical-bench";
import { convexLensPhysicsSnapshot } from "@/lib/physics/convex-lens-optical-bench";
import { getConvexLensPhysicsState } from "@/lib/runtime/physics-state";
import type { SceneTutorContext } from "@/lib/runtime/types";
import type { LearningSession } from "@/types/learning";

export function getConvexLensTutorContext(session: LearningSession): SceneTutorContext {
  const physics = convexLensPhysicsSnapshot(getConvexLensPhysicsState(session));
  return {
    learningGoal:
      LENS_TUTOR_GOALS[session.stage] ?? "帮助学生分开看物体、透镜、像和光屏。",
    currentPhysicsState: physics,
    physicsSummary: `物距站点=${physics.objectStation}；光屏接收=${physics.screenReceive}；有限像=${physics.finiteImage}`,
    promptConstraint:
      "不要说出五种成像表或 1/f = 1/u + 1/v。不要替学生画完整光路。不要报出这次会成哪种像。AI_OFF 不得回答。",
  };
}
