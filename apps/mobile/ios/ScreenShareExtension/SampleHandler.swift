import ReplayKit
import LiveKit

class SampleHandler: RPBroadcastSampleHandler {
    var room: Room?
    var videoTrack: LocalVideoTrack?
    var videoPublication: LocalTrackPublication?
    private let appGroupIdentifier = "group.com.rf4.pocketdex"

    override func broadcastStarted(withSetupInfo setupInfo: [String : NSObject]?) {
        NSLog("[ScreenShare] broadcastStarted called")
        guard let userDefaults = UserDefaults(suiteName: appGroupIdentifier),
              let token = userDefaults.string(forKey: "livekit_token"),
              let roomName = userDefaults.string(forKey: "livekit_room") else {
            NSLog("[ScreenShare] Failed to get token/room from UserDefaults")
            self.finishBroadcastWithError(NSError(domain: "ScreenShareExtension", code: -1, userInfo: [NSLocalizedDescriptionKey: "Missing token/room"]))
            return
        }
        let liveKitURL = "wss://pocketdex-5benn6su.livekit.cloud"
        NSLog("[ScreenShare] Connecting to LiveKit...")
        Task {
            do {
                let room = Room()
                try await room.connect(url: liveKitURL, token: token)
                self.room = room
                NSLog("[ScreenShare] Connected to LiveKit")

                let videoTrack = LocalVideoTrack.createBroadcastScreenCapturerTrack()
                self.videoTrack = videoTrack
                let publication = try await room.localParticipant.publish(videoTrack: videoTrack)
                self.videoPublication = publication
                NSLog("[ScreenShare] Published screen share track")
            } catch {
                NSLog("[ScreenShare] Error: \(error)")
                self.finishBroadcastWithError(error as NSError)
            }
        }
    }

    override func processSampleBuffer(_ sampleBuffer: CMSampleBuffer, with sampleBufferType: RPSampleBufferType) {
        // No manual forwarding needed for LiveKit's createBroadcastScreenCapturerTrack
    }

    override func broadcastFinished() {
        NSLog("[ScreenShare] broadcastFinished called")
        Task {
            do {
                if let publication = self.videoPublication {
                    try await room?.localParticipant.unpublish(publication: publication)
                }
                await room?.disconnect()
                self.videoTrack = nil
                self.videoPublication = nil
                self.room = nil
                NSLog("[ScreenShare] Cleanup completed")
            } catch {
                NSLog("[ScreenShare] Error during cleanup: \(error)")
            }
        }
    }
}
