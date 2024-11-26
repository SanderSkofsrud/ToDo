import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ListProvider } from '@/app/context/ListContext';
import { ThemeProvider, useTheme } from '@/app/context/ThemeContext';
import { StyleSheet, ActivityIndicator, View } from 'react-native';

/**
 * Inner component that consumes the ThemeContext to determine if the theme is loaded.
 */
function RootLayoutInner() {
  const { isThemeLoaded } = useTheme();

  if (!isThemeLoaded) {
    return (
      <GestureHandlerRootView style={styles.gestureHandler}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      <ListProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ListProvider>
    </GestureHandlerRootView>
  );
}

/**
 * Root layout component that wraps the application with necessary providers.
 * Includes gesture handling, list management, and theming.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      <ThemeProvider>
        <RootLayoutInner />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
