import { CormorantGaramond_600SemiBold } from '@expo-google-fonts/cormorant-garamond';
import { Lora_400Regular } from '@expo-google-fonts/lora';
import { useFonts } from 'expo-font';
import * as SplashScreenModule from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootView } from './src/RootView';
import { NotesProvider } from './src/state/NotesContext';
import { colors } from './src/theme/tokens';

SplashScreenModule.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_600SemiBold,
    Lora_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreenModule.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreenModule.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.bg }} onLayout={onLayoutRootView}>
        <NotesProvider>
          <RootView />
        </NotesProvider>
        <StatusBar style="dark" />
      </View>
    </SafeAreaProvider>
  );
}
