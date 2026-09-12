import { looksLikeMicrowaveExamAnswerLeak } from "@/lib/learning/microwave-exam";
import { looksLikeEngineExamAnswerLeak } from "@/lib/learning/engine-exam";
import { looksLikeCartExamAnswerLeak } from "@/lib/learning/cart-exam";
import { looksLikeHeatExamAnswerLeak } from "@/lib/learning/heat-exam";
import { looksLikeSamplesExamAnswerLeak } from "@/lib/learning/samples-exam";
import { LearningStage, type LearningStage as LearningStageType } from "@/types/learning";

export function looksLikeMicrowaveTutorLeak(
  stage: LearningStageType,
  message: string,
): boolean {
  const normalized = message.toLowerCase();

  if (stage === LearningStage.PREDICT) {
    return /the temperature will (increase|decrease)|correct prediction|the result will be|温度会升高|正确答案是|结果会是/.test(
      normalized,
    );
  }

  if (stage === LearningStage.MODEL) {
    return /put (the )?internal energy|place internal energy|the middle (card|box) is|belongs between these two: internal|中间应该选内能|把内能放在中间|温度不是内能|能量进入温度不一定升高/.test(
      normalized,
    );
  }

  if (stage === LearningStage.EXAM) {
    return looksLikeMicrowaveExamAnswerLeak(message);
  }

  if (stage === LearningStage.TRANSFER) {
    return /this is the same as the microwave|use the bread model|the shared model is|这就是知识迁移|和微波炉是同一个模型|也是加热所以一样/.test(
      normalized,
    );
  }

  if (stage === LearningStage.OBSERVE || stage === LearningStage.DESCRIBE) {
    return /the temperature increased because energy entered|温度升高是因为能量进入了/.test(
      normalized,
    );
  }

  return false;
}

export function looksLikeEngineTutorLeak(
  stage: LearningStageType,
  message: string,
): boolean {
  const normalized = message.toLowerCase();
  const microwaveLeak = looksLikeMicrowaveTutorLeak(stage, message);

  if (stage === LearningStage.PREDICT) {
    return (
      microwaveLeak ||
      /化学能/.test(message) ||
      /内能/.test(message) ||
      /机械能/.test(message) ||
      /没有燃烧.{0,24}(主要动力|机械能|内能)/.test(message) ||
      /关掉燃烧.{0,24}(不会有|没有)(主要动力|机械能)/.test(message) ||
      /(卡住|不能运动).{0,24}燃烧也(不会|没)/.test(message)
    );
  }

  if (stage === LearningStage.MODEL) {
    return (
      microwaveLeak ||
      looksLikeEngineChainLeak(message) ||
      /把燃烧放进格子|燃烧就是能量|燃烧直接推动曲轴/.test(message)
    );
  }

  if (stage === LearningStage.EXPLAIN) {
    return looksLikeEngineChainLeak(message);
  }

  if (stage === LearningStage.EXAM) {
    return (
      microwaveLeak ||
      looksLikeEngineChainLeak(message) ||
      looksLikeEngineExamAnswerLeak(message)
    );
  }

  if (stage === LearningStage.TRANSFER) {
    return (
      microwaveLeak ||
      /chemical-energy-internal-energy-mechanical-energy/.test(normalized) ||
      /这个情境也使用/.test(message) ||
      /这和刚才是同一条能量链/.test(message) ||
      /只有后半段可以迁移/.test(message) ||
      /后半段可以迁移/.test(message)
    );
  }

  if (stage === LearningStage.OBSERVE || stage === LearningStage.DESCRIBE) {
    return (
      microwaveLeak ||
      /化学能/.test(message) ||
      /内能/.test(message) ||
      /机械能/.test(message) ||
      /这是做功冲程|这是吸气冲程|这是压缩冲程|这是排气冲程/.test(message)
    );
  }

  return false;
}

function looksLikeEngineChainLeak(message: string): boolean {
  return (
    /化学能\s*→\s*内能/.test(message) ||
    /化学能.{0,12}内能.{0,12}做功.{0,12}机械能/.test(message) ||
    /燃料的化学能转化.?工作气体的内能.{0,12}对机械系统做功.{0,12}机械能/.test(message)
  );
}

export function looksLikeCartTutorLeak(
  stage: LearningStageType,
  message: string,
): boolean {
  const microwaveLeak = looksLikeMicrowaveTutorLeak(stage, message);

  if (stage === LearningStage.PREDICT) {
    return (
      microwaveLeak ||
      /力能改变物体运动状态/.test(message) ||
      /合力不为零会改变运动状态/.test(message) ||
      /会越来越快.{0,8}因为/.test(message) ||
      /速度档一定/.test(message) ||
      /合力为零.{0,12}(停|不变)/.test(message)
    );
  }

  if (stage === LearningStage.OBSERVE || stage === LearningStage.DESCRIBE) {
    return (
      microwaveLeak ||
      /力能改变物体运动状态/.test(message) ||
      /合力不为零会改变运动状态/.test(message)
    );
  }

  if (stage === LearningStage.EXPLAIN) {
    return (
      microwaveLeak ||
      /力能改变物体运动状态/.test(message) ||
      /当前运动状态\s*\+\s*合力/.test(message) ||
      (/有力就一定运动/.test(message) && /所以正确答案/.test(message))
    );
  }

  if (stage === LearningStage.MODEL) {
    return (
      microwaveLeak ||
      /当前运动状态\s*\+\s*合力.{0,12}运动状态变化/.test(message) ||
      /第一格填正在向右.{0,12}第二格填合力/.test(message) ||
      /把关系板替你摆好/.test(message)
    );
  }

  if (stage === LearningStage.TRANSFER) {
    return (
      microwaveLeak ||
      /这和刚才是同一个力.{0,8}运动/.test(message) ||
      /这就是知识迁移/.test(message) ||
      /应该选还能用/.test(message)
    );
  }

  if (stage === LearningStage.EXAM) {
    return microwaveLeak || looksLikeCartExamAnswerLeak(message);
  }

  return microwaveLeak || /力能改变物体运动状态/.test(message);
}

export function looksLikeSamplesTutorLeak(
  stage: LearningStageType,
  message: string,
): boolean {
  const microwaveLeak = looksLikeMicrowaveTutorLeak(stage, message);

  if (stage === LearningStage.PREDICT) {
    return (
      microwaveLeak ||
      /密度等于质量除以体积/.test(message) ||
      /ρ\s*=\s*m\s*\/\s*V/.test(message) ||
      /更沉的.{0,8}密度一定更大/.test(message) ||
      /切开后密度不变/.test(message)
    );
  }

  if (stage === LearningStage.OBSERVE || stage === LearningStage.DESCRIBE) {
    return (
      microwaveLeak ||
      /密度等于质量除以体积/.test(message) ||
      /ρ\s*=\s*m\s*\/\s*V/.test(message)
    );
  }

  if (stage === LearningStage.EXPLAIN) {
    return (
      microwaveLeak ||
      /密度等于质量除以体积/.test(message) ||
      /完整比值是/.test(message)
    );
  }

  if (stage === LearningStage.MODEL) {
    return (
      microwaveLeak ||
      /上面填质量.{0,12}下面填体积/.test(message) ||
      /把比值表替你摆好/.test(message) ||
      /第一格填质量.{0,12}第二格填体积/.test(message)
    );
  }

  if (stage === LearningStage.TRANSFER) {
    return (
      microwaveLeak ||
      /这和刚才是同一个密度/.test(message) ||
      /这就是知识迁移/.test(message) ||
      /应该选还能用/.test(message)
    );
  }

  if (stage === LearningStage.EXAM) {
    return microwaveLeak || looksLikeSamplesExamAnswerLeak(message);
  }

  return microwaveLeak || /密度等于质量除以体积/.test(message);
}

export function looksLikeHeatTutorLeak(
  stage: LearningStageType,
  message: string,
): boolean {
  const microwaveLeak = looksLikeMicrowaveTutorLeak(stage, message);

  if (stage === LearningStage.PREDICT) {
    return (
      microwaveLeak ||
      /热量等于比热容乘质量乘温度变化/.test(message) ||
      /Q\s*=\s*c\s*m\s*ΔT/.test(message) ||
      /沙子升得更快/.test(message) ||
      /水升得更慢/.test(message)
    );
  }

  if (stage === LearningStage.OBSERVE || stage === LearningStage.DESCRIBE) {
    return (
      microwaveLeak ||
      /热量等于比热容乘质量乘温度变化/.test(message) ||
      /Q\s*=\s*c\s*m\s*ΔT/.test(message)
    );
  }

  if (stage === LearningStage.EXPLAIN) {
    return (
      microwaveLeak ||
      /热量等于比热容乘质量乘温度变化/.test(message) ||
      /完整关系是/.test(message)
    );
  }

  if (stage === LearningStage.MODEL) {
    return (
      microwaveLeak ||
      /把乘积板替你摆好/.test(message) ||
      /第一格填比热容.{0,12}第二格填质量/.test(message)
    );
  }

  if (stage === LearningStage.TRANSFER) {
    return (
      microwaveLeak ||
      /这和刚才是同一个比热容/.test(message) ||
      /这就是知识迁移/.test(message) ||
      /应该选还能用/.test(message)
    );
  }

  if (stage === LearningStage.EXAM) {
    return microwaveLeak || looksLikeHeatExamAnswerLeak(message);
  }

  return microwaveLeak || /热量等于比热容乘质量乘温度变化/.test(message);
}

export function looksLikeOhmsTutorLeak(
  stage: LearningStageType,
  message: string,
): boolean {
  const normalized = message.toLowerCase();

  if (stage === LearningStage.PREDICT) {
    return /电流会变成|电流是 0\.6|正确答案是|结果会是 1\.2/.test(message);
  }
  if (stage === LearningStage.OBSERVE || stage === LearningStage.DESCRIBE) {
    return /电流等于电压除以电阻|i\s*=\s*u\s*\/\s*r/.test(normalized);
  }
  if (stage === LearningStage.MODEL) {
    return /替你把关系建好|第一格填电流.{0,12}第二格填电压/.test(message);
  }
  if (stage === LearningStage.TRANSFER) {
    return /这和刚才是同一个欧姆|也是电路所以一样/.test(message);
  }
  if (stage === LearningStage.EXAM) {
    return /正确答案是|选3 a/.test(normalized);
  }
  return /电流等于电压除以电阻/.test(message);
}

export function looksLikeLensTutorLeak(
  stage: LearningStageType,
  message: string,
): boolean {
  if (stage === LearningStage.PREDICT) {
    return /倒立缩小实像|这次会成|正确答案是|1\/f\s*=\s*1\/u/.test(message);
  }
  if (stage === LearningStage.OBSERVE || stage === LearningStage.DESCRIBE) {
    return /五种情况|倒立缩小实像|1\/f\s*=\s*1\/u/.test(message);
  }
  if (stage === LearningStage.MODEL) {
    return /替你把光路建好|完整光路已经画好|第一光线平行/.test(message);
  }
  if (stage === LearningStage.TRANSFER) {
    return /这和刚才是同一种凸透镜成像|都有凸透镜所以一样/.test(message);
  }
  if (stage === LearningStage.EXAM) {
    return /正确答案是|选倒立缩小实像/.test(message);
  }
  return /五种成像情况|1\/f\s*=\s*1\/u\s*\+\s*1\/v/.test(message);
}
