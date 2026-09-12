"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  DEFAULT_ENGINE_CONFIG,
  ENGINE_STROKE_ORDER,
  advanceStroke,
  createInitialEngineState,
  type EngineState,
  type EngineStroke,
} from "@/lib/physics/engine";
import { engineStrokeDurationMs } from "@/lib/physics/engine-visual";
import { prefersReducedMotion } from "@/lib/physics/visual";

interface EngineScenePlayback {
  state: EngineState;
  playing: boolean;
  motionProgress: number;
  watchedFullCycle: boolean;
  play: () => void;
  pause: () => void;
  next: () => void;
  replay: () => void;
}

export function useEngineScenePlayback(
  scriptedCycle: EngineState[] | null = null,
): EngineScenePlayback {
  const [state, setState] = useState<EngineState>(() =>
    createInitialEngineState(DEFAULT_ENGINE_CONFIG),
  );
  const [playing, setPlaying] = useState(false);
  const [motionProgress, setMotionProgress] = useState(1);
  const [watchedFullCycle, setWatchedFullCycle] = useState(false);
  const skipMotionRef = useRef(true);
  const seenStrokesRef = useRef(new Set<EngineStroke>());

  const noteStroke = useCallback((stroke: EngineStroke) => {
    seenStrokesRef.current.add(stroke);
    if (ENGINE_STROKE_ORDER.every((item) => seenStrokesRef.current.has(item))) {
      setWatchedFullCycle(true);
    }
  }, []);

  const scriptRef = useRef(scriptedCycle);
  scriptRef.current = scriptedCycle;

  const nextEngineState = useCallback((current: EngineState): EngineState => {
    const script = scriptRef.current;
    if (script && script.length > 0) {
      const index = script.findIndex((item) => item.stroke === current.stroke);
      const safeIndex = index >= 0 ? index : 0;
      return script[(safeIndex + 1) % script.length];
    }
    return advanceStroke(current, DEFAULT_ENGINE_CONFIG);
  }, []);

  const showSnapshot = useCallback((next: EngineState) => {
    skipMotionRef.current = true;
    setState(next);
    setMotionProgress(1);
    noteStroke(next.stroke);
  }, [noteStroke]);

  const animateTo = useCallback((next: EngineState) => {
    skipMotionRef.current = false;
    setState(next);
    setMotionProgress(0);
    noteStroke(next.stroke);
  }, [noteStroke]);

  useEffect(() => {
    setPlaying(false);
    if (scriptedCycle && scriptedCycle.length > 0) {
      showSnapshot(scriptedCycle[0]);
      return;
    }
    showSnapshot(createInitialEngineState(DEFAULT_ENGINE_CONFIG));
  }, [scriptedCycle, showSnapshot]);

  useEffect(() => {
    if (skipMotionRef.current) {
      setMotionProgress(1);
      return;
    }

    const reduceMotion = prefersReducedMotion();
    const duration = engineStrokeDurationMs(reduceMotion, state.pistonCanMove);
    if (duration <= 0) {
      setMotionProgress(1);
      return;
    }

    const startedAt = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      setMotionProgress(progress);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  useEffect(() => {
    if (!playing || motionProgress < 1) {
      return;
    }
    const reduceMotion = prefersReducedMotion();
    const timer = window.setTimeout(
      () => {
        animateTo(nextEngineState(state));
      },
      reduceMotion ? 400 : 180,
    );
    return () => window.clearTimeout(timer);
  }, [animateTo, motionProgress, nextEngineState, playing, state]);

  const play = useCallback(() => {
    setPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setPlaying(false);
  }, []);

  const next = useCallback(() => {
    setPlaying(false);
    animateTo(nextEngineState(state));
  }, [animateTo, nextEngineState, state]);

  const replay = useCallback(() => {
    setPlaying(false);
    const script = scriptRef.current;
    if (script && script.length > 0) {
      showSnapshot(script[0]);
      return;
    }
    showSnapshot(createInitialEngineState(DEFAULT_ENGINE_CONFIG));
  }, [showSnapshot]);

  return {
    state,
    playing,
    motionProgress,
    watchedFullCycle,
    play,
    pause,
    next,
    replay,
  };
}
