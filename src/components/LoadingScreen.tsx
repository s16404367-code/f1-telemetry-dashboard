interface LoadingScreenProps {
  message?: string
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-f1-dark to-f1-gray flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="spinner"></div>
          </div>
          <h1 className="text-4xl font-bold text-f1-red mb-2">🏁 F1 Telemetry</h1>
          <p className="text-gray-400">{message}</p>
        </div>
      </div>
    </div>
  )
}
