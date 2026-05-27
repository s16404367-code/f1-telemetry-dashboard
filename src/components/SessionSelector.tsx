interface SessionSelectorProps {
  meetings: any[]
  sessions: any[]
  selectedMeeting: any | null
  selectedSession: any | null
  onMeetingSelect: (meeting: any) => void
  onSessionSelect: (session: any) => void
  loading: boolean
}

export default function SessionSelector({
  meetings,
  sessions,
  selectedMeeting,
  selectedSession,
  onMeetingSelect,
  onSessionSelect,
  loading
}: SessionSelectorProps) {
  return (
    <div className="flex gap-4">
      {/* Meeting Selector */}
      <select
        value={selectedMeeting?.meeting_key || ''}
        onChange={(e) => {
          const meeting = meetings.find(m => m.meeting_key === parseInt(e.target.value))
          if (meeting) onMeetingSelect(meeting)
        }}
        disabled={loading || meetings.length === 0}
        className="flex-1 px-4 py-2 bg-f1-gray border border-f1-gray/50 rounded text-white disabled:opacity-50 cursor-pointer"
      >
        <option value="">Select Meeting...</option>
        {meetings.map(meeting => (
          <option key={meeting.meeting_key} value={meeting.meeting_key}>
            {meeting.country_name} - {meeting.circuit_short_name}
          </option>
        ))}
      </select>

      {/* Session Selector */}
      <select
        value={selectedSession?.session_key || ''}
        onChange={(e) => {
          const session = sessions.find(s => s.session_key === parseInt(e.target.value))
          if (session) onSessionSelect(session)
        }}
        disabled={loading || sessions.length === 0}
        className="flex-1 px-4 py-2 bg-f1-gray border border-f1-gray/50 rounded text-white disabled:opacity-50 cursor-pointer"
      >
        <option value="">Select Session...</option>
        {sessions.map(session => (
          <option key={session.session_key} value={session.session_key}>
            {session.session_name}
          </option>
        ))}
      </select>
    </div>
  )
}
