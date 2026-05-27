import { DriverTelemetry } from '../services/telemetryProcessor'

interface TrackMapProps {
  drivers: DriverTelemetry[]
  selectedDriver: DriverTelemetry | null
  onSelectDriver: (driver: DriverTelemetry) => void
  circuitName: string
}

export default function TrackMap({
  drivers,
  selectedDriver,
  onSelectDriver,
  circuitName
}: TrackMapProps) {
  // Simple track visualization with driver dots
  return (
    <div className="bg-f1-gray rounded-lg border border-f1-gray/50 overflow-hidden aspect-square">
      <svg
        viewBox="0 0 1000 1000"
        className="w-full h-full bg-gradient-to-br from-f1-dark to-f1-gray"
      >
        {/* Track outline - simple oval for now */}
        <ellipse
          cx="500"
          cy="500"
          rx="400"
          ry="300"
          fill="none"
          stroke="#444"
          strokeWidth="2"
        />

        {/* Driver dots */}
        {drivers.map(driver => (
          <g key={driver.driverNumber}>
            {/* Driver circle */}
            <circle
              cx={(driver.trackX / 100) * 1000}
              cy={(driver.trackY / 100) * 1000}
              r={selectedDriver?.driverNumber === driver.driverNumber ? 15 : 10}
              fill={driver.teamColour}
              stroke={selectedDriver?.driverNumber === driver.driverNumber ? '#FFF' : 'none'}
              strokeWidth={selectedDriver?.driverNumber === driver.driverNumber ? 2 : 0}
              className="cursor-pointer transition-all hover:r-[15px]"
              onClick={() => onSelectDriver(driver)}
              style={{
                filter: 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.5))',
              }}
            />

            {/* Driver number */}
            <text
              x={(driver.trackX / 100) * 1000}
              y={(driver.trackY / 100) * 1000}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8"
              fontWeight="bold"
              fill="#FFF"
              pointerEvents="none"
            >
              {driver.driverNumber}
            </text>

            {/* Position label */}
            <text
              x={(driver.trackX / 100) * 1000}
              y={(driver.trackY / 100) * 1000 - 20}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill={driver.teamColour}
              pointerEvents="none"
            >
              {driver.position}
            </text>
          </g>
        ))}

        {/* Circuit name */}
        <text
          x="50"
          y="50"
          fontSize="16"
          fontWeight="bold"
          fill="#999"
          textTransform="uppercase"
        >
          {circuitName}
        </text>
      </svg>
    </div>
  )
}
