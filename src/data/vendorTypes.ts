export type Vendor = {
  id: number;
  name: string;
  description: string;
  offerings: string;
  location: string;
  contact: string;
  image?: string;
  priceTier: 'budget' | 'mid' | 'premium';
  estimatedCost: number;
  priceRange: string;
};

export const PRICING_DISCLAIMER =
  'Prices shown are estimates for planning purposes only — always confirm current rates directly with the vendor.';
