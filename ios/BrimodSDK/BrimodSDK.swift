//
//  BrimodSDK.swift
//  BrimodSDK
//
//  Created by Bangkit's MacBook on 08/07/25.
//

import Foundation
import React

public protocol BrimodSDKProtocol {
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
  
  func sendDataToReact(_ data: [String: Any])

  func sendDataToNative(_ name: String, data: [String: Any])
}


@objc(BrimodSDK)
class BrimodSDK: NSObject {
  
  private var delegate: BrimodSDKProtocol?
  
  @objc
  func selectTabBarItem(
      _ index: NSNumber,
      resolver: @escaping RCTPromiseResolveBlock,
      rejecter: @escaping RCTPromiseRejectBlock
  ) {
    delegate?.selectTabBarItem(
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
    delegate?.requestApiCall(
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
    delegate?.navigateToNative(name, params: params, isRnDismissed: isRnDismissed)
  }
  
  @objc
  func sendDataToReact(_ data: [String: Any]) {
    delegate?.sendDataToReact(data)
  }

  @objc
  func sendDataToNative(_ name: String, data: [String: Any]) {
    delegate?.sendDataToNative(name, data: data)
  }
}
