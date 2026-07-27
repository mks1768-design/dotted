import React from 'react';
import { EditorScreen } from './screens/EditorScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ImproveScreen } from './screens/ImproveScreen';
import { NotesListScreen } from './screens/NotesListScreen';
import { ScanScreen } from './screens/ScanScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SplashScreen } from './screens/SplashScreen';
import { useNotes } from './state/NotesContext';

// Flat navigation model, matching the design handoff: every sub-screen's
// back-chevron returns to Home rather than popping a history stack, and the
// same switchWrite/switchImprove/switchScan actions drive both the home rows
// and each screen's in-place segmented switcher.
export function RootView() {
  const { state } = useNotes();

  switch (state.screen) {
    case 'home':
      return <HomeScreen />;
    case 'library':
      return <NotesListScreen />;
    case 'editor':
      return <EditorScreen />;
    case 'ai':
      return <ImproveScreen />;
    case 'camera':
      return <ScanScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'splash':
    default:
      return <SplashScreen />;
  }
}
