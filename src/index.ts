import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-brimod-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({
    ios: "- You have run 'cd ios && pod install'\n",
    default: '',
  }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const isTurboModuleEnabled = (global as any).__turboModuleProxy != null;

let RNBrimodSDKModule;

if (isTurboModuleEnabled) {
  try {
    RNBrimodSDKModule = require('./NativeRNBrimodSDK').default;
  } catch (e) {
    console.warn('TurboModule spec not found, falling back to legacy module');
    RNBrimodSDKModule = NativeModules.RNBrimodSDK;
  }
} else {
  RNBrimodSDKModule = NativeModules.RNBrimodSDK;
  console.log(RNBrimodSDKModule);
}

const RNBrimodSDK = RNBrimodSDKModule
  ? RNBrimodSDKModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

// Create event emitter
const eventEmitter = new NativeEventEmitter(RNBrimodSDK);

export interface RNBrimodSDKType {
  /**
   * Select a tab bar item by index
   */
  selectTabBarItem(index: number): Promise<string>;

  /**
   * Make an API call through the native layer
   */
  requestApiCall(
    apiName: string,
    payload?: Record<string, any>,
  ): Promise<string>;

  /**
   * Navigate to a native screen
   */
  navigateToNative(
    name: string,
    params?: Record<string, any>,
    isRnDismissed?: boolean,
  ): void;

  /**
   * Navigate to a React Native screen
   */
  navigateToReact(
    appName: string,
    bundleName?: string,
    params?: Record<string, any>,
  ): void;

  /**
   * Send data to React Native
   */
  sendDataToReact(data: Record<string, any>): void;

  /**
   * Send data to native
   */
  sendDataToNative(name: string, data: Record<string, any>): void;

  /**
   * Add event listener for data from native
   * Returns a subscription that can be used to remove the listener
   */
  addListener(
    eventType: 'sendDataToReact' | 'sendDataToNative',
    listener: (data: any) => void,
  ): { remove: () => void };

  /**
   * Remove all listeners
   */
  removeAllListeners(eventType?: 'sendDataToReact' | 'sendDataToNative'): void;
}

// Enhanced SDK with event emitter methods
const SDK: RNBrimodSDKType = {
  selectTabBarItem: (index: number): Promise<string> => {
    return RNBrimodSDK.selectTabBarItem(index);
  },

  requestApiCall: (
    apiName: string,
    payload?: Record<string, any>,
  ): Promise<string> => {
    return RNBrimodSDK.requestApiCall(apiName, payload || null);
  },

  navigateToNative: (
    name: string,
    params?: Record<string, any>,
    isRnDismissed: boolean = false,
  ): void => {
    RNBrimodSDK.navigateToNative(name, params || null, isRnDismissed);
  },

  navigateToReact: (
    appName: string,
    bundleName?: string,
    params?: Record<string, any>,
  ): void => {
    RNBrimodSDK.navigateToReact(bundleName || null, appName, params || null);
  },

  sendDataToReact: (data: Record<string, any>): void => {
    RNBrimodSDK.sendDataToReact(data);
  },

  sendDataToNative: (name: string, data: Record<string, any>): void => {
    RNBrimodSDK.sendDataToNative(name, data);
  },

  addListener: (
    eventType: 'sendDataToReact' | 'sendDataToNative',
    listener: (data: any) => void,
  ): { remove: () => void } => {
    return eventEmitter.addListener(eventType, listener);
  },

  removeAllListeners: (
    eventType?: 'sendDataToReact' | 'sendDataToNative',
  ): void => {
    if (eventType) {
      eventEmitter.removeAllListeners(eventType);
    } else {
      eventEmitter.removeAllListeners('sendDataToReact');
      eventEmitter.removeAllListeners('sendDataToNative');
    }
  },
};

export default SDK;
