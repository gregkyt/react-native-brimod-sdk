//
//  RNBrimodSDK.m
//  RNBrimodSDK
//
//  Created by Bangkit's MacBook on 08/07/25.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(RNBrimodSDK, RCTEventEmitter)

RCT_EXTERN_METHOD(selectTabBarItem:(nonnull NSNumber *)index
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(requestApiCall:(NSString *)apiName
                  payload:(NSDictionary *)payload
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(navigateToNative:(NSString *)name
                  params:(NSDictionary *)params
                  isRnDismissed:(nonnull NSNumber *)isRnDismissed)

RCT_EXTERN_METHOD(navigateToReact:(NSString *)bundleName
                  appName:(NSString *)appName
                  params:(NSDictionary *)params)

RCT_EXTERN_METHOD(sendDataToReact:(NSDictionary *)data)

RCT_EXTERN_METHOD(sendDataToNative:(NSString *)name
                  data:(NSDictionary *)data)

RCT_EXTERN_METHOD(dismiss:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"sendDataToReact", @"sendDataToNative"];
}

@end 