import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTheme} from '../context/ThemeContext';
import {toggleTheme} from '../store/themeSlice';

const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleThemeToggle = (): void => {
    dispatch(toggleTheme());
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>
          Settings
        </Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={[
            styles.settingItem,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
            theme.shadows.small,
          ]}
          onPress={handleThemeToggle}>
          <View style={styles.settingLeft}>
            <Text style={[styles.settingIcon, {color: theme.colors.primary}]}>
              {theme.isDarkMode ? '🌙' : '☀️'}
            </Text>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, {color: theme.colors.text}]}>
                Theme
              </Text>
              <Text
                style={[
                  styles.settingSubtitle,
                  {color: theme.colors.textSecondary},
                ]}>
                {theme.isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
          </View>
          <Text style={[styles.chevron, {color: theme.colors.textSecondary}]}>
            ›
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.settingItem,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
            theme.shadows.small,
          ]}>
          <View style={styles.settingLeft}>
            <Text style={[styles.settingIcon, {color: theme.colors.primary}]}>
              ℹ️
            </Text>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingTitle, {color: theme.colors.text}]}>
                About
              </Text>
              <Text
                style={[
                  styles.settingSubtitle,
                  {color: theme.colors.textSecondary},
                ]}>
                Rick and Morty App v1.0.0
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
