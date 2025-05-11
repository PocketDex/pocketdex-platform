import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function WatchStream() {
  const { roomId } = useParams()
  const [token, setToken] = useState<string | null>(null)
  const [userInteracted, setUserInteracted] = useState(false)

  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch(`http://localhost:3000/api/livekit-token?room=${roomId}&identity=viewer-${Math.random()}`)
      const { token } = await res.json()
      setToken(token)
    }
    fetchToken()
  }, [roomId])

  if (!token) return <div>Loading stream for room: {roomId}...</div>

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {!userInteracted && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            cursor: 'pointer',
          }}
          onClick={() => setUserInteracted(true)}
        >
          Click to start stream
        </div>
      )}
      <div style={{ filter: !userInteracted ? 'blur(2px)' : 'none' }}>
        <LiveKitRoom
          token={token}
          serverUrl={import.meta.env.VITE_LIVEKIT_URL}
          connect={userInteracted}
        >
          <VideoConference />
        </LiveKitRoom>
      </div>
    </div>
  )
}