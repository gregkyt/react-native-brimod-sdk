package com.brimodsdk;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import java.util.HashMap;
import java.util.Map;

/**
 * React Native module for bridging JS calls to native Android logic via BrimodSDKManager.
 * Exposes methods to JS and forwards calls to the native manager/delegate.
 */
public class RNBrimodSDKModule extends ReactContextBaseJavaModule {
    private final BrimodSDKManager manager;

    /**
     * Constructor for RNBrimodSDKModule.
     * @param reactContext The ReactApplicationContext provided by React Native.
     */
    public RNBrimodSDKModule(ReactApplicationContext reactContext) {
        super(reactContext);
        manager = BrimodSDKManager.getInstance();
        manager.setReactContext(reactContext);
    }

    /**
     * Returns the name of the module as exposed to JS.
     * @return The module name.
     */
    @NonNull
    @Override
    public String getName() {
        return "RNBrimodSDK";
    }

    /**
     * Selects a tab bar item by index. Returns a promise to JS.
     * @param index The index of the tab to select.
     * @param promise The promise to resolve or reject.
     */
    @ReactMethod
    public void selectTabBarItem(int index, final Promise promise) {
        manager.selectTabBarItem(index, promise::resolve, (code, message, error) -> promise.reject(code, message, error));
    }

    /**
     * Makes an API call through the native layer. Returns a promise to JS.
     * @param apiName The name of the API to call.
     * @param payload Optional payload for the API call.
     * @param promise The promise to resolve or reject.
     */
    @ReactMethod
    public void requestApiCall(String apiName, ReadableMap payload, final Promise promise) {
        Map<String, Object> payloadMap = payload != null ? payload.toHashMap() : new HashMap<>();
        manager.requestApiCall(apiName, payloadMap, promise::resolve, (code, message, error) -> promise.reject(code, message, error));
    }

    /**
     * Navigates to a native screen.
     * @param name The identifier of the native screen.
     * @param params Optional parameters to pass to the native screen.
     * @param isRnDismissed Whether to dismiss the React Native view.
     */
    @ReactMethod
    public void navigateToNative(String name, ReadableMap params, boolean isRnDismissed) {
        Map<String, Object> paramsMap = params != null ? params.toHashMap() : new HashMap<>();
        manager.navigateToNative(name, paramsMap, isRnDismissed);
    }

    /**
     * Navigates to a React Native screen or bundle.
     * @param bundleName Optional bundle name.
     * @param appName The name of the React Native app/module.
     * @param params Optional parameters to pass.
     */
    @ReactMethod
    public void navigateToReact(String bundleName, String appName, ReadableMap params) {
        Map<String, Object> paramsMap = params != null ? params.toHashMap() : new HashMap<>();
        manager.navigateToReact(bundleName, appName, paramsMap);
    }

    /**
     * Sends data to the React Native layer via event emitter.
     * @param data The data to send.
     */
    @ReactMethod
    public void sendDataToReact(ReadableMap data) {
        Map<String, Object> dataMap = data != null ? data.toHashMap() : new HashMap<>();
        manager.sendDataToReact(dataMap);
    }

    /**
     * Handles data sent from React Native to the native layer.
     * @param name Identifier for the data type.
     * @param data The data sent from React Native.
     */
    @ReactMethod
    public void sendDataToNative(String name, ReadableMap data) {
        Map<String, Object> dataMap = data != null ? data.toHashMap() : new HashMap<>();
        manager.sendDataToNative(name, dataMap);
    }
} 