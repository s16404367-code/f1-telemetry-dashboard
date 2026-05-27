import { useState, useEffect } from 'react'
import { openf1 } from '../../services/openf1Client'
import { TelemetryProcessor, DriverTelemetry } from '../../services/telemetryProcessor'
import TrackMap from '../TrackMap'
import TimingTower from '../TimingTower'
import DriverPanel from '../DriverPanel'

interface LiveModeProps {
  session: any
}

export default function LiveMode({ session }: LiveModeProps) {
  const [drivers, setDrivers] = useState<DriverTelemetry[]>([])
  const [selectedDriver, setSelectedDriver] = useState<DriverTelemetry | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Load initial driver data
  useEffect(() => {
    const loadDrivers = async () => {
      try {
        setLoading(true)
        const rawDrivers = await openf1.getDrivers(session.session_key)
        
        if (!Array.isArray(rawDrivers)) {
          console.error('Invalid drivers data:', rawDrivers)
          return
        }

        const processed = rawDrivers
          .map(driver => ({
            ...TelemetryProcessor.processDriver(driver),
            driverNumber: driver.driver_number ?? 0,
            firstName: driver.first_name ?? 'Unknown',
            lastName: driver.last_name ?? 'Driver',
            teamName: driver.team_name ?? 'Unknown',
            teamColour: driver.team_colour ? `#${driver.team_colour}` : '#DC0000',
            position: 0,
            gapToLeader: null,
            gapToAhead: null,
            currentLapTime: 0,
            bestLapTime: 0,
            lastLapTime: 0,
            lapNumber: 0,
            speed: 0,
            throttle: 0,
            brake: 0,
            gear: 0,
            rpm: 0,
            tyreCompound: 'UNKNOWN',
            tyreAge: 0,
            pitCount: 0,
            drsEnabled: false,
            trackX: 50,
            trackY: 50,
          } as DriverTelemetry))
          .filter(d => d.driverNumber > 0)

        setDrivers(processed)
      } catch (err) {
        console.error('Failed to load drivers:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDrivers()
  }, [session])

  // Poll for live data
  useEffect(() => {
    if (drivers.length === 0) return

    const pollLiveData = async () => {
      try {
        // Get location data
        const locations = await openf1.getLocation(session.session_key)
        const intervals = await openf1.getIntervals(session.session_key)

        if (!Array.isArray(locations) || !Array.isArray(intervals)) {
          return
        }

        // Update drivers with new data
        const updated = drivers.map(driver => {
          let updated = { ...driver }

          // Update location
          const location = locations.find(l => l.driver_number === driver.driverNumber)
          if (location) {
            updated.trackX = TelemetryProcessor.processLocation(location).trackX ?? 50
            updated.trackY = TelemetryProcessor.processLocation(location).trackY ?? 50
          }

          // Update intervals
          const interval = intervals.find(i => i.driver_number === driver.driverNumber)
          if (interval) {
            updated.gapToLeader = interval.gap_to_leader ?? null
            updated.gapToAhead = interval.interval ?? null
            updated.position = interval.position ?? driver.position
          }

          return updated
        })

        setDrivers(updated)
        setLastUpdate(new Date())
      } catch (err) {
        console.error('Failed to poll live data:', err)
      }
    }

    const interval = setInterval(pollLiveData, 1000)
    return () => clearInterval(interval)
  }, [drivers, session])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="spinner mb-4"></div>
          <p className="text-gray-400">Loading live data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Track Map */}
        <div className="col-span-2">
          <TrackMap
            drivers={drivers}
            selectedDriver={selectedDriver}
            onSelectDriver={setSelectedDriver}
            circuitName={session.circuit_short_name?.toLowerCase() || 'monaco'}
          />
        </div>

        {/* Timing Tower */}
        <div className="bg-f1-gray rounded-lg border border-f1-gray/50 overflow-hidden">
          <div className="p-4 border-b border-f1-gray/50 bg-black/20">
            <h2 className="font-bold text-lg">TIMING TOWER</h2>
            {lastUpdate && (
              <p className="text-xs text-gray-500">Updated: {lastUpdate.toLocaleTimeString()}</p>
            )}
          </div>
          <TimingTower
            drivers={drivers}
            selectedDriver={selectedDriver}
            onSelectDriver={setSelectedDriver}
          />
        </div>
      </div>

      {/* Driver Panel */}
      {selectedDriver && (
        <div className="bg-f1-gray rounded-lg border border-f1-gray/50 overflow-hidden">
          <DriverPanel driver={selectedDriver} />
        </div>
      )}
    </div>
  )
}
