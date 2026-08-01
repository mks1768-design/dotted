import React from 'react';
import { ScreenTransition } from './components/ScreenTransition';
import { useStudy } from './state/StudyContext';
import { CardEditorScreen } from './screens/CardEditorScreen';
import { DeckScreen } from './screens/DeckScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { StudyScreen } from './screens/StudyScreen';

export function RootView() {
  const { state } = useStudy();

  if (!state.hydrated) return null;

  const screen = (() => {
    switch (state.screen) {
      case 'home':
        return <HomeScreen />;
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

  return <ScreenTransition transitionKey={state.screen}>{screen}</ScreenTransition>;
}
