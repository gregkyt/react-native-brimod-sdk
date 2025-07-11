//
//  RNBrimodSDK.swift
//  RNBrimodSDK
//
//  Created by Bangkit's MacBook on 08/07/25.
//

import Foundation
import React

public protocol RNBrimodSDKProtocol {
    func selectTabBarItem(
        _ index: NSNumber,
        onSuccess: @escaping (String) -> Void,
        onError: @escaping (String, String, Error) -> Void
    )
    
    func requestApiCall(
        _ apiName: String,
        payload: [String: Any]?,
        onSuccess: @escaping (String) -> Void,
        onError: @escaping (String, String, Error) -> Void
    )
    
    func navigateToNative(
        _ name: String,
        params: [String: Any]?,
        isRnDismissed: NSNumber
    )
    
    func navigateToReact(
        _ bundleName: String?,
        appName: String,
        params: [String: Any]?
    )
    
    func sendDataToReact(_ data: [String: Any])
    
    func sendDataToNative(_ name: String, data: [String: Any])
}

@objc(RNBrimodSDK)
public class RNBrimodSDK: RCTEventEmitter {
    
    public static let shared: RNBrimodSDK = RNBrimodSDK()
    
    private static var delegate: RNBrimodSDKProtocol?

    override init() {
        super.init()
    }
    
    @objc public override static func moduleName() -> String! {
        return "RNBrimodSDK"
    }
    
    @objc public override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    public override func supportedEvents() -> [String]! {
        return ["sendDataToReact", "sendDataToNative"]
    }
    
    public func setDelegate(_ delegate: RNBrimodSDKProtocol) {
        RNBrimodSDK.delegate = delegate
    }
    
    @objc
    func selectTabBarItem(
        _ index: NSNumber,
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        RNBrimodSDK.delegate?.selectTabBarItem(
            index,
            onSuccess: { result in
                resolver(result)
            },
            onError: { code, message, error in
                rejecter(code, message, error)
            }
        )
    }
    
    @objc
    func requestApiCall(
        _ apiName: String,
        payload: [String: Any]?,
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        RNBrimodSDK.delegate?.requestApiCall(
            apiName,
            payload: payload,
            onSuccess: { result in
                resolver(result)
            },
            onError: { code, message, error in
                rejecter(code, message, error)
            }
        )
    }
    
    @objc
    func navigateToNative(
        _ name: String,
        params: [String: Any]?,
        isRnDismissed: NSNumber
    ) {
        RNBrimodSDK.delegate?.navigateToNative(name, params: params, isRnDismissed: isRnDismissed)
    }
    
    @objc
    func navigateToReact(
        _ bundleName: String?,
        appName: String,
        params: [String: Any]?
    ) {
        RNBrimodSDK.delegate?.navigateToReact(bundleName, appName: appName, params: params)
    }
    
    @objc
    func sendDataToReact(_ data: [String: Any]) {
        RNBrimodSDK.delegate?.sendDataToReact(data)
    }
    
    @objc
    func sendDataToNative(_ name: String, data: [String: Any]) {
        RNBrimodSDK.delegate?.sendDataToNative(name, data: data)
    }
} 
