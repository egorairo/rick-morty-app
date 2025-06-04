import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Share,
} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useTheme} from '../context/ThemeContext';
import {CharactersStackParamList} from '../types';

type NavigationProp = StackNavigationProp<
  CharactersStackParamList,
  'CharacterDetails'
>;
type RouteProp_Details = RouteProp<
  CharactersStackParamList,
  'CharacterDetails'
>;

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
}

const CharacterDetailsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp_Details>();
  const theme = useTheme();
  const {character} = route.params;

  const [imageError, setImageError] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleShare = async (): Promise<void> => {
    try {
      await Share.share({
        message: `Check out ${character.name} from Rick and Morty!\n\nStatus: ${character.status}\nSpecies: ${character.species}`,
        title: character.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const InfoRow: React.FC<InfoRowProps> = ({icon, label, value}) => (
    <View style={[styles.infoRow, {borderBottomColor: theme.colors.border}]}>
      <View style={styles.infoLeft}>
        <Text style={[styles.infoIcon, {color: theme.colors.primary}]}>
          {icon}
        </Text>
        <Text style={[styles.label, {color: theme.colors.textSecondary}]}>
          {label}:
        </Text>
      </View>
      <Text
        style={[styles.value, {color: theme.colors.text}]}
        numberOfLines={2}>
        {value}
      </Text>
    </View>
  );

  const renderImagePlaceholder = () => (
    <View
      style={[
        styles.imagePlaceholder,
        {backgroundColor: theme.colors.surface},
      ]}>
      <Text
        style={[styles.placeholderText, {color: theme.colors.textSecondary}]}>
        {character.name?.charAt(0) || '?'}
      </Text>
    </View>
  );

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Header */}
      <View style={[styles.header, {backgroundColor: theme.colors.surface}]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={[styles.backIcon, {color: theme.colors.text}]}>←</Text>
        </TouchableOpacity>
        <Text
          style={[styles.headerTitle, {color: theme.colors.text}]}
          numberOfLines={1}>
          {character.name}
        </Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Text style={[styles.shareIcon, {color: theme.colors.text}]}>📤</Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={[styles.scrollView, {opacity: fadeAnim}]}
        showsVerticalScrollIndicator={false}>
        {/* Character Image */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            {!imageError ? (
              <Image
                source={{uri: character.image}}
                style={styles.characterImage}
                onError={() => setImageError(true)}
                resizeMode="cover"
              />
            ) : (
              renderImagePlaceholder()
            )}
          </View>

          <View style={styles.basicInfo}>
            <Text style={[styles.characterName, {color: theme.colors.text}]}>
              {character.name}
            </Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: theme.utils.getStatusColor(
                      character.status,
                    ),
                  },
                ]}
              />
              <Text
                style={[styles.status, {color: theme.colors.textSecondary}]}>
                {character.status} - {character.species}
              </Text>
            </View>
          </View>
        </View>

        {/* Details Section */}
        <View
          style={[
            styles.detailsSection,
            {backgroundColor: theme.colors.card},
            theme.shadows.medium,
          ]}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>
            Character Details
          </Text>

          <InfoRow icon="🆔" label="ID" value={character.id.toString()} />
          <InfoRow icon="👤" label="Gender" value={character.gender} />
          <InfoRow icon="🧬" label="Species" value={character.species} />
          <InfoRow icon="🏷️" label="Type" value={character.type || 'Unknown'} />
          <InfoRow icon="💚" label="Status" value={character.status} />
          <InfoRow icon="🏠" label="Origin" value={character.origin.name} />
          <InfoRow
            icon="📍"
            label="Last Location"
            value={character.location.name}
          />
          <InfoRow
            icon="📅"
            label="Created"
            value={formatDate(character.created)}
          />
          <InfoRow
            icon="📺"
            label="Episodes"
            value={`${character.episode.length} appearances`}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  shareButton: {
    padding: 8,
  },
  shareIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  basicInfo: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  characterName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  status: {
    fontSize: 16,
  },
  detailsSection: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 16,
    flex: 2,
    textAlign: 'right',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default CharacterDetailsScreen;
