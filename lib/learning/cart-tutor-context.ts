import { CART_TUTOR_GOALS } from "@/lib/content/horizontal-force-cart";
import { isCartState, type CartState } from "@/lib/physics/horizontal-force-cart";
import type { SceneTutorContext } from "@/lib/runtime/types";
import { LearningStage, type LearningSession } from "@/types/learning";

export function getCartTutorContext(session: LearningSession): SceneTutorContext {
  const cart = cartSnapshot(session);
  return {
    learningGoal: CART_TUTOR_GOALS[session.stage] ?? "只帮学生把看见的现象说清楚",
    currentPhysicsState: cart,
    physicsSummary: [
      "Physics state: horizontal cart snapshot",
      `speedTick ${cart.speedTick}`,
      `direction ${cart.motionDirection}`,
      `netForce ${cart.netForce}`,
      `lastChange ${cart.lastChange}`,
      "Do not name the target force-motion rule.",
    ].join("; "),
    promptConstraint: cartTutorConstraint(session.stage),
  };
}

export function cartTutorConstraint(stage: LearningSession["stage"]): string {
  const shared =
    "用简体中文只问一个有用的问题，或给出一步小提示。不要说出“力能改变物体运动状态”。不要说出 F=ma。不要替学生下结论。";

  if (stage === LearningStage.PREDICT) {
    return `${shared}不要透露小车接下来会加快、减慢还是保持不变。不要说出实验结果。`;
  }
  if (stage === LearningStage.OBSERVE || stage === LearningStage.DESCRIBE) {
    return `${shared}先问学生看见了什么变化：开始运动、加快、减慢，还是方向变了。`;
  }
  if (stage === LearningStage.EXPLAIN) {
    return `${shared}不要一次给出完整关系板。先问力和运动是不是同一件事，或合力为零时会不会一定停下。`;
  }
  if (stage === LearningStage.MODEL) {
    return `${shared}可以指出缺了哪一格，但不要替学生摆好：当前运动、合力条件、运动状态变化。`;
  }
  if (stage === LearningStage.TRANSFER) {
    return `${shared}等学生先判断关系和条件。不要先说这和刚才是同一个力与运动的关系。不要替学生选定迁移答案。`;
  }
  if (stage === LearningStage.EXAM) {
    return `${shared}保持“先认清题目在考什么，再用哪条关系，再看选项”的顺序。不要说出正确答案。不要替学生选选项。`;
  }
  return shared;
}

function cartSnapshot(session: LearningSession): Record<string, unknown> {
  const state = session.physicsState.state;
  if (isCartState(state)) {
    return {
      scene: "horizontal-force-cart",
      speedTick: state.speedTick,
      motionDirection: state.motionDirection,
      netForce: state.netForce,
      lastChange: state.lastChange,
    };
  }
  return { scene: "horizontal-force-cart" };
}

export function cartStateSummary(state: CartState): string {
  return `speed ${state.speedTick}, direction ${state.motionDirection}, force ${state.netForce}`;
}
