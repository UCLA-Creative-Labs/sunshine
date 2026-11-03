export function makeLocalDate(value: string) {
  const dateOnly = value.slice(0, 10);
  return new Date(dateOnly + "T00:00:00").toISOString();
}