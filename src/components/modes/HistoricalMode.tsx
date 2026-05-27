import { useState, useEffect } from 'react'
import { openf1 } from '../../services/openf1Client'
import { TelemetryProcessor, DriverTelemetry } from '../../services/telemetryProcessor'
import TrackMap from '../TrackMap'
import TimingTower from '../TimingTower'
import DriverPanel from '../DriverPanel'
import ReplayControls from '../ReplayControls'

interface HistoricalModeProps {
  session: any
}

interface FrameData {
  timestamp: number
  drivers: DriverTelemetry[]
}

export default function HistoricalMode({ session }: HistoricalModeProps) {
  const [frames, setFrames] = useState<FrameData[]>([])
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [selectedDriver, setSelectedDriver] = useState<DriverTelemetry | null>(null)
  const [loading, setLoading] = useState(true)

  // Load historical data
  useEffect(() => {
    const loadHistoricalData = async () => {
      try {
        setLoading(true)

        // Get all drivers
        const rawDrivers = await openf1.getDrivers(session.session_key)
        if (!Array.isArray(rawDrivers)) return

        // Get location data
        const locations = await openf1.getLocation(session.session_key)
        const intervals = await openf1.getIntervals(session.session_key)
        const laps = await openf1.getLaps(session.session_key)

        if (!Array.isArray(locations)) return

        // Group by timestamp
        const frameMap = new Map<number, FrameData>()

        locations.forEach(loc => {
          if (!loc.date) return
          const timestamp = new Date(loc.date).getTime()
          
          if (!frameMap.has(timestamp)) {
            frameMap.set(timestamp, {
              timestamp,
              drivers: rawDrivers
                .map(d => ({
                  ...TelemetryProcessor.processDriver(d),
                  driverNumber: d.driver_number ?? 0,
                  firstName: d.first_name ?? 'Unknown',
                  lastName: d.last_name ?? 'Driver',
                  teamName: d.team_name ?? 'Unknown',
                  teamColour: d.team_colour ? `#${d.team_colour}` : '#DC0000',
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
            })
          }

          const frame = frameMap.get(timestamp)!
          const driverIndex = frame.drivers.findIndex(d => d.driverNumber === loc.driver_number)
          if (driverIndex >= 0) {
            frame.drivers[driverIndex].trackX = TelemetryProcessor.processLocation(loc).trackX ?? 50
            frame.drivers[driverIndex].trackY = TelemetryProcessor.processLocation(loc).trackY ?? 50
          }
        })

        // Add interval data
        intervals.forEach(interval => {
          frameMap.forEach(frame => {
            const driver = frame.drivers.find(d => d.driverNumber === interval.driver_number)
            if (driver) {
              driver.gapToLeader = interval.gap_to_leader ?? null
              driver.gapToAhead = interval.interval ?? null
              driver.position = interval.position ?? 0
            }
          })
        })

        // Sort by timestamp
        const sortedFrames = Array.from(frameMap.values()).sort((a, b) => a.timestamp - b.timestamp)
        setFrames(sortedFrames)
      } catch (err) {
        console.error('Failed to load historical data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadHistoricalData()
  }, [session])

  // Playback loop
  useEffect(() => {
    if (!isPlaying || frames.length === 0) return

    const interval = setInterval(() => {
      setCurrentFrameIndex(prev => {
        const next = prev + playbackSpeed
        if (next >= frames.length) {
          setIsPlaying(false)
          return frames.length - 1
        }
        return Math.floor(next)
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isPlaying, frames.length, playbackSpeed])

  const currentFrame = frames[currentFrameIndex]
  const currentDrivers = currentFrame?.drivers || []

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block">
          <div className="spinner mb-4"></div>
          <p className="text-gray-400">Loading historical data...</p>
        </div>
      </div>
    )
  }

  if (frames.length === 0) {
    return (
      <div className="bg-f1-gray rounded-lg p-12 text-center border border-f1-gray/50">
        <p className="text-gray-400">No historical data available for this session</p>
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
            drivers={currentDrivers}
            selectedDriver={selectedDriver}
            onSelectDriver={setSelectedDriver}
            circuitName={session.circuit_short_name?.toLowerCase() || 'monaco'}
          />
        </div>

        {/* Timing Tower */}
        <div className="bg-f1-gray rounded-lg border border-f1-gray/50 overflow-hidden">
          <div className="p-4 border-b border-f1-gray/50 bg-black/20">
            <h2 className="font-bold text-lg">TIMING TOWER</h2>
            <p className="text-xs text-gray-500">Frame: {currentFrameIndex + 1} / {frames.length}</p>
          </div>
          <TimingTower
            drivers={currentDrivers}
            selectedDriver={selectedDriver}
            onSelectDriver={setSelectedDriver}
          />
        </div>
      </div>

      {/* Replay Controls */}
      <ReplayControls
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        playbackSpeed={playbackSpeed}
        onSpeedChange={setPlaybackSpeed}
        currentFrame={currentFrameIndex}
        totalFrames={frames.length}
        onSeek={setCurrentFrameIndex}
      />

      {/* Driver Panel */}
      {selectedDriver && (
        <div className="bg-f1-gray rounded-lg border border-f1-gray/50 overflow-hidden">
          <DriverPanel driver={selectedDriver} />
        </div>
      )}
    </div>
  )
}
