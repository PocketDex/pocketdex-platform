import { useRoomContext, useParticipants } from '@livekit/components-react';
import { useEffect } from 'react';

export function LiveKitDebugLogger() {
  const room = useRoomContext();
  const participants = useParticipants();

  useEffect(() => {
    window.lkRoom = room;
    console.log('[Web] Room object exposed as window.lkRoom');
  }, [room]);

  useEffect(() => {
    participants.forEach((p) => {
      p.trackPublications.forEach((pub: any) => {
        console.log('Participant:', p.identity, {
          kind: pub.kind,
          isSubscribed: pub.isSubscribed,
          isMuted: pub.isMuted,
          track: pub.track
        });
      });
    });
  }, [participants]);

  console.log('Participants:', participants.map(p => p.identity));

  return null; // No UI
}