import { formatTemperature } from "@/lib/physics/visual";

interface TemperatureDisplayProps {
  temperatureC: number;
  label?: string;
}

export function TemperatureDisplay({
  temperatureC,
  label = "Bread temperature",
}: TemperatureDisplayProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-center">
      <p className="text-[11px] uppercase tracking-[0.16em] text-white/55">{label}</p>
      <p
        className="mt-1 font-mono text-2xl tabular-nums text-[var(--heat-soft)]"
        aria-live="polite"
      >
        {formatTemperature(temperatureC)}
      </p>
    </div>
  );
}
