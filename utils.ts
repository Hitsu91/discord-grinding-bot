export function shuffleArray<T>(array: T[]): T[] {
  array.sort((_, __) => (Math.random() > 0.5 ? 1 : -1));
  return array;
}
