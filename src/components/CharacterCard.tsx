import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {CharacterCardProps} from '../types';

const CharacterCard: React.FC<CharacterCardProps> = ({character, onPress}) => {
  const theme = useTheme();
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (): void => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (): void => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getStatusColor = (status: string): string =>
    theme.utils.getStatusColor(status);

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
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          transform: [{scale: scaleAnim}],
        },
        theme.shadows.medium,
      ]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress(character)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.touchable}>
        <View style={styles.imageContainer}>
          {!imageError ? (
            <Image
              source={{uri: character.image}}
              style={[styles.image, {opacity: imageLoaded ? 1 : 0}]}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              resizeMode="cover"
            />
          ) : (
            renderImagePlaceholder()
          )}

          {!imageLoaded && !imageError && (
            <View style={styles.loadingPlaceholder}>
              <Text
                style={[
                  styles.loadingText,
                  {color: theme.colors.textSecondary},
                ]}>
                ...
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text
            style={[styles.name, {color: theme.colors.text}]}
            numberOfLines={1}>
            {character.name}
          </Text>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                {backgroundColor: getStatusColor(character.status)},
              ]}
            />
            <Text
              style={[styles.status, {color: theme.colors.textSecondary}]}
              numberOfLines={1}>
              {character.status} - {character.species}
            </Text>
          </View>

          <View style={styles.locationSection}>
            <Text
              style={[
                styles.locationLabel,
                {color: theme.colors.textSecondary},
              ]}>
              Last known location:
            </Text>
            <Text
              style={[styles.locationName, {color: theme.colors.text}]}
              numberOfLines={1}>
              {character.location.name}
            </Text>
          </View>

          <View style={styles.locationSection}>
            <Text
              style={[
                styles.locationLabel,
                {color: theme.colors.textSecondary},
              ]}>
              First seen in:
            </Text>
            <Text
              style={[styles.locationName, {color: theme.colors.text}]}
              numberOfLines={1}>
              {character.origin.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageContainer: {
    width: 100,
    height: 120,
  },
  image: {
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
    fontSize: 32,
    fontWeight: 'bold',
  },
  loadingPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  loadingText: {
    fontSize: 24,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'flex-start',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  status: {
    fontSize: 14,
    flex: 1,
  },
  locationSection: {
    marginBottom: 4,
  },
  locationLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CharacterCard;
