"use client";

import Link from "next/link";

import { EngineControls } from "@/components/physics/engine/EngineControls";
import { EngineStateDebug } from "@/components/physics/engine/EngineStateDebug";
import { FourStrokeEngine } from "@/components/physics/engine/FourStrokeEngine";
import { useEngineDemoPlayback } from "@/hooks/useEngineDemoPlayback";
import { ENGINE_DEMO_COPY } from "@/lib/content/engine-visual";
import { STUDENT_CHROME } from "@/lib/content/student-language";

export function EngineDemo() {
  const playback = useEngineDemoPlayback();

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--ink)]">
      <header className="flex items-center justify-between px-6 py-5">
        <p className="text-sm font-medium tracking-wide text-[var(--ink-muted)]">
          {STUDENT_CHROME.productName}
        </p>
        <Link
          href="/"
          aria-label={STUDENT_CHROME.homeAria}
          className="text-sm text-[var(--ink-muted)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
        >
          {STUDENT_CHROME.home}
        </Link>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 pb-16">
        <p className="rounded-full bg-[var(--paper)] px-4 py-2 text-sm text-[var(--ink-muted)]">
          {ENGINE_DEMO_COPY.banner}
        </p>
        <h1 className="mt-6 font-serif text-3xl">{ENGINE_DEMO_COPY.title}</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-start">
          <div className="flex justify-center rounded-[2rem] bg-[var(--scene)] p-4 sm:p-6">
            <FourStrokeEngine
              state={playback.state}
              motionProgress={playback.motionProgress}
            />
          </div>

          <div className="space-y-5">
            <EngineControls
              playing={playback.playing}
              currentStroke={playback.state.stroke}
              combustionEnabled={playback.config.combustionEnabled}
              pistonCanMove={playback.config.pistonCanMove}
              onPlay={playback.play}
              onPause={playback.pause}
              onNext={playback.next}
              onReset={playback.reset}
              onSelectStroke={playback.selectStroke}
              onCombustionEnabledChange={playback.setCombustionEnabled}
              onPistonCanMoveChange={playback.setPistonCanMove}
            />
            <EngineStateDebug state={playback.state} />
          </div>
        </div>
      </main>
    </div>
  );
}
