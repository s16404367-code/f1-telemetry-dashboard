import { useState, useEffect } from 'react'
import { openf1 } from '../services/openf1Client'
import LiveMode from './modes/LiveMode'
import HistoricalMode from './modes/HistoricalMode'
import SessionSelector from './SessionSelector'

type DashboardMode = 'live' | 'historical'

export default function Dashboard() {
  const [mode, setMode] = useState<DashboardMode>('live')
  const [meetings, setMeetings] = useState<any[]>([])
  const [sessions, setSessions] = useState<any[]>([])
  const [selectedMeeting, setSelectedMeeting] = useState<any | null>(null)
  const [selectedSession, setSelectedSession] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  // Load meetings on mount
  useEffect(() => {
    const loadMeetings = async () => {
      try {
        setLoading(true)
        const data = await openf1.getMeetings(2025)
        setMeetings(data || [])
      } catch (err) {
        console.error('Failed to load meetings:', err)
      } finally {
        setLoading(false)
      }
    }

    loadMeetings()
  }, [])

  // Load sessions when meeting changes
  useEffect(() => {
    if (!selectedMeeting) return

    const loadSessions = async () => {
      try {
        setLoading(true)
        const data = await openf1.getSessions(selectedMeeting.meeting_key)
        setSessions(data || [])
      } catch (err) {
        console.error('Failed to load sessions:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSessions()
  }, [selectedMeeting])

  return (
    <div className="min-h-screen bg-gradient-to-br from-f1-dark to-f1-gray">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-f1-gray sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏁</span>
              <h1 className="text-2xl font-bold text-white">F1 Telemetry Dashboard</h1>
            </div>

            {/* Mode Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setMode('live')}
                className={`px-4 py-2 rounded font-semibold transition-all ${
                  mode === 'live'
                    ? 'bg-f1-red text-white'
                    : 'bg-f1-gray text-gray-400 hover:bg-f1-gray/80'
                }`}
              >
                🔴 Live
              </button>
              <button
                onClick={() => setMode('historical')}
                className={`px-4 py-2 rounded font-semibold transition-all ${
                  mode === 'historical'
                    ? 'bg-f1-red text-white'
                    : 'bg-f1-gray text-gray-400 hover:bg-f1-gray/80'
                }`}
              >
                ⏱️ Historical
              </button>
            </div>
          </div>

          {/* Session Selector */}
          <SessionSelector
            meetings={meetings}
            sessions={sessions}
            selectedMeeting={selectedMeeting}
            selectedSession={selectedSession}
            onMeetingSelect={setSelectedMeeting}
            onSessionSelect={setSelectedSession}
            loading={loading}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {!selectedSession ? (
          <div className="bg-f1-gray rounded-lg p-12 text-center border border-f1-gray/50">
            <p className="text-gray-400 mb-4 text-lg">Select a session to begin</p>
            {meetings.length === 0 && (
              <p className="text-gray-500 text-sm">Loading meetings...</p>
            )}
          </div>
        ) : mode === 'live' ? (
          <LiveMode session={selectedSession} />
        ) : (
          <HistoricalMode session={selectedSession} />
        )}
      </main>
    </div>
  )
}
