"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  DEFAULT_ENGINE_CONFIG,
  advanceStroke,
  createInitialEngineState,
  getStrokeState,
  type EngineExperimentConfig,
  type EngineState,
  type EngineStroke,
} from "@/lib/physics/engine";
import { engineStrokeDurationMs } from "@/lib/physics/engine-visual";
import { prefersReducedMotion } from "@/lib/physics/visual";

interface EngineDemoPlayback {
  state: EngineState;
  config: EngineExperimentConfig;
  playing: boolean;
  motionProgress: number;
  play: () => void;
  pause: () => void;
  next: () => void;
  reset: () => void;
  selectStroke: (stroke: EngineStroke) => void;
  setCombustionEnabled: (enabled: boolean) => void;
  setPistonCanMove: (canMove: boolean) => void;
}

export function useEngineDemoPlayback(): EngineDemoPlayback {
  const [config, setConfig] = useState<EngineExperimentConfig>(
    DEFAULT_ENGINE_CONFIG,
  );
  const [state, setState] = useState<EngineState>(() =>
    createInitialEngineState(DEFAULT_ENGINE_CONFIG),
  );
  const [playing, setPlaying] = useState(false);
  const [motionProgress, setMotionProgress] = useState(1);
  const configRef = useRef(config);
  const skipMotionRef = useRef(true);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const showSnapshot = useCallback((next: EngineState) => {
    skipMotionRef.current = true;
    setState(next);
    setMotionProgress(1);
  }, []);

  const animateTo = useCallback((next: EngineState) => {
    skipMotionRef.current = false;
    setState(next);
    setMotionProgress(0);
  }, []);

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
        animateTo(advanceStroke(state, configRef.current));
      },
      reduceMotion ? 400 : 180,
    );
    return () => window.clearTimeout(timer);
  }, [animateTo, motionProgress, playing, state]);

  const play = useCallback(() => {
    setPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setPlaying(false);
  }, []);

  const next = useCallback(() => {
    setPlaying(false);
    animateTo(advanceStroke(state, configRef.current));
  }, [animateTo, state]);

  const reset = useCallback(() => {
    setPlaying(false);
    showSnapshot(createInitialEngineState(configRef.current));
  }, [showSnapshot]);

  const selectStroke = useCallback(
    (stroke: EngineStroke) => {
      setPlaying(false);
      showSnapshot(getStrokeState(stroke, configRef.current));
    },
    [showSnapshot],
  );

  const setCombustionEnabled = useCallback(
    (enabled: boolean) => {
      const nextConfig = { ...configRef.current, combustionEnabled: enabled };
      setConfig(nextConfig);
      showSnapshot(getStrokeState(state.stroke, nextConfig));
    },
    [showSnapshot, state.stroke],
  );

  const setPistonCanMove = useCallback(
    (canMove: boolean) => {
      const nextConfig = { ...configRef.current, pistonCanMove: canMove };
      setConfig(nextConfig);
      showSnapshot(getStrokeState(state.stroke, nextConfig));
    },
    [showSnapshot, state.stroke],
  );

  return {
    state,
    config,
    playing,
    motionProgress,
    play,
    pause,
    next,
    reset,
    selectStroke,
    setCombustionEnabled,
    setPistonCanMove,
  };
}
