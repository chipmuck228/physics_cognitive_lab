import {
  ENGINE_DESCRIBE_SNAPSHOTS,
  type EngineCombustionChoice,
  type EnginePistonChoice,
  type EngineValveChoice,
} from "@/lib/content/four-stroke-engine";
import type { DescriptionEvidence } from "@/types/learning";
import type { EngineStroke } from "@/lib/physics/engine";

export interface EngineSnapshotAnswer {
  stroke: EngineStroke;
  piston: EnginePistonChoice | "";
  intake: EngineValveChoice | "";
  exhaust: EngineValveChoice | "";
  combustion: EngineCombustionChoice | "";
}

export interface EngineDescribeInput {
  snapshots: EngineSnapshotAnswer[];
  studentDescription: string;
}

export interface EngineDescribeEvaluation {
  pistonMotionCorrect: boolean;
  intakeValveStateCorrect: boolean;
  exhaustValveStateCorrect: boolean;
  combustionStateCorrect: boolean;
  distinguishesPowerEvent: boolean;
  hasMeaningfulDescription: boolean;
  sufficient: boolean;
}

const MIN_DESCRIPTION_HAN_CHARS = 2;

/**
 * DESCRIBE gate is structured-first.
 * Free text must contain some Chinese content, but it is not parsed for
 * textbook stroke names and is not sufficient by itself.
 */
export function evaluateEngineDescription(
  input: EngineDescribeInput,
): EngineDescribeEvaluation {
  const intake = answerFor(input.snapshots, "intake");
  const power = answerFor(input.snapshots, "power");
  const intakeExpected = expectedFor("intake");
  const powerExpected = expectedFor("power");

  const intakePiston = Boolean(
    intake && intakeExpected && intake.piston === intakeExpected.piston,
  );
  const powerPiston = Boolean(
    power && powerExpected && power.piston === powerExpected.piston,
  );
  const pistonMotionCorrect = intakePiston && powerPiston;

  const intakeValveStateCorrect = Boolean(
    intake && intakeExpected && intake.intake === intakeExpected.intake,
  );
  const exhaustValveStateCorrect = Boolean(
    power && powerExpected && power.exhaust === powerExpected.exhaust,
  );
  const combustionStateCorrect = Boolean(
    power && powerExpected && power.combustion === powerExpected.combustion,
  );

  const distinguishesPowerEvent = Boolean(
    intake &&
      power &&
      intakeExpected &&
      powerExpected &&
      intake.combustion === "absent" &&
      power.combustion === "present",
  );

  const hasMeaningfulDescription = hasOwnWords(input.studentDescription);

  const sufficient =
    pistonMotionCorrect &&
    (intakeValveStateCorrect || combustionStateCorrect) &&
    distinguishesPowerEvent &&
    hasMeaningfulDescription;

  return {
    pistonMotionCorrect,
    intakeValveStateCorrect,
    exhaustValveStateCorrect,
    combustionStateCorrect,
    distinguishesPowerEvent,
    hasMeaningfulDescription,
    sufficient,
  };
}

export function hasSufficientEngineDescription(
  descriptions: DescriptionEvidence[],
): boolean {
  return descriptions.some((description) => {
    if (description.sufficient === true) {
      return true;
    }
    if (!description.engineAnswers) {
      return false;
    }
    return evaluateEngineDescription({
      snapshots: description.engineAnswers,
      studentDescription: description.text,
    }).sufficient;
  });
}

export function hasOwnWords(text: string): boolean {
  const trimmed = text.trim();
  const han = trimmed.match(/[\u4e00-\u9fff]/g) ?? [];
  return han.length >= MIN_DESCRIPTION_HAN_CHARS;
}

function answerFor(
  snapshots: EngineSnapshotAnswer[],
  stroke: EngineStroke,
): EngineSnapshotAnswer | undefined {
  return snapshots.find((item) => item.stroke === stroke);
}

function expectedFor(stroke: EngineStroke) {
  return ENGINE_DESCRIBE_SNAPSHOTS.find((item) => item.stroke === stroke)?.expected;
}
