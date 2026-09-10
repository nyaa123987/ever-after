export const CATEGORY_BUDGET_SHARE: Record<string, number> = {
  venues: 0.2,
  caterers: 0.2,
  'wedding-planners': 0.1,
  photographers: 0.07,
  videographers: 0.05,
  'bridal-wear': 0.05,
  'groom-wear': 0.03,
  jewelry: 0.04,
  'bridal-shoes': 0.01,
  'groom-shoes': 0.01,
  florists: 0.05,
  musicians: 0.04,
  djs: 0.03,
  'cake-designers': 0.02,
  invitations: 0.02,
  beauticians: 0.03,
  'rental-services': 0.05,
};

export function categoryBudget(totalBudget: number | null | undefined, category: string) {
  if (!totalBudget || totalBudget <= 0) return null;
  const share = CATEGORY_BUDGET_SHARE[category] ?? 0.03;
  return Math.round(totalBudget * share);
}

export function fitForBudget(categoryAmount: number | null, estimatedCost: number) {
  if (categoryAmount === null) return 'neutral' as const;
  if (estimatedCost <= categoryAmount * 1.1) return 'fits' as const;
  if (estimatedCost <= categoryAmount * 1.6) return 'stretch' as const;
  return 'over' as const;
}

export function formatUSD(amount: number) {
  return `$${amount.toLocaleString('en-US')}`;
}
