// app/components/Home/SearchBar.tsx
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, FontSizes } from '../../styles/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText }) => (
  <View style={styles.container}>
    <Ionicons name="search" size={20} color={Colors.gray[100]} />
    <TextInput
      placeholder="Søk i lister"
      placeholderTextColor={Colors.gray[100]}
      value={value}
      onChangeText={onChangeText}
      style={styles.input}
      returnKeyType="search"
      accessible={true}
      accessibilityLabel="Søk i lister"
      accessibilityHint="Søker gjennom dine lister"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // flex-row
    alignItems: 'center', // items-center
    backgroundColor: Colors.gray[800], // bg-gray-800
    borderWidth: 1, // border
    borderColor: Colors.gray[700], // border-gray-700
    borderRadius: BorderRadius.medium, // rounded-md
    marginBottom: Spacing.medium, // mb-4
    paddingHorizontal: Spacing.medium, // px-3
    paddingVertical: Spacing.small, // py-2
  },
  input: {
    flex: 1,
    color: Colors.text, // text-white
    marginLeft: Spacing.small, // marginLeft: 8
    fontSize: FontSizes.medium, // text-base
  },
});

export default SearchBar;
