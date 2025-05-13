//
//  ScreenShareSocket.swift
//  mobile
//
//  Created by Robert Fikes IV on 5/10/25.
//

import Foundation

let appGroupID = "group.com.rf4.pocketdex" // Use your actual App Group ID
let socketFileName = "screen_share_socket"
var socketPath: String {
    let containerURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroupID)!
    return containerURL.appendingPathComponent(socketFileName).path
}
