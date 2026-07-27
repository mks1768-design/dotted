import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { generateId } from '../state/id';
import { Note } from '../state/types';

const BACKUP_VERSION = 1;

type BackupPhoto = { mimeType: string; base64: string };
type BackupNote = Omit<Note, 'photoUri'> & { photo: BackupPhoto | null };
type Backup = { app: 'dotted'; version: number; exportedAt: number; notes: BackupNote[] };

function guessMimeType(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

function extensionFor(mimeType: string): string {
  if (mimeType.includes('png')) return 'png';
  if (mimeType.includes('webp')) return 'webp';
  return 'jpg';
}

// Photos live as local file/blob URIs, which aren't portable across devices
// or app reinstalls — embed the actual bytes so a backup is self-contained.
async function readPhotoAsBase64(uri: string): Promise<BackupPhoto | null> {
  try {
    if (Platform.OS === 'web') {
      const res = await fetch(uri);
      const blob = await res.blob();
      const dataUri: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Could not read photo'));
        reader.onload = () => resolve(String(reader.result));
        reader.readAsDataURL(blob);
      });
      const match = dataUri.match(/^data:(.*?);base64,(.*)$/);
      if (!match) return null;
      return { mimeType: match[1] || blob.type || 'image/jpeg', base64: match[2] };
    }
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
    return { mimeType: guessMimeType(uri), base64 };
  } catch {
    return null; // Better to lose one photo than fail the whole export.
  }
}

async function writePhotoFromBase64(photo: BackupPhoto, noteId: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return `data:${photo.mimeType};base64,${photo.base64}`;
    }
    const dir = FileSystem.cacheDirectory ?? '';
    const uri = `${dir}dotted-import-${noteId}.${extensionFor(photo.mimeType)}`;
    await FileSystem.writeAsStringAsync(uri, photo.base64, { encoding: 'base64' });
    return uri;
  } catch {
    return null;
  }
}

function backupFileName(): string {
  return `dotted-backup-${new Date().toISOString().slice(0, 10)}.json`;
}

export type ExportResult = { ok: true } | { ok: false; error: string };

export async function exportBackup(notes: Note[]): Promise<ExportResult> {
  if (notes.length === 0) return { ok: false, error: 'No notes to export yet.' };

  try {
    const backupNotes: BackupNote[] = await Promise.all(
      notes.map(async ({ photoUri, ...rest }) => ({
        ...rest,
        photo: photoUri ? await readPhotoAsBase64(photoUri) : null,
      }))
    );
    const backup: Backup = { app: 'dotted', version: BACKUP_VERSION, exportedAt: Date.now(), notes: backupNotes };
    const json = JSON.stringify(backup, null, 2);
    const filename = backupFileName();

    if (Platform.OS === 'web') {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return { ok: true };
    }

    const uri = `${FileSystem.cacheDirectory ?? ''}${filename}`;
    await FileSystem.writeAsStringAsync(uri, json, { encoding: 'utf8' });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: 'application/json', dialogTitle: 'Save your dotted backup' });
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Export failed.' };
  }
}

export type ImportResult = { ok: true; notes: Note[] } | { ok: false; canceled: true } | { ok: false; error: string };

export async function importBackup(): Promise<ImportResult> {
  let picked;
  try {
    picked = await DocumentPicker.getDocumentAsync({ type: 'application/json', copyToCacheDirectory: true });
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Could not open the file picker.' };
  }
  if (picked.canceled) return { ok: false, canceled: true };
  const asset = picked.assets?.[0];
  if (!asset) return { ok: false, error: 'No file selected.' };

  try {
    const text =
      Platform.OS === 'web' && asset.file ? await asset.file.text() : await FileSystem.readAsStringAsync(asset.uri, { encoding: 'utf8' });

    const parsed = JSON.parse(text);
    if (parsed?.app !== 'dotted' || !Array.isArray(parsed?.notes)) {
      return { ok: false, error: 'That file is not a dotted backup.' };
    }

    const notes: Note[] = await Promise.all(
      parsed.notes.map(async (n: Partial<BackupNote> & { photo?: BackupPhoto | null }) => {
        const id = generateId();
        const photoUri = n.photo ? await writePhotoFromBase64(n.photo, id) : null;
        return {
          id,
          title: n.title ?? 'Untitled',
          snippet: n.snippet ?? '',
          createdAt: typeof n.createdAt === 'number' ? n.createdAt : Date.now(),
          body: n.body ?? '',
          kind: n.kind ?? 'write',
          color: n.color ?? (photoUri ? 'photo' : 'bg'),
          photoUri,
        };
      })
    );

    return { ok: true, notes };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Couldn't read that file — is it a dotted backup?" };
  }
}
