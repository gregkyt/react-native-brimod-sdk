package com.brimodsdk;

import java.util.Map;

/**
 * Delegate interface for handling native logic for RNBrimodSDK.
 * Implement this interface to provide native functionality for React Native bridge methods.
 */
public interface RNBrimodSDKDelegate {
    /**
     * Selects a tab bar item by index.
     * @param index The index of the tab to select.
     * @param success Callback for successful selection.
     * @param error Callback for error handling.
     */
    void selectTabBarItem(int index, CallbackSuccess success, CallbackError error);

    /**
     * Makes an API call through the native layer.
     * @param apiName The name of the API to call.
     * @param payload Optional payload for the API call.
     * @param success Callback for successful response.
     * @param error Callback for error handling.
     */
    void requestApiCall(String apiName, Map<String, Object> payload, CallbackSuccess success, CallbackError error);

    /**
     * Navigates to a native screen.
     * @param name The identifier of the native screen.
     * @param params Optional parameters to pass to the native screen.
     * @param isRnDismissed Whether to dismiss the React Native view.
     */
    void navigateToNative(String name, Map<String, Object> params, boolean isRnDismissed);

    /**
     * Navigates to a React Native screen or bundle.
     * @param bundleName Optional bundle name.
     * @param appName The name of the React Native app/module.
     * @param params Optional parameters to pass.
     */
    void navigateToReact(String bundleName, String appName, Map<String, Object> params);

    /**
     * Sends data to the React Native layer via event emitter.
     * @param data The data to send.
     */
    void sendDataToReact(Map<String, Object> data);

    /**
     * Handles data sent from React Native to the native layer.
     * @param name Identifier for the data type.
     * @param data The data sent from React Native.
     */
    void sendDataToNative(String name, Map<String, Object> data);

    /**
     * Callback interface for success responses.
     */
    interface CallbackSuccess {
        /**
         * Called when the operation is successful.
         * @param result The result string.
         */
        void onSuccess(String result);
    }

    /**
     * Callback interface for error responses.
     */
    interface CallbackError {
        /**
         * Called when the operation fails.
         * @param code Error code.
         * @param message Error message.
         * @param error Throwable error object.
         */
        void onError(String code, String message, Throwable error);
    }
} 