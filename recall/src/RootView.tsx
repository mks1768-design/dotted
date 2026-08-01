import React from 'react';
import { View } from 'react-native';
import { ScreenTransition } from './components/ScreenTransition';
import { isTabScreen, TabBar } from './components/TabBar';
import { useStudy } from './state/StudyContext';
import { CardEditorScreen } from './screens/CardEditorScreen';
import { DeckScreen } from './screens/DeckScreen';
import { DecksScreen } from './screens/DecksScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { StreakScreen } from './screens/StreakScreen';
import { StudyScreen } from './screens/StudyScreen';

export function RootView() {
  const { state } = useStudy();

  if (!state.hydrated) return null;

  const screen = (() => {
    switch (state.screen) {
      case 'home':
        return <HomeScreen />;
      case 'streak':
        return <StreakScreen />;
      case 'decks':
        return <DecksScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'deck':
        return <DeckScreen />;
      case 'cardEditor':
        return <CardEditorScreen />;
      case 'study':
        return <StudyScreen />;
      case 'results':
        return <ResultsScreen />;
      default:
        return <HomeScreen />;
    }
  })();

  if (isTabScreen(state.screen)) {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <ScreenTransition transitionKey={state.screen}>{screen}</ScreenTransition>
        </View>
        <TabBar />
      </View>
    );
  }

  return <ScreenTransition transitionKey={state.screen}>{screen}</ScreenTransition>;
}
