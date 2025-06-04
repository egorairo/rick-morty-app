import {Character, ApiResponse} from '../types';

const BASE_URL = 'https://rickandmortyapi.com/api';
const REQUEST_TIMEOUT = 10000;

const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - check your internet connection');
    }
    throw error;
  }
};

export const rickAndMortyAPI = {
  getCharacters: async (
    page: number = 1,
    status: string = '',
    species: string = '',
  ): Promise<ApiResponse<Character>> => {
    try {
      let url = `${BASE_URL}/character?page=${page}`;

      if (status && status.trim() !== '') {
        url += `&status=${encodeURIComponent(status.toLowerCase())}`;
      }

      if (species && species.trim() !== '') {
        url += `&species=${encodeURIComponent(species.toLowerCase())}`;
      }

      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        if (response.status === 404) {
          return {
            results: [],
            info: {count: 0, pages: 0, next: null, prev: null},
          };
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data: ApiResponse<Character> = await response.json();

      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Invalid API response structure');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('timeout') ||
          error.message.includes('Failed to fetch')
        ) {
          throw new Error(
            'Network error. Please check your internet connection.',
          );
        }
        throw new Error(error.message);
      }
      throw new Error('Failed to load characters');
    }
  },

  getCharacterById: async (id: number): Promise<Character> => {
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('Invalid character ID');
      }

      const url = `${BASE_URL}/character/${id}`;
      const response = await fetchWithTimeout(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Character not found');
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data: Character = await response.json();

      if (!data.id || !data.name) {
        throw new Error('Invalid character data received');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to load character details');
    }
  },
};
