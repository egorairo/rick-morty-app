import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  ListRenderItem,
} from 'react-native';
import {useTheme} from '../context/ThemeContext';
import {FilterDropdownProps, FilterOption} from '../types';

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  title,
  options = [],
  selectedValue,
  onSelect,
}) => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const openModal = (): void => {
    setIsVisible(true);
  };

  const closeModal = (): void => {
    setIsVisible(false);
  };

  const handleSelect = (value: string): void => {
    onSelect && onSelect(value);
    closeModal();
  };

  const getDisplayText = (): string => {
    if (!selectedValue) {
      return `Select ${title}`;
    }
    const selectedOption = options.find(
      option => option.value === selectedValue,
    );
    return selectedOption ? selectedOption.label : `Select ${title}`;
  };

  const renderOption: ListRenderItem<FilterOption> = ({item}) => {
    const isSelected = item.value === selectedValue;

    return (
      <TouchableOpacity
        style={[
          styles.option,
          {
            backgroundColor: isSelected ? theme.colors.primary : 'transparent',
            borderBottomColor: theme.colors.border,
          },
        ]}
        onPress={() => handleSelect(item.value)}>
        <Text
          style={[
            styles.optionText,
            {color: isSelected ? theme.colors.buttonText : theme.colors.text},
          ]}>
          {item.label}
        </Text>
        {isSelected && (
          <Text style={[styles.checkmark, {color: theme.colors.buttonText}]}>
            ✓
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.dropdown,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={openModal}>
        <View style={styles.textContainer}>
          <Text style={[styles.titleText, {color: theme.colors.textSecondary}]}>
            {title}
          </Text>
          <Text
            style={[styles.valueText, {color: theme.colors.text}]}
            numberOfLines={1}>
            {getDisplayText()}
          </Text>
        </View>
        <Text style={[styles.arrow, {color: theme.colors.textSecondary}]}>
          ▼
        </Text>
      </TouchableOpacity>

      <Modal visible={isVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modal,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                ]}>
                <View
                  style={[
                    styles.modalHeader,
                    {borderBottomColor: theme.colors.border},
                  ]}>
                  <Text style={[styles.modalTitle, {color: theme.colors.text}]}>
                    {title}
                  </Text>
                  <TouchableOpacity onPress={closeModal}>
                    <Text
                      style={[
                        styles.closeButton,
                        {color: theme.colors.textSecondary},
                      ]}>
                      ✕
                    </Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={options}
                  renderItem={renderOption}
                  keyExtractor={item => item.value.toString()}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 4,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 56,
  },
  textContainer: {
    flex: 1,
  },
  titleText: {
    fontSize: 12,
    marginBottom: 2,
  },
  valueText: {
    fontSize: 14,
  },
  arrow: {
    fontSize: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '85%',
    maxHeight: '60%',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Предустановленные опции фильтров
export const FILTER_OPTIONS = {
  STATUS: [
    {label: 'All Statuses', value: ''},
    {label: 'Alive', value: 'alive'},
    {label: 'Dead', value: 'dead'},
    {label: 'Unknown', value: 'unknown'},
  ] as FilterOption[],
  SPECIES: [
    {label: 'All Species', value: ''},
    {label: 'Human', value: 'human'},
    {label: 'Alien', value: 'alien'},
  ] as FilterOption[],
};

export default FilterDropdown;
