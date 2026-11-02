export type HistoryEntry = { year: number; items: readonly string[] };

/** Sort whole entries together; never reorder the source data in place. */
export function chronological<T extends { year: number }>(entries: readonly T[]): T[] {
  return [...entries].sort((a, b) => a.year - b.year);
}
