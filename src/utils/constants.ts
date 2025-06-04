// API константы
export const API_BASE_URL = 'https://rickandmortyapi.com/api';

// Статусы персонажей
export const CHARACTER_STATUS = {
  ALIVE: 'Alive',
  DEAD: 'Dead',
  UNKNOWN: 'unknown',
};

// Пол персонажей
export const CHARACTER_GENDER = {
  MALE: 'Male',
  FEMALE: 'Female',
  GENDERLESS: 'Genderless',
  UNKNOWN: 'unknown',
};

// Цвета темы
export const COLORS = {
  LIGHT: {
    PRIMARY: '#FFFFFF',
    SECONDARY: '#F5F5F5',
    TEXT: '#000000',
    ACCENT: '#00D4AA',
  },
  DARK: {
    PRIMARY: '#1E1E1E',
    SECONDARY: '#2D2D2D',
    TEXT: '#FFFFFF',
    ACCENT: '#00D4AA',
  },
};

// Размеры
export const SIZES = {
  SMALL: 8,
  MEDIUM: 16,
  LARGE: 24,
  EXTRA_LARGE: 32,
};

// Названия экранов для навигации
export const SCREEN_NAMES = {
  CHARACTERS_LIST: 'CharactersList',
  CHARACTER_DETAILS: 'CharacterDetails',
  SETTINGS: 'Settings',
  OFFLINE: 'Offline',
};
