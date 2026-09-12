import { ENGINE_TUTOR_GOALS } from "@/lib/content/four-stroke-engine";
import { createInitialEngineState } from "@/lib/physics/engine";
import type { SceneTutorContext } from "@/lib/runtime/types";
import { LearningStage, type LearningSession } from "@/types/learning";

export function getEngineTutorContext(session: LearningSession): SceneTutorContext {
  const engine = createInitialEngineState();
  const currentPhysicsState = {
    scene: "four-stroke-engine",
    stroke: engine.stroke,
    pistonDirection: engine.pistonDirection,
    intakeValveOpen: engine.intakeValveOpen,
    exhaustValveOpen: engine.exhaustValveOpen,
    combustionEventActive: engine.combustionEventActive,
  };

  return {
    learningGoal:
      ENGINE_TUTOR_GOALS[session.stage] ?? "只帮学生把看见的现象说清楚",
    currentPhysicsState,
    physicsSummary: [
      "Physics state: four-stroke engine observable snapshot",
      `piston ${engine.pistonDirection}`,
      `intake valve ${engine.intakeValveOpen ? "open" : "closed"}`,
      `exhaust valve ${engine.exhaustValveOpen ? "open" : "closed"}`,
      `combustion ${engine.combustionEventActive ? "visible" : "not visible"}`,
      "Do not treat stroke names as the student goal.",
    ].join("; "),
    promptConstraint: engineTutorConstraint(session.stage),
  };
}

export function engineTutorConstraint(stage: LearningSession["stage"]): string {
  const shared =
    "用简体中文只问一个有用的问题，或给出一步小提示。不要要求学生使用吸气/压缩/做功/排气这些名称。不要说出目标答案。不要一次给出化学能→内能→做功→机械能。";

  if (stage === LearningStage.PREDICT) {
    return `${shared}不要透露关掉燃烧或活塞不能运动之后会发生什么。不要说出化学能、内能或机械能。`;
  }
  if (stage === LearningStage.EXPLAIN) {
    return `${shared}先问两次实验里哪一步被卡住。可以指出缺了哪一环，但不要写出完整因果链。`;
  }
  if (stage === LearningStage.MODEL) {
    return `${shared}可以指出缺了哪一环，例如中间少了工作气体。不能替学生把整条链建好。不要把燃烧说成一种被储存的能量。`;
  }
  if (stage === LearningStage.TRANSFER) {
    return `${shared}学生还没尝试前，不要说出这和刚才是同一条能量链，不要说出模型编号，也不要直接说只有后半段可以迁移。提示要指向关系：什么变了、什么被推动。`;
  }
  if (stage === LearningStage.EXAM) {
    return "用简体中文只问一个有用的问题，或给出一步小提示。学生还没提交答案前，不要说出正确选项，不要写出完整解答链。先帮学生想题目在考什么、该用哪条关系。不要跳过这两步直接给选项。这一步可以使用化学能、内能、机械能这些词，但不要替学生选定答案。";
  }
  return `${shared}不要说出化学能、内能或机械能。`;
}
