// A calendar-day key in the device's local timezone, used to tell whether a
// study session happened "today" for streak purposes — not a UTC/ISO date,
// since that would flip at the wrong hour for the user.
export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function todayKey(): string {
  return dayKey(new Date());
}

export function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dayKey(d);
}

export interface CalendarDay {
  date: number;
  dayKey: string;
  isToday: boolean;
}

/** A Sunday-first grid of the given month, padded with `null` so every row
 * has 7 columns — what a calendar view renders directly. */
export function monthGrid(year: number, month: number): (CalendarDay | null)[] {
  const today = todayKey();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (CalendarDay | null)[] = Array.from({ length: firstWeekday }, () => null);
  for (let date = 1; date <= daysInMonth; date++) {
    const key = `${year}-${month + 1}-${date}`;
    cells.push({ date, dayKey: key, isToday: key === today });
  }
  return cells;
}
