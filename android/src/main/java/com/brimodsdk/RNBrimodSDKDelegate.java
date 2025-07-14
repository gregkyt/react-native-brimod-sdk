package com.brimodsdk;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;

/**
 * Delegate interface for handling native logic for RNBrimodSDK.
 * Implement this interface to provide native functionality for React Native bridge methods.
 */
public interface RNBrimodSDKDelegate {
    /**
     * Selects a tab bar item by index.
     * @param index The index of the tab to select.
     * @param promise Callback for successful selection.
     */
    void selectTabBarItem(int index, Promise promise);

    /**
     * Makes an API call through the native layer.
     * @param apiName The name of the API to call.
     * @param payload Optional payload for the API call.
     * @param promise Callback for successful response.
     */
    void requestApiCall(String apiName, ReadableMap payload, Promise promise);

    /**
     * Navigates to a native screen.
     * @param name The identifier of the native screen.
     * @param params Optional parameters to pass to the native screen.
     * @param isRnDismissed Whether to dismiss the React Native view.
     */
    void navigateToNative(String name, ReadableMap params, boolean isRnDismissed);

    /**
     * Navigates to a React Native screen or bundle.
     * @param bundleName Optional bundle name.
     * @param appName The name of the React Native app/module.
     * @param params Optional parameters to pass.
     * @param promise Callback for successful response.
     */
    void navigateToReact(String bundleName, String appName, ReadableMap params, Promise promise);

    /**
     * Sends data to the React Native layer via event emitter.
     * @param data The data to send.
     */
    void sendDataToReact(String data);

    /**
     * Handles data sent from React Native to the native layer.
     * @param name Identifier for the data type.
     * @param data The data sent from React Native.
     */
    void sendDataToNative(String name, String data);

    /**
     * Dismisses the React Native view.
     */
    void dismissReact();
} 