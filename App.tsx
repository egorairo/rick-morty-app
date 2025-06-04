import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

import {store, persistor} from './src/store/store';
import {ThemeProvider} from './src/context/ThemeContext';
import {NetworkProvider} from './src/context/NetworkContext';

import CharactersListScreen from './src/screens/CharactersListScreen';
import CharacterDetailsScreen from './src/screens/CharacterDetailsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import OfflineScreen from './src/screens/OfflineScreen';

import {
  RootStackParamList,
  MainTabParamList,
  CharactersStackParamList,
} from './src/types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createStackNavigator<CharactersStackParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

// Простой лоадер для PersistGate без зависимости от темы
const SimplePersistLoader: React.FC = () => (
  <View style={simpleLoaderStyles.container}>
    <ActivityIndicator size="large" color="#00b4d8" />
    <Text style={simpleLoaderStyles.text}>Initializing...</Text>
  </View>
);

const simpleLoaderStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#333333',
  },
});

function CharactersStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="CharactersList" component={CharactersListScreen} />
      <Stack.Screen
        name="CharacterDetails"
        component={CharacterDetailsScreen}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused: _focused, color, size}) => {
          const iconText = route.name === 'Main' ? '👥' : '⚙️';
          return <Text style={{fontSize: size * 0.8, color}}>{iconText}</Text>;
        },
        tabBarActiveTintColor: '#00b4d8',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen name="Main" component={CharactersStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<SimplePersistLoader />} persistor={persistor}>
        <ThemeProvider>
          <NetworkProvider>
            <NavigationContainer>
              <RootStack.Navigator screenOptions={{headerShown: false}}>
                <RootStack.Screen name="MainTabs" component={MainTabs} />
                <RootStack.Screen name="Offline" component={OfflineScreen} />
              </RootStack.Navigator>
            </NavigationContainer>
          </NetworkProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
