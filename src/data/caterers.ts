import { Vendor } from './vendorTypes';

export const caterers: Vendor[] = [
  { id: 1, name: 'Delicious Bites Catering', description: 'Buffet-style catering for weddings and events.', offerings: 'Buffets, plated dinners, canapés, desserts', location: 'Harare, Zimbabwe', contact: 'info@deliciousbites.co.zw', priceTier: 'mid', estimatedCost: 1200, priceRange: '$900 - $1,800' },
  { id: 2, name: 'Sweet Moments', description: 'Wedding cakes and dessert tables.', offerings: 'Custom cakes, cupcakes, dessert tables', location: 'Borrowdale, Harare', contact: 'sweetmoments@gmail.com', priceTier: 'budget', estimatedCost: 650, priceRange: '$500 - $900' },
  { id: 3, name: 'Flavours Catering', description: 'Professional catering services for small and large weddings.', offerings: 'Buffets, cocktail snacks, beverage services', location: 'Mount Pleasant, Harare', contact: 'contact@flavours.co.zw', priceTier: 'premium', estimatedCost: 2400, priceRange: '$1,800 - $3,500' },
];
