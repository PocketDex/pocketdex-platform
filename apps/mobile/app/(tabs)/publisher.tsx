import React from 'react';
import { StyleSheet, View, Text, Button, NativeModules } from 'react-native';
// import { requireNativeComponent } from 'react-native';
// const BroadcastPickerView = requireNativeComponent('RNBroadcastPickerView');

const { ScreenSharingModule } = NativeModules;
const API_URL = 'http://10.0.0.156:3000'; // Use your actual API server IP

console.log('ScreenSharingModule:', ScreenSharingModule);

async function fetchLiveKitToken(room: string, identity: string) {
  const res = await fetch(`${API_URL}/api/livekit-token?room=${room}&identity=${identity}`);
  const { token } = await res.json();
  return token;
}

async function startScreenShare(room: string, identity: string) {
  console.log('Calling startScreenShare0');
  const token = await fetchLiveKitToken(room, identity);
  // Use the advanced method to pass setupInfo (recommended for ReplayKit extension)
  // ScreenSharingModule.startScreenShareWithSetupInfo(token, room);
  // If you only want to use the default picker (no setupInfo), use:
  console.log('Calling startScreenShare');
  ScreenSharingModule.startScreenShare(token, room);
}

export default function PublisherScreen() {
  // Placeholder UI for screen sharing only
  // Later, this will trigger the native screen sharing extension
  return (
    <View style={styles.center}>
      <Text style={styles.infoText}>
        To share your screen, tap 'Start Screen Share' below, then select 'ScreenShareExtension' in the list and tap 'Start Broadcast'.
      </Text>
      {/* <BroadcastPickerView /> */}
      <Button
        title="Start Screen Share"
        onPress={() => startScreenShare('test-room', 'ios-screenshare')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  infoText: {
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
}); 