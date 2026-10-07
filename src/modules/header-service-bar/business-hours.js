// Explicit Slovak timezone also handles summer/winter time independently of
// the visitor's device timezone. Hours are Mon–Fri, inclusive 08:00 to <16:00.
const localTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Bratislava',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export function isBusinessOpen(date = new Date()) {
  const parts = Object.fromEntries(localTime.formatToParts(date).map(({ type, value }) => [type, value]));
  const weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(parts.weekday);
  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  return weekday && minutes >= 8 * 60 && minutes < 16 * 60;
}
