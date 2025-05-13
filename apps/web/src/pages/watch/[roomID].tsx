import { LiveKitRoom, VideoConference, useRoomContext, useParticipants } from '@livekit/components-react'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LiveKitDebugLogger } from './LiveKitDebugLogger';

declare global {
  interface Window {
    lkRoom: any;
  }
}

export default function WatchStream() {
  const { roomId } = useParams()
  const [token, setToken] = useState<string | null>(null)
  const [userInteracted, setUserInteracted] = useState(false)
  const roomRef = useRef<any>(null)

  useEffect(() => {
    const fetchToken = async () => {
      console.log('[Web] Fetching token for room:', roomId)
      const res = await fetch(`http://localhost:3000/api/livekit-token?room=${roomId}&identity=viewer-${Math.random()}`)
      const { token } = await res.json()
      console.log('[Web] Received token:', token ? token.substring(0, 8) + '...' : null)
      setToken(token)
    }
    fetchToken()
  }, [roomId])

  // Debug logging for LiveKit room state
  // const room = useRoomContext();
  // const participants = useParticipants();
  // useEffect(() => {
  //   if (room) {
  //     window.lkRoom = room;
  //     console.log('[Web] Room object exposed as window.lkRoom');
  //   }
  // }, [room]);

  // useEffect(() => {
  //   participants.forEach((p) => {
  //     p.trackPublications.forEach((pub: any) => {
  //       console.log('Participant:', p.identity, {
  //         kind: pub.kind,
  //         isSubscribed: pub.isSubscribed,
  //         isMuted: pub.isMuted,
  //         track: pub.track
  //       });
  //     });
  //   });
  // }, [participants]);

  if (!token) {
    console.log('[Web] Waiting for token...')
    return <div>Loading stream for room: {roomId}...</div>
  }

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
          onClick={() => {
            setUserInteracted(true)
            console.log('[Web] User interacted, starting stream')
          }}
        >
          Click to start stream
        </div>
      )}
      <div style={{ filter: !userInteracted ? 'blur(2px)' : 'none' }}>
        <LiveKitRoom
          token={token}
          serverUrl={import.meta.env.VITE_LIVEKIT_URL}
          connect={userInteracted}
          onConnected={() => console.log('[Web] LiveKitRoom connected')}
          ref={roomRef}
        >
          <LiveKitDebugLogger />
          <VideoConference />
        </LiveKitRoom>
      </div>
    </div>
  )
}