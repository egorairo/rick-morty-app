import React, {useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../context/ThemeContext';
import {useNetwork} from '../context/NetworkContext';
import {RootStackParamList} from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Offline'>;

const OfflineScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const {checkConnection} = useNetwork();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, bounceAnim]);

  const handleTryAgain = async (): Promise<void> => {
    const isConnected = await checkConnection();
    if (isConnected) {
      navigation.goBack();
    }
  };

  const handleViewCached = (): void => {
    navigation.navigate('MainTabs');
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{scale: bounceAnim}],
          },
        ]}>
        <View
          style={[
            styles.iconContainer,
            {backgroundColor: theme.colors.surface},
          ]}>
          <Icon name="wifi-off" size={80} color={theme.colors.textSecondary} />
        </View>

        <Text style={[styles.title, {color: theme.colors.text}]}>
          No Internet Connection
        </Text>

        <Text style={[styles.message, {color: theme.colors.textSecondary}]}>
          Please check your internet connection and try again
        </Text>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: theme.colors.primary}]}
          onPress={handleTryAgain}
          activeOpacity={0.8}>
          <Icon name="refresh" size={24} color={theme.colors.buttonText} />
          <Text style={[styles.buttonText, {color: theme.colors.buttonText}]}>
            Try Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, {borderColor: theme.colors.border}]}
          onPress={handleViewCached}
          activeOpacity={0.8}>
          <Text
            style={[styles.secondaryButtonText, {color: theme.colors.text}]}>
            View Cached Characters
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OfflineScreen;
