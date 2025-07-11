import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// In a real project, this would be:
// import RNBrimodSDK from 'react-native-brimod-sdk';
// For this example, we'll use a mock import
import RNBrimodSDK from '../src/index';

interface User {
  id: number;
  name: string;
  email: string;
}

const ExampleComponent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [receivedData, setReceivedData] = useState<any>(null);
  const [apiPayload, setApiPayload] = useState('{"userId": 123}');

  useEffect(() => {
    // Set up event listeners
    const subscription1 = RNBrimodSDK.addListener(
      'sendDataToReact',
      (data: any) => {
        console.log('📱 Data received from native:', data);
        setReceivedData(data);
        Alert.alert('Data from Native', JSON.stringify(data, null, 2));
      },
    );

    const subscription2 = RNBrimodSDK.addListener(
      'sendDataToNative',
      (data: any) => {
        console.log('📤 Data sent to native:', data);
      },
    );

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  const handleSelectTab = async (tabIndex: number) => {
    try {
      const result = await RNBrimodSDK.selectTabBarItem(tabIndex);
      Alert.alert('Success', `Tab ${tabIndex} selected: ${result}`);
    } catch (error) {
      Alert.alert('Error', `Failed to select tab: ${error}`);
    }
  };

  const handleApiCall = async () => {
    try {
      let payload;
      try {
        payload = JSON.parse(apiPayload);
      } catch (e) {
        Alert.alert('Error', 'Invalid JSON payload');
        return;
      }

      const response = await RNBrimodSDK.requestApiCall('getUserData', payload);
      const userData = JSON.parse(response);
      setUser(userData);
      Alert.alert('API Success', `User data loaded: ${userData.name}`);
    } catch (error) {
      Alert.alert('API Error', `Failed to fetch user data: ${error}`);
    }
  };

  const handleNavigateToNative = () => {
    RNBrimodSDK.navigateToNative(
      'ProfileScreen',
      {
        userId: 123,
        title: 'User Profile',
        animated: true,
      },
      false,
    );
  };

  const handleNavigateToReact = () => {
    RNBrimodSDK.navigateToReact('MySecondApp', 'main', {
      initialRoute: 'Dashboard',
      userData: user,
    });
  };

  const handleSendDataToNative = () => {
    const dataToSend = {
      theme: 'dark',
      notifications: true,
      timestamp: new Date().toISOString(),
    };

    RNBrimodSDK.sendDataToNative('updateUserPrefs', dataToSend);
    Alert.alert('Data Sent', 'User preferences sent to native layer');
  };

  const handleSendAnalytics = () => {
    const analyticsData = {
      event: 'button_clicked',
      screen: 'example_screen',
      timestamp: new Date().toISOString(),
      userId: user?.id || 'anonymous',
    };

    RNBrimodSDK.sendDataToNative('logAnalytics', analyticsData);
    Alert.alert('Analytics Sent', 'Analytics data sent to native layer');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>RNBrimodSDK Example</Text>

      {/* Tab Navigation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tab Navigation</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSelectTab(0)}>
            <Text style={styles.buttonText}>Tab 0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSelectTab(1)}>
            <Text style={styles.buttonText}>Tab 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSelectTab(2)}>
            <Text style={styles.buttonText}>Tab 2</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* API Calls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Calls</Text>
        <TextInput
          style={styles.textInput}
          value={apiPayload}
          onChangeText={setApiPayload}
          placeholder="API Payload (JSON)"
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleApiCall}>
          <Text style={styles.buttonText}>Fetch User Data</Text>
        </TouchableOpacity>

        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userText}>👤 User: {user.name}</Text>
            <Text style={styles.userText}>✉️ Email: {user.email}</Text>
          </View>
        )}
      </View>

      {/* Navigation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Navigation</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNavigateToNative}>
          <Text style={styles.buttonText}>Navigate to Native Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleNavigateToReact}>
          <Text style={styles.buttonText}>Navigate to React Native</Text>
        </TouchableOpacity>
      </View>

      {/* Data Communication */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Communication</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSendDataToNative}>
          <Text style={styles.buttonText}>Send User Preferences</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSendAnalytics}>
          <Text style={styles.buttonText}>Send Analytics</Text>
        </TouchableOpacity>
      </View>

      {/* Received Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Received Data</Text>
        {receivedData ? (
          <View style={styles.dataContainer}>
            <Text style={styles.dataText}>
              {JSON.stringify(receivedData, null, 2)}
            </Text>
          </View>
        ) : (
          <Text style={styles.placeholderText}>
            No data received from native yet
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    minHeight: 60,
    backgroundColor: '#f9f9f9',
    fontFamily: 'monospace',
  },
  userInfo: {
    backgroundColor: '#e8f5e8',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  userText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  dataContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  dataText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333',
  },
  placeholderText: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ExampleComponent;
