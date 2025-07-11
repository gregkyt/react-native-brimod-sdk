# RNBrimodSDK Usage Guide

This guide shows how to use the RNBrimodSDK in React Native and implement the delegate on the iOS native side.

## React Native Usage

### Installation and Setup

1. Install the package:

```bash
npm install react-native-brimod-sdk
# or
yarn add react-native-brimod-sdk
```

2. For iOS, run pod install:

```bash
cd ios && pod install
```

### Basic Usage

```typescript
import RNBrimodSDK from 'react-native-brimod-sdk';

// Example component
const MyComponent = () => {
  useEffect(() => {
    // Add event listeners
    const subscription1 = RNBrimodSDK.addListener('sendDataToReact', data => {
      console.log('Data received from native:', data);
    });

    const subscription2 = RNBrimodSDK.addListener('sendDataToNative', data => {
      console.log('Data sent to native:', data);
    });

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  const handleSelectTab = async () => {
    try {
      const result = await RNBrimodSDK.selectTabBarItem(2);
      console.log('Tab selected:', result);
    } catch (error) {
      console.error('Error selecting tab:', error);
    }
  };

  const handleApiCall = async () => {
    try {
      const result = await RNBrimodSDK.requestApiCall('getUserData', {
        userId: 123,
        includeProfile: true,
      });
      console.log('API result:', result);
    } catch (error) {
      console.error('API error:', error);
    }
  };

  const handleNavigateToNative = () => {
    RNBrimodSDK.navigateToNative(
      'ProfileScreen',
      {
        userId: 123,
        title: 'User Profile',
      },
      false,
    );
  };

  const handleNavigateToReact = () => {
    RNBrimodSDK.navigateToReact('SecondApp', 'main', {
      initialRoute: 'Home',
      data: { message: 'Hello from first app' },
    });
  };

  const handleSendDataToNative = () => {
    RNBrimodSDK.sendDataToNative('updateUserPrefs', {
      theme: 'dark',
      notifications: true,
    });
  };

  // Component JSX...
};
```

### API Reference

#### Methods

**selectTabBarItem(index: number): Promise<string>**

- Selects a tab bar item by index
- Returns a promise with the result

**requestApiCall(apiName: string, payload?: Record<string, any>): Promise<string>**

- Makes an API call through the native layer
- Returns a promise with the API response

**navigateToNative(name: string, params?: Record<string, any>, isRnDismissed?: boolean): void**

- Navigates to a native screen
- `name`: Screen identifier
- `params`: Optional parameters to pass
- `isRnDismissed`: Whether to dismiss the RN view

**navigateToReact(appName: string, bundleName?: string, params?: Record<string, any>): void**

- Navigates to a React Native screen/bundle
- `appName`: Name of the React Native app
- `bundleName`: Optional bundle name
- `params`: Optional parameters to pass

**sendDataToNative(name: string, data: Record<string, any>): void**

- Sends data to the native layer
- `name`: Identifier for the data type
- `data`: The data to send

#### Event Listeners

**addListener(eventType: 'sendDataToReact' | 'sendDataToNative', listener: (data: any) => void)**

- Adds an event listener for data from native
- Returns a subscription object with `remove()` method

**removeAllListeners(eventType?: 'sendDataToReact' | 'sendDataToNative'): void**

- Removes all listeners for the specified event type (or all if no type specified)

---

## iOS Native Implementation

### Setting Up the Delegate

In your iOS app, you need to implement the `RNBrimodSDKProtocol` and set the delegate.

#### Step 1: Create a Delegate Class

```swift
import UIKit
import RNBrimodSDK

class BrimodSDKManager: NSObject, RNBrimodSDKProtocol {

    static let shared = BrimodSDKManager()

    private override init() {
        super.init()
    }

    // MARK: - RNBrimodSDKProtocol Implementation

    func selectTabBarItem(
        _ index: NSNumber,
        onSuccess: @escaping (String) -> Void,
        onError: @escaping (String, String, Error) -> Void
    ) {
        DispatchQueue.main.async {
            // Get reference to your tab bar controller
            guard let tabBarController = self.getTabBarController() else {
                let error = NSError(domain: "BrimodSDK", code: 404, userInfo: [NSLocalizedDescriptionKey: "Tab bar controller not found"])
                onError("TAB_BAR_NOT_FOUND", "Tab bar controller not found", error)
                return
            }

            let tabIndex = index.intValue
            if tabIndex >= 0 && tabIndex < tabBarController.viewControllers?.count ?? 0 {
                tabBarController.selectedIndex = tabIndex
                onSuccess("Tab selected successfully")
            } else {
                let error = NSError(domain: "BrimodSDK", code: 400, userInfo: [NSLocalizedDescriptionKey: "Invalid tab index"])
                onError("INVALID_INDEX", "Invalid tab index", error)
            }
        }
    }

    func requestApiCall(
        _ apiName: String,
        payload: [String: Any]?,
        onSuccess: @escaping (String) -> Void,
        onError: @escaping (String, String, Error) -> Void
    ) {
        // Implement your API call logic here
        switch apiName {
        case "getUserData":
            // Example API call
            APIManager.shared.getUserData(payload: payload) { result in
                switch result {
                case .success(let data):
                    do {
                        let jsonData = try JSONSerialization.data(withJSONObject: data)
                        let jsonString = String(data: jsonData, encoding: .utf8) ?? ""
                        onSuccess(jsonString)
                    } catch {
                        onError("JSON_ERROR", "Failed to serialize response", error)
                    }
                case .failure(let error):
                    onError("API_ERROR", "API call failed", error)
                }
            }
        default:
            let error = NSError(domain: "BrimodSDK", code: 404, userInfo: [NSLocalizedDescriptionKey: "Unknown API"])
            onError("UNKNOWN_API", "Unknown API: \(apiName)", error)
        }
    }

    func navigateToNative(
        _ name: String,
        params: [String: Any]?,
        isRnDismissed: NSNumber
    ) {
        DispatchQueue.main.async {
            switch name {
            case "ProfileScreen":
                let storyboard = UIStoryboard(name: "Main", bundle: nil)
                if let profileVC = storyboard.instantiateViewController(withIdentifier: "ProfileViewController") as? ProfileViewController {
                    profileVC.configure(with: params)
                    self.getCurrentViewController()?.navigationController?.pushViewController(profileVC, animated: true)
                }
            case "SettingsScreen":
                // Handle settings navigation
                break
            default:
                print("Unknown native screen: \(name)")
            }

            // Dismiss RN view if requested
            if isRnDismissed.boolValue {
                self.getCurrentViewController()?.dismiss(animated: true)
            }
        }
    }

    func navigateToReact(
        _ bundleName: String?,
        appName: String,
        params: [String: Any]?
    ) {
        DispatchQueue.main.async {
            // Create React Native view controller
            guard let bridge = self.getReactBridge() else {
                print("React bridge not available")
                return
            }

            let rootView = RCTRootView(
                bridge: bridge,
                moduleName: appName,
                initialProperties: params
            )

            let reactViewController = UIViewController()
            reactViewController.view = rootView

            self.getCurrentViewController()?.present(reactViewController, animated: true)
        }
    }

    func sendDataToReact(_ data: [String: Any]) {
        // Send data to React Native through event emitter
        RNBrimodSDK.shared.sendEvent(withName: "sendDataToReact", body: data)
    }

    func sendDataToNative(_ name: String, data: [String: Any]) {
        // Handle data received from React Native
        print("Received data from React Native - \(name): \(data)")

        switch name {
        case "updateUserPrefs":
            // Handle user preferences update
            UserDefaults.standard.set(data["theme"], forKey: "user_theme")
            UserDefaults.standard.set(data["notifications"], forKey: "notifications_enabled")
        case "logAnalytics":
            // Handle analytics logging
            // AnalyticsManager.shared.logEvent(data)
            break
        default:
            print("Unknown data type: \(name)")
        }
    }

    // MARK: - Helper Methods

    private func getTabBarController() -> UITabBarController? {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let window = windowScene.windows.first,
              let tabBarController = window.rootViewController as? UITabBarController else {
            return nil
        }
        return tabBarController
    }

    private func getCurrentViewController() -> UIViewController? {
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let window = windowScene.windows.first else {
            return nil
        }
        return window.rootViewController?.topMostViewController()
    }

    private func getReactBridge() -> RCTBridge? {
        // Return your React Native bridge instance
        // This should be the same bridge used in your AppDelegate
        return AppDelegate.shared.bridge
    }
}

// Extension to get top-most view controller
extension UIViewController {
    func topMostViewController() -> UIViewController {
        if let presented = presentedViewController {
            return presented.topMostViewController()
        }
        if let navigation = self as? UINavigationController {
            return navigation.visibleViewController?.topMostViewController() ?? navigation
        }
        if let tab = self as? UITabBarController {
            return tab.selectedViewController?.topMostViewController() ?? tab
        }
        return self
    }
}
```

#### Step 2: Initialize in AppDelegate

```swift
import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var bridge: RCTBridge?

    static var shared: AppDelegate {
        return UIApplication.shared.delegate as! AppDelegate
    }

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

        // Initialize React Native bridge
        bridge = RCTBridge(delegate: self, launchOptions: launchOptions)

        // Set up RNBrimodSDK delegate
        RNBrimodSDK.shared.setDelegate(BrimodSDKManager.shared)

        return true
    }
}

extension AppDelegate: RCTBridgeDelegate {
    func sourceURL(for bridge: RCTBridge!) -> URL! {
        #if DEBUG
        return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index", fallbackResource: nil)
        #else
        return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
        #endif
    }
}
```

#### Step 3: Example Usage in View Controllers

```swift
class MainViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Send data to React Native
        let userData = [
            "userId": 123,
            "username": "john_doe",
            "isLoggedIn": true
        ]
        BrimodSDKManager.shared.sendDataToReact(userData)
    }

    @IBAction func openReactNativeScreen(_ sender: UIButton) {
        BrimodSDKManager.shared.navigateToReact(
            nil,
            appName: "MyReactApp",
            params: [
                "initialRoute": "Profile",
                "userId": 123
            ]
        )
    }
}
```

### Additional Setup

#### API Manager Example

```swift
class APIManager {
    static let shared = APIManager()

    private init() {}

    func getUserData(payload: [String: Any]?, completion: @escaping (Result<[String: Any], Error>) -> Void) {
        // Implement your API call logic
        // This is just an example
        DispatchQueue.global().asyncAfter(deadline: .now() + 1.0) {
            let userData = [
                "id": payload?["userId"] ?? 0,
                "name": "John Doe",
                "email": "john@example.com"
            ]
            completion(.success(userData))
        }
    }
}
```

---

## Common Use Cases

### 1. Tab Navigation

```typescript
// React Native
const selectTab = async (index: number) => {
  try {
    await RNBrimodSDK.selectTabBarItem(index);
  } catch (error) {
    console.error('Failed to select tab:', error);
  }
};
```

### 2. API Calls

```typescript
// React Native
const fetchUserData = async () => {
  try {
    const response = await RNBrimodSDK.requestApiCall('getUserData', {
      userId: 123,
      includeProfile: true,
    });
    const userData = JSON.parse(response);
    setUser(userData);
  } catch (error) {
    console.error('API call failed:', error);
  }
};
```

### 3. Navigation Between Native and React Native

```typescript
// Navigate to native screen
RNBrimodSDK.navigateToNative(
  'ProfileScreen',
  {
    userId: 123,
    title: 'User Profile',
  },
  false,
);

// Navigate to another React Native bundle
RNBrimodSDK.navigateToReact('MySecondApp', 'main', {
  initialRoute: 'Dashboard',
});
```

### 4. Data Communication

```typescript
// Send data to native
RNBrimodSDK.sendDataToNative('updateSettings', {
  theme: 'dark',
  notifications: true,
});

// Listen for data from native
const subscription = RNBrimodSDK.addListener('sendDataToReact', data => {
  console.log('Received from native:', data);
});
```

---

## Troubleshooting

### Common Issues

1. **"No such module 'React'" error in Swift**: This is a common issue in React Native Swift development. To fix:

   - Make sure you've run `pod install` in the ios directory
   - Clean and rebuild your project (`Product > Clean Build Folder` in Xcode)
   - Check that your `Podfile` includes the correct React Native dependencies
   - Verify that the module map is correctly configured
   - Try adding this to your `Podfile` if needed:
     ```ruby
     use_frameworks! :linkage => :static
     ```

2. **Module not found**: Make sure you've run `pod install` on iOS
3. **Bridge not initialized**: Ensure the delegate is set in AppDelegate
4. **Events not received**: Check that event listeners are properly set up
5. **Navigation fails**: Verify that target screens exist and are properly configured

### iOS Setup Troubleshooting

If you're getting Swift compilation errors, try these steps:

1. **Clean and rebuild**:

   ```bash
   cd ios
   rm -rf build
   rm -rf ~/Library/Developer/Xcode/DerivedData
   pod install
   ```

2. **Check your Podfile**:

   ```ruby
   platform :ios, '13.0'
   use_frameworks! :linkage => :static

   target 'YourApp' do
     config = use_native_modules!
     use_react_native!

     pod 'RNBrimodSDK', :path => '../node_modules/react-native-brimod-sdk'
   end
   ```

3. **Verify React Native dependencies**:
   ```bash
   cd ios
   pod list | grep React
   ```

### Debug Tips

- Use `console.log` in React Native to debug method calls
- Use `print()` statements in Swift to debug delegate methods
- Check React Native logs: `npx react-native log-ios`
- Verify the native bridge is properly connected
- Use Xcode's debugger to step through Swift code
