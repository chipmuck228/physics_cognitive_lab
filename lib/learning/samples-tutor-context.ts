import { SAMPLES_TUTOR_GOALS } from "@/lib/content/equal-volume-material-samples";
import {
  isDensitySceneState,
  samplesPhysicsSnapshot,
  type DensitySceneState,
} from "@/lib/physics/equal-volume-material-samples";
import type { SceneTutorContext } from "@/lib/runtime/types";
import { LearningStage, type LearningSession } from "@/types/learning";

export function getSamplesTutorContext(session: LearningSession): SceneTutorContext {
  const samples = samplesSnapshot(session);
  return {
    learningGoal:
      SAMPLES_TUTOR_GOALS[session.stage] ?? "只帮学生把看见的现象说清楚",
    currentPhysicsState: samples,
    physicsSummary: [
      "Physics state: equal-volume material samples snapshot",
      `comparisonMode ${String(samples.comparisonMode ?? "observe")}`,
      `cutFactor ${String(samples.cutFactor ?? 1)}`,
      "Do not name ρ = m / V before the student constructs it.",
    ].join("; "),
    promptConstraint: samplesTutorConstraint(session.stage),
  };
}

export function samplesTutorConstraint(stage: LearningSession["stage"]): string {
  const shared =
    "用简体中文只问一个有用的问题，或给出一步小提示。不要说出“密度等于质量除以体积”。不要说出 ρ = m / V。不要替学生下结论。";

  if (stage === LearningStage.PREDICT) {
    return `${shared}不要透露哪一块密度更大，也不要说出切开后密度不变。不要说出实验结果。`;
  }
  if (stage === LearningStage.OBSERVE || stage === LearningStage.DESCRIBE) {
    return `${shared}先问学生看见了什么：大小怎样、谁更沉。`;
  }
  if (stage === LearningStage.EXPLAIN) {
    return `${shared}不要一次给出完整比值。先问密度是不是就是更重或更大。`;
  }
  if (stage === LearningStage.MODEL) {
    return `${shared}可以指出缺了质量或体积，但不要替学生把 ρ = m / V 建好。`;
  }
  if (stage === LearningStage.TRANSFER) {
    return `${shared}等学生先判断关系和条件。不要先说这和刚才是同一个密度模型。不要替学生选定迁移答案。`;
  }
  if (stage === LearningStage.EXAM) {
    return `${shared}保持“先认清题目在考什么，再用哪条关系，再看选项”的顺序。不要说出正确答案。不要替学生选选项。`;
  }
  return shared;
}

function samplesSnapshot(session: LearningSession): Record<string, unknown> {
  const state = session.physicsState.state;
  if (isDensitySceneState(state)) {
    return {
      scene: "equal-volume-material-samples",
      ...samplesPhysicsSnapshot(state),
    };
  }
  return { scene: "equal-volume-material-samples" };
}

export function samplesStateSummary(state: DensitySceneState): string {
  return `mode ${state.comparisonMode}, cut ${state.cutFactor}, revealed ${state.massesRevealed}`;
}
