export function getWeddingCountdown(weddingDateStr: string | null | undefined) {
  if (!weddingDateStr) {
    return { status: 'unknown' as const, daysLeft: null };
  }
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const weddingDate = new Date(weddingDateStr);
  const weddingMidnight = new Date(weddingDate.getFullYear(), weddingDate.getMonth(), weddingDate.getDate());
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.round((weddingMidnight.getTime() - todayMidnight.getTime()) / msPerDay);

  if (diffDays < 0) return { status: 'past' as const, daysLeft: 0 };
  if (diffDays === 0) return { status: 'today' as const, daysLeft: 0 };
  return { status: 'upcoming' as const, daysLeft: diffDays };
}
