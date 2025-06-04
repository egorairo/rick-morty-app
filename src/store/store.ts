import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer, PersistConfig} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CharactersState, ThemeState} from '../types';
import charactersReducer from './charactersSlice';
import themeReducer from './themeSlice';

const charactersPersistConfig: PersistConfig<CharactersState> = {
  key: 'characters',
  storage: AsyncStorage,
  whitelist: ['offlineCharacters'],
};

const themePersistConfig: PersistConfig<ThemeState> = {
  key: 'theme',
  storage: AsyncStorage,
};

const persistedCharactersReducer = persistReducer(
  charactersPersistConfig,
  charactersReducer,
);
const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer);

export const store = configureStore({
  reducer: {
    characters: persistedCharactersReducer,
    theme: persistedThemeReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH',
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
