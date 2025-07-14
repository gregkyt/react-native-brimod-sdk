package com.brimodsdk;

import android.util.Log;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.Map;

/**
 * Singleton manager that implements RNBrimodSDKDelegate to handle native logic for RNBrimodSDK.
 * Provides placeholder implementations for tab selection, API calls, navigation, and event emission.
 */
public class BrimodSDKManager implements RNBrimodSDKDelegate {
    private static BrimodSDKManager instance;
    private ReactApplicationContext reactContext;

    private BrimodSDKManager() {}

    /**
     * Returns the singleton instance of BrimodSDKManager.
     * @return The singleton instance.
     */
    public static BrimodSDKManager getInstance() {
        if (instance == null) {
            instance = new BrimodSDKManager();
        }
        return instance;
    }

    /**
     * Sets the ReactApplicationContext for event emission.
     * @param context The ReactApplicationContext.
     */
    public void setReactContext(ReactApplicationContext context) {
        this.reactContext = context;
    }

    /**
     * Selects a tab bar item by index.
     * @param index The index of the tab to select.
     * @param promise Callback for successful selection.
     */
    @Override
    public void selectTabBarItem(int index, Promise promise) {
        // Placeholder: implement tab selection logic
        promise.resolve("Tab " + index + " selected");
    }

    /**
     * Makes an API call through the native layer.
     * @param apiName The name of the API to call.
     * @param payload Optional payload for the API call.
     * @param promise Callback for successful response.
     */
    @Override
    public void requestApiCall(String apiName, ReadableMap payload, Promise promise) {
        // Placeholder: implement API call logic
        promise.resolve("API call to " + apiName + " successful");
    }

    /**
     * Navigates to a native screen.
     * @param name The identifier of the native screen.
     * @param params Optional parameters to pass to the native screen.
     * @param isRnDismissed Whether to dismiss the React Native view.
     */
    @Override
    public void navigateToNative(String name, ReadableMap params, boolean isRnDismissed) {
        // Placeholder: implement navigation to native
        Log.d("BrimodSDKManager", "navigateToNative: " + name + ", params: " + params + ", isRnDismissed: " + isRnDismissed);
    }

    /**
     * Navigates to a React Native screen or bundle.
     * @param bundleName Optional bundle name.
     * @param appName The name of the React Native app/module.
     * @param params Optional parameters to pass.
     * @param promise Callback for successful navigation.
     */
    @Override
    public void navigateToReact(String bundleName, String appName, ReadableMap params, Promise promise) {
        // Placeholder: implement navigation to React
        Log.d("BrimodSDKManager", "navigateToReact: bundleName=" + bundleName + ", appName=" + appName + ", params=" + params);
        promise.resolve(true);
    }

    /**
     * Sends data to the React Native layer via event emitter.
     * @param data The data to send.
     */
    @Override
    public void sendDataToReact(String data) {
        // Placeholder: send event to React Native
        if (reactContext != null) {
            reactContext
                .getJSModule(com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("sendDataToReact", data);
        }
    }

    /**
     * Handles data sent from React Native to the native layer.
     * @param name Identifier for the data type.
     * @param data The data sent from React Native.
     */
    @Override
    public void sendDataToNative(String name, String data) {
        // Placeholder: handle data from React Native
        // Optionally, emit event back to JS
        if (reactContext != null) {
            reactContext
                .getJSModule(com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("sendDataToNative", data);
        }
    }

    @Override
    public void dismissReact() {
        // Placeholder: dismiss React Native screen
    }
} 