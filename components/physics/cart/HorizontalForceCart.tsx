import type { CartState } from "@/lib/physics/horizontal-force-cart";
import { CART_COPY } from "@/lib/content/horizontal-force-cart";

interface HorizontalForceCartProps {
  state: CartState;
  animate?: boolean;
}

const SPEED_LABEL = {
  0: CART_COPY.speedStill,
  1: CART_COPY.speedSlow,
  2: CART_COPY.speedMedium,
  3: CART_COPY.speedFast,
} as const;

export function HorizontalForceCart({
  state,
  animate = true,
}: HorizontalForceCartProps) {
  const leftPercent = 18 + Math.max(-4, Math.min(12, state.positionTick)) * 5;
  const forceRight = state.netForce === "right";
  const forceLeft = state.netForce === "left";

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--paper)] px-4 py-8"
      role="img"
      aria-label={CART_COPY.cartAria}
      data-testid="horizontal-force-cart"
      data-speed-tick={state.speedTick}
      data-net-force={state.netForce}
      data-direction={state.motionDirection}
      data-last-change={state.lastChange}
    >
      <div className="relative mx-auto h-28 max-w-xl">
        <div className="absolute bottom-8 left-0 right-0 h-1 rounded-full bg-[var(--line)]" />
        <div
          className={`absolute bottom-10 h-12 w-20 rounded-xl border-2 border-[var(--ink)] bg-white shadow-sm ${
            animate ? "transition-[left] duration-700 ease-out" : ""
          }`}
          style={{ left: `calc(${leftPercent}% - 2.5rem)` }}
          data-testid="cart-body"
        >
          <div className="absolute -bottom-2 left-3 h-4 w-4 rounded-full border border-[var(--ink)] bg-[var(--paper)]" />
          <div className="absolute -bottom-2 right-3 h-4 w-4 rounded-full border border-[var(--ink)] bg-[var(--paper)]" />
        </div>
        {forceRight ? (
          <div
            className="absolute bottom-16 text-lg text-[var(--heat)]"
            style={{ left: `calc(${leftPercent}% + 2.2rem)` }}
            aria-label={CART_COPY.forceArrowRight}
          >
            →
          </div>
        ) : null}
        {forceLeft ? (
          <div
            className="absolute bottom-16 text-lg text-[var(--heat)]"
            style={{ left: `calc(${leftPercent}% - 3.4rem)` }}
            aria-label={CART_COPY.forceArrowLeft}
          >
            ←
          </div>
        ) : null}
      </div>
      <p className="mt-2 text-center text-sm text-[var(--ink-muted)]">
        {state.netForce === "zero" ? CART_COPY.forceArrowNone : null}
        {forceRight ? CART_COPY.forceArrowRight : null}
        {forceLeft ? CART_COPY.forceArrowLeft : null}
        {" · "}
        {SPEED_LABEL[state.speedTick]}
      </p>
    </div>
  );
}
