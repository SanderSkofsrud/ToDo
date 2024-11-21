import React, { useEffect, useState, createContext, useContext } from 'react';
import { Appearance, ColorSchemeName, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ListProvider } from '@/app/context/ListContext';
import { ThemeProvider, useTheme } from '@/app/context/ThemeContext';

/**
 * Root layout component that wraps the application with necessary providers.
 * Includes gesture handling, list management, and theming.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      <ThemeProvider>
        <ListProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ListProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
});
