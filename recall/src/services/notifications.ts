import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { randomInt } from '../state/shuffle';
import { Deck, DeckReminders } from '../state/types';

// How many upcoming reminders to keep queued per deck. Each one is a
// one-shot notification (not a repeating trigger) because we want its body
// to show an actual card front, picked fresh each time we top up the queue —
// a repeating trigger can't vary its content per firing. Kept modest per
// deck since several decks can each have their own schedule running at once.
const QUEUE_SIZE_PER_DECK = 6;

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

export async function cancelReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

function randomCard(deck: Deck) {
  return deck.cards[Math.floor(Math.random() * deck.cards.length)];
}

/** The gaps (in minutes) between each queued firing for one deck. Fixed mode
 * repeats the same gap; random mode redraws it every time so the cadence
 * doesn't become predictable. */
function gapsForDeck(mode: DeckReminders[string]): number[] {
  const gaps: number[] = [];
  for (let i = 0; i < QUEUE_SIZE_PER_DECK; i++) {
    if (mode.type === 'fixed') gaps.push(mode.minutes);
    else if (mode.type === 'random') gaps.push(randomInt(mode.minMinutes, mode.maxMinutes));
  }
  return gaps;
}

/** Replaces all queued reminders with a fresh batch built from each deck's
 * own schedule — a deck can be off, on a fixed cadence, or firing at a
 * random gap each time. */
export async function scheduleReminders(decks: Deck[], reminders: DeckReminders) {
  await cancelReminders();

  const active = decks.filter((d) => d.cards.length > 0 && (reminders[d.id]?.type ?? 'off') !== 'off');
  if (active.length === 0) return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Study reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  for (const deck of active) {
    const mode = reminders[deck.id];
    if (!mode || mode.type === 'off') continue;
    let elapsedMinutes = 0;
    for (const gap of gapsForDeck(mode)) {
      elapsedMinutes += gap;
      const card = randomCard(deck);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: card.front,
          body: `Tap to remember the answer — ${deck.name}`,
          data: { deckId: deck.id, cardId: card.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: elapsedMinutes * 60,
          channelId: Platform.OS === 'android' ? 'reminders' : undefined,
        },
      });
    }
  }
}
