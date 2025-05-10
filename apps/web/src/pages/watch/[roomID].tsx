import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function WatchStream() {
  const { roomId } = useParams()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch(`/api/livekit-token?room=${roomId}&identity=viewer-${Math.random()}`)
      const { token } = await res.json()
      setToken(token)
    }
    fetchToken()
  }, [roomId])

  if (!token) return <div>Loading stream for room: {roomId}...</div>

  return (
    <LiveKitRoom
      token={token}
      serverUrl={import.meta.env.VITE_LIVEKIT_URL}
      connect={true}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}