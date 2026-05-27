interface ReplayControlsProps {
  isPlaying: boolean
  onPlayPause: () => void
  playbackSpeed: number
  onSpeedChange: (speed: number) => void
  currentFrame: number
  totalFrames: number
  onSeek: (frame: number) => void
}

export default function ReplayControls({
  isPlaying,
  onPlayPause,
  playbackSpeed,
  onSpeedChange,
  currentFrame,
  totalFrames,
  onSeek
}: ReplayControlsProps) {
  const speedOptions = [0.25, 0.5, 1, 2, 4]
  const progress = totalFrames > 0 ? (currentFrame / totalFrames) * 100 : 0

  return (
    <div className="bg-f1-gray rounded-lg border border-f1-gray/50 p-6">
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={onPlayPause}
              className={`px-4 py-2 rounded font-semibold transition-all ${
                isPlaying
                  ? 'bg-f1-red text-white hover:bg-red-700'
                  : 'bg-f1-gray/50 text-gray-300 hover:bg-f1-gray'
              }`}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>

            <div className="flex gap-1 ml-4">
              {speedOptions.map(speed => (
                <button
                  key={speed}
                  onClick={() => onSpeedChange(speed)}
                  className={`px-3 py-2 rounded text-xs font-semibold transition-all ${
                    playbackSpeed === speed
                      ? 'bg-f1-red text-white'
                      : 'bg-f1-gray/50 text-gray-300 hover:bg-f1-gray'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-400 font-mono">
            {currentFrame} / {totalFrames}
          </div>
        </div>

        {/* Timeline slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={totalFrames - 1}
            value={currentFrame}
            onChange={(e) => onSeek(parseInt(e.target.value))}
            className="w-full h-2 bg-f1-gray/50 rounded-lg appearance-none cursor-pointer accent-f1-red"
          />

          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>{Math.floor(totalFrames / 2)}</span>
            <span>{totalFrames}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
