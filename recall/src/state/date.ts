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
