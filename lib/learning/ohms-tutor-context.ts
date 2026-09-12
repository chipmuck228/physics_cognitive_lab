import { OHMS_TUTOR_GOALS } from "@/lib/content/simple-resistor-circuit";
import { ohmsPhysicsSnapshot } from "@/lib/physics/simple-resistor-circuit";
import { getOhmsPhysicsState } from "@/lib/runtime/physics-state";
import type { SceneTutorContext } from "@/lib/runtime/types";
import type { LearningSession } from "@/types/learning";

export function getOhmsTutorContext(session: LearningSession): SceneTutorContext {
  const physics = ohmsPhysicsSnapshot(getOhmsPhysicsState(session));
  return {
    learningGoal: OHMS_TUTOR_GOALS[session.stage] ?? "帮助学生分开看电流、电压和电阻。",
    currentPhysicsState: physics,
    physicsSummary: `闭合=${physics.circuitClosed}；左电流=${physics.left.currentA} A；右电流=${physics.right.currentA} A`,
    promptConstraint:
      "不要说出 I = U / R 作为现成答案。不要替学生建关系。不要透露电流读数的结论。AI_OFF 不得回答。",
  };
}
