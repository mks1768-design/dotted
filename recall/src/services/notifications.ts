import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Deck } from '../state/types';

// How many upcoming reminders to keep queued at once. Each one is a
// one-shot notification (not a repeating trigger) because we want its body
// to show an actual card front, picked fresh each time we top up the queue —
// a repeating trigger can't vary its content per firing.
const QUEUE_SIZE = 12;

export const REMINDER_CATEGORY = 'recall-reminder';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

function pickRandomCard(decks: Deck[]) {
  const pool = decks.flatMap((d) => d.cards.map((c) => ({ deckId: d.id, card: c })));
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function cancelReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/** Replaces any queued reminders with a fresh batch spaced `intervalMinutes`
 * apart, each showing a different random card's front. */
export async function scheduleReminders(decks: Deck[], intervalMinutes: number) {
  await cancelReminders();
  const decksWithCards = decks.filter((d) => d.cards.length > 0);
  if (decksWithCards.length === 0) return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Study reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  for (let i = 1; i <= QUEUE_SIZE; i++) {
    const picked = pickRandomCard(decksWithCards);
    if (!picked) break;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: picked.card.front,
        body: 'Tap to remember the answer',
        data: { deckId: picked.deckId, cardId: picked.card.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: intervalMinutes * 60 * i,
        channelId: Platform.OS === 'android' ? 'reminders' : undefined,
      },
    });
  }
}
