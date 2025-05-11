import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Button } from 'react-native';
import {
  AudioSession,
  LiveKitRoom,
  useTracks,
  TrackReferenceOrPlaceholder,
  VideoTrack,
  isTrackReference,
  registerGlobals,
} from '@livekit/react-native';
import { Track } from 'livekit-client';

registerGlobals();

const LIVEKIT_URL = 'wss://pocketdex-5benn6su.livekit.cloud'; // Replace with your actual URL

export default function PublisherScreen() {
  console.log('PublisherScreen loaded');
  const [token, setToken] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Start the audio session first.
    AudioSession.startAudioSession();

    // Fetch token from your API
    const fetchToken = async () => {
      // const res = await fetch('http://localhost:3000/api/livekit-token?room=test-room&identity=mobile-publisher');
      const res = await fetch('http://10.0.0.156:3000/api/livekit-token?room=test-room&identity=mobile-publisher'); // terminal command: ifconfig | grep inet
      const data = await res.json();
      console.log('Fetched data:', data);
      setToken(data.token);
    };
    fetchToken();

    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  if (!token) return <View style={styles.center}><Button title="Loading..." disabled /></View>;

  return (
    <LiveKitRoom
      serverUrl={LIVEKIT_URL}
      token={token}
      connect={true}
      audio={true}
      video={true}
      options={{
        adaptiveStream: { pixelDensity: 'screen' },
      }}
      onConnected={() => {
        setConnected(true);
        console.log('LiveKitRoom connected');
      }}
      onDisconnected={() => {
        setConnected(false);
        console.log('LiveKitRoom disconnected');
      }}
    >
      <RoomView />
      <View style={styles.center}>
        <Button title="Leave Room" onPress={() => setConnected(false)} />
      </View>
    </LiveKitRoom>
  );
}

const RoomView = () => {
  // Get all camera tracks (including local).
  const tracks = useTracks([Track.Source.Camera]);

  useEffect(() => {
    console.log('Tracks updated:', tracks);
  }, [tracks]);

  const renderTrack = ({ item }: { item: TrackReferenceOrPlaceholder }) => {
    if (isTrackReference(item)) {
      return <VideoTrack trackRef={item} style={styles.participantView} />;
    } else {
      return <View style={styles.participantView} />;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tracks}
        renderItem={renderTrack}
        keyExtractor={(_, idx) => idx.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  participantView: {
    height: 300,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 