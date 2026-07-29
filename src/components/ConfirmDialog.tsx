import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, shadows } from '../theme/tokens';
import { Button } from './ui';

// A custom confirm dialog rather than the RN Alert API: react-native-web's
// Alert.alert() is a no-op stub, so it would silently do nothing on web.
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityRole="button" accessibilityLabel="Dismiss" />
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Button title={cancelLabel} variant="ghost" onPress={onCancel} style={{ flex: 1 }} />
            <Button title={confirmLabel} variant="destructive" onPress={onConfirm} style={{ flex: 1 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    // Paper, not `bg` — the dialog floats above the darkened desk, so taking the
    // desk's own colour would make it read as a slab of the surface behind it.
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: 20,
    gap: 14,
    ...shadows.md,
  },
  title: { fontFamily: fonts.heading, fontSize: 20, color: colors.text },
  message: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.neutral700 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 4 },
});
