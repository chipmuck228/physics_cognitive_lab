"use client";

import { useEffect, useRef, useState } from "react";

import { interpolateTemperature } from "@/lib/physics/visual";

interface HeatingAnimationInput {
  active: boolean;
  fromTemperatureC: number;
  toTemperatureC: number;
  heatingTimeSec: number;
  durationMs: number;
  onComplete: () => void;
}

interface HeatingFrame {
  temperatureC: number;
  remainingSec: number;
}

export function useHeatingAnimation({
  active,
  fromTemperatureC,
  toTemperatureC,
  heatingTimeSec,
  durationMs,
  onComplete,
}: HeatingAnimationInput): HeatingFrame {
  const [frame, setFrame] = useState<HeatingFrame>({
    temperatureC: fromTemperatureC,
    remainingSec: heatingTimeSec,
  });
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!active || durationMs <= 0) {
      completedRef.current = false;
      return;
    }

    completedRef.current = false;
    const startedAt = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / durationMs);
      setFrame({
        temperatureC: interpolateTemperature(
          fromTemperatureC,
          toTemperatureC,
          progress,
        ),
        remainingSec: heatingTimeSec * (1 - progress),
      });

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }

      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current();
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, fromTemperatureC, toTemperatureC, heatingTimeSec, durationMs]);

  if (!active) {
    return {
      temperatureC: fromTemperatureC,
      remainingSec: heatingTimeSec,
    };
  }

  return frame;
}
