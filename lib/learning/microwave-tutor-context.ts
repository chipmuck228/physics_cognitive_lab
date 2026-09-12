import { getMicrowavePhysicsState } from "@/lib/runtime/physics-state";
import type { SceneTutorContext } from "@/lib/runtime/types";
import { LearningStage, type LearningSession } from "@/types/learning";

const MICROWAVE_TUTOR_GOALS: Partial<Record<LearningSession["stage"], string>> = {
  [LearningStage.OBSERVE]: "帮学生先看清发生了什么变化",
  [LearningStage.DESCRIBE]: "帮学生从日常说法慢慢说到物理量",
  [LearningStage.PREDICT]: "让学生先猜并说出理由，不要透露结果",
  [LearningStage.EXPLAIN]: "帮助学生改进自己的因果解释",
  [LearningStage.MODEL]: "帮助学生自己决定中间该放什么",
  [LearningStage.TRANSFER]: "帮助学生发现新情况和刚才有什么一样",
  [LearningStage.EXAM]: "帮助学生先想清楚题目在问什么，不要透露答案",
};

export const MICROWAVE_TUTOR_PROMPT_CONSTRAINT =
  "用简体中文只问一个有用的问题，或给出一步小提示。不要说出目标答案。不要使用教育学术语。";

export function getMicrowaveTutorContext(
  session: LearningSession,
): SceneTutorContext {
  const physics = getMicrowavePhysicsState(session);
  return {
    learningGoal:
      MICROWAVE_TUTOR_GOALS[session.stage] ??
      "只帮学生完成当前这一步的下一步思考",
    currentPhysicsState: {
      initialTemperatureC: physics.initialTemperatureC,
      currentTemperatureC: physics.currentTemperatureC,
      powerW: physics.powerW,
      heatingTimeSec: physics.heatingTimeSec,
    },
    physicsSummary: `Physics state: initial ${physics.initialTemperatureC} C, current ${physics.currentTemperatureC} C, power ${physics.powerW} W, time ${physics.heatingTimeSec} s`,
    promptConstraint: MICROWAVE_TUTOR_PROMPT_CONSTRAINT,
  };
}
