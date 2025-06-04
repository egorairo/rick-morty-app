import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Alert,
  ListRenderItem,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootState, AppDispatch} from '../store/store';
import {
  fetchCharacters,
  clearCharacters,
  setFilters,
} from '../store/charactersSlice';
import {useTheme} from '../context/ThemeContext';
import {useNetwork} from '../context/NetworkContext';

import CharacterCard from '../components/CharacterCard';
import CustomLoader from '../components/CustomLoader';
import FilterDropdown, {FILTER_OPTIONS} from '../components/FilterDropdown';

import {Character, CharactersStackParamList} from '../types';

type CharactersListScreenNavigationProp = StackNavigationProp<
  CharactersStackParamList,
  'CharactersList'
>;

const CharactersListScreen: React.FC = () => {
  const theme = useTheme();
  const {isConnected} = useNetwork();
  const navigation = useNavigation<CharactersListScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  const {characters, loading, error, hasNextPage, currentPage, filters} =
    useSelector((state: RootState) => state.characters);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (isConnected && characters.length === 0) {
      dispatch(fetchCharacters({page: 1, filters}));
    }
  }, [dispatch, isConnected, characters.length, filters]);

  const handleCharacterPress = useCallback(
    (character: Character): void => {
      navigation.navigate('CharacterDetails', {character});
    },
    [navigation],
  );

  const handleLoadMore = useCallback((): void => {
    if (hasNextPage && !loading && isConnected) {
      dispatch(fetchCharacters({page: currentPage + 1, filters}));
    }
  }, [hasNextPage, loading, isConnected, currentPage, filters, dispatch]);

  const handleRefresh = useCallback(async (): Promise<void> => {
    if (!isConnected) {
      Alert.alert(
        'No Internet Connection',
        'Please check your internet connection and try again.',
      );
      return;
    }

    setRefreshing(true);
    dispatch(clearCharacters());
    try {
      await dispatch(fetchCharacters({page: 1, filters})).unwrap();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, filters, isConnected]);

  const handleFilterChange = useCallback(
    (filterType: 'status' | 'species', value: string): void => {
      const newFilters = {...filters, [filterType]: value};
      dispatch(setFilters(newFilters));
      dispatch(clearCharacters());
      dispatch(fetchCharacters({page: 1, filters: newFilters}));
    },
    [dispatch, filters],
  );

  const renderCharacter: ListRenderItem<Character> = useCallback(
    ({item}) => (
      <CharacterCard
        character={item}
        onPress={() => handleCharacterPress(item)}
      />
    ),
    [handleCharacterPress],
  );

  const renderFooter = (): React.ReactElement | null => {
    if (!loading || refreshing) return null;
    return (
      <View style={styles.footer}>
        <CustomLoader text="Loading more..." showText={false} />
      </View>
    );
  };

  const renderEmptyState = (): React.ReactElement => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyIcon, {color: theme.colors.textSecondary}]}>
        🤷‍♂️
      </Text>
      <Text style={[styles.emptyTitle, {color: theme.colors.text}]}>
        No Characters Found
      </Text>
      <Text style={[styles.emptySubtitle, {color: theme.colors.textSecondary}]}>
        Pull down to refresh
      </Text>
    </View>
  );

  if (loading && characters.length === 0 && !refreshing) {
    return (
      <View
        style={[
          styles.loadingContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <CustomLoader />
      </View>
    );
  }

  if (error && characters.length === 0) {
    return (
      <View
        style={[
          styles.errorContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <Text style={[styles.errorIcon, {color: theme.colors.error}]}>⚠️</Text>
        <Text style={[styles.errorTitle, {color: theme.colors.text}]}>
          Oops! Something went wrong
        </Text>
        <Text
          style={[styles.errorMessage, {color: theme.colors.textSecondary}]}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          Rick and Morty
        </Text>
      </View>

      <View style={styles.filtersContainer}>
        <FilterDropdown
          title="Status"
          options={FILTER_OPTIONS.STATUS}
          selectedValue={filters.status}
          onSelect={(value: string) => handleFilterChange('status', value)}
        />
        <FilterDropdown
          title="Species"
          options={FILTER_OPTIONS.SPECIES}
          selectedValue={filters.species}
          onSelect={(value: string) => handleFilterChange('species', value)}
        />
      </View>

      {!isConnected && (
        <View
          style={[styles.offlineNotice, {backgroundColor: theme.colors.error}]}>
          <Text style={[styles.offlineText, {color: theme.colors.buttonText}]}>
            📵 Offline Mode - Showing cached data
          </Text>
        </View>
      )}

      <FlatList
        data={characters}
        renderItem={renderCharacter}
        keyExtractor={(item: Character) => item.id.toString()}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          characters.length === 0 ? styles.emptyContainer : undefined
        }
      />
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  offlineNotice: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  offlineText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default CharactersListScreen;
