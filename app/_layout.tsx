// app/_layout.tsx

import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ListProvider } from '@/app/context/ListContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ListProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ListProvider>
    </GestureHandlerRootView>
  );
}
