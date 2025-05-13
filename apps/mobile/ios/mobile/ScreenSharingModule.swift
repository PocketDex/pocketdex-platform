import Foundation
import ReplayKit
import UIKit

@objc(ScreenSharingModule)
class ScreenSharingModule: NSObject {
    private let appGroupIdentifier = "group.com.rf4.pocketdex"
    
    @objc
    func startScreenShare(_ token: String, room: String) {
        print("[ScreenShare] Starting screen share with token: \(token.prefix(8))..., room: \(room)")
        
        // Store the token and room for later use
        guard let userDefaults = UserDefaults(suiteName: appGroupIdentifier) else {
            print("[ScreenShare] Failed to access shared UserDefaults")
            return
        }
        
        userDefaults.set(token, forKey: "livekit_token")
        userDefaults.set(room, forKey: "livekit_room")
        userDefaults.synchronize()
        print("[ScreenShare] Saved token and room to UserDefaults")

        // Use the advanced broadcast picker
        RPBroadcastActivityViewController.load { [weak self] broadcastAVC, error in
            if let error = error {
                print("[ScreenShare] Failed to load broadcast picker: \(error)")
                return
            }
            
            guard let broadcastAVC = broadcastAVC else {
                print("[ScreenShare] Broadcast picker is nil")
                return
            }
            
            broadcastAVC.delegate = self
            
            // Present the broadcast picker
            if let rootVC = UIApplication.shared.connectedScenes
                .compactMap({ $0 as? UIWindowScene })
                .flatMap({ $0.windows })
                .first(where: { $0.isKeyWindow })?.rootViewController {
                print("[ScreenShare] Presenting broadcast picker")
                rootVC.present(broadcastAVC, animated: true)
            } else {
                print("[ScreenShare] Failed to find root view controller")
            }
        }
    }

    // ADVANCED: If you want to pass setupInfo, use this method instead.
    @objc
    func startScreenShareWithSetupInfo(_ token: String, room: String) {
        print("startScreenShareWithSetupInfo called with token: \(token), room: \(room)")
        RPBroadcastActivityViewController.load { broadcastAVC, error in
            print("RPBroadcastActivityViewController.load called")
            guard let broadcastAVC = broadcastAVC else {
                print("Failed to load broadcastAVC: \(String(describing: error))")
                return
            }
            broadcastAVC.delegate = self
            if let rootVC = UIApplication.shared.connectedScenes
                .compactMap({ $0 as? UIWindowScene })
                .flatMap({ $0.windows })
                .first(where: { $0.isKeyWindow })?.rootViewController {
                print("Presenting broadcastAVC")
                rootVC.present(broadcastAVC, animated: true, completion: nil)
            } else {
                print("No rootVC found")
            }
        }
    }
}

// Optionally conform to RPBroadcastActivityViewControllerDelegate if you want to handle completion
extension ScreenSharingModule: RPBroadcastActivityViewControllerDelegate {
    func broadcastActivityViewController(_ broadcastActivityViewController: RPBroadcastActivityViewController, didFinishWith broadcastController: RPBroadcastController?, error: Error?) {
        print("[ScreenShare] Broadcast picker finished")
        broadcastActivityViewController.dismiss(animated: true)
        
        if let error = error {
            print("[ScreenShare] Broadcast picker error: \(error)")
            return
        }
        
        if let broadcastController = broadcastController {
            print("[ScreenShare] Broadcast started successfully")
            broadcastController.startBroadcast { error in
                if let error = error {
                    print("[ScreenShare] Failed to start broadcast: \(error)")
                }
            }
        } else {
            print("[ScreenShare] No broadcast controller returned")
        }
    }
} 