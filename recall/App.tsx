import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootView } from './src/RootView';
import { StudyProvider } from './src/state/StudyContext';
import { colors } from './src/theme/tokens';

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StudyProvider>
          <RootView />
        </StudyProvider>
        <StatusBar style="dark" />
      </View>
    </SafeAreaProvider>
  );
}
