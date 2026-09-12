import { HEAT_TUTOR_GOALS } from "@/lib/content/equal-mass-heated-samples";
import {
  heatPhysicsSnapshot,
  isHeatSamplesSceneState,
  type HeatSamplesSceneState,
} from "@/lib/physics/equal-mass-heated-samples";
import type { SceneTutorContext } from "@/lib/runtime/types";
import { LearningStage, type LearningSession } from "@/types/learning";

export function getHeatTutorContext(session: LearningSession): SceneTutorContext {
  const snapshot = heatSnapshot(session);
  return {
    learningGoal: HEAT_TUTOR_GOALS[session.stage] ?? "只帮学生把看见的现象说清楚",
    currentPhysicsState: snapshot,
    physicsSummary: [
      "Physics state: equal-mass heated samples snapshot",
      `comparisonMode ${String(snapshot.comparisonMode ?? "observe")}`,
      `heatingEnergy ${String(snapshot.heatingEnergy ?? "Q-same")}`,
      "Do not name Q = c m ΔT before the student constructs it.",
    ].join("; "),
    promptConstraint: heatTutorConstraint(session.stage),
  };
}

export function heatTutorConstraint(stage: LearningSession["stage"]): string {
  const shared =
    "用简体中文只问一个有用的问题，或给出一步小提示。不要说出“热量等于比热容乘质量乘温度变化”。不要说出 Q = c m ΔT。不要替学生下结论。";

  if (stage === LearningStage.PREDICT) {
    return `${shared}不要透露谁升得更快，也不要说出实验结果。`;
  }
  if (stage === LearningStage.OBSERVE || stage === LearningStage.DESCRIBE) {
    return `${shared}先问学生看见了什么：是不是一样多、谁升得更快。`;
  }
  if (stage === LearningStage.EXPLAIN) {
    return `${shared}不要一次给出完整关系。先问温度是不是就是吸收的能量。`;
  }
  if (stage === LearningStage.MODEL) {
    return `${shared}可以指出缺了质量、能量或温度变化，但不要替学生把 Q = c m ΔT 建好。`;
  }
  if (stage === LearningStage.TRANSFER) {
    return `${shared}等学生先判断关系和条件。不要先说这和刚才是同一个比热容模型。不要替学生选定迁移答案。`;
  }
  if (stage === LearningStage.EXAM) {
    return `${shared}保持“先认清题目在考什么，再用哪条关系，再看选项”的顺序。不要说出正确答案。不要替学生选选项。`;
  }
  return shared;
}

function heatSnapshot(session: LearningSession): Record<string, unknown> {
  const state = session.physicsState.state;
  if (isHeatSamplesSceneState(state)) {
    return {
      scene: "equal-mass-heated-samples",
      ...heatPhysicsSnapshot(state),
    };
  }
  return { scene: "equal-mass-heated-samples" };
}

export function heatStateSummary(state: HeatSamplesSceneState): string {
  return `mode ${state.comparisonMode}, heating ${state.heatingEnergy}, revealed ${state.temperaturesRevealed}`;
}
