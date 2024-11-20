// components/SearchBar.tsx

import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText }) => (
  <View
    className="
      flex-row
      items-center
    bg-gray-800
      border border-gray-700
      rounded-md
      mb-4
      px-3 py-2
    "
  >
    <Ionicons name="search" size={20} color="#A6A6A6" />
    <TextInput
      placeholder="Søk i lister"
      placeholderTextColor="#A6A6A6"
      value={value}
      onChangeText={onChangeText}
      style={{ flex: 1, color: 'white', marginLeft: 8 }}
      returnKeyType="search"
    />
  </View>
);


export default SearchBar;
