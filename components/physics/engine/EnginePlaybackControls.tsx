import { Button } from "@/components/common/Button";
import { ENGINE_COPY } from "@/lib/content/four-stroke-engine";

interface EnginePlaybackControlsProps {
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onReplay: () => void;
}

export function EnginePlaybackControls({
  playing,
  onPlay,
  onPause,
  onNext,
  onReplay,
}: EnginePlaybackControlsProps) {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      <Button
        variant="secondary"
        onClick={playing ? onPause : onPlay}
        aria-label={playing ? ENGINE_COPY.pause : ENGINE_COPY.play}
      >
        {playing ? ENGINE_COPY.pause : ENGINE_COPY.play}
      </Button>
      <Button variant="secondary" onClick={onNext} aria-label={ENGINE_COPY.next}>
        {ENGINE_COPY.next}
      </Button>
      <Button variant="secondary" onClick={onReplay} aria-label={ENGINE_COPY.replay}>
        {ENGINE_COPY.replay}
      </Button>
    </div>
  );
}
