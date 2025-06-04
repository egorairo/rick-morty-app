import React, {createContext, useContext, ReactNode} from 'react';
import {useSelector} from 'react-redux';
import {RootState, Theme, ThemeColors} from '../types';

const ThemeContext = createContext<Theme | undefined>(undefined);

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const LIGHT_COLORS: ThemeColors = {
  primary: '#00b4d8',
  background: '#ffffff',
  surface: '#f8f9fa',
  text: '#212529',
  textSecondary: '#6c757d',
  border: '#dee2e6',
  card: '#ffffff',
  success: '#198754',
  error: '#dc3545',
  statusAlive: '#198754',
  statusDead: '#dc3545',
  statusUnknown: '#6c757d',
  buttonText: '#ffffff',
};

const DARK_COLORS: ThemeColors = {
  primary: '#00b4d8',
  background: '#121212',
  surface: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#b3b3b3',
  border: '#404040',
  card: '#1e1e1e',
  success: '#20c997',
  error: '#dc3545',
  statusAlive: '#20c997',
  statusDead: '#dc3545',
  statusUnknown: '#6c757d',
  buttonText: '#ffffff',
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  const theme: Theme = {
    isDarkMode,
    colors: isDarkMode ? DARK_COLORS : LIGHT_COLORS,
    utils: {
      getStatusColor: (status: string): string => {
        const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
        switch (status?.toLowerCase()) {
          case 'alive':
            return colors.statusAlive;
          case 'dead':
            return colors.statusDead;
          default:
            return colors.statusUnknown;
        }
      },
    },
    shadows: {
      small: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
    },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
