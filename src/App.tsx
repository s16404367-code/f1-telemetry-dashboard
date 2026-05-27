import { useState, useEffect } from 'react'
import { openf1 } from './services/openf1Client'
import Dashboard from './components/Dashboard'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Test API connection
    const testConnection = async () => {
      try {
        setLoading(true)
        const meetings = await openf1.getMeetings(2025)
        
        if (!meetings || meetings.length === 0) {
          setError('No meetings found. Please check your internet connection.')
          return
        }

        setError(null)
      } catch (err) {
        console.error('API Connection Error:', err)
        setError('Failed to connect to OpenF1 API. Please check your internet connection.')
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  if (loading) {
    return <LoadingScreen message="Connecting to OpenF1 API..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-f1-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-f1-red mb-4">Connection Error</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-f1-red text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return <Dashboard />
}
