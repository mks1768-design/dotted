import React from 'react';
import { ScreenTransition } from './components/ScreenTransition';
import { AiSettingsScreen } from './screens/AiSettingsScreen';
import { BackupScreen } from './screens/BackupScreen';
import { EditorScreen } from './screens/EditorScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ImproveScreen } from './screens/ImproveScreen';
import { NotesListScreen } from './screens/NotesListScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { PaperPickerScreen } from './screens/PaperPickerScreen';
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

  if (state.screen === 'splash') {
    // Splash has its own carefully-timed entrance (dot drop + wordmark fade) —
    // stacking the generic screen-swap fade on top of it would just be noise.
    return <SplashScreen />;
  }

  const screen = (() => {
    switch (state.screen) {
      case 'onboarding':
        return <OnboardingScreen />;
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
      case 'settingsAi':
        return <AiSettingsScreen />;
      case 'settingsBackup':
        return <BackupScreen />;
      case 'paperPicker':
        return <PaperPickerScreen />;
      default:
        return <HomeScreen />;
    }
  })();

  return <ScreenTransition transitionKey={state.screen}>{screen}</ScreenTransition>;
}
