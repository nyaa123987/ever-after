export const TASK_CATALOG: { group: string; count: number }[] = [
  { group: 'TaskGroup1', count: 7 },
  { group: 'TaskGroup2', count: 7 },
  { group: 'TaskGroup3', count: 7 },
  { group: 'TaskGroup4', count: 4 },
  { group: 'TaskGroup5', count: 6 },
  { group: 'TaskGroup6', count: 6 },
];

export const TOTAL_TASK_COUNT = TASK_CATALOG.reduce((sum, g) => sum + g.count, 0);

export function allTaskKeys(): string[] {
  const keys: string[] = [];
  for (const { group, count } of TASK_CATALOG) {
    for (let i = 1; i <= count; i++) keys.push(`${group}-${i}`);
  }
  return keys;
}

export function countCompleted(completions: Record<string, boolean>): number {
  return allTaskKeys().filter((key) => completions[key]).length;
}
