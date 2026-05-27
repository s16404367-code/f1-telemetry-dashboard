import { DriverTelemetry } from '../services/telemetryProcessor'

interface TimingTowerProps {
  drivers: DriverTelemetry[]
  selectedDriver: DriverTelemetry | null
  onSelectDriver: (driver: DriverTelemetry) => void
}

export default function TimingTower({
  drivers,
  selectedDriver,
  onSelectDriver
}: TimingTowerProps) {
  const sorted = [...drivers].sort((a, b) => a.position - b.position)

  const formatGap = (gap: number | null): string => {
    if (gap === null) return 'LEADER'
    if (gap > 60) return '+1 LAP'
    return `+${gap.toFixed(2)}s`
  }

  return (
    <div className="overflow-y-auto max-h-[600px]">
      {sorted.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No drivers</div>
      ) : (
        sorted.map((driver, idx) => (
          <div
            key={driver.driverNumber}
            onClick={() => onSelectDriver(driver)}
            className={`timing-row ${
              selectedDriver?.driverNumber === driver.driverNumber ? 'selected' : ''
            }`}
          >
            {/* Position */}
            <div className="w-8 font-bold text-lg text-center">{driver.position}</div>

            {/* Color indicator */}
            <div
              className="w-3 h-8 rounded"
              style={{ backgroundColor: driver.teamColour }}
            />

            {/* Driver info */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">
                #{driver.driverNumber} {driver.lastName}
              </div>
              <div className="text-xs text-gray-500 truncate">{driver.teamName}</div>
            </div>

            {/* Gap */}
            <div className="text-right font-mono text-sm">
              {formatGap(driver.gapToLeader)}
            </div>

            {/* Tyre info */}
            {driver.tyreCompound !== 'UNKNOWN' && (
              <div className="ml-2 px-2 py-0.5 bg-f1-red/20 rounded text-xs font-semibold">
                {driver.tyreCompound}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
