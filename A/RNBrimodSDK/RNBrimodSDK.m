//
//  RNBrimodSDK.m
//  RNBrimodSDK
//
//  Created by Bangkit's MacBook on 09/07/25.
//

#import <Foundation/Foundation.h>
#import <React-Core/RCTBridgeModule.h>
#import <React-Core/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(RNBrimodSDK, RCTEventEmitter)

RCT_EXTERN_METHOD(selectTabBarItem:
                  (NSNumber * _Nonnull)index
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(requestApiCall:
                  (NSString *)apiName
                  payload:(NSDictionary * _Nullable)payload
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(navigateToNative:
                  (NSString * _Nullable)name
                  params:(NSDictionary * _Nullable)params
                  isRnDismissed:(NSNumber * _Nonnull)isRnDismissed)

RCT_EXTERN_METHOD(dismissReact)

RCT_EXTERN_METHOD(sendDataToReact:
                  (NSString *)data)

RCT_EXTERN_METHOD(sendDataToNative:
                  (NSString *)name
                  data:(NSString *)data)

@end
