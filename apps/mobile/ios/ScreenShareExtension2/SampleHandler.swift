import ReplayKit
import LiveKit

class SampleHandler: RPBroadcastSampleHandler {
    var room: Room?
    var videoTrack: LocalVideoTrack?
    var videoPublication: LocalTrackPublication?
    private let appGroupIdentifier = "group.com.rf4.pocketdex"
  
    override init() {
        super.init()
        print("[ScreenShare] SampleHandler init")
    }

    override func broadcastStarted(withSetupInfo setupInfo: [String : NSObject]?) {
        print("[ScreenShare] broadcastStarted called")
        print("[ScreenShare] setupInfo: \(String(describing: setupInfo))")
        guard let userDefaults = UserDefaults(suiteName: appGroupIdentifier) else {
            print("[ScreenShare] Failed to access shared UserDefaults")
            self.finishBroadcastWithError(NSError(domain: "ScreenShareExtension", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to access shared UserDefaults"]))
            return
        }
        guard let token = userDefaults.string(forKey: "livekit_token") else {
            print("[ScreenShare] Failed to get token from UserDefaults")
            self.finishBroadcastWithError(NSError(domain: "ScreenShareExtension", code: -1, userInfo: [NSLocalizedDescriptionKey: "Missing token"]))
            return
        }
        guard let roomName = userDefaults.string(forKey: "livekit_room") else {
            print("[ScreenShare] Failed to get room from UserDefaults")
            self.finishBroadcastWithError(NSError(domain: "ScreenShareExtension", code: -1, userInfo: [NSLocalizedDescriptionKey: "Missing room"]))
            return
        }
        print("[ScreenShare] Got token: \(token.prefix(8))..., room: \(roomName)")
        let liveKitURL = "wss://pocketdex-5benn6su.livekit.cloud"
        print("[ScreenShare] Using LiveKit URL: \(liveKitURL)")
        Task {
            do {
                print("[ScreenShare] Creating Room instance")
                let room = Room()
                print("[ScreenShare] Connecting to LiveKit...")
                try await room.connect(url: liveKitURL, token: token)
                print("[ScreenShare] Successfully connected to LiveKit")
                self.room = room
                print("[ScreenShare] Creating screen share video track")
                let videoTrack = LocalVideoTrack.createBroadcastScreenCapturerTrack()
                self.videoTrack = videoTrack
                print("[ScreenShare] Video track created")
                print("[ScreenShare] Publishing video track to room")
                let publication = try await room.localParticipant.publish(videoTrack: videoTrack)
                self.videoPublication = publication
                print("[ScreenShare] Successfully published video track")
            } catch {
                print("[ScreenShare] Error: \(error)")
                self.finishBroadcastWithError(error as NSError)
            }
        }
    }

    override func processSampleBuffer(_ sampleBuffer: CMSampleBuffer, with sampleBufferType: RPSampleBufferType) {
        print("[ScreenShare] processSampleBuffer called: \(sampleBufferType.rawValue)")
        // No need to manually forward sample buffers; LiveKit handles this internally for broadcast extension tracks.
    }

    override func broadcastFinished() {
        print("[ScreenShare] broadcastFinished called")
        Task {
            do {
                print("[ScreenShare] Starting cleanup...")
                if let publication = self.videoPublication {
                    print("[ScreenShare] Unpublishing video track")
                    try await room?.localParticipant.unpublish(publication: publication)
                }
                print("[ScreenShare] Disconnecting from room")
                await room?.disconnect()
                self.videoTrack = nil
                self.videoPublication = nil
                self.room = nil
                print("[ScreenShare] Cleanup completed")
            } catch {
                print("[ScreenShare] Error during broadcast cleanup: \(error)")
            }
        }
    }
}
