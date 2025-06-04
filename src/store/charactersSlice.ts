import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {
  CharactersState,
  Character,
  ApiResponse,
  CharacterFilters,
} from '../types';
import {rickAndMortyAPI} from '../services/api';

interface FetchCharactersParams {
  page?: number;
  filters?: CharacterFilters;
}

export const fetchCharacters = createAsyncThunk<
  ApiResponse<Character>,
  FetchCharactersParams,
  {rejectValue: string}
>(
  'characters/fetchCharacters',
  async (
    {page = 1, filters = {status: '', species: ''}},
    {rejectWithValue},
  ) => {
    try {
      const response = await rickAndMortyAPI.getCharacters(
        page,
        filters.status || '',
        filters.species || '',
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  },
);

export const fetchCharacterById = createAsyncThunk<
  Character,
  number,
  {rejectValue: string}
>('characters/fetchCharacterById', async (id, {rejectWithValue}) => {
  try {
    const response = await rickAndMortyAPI.getCharacterById(id);
    return response;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Unknown error',
    );
  }
});

const initialState: CharactersState = {
  characters: [],
  selectedCharacter: null,
  offlineCharacters: [],
  loading: false,
  loadingMore: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  hasNextPage: true,
  filters: {
    status: '',
    species: '',
  },
};

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<CharacterFilters>>) => {
      state.filters = {...state.filters, ...action.payload};
      state.characters = [];
      state.currentPage = 1;
      state.hasNextPage = true;
      state.error = null;
    },
    clearCharacters: state => {
      state.characters = [];
      state.currentPage = 1;
      state.hasNextPage = true;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCharacters.pending, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.loading = true;
          state.loadingMore = false;
        } else {
          state.loading = false;
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;

        const {results, info} = action.payload;

        if (action.meta.arg.page === 1) {
          state.characters = results;
        } else {
          state.characters = [...state.characters, ...results];
        }

        state.hasNextPage = !!info.next;
        state.currentPage = action.meta.arg.page || 1;
        state.totalPages = info.pages;

        // Сохраняем последние 20 для офлайн режима
        state.offlineCharacters = state.characters.slice(-20);
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload || 'Failed to load characters';
      })
      .addCase(fetchCharacterById.fulfilled, (state, action) => {
        state.selectedCharacter = action.payload;
      });
  },
});

export const {setFilters, clearCharacters, clearError} =
  charactersSlice.actions;
export default charactersSlice.reducer;
