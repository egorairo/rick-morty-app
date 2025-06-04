// API Types
export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: Location;
  location: Location;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface Location {
  name: string;
  url: string;
}

export interface ApiResponse<T> {
  info: ApiInfo;
  results: T[];
}

export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

// Redux Types
export interface CharactersState {
  characters: Character[];
  selectedCharacter: Character | null;
  offlineCharacters: Character[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  filters: CharacterFilters;
}

export interface CharacterFilters {
  status: string;
  species: string;
}

export interface ThemeState {
  isDarkMode: boolean;
}

export interface RootState {
  characters: CharactersState;
  theme: ThemeState;
}

export type AppDispatch = any;

// Component Props Types
export interface CharacterCardProps {
  character: Character;
  onPress: (character: Character) => void;
}

export interface CustomLoaderProps {
  text?: string;
  showText?: boolean;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDropdownProps {
  title: string;
  options: FilterOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

// Navigation Types
export type RootStackParamList = {
  MainTabs: undefined;
  Offline: undefined;
};

export type MainTabParamList = {
  Main: undefined;
  Settings: undefined;
};

export type CharactersStackParamList = {
  CharactersList: undefined;
  CharacterDetails: {character: Character};
};

// Context Types
export interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  success: string;
  error: string;
  statusAlive: string;
  statusDead: string;
  statusUnknown: string;
  buttonText: string;
}

export interface Theme {
  isDarkMode: boolean;
  colors: ThemeColors;
  utils: {
    getStatusColor: (status: string) => string;
  };
  shadows: {
    small: object;
    medium: object;
  };
}

export interface NetworkContextType {
  isConnected: boolean;
  checkConnection: () => Promise<boolean>;
}
