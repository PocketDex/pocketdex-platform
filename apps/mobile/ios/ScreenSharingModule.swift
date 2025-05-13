import Foundation
import ReplayKit
import UIKit

@objc(ScreenSharingModule)
class ScreenSharingModule: NSObject {
    override init() {
        super.init()
        print("ScreenSharingModule loaded")
    }
    private let appGroupIdentifier = "group.com.rf4.pocketdex"
    
    @objc
    func startScreenShare(_ token: String, room: String) {
        print("rf4: Starting screen share")
      NSLog("rf4: Starting screen share2")
        // Store the token and room for later use
        guard let userDefaults = UserDefaults(suiteName: appGroupIdentifier) else {
            print("Failed to access shared UserDefaults")
            return
        }
        
        userDefaults.set(token, forKey: "livekit_token")
        userDefaults.set(room, forKey: "livekit_room")
        
        // Ensure the values are saved immediately
        userDefaults.synchronize()

        // All UI code must be on the main thread!
        DispatchQueue.main.async {
            // Create a broadcast picker view
            let picker = RPSystemBroadcastPickerView(frame: CGRect(x: 0, y: 0, width: 50, height: 50))
            picker.showsMicrophoneButton = false
            picker.preferredExtension = "com.rf4.pocketdex.ScreenShareExtension"
            

            // Find the button and simulate a tap
            if let button = picker.subviews.first(where: { $0 is UIButton }) as? UIButton {
                button.sendActions(for: .touchUpInside)
            } else {
                print("Failed to find broadcast picker button")
            }
        }
    }
  
//  @objc
//  func startScreenShareWithSetupInfo(_ token: String, room: String) {
//      DispatchQueue.main.async {
//          let picker = RPSystemBroadcastPickerView(frame: CGRect(x: 0, y: 0, width: 50, height: 50))
//          picker.preferredExtension = "com.rf4.pocketdex.ScreenShareExtension"
//          picker.showsMicrophoneButton = false
//          if let windowScene = UIApplication.shared.connectedScenes.first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene,
//             let window = windowScene.windows.first,
//             let button = picker.subviews.first(where: { $0 is UIButton }) as? UIButton {
//              window.addSubview(picker)
//              button.sendActions(for: .touchUpInside)
//              DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
////                  picker.removeFromSuperview()
//              }
//          }
//      }
//  }
}
