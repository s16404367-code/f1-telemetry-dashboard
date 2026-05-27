import { DriverTelemetry } from '../services/telemetryProcessor'

interface DriverPanelProps {
  driver: DriverTelemetry
}

export default function DriverPanel({ driver }: DriverPanelProps) {
  const formatTime = (seconds: number): string => {
    if (seconds === 0) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = (seconds % 60).toFixed(3)
    return `${mins}:${secs.padStart(6, '0')}`
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start gap-6 mb-6 pb-6 border-b border-f1-gray/50">
        <div
          className="w-16 h-16 rounded flex items-center justify-center font-bold text-2xl"
          style={{ backgroundColor: driver.teamColour + '20', borderColor: driver.teamColour, borderWidth: '2px' }}
        >
          {driver.driverNumber}
        </div>

        <div>
          <h2 className="text-2xl font-bold">{driver.firstName} {driver.lastName}</h2>
          <p className="text-gray-400">{driver.teamName}</p>
          <div className="flex gap-4 mt-2 text-sm">
            <span>Position: <span className="font-bold text-f1-red">{driver.position}</span></span>
            <span>Lap: <span className="font-bold">{driver.lapNumber}</span></span>
          </div>
        </div>
      </div>

      {/* Gaps */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-f1-gray/50 rounded p-4">
          <p className="text-xs text-gray-500 mb-1">GAP TO LEADER</p>
          <p className="text-xl font-bold">
            {driver.gapToLeader === null ? 'LEADER' : `+${driver.gapToLeader.toFixed(2)}s`}
          </p>
        </div>
        <div className="bg-f1-gray/50 rounded p-4">
          <p className="text-xs text-gray-500 mb-1">GAP TO AHEAD</p>
          <p className="text-xl font-bold">
            {driver.gapToAhead === null ? '-' : `+${driver.gapToAhead.toFixed(2)}s`}
          </p>
        </div>
        <div className="bg-f1-gray/50 rounded p-4">
          <p className="text-xs text-gray-500 mb-1">SPEED</p>
          <p className="text-xl font-bold">{Math.round(driver.speed)} km/h</p>
        </div>
      </div>

      {/* Lap Times */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-f1-gray/50 rounded p-4">
          <p className="text-xs text-gray-500 mb-1">CURRENT LAP</p>
          <p className="text-lg font-bold">{formatTime(driver.currentLapTime)}</p>
        </div>
        <div className="bg-f1-gray/50 rounded p-4">
          <p className="text-xs text-gray-500 mb-1">BEST LAP</p>
          <p className="text-lg font-bold text-green-400">{formatTime(driver.bestLapTime)}</p>
        </div>
        <div className="bg-f1-gray/50 rounded p-4">
          <p className="text-xs text-gray-500 mb-1">LAST LAP</p>
          <p className="text-lg font-bold">{formatTime(driver.lastLapTime)}</p>
        </div>
      </div>

      {/* Telemetry */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-f1-gray/50 rounded p-4">
          <p className="text-xs text-gray-500">THROTTLE</p>
          <p className="text-lg font-bold">{driver.throttle.toFixed(0)}%</p>
        </div>
        <div className="bg-f1-gray/50 rounded p-4">
          <p className="text-xs text-gray-500">BRAKE</p>
          <p className="text-lg font-bold">{driver.brake.toFixed(0)}%</p>
        </div>
        <div className="bg-f1-gray/50 rounded p-4">
          <p className="text-xs text-gray-500">GEAR</p>
          <p className="text-lg font-bold">{driver.gear}</p>
        </div>
        <div className="bg-f1-gray/50 rounded p-4">
          <p className="text-xs text-gray-500">RPM</p>
          <p className="text-lg font-bold">{(driver.rpm / 1000).toFixed(1)}K</p>
        </div>
        <div className="bg-f1-gray/50 rounded p-4">
          <p className="text-xs text-gray-500">TYRE</p>
          <p className="text-lg font-bold">{driver.tyreCompound}</p>
        </div>
        <div className="bg-f1-gray/50 rounded p-4">
          <p className="text-xs text-gray-500">DRS</p>
          <p className="text-lg font-bold" style={{ color: driver.drsEnabled ? '#00FF00' : '#666' }}>
            {driver.drsEnabled ? 'OPEN' : 'CLOSED'}
          </p>
        </div>
      </div>

      {/* Pit stops */}
      {driver.pitCount > 0 && (
        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded p-4">
          <p className="text-sm text-yellow-400">
            <span className="font-bold">{driver.pitCount}</span> pit stop{driver.pitCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}
