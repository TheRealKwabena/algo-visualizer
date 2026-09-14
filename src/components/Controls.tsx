import "./Controls.css";

type ControlsProps = {
  isPlaying: boolean;
  isDone: boolean;
  stepIndex: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
};

// Speed is stored/passed around as "ms delay between steps" (lower = faster),
// but that's an unintuitive thing to put directly on a slider labeled
// "speed" — dragging right would make it slower. We invert it just for
// the slider's own display: slider position increases with perceived speed.
const MIN_DELAY_MS = 50;
const MAX_DELAY_MS = 1000;

function delayToSliderValue(delayMs: number): number {
  return MIN_DELAY_MS + MAX_DELAY_MS - delayMs;
}

function sliderValueToDelay(sliderValue: number): number {
  return MIN_DELAY_MS + MAX_DELAY_MS - sliderValue;
}

export function Controls({
  isPlaying,
  isDone,
  stepIndex,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onReset,
  onSpeedChange,
}: ControlsProps) {
  return (
    <div className="controls">
      <div className="controls__buttons">
        <button type="button" onClick={onStepBack} disabled={stepIndex === 0}>
          Back
        </button>
        {isPlaying ? (
          <button type="button" onClick={onPause}>
            Pause
          </button>
        ) : (
          <button type="button" onClick={onPlay} disabled={isDone}>
            Play
          </button>
        )}
        <button type="button" onClick={onStepForward} disabled={isDone}>
          Step
        </button>
        <button type="button" onClick={onReset}>
          Reset
        </button>
      </div>

      <label className="controls__speed">
        Speed
        <input
          type="range"
          min={MIN_DELAY_MS}
          max={MAX_DELAY_MS}
          value={delayToSliderValue(speed)}
          onChange={(event) =>
            onSpeedChange(sliderValueToDelay(Number(event.target.value)))
          }
        />
      </label>

      <div className="controls__status">
        {/* totalSteps only reflects steps pulled so far, not the eventual
            total, since the generator is pulled lazily — so this reads as
            "how far in" rather than "X of Y remaining." */}
        {isDone ? `Done — ${totalSteps} steps` : `Step ${stepIndex}`}
      </div>
    </div>
  );
}
