// app/_layout.tsx

import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ListProvider } from '@/app/context/ListContext';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      <ListProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ListProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
});
