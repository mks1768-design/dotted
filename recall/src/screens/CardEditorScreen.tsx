import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton, SecondaryButton } from '../components/ui';
import { useStudy } from '../state/StudyContext';
import { colors, fontSizes, radii, spacing } from '../theme/tokens';

export function CardEditorScreen() {
  const { state, setDraftFront, setDraftBack, saveCard, cancelCardEdit } = useStudy();

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.title}>{state.editingCardId ? 'Edit card' : 'New card'}</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Front</Text>
            <TextInput
              value={state.draftFront}
              onChangeText={setDraftFront}
              placeholder="What you'll see first"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              multiline
              autoFocus
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Back</Text>
            <TextInput
              value={state.draftBack}
              onChangeText={setDraftBack}
              placeholder="The answer"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              multiline
            />
          </View>
        </View>

        <View style={styles.footer}>
          <SecondaryButton label="Cancel" onPress={cancelCardEdit} />
          <View style={{ flex: 1 }}>
            <PrimaryButton label="Save card" onPress={saveCard} disabled={!state.draftFront.trim() || !state.draftBack.trim()} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, padding: spacing.screenPaddingH, paddingTop: spacing.topPadding, gap: spacing.gapStacked },
  title: { fontSize: fontSizes.screenTitle, fontWeight: '800', color: colors.text },
  field: { gap: 6 },
  label: { fontSize: fontSizes.smallLabel, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase' },
  input: {
    minHeight: 80,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.gapTight,
    fontSize: fontSizes.body,
    color: colors.text,
    textAlignVertical: 'top',
  },
  footer: { flexDirection: 'row', gap: spacing.gapTight, padding: spacing.screenPaddingH },
});
