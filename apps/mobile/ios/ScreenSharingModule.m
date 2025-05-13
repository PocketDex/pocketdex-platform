#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ScreenSharingModule, NSObject)

RCT_EXTERN_METHOD(startScreenShare:(NSString *)token room:(NSString *)room)
//RCT_EXTERN_METHOD(startScreenShareWithSetupInfo:(NSString *)token room:(NSString *)room)
//RCT_EXTERN_METHOD(showNativeAlert)

@end 
