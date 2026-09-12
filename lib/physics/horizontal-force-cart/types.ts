export type TrackDirection = "left" | "right";

export type SpeedTick = 0 | 1 | 2 | 3;

export type NetForceState = "zero" | "left" | "right";

export type MotionStateChange =
  | "unchanged"
  | "started-moving"
  | "sped-up"
  | "slowed-down"
  | "reversed";

export const CART_EXPERIMENT_A = "force-with-motion" as const;
export const CART_EXPERIMENT_B = "force-against-motion" as const;
export const CART_EXPERIMENT_C = "zero-net-force-while-moving" as const;

export type CartExperimentId =
  | typeof CART_EXPERIMENT_A
  | typeof CART_EXPERIMENT_B
  | typeof CART_EXPERIMENT_C;

export const CART_EXPERIMENT_ORDER: CartExperimentId[] = [
  CART_EXPERIMENT_A,
  CART_EXPERIMENT_B,
  CART_EXPERIMENT_C,
];

export interface CartState {
  positionTick: number;
  speedTick: SpeedTick;
  motionDirection: TrackDirection | "none";
  netForce: NetForceState;
  lastChange: MotionStateChange;
  /** Explicit model boundary. Not a simulated friction value. */
  frictionOmitted: true;
}

export interface CartExperimentResult {
  experimentId: CartExperimentId;
  before: CartState;
  after: CartState;
  intervention: { netForce: NetForceState };
}

export function isSpeedTick(value: number): value is SpeedTick {
  return value === 0 || value === 1 || value === 2 || value === 3;
}

export function isCartState(value: unknown): value is CartState {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.positionTick === "number" &&
    isSpeedTick(Number(record.speedTick)) &&
    (record.motionDirection === "left" ||
      record.motionDirection === "right" ||
      record.motionDirection === "none") &&
    (record.netForce === "zero" ||
      record.netForce === "left" ||
      record.netForce === "right") &&
    typeof record.lastChange === "string" &&
    record.frictionOmitted === true
  );
}

export function createRestingCartState(): CartState {
  return {
    positionTick: 0,
    speedTick: 0,
    motionDirection: "none",
    netForce: "zero",
    lastChange: "unchanged",
    frictionOmitted: true,
  };
}

export function createMovingCartState(
  direction: TrackDirection,
  speedTick: Exclude<SpeedTick, 0>,
  netForce: NetForceState = "zero",
): CartState {
  return {
    positionTick: 4,
    speedTick,
    motionDirection: direction,
    netForce,
    lastChange: "unchanged",
    frictionOmitted: true,
  };
}

export function setCartNetForce(
  state: CartState,
  netForce: NetForceState,
): CartState {
  return { ...state, netForce };
}

/**
 * One pedagogical tick. Animation may interpolate between this
 * committed state and the previous one; it must not invent a new result.
 */
export function stepCart(state: CartState): CartState {
  const motion = nextMotion(state);
  const travel =
    motion.speedTick === 0
      ? 0
      : motion.motionDirection === "right"
        ? 1
        : motion.motionDirection === "left"
          ? -1
          : 0;

  return {
    ...state,
    ...motion,
    positionTick: state.positionTick + travel,
    frictionOmitted: true,
  };
}

export function applyForceAndStep(
  state: CartState,
  netForce: NetForceState,
): CartState {
  return stepCart(setCartNetForce(state, netForce));
}

function nextMotion(
  state: CartState,
): Pick<CartState, "speedTick" | "motionDirection" | "lastChange"> {
  const { netForce, speedTick, motionDirection } = state;

  if (netForce === "zero") {
    return {
      speedTick,
      motionDirection,
      lastChange: "unchanged",
    };
  }

  if (speedTick === 0 || motionDirection === "none") {
    return {
      speedTick: 1,
      motionDirection: netForce,
      lastChange: "started-moving",
    };
  }

  if (netForce === motionDirection) {
    if (speedTick >= 3) {
      return {
        speedTick: 3,
        motionDirection,
        lastChange: "unchanged",
      };
    }
    return {
      speedTick: (speedTick + 1) as SpeedTick,
      motionDirection,
      lastChange: "sped-up",
    };
  }

  const nextSpeed = speedTick - 1;
  if (nextSpeed > 0) {
    return {
      speedTick: nextSpeed as SpeedTick,
      motionDirection,
      lastChange: "slowed-down",
    };
  }

  return {
    speedTick: 0,
    motionDirection: "none",
    lastChange: "slowed-down",
  };
}

export function runObserveDemo(): CartState[] {
  const rest = createRestingCartState();
  const started = applyForceAndStep(rest, "right");
  const spedUp = stepCart(started);
  return [rest, started, spedUp];
}

export function prepareExperimentCart(experimentId: CartExperimentId): CartState {
  if (experimentId === CART_EXPERIMENT_A) {
    return createMovingCartState("right", 2, "zero");
  }
  return createMovingCartState("right", 2, "zero");
}

export function experimentNetForce(experimentId: CartExperimentId): NetForceState {
  if (experimentId === CART_EXPERIMENT_A) {
    return "right";
  }
  if (experimentId === CART_EXPERIMENT_B) {
    return "left";
  }
  return "zero";
}

export function runCartExperiment(
  experimentId: CartExperimentId,
): CartExperimentResult {
  const before = prepareExperimentCart(experimentId);
  const netForce = experimentNetForce(experimentId);
  const after = applyForceAndStep(before, netForce);
  return {
    experimentId,
    before,
    after,
    intervention: { netForce },
  };
}

export function expectedMotionStateChange(
  experimentId: CartExperimentId,
): MotionStateChange {
  if (experimentId === CART_EXPERIMENT_A) {
    return "sped-up";
  }
  if (experimentId === CART_EXPERIMENT_B) {
    return "slowed-down";
  }
  return "unchanged";
}

export function cartPhysicsSnapshot(state: CartState): Record<string, unknown> {
  return {
    positionTick: state.positionTick,
    speedTick: state.speedTick,
    motionDirection: state.motionDirection,
    netForce: state.netForce,
    lastChange: state.lastChange,
    frictionOmitted: state.frictionOmitted,
  };
}
