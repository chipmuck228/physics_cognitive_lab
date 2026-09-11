import { Bread } from "@/components/physics/Bread";
import { TemperatureDisplay } from "@/components/physics/TemperatureDisplay";
import { formatClock } from "@/lib/physics/visual";

interface MicrowaveSceneProps {
  temperatureC: number;
  isHeating: boolean;
  remainingTimeSec: number;
  powerW: number;
}

export function MicrowaveScene({
  temperatureC,
  isHeating,
  remainingTimeSec,
  powerW,
}: MicrowaveSceneProps) {
  return (
    <section
      className="w-full max-w-xl"
      aria-label="Microwave oven with a slice of bread"
    >
      <div className="relative overflow-hidden rounded-[2rem] bg-[var(--scene)] px-5 py-8 shadow-[0_24px_80px_rgba(28,22,16,0.28)] sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,196,140,0.08),transparent_55%)]" />

        <div className="relative mx-auto w-full max-w-md">
          <div className="rounded-[1.6rem] border border-[#cfc6b8] bg-[linear-gradient(180deg,#efe8dc_0%,#d8d0c3_100%)] p-3 shadow-inner">
            <div className="grid grid-cols-[1fr_4.6rem] gap-3">
              <div
                className={`relative overflow-hidden rounded-[1.15rem] border border-[#2a241c] bg-[#14110e] ${
                  isHeating ? "cavity-heating" : ""
                }`}
              >
                <div
                  className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(232,140,64,0.55),transparent_62%)] ${
                    isHeating
                      ? "animate-[cavity-glow_1.8s_ease-in-out_infinite]"
                      : temperatureC > 24
                        ? "opacity-40"
                        : "opacity-20"
                  }`}
                />
                <div className="relative flex min-h-48 flex-col items-center justify-end px-4 pb-6 pt-8 sm:min-h-56">
                  <div
                    className={`flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 ${
                      isHeating ? "animate-[turntable_8s_linear_infinite]" : ""
                    }`}
                  >
                    <Bread temperatureC={temperatureC} isHeating={isHeating} />
                  </div>
                  <div className="mt-3 h-1.5 w-28 rounded-full bg-white/15" />
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-2xl bg-[#2b2722] p-2">
                <div
                  className="rounded-lg bg-[#0f1c14] px-1.5 py-2 text-center font-mono text-[11px] leading-tight text-[#8fefb0]"
                  aria-live="polite"
                >
                  <div>{formatClock(remainingTimeSec)}</div>
                  <div className="mt-1 text-[10px] text-[#8fefb0]/70">{powerW}W</div>
                </div>
                <div className="mx-auto h-16 w-1.5 rounded-full bg-[#c4b8a6]" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div className="mx-auto mt-5 max-w-[12rem]">
            <TemperatureDisplay temperatureC={temperatureC} />
          </div>
        </div>
      </div>
    </section>
  );
}
